
// Listen for push notifications sent from Firebase Cloud Messaging
self.addEventListener("push", function (event) 
{

  if (!event.data) return;



  try 
  {
    const payload = event.data.json();
    console.log("Push message received in SW:", payload);

    const payloadData= payload.data || {};
    const objectID = String(payloadData.objectID ?? "0");
    const firebaseID = String(payloadData.firebaseID ?? "");


    const title = payload.notification?.title || payloadData.title || "⏰ תזכורת!";
    const options = 
    {
      body: payload.notification?.body || payloadData.body || "יש לך תזכורת למשימה",
      icon: "/note_small.png",
      badge: "/note_small.png",
      image: "/note_big.jpg",
      requireInteraction: true,
      silent: false,
      actions: 
      [
        { action: "open", title: "פתח משימה" },
        { action: "dismiss", title: "סגור" },
      ],
      data: 
      {
        url: payloadData.url || self.location.origin,
        objectID: objectID,
        firebaseID: firebaseID,
      },
    };

    const promiseChain = self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        // Forward the payload to any open React tab so it can play sound
        windowClients.forEach((client) => {
          client.postMessage({ type: "FOREGROUND_PUSH", payload });
        });

        // Show the OS notification banner
        return self.registration.showNotification(title, options);
      });

    event.waitUntil(promiseChain);
    
  } 
  catch (e) 
  {
    console.error("Error parsing push data:", e);
  }
});


// 5. Handle notification clicks
self.addEventListener("notificationclick", function (event) 
{
  let url = event.notification.data?.url || "/";
  //url += String(url).endsWith("/") ? "" : "/";
  const objectID = String(event.notification.data?.objectID ?? "0");
  const firebaseID = String(event.notification.data?.firebaseID ?? "");

  console.log(`When Click on notification - objectID: ${objectID} FirebaseID: ${firebaseID} Url: ${url}`);

  if (objectID === "0" && firebaseID)
  {
    url = url.replace("NoteID", "FirebaseID");
    const pos = url.indexOf("=");
    url = url.substring(0, pos+1) + firebaseID;
    console.log("Fix URL when FirebaseID With Value and objectID withOut:  Url=" + url);
  }


  event.notification.close();

  if (event.action === "dismiss") 
  {
    return;
  }

  event.waitUntil(clients.openWindow(url));
});





/// 1. Import Firebase Compat SDKs (required inside Service Workers)
// importScripts("https://gstatic.com");
// importScripts("https://gstatic.com");

// 2. Read the active project's config passed from React via URL query params
//const params = new URL(location).searchParams;
// const params = new URL(self.location.href).searchParams;

// const apiKey = params.get("apiKey");
// if (apiKey) 
// {
//   console.log("initializeApp: "+apiKey);
//   firebase.initializeApp({
//     apiKey: apiKey,
//     authDomain: params.get("authDomain") || "",
//     projectId: params.get("projectId") || "",
//     storageBucket: params.get("storageBucket") || "",
//     messagingSenderId: params.get("messagingSenderId") || "",
//     appId: params.get("appId") || "",
//   });
// }


// // 3. Initialize Firebase Messaging (this enables the bridge to React's onMessage)
// const messaging = firebase.messaging();

// // 4. Handle background messages (runs ONLY when the app tab is closed or hidden)
// messaging.onBackgroundMessage(function (payload) 
// {
//   console.log("Background message received: ", payload);

//   const title = payload.notification?.title || payload.data?.title || "⏰ תזכורת!";
//   const options = {
//     body: payload.notification?.body || payload.data?.body || "יש לך תזכורת למשימה",
//     icon: "/note_small.png",
//     badge: "/note_small.png",
//     image: "/note_big.jpg",
//     requireInteraction: true,
//     silent: false,
//     actions: 
//     [
//       { action: "open", title: "פתח משימה" },
//       { action: "dismiss", title: "סגור" },
//     ],
//     data: 
//     {
//       url: payload.data?.url || self.location.origin,
//       objectID: payload.data?.objectID || "",
//       firebaseId: payload.data?.firebaseID || "",
//     },
//   };

//   return self.registration.showNotification(title, options);
// });







// // Listen for push notifications sent from Firebase Cloud Messaging
// self.addEventListener('push', function(event) 
// {
//   if (event.data) 
//   {
//     try 
//     {
//       const payload = event.data.json();
//       console.log('Background message received: ', payload);

//       // Extract the notification details from the FCM payload
//       const title = payload.notification?.title || payload.data?.title || '⏰ תזכורת!';
//       const options = 
//       {
//         body: payload.notification?.body || payload.data?.body || 'יש לך תזכורת למשימה',    // 'You have a pending notification.',
//         icon: '/note_small.png',    // Square app icon
//         badge: '/note_small.png',   // Small status-bar icon
//         image: "/note_big.jpg",     // Optional wide picture inside the notification
//         requireInteraction: true,   // Keeps the banner visible until the user clicks or closes it
//         actions: [
//           { action: "open", title: "פתח משימה" },
//           { action: "dismiss", title: "סגור" }
//         ],
//         //vibrate:,
//         data: {url: self.location.origin}  // Opens your website when clicked
//       };

//       event.waitUntil(self.registration.showNotification(title, options));
//     } 
//     catch (e) 
//     {
//       console.error('Error parsing push data:', e);
//     }
//   }
// });




// // Optional: Open the app when the user clicks the notification
// self.addEventListener('notificationclick', function(event) 
// {
//   event.notification.close();

//   if (event.action === "dismiss") 
//   {
//     return;
//   }
//   event.waitUntil(clients.openWindow(event.notification.data?.url || '/'));
// });





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