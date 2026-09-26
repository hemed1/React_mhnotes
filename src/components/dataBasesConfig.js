// import { initializeApp, getApps, getApp } from "firebase/app";
//import firebase from 'firebase'


export const dataBasesConfigList =
[

   {
      apiKey: "AIzaSyCGqo9-7I5lgpAfCQfahtyxTjsXgAWdfvg",
      authDomain: "meirhemed-mhnotes.firebaseapp.com",
      databaseURL: "https://meirhemed-mhnotes-default-rtdb.firebaseio.com",
      projectId: "meirhemed-mhnotes",
      storageBucket: "meirhemed-mhnotes.firebasestorage.app",
      messagingSenderId: "257753299659",
      appId: "1:257753299659:ios:d273d009d5040c2ae0f94e",
      measurementId: "G-829HMJG495"
   },

   {
      apiKey: "AIzaSyCPNLCcsZEbkkRlbZRqvXWeT2mTHiGmzDc",
      authDomain: "mh-meir-movies.firebaseapp.com",
      databaseURL: "https://mh-meir-movies-default-rtdb.firebaseio.com",
      projectId: "mh-meir-movies",
      storageBucket: "mh-meir-movies.firebasestorage.app",
      messagingSenderId: "862575476926",
      appId: "1:862575476926:web:639ae3e4988ebbf0491eef",
      measurementId: "G-F4NRXJ854S"
   },

   {
      apiKey: "AIzaSyCPNLCcsZEbkkRlbZRqvXWeT2mTHiGmzDc",
      authDomain: "zuzut-mhnotes.firebaseapp.com",
      databaseURL: "https://zuzut-mhnotes-default-rtdb.firebaseio.com",
      projectId: "zuzut-mhnotes",
      storageBucket: "zuzut-mhnotes.firebasestorage.app",
      messagingSenderId: "862575476926",
      appId: "1:862575476926:web:639ae3e4988ebbf0491eef",
      measurementId: "G-F4NRXJ854S"
   },
 
   {
      apiKey: "AIzaSyAaSm48qw0V5yynMZmV7ihyvBpV-j3Av7E",
      authDomain: "mhnotes-mainsettingdb.firebaseapp.com",
      databaseURL: "https://mhnotes-mainsettingdb-default-rtdb.firebaseio.com",
      projectId: "mhnotes-mainsettingdb",
      storageBucket: "mhnotes-mainsettingdb.firebasestorage.app",
      messagingSenderId: "489835116396",
      appId: "1:489835116396:web:19a72c1c925b3b40342549",
      measurementId: "G-KLVXNEE1RD"
   }
];


//{  ANDROID config
//     apiKey: "AIzaSyBhNpfkmYQq6OwthX-IGDGNmiWXPlyo2_I",
//     authDomain: "meirhemed-mhnotes.firebaseapp.com",
//     databaseURL: "https://meirhemed-mhnotes-default-rtdb.firebaseio.com",
//     projectId: "meirhemed-mhnotes",
//     storageBucket: "meirhemed-mhnotes.firebasestorage.app",
//     messagingSenderId: "257753299659",
//     appId: "1:257753299659:android:009dd870093fcaa7e0f94e",
//     measurementId: "G-829HMJG495"
//   },

//{  WEB config
//     apiKey: "AIzaSyB-eepby56Pe4LpVdQlg27XpF8aeSDma0c",
//     authDomain: "meirhemed-mhnotes.firebaseapp.com",
//     databaseURL: "https://meirhemed-mhnotes-default-rtdb.firebaseio.com",
//     projectId: "meirhemed-mhnotes",
//     storageBucket: "meirhemed-mhnotes.firebasestorage.app",
//     messagingSenderId: "257753299659",
//     appId: "1:257753299659:web:9d94f62b2ea3cedee0f94e",
//     measurementId: "G-829HMJG495"
//   },



// Check if any Firebase apps have already been initialized
// If yes, retrieve the existing one; if no, initialize a new one
//const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// export var dataBaseIndex = 0;
// export var firebaseConfig = dataBasesConfigList[dataBaseIndex];
// export var app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();


// export /* async */ function changeDatabase(index)
// {
//     dataBaseIndex = index;
    
    //firebaseConfig = dataBasesConfigList[dataBaseIndex];
    // Initialize Firebase
    //app = null;
    //database.app = null;
    //if (firebase.apps.length === 0) {
    //    app = initializeApp(firebaseConfig);
    //} else {
    //    app = getApp();
    //} 
    //app = getApps().length === 0 ? initializeApp(firebaseConfig/* , firebaseConfig.projectId */) : getApp();
   //  database = getDatabase(app);
    //const analytics = getAnalytics(app);

//     return app;
// }