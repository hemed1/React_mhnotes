
const { initializeApp, cert, getApps, getApp, deleteApp } = require("firebase-admin/app");
const { getDatabase } = require("firebase-admin/database");
const { getMessaging } = require("firebase-admin/messaging");



module.exports = async function handler(req, res) 
{
  
  //return res.status(401).json({ error: "Unauthorized" });

  try 
  {
    // 1. Verify secret password header
    if (process.env.CRON_SECRET && req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) 
    {
      return res.status(400).json({ error: "Unauthorized" });
    }
    console.log("process.env.CRON_SECRET: " + process.env.CRON_SECRET);

    // Verify environment variable exists
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) 
    {
      return res.status(500).json({ error: "Missing FIREBASE_SERVICE_ACCOUNT environment variable." });
    }


    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    //console.log("process.env.FIREBASE_SERVICE_ACCOUNT: " + process.env.FIREBASE_SERVICE_ACCOUNT);


    const rawUrls = process.env.FIREBASE_DATABASE_URLS || process.env.FIREBASE_DATABASE_URL || "";

    const databaseUrls = rawUrls.split(";").map((url) => url.trim()).filter(Boolean);
    //console.log("databaseUrls: " + databaseUrls[0] + '\n' + databaseUrls[1]+ '\n');
    const databaseUrlsClean = databaseUrls.map((item) => item.split("?")[0].replace(/\/$/, ""));
    console.log("databaseUrlsClean: " + databaseUrlsClean[0] + '\n' + databaseUrlsClean[1]+ '\n');
    const serviceAccounts   = databaseUrls.map((item) => JSON.parse(item.split("?")[1]));
    console.log("serviceAccounts: " + serviceAccounts[0] + '\n' + serviceAccounts[1] + '\n');
    var firebaseConfigs   = databaseUrls.map((item) => item.split("?")[2]);
    console.log("firebaseConfigs: " + firebaseConfigs[0] + '\n' + firebaseConfigs[1]+ '\n');
    firebaseConfigs = firebaseConfigs.map((item) => JSON.parse(item));
    console.log("firebaseConfigs+Json: " + firebaseConfigs[0] + '\n' + firebaseConfigs[1]+ '\n');

    //console.log("databaseUrlsClean: " + databaseUrlsClean[0] + "\n" + "serviceAccounts: " + serviceAccounts[0] + "\n" + "firebaseConfigs: " + firebaseConfigs[0]);


    if (databaseUrls.length === 0) 
    {
      return res.status(500).json({ error: "No database URLs configured." });
    }


     //** Open all Apps */
    console.log('Open all Apps...');
    var apps = [];
    for (let i = 0; i < databaseUrls.length; i++) 
    {
      try
      {
        // const serviceAccount = 
        // {
        //   credential: cert(serviceAccounts[i]),
        //   databaseURL: databaseUrlsClean[i],
        // }
        /// Initialize Firebase
        //const app = initializeApp(serviceAccount);
        const firebaseConfig = firebaseConfigs[i];
        const app = initializeApp(firebaseConfig, "secondaryApp"+i.toString());
        //const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp(firebaseConfig.authDomain);
        console.log('Open DB'+ (i+1).toString() + "   DB Name: " + firebaseConfig.authDomain + " - OK");
        
        // apps.push(app);
        // await deleteApp(app)
        //   .then(() => 
        //   {
        //       //console.debug("Firebase app deleted successfully");
        //   })
        //   .catch((error) => 
        //   {
        //     console.log("Error deleting app:", error);
        //   });
      }
      catch (dbError) 
      {
        console.log('Error Open App' + (i+1).toString() + dbError.message);
        return res.status(300).json({ error: "No database URLs configured." });
      }
    }
    console.log('All Apps are opened');





    var results = [];
    const now = Date.now();
    
    // 5. Loop on All Apps, Url's
    for (let i = 0; i < databaseUrlsClean.length; i++) 
    {
      const url = databaseUrlsClean[i];
      
      try 
      {
        
        console.log("Open in loop - App"+ (i+1).toString());
        //const app = getApps().length === 0 ? initializeApp(firebaseConfigs[i]) : getApp(firebaseConfigs[i].authDomain);
        const app = apps[i];
        //const app = initializeApp(firebaseConfigs[i]); 
        const db = getDatabase(app);
        console.log("Open in loop - DB"+ (i+1).toString());

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

          console.log("Sending message");

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
          
          await getMessaging(app).send(message);

          await remindersRef.child(id).remove();
          sentCount++;
        }

        console.log("Finish to send messages, for db: " + firebaseConfigs[i].projectId);

        //**Close Appp */
        // if (getApps().length > 0)
        // {
        //   const appTmp = getApps()[0];
        //   await deleteApp(appTmp)
        //   .then(() => 
        //   {
        //       //console.debug("Firebase app deleted successfully");
        //   })
        //   .catch((error) => 
        //   {
        //     console.log("Error deleting app:", error);
        //   });
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
    console.log('Disposing and Close Apps...');
    for (let i = 0; i < databaseUrlsClean.length; i++) 
    {
      await deleteApp(apps[i])
        .catch((error) => 
        {
          console.log("Error deleting app:", error);
        });
      apps[i] = null;
    }
    console.log('Apps Disposing and Closed OK');

    return res.status(200).json({ checkedAt: now, results });
  } 
  
  catch (error) 
  {
    console.error("Fatal handler error:", error);
    return res.status(500).json({ error: error.message });
  }


};















// const { getDatabase } = require("firebase-admin/database");
// const { initializeApp, cert, getApps, getApp, deleteApp } = require("firebase-admin/app");
// const { getMessaging } = require("firebase-admin/messaging");



// module.exports = async function handler(req, res) 
// {
  
//   try 
//   {
//     if (process.env.CRON_SECRET && req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) 
//     {
//       return res.status(401).json({ error: "Unauthorized" });
//     }

//     if (!process.env.FIREBASE_SERVICE_ACCOUNT) 
//     {
//       return res.status(500).json({ error: "Missing FIREBASE_SERVICE_ACCOUNT environment variable." });
//     }

//     //const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
//     //
//     // const app = !getApps().length
//     //   ? initializeApp({ credential: cert(serviceAccount) })
//     //   : getApp();
//     //
//     // const tokenObj = await app.options.credential.getAccessToken();
//     // const accessToken = tokenObj.access_token;

//     const rawUrls = process.env.FIREBASE_DATABASE_URLS || process.env.FIREBASE_DATABASE_URL || "";

//     const databaseUrls = rawUrls.split("@").map((url) => url.trim()).filter(Boolean);
//     console.log("databaseUrls: " + databaseUrls[0] + '\n' + databaseUrls[1]+ '\n');
//     const databaseUrlsClean = databaseUrls.map((item) => item.split("?")[0].replace(/\/$/, ""));
//     console.log("databaseUrlsClean: " + databaseUrlsClean[0] + '\n' + databaseUrlsClean[1]+ '\n');
//     const serviceAccounts   = databaseUrls.map((item) => item.split("?")[1]);
//     console.log("serviceAccounts: " + serviceAccounts[0] + '\n' + serviceAccounts[1]+ '\n');
//     var firebaseConfigs   = databaseUrls.map((item) => item.split("?")[2]);
//     console.log("firebaseConfigs: " + firebaseConfigs[0] + '\n' + firebaseConfigs[1]+ '\n');
//     firebaseConfigs = firebaseConfigs.map((item) => JSON.parse(item));
//     console.log("firebaseConfigs+Json: " + firebaseConfigs[0] + '\n' + firebaseConfigs[1]+ '\n');

//     console.log("databaseUrlsClean: " + databaseUrlsClean[0] + '\n' + "serviceAccounts: " + serviceAccounts[0] + '\n' + "firebaseConfigs: " + firebaseConfigs[0]);


//     if (databaseUrls.length === 0) 
//     {
//       return res.status(500).json({ error: "No database URLs configured." });
//     }

//     //** Open all Apps */
//     console.log('Open all Apps...');
//     var apps = [];
//     for (let i = 0; i < databaseUrls.length; i++) 
//     {
//       try
//       {
//         // const serviceAccount = 
//         // {
//         //   credential: cert(serviceAccounts[i]),
//         //   databaseURL: databaseUrlsClean[i],
//         // }
//         /// Initialize Firebase
//         //const app = initializeApp(serviceAccount);
//         const firebaseConfig = firebaseConfigs[i];
//         const app = initializeApp(firebaseConfig);
//         //app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
//         console.log('Open DB'+ (i+1).toString() + ": OK");
//         apps.push(app);
//         await deleteApp(app)
//           .then(() => 
//           {
//               //console.debug("Firebase app deleted successfully");
//           })
//           .catch((error) => 
//           {
//             console.log("Error deleting app:", error);
//           });

//       }
//       catch (dbError) 
//       {
//         console.log('Error Open App' + (i+1).toString() + dbError.message);
//         return res.status(300).json({ error: "No database URLs configured." });
//       }
//     }
//     console.log('All Apps are opened');




//     const now = Date.now();

//     const results = await Promise.all(
//       databaseUrlsClean.map(async (rawUrl, index) => 
//       {

//         const tokenObj = await apps[index].options.credential.getAccessToken();
//         const accessToken = tokenObj.access_token;
//         // Separate the domain from "?auth=SECRET" cleanly
//         //const [domainPart, queryPart] = rawUrl.split("?");
//         const baseUrl   = rawUrl;       //domainPart.replace(/\/$/, "");
//         const authParam = serviceAccounts[index] ? serviceAccounts[index] : `access_token=${accessToken}`;;         // queryPart ? queryPart : `access_token=${accessToken}`;

//         console.log("baseUrl: " + baseUrl, "authParam: " + authParam);

//         try 
//         {
//           const queryUrl = `${baseUrl}/TBL_Reminders.json?orderBy="scheduledTime"&endAt=${now}&${authParam}`;
//           const response = await fetch(queryUrl);
//           const data = await response.json();

//           if (!response.ok || (data && data.error)) 
//           {
//             return { url: baseUrl, error: data?.error || `HTTP ${response.status}` };
//           }

//           if (!data || Object.keys(data).length === 0) 
//           {
//             return { url: baseUrl, sent: 0 };
//           }

//           let sentCount = 0;

//           for (const id of Object.keys(data)) 
//           {
//             const reminder = data[id];
//             if (!reminder || !reminder.token) continue;

//             await getMessaging(apps[index]).send({
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

//   } 
//   catch (error) 
//   {
//     console.error("Fatal handler error:", error);
//     return res.status(500).json({ error: error.message });
//   }
// };
