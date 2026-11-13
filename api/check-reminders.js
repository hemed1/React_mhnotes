const { initializeApp, cert, getApps, getApp } = require("firebase-admin/app");
const { getDatabase } = require("firebase-admin/database");
const { getMessaging } = require("firebase-admin/messaging");

module.exports = async function handler(req, res) {
  try {
    // 1. Verify secret password header
    if (
      process.env.CRON_SECRET &&
      req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 2. Verify environment variable exists
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
      return res
        .status(500)
        .json({ error: "Missing FIREBASE_SERVICE_ACCOUNT environment variable." });
    }

    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

    // 3. Default app for sending FCM push notifications
    const defaultApp = !getApps().some((a) => a.name === "[DEFAULT]")
      ? initializeApp({ credential: cert(serviceAccount) })
      : getApp();

    // 4. Read comma-separated database URLs from Vercel
    const rawUrls =
      process.env.FIREBASE_DATABASE_URLS ||
      process.env.FIREBASE_DATABASE_URL ||
      "";

    const databaseUrls = rawUrls
      .split(",")
      .map((url) => url.trim())
      .filter(Boolean);

    if (databaseUrls.length === 0) {
      return res.status(500).json({ error: "No database URLs configured." });
    }

    const now = Date.now();
    const results = [];

    for (let i = 0; i < databaseUrls.length; i++) {
      const url = databaseUrls[i];
      const appName = `db-app-${i}`;

      try {
        // Create or reuse a named app bound directly to this specific databaseURL
        const dbApp = !getApps().some((a) => a.name === appName)
          ? initializeApp(
              {
                credential: cert(serviceAccount),
                databaseURL: url,
              },
              appName
            )
          : getApp(appName);

        const db = getDatabase(dbApp);
        const remindersRef = db.ref("TBL_Reminders");

        const snapshot = await remindersRef
          .orderByChild("scheduledTime")
          .endAt(now)
          .once("value");

        if (!snapshot.exists()) {
          results.push({ url, sent: 0 });
          continue;
        }

        const data = snapshot.val();
        let sentCount = 0;

        for (const id in data) {
          const reminder = data[id];

          await getMessaging(defaultApp).send({
            notification: {
              title: "⏰ תזכורת!",
              body: reminder.text,
            },
            data: {
              title: "⏰ תזכורת!",
              body: reminder.text,
              url: "/",
            },
            token: reminder.token,
          });

          await remindersRef.child(id).remove();
          sentCount++;
        }

        results.push({ url, sent: sentCount });
      } 
      
      catch (dbError) 
      {
        console.error(`Cron error for ${url}:`, dbError);
        results.push({ url, error: dbError.message });
      }
    }

    return res.status(200).json({ checkedAt: now, results });
  } 
  
  catch (error) {
    console.error("Fatal handler error:", error);
    return res.status(500).json({ error: error.message });
  }
};
