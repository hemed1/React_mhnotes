// https://www.google.com/search?q=how+connect+Firebase+to+react.+show+me+example+of+get+data+from+realtime+firebase+table&sca_esv=b2f91a6579888e50&biw=1920&bih=1003&sxsrf=ANbL-n5zO-57By6lumpRXmhbv3u8P53cYA%3A1779628443364&ei=m_kSatn6FYW2hbIP18qmqQo&ved=0ahUKEwiZtMvJgNKUAxUFW0EAHVelKaUQ4dUDCBA&uact=5&oq=how+connect+Firebase+to+react.+show+me+example+of+get+data+from+realtime+firebase+table&gs_lp=Egxnd3Mtd2l6LXNlcnAiV2hvdyBjb25uZWN0IEZpcmViYXNlIHRvIHJlYWN0LiBzaG93IG1lIGV4YW1wbGUgb2YgZ2V0IGRhdGEgZnJvbSByZWFsdGltZSBmaXJlYmFzZSB0YWJsZUjZtANQ3iJY_q4DcAF4AZABAJgBiQGgAZsQqgEENC4xNbgBA8gBAPgBAZgCAqACdMICChAAGEcY1gQYsAPCAgQQIRgKmAMAiAYBkAYIkgcDMS4xoAfdJbIHAzAuMbgHbsIHBTAuMS4xyAcFgAgB&sclient=gws-wiz-serp
// npm install firebase



// src/firebase.js
import { useEffect, useState } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, update, set, get, push, child, remove } from "firebase/database";

//import { database } from './firebase';



const firebaseConfig = {
  //apiKey: "YOUR_API_KEY",
  authDomain: "meirhemed-mhnotes.firebaseapp.com",
  databaseURL: "https://meirhemed-mhnotes-default-rtdb.firebaseio.com/",      //"https://YOUR_PROJECT_ID.firebaseio.com",
  projectId: "meirhemed-mhnotes",        //"YOUR_PROJECT_ID",
  storageBucket: "gs://meirhemed-mhnotes.firebasestorage.app",  //"YOUR_PROJECT_://appspot.com",
  //messagingSenderId: "YOUR_SENDER_ID",
  appId: "1:257753299659:ios:d273d009d5040c2ae0f94e"   //"YOUR_APP_ID"
};

export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
var saveModeEn = { UPDATE: 1, INSERT: 2 };
var result = null;



export function GetTable( tableName ) {
   
   const [data, setData] = useState([]);

   useEffect(() => {
    const dbRef = ref(database);
    
    // Fetch data once from the 'users/userId' path
    get(child(dbRef, tableName + `/`))
      .then((snapshot) => {
        if (snapshot.exists()) 
        {
          const rec = snapshot.val();
          setData(rec);
        } 
        else 
        {
          console.log("No data available at this path");
          setData(null);
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        //setError(err.message);
      })
      .finally(() => {
        //setLoading(false);
      });
  }, []);



  return data;
}

export async function GetTableData2( tableName, recordKey ) 
{
  var data = [];
  //const [date, setData] = useState([]);

  // const fetchRecords = async () => 
  // {

  // useEffect(() => 
  // {
    var tableRef = "";
    if (recordKey!=="")
    {
      tableRef = ref(database, `${tableName}/${recordKey}`);
    }
    else
    {
      tableRef = ref(database, tableName);
    }

    try 
    {
      const snapshot = await get(tableRef)
      //const snapshot = await get(child(dbRef, tableName))
            .then( snapshot => 
            {
              if (snapshot.exists()) 
              {
                const records = snapshot.val();
                if (records) 
                {
                  // Transform the object into an array for easier rendering
                  const itemList = Object.keys(records).map(key => 
                              ({
                                 id: key,
                                 ...records[key]
                               }));
                  data = itemList;
                  //setData(itemList);
                  return data;
                }
              } 
            })
            .catch((error) => function() { 
                      console.error("Error updating record:", error);
                      result = null;
                      return null;
                    }
            );

          return () => snapshot();
    } 
    catch (error) 
    {
      console.error("Error fetching data:", error);
    }
  
  // }, []);


  return data;
}

export function GetTableData( tableName ) {
   
   const [data, setData] = useState([]);


  useEffect(() => 
  {
    // 1. Create a reference to the specific 'table' (node) in your database
    const itemsRef = ref(database, tableName);

    // 2. Set up the real-time listener
    const unsubscribe = onValue(itemsRef, (snapshot) => {
                          if (snapshot.exists()) 
                          {
                           const records = snapshot.val();
                           if (records) 
                           {
                              const itemList = Object.keys(records).map(key => 
                              ({
                                 id: key,
                                 ...records[key]
                              }));
                              setData(itemList);
                              /// Delete 'id'
                              // if (json["id"] !== null)
                              // {
                              //  const keyToRemove = 'id';
                              //  const { [keyToRemove]: _, ...cleanValues } = itemList;
                              //}
                              // var newList = [];
                              // for (let item of itemList) {
                              //   if (item["id"] !== null)
                              //   {
                              //     const { id: _, ...clean } = item;
                              //     newList[item["id"]] = clean;
                              //     //delete item.id;
                              //   }
                              // }
                                //const aaa = [...newList, itemList];
                                //const recs = records.map(({ id, ...object }) => object);
                                //
                                // const itemList = () => {
                                //   const updatedArray = records.map(({ id, ...rest }) => rest);
                                //   setData(updatedArray);
                                //   // Result: [{ id: 1, name: 'Alex' }, { id: 2, name: 'Blake' }]
                                // };
                                // var itemList = records.map((item) => 
                                //               {
                                //                 // 1. Destructure the key to remove (e.g., "role") and capture the rest
                                //                 const json = JSON.stringify(item);
                                //                 // Remove the 'age' key from a local state object
                                //                 const keyToRemove = 'id';
                                //                 //json.map(current => {
                                //                 const { [keyToRemove]: _, ...filteredData } = json;
                                //                 //const { id: _, ...filteredData } = json;
                                //                 // 2. Convert to JSON
                                //                 const jsonString = JSON.stringify(filteredData);
                                //                 return jsonString
                                //               } 
                                // )
                                //
                                //const { ['id']: _, ...cleanList } = records;
                                // const itemList = Object.keys(records).map(item => 
                                // (
                                //   {
                                //     const { ['id']: _, ...cleanList } = item;
                                //     item = cleanList;
                                //   }
                                // ));
                                //setData(itemList);
                            }
                            else
                            {
                              setData(records);
                            }
                           }
                          }
                        );

    // 3. Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);



  return data;
}

export async function InsertRecord( tableName, values )
{
    console.log(values);

    //const [key, setKey] = useState(null);
    const tableRef = ref(database, tableName);
    
    await push(tableRef, values)
      .then( snapshot => 
            {
              console.log("Record inserted successfully:  " + snapshot.key);
              result = snapshot.key;
              values["FirebaseID"] = snapshot.key;
              values["LastUpdateDate"] = new Date.now().toLocaleString().substring(0, 10);
              // return (snapshot.key);
            }
      )
      .catch((error) => function() { 
                console.error("Error updating record:", error);
                result = '';
                return '';
              }
      );


      var json = values;  // JSON.stringify(values);
      if (json["id"] !== null)
      {
        const keyToRemove = 'id';
        const { [keyToRemove]: _, ...cleanValues } = json;
        
        await UpdateRecord(tableName, result, cleanValues)
        //UpdateField(tableName, snapshot.key, clean)
      }
      else
      {
        await UpdateField(tableName, result, json)
      }


    return result;
}

/// Set ALL fields in record
/// param 'recordKey' - The uniqee key to focus specific record
export async function UpdateRecord( tableName, recordKey, values )
{
    if (String(recordKey) === "")
    {
      alert("מזהה הרשומה ריק");
      return false;
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

export async function DeleteRecord( tableName, recordKey)
{
  if (String(recordKey) === "")
  {
    alert("מזהה הרשומה ריק");
    return false;
  }

  const getTable = await GetTableData2(tableName, recordKey);

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

export async function UpdateField(tableName, recordKey, values) {   // , fieldName, fieldNewValue)

  // 1. Create a reference to the specific 'table' (node) in your database
  const tableRef = ref(database, `${tableName}/${recordKey}`);

  //const updateData = (id, newData) => {
    //const values = {fieldName: fieldNewValue};
    //updates[`/${tableName}/${recordKey}`] = fieldNewValue;
   
    await update(tableRef, values)
            .then((snapshot) => 
            {
              console.log("Field updated successfully!");
              // if (snapshot.exists()) 
              // {
              //   //const data = snapshot.val();
              // }
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
  
}




