// https://www.google.com/search?q=how+connect+Firebase+to+react.+show+me+example+of+get+data+from+realtime+firebase+table&sca_esv=b2f91a6579888e50&biw=1920&bih=1003&sxsrf=ANbL-n5zO-57By6lumpRXmhbv3u8P53cYA%3A1779628443364&ei=m_kSatn6FYW2hbIP18qmqQo&ved=0ahUKEwiZtMvJgNKUAxUFW0EAHVelKaUQ4dUDCBA&uact=5&oq=how+connect+Firebase+to+react.+show+me+example+of+get+data+from+realtime+firebase+table&gs_lp=Egxnd3Mtd2l6LXNlcnAiV2hvdyBjb25uZWN0IEZpcmViYXNlIHRvIHJlYWN0LiBzaG93IG1lIGV4YW1wbGUgb2YgZ2V0IGRhdGEgZnJvbSByZWFsdGltZSBmaXJlYmFzZSB0YWJsZUjZtANQ3iJY_q4DcAF4AZABAJgBiQGgAZsQqgEENC4xNbgBA8gBAPgBAZgCAqACdMICChAAGEcY1gQYsAPCAgQQIRgKmAMAiAYBkAYIkgcDMS4xoAfdJbIHAzAuMbgHbsIHBTAuMS4xyAcFgAgB&sclient=gws-wiz-serp
// npm install firebase

// src/firebase.js
import { useEffect, useState } from 'react';
import { dateSetFormat }  from '../globals.js';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, onValue, update, set, get, push, remove, query, orderByChild, equalTo } from "firebase/database";
import  * as FirebaseConfig from './dataBasesConfig.js';
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






var result = null;


export var DataBasesConfigList = FirebaseConfig.dataBasesConfigList;
export var dataBaseIndex = 0;   //await getDatabaseIndex("launch.json");
var firebaseConfig = {};
var app;
var database;            //changeDatabase(dataBaseIndex);

await Init();




export async function Init() 
{
  const queryParameters = new URLSearchParams(window.location.search)
  const dbIndex = queryParameters.get("dbIndex")
  //const name = queryParameters.get("name")

  // יצירת אובייקט לקריאת הפרמטרים מה-URL
  //const [searchParams] = useSearchParams();
  // שליפת הערך של הפרמטר 'user'
  //const dbIndex = searchParams.get('dbIndex');


  dataBaseIndex = await getDatabaseIndex("launch.json");
  
  if (dbIndex)
  {
    dataBaseIndex = Number(dbIndex);
  }

  database = await changeDatabase(dataBaseIndex);

  return database;
}

/// Get DB index from outside Jsson text file - The File Must be in 'Public' folder
/// Fetch the JSON file directly using standard JavaScript fetch
async function getDatabaseIndex( fileName ) 
{
  const response = await fetch("/" + fileName);

  if (!response.ok) 
  {
    throw new Error(`Failed to load launch.json: ${response.statusText}`);
  }

  const obj = await response.json();
  const dbIndex = Number(obj.DatabaselistIndex); 
  
  return dbIndex;
}

/// Change Databse
export async function changeDatabase(dbIndex)
{
    firebaseConfig = DataBasesConfigList[dbIndex];
    
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


/// Async Firebase's real-time lisener (onValue)
/// DON'T Use async/await call tyhis func
export function GetTableDataAsync( tableName ) 
{
  const [data, setData] = useState([]);


  // Like Using{} in C#, Clean the function
  useEffect(() => 
  {
    // 1. Create a reference to the specific 'table' (node) in your database
    const itemsRef = ref(database, tableName);

    // Set up the Function var for real-time listener
    const firebaseData = onValue(itemsRef,  (snapshot) => 
                                            {
                                                //console.log(tableName + " - Async All Data:", snapshot); 
                                                const dataItems = [];
                                                snapshot.forEach( (childSnapshot) => 
                                                                  {
                                                                    const record = childSnapshot.val();
                                                                    //console.log(tableName + " - Async Child Data:", record);     // This will loop through ALL records
                                                                    dataItems.push( record )
                                                                  });
                                                                  console.log(tableName + " - Async Child Data:", dataItems.length);
                                                                  setData(dataItems);
                                                                  // const records = snapshot.val();
                                                                  // if (records) 
                                                                  // {
                                                                  //   // Add 'id' field
                                                                  //   const formattedData = Object.keys(records).map(key => ({ id: key, ...records[key] }));
                                                                  //   setData(formattedData);
                                                                  //   // Remove 'idd' key
                                                                  //   // if (json["id"] !== null)
                                                                  //   // {
                                                                  //   //  const keyToRemove = 'id';
                                                                  //   //  const { [keyToRemove]: _, ...cleanValues } = itemList;
                                                                  //   //}
                                                                  // }
                                                                  // else
                                                                  // {
                                                                  //   setData([]);
                                                                  // }
                                            }
                                  );

    // Execute the Function var
    return () => firebaseData();

  }, [tableName]);



  return data;
}

/// Sync One-Time Fetching - Use get() method.
/// Use async/await call this func
export async function GetTableDataSync( tableName ) 
{
  //const [data, setData] = useState([]);
  // const [loading, setLoading] = useState(true);
  var data = [];


  // Like Using{} in C#, Clean the function
  // useEffect(() => 
  // {
  //   /// Set up the Function var
  //   const fetchData = async () => 
  //   {
      try 
      {
        const dataRef = ref(database, tableName);
      
        await get(dataRef)
                .then((snapshot) => 
                      {
                        //console.log(tableName + " - Async All Data:", snapshot); 
                        //var data = [];
                        if (snapshot.exists()) 
                        {
                            const dataItems = [];
                            snapshot.forEach( (childSnapshot) => 
                                              {
                                                const record = childSnapshot.val();
                                                //console.log(tableName + " - Sync Child Data:", record);     // This will loop through ALL records
                                                dataItems.push( record )
                                              });
                                              data = dataItems;
                                              console.log(tableName + " - Sync Child Data:", dataItems.length);
                                              //setData(dataItems);
                                              //const records = snapshot.val();
                                              //const formattedData = Object.keys(records).map(key => ({ id: key, ...records[key] }));
                                              //data = formattedData;
                                              //setData(formattedData);
                        }
                        else 
                        {
                          data = [];
                          //setData([]);
                        }
                        //return data;
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

  //   };


  //   // Execute the Function var
  //   fetchData();
  
  // }, []); // תלויות כדי שירוץ מחדש אם הפרמטרים משתנים


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
    // 1. Reference to your database node
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
                                                  //console.log(tableName + " - Async All Data:", snapshot); 
                                                  const dataItems = [];
                                                  snapshot.forEach( (childSnapshot) => 
                                                                    {
                                                                      const record = childSnapshot.val();
                                                                      //console.log(tableName + " - Async Child Data:", record);     // This will loop through ALL records
                                                                      dataItems.push( record )
                                                                    });
                                                                    setData(dataItems);
                                                                    console.log(tableName + " - Async Child Data:", dataItems.length);
                                                                    // const records = snapshot.val();
                                                                    // if (records) 
                                                                    // {
                                                                    //   // Add 'id' field
                                                                    //   const formattedData = Object.keys(records).map(key => ({ id: key, ...records[key] }));
                                                                    //   setData(formattedData);
                                                                    //   // Remove 'idd' key
                                                                    //   // if (json["id"] !== null)
                                                                    //   // {
                                                                    //   //  const keyToRemove = 'id';
                                                                    //   //  const { [keyToRemove]: _, ...cleanValues } = itemList;
                                                                    //   //}
                                                                    // }
                                                                    // else
                                                                    // {
                                                                    //   setData([]);
                                                                    // }
                                                }
                                  );

    // Execute the Function var
    return () => firebaseData();

  }, [tableName, fieldName, fieldValue]);    // [tableName, fieldName, fieldValue ]


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



  /// Like 'Using()' in C#. Clean vars
  // useEffect(() => 
  // {   

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
                        //console.log(tableName + " - Async All Data:", snapshot); 
                        //var data = [];
                        if (snapshot.exists()) 
                        {
                            const dataItems = [];
                            snapshot.forEach( (childSnapshot) => 
                                              {
                                                const record = childSnapshot.val();
                                                //console.log(tableName + " - Sync Child Data:", record);     // This will loop through ALL records
                                                dataItems.push( record )
                                              });
                                              data = dataItems;
                                              console.log(tableName + " - Sync Child Data:", dataItems.length);
                                              //setData(dataItems);
                                              //const records = snapshot.val();
                                              //const formattedData = Object.keys(records).map(key => ({ id: key, ...records[key] }));
                                              //data = formattedData;
                                              //setData(formattedData);
                        }
                        else 
                        {
                          data = [];
                          //setData([]);
                        }
                        //return data;
                      }
                    )
      }
      catch (error) 
      {
        console.error("Error fetching data:", error);
      } 
      // finally 
      // {
      //   setLoading(false);
      // }

  //}, []); // תלויות כדי שירוץ מחדש אם הפרמטרים משתנים


  //if (loading) return ( <p>טוען נתונים ...</p> )


  return ( data );
}

export async function InsertRecord( tableName, values )
{
    if (values["LastUpdateDate"] !== null)
    {
      values.LastUpdateDate =  dateSetFormat(new Date());
    }

    //const [key, setKey] = useState(null);
    const tableRef = ref(database, tableName);
    
    await push(tableRef, values)
      .then( snapshot => 
            {
              console.log("Record inserted successfully:  " + snapshot.key);
              result = snapshot.key;
              if (values["FirebaseID"] !== null)
              {
                  values["FirebaseID"] = snapshot.key;
              }
              // return (snapshot.key);
            }
      )
      .catch((error) => function() { 
                console.error("Error updating record:", error);
                result = '';
                return '';
              }
      );


      // Update field 'FirebaseID'
      var json = values;
      await UpdateField(tableName, result, json)

      // if (json["id"] !== null)
      // {
      //   const keyToRemove = 'id';
      //   const { [keyToRemove]: _, ...cleanValues } = json;
      //  
      //   await UpdateRecord(tableName, result, cleanValues)
      //   //UpdateField(tableName, snapshot.key, clean)
      // }
      // else
      // {
      //  await UpdateField(tableName, result, json)
      // }


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
        .then( snapshot => 
              {
                console.log("Record inserted successfull !");
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

export async function DeleteRecord( tableName, recordKey, fieldName = "FirebaseID")
{
  if (String(recordKey).trim() === "")
  {
    alert("מזהה הרשומה ריק");
    return false;
  }

  const getTable = await GetQuerySync(tableName, fieldName, recordKey);

  if (!getTable)
  {
    alert("לא הצלחנו למצוא את הרשומה הרצוייה");
    return false;
  }

  const tableRef = ref(database, `${tableName}/${recordKey}`);

  await remove(tableRef)
      .then( snapshot => 
            {
              //setRecordData(data);
              console.log("Record deleted successfull !");
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



  // const UserProfile = ({ recordKey }) => {
  //   const [recordData, setRecordData] = useState(null);

    // useEffect(() => {
    //   const tableRef = ref(getDatabase(app), `${tableName}/${recordKey}`);

    //   // Subscribe to changes
    //   const unsubscribe = onValue(tableRef, (snapshot) => {
    //                         const data = snapshot.remove();
    //                         setData(data);
    //                       });

    //   // Cleanup subscription on unmount
    //   return () => unsubscribe();
    // }, [recordKey]);

    // if (!recordData) 
    //   return <p>Loading...</p>;

  //   return {recordData};
  // };

  // set(tableRef, values)
  //     .then(() => console.log("Record updated successfully!"))
  //     .catch((error) => console.error("Error updating record:", error));
  // const key = push(tableRef);
  // console.log(key);
  // set(tableRef, values)
  // tableRef.child(key)
  // const addNewRecord = () => {
  //           push(recordsRef, values)
  //             .then(() => console.log("Record updated successfully!"))
  //             .catch((error) => console.error("Error updating record:", error));
  // };
  // const itemsRef = ref(database, 'TBL_Notes/'+key);

  //return data;

  return result;
}

/// Update Specific fields to save (not All)
export async function UpdateField(tableName, recordKey, values) 
{
  var result = false;

  // 1. Create a reference to the specific 'table' (node) in your database
  const tableRef = ref(database, `${tableName}/${recordKey}`);


  await update(tableRef, values)
          .then((snapshot) => 
          {
            console.log("Field updated successfully!");
            result = true;
          })
          .catch((error) => console.error("Error updating Field:", error));

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
