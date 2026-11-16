// 1. Import the core app initialization and cert directly
const { initializeApp, cert } = require("firebase-admin/app");

// 2. Import the standalone database module
const { getDatabase } = require("firebase-admin/database");

// 3. Import the standalone messaging module
const { getMessaging } = require("firebase-admin/messaging");

const cron = require("node-cron");



// Read URL from terminal as outside parameter, or fall back to your default URL
const targetDbUrl = process.argv[2] || "https://meirhemed-mhnotes-default-rtdb.firebaseio.com";
// 1. Capture any URLs passed after "node server.js"
//const cliUrls = process.argv.slice(2) || "https://meirhemed-mhnotes-default-rtdb.firebaseio.com";
// 2. Use the terminal URLs if provided, otherwise use your default URL
// const databaseUrls =
//   cliUrls.length > 0
//     ? cliUrls
//     : ["https://aaa-mhnotes-default-rtdb.firebaseio.com"];

const databaseConfigFile = require("./dataBasesConfig.js");
console.log("Read file dataBasesConfig.js: ", databaseConfigFile);
const list = databaseConfigFile;      // databaseConfigFile.dataBasesConfigList;
databaseConfigs = Object.keys(list).map((key) => key);
console.log("Content of file dataBasesConfig.js: ", databaseConfigs);
const dbIndex = databaseConfigs.findIndex((item) => item.databaseURL === targetDbUrl);

const serviceAccount = require("./serviceAccountKey-"+(dbIndex.toString())+".json");
console.log("Will check on DB - " + targetDbUrl + " Find config index: " + dbIndex.toString());


// 4. Initialize the app correctly
const app = initializeApp({
              credential: cert(serviceAccount),
              databaseURL: targetDbUrl // ⚠️ Replace with your actual DB URL
            });


// How to run it dynamicly diffrent db from your terminal:
// # Check database 1
// node server.js https://aaa-mhnotes-default-rtdb.firebaseio.com
// # Check database 2
// node server.js https://another-db-name.firebaseio.com


// ** List all in Multiple Realtime Database URLs you want to monitor */
// const databaseUrls = [
//                         "https://meirhemed-mhnotes-default-rtdb.firebaseio.com",
//                         "https://second-db-mhnotes.firebaseio.com",
//                      ];
//
// // Initialize credentials once
// initializeApp({
//   credential: cert(serviceAccount),
// });



// 5. Secure the database instance using the modern function
const db = getDatabase(app);

console.log("Scheduler backend worker initialized successfully!");


//** How the node-cron Five Stars Work
// cron.schedule("* * * * *", async () => {
// The string "* * * * *" is a standard Cron expression. Each star represents a unit of time, and a single star (*) means "every":
// 	1	First * = Minute (0–59)
// 	2	Second * = Hour (0–23)
// 	3	Third * = Day of the month (1–31)
// 	4	Fourth * = Month (1–12)
// 	5	Fifth * = Day of the week (0–7)
// Because all five positions are set to *, your server runs the check at the start of every single minute.
//
// How to Change It to Every 5 Minutes
// To check the database every 5 minutes instead, change the first star to */5:
// // Runs every 5 minutes instead of every 1 minute
// cron.schedule("*/5 * * * *", async () => { */

cron.schedule("*/1 * * * *", async () => 
{
  const now = Date.now();
  console.log(/* new Date(now).toLocaleTimeString() *//* .substring(0, 16)  + " - " +*/ "Checking for due reminders...");

  //** In case of Multiple Realtime Databases */
  //for (const url of databaseUrls) {

    try 
    {
      // in case of Multiple Realtime Databases - Dynamically connect to each database URL */
      // const db = getDatabase(url);
      // const remindersRef = db.ref("TBL_Reminders");
      // console.log("Will check on DB - " + url);

     
     // Look up the database reference
      const remindersRef = db.ref("TBL_Reminders");

      const snapshot = await remindersRef.orderByChild("scheduledTime").endAt(now).once("value");
      // // Read all reminders directly to inspect what is inside
      // const snapshot = await remindersRef.once("value");

      if (!snapshot.exists()) 
      {
        //console.log("No pending reminders due at this time.");
        return;
      }

      const data = snapshot.val();
      
      for (const id in data) 
      {
        const reminder = data[id];
        console.log(`Record ${id} -> scheduledTime:`, reminder.scheduledTime);

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

        try 
        {
          // 6. Use getMessaging().send() instead of legacy admin module
          const response = await getMessaging().send(message);
          console.log(`Notification sent successfully for ID ${id}:`, response);

          await remindersRef.child(id).remove();
          console.log(`Removed reminder ID ${id} from database.`);
        } 
        catch (sendError) 
        {
          console.error(`Failed to send notification for ID ${id}:`, sendError);
        }
      }

    } 
    catch (error) 
    {
      console.error("Error running cron reminder check:", error);
    }

  //} //** In case of Multiple Realtime Databases */

}
);
