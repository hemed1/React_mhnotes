// 1. Import the core app initialization and cert directly
const { initializeApp, cert } = require("firebase-admin/app");

// 2. Import the standalone database module
const { getDatabase } = require("firebase-admin/database");

// 3. Import the standalone messaging module
const { getMessaging } = require("firebase-admin/messaging");

const cron = require("node-cron");
const serviceAccount = require("./serviceAccountKey.json");

// 4. Initialize the app correctly
initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://meirhemed-mhnotes-default-rtdb.firebaseio.com" // ⚠️ Replace with your actual DB URL
});

// 5. Secure the database instance using the modern function
const db = getDatabase();

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
  console.log("Checking for due reminders...");
  const now = Date.now();


  try 
  {
    // Look up the database reference
    const remindersRef = db.ref("TBL_Reminders");
    
    // Convert string dates or string numbers safely into milliseconds
    //const dueTime = new Date(reminder.scheduledTime).getTime();

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
      console.log(`Record ${id} -> scheduledTime:`, reminder.scheduledTime, typeof reminder.scheduledTime);

      const message = 
      {
        notification: 
        {
          title: "⏰ Reminder Notification!",
          body: reminder.text
        },
        data: 
        {
          title: "⏰ Reminder Notification!",
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
        //console.log(`Removed reminder ID ${id} from database.`);
      } 
      catch (sendError) 
      {
        console.error(`Failed to send notification for ID ${id}:`, sendError);
      }
    }
  } catch (error) {
    console.error("Error running cron reminder check:", error);
  }
});
