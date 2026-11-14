
const { initializeApp, cert, getApps, getApp, deleteApp } = require("firebase-admin/app");
const { getDatabase } = require("firebase-admin/database");
const { getMessaging } = require("firebase-admin/messaging");



module.exports = async function handler(req, res) 
{
  
  try 
  {
    // 1. Verify secret password header
    if (process.env.CRON_SECRET && req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) 
    {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Verify environment variable exists
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) 
    {
      return res.status(500).json({ error: "Missing FIREBASE_SERVICE_ACCOUNT environment variable." });
    }


    // 2. Read comma-separated serviceAccountsKeys from Vercel
    const rawServiceAccounts = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT).split(",");
    console.log("rawServiceAccounts: ");
    const serviceAccounts = rawServiceAccounts.map((item) => item.split("&")[0]);
    const firebaseConfigs = rawServiceAccounts.map((item) => item.split("&")[1]);

    if (serviceAccounts.length === 0)
    {
      return res.status(400).json({ error: "No serviceAccounts" });
    }

    // 3. Read comma-separated database URLs from Vercel
    const rawUrls = process.env.FIREBASE_DATABASE_URLS || process.env.FIREBASE_DATABASE_URL || "";

    // 4. Set the database Urls
    const databaseUrls = rawUrls.split(",").map((url) => url.trim()).filter(Boolean);

    if (databaseUrls.length === 0) 
    {
      return res.status(500).json({ error: "No database URLs configured." });
    }


    //** Open all Apps */
    console.lod('Open all Apps...');
    const results = [];
    var apps = [];
    for (let i = 0; i < databaseUrls.length; i++) 
    {
      try
      {
        const serviceAccount = 
        {
          credential: cert(serviceAccounts[i]),
          databaseURL: databaseUrls[i],
        }
        /// Initialize Firebase
        const app = initializeApp(serviceAccount);
        //const firebaseConfig = serviceAccounts[i];
        // const app = initializeApp(firebaseConfig);
        //app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
        apps.push(app);
      }
      catch (dbError) 
      {
        console.error(`Cron error for ${url}:`, dbError);
        results.push({ url, error: dbError.message });
      }
    }
    console.lod('All Apps are opened');


    const now = Date.now();
    
    // 5. Loop on All Apps, Url's
    for (let i = 0; i < databaseUrls.length; i++) 
    {
      const url = databaseUrls[i];
      
      try 
      {
        const db = getDatabase(apps[i]);
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
              body: reminder.text,
            },
            data: 
            {
              title: "⏰ תזכורת!",
              body: reminder.text,
              url: "/",
            },
            token: reminder.token,
          };

          await getMessaging(apps[i]).send(message);

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


    //** Dispose and Close Apps */
    console.lod('Disposing and Close Apps...');
    for (let i = 0; i < databaseUrls.length; i++) 
    {
      await deleteApp(apps[i])
        .catch((error) => 
        {
          console.log("Error deleting app:", error);
        });
      apps[i] = null;
    }
    console.lod('Apps Disposing and Closed OK');

    return res.status(200).json({ checkedAt: now, results });
  } 
  
  catch (error) 
  {
    console.error("Fatal handler error:", error);
    return res.status(500).json({ error: error.message });
  }


};
















// const { initializeApp, cert, getApps, getApp } = require("firebase-admin/app");
// const { getMessaging } = require("firebase-admin/messaging");



// module.exports = async function handler(req, res) 
// {
//   try {
//     if (
//       process.env.CRON_SECRET &&
//       req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`
//     ) {
//       return res.status(401).json({ error: "Unauthorized" });
//     }

//     if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
//       return res
//         .status(500)
//         .json({ error: "Missing FIREBASE_SERVICE_ACCOUNT environment variable." });
//     }

//     const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

//     const app = !getApps().length
//       ? initializeApp({ credential: cert(serviceAccount) })
//       : getApp();

//     const tokenObj = await app.options.credential.getAccessToken();
//     const accessToken = tokenObj.access_token;

//     const rawUrls =
//       process.env.FIREBASE_DATABASE_URLS ||
//       process.env.FIREBASE_DATABASE_URL ||
//       "";

//     const databaseUrls = rawUrls
//       .split(",")
//       .map((url) => url.trim())
//       .filter(Boolean);

//     if (databaseUrls.length === 0) 
//     {
//       return res.status(500).json({ error: "No database URLs configured." });
//     }



//     const now = Date.now();

//     const results = await Promise.all(
//       databaseUrls.map(async (rawUrl) => {
//         // Separate the domain from "?auth=SECRET" cleanly
//         const [domainPart, queryPart] = rawUrl.split("?");
//         const baseUrl = domainPart.replace(/\/$/, "");
//         const authParam = queryPart ? queryPart : `access_token=${accessToken}`;
//         console.log("baseUrl: " + baseUrl, "authParam: " + authParam);

//         try 
//         {
//           const queryUrl = `${baseUrl}/TBL_Reminders.json?orderBy="scheduledTime"&endAt=${now}&${authParam}`;
//           const response = await fetch(queryUrl);
//           const data = await response.json();

//           if (!response.ok || (data && data.error)) {
//             return { url: baseUrl, error: data?.error || `HTTP ${response.status}` };
//           }

//           if (!data || Object.keys(data).length === 0) {
//             return { url: baseUrl, sent: 0 };
//           }

//           let sentCount = 0;

//           for (const id of Object.keys(data)) {
//             const reminder = data[id];
//             if (!reminder || !reminder.token) continue;

//             await getMessaging(app).send({
//               notification: {
//                 title: "⏰ תזכורת!",
//                 body: reminder.text,
//               },
//               data: {
//                 title: "⏰ תזכורת!",
//                 body: reminder.text,
//                 url: "/",
//               },
//               token: reminder.token,
//             });

//             await fetch(`${baseUrl}/TBL_Reminders/${id}.json?${authParam}`, {
//               method: "DELETE",
//             });

//             sentCount++;
//           }

//           return { url: baseUrl, sent: sentCount };
//         } catch (err) {
//           return { url: baseUrl, error: err.message };
//         }
//       })
//     );

//     return res.status(200).json({ checkedAt: now, results });
//   } catch (error) {
//     console.error("Fatal handler error:", error);
//     return res.status(500).json({ error: error.message });
//   }
// };
