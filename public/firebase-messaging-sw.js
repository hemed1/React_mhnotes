// Listen for push notifications sent from Firebase Cloud Messaging
self.addEventListener('push', function(event) 
{
  if (event.data) 
  {
    try 
    {
      const payload = event.data.json();
      console.log('Background message received: ', payload);

      // Extract the notification details from the FCM payload
      const title = payload.notification?.title || '⏰ Reminder!';
      const options = {
        body: payload.notification?.body || 'You have a pending notification.',
        icon: '/logo192.png', // Make sure this file exists in your public folder
        badge: '/logo192.png',
        //vibrate:,
        data: {
          url: self.location.origin // Opens your website when clicked
        }
      };

      event.waitUntil(self.registration.showNotification(title, options));
    } 
    catch (e) 
    {
      console.error('Error parsing push data:', e);
    }
  }
});

// Optional: Open the app when the user clicks the notification
self.addEventListener('notificationclick', function(event) 
{
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});






// //** global firebase */
// importScripts("https://gstatic.com");
// importScripts("https://gstatic.com");

// // Initialize Firebase inside the worker context
// firebase.initializeApp(
//   {
//       apiKey: "AIzaSyCGqo9-7I5lgpAfCQfahtyxTjsXgAWdfvg",
//       authDomain: "meirhemed-mhnotes.firebaseapp.com",
//       databaseURL: "https://meirhemed-mhnotes-default-rtdb.firebaseio.com",
//       projectId: "meirhemed-mhnotes",
//       storageBucket: "meirhemed-mhnotes.firebasestorage.app",
//       messagingSenderId: "257753299659",
//       appId: "1:257753299659:ios:d273d009d5040c2ae0f94e",
//       measurementId: "G-829HMJG495",
//       email: "hemedmeir@gmail.com"
//    });

// const messaging = firebase.messaging();

// // Handle background messages
// messaging.onBackgroundMessage((payload) => {
//   console.log("[firebase-messaging-sw.js] Received background message ", payload);
  
//   const notificationTitle = payload.notification?.title || "Reminder!";
//   const notificationOptions = {
//     body: payload.notification?.body || "You have a new message.",
//     icon: "/logo192.png" 
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });