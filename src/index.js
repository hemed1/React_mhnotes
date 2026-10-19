/* eslint-disable no-unused-vars */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as FirebaseHandle from './components/firebase.js';
import {setSubTasksToParent} from './globals.js';
//import {PublicFileComponent} from './components/FileReader.js';



var dataNotes = [];
var dataBaseTable = [];
var dataChilds = [];
var dataListTypes = [];
var dataStatuses = [];
var dataSubject = [];




async function initApp() 
{

  
  try 
  {
    // <h1>אנא המתן...</h1>
    
    //const dbIndex = FirebaseHandle.dataBaseIndex; 

    // טעינת הנתונים לפני ש-React מתחילה
    //const dbData = {};
    //await getData();
    
    var dbData = {'dataNotes': dataNotes, 'dataBaseTable': dataBaseTable, 'dataChilds': dataChilds, 'dataListTypes': dataListTypes, 'dataStatuses': dataStatuses, 'dataSubject': dataSubject};

    const root = ReactDOM.createRoot(document.getElementById('root'));
    
    // מעבירים את הנתונים כ-Props לקומפוננטה הראשית
    root.render(
      <React.StrictMode>
        <App dbData={dbData} />     {/* initialData={dbData} */}
      </React.StrictMode>
    );
  } 
  catch (error) 
  {
    console.error("נכשלה טעינת האפליקציה: ", error);
    // כאן אפשר לרנדר מסך שגיאה ייעודי במקום שהאפליקציה תקרוס
  }
}

initApp();



// async function getDatabaseIndex( fileName ) 
// {
//   const response = await fetch("/" + fileName);

//   if (!response.ok) 
//   {
//     throw new Error(`Failed to load launch.json: ${response.statusText}`);
//   }

//   const obj = await response.json();
//   const dbIndex = Number(obj.DatabaselistIndex); 
  
//   return dbIndex;
// }

// async function getData() 
// {
//   dataBaseTable = await FirebaseHandle.GetTableDataSync("TBL_Databases");

//   dataNotes = await FirebaseHandle.GetTableDataSync("TBL_Notes");
//   dataNotes = [...dataNotes].sort((a, b) => a.ID - b.ID);
//   // const values = { CardBackColor: '' };
//   // const cc = await FirebaseHandle.UpdateField("TBL_Notes", '', values);
  
//   dataChilds = await FirebaseHandle.GetTableDataSync("TBL_NotesChilds");

//   // const data158 = await FirebaseHandle.GetQuerySync("TBL_NotesChilds", "NoteID", 158)
//   //                                 .then((data) => 
//   //                                 {
//   //                                   console.log("Data for NoteID 158:", data);
//   //                                   return data;
//   //                                 }).catch((error) => {
//   //                                   console.error("Error fetching data for NoteID 158:", error);
//   //                                 });
//   //
//   // for (let i = 0; i < data158.length; i++) 
//   // {
//   //   const item = data158[i];
//   //   const result = await FirebaseHandle.DeleteRecord("TBL_NotesChilds", item.FirebaseID);
//   // }
//   //dataChilds = await setFix(dataChilds);

//   /// Set the Sub-Tasks objects to the Parent Task object, based on the NoteID
//   dataNotes = setSubTasksToParent(dataNotes, dataChilds);

//   dataListTypes = await  mapToLookupObject('TBL_ListTypes');
//   dataStatuses = await  mapToLookupObject('TBL_Statuses');
//   dataSubject = await  mapToLookupObject('TBL_Subjects');
  
//   return dataNotes;
// }

// async function mapToLookupObject(tableName)
// {
//   const date = await  FirebaseHandle.GetTableDataSync(tableName);

//   const dataTable = date.map((item) => 
//                   {
//                     return {
//                       label: item.Description,
//                       value: item.ID
//                     };
//                   });

//   const result = [...dataTable].sort((a, b) => String(a.label).localeCompare(String(b.label))); 

//   return ( result );
// }

