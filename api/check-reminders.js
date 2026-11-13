const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getDatabase } = require("firebase-admin/database");
const { getMessaging } = require("firebase-admin/messaging");




module.exports = async function handler(req, res) 
{

  try 
  {
    // 1. Optional security check
    if (process.env.CRON_SECRET && req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) 
    {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 2. Check that FIREBASE_SERVICE_ACCOUNT exists
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) 
   {
      return res.status(500).json({ error: "Missing FIREBASE_SERVICE_ACCOUNT environment variable." });
    }

    // 3. Initialize Firebase once inside try/catch so JSON errors are reported clearly
    if (!getApps().length) 
    {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      initializeApp({
        credential: cert(serviceAccount),
      });
    }

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

    for (const url of databaseUrls) 
    {
      try
      {
        const db = getDatabase(app, url);
        const remindersRef = db.ref("TBL_Reminders");

        //** Seraxhing Reminder Recoreds */
        const snapshot = await remindersRef.orderByChild("scheduledTime").endAt(now).once("value");

        if (!snapshot.exists()) 
        {
          results.push({ url, sent: 0 });
          continue;
        }

        const data = snapshot.val();
        let sentCount = 0;

        for (const id in data) 
        {
          const reminder = data[id];

          const message = {
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
          };

          await getMessaging().send(message);
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

    // 5. Always return 200 OK once all databases have been checked
    return res.status(200).json({ checkedAt: now, results });
  } 
  
  catch (error) 
  {
    console.error("Fatal handler error:", error);
    return res.status(500).json({ error: error.message });
  }
};
