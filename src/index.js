import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as FirebaseHanle from './components/firebase.js';
//import {PublicFileComponent} from './components/FileReader.js';



var dataNotes = [];
var dataBaseTable = [];
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
    
    dbData = {'dataNotes': dataNotes, 'dataBaseTable': dataBaseTable, 'dataListTypes': dataListTypes, 'dataStatuses': dataStatuses, 'dataSubject': dataSubject};

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


function handleData()
{
  const dataNew = FirebaseHanle.GetTableDataAsync("TBL_Notes");

  if (dataNew.length)
  {
    const updateData = {...dbData, dataNotes: dataNew};
  }
}

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
  
  const subNotes = await FirebaseHanle.GetTableDataSync("TBL_NotesChilds");
  const subsSorted = [...subNotes].sort((a, b) => a.NoteID - b.NoteID);

  for (var i = 0; i < subsSorted.length; i++)
  {
    const sub = subsSorted[i];
    const noteID = sub.NoteID;
    const note = dataNotes.find((n) => n.NoteID === noteID);
    // var subList = [];
    // while (sub.NoteID === noteID)
    // {
    //   subList.push(sub);
    // }
    const subList = subsSorted.filter((sub) => sub.NoteID === noteID);
    i = i + subList.length - 1;
    if (note)
    {
      if (subList.length > 0)
        note.SubTasks = subList;
      else
        note.SubTasks = [];
    }
  }

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