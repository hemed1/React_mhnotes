/* eslint-disable no-unused-vars */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as FirebaseHanle from './components/firebase.js';
import {setSubTasksToParent} from './globals.js';
//import {PublicFileComponent} from './components/FileReader.js';



var dataNotes = [];
var dataBaseTable = [];
var dataChilds = [];
var dataListTypes = [];
var dataStatuses = [];
var dataSubject = [];
var dbData = {};



async function initApp() 
{

  
  try 
  {
    <h1>אנא המתן...</h1>
    
    const dbIndex = FirebaseHanle.dataBaseIndex; 

    // טעינת הנתונים לפני ש-React מתחילה
    //const dbData = {};
    await getData();
    
    dbData = {'dataNotes': dataNotes, 'dataBaseTable': dataBaseTable, 'dataChilds': dataChilds, 'dataListTypes': dataListTypes, 'dataStatuses': dataStatuses, 'dataSubject': dataSubject};

    //handleData();

    const root = ReactDOM.createRoot(document.getElementById('root'));
    
    // מעבירים את הנתונים כ-Props לקומפוננטה הראשית
    root.render(
      <React.StrictMode>
        <App dbData={dbData} dbIndex={dbIndex} />     {/* initialData={dbData, dbIndex} */}
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


// function handleData()
// {
//   const dataNew = FirebaseHanle.GetTableDataAsync("TBL_Notes");

//   if (dataNew.length)
//   {
//     const updateData = {...dbData, dataNotes: dataNew};
//   }
// }

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

async function getData() 
{
  dataBaseTable = await FirebaseHanle.GetTableDataSync("TBL_Databases");

  dataNotes = await FirebaseHanle.GetTableDataSync("TBL_Notes");
  // const values = { CardBackColor: '' };
  // const cc = await FirebaseHanle.UpdateField("TBL_Notes", '', values);
  
  dataChilds = await FirebaseHanle.GetTableDataSync("TBL_NotesChilds");

  // const data158 = await FirebaseHanle.GetQuerySync("TBL_NotesChilds", "NoteID", 158)
  //                                 .then((data) => 
  //                                 {
  //                                   console.log("Data for NoteID 158:", data);
  //                                   return data;
  //                                 }).catch((error) => {
  //                                   console.error("Error fetching data for NoteID 158:", error);
  //                                 });
//
// for (let i = 0; i < data158.length; i++) 
// {
//   const item = data158[i];
//   const result = await FirebaseHanle.DeleteRecord("TBL_NotesChilds", item.FirebaseID);
// }

  //dataChilds = await setFix(dataChilds);

  /// Set the Sub-Tasks objects to the Parent Task object, based on the NoteID
  dataNotes = setSubTasksToParent(dataNotes, dataChilds);

  dataListTypes = await  mapToLookupObject('TBL_ListTypes');
  dataStatuses = await  mapToLookupObject('TBL_Statuses');
  dataSubject = await  mapToLookupObject('TBL_Subjects');
  
  return dataNotes;
}

async function mapToLookupObject(tableName)
{
  const date = await  FirebaseHanle.GetTableDataSync(tableName);

  const dataTable = date.map((item) => 
                  {
                    return {
                      label: item.Description,
                      value: item.ID
                    };
                  });

  const result = [...dataTable].sort((a, b) => String(a.label).localeCompare(String(b.label))); 

  return ( result );
}

async function setFix(data)
{
    // Implementation for fixing data
    var dataChilds = data.filter((item) => item.NoteID === 158);
    const subsSorted = [...dataChilds].sort((a, b) => a.NoteID - b.NoteID);
    dataChilds = subsSorted;

    const data1 = dataChilds.filter((item) => item.id !== item.FirebaseID);
    const data2 = dataChilds.filter((item) => item.id === item.FirebaseID);
    
    
    //dataChilds = [...dataChilds, ...values.SubTasks];

  return data;
}