const { initializeApp, cert } = require("firebase-admin/app");
const { getMessaging } = require("firebase-admin/messaging");
const { getDatabase } = require("firebase-admin/database");
const cron = require("node-cron");
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase App
initializeApp({
  credential: cert(serviceAccount)
});

// Select the specific database instance you want to use
const db = getDatabase("https://meirhemed-mhnotes-default-rtdb.firebaseio.com");

console.log("Scheduler backend worker initialized successfully!");

cron.schedule("* * * * *", async () => {
  console.log("Checking for due reminders...");
  const now = Date.now();

  try {
    // Access the database reference safely
    const remindersRef = db.ref("reminders");
    
    const snapshot = await remindersRef
      .orderByChild("scheduledTime")
      .endAt(now)
      .once("value");

    if (!snapshot.exists()) {
      console.log("No pending reminders due at this time.");
      return;
    }

    const data = snapshot.val();
    
    for (const id in data) {
      const reminder = data[id];

      // Robust layout containing both notification configuration blocks
      const message = {
        notification: {
          title: "⏰ Reminder Notification!",
          body: reminder.text
        },
        data: {
          title: "⏰ Reminder Notification!",
          body: reminder.text,
          url: "/"
        },
        token: reminder.token
      };

      try {
        // FIXED: Using modern getMessaging().send() without the "admin." prefix
        const response = await getMessaging().send(message);
        console.log(`Notification sent successfully for ID ${id}:`, response);

        await remindersRef.child(id).remove();
        console.log(`Removed reminder ID ${id} from database.`);
      } catch (sendError) {
        console.error(`Failed to send notification for ID ${id}:`, sendError);
      }
    }
  } catch (error) {
    console.error("Error running cron reminder check:", error);
  }
});
