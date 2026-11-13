const { initializeApp, cert, getApps, getApp } = require("firebase-admin/app");
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

    if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
      return res
        .status(500)
        .json({ error: "Missing FIREBASE_SERVICE_ACCOUNT environment variable." });
    }

    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

    // 2. Initialize Firebase Admin once
    const app = !getApps().length
      ? initializeApp({ credential: cert(serviceAccount) })
      : getApp();

    // 3. Get a single OAuth2 access token for fast REST API calls
    const tokenObj = await app.options.credential.getAccessToken();
    const accessToken = tokenObj.access_token;

    const rawUrls =
      process.env.FIREBASE_DATABASE_URLS ||
      process.env.FIREBASE_DATABASE_URL ||
      "";

    const databaseUrls = rawUrls
      .split(",")
      .map((url) => url.trim().replace(/\/$/, ""))
      .filter(Boolean);

    if (databaseUrls.length === 0) {
      return res.status(500).json({ error: "No database URLs configured." });
    }

    const now = Date.now();

    // 4. Query all 5 databases in parallel (no hanging WebSockets)
    const results = await Promise.all(
      databaseUrls.map(async (url) => {
        try {
          const queryUrl = `${url}/TBL_Reminders.json?orderBy="scheduledTime"&endAt=${now}&access_token=${accessToken}`;
          const response = await fetch(queryUrl);
          const data = await response.json();

          if (!response.ok || (data && data.error)) {
            return { url, error: data?.error || `HTTP ${response.status}` };
          }

          if (!data || Object.keys(data).length === 0) {
            return { url, sent: 0 };
          }

          let sentCount = 0;

          for (const id of Object.keys(data)) {
            const reminder = data[id];
            if (!reminder || !reminder.token) continue;

            await getMessaging(app).send({
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

            // Delete the processed reminder via REST DELETE
            await fetch(`${url}/TBL_Reminders/${id}.json?access_token=${accessToken}`, {
              method: "DELETE",
            });

            sentCount++;
          }

          return { url, sent: sentCount };
        } catch (err) {
          return { url, error: err.message };
        }
      })
    );

    return res.status(200).json({ checkedAt: now, results });
  } catch (error) {
    console.error("Fatal handler error:", error);
    return res.status(500).json({ error: error.message });
  }
};
