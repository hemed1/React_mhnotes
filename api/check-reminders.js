const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getDatabase } = require("firebase-admin/database");
const { getMessaging } = require("firebase-admin/messaging");

// Load credentials safely from Vercel Environment Variables
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

const databaseUrls = process.env.FIREBASE_DATABASE_URLS.split(",");


// Prevent re-initializing Firebase on warm serverless invocations
if (!getApps().length) 
{
  initializeApp(
  {
    credential: cert(serviceAccount),
    //databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

export default async function handler(req, res) 
{

   // Optional security check so random visitors cannot trigger your cron endpoint
  if (process.env.CRON_SECRET && req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) 
  {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Read comma-separated database URLs from Vercel (or fall back to single URL)
  const rawUrls =
    process.env.FIREBASE_DATABASE_URLS ||
    process.env.FIREBASE_DATABASE_URL ||
    "";

  const databaseUrls = rawUrls
    .split(",")
    .map((url) => url.trim())

  if (databaseUrls.length === 0) 
  {
    return res.status(500).json({ error: "No database URLs configured." });
  }

  const now = Date.now();
  const results = [];
//   const db = getDatabase();
//   const remindersRef = db.ref("TBL_Reminders");

  for (const url of databaseUrls) 
  {
      try 
      {
         const db = getDatabase(url);
         const remindersRef = db.ref("TBL_Reminders");

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

            const message = 
            {
               notification: 
               {
                  title: "⏰ תזכורת!",
                  body: reminder.text
               },
               data: 
               {
                  title: "⏰ תזכורת!",
                  body: reminder.text,
                  url: "/"
               },
               token: reminder.token
            };

            await getMessaging().send(message);

            await remindersRef.child(id).remove();
            sentCount++;
         }
         
         results.push({ url, sent: sentCount });
         //return res.status(200).json({ message: `Sent ${sentCount} reminders.` });
      } 
      catch (error) 
      {
         console.error("Cron error:", error);
         return res.status(500).json({ error: error.message });
      }
   }

   return res.status(200);
}
