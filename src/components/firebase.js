// https://www.google.com/search?q=how+connect+Firebase+to+react.+show+me+example+of+get+data+from+realtime+firebase+table&sca_esv=b2f91a6579888e50&biw=1920&bih=1003&sxsrf=ANbL-n5zO-57By6lumpRXmhbv3u8P53cYA%3A1779628443364&ei=m_kSatn6FYW2hbIP18qmqQo&ved=0ahUKEwiZtMvJgNKUAxUFW0EAHVelKaUQ4dUDCBA&uact=5&oq=how+connect+Firebase+to+react.+show+me+example+of+get+data+from+realtime+firebase+table&gs_lp=Egxnd3Mtd2l6LXNlcnAiV2hvdyBjb25uZWN0IEZpcmViYXNlIHRvIHJlYWN0LiBzaG93IG1lIGV4YW1wbGUgb2YgZ2V0IGRhdGEgZnJvbSByZWFsdGltZSBmaXJlYmFzZSB0YWJsZUjZtANQ3iJY_q4DcAF4AZABAJgBiQGgAZsQqgEENC4xNbgBA8gBAPgBAZgCAqACdMICChAAGEcY1gQYsAPCAgQQIRgKmAMAiAYBkAYIkgcDMS4xoAfdJbIHAzAuMbgHbsIHBTAuMS4xyAcFgAgB&sclient=gws-wiz-serp
// npm install firebase

// src/firebase.js
import { useEffect, useState } from 'react';
import { dateSetFormat }  from '../globals.js';
import { initializeApp, getApps, getApp, deleteApp } from "firebase/app";
import { getDatabase, ref, onValue, update, set, get, push, remove, query, orderByChild, equalTo, enableLogging } from "firebase/database";
import  * as FirebaseConfig from './dataBasesConfig.js';
import * as Globals from '../globals.js';
import './AuthenticationStyle.css';
//import { useSearchParams } from 'react-router-dom';
//import { getAuth } from "firebase/auth";
//import { getFirestore } from "firebase/firestore";
//import { getAnalytics } from "firebase/analytics";
//import { database } from './firebase';
//const analytics = getAnalytics(app);
// export const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
// export const auth = getAuth(app);
// export const storage = getStorage(app);

/// https://www.google.com/search?q=react%2C+with+Firebase+realtime+database%2C+why+i+can%27t+call+with+await+%2C+async+function+that+get+data+use+const+%5Bdata%2C+setData%5D+%3D+useState%28%5B%5D%29&sca_esv=114ce2f88324942a&sxsrf=APpeQnsNIwNRKy0AXpbyKw2qHBwFw9bbxA%3A1784032586396&source=hp&ei=Si1Was-tFfjt7_UP1e_GsQw&iflsig=ABILxe8AAAAAalY7WhInafpljqIw120OJKHYwwiauy_L&ved=0ahUKEwjP-s6kl9KVAxX49rsIHdW3McYQ4dUDCCk&uact=5&oq=react%2C+with+Firebase+realtime+database%2C+why+i+can%27t+call+with+await+%2C+async+function+that+get+data+use+const+%5Bdata%2C+setData%5D+%3D+useState%28%5B%5D%29&gs_lp=Egdnd3Mtd2l6IosBcmVhY3QsIHdpdGggRmlyZWJhc2UgcmVhbHRpbWUgZGF0YWJhc2UsIHdoeSBpIGNhbid0IGNhbGwgd2l0aCBhd2FpdCAsIGFzeW5jIGZ1bmN0aW9uIHRoYXQgZ2V0IGRhdGEgdXNlIGNvbnN0IFtkYXRhLCBzZXREYXRhXSA9IHVzZVN0YXRlKFtdKUj8gxBQAFin-A9wCXgAkAEAmAH3AaABsnKqAQYwLjk1Lje4AQPIAQD4AQH4AQKYAkqgAtNPwgILEC4YgAQYsQMYgwHCAhEQLhiABBixAxiDARjHARjRA8ICCBAuGIAEGLEDwgIOEC4YgAQYigUYsQMYgwHCAg4QABiABBiKBRixAxiDAcICFBAuGIAEGIoFGI0GGLEDGMcBGNEDwgIFEC4YgATCAg4QABiABBiKBRiNBhixA8ICCxAAGIAEGLEDGIMBwgILEC4YgAQYxwEY0QPCAgsQABiABBiKBRixA8ICCBAAGIAEGLEDwgIFEAAYgATCAg4QLhiABBixAxjHARjRA8ICChAAGIAEGMkDGArCAgsQABiABBiKBRiSA8ICBxAAGIAEGArCAgwQABiABBgKGAsYsQPCAgkQABiABBgKGAvCAgYQABgWGB7CAggQ
/// ABgWGB4YCsICCxAAGIAEGIoFGIYDwgIFEAAY7wXCAggQABiJBRiiBMICCBAAGIAEGKIEwgIFECEYoAHCAgcQIRgKGKABwgIEECEYFcICBRAhGJ8FwgIEECEYCpgDAJIHBjcuNjEuNqAHh80CsgcGMC42MS42uAfAT8IHCTYuNDcuMjAuMcgHqgGACAE&sclient=gws-wiz


// Turn on network logs to see cross-device synchronization


enableLogging(true); 



var result = null;


export var DataBasesConfigList = FirebaseConfig.dataBasesConfigList;
export var dataBaseIndex = 0;
const mainSettingDBname= "mhnotes-mainsettingdb"; 
var firebaseConfig = {};
var funcWhenUpdate = null;
var app;
export var database;
var DefaultUserEmail = '';  /* Globals.readFile('MyEmail.json'); */     //'hemedmeir@gmail.com';
export var appVersion = '2.3.3';


//await Init();


export function getFuncWhenUpdate()
{
    return funcWhenUpdate;
}

export function setFuncWhenUpdate(value)
{
    funcWhenUpdate = value;
}

export async function Init() 
{
  // Get URL parameters like ?=dbIndex = 1
  // const queryParameters = new URLSearchParams(window.location.search)
  // const dbIndex = queryParameters.get("dbIndex")

  // if (dbIndex)
  // {
  //   dataBaseIndex = Number(dbIndex);
  // }
  // else
  // {

    const tmpDataBaseIndex = await getDatabaseIndexFromFile("launch.json");
    // if (tmpDataBaseIndex)
    // {
    //   dataBaseIndex = tmpDataBaseIndex;
    // }

  

  //database = await changeDatabase(dataBaseIndex);


  return ( dataBaseIndex );
}

/// Get DB index from outside Jsson text file - The File Must be in 'Public' folder
/// Fetch the JSON file directly using standard JavaScript fetch
export async function getDatabaseIndexFromFile( fileName ) 
{
  var result = null;

  var response = await fetch("/" + fileName);

  if (!response.ok) 
  {
    return null;
    //throw new Error(`Failed to load launch.json: ${response.statusText}`);
  }

  var obj = await response.json();
  if (obj['DatabaselistIndex'] !== null)
  {
    result = Number(obj.DatabaselistIndex); 
  }

  if (obj['version'] !== null)
  {
    appVersion = obj['version']; 
  }

  /** Get Default User Email value */
  // fileName = "MyEmail.json";
  // response = await fetch("/" + fileName);
  // if (!response.ok) 
  // {
  //   return null;
  //   //throw new Error(`Failed to load launch.json: ${response.statusText}`);
  // }
  // obj = await response.json();
  // if (obj['email'] !== null)
  // {
  //   DefaultUserEmail = obj['email']; 
  // }



  return result;
}




/**  Async Firebase's real-time lisener (onValue) */
export function UseListenToDatabase( tableName ) 
{
  const [dataDB, setData] = useState([]);
  //const [loading, setLoading] = useState(true);
  //const [error, setError] = useState(null);

  //var dataDB = [];


  /// Hook 1: Listen to connection state
  useEffect(() => 
  {
    const connectedRef = ref(database, ".info/connected");
    const unsubscribe = onValue(connectedRef, (snap) => 
    {
      var message = '';
      if (snap.val() === true) 
      {
        message = "🟢 Connected to Live Server";
      } 
      else 
      {
        message = "🔴 Disconnected (Using Cache)";
      }
      //console.debug(message);
    });

    return () => unsubscribe();
  }, []);


  /// Like Using{} in C#, Clean the function
  useEffect(() => 
  {
    // 1. Create a reference to the specific 'table' (node) in your database
    const dataRef = ref(database, tableName);

    //setLoading(true);

    // Set up the Function var for real-time listener
    const firebaseData = onValue(dataRef, (snapshot) => 
                                          {
                                            if (snapshot.exists()) 
                                            {
                                              if (snapshot.val()) 
                                              {
                                                console.debug("🟢 Get data live from Firebase server!");
                                              } 
                                              else 
                                              {
                                                console.debug("🔴 Error when get data! Listening only to local cache.");
                                              }
                                              const dataItems = [];
                                              let formattedData;
                                              snapshot.forEach( (childSnapshot) => 
                                                                {
                                                                  const record = childSnapshot.val();
                                                                  formattedData = {...record, FirebaseID: childSnapshot.key};      //Object.keys(record).map(key => ({...record, id: key }));
                                                                  if (record['id']!==undefined)
                                                                  {
                                                                    formattedData = {...record, id: childSnapshot.key} 
                                                                  }
                                                                  // if (record['ID']!==undefined)
                                                                  // {
                                                                  //   formattedData = {...record, ID: childSnapshot.key} 
                                                                  // }
                                                                  dataItems.push( formattedData )});
                                              //dataDB = dataItems;
                                              setData(dataItems);
                                              //setLoading(false);
                                              /// will Fired when other device add/update records
                                              if (getFuncWhenUpdate() !== null) 
                                              {
                                                const func = getFuncWhenUpdate();
                                                func();
                                              }
                                              return (dataItems)
                                            }
                                            else 
                                            {
                                              //dataDB = [];
                                              setData([]);
                                            }
                                            //setLoading(false);
                                            return (dataDB);
                                          },
                                          (err) => 
                                          {
                                            console.error("Firebase read error: ", err);
                                            //dataDB = [];
                                            //setData([]);
                                            //setError(err);
                                            //setLoading(false);
                                            return (dataDB);
                                          }); 

    // Execute the Function var
    return () => firebaseData();

  }, [tableName, dataDB]);


  return (dataDB);
}

// function useGetConnectionState()
// {
  

//   useEffect(() => 
//   {
//     const connectedRef = ref(database, ".info/connected");
//     const unsubscribe = onValue(connectedRef, (snap) => 
//     {
//       var message = '';
//       if (snap.val() === true) 
//       {
//         message = "🟢 Connected to Live Server";
//       } 
//       else 
//       {
//         message = "🔴 Disconnected (Using Cache)";
//       }
//       console.debug(message);
//       return message;
//     });
//     return () => unsubscribe();
//   }, []);


//   //return '';
// }


/// Sync One-Time Fetching - Use get() method.
/// Use async/await call this func
export async function GetTableDataSync( tableName ) 
{
  var data = [];


 
  try 
  {
    const dataRef = ref(database, tableName);
  
    await get(dataRef)
            .then((snapshot) => 
                  {
                    if (snapshot.exists()) 
                    {
                        const dataItems = [];
                        let formattedData;
                        snapshot.forEach( (childSnapshot) => 
                                          {
                                            const record = childSnapshot.val();
                                            formattedData = {...record, FirebaseID: childSnapshot.key};      //Object.keys(record).map(key => ({...record, id: key }));
                                            if (record['id']!==undefined)
                                            {
                                              formattedData = {...record, id: childSnapshot.key};
                                            }
                                            // if (record['ID']!==undefined)
                                            // {
                                            //   formattedData = {...record, id: record['ID']}      //Object.keys(record).map(key => ({...record, id: key }));
                                            // }
                                            dataItems.push( formattedData )
                                          });
                        data = dataItems;
                        return data;
                        //setData(dataItems);
                    }
                    else 
                    {
                      data = [];
                      //setData([]);
                    }
                    return data;
                  }
                );

  } 
  catch (error) 
  {
    console.error("Error fetching data:", error);
    data = [];
  } 
  // finally 
  // {
  //   setLoading(false);
  // }



  //if (loading) return ( <p>טוען נתונים ...</p> )

  return ( data );
}

/// Firebase's real-time Sync method (onValue)
/// DON'T Use async/await call tyhis func
export function GetQueryAsync(tableName, fieldName, fieldValue) 
{
  const [data, setData] = useState([]);
  const [loading/* , setLoading */] = useState(true);


  // Like Using{} in C#, Clean the function
  useEffect(() => 
  {
    const itemsRef = ref(database, tableName);
    
    var filteredQuery;
    if (fieldName !== null && fieldValue !==null)
    {
      // 2. Build the query (Filtering items where status equals "active")
      filteredQuery = query(
                        itemsRef, 
                        orderByChild(fieldName), 
                        equalTo(fieldValue)
                      );
    }
    else
    {
      filteredQuery = itemsRef;
    }
    

    /// Set up the Function var to Fetch data in real-time
    const firebaseData = onValue(filteredQuery, (snapshot) => 
                                                {
                                                  const dataItems = [];
                                                  let formattedData;
                                                  snapshot.forEach( (childSnapshot) => 
                                                                    {
                                                                      const record = childSnapshot.val();
                                                                      formattedData = {...record, id: record['FirebaseID']};        //Object.keys(record).map(key => ({...record, id: key }));
                                                                      if (record['id']!==undefined)
                                                                      {
                                                                        formattedData = {...record, id: childSnapshot.key};
                                                                      }
                                                                      // if (record['ID']!==undefined)
                                                                      // {
                                                                      //   formattedData = {...record, id: record['ID']}      //Object.keys(record).map(key => ({...record, id: key }));
                                                                      // }
                                                                      dataItems.push( formattedData )
                                                                    });
                                                  setData(dataItems);
                                                  return dataItems;
                                                }
                                  );

    // Execute the Function var
    return () => firebaseData();

  }, [tableName, fieldName, fieldValue]);


  if (loading) return <p>Loading...</p>;


  return (data);
}

/// Sync One-Time Fetching - Use get() method.
/// Use async/await call this func
export async function GetQuerySync( tableName, fieldName, fieldValue ) 
{
  // const [data, setData] = useState([]);
  // const [loading, setLoading] = useState(true);
  var data = [];




  try 
  {
    const dataRef = ref(database, tableName);
    
    var filteredQuery;
    if (fieldName !== null && fieldValue !==null)
    {
      // 2. Build the query (Filtering items where status equals "active")
      filteredQuery = query(
                        dataRef, 
                        orderByChild(fieldName), 
                        equalTo(fieldValue)
                      );
    }
    else
    {
      filteredQuery = dataRef;
    }


    await get(filteredQuery)
            .then((snapshot) => 
              {
                if (snapshot.exists()) 
                {
                    const dataItems = [];
                    let formattedData;
                    snapshot.forEach( (childSnapshot) => 
                                      {
                                        var record = childSnapshot.val();
                                        formattedData = {...record, id: record['FirebaseID']};        //Object.keys(record).map(key => ({...record, id: key }));
                                        if (record['id']!==undefined)
                                        {
                                          formattedData = {...record, id: childSnapshot.key};
                                        }
                                        // if (record['ID']!==undefined)
                                        // {
                                        //   formattedData = {...record, id: record['ID']}      //Object.keys(record).map(key => ({...record, id: key }));
                                        // }
                                        dataItems.push( formattedData )
                                      });
                    data = dataItems;
                }
                else 
                {
                  data = [];
                }
                return data;
              }
            )
  }
  catch (error) 
  {
    console.error("Error fetching data:", error);
  } 
  


  //if (loading) return ( <p>טוען נתונים ...</p> )


  return ( data );
}

export async function InsertRecord( tableName, values )
{
  let result = '';
  
  if (values["LastUpdateDate"] !== null)
  {
    values.LastUpdateDate =  dateSetFormat(new Date());
  }

  //const [key, setKey] = useState(null);
  const tableRef = ref(database, tableName);
  
  await push(tableRef, values)
    .then( snapshot => 
          {
            result = snapshot.key;
            if (values["FirebaseID"] !== null && values["FirebaseID"] !== undefined)
            {
                values["FirebaseID"] = snapshot.key;
            }
            if (values["id"] !== null && values["id"] !== undefined)
            {
                values["id"] = snapshot.key;
            }
          }
    )
    .catch((error) => function() { 
              console.error("Error updating record:", error);
              result = '';
              return '';
            }
    );


    // Update field 'FirebaseID'
    if (values["FirebaseID"] !== null && result !== '')
    {
      const funcWhenUpdate = getFuncWhenUpdate();
      setFuncWhenUpdate(null);
      var json =  {FirebaseID: result};     // values;
      if (values["id"] !== null)
      {
        json["id"] = result;
      }
      await UpdateField(tableName, result, json)
      setFuncWhenUpdate(funcWhenUpdate);
    }


    return result;
}

/// Set ALL fields in record
/// param 'recordKey' - The uniqee key to focus specific record
export async function UpdateRecord( tableName, recordKey, values )
{
    if (String(recordKey).trim() === "")
    {
      alert("מזהה הרשומה ריק");
      return false;
    }

    if (values["LastUpdateDate"] !== null)
    {
      values.LastUpdateDate =  dateSetFormat(new Date());
    }

    const tableRef = ref(database, `${tableName}/${recordKey}`);

    await set(tableRef, values)
        .then(() => 
              {
                //console.debug("Record updated successfull !");
                result = true;
                return true;
              }
        )
        .catch((error) => function() { 
                console.error("Error updating record:", error);
                result = false;
                return false;
              }
        );
      

  
    return result;
}

/// Update Specific fields to save (not All)
/// Asume that the record have field 'FirebasID' to find the record
export async function UpdateField(tableName, recordKey, values) 
{
  var result = false;

  if (String(recordKey).trim() === "")
  {
    alert("מזהה הרשומה ריק");
    return false;
  }

  // 1. Create a reference to the specific 'table' (node) in your database
  var tableRefUrl = tableName + "/" + recordKey;
  
  const tableRef = ref(database, tableRefUrl);
  //const tableRef = ref(database, `${tableName}/${recordKey}`);

  await update(tableRef, values)
          .then(() => 
          {
            //console.debug("Field updated successfully!");
            result = true;
          })
          .catch(
            (error) => console.error("Error updating Field:", error)
          );

  // };


  // const UserProfile = ({ recordKey }) => {
  //   const [recordData, setUserData] = useState(null);

  //   useEffect(() => {
  //     const userRef = ref(database, `${tableName}/${recordKey}`);

  //     // Subscribe to changes
  //     const unsubscribe = onValue(userRef, (snapshot) => {
  //                           const data = snapshot.val();
  //                           setUserData(data);
  //                         });

  //     // Cleanup subscription on unmount
  //     return () => unsubscribe();
  //   }, [recordKey]);

  //   if (!recordData) 
  //     return <p>Loading...</p>;

  //   return <div>{recordData.name}'s Profile</div>;
  // };
  
  return result;
}

export async function DeleteRecord( tableName, recordKey, fieldName = "FirebaseID")
{
  if (String(recordKey).trim() === "")
  {
    alert("מזהה הרשומה ריק");
    return false;
  }

  // const getTable = await GetQuerySync(tableName, fieldName, recordKey);
  //
  // if (!getTable)
  // {
  //   alert("לא הצלחנו למצוא את הרשומה הרצוייה");
  //   return false;
  // }

  const tableRef = ref(database, `${tableName}/${recordKey}`);

  await remove(tableRef)
      .then(() => 
            {
              //setRecordData(data);
              //console.debug("Record deleted successfull !");
              result = true;
              return true;
            }
      )
      .catch((error) => function() { 
              console.error("Error updating record:", error);
              result = false;
              return false;
            }
      );


  return result;
}

export async function DeleteAllRecords( tableName )
{

  const getTable = await GetTableDataSync(tableName);

  if (!getTable)
  {
    //alert("לא הצלחנו למצוא את הרשומה הרצוייה");
    return false;
  }

  const tableRef = ref(database, tableName);

  await remove(tableRef)
      .then( snapshot => 
            {
              //setRecordData(data);
              console.debug("All Records deleted successfull !");
              return true;
            }
      )
      .catch((error) => function() { 
              console.error("Error updating record:", error);
              return false;
            }
      );


  return false;
}

export async function dispose()
{

  if (getApps().length === 0)
  {
    return;
  }

  const appCurrent = getApp(); // Gets the default app
  
  if (!appCurrent)
  {
    return;
  }

  await deleteApp(appCurrent)
          .then(() => 
          {
              //console.debug("Firebase app deleted successfully");
          })
          .catch((error) => 
          {
            console.log("Error deleting app:", error);
          });

  app = null;
  database = null;

}

/// Change Databse
export async function changeDatabase(dbIndex)
{
    await dispose();

    firebaseConfig = DataBasesConfigList[dbIndex];
    var { email, ...objectWithoutEmail } = firebaseConfig;
    firebaseConfig = objectWithoutEmail;


    /// Initialize Firebase
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    //app.automaticDataCollectionEnabled = true;
    database = getDatabase(app);

      // Initialize Firebase
    //app = initializeApp(firebaseConfig);
    // Initialize Realtime Database and get a reference to the service
    //database = getDatabase(app);


    return database;
}

export async function changeIDs(mainTableName)
{
  
  const data   = [...await GetTableDataSync(mainTableName)].sort((a, b) => a.NoteID - b.NoteID);
  const childs = [...await GetTableDataSync('TBL_NotesChilds')].sort((a, b) => a.NoteID - b.NoteID);
  const images = [...await GetTableDataSync('TBL_NotesImages')].sort((a, b) => a.NoteID - b.NoteID);

  var index = 0
  var id = data[0].NoteID

  while (index < data.length)
  {
      index++;
      if (index >= data.length)
      {
        break;
      }

      const compareNoteID = data[index].NoteID;
      if (compareNoteID !== id+1)
      {
          id++;
          const newNoteID = id;
          var subChilds = [...childs].filter((item) => item.NoteID === compareNoteID);
          subChilds.map( async (item)  => 
          {
              await UpdateField('TBL_NotesChilds', item.FirebaseID, {NoteID: newNoteID})
          })

          var newImages = [...images].filter((item) => item.NoteID === compareNoteID);
          newImages.map( async (item)  => 
          {
              await UpdateField('TBL_NotesImages', item.FirebaseID, {NoteID: newNoteID})
          })
          
          await UpdateField(mainTableName, data[index].FirebaseID, {NoteID: newNoteID});
          //data[index].NoteID = noteID+1;
          //index++;
      }
      else
      {
          id++;
      }
  }

  alert("Done!");

}

/**
 * 1. Get get email from user.
 *    If fields of Email & Password are empty - Reset (write the values user enter) fields in Users table.
 * 2. Search in Users table if there is User with this email & Password.
 *    if did not find, give alert and get out.
 * 3. Search with the email in database configurations array..
 *    if did not find, give alert and get out.
 * 4. if user haz more than 1 database, there will be a default database ID in settings tabl.
 * 5. Compare the email and the password to Fields in Aettings table.
 */
export function AuthenticationScreen({onConfirm, onExit})
{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstEmail, setfirstEmail] = useState(DefaultUserEmail);



    function handleExit()
    {
      if (onExit!==undefined)
      {
        onExit();
      }
    }

    async function handleConfirm()
    {

      /** Search the config object of Main Settings db */
      var dbIndex = DataBasesConfigList.findIndex((item) => item['projectId']===mainSettingDBname);
      if (dbIndex===-1)
      {
        alert('המערכת לא מצאה את המידע כדי להתחבר למסד-הנתונים הראשי');
        if (onConfirm!==undefined)
        {
          onConfirm(-1);
        }
        return -1;
      }

      /** Connect to Main Setting db */
      database = await changeDatabase(dbIndex);
      
      
      /** When email & password empty - Update new values in User table */
      if (email==='' && password==='')
      {
        const dataUsers = await GetQuerySync('TBL_Users', 'Email', firstEmail);
        if (dataUsers)
          {
          var values = {Email: email, Password: password};
          var result = await UpdateField('TBL_Users', dataUsers['FirebaseID'], values);

          const dataSettings = await GetTableDataSync('TBL_Serttins');
          if (dataSettings && dataSettings.length>0)
          {
            values = {UserEmail: email, UserPassword: password};
            result = await UpdateField('TBL_Serttins', dataSettings[0].FirebaseID, values);
            setfirstEmail(email);
          }
          
          if (onConfirm!==undefined)
          {
            onConfirm(-1);
          }
          return -1;
        }
      }
      
      /** Check validity of the email */
      var dataCheck = await GetQuerySync('TBL_Users', 'Email', email);
      if (!dataCheck || dataCheck.length===0)
      {
          alert('משתמש לא מוכר במערכת');
          if (onConfirm!=undefined)
          {
            onConfirm(-1);
          }
          return -1;
      }

      dbIndex = DataBasesConfigList.findIndex((item) => item['email']!==undefined && item['email'] === email)
      if (dbIndex===-1)
      {
        alert('המערכת לא מצאה את המידע כדי להתחבר למסד-הנתונים שלך');
        if (onConfirm!==undefined)
        {
          onConfirm(-1);
        }
        return -1;
      }


      /** Connect to db */
      database = await changeDatabase(dbIndex);

      dataCheck = await GetTableDataSync('TBL_Settings');
      
      /** Check validity of the password */
      if (dataCheck && dataCheck.length>0 && dataCheck[0]['UserPassword'] !== password)
      {
          alert('סיסמה לא נכונה');
          if (onConfirm!==undefined)
          {
            onConfirm(-1);
          }
          return -1;
      }

      /** Search the right config object by email */
      // dbIndex = DataBasesConfigList.findIndex((item) => item['email']!==undefined && item['email'] === email)
      // if (dbIndex===-1)
      // {
      //   alert('המערכת לא מצאה את המידע כדי להתחבר למסד-הנתונים שלך');
      //   if (onConfirm!==undefined)
      //   {
      //     onConfirm(-1);
      //   }
      //   return -1;
      // }

      dataBaseIndex = dbIndex;
      
      /** Connect to db */
      //database = await changeDatabase(dbIndex);
   
      if (onConfirm!==undefined)
      {
        onConfirm(dbIndex);
      }


      return dbIndex;;
    }

    return (

      <div className='AuthenticationStyle'>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
          <Globals.FieldInScreen  captionText="הקלד כתובת מייל"  fieldID="txtEmail" textAlign='right' direction='rtl'
            control={
              <input  id='txtEmail' type='text' value={email} placeholder='הקלד כתובת מייל'  style={{fontFamily: 'Tahoma', fontSize: '20px', fontWeight: '400', textAlign: 'left', direction: 'ltr'}}   onChange={(e) => setEmail(e.target.value)} />
            }
          />
            
          <Globals.FieldInScreen  captionText="הקלד סיסמה"  fieldID="txtPassword"  textAlign='right' direction='rtl'
              control={
                <input  id='txtPassword' type='password' value={password} placeholder='הקלד סיסמה'  style={{fontFamily: 'Tahoma', fontSize: '20px', fontWeight: '400', textAlign: 'left', direction: 'ltr'}}   onChange={(e) => setPassword(e.target.value)} />
              }
          />
        </div>

        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
          <button type='button' className='button_save' onClick={(e) => handleConfirm()}>אישור</button>
          <button type='button' style={{backgroundColor: 'red', color: 'white'}} onClick={(e) => handleExit()}>יציאה</button>
        </div>

      </div>
    );
}

// export function MyComponent(tableName) 
// {
//   const [data, setData] = useState([]);
//   //const [loading, setLoading] = useState(true);


//   //const { data2, loading } = GetDataAsync(tableName);
//   //setData(data2);
//   // useEffect(() => {
//   //   const fetchUsers = async () => {
//   //     const { data, loading } = await useGetDataAsync(tableName);
//   //     setData(data);
//   //     setLoading(false);
//   //   };
    
//   //   fetchUsers();
//   // }, []);

//   //if (loading) return <p>טוען...</p>;

//   return (
//     <ul>
//       {data.map(user => <li key={user.id}>{user.name}</li>)}
//     </ul>
//   );
// }
