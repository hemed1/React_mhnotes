

import './App.css';
import './styles.css';
import { useState, useMemo } from 'react';
import * as FirebaseHanle from './components/firebase.js';
//import { GetTableData, UpdateField, InsertRecord, UpdateRecord, DeleteRecord, changeDatabase, DataBasesConfigList } from './components/firebase.js';
import * as Globals from './globals.js';
import Select/* , { StylesConfig }  */from 'react-select';
import FloatingWindow from './components/FloatingWindow.js';
import MenusComponent from './components/MenusComponent.js';
// import GridWidget from './components/GridWidget.js'
import { Plus, Trash2/* , X, ChevronRight, Users, Subtitles, CheckLine, Check, CheckIcon, CheckLineIcon, EllipsisVertical */ } from "lucide-react";

// import { getDatabase, ref, onValue, update, set, get, push, child, remove, query, orderByChild, equalTo } from "firebase/database";
// import { initializeApp, getApps, getApp } from "firebase/app";


// var dataBaseIndex = 0;
// var firebaseConfig = FirebaseHanle.DataBasesConfigList[dataBaseIndex];
// var app = initializeApp(firebaseConfig);
// var database = getDatabase(app);


const saveModeEn = { INSERT: 1, UPDATE: 2, DELETE: 3 };

var dataNotes = [];
var dataBaseTable = [];
var dataListTypes = [];
var dataStatuses = [];
var dataSubject = [];

/// Fields controller vars
var f_update_mode = 0;

var f_dataaseIndex = 0;

let rowCounter = 0;
const newRowId = () => `row-${Date.now()}-${rowCounter++}`;


///* await */ init();


export default function App( {dbData, dbIndex} )      /* initialData */
{
  const [selectedItem, setSelectedItem] = useState(null);
  const [isWindowOpen, setIsWindowOpen] = useState(false);
  const [data, setData] = useState(dbData);
  const [dataBaseIndex] = useState(dbIndex);
  //const [loading, setLoading] = useState(true);


  dataNotes = data['dataNotes'];
  dataBaseTable = data['dataBaseTable'];
  dataListTypes = data['dataListTypes'];
  dataStatuses = data['dataStatuses'];
  dataSubject = data['dataSubject'];

  f_dataaseIndex = dataBaseIndex;

  // useEffect(() => 
  // {
  //   async function loadData() 
  //   {
  //     try 
  //     {
  //       const response = await getData()     //fetch('YOUR_DB_ENDPOINT');
  //       //const result = await response.json();
  //       console.log(response)
  //       setData(response);
  //     } 
  //     catch (error) {
  //       console.log(error);
  //     } 
  //     finally {
  //       setLoading(false);
  //     }
  //   }

  //   loadData();
  // }, []);

  // // בזמן שהנתונים נטענים, נציג מסך טעינה
  // if (loading) {
  //   return <div>טוען נתונים מהדאטהבייס...</div>;
  // }

  // if (dataNotes.length === 0)
  // {
  //  init();
  // }
  
  // function handleData()
  // {
  //   const dataNew = FirebaseHanle.GetTableDataAsync("TBL_Notes");
  //   const updateData = {...dbData, dataNotes: dataNew};
  //   //setData(updateData);

  //   return dbData;
  // }

  function handleSelectItem(selectedItem)
  { 
    f_update_mode = 0;
    if (selectedItem !== null)
    {
      setSelectedItem((curr) => curr?.NoteID === selectedItem.NoteID ? null : selectedItem);
    }
    else
    {
      setSelectedItem(null);
    }
  }

  async function handleSelectDatabase(dbIndex)
  { 
    f_dataaseIndex = dbIndex;

    await FirebaseHanle.changeDatabase(f_dataaseIndex);

    return dbIndex
  }

   /// When save SubTasks
  function handleSaveSubTasks( notesData )
  {
      dataNotes = notesData;

      const newList = {...dbData, dataNotes: notesData }
      dbData = newList;

      setData(newList);
  }

  // function handleDeleteSubTask(lineIndex)
  // {
  //   if (selectedItem && selectedItem.SubTasks && selectedItem.SubTasks.length > 0)
  //   {
  //     const subTasksList = selectedItem.SubTasks;

  //     const removeItem = 
  //             [
  //               ...subTasksList.slice(0, lineIndex),
  //               ...subTasksList.slice(lineIndex + 1)
  //             ];
  //     //const newArray = subLinesList.filter((e) => i !== subLinesList[lineIndex]);
  //     selectedItem.SubTasks = removeItem;
      
  //     f_update_mode = 4;
  //   }
  // }


  return (

    <div className='App'>

        <MenusComponent  />

        {isWindowOpen && <FloatingWindow 
                            title="Terminal Notes" 
                            isOpen={isWindowOpen} 
                            onClose={() => setIsWindowOpen(false)}
                            onSelectedItem={handleSelectDatabase}
                          >
                            {/* children  */}
                            <div style={{display: 'flex', flexDirection: 'column', gap: '10px', height: '300px', overflowY: 'auto', paddingRight: '10px', direction: 'rtl', textAlign: 'right'}}>
                              {/* <p>This window can be dragged by its blue header bar.</p>
                              <p>You can also minimize it or close it completely!</p> */}
                              <ul value={dataBaseIndex}  style={{listStyleType: 'none'}}  /* onChange={(e) => handleSelectDatabase(Number(e.target.value))} */ >
                              {
                                FirebaseHanle.DataBasesConfigList.map((item, index) =>
                                (
                                  <li key={index} onClick={(e) => handleSelectDatabase(Number(e.target.value))}>
                                    {/* <a href={`#${index}`} value={index}  >
                                      {item.projectId} -  {index+1}
                                    </a>  */}
                                    {item.projectId} -  {index+1}
                                  </li>
                                ))  
                              }
                              </ul>
                            </div>
                        </FloatingWindow>
        }

        <div className="app">
          <ListData 
              data={dataNotes} 
              selectedItem ={selectedItem} 
              onSelectedItem={handleSelectItem}
              sortByField="date_update" />

          {selectedItem && 
              <NoteScreen 
                  selectedItem={selectedItem} 
                  onSelectedItem={handleSelectItem}
                  onSaveSubTasks={handleSaveSubTasks}
                  /* onDeleteSubTask={handleDeleteSubTask} */ />
          }
        </div>


        {/* <GridWidget  data={dataNotes}  /> */}

        
    </div>

  );

}

// async function init()
// {
//   await FirebaseHanle.changeDatabase(FirebaseHanle.dataBaseIndex);;
  
//   return await getData();
// }

// async function getData() 
// {

//   dataBaseTable = await FirebaseHanle.GetTableDataSync("TBL_Databases");

//   dataNotes = await FirebaseHanle.GetTableDataSync("TBL_Notes");
  
//   const subNotes = await FirebaseHanle.GetTableDataSync("TBL_NotesChilds");
//   const subsSorted = [...subNotes].sort((a, b) => a.NoteID - b.NoteID);

//   for (var i = 0; i < subsSorted.length; i++)
//   {
//     const sub = subsSorted[i];
//     const noteID = sub.NoteID;
//     const note = dataNotes.find((n) => n.NoteID === noteID);
//     // var subList = [];
//     // while (sub.NoteID === noteID)
//     // {
//     //   subList.push(sub);
//     // }
//     const subList = subsSorted.filter((sub) => sub.NoteID === noteID);
//     i = i + subList.length - 1;
//     if (note && subList.length > 0)
//     {
//       note.SubTasks = subList;
//     }
//   }

//   dataListTypes = await  mapToLookupObject('TBL_ListTypes');
//   dataStatuses = await  mapToLookupObject('TBL_Statuses');
//   dataSubject = await  mapToLookupObject('TBL_Subjects');
  
//   return dataNotes;
// }

// async function mapToLookupObject(tableName)
// {
//   const date = await  FirebaseHanle.GetTableDataSync(tableName);

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

// function subNotesToNotes(notes, subNotes)
// {

//   for (var item in subNotes)
//   {
//     const noteID = item.NoteID;
//     const subs = subNotes.filter((sub) => sub.NoteID === noteID);
//     const note = notes.find((n) => n.NoteID === noteID);
//     if (subs.length > 0 && note)
//     {
//       note.SubTasks = subs;
//     }
//   }
  
// }

function ListData({data, selectedItem, onSelectedItem, sortByField}) 
{
  
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [sortBy, setSortBy] = useState('date_update'); 
  const [searchText, setSearchText] = useState('');
  const [dateFilter, setDateFilter] = useState(null);


  
  // Sorted array dynamically 
  const sortedProducts = useMemo(() => 
                          {
                            switch (sortBy)
                            {
                              case 'date_due':
                                return [...data].sort((a, b) => 
                                                    ((b.DateDue) 
                                                    ? (new Date(String(b.DateDue).substring(0, 16).replace('T', ', ').replace(', ', ' ')))
                                                    : "") 
                                                  - 
                                                    ((a.DateDue) 
                                                    ? (new Date(String(a.DateDue).substring(0, 16).replace('T', ', ').replace(', ', ' '))) 
                                                    : "")
                                                  );
                            
                              case 'title': 
                                return [...data].sort((a, b) => String(a.Title).localeCompare(String(b.Title)));
                              
                              case 'today':
                                const today = new Date()/* .getTime() */;
                                return [...data].filter((item) => (new Date(item.DateDue)).toDateString() === today.toDateString());

                              case 'date_update':
                              default:
                                return [...data].sort((a, b) => 
                                                  (
                                                    ((b.LastUpdateDate !== "") 
                                                    //? String(b.LastUpdateDate).replace('T', ' ').replace(', ', ' ')
                                                    ? (new Date(String(b.LastUpdateDate).replace('T', ' ').replace(', ', ' ')))
                                                    : "")
                                                  -
                                                    ((a.LastUpdateDate !== "")
                                                    //? String(a.LastUpdateDate).replace('T', ' ').replace(', ', ' ')
                                                    ? (new Date(String(a.LastUpdateDate.replace('T', ' ').replace(', ', ' '))))
                                                    : "")
                                                  ));

                          }
                        }, [data, sortBy]);



  function handleChangeSort(e, text)
  {
    e.preventDefault();
    setSortBy(text);
  }

  async function handleInsert()
  {
      const itemObject = Note();
      onSelectedItem(itemObject);
  }

  /// Just for update 'selectedIndex' var
  function handleChangeSelect(itemObject, index)
  {
    setSelectedIndex(index);
    onSelectedItem(itemObject);
  }


  return (
    
        <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '1px', marginRight: '50px'}}>

          <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            <div style={{display: 'flex', flexDirection: 'row', gap: '40px', justifyContent: 'space-between'}}>
              <div style={{display: 'flex', flexDirection: 'row', gap: '15px'}}>
                <button type='button' onClick={(e, text) => handleChangeSort(e, 'title')}>כותרת</button>
                <button type='button' onClick={(e, text) => handleChangeSort(e, 'date_due')}>תאריך ביצוע</button>
                <button type='button' onClick={(e, text) => handleChangeSort(e, 'date_update')}>תאריך עדכון</button>
                <button type='button' onClick={(e, text) => handleChangeSort(e, 'today')}>להיום</button>
                <input  type="date"  value={dateFilter}  style={{width: '150px', paddingTop: '4px', marginTop:'4px'}} onChange={(e) => setDateFilter(e.target.value)}></input>
              </div>
              <button type='button' style={{width: '60px', backgroundColor: 'green', color: 'white'}}  onClick={handleInsert}>חדש</button>
            </div>
            <input type='text' value={searchText} placeholder='חפש...'  onChange={(e) => setSearchText(e.target.value)}   style={{height: '40px', width: '700px'}}></input>
          </div>


          <form className="accordion">
            
            <ul className='list' key="friend-list">
            {
              sortedProducts
                        .filter((item) => 
                            (String(searchText).trim() !== '')  
                            ? ((String(item.Title).indexOf(searchText)>-1) || (String(item.Description).indexOf(searchText)>-1))
                            : (dateFilter!==null)
                              ? String(item.DateDue).substring(0, 10) === String(dateFilter)
                              : true
                        )
                        .map((item, index) => 
                        (
                          <ListDataItem   index={index}
                                          itemObject={item}
                                          selectedIndex={selectedIndex}
                                          selectedItem={selectedItem}
                                          onSelectedItem={handleChangeSelect}
                                          key={index}
                          >
                              {item.Description}
                          </ListDataItem>
                        ))
            }
            </ul>
            
          </form>

        </div>
      
  );



}
 
function ListDataItem({index, selectedIndex, itemObject, selectedItem, onSelectedItem, children}) 
{

  const isSelected = (selectedItem?.NoteID === itemObject.NoteID);
  const [isOpen, setIsOpen] = useState(false);

  //console.log(index, selectedIndex, selectedItem?.Title, itemObject.Title);


  return(
   
    <li className={`item ${ isSelected ? "open" : ""}`} onClick={() => onSelectedItem(itemObject, index)}>
      <p className='number'>{(index < 9) ? `0${index+1}` : index+1}</p>
      <p className='title'>{itemObject.Title}</p>
      { children !== '' &&
            <button type="button" className='icon' onClick={(e) => 
                                              {
                                                e.stopPropagation();
                                                setIsOpen(!isOpen);
                                              }}>
                { isOpen ? '-' : '+' }
            </button>
      }
      
      {isOpen && children !=='' &&
          <textarea readOnly='true' className='content-box' >{children}</textarea>
      }
    </li>
  );

}


function NoteScreen({ selectedItem, onSelectedItem, onSaveSubTasks }) 
{
    /// Handle Controls States values
    const [title, setTitle] = useState(selectedItem?.Title || '');
    const [desc, setDesc] = useState(selectedItem?.Description || '');
    const [typeListID, setTypeListID] = useState(selectedItem?.ListTypeID || 3);
    const [statusID, setStatusID] = useState(selectedItem?.StatusID || 1);
    const [dateDue, setDateDue] = useState(selectedItem?.DateDue || Date().toLocaleString('en-IL', { timeZone: 'Asia/Jerusalem' }).replace(', ', 'T'));
    const [subjects, setSubjects] = useState([]);
    const [lastUpdate, setLastUpdate] = useState(selectedItem?.LastUpdateDate);
    
    /// General stateas
    const [subjectsArray, setSubjectsArray] = useState(null);
    //const [isSearchable, setIsSearchable] = useState(true);
    const [saveMode, setSaveMode] = useState((selectedItem?.NoteID===0) ? saveModeEn.INSERT : saveModeEn.UPDATE);
    const [firstSubTasks, setFirstSubTasks] = useState(selectedItem?.SubTasks || []);
    
    /// Handle Sub Tasks
    var keepSubs = [];
    const [selectedObject, setSelectedObject] = useState(selectedItem);
    const [showSubTasksScreen, setShowSubTasksScreen] = useState(false);
    
    const updateSons = (noteID, newSons) => 
                       {
                          if (saveMode === saveModeEn.UPDATE)
                          {
                            dataNotes = dataNotes.map((note) => (note.NoteID === noteID ? {...note, SubTasks: newSons } : note))
                            const item = dataNotes.find((c) => c.NoteID === noteID);
                            setSelectedObject(item);
                          }
                          else
                          {
                            const item = { ...selectedObject, SubTasks: newSons };
                            setSelectedObject(item);
                          }
                       };
    
    //const showSubTasksScreen = dataNotes.find((c) => c.NoteID === openNoteID);
    //console.log(openCustomer);
    
    // Add field 'SubTasks' to Object
    if (selectedObject['SubTasks'] === undefined)
    {
      setSelectedObject(  {...selectedObject, SubTasks: []} );
    }
            

    // const ColourOption = [
    //   { value: 'rgba(239, 5, 5, 0.47)', label: 'Red' },
    //   { value: '#564586', label: 'Purple' },
    //   { value: '#888769', label: 'blue' },
    //   { value: '#987654', label: 'black' }
    // ]

    // const colourStyles: StylesConfig<ColourOption, true> = {
    //   control: (styles) => ({ ...styles, backgroundColor: 'white', height: '38px', fontSize: '28px', textAlign: 'right', direction: 'rtl' }),
    //   option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    //     const color = '#c1b1d1';    // '#263375'
    //     return {
    //       ...styles, /* backgroundColor: 'white', */ fontSize: '21px'/* , height: '33px' */,

    //       /// BackColor of List
    //       backgroundColor: isDisabled
    //                           ? undefined
    //                           : isSelected
    //                             ? data.color
    //                             : isFocused
    //                               ? color    // Items in list backColor on Active
    //                               : undefined,
    //       color: isDisabled                 // Items in list ForeColor 
    //                 ? '#ccc'
    //                 : isSelected
    //                   ? isFocused        //chroma.contrast(color, 'white') > 2
    //                     ? '#ccc'
    //                     : 'black'
    //                 : data.color,    // Items in list ForColor
                    
    //       cursor: isDisabled ? 'not-allowed' : 'default',
          
    //       // Mouse Down colors
    //       ':active': {
    //         ...styles[':active'],
    //         color: '#fff',                         /// Mouse Down ForeColor      
    //         backgroundColor: !isDisabled
    //                             ? isSelected
    //                               ? '#fff'
    //                               : '#3958b778'   /// Mouse Down BackColor
    //                             : undefined,
    //       },
    //     };
    //   },
    //   multiValue: (styles, { data }) => {
    //     const color = 'transperant';      //'#cac9b2';
    //     return {
    //       ...styles,
    //       backgroundColor: color,
    //     };
    //   },
    //   multiValueLabel: (styles, { data }) => ({
    //     ...styles,
    //     color: '#f56996',   /// Selected items in row ForeColor
    //   }),
    //   multiValueRemove: (styles, { data }) => ({
    //     ...styles,
    //     color: '#9888',
    //     ':hover': {
    //       backgroundColor: '#3c6c31',
    //       color: 'white',
    //     },
    //   }),
    // };

   
    /// First time after change item
    if (f_update_mode === 0 || f_update_mode === 4)
    {
      f_update_mode = 1;
      setSubjects(null); // Clears the component statestart
      setSubjectsArray(null);
      setTitle(selectedItem?.Title);
      setDesc(selectedItem?.Description);
      if (saveMode === saveModeEn.INSERT)
      {
        setTypeListID(3);
      }
      else
      {
        setTypeListID(selectedItem?.ListTypeID);
      }
      setStatusID(selectedItem?.StatusID);
      setDateDue(selectedItem.DateDue);
      setSubjects(selectedItem.SubjectLabels);
      //setSubObjectsList(selectedItem.SubTasks || []);
      setSaveMode((selectedItem?.NoteID===0) ? saveModeEn.INSERT : saveModeEn.UPDATE);
      setFirstSubTasks(selectedItem?.SubTasks || []);
      setSubjectsArray(Globals.seperatedStringToLookupObject(selectedItem.SubjectLabels, dataSubject));
      setLastUpdate(selectedItem.LastUpdateDate);
      setSelectedObject( selectedItem );
      if ( selectedItem['SubTasks'] !== undefined && selectedItem.SubTasks.length > 0)
      {
          setShowSubTasksScreen(true);
      }
    }



    async function handleSubmit(e)
    {
      e.preventDefault();
      //return <ShowMessageBox2 title="האם אתה בטוח?" defaultValue="" withTextbox={false} />;
      // if ( aaa === 'yes')
      // {
        await saveObject(e);
      //}
      
    }

    async function handleDelete(e)
    {
      //e.preventDefault();
      /* if (Globals.ShoeMessageBox(false) === 'yes')
      { */
        setSaveMode(saveModeEn.DELETE);
      //}
    }

    async function saveObject(e)
    {
      e.preventDefault();

      var message = '';
      var result = null;
      

      var values = selectedObject;

      
      // Remove field 'SubTasks' before Save action
      keepSubs = selectedObject.SubTasks;
      if (values['SubTasks'] !== undefined)
      {
        const { SubTasks, ...otherAnimals } = values;
        values = otherAnimals;
      }


      switch (saveMode)
      {
        case saveModeEn.INSERT:
          values = await valuesToObject(values);

          values.FirebaseID='';
          const noteID = Number(dataBaseTable[0].NumeratorNotesID)+1;
          values['NoteID'] = noteID;
          selectedObject.NoteID = noteID;
          selectedItem.NoteID = noteID;
          
          result = await FirebaseHanle.InsertRecord("TBL_Notes", values);
          
          result = await FirebaseHanle.UpdateField('TBL_Databases', dataBaseTable[0].FirebaseID, {NumeratorNotesID: noteID});

          /// Save the Sub-Task
          result = await saveSubTasks();

          if (result)
          {
            const newArray = [...dataNotes];
            selectedObject.LastUpdateDate = values.LastUpdateDate;
            selectedObject.FirebaseID = values.FirebaseID;
            newArray.push({...selectedObject});
            dataNotes = newArray;
            //const objUpdated = dataNotes.find((item) => item.NoteID === noteID);
            message = "הפריט נוסף בהצלחה!";
          }
          else
          {
            message = "שגיאה בהוספת הפריט!";
          } 

          setSaveMode(2);
          break;

        case saveModeEn.UPDATE:
          values = await valuesToObject(values);
          
          result = await FirebaseHanle.UpdateRecord("TBL_Notes", selectedItem.FirebaseID, values);
          
          /// Save the Sub-Task
          result = await saveSubTasks();

          if (result)
          {
            // const toggleTodo = (id) => {
            //             setData(prevTodos => 
            //               prevTodos.map(todo => 
            //                 todo.NoteID === id ? { ...todo, values } : todo
            //               )
            //             );
            //           };
            const index = dataNotes.findIndex(task => task.NoteID === selectedObject.NoteID);
            const newArray = [...dataNotes];
            selectedItem.LastUpdateDate = values.LastUpdateDate;
            newArray[index] = {...selectedObject}; 
            dataNotes = newArray;
            //const objUpdated = dataNotes.find((item) => item.NoteID === noteID);
            message = "עידכון הפריט עבר בהצלחה!";
          }
          else
          {
            message =  "שגיאה בעידכון הפריט!";
          } 
          break;

        case saveModeEn.DELETE:
          result = await FirebaseHanle.DeleteRecord("TBL_Notes", selectedObject.FirebaseID);

          result = await deleteSubTasks();

          if (result)
          {
            selectedItem.SubTasks = [];
            selectedObject.SubTasks = [];
            setSelectedObject(selectedObject);
             // Predicate function: removes the item matching the given ID
            const handleRemove = (idToRemove) => {
              return ([...dataNotes].filter(item => item.NoteID !== idToRemove));
            };
            dataNotes = handleRemove(selectedObject.NoteID);
            alert("הפריט נמחק בהצלחה!");
          }
          else
          {
            alert("שגיאה בפעולת המחיקה!");
          } 

          setSaveMode(2);
          break;

        default:
          break;
      }


      // Add back the field 'SubTaasks' to object (removed before save to 'TBL_Notes' table)
      if (selectedObject['SubTasks'] === undefined)
      {
        setSelectedObject( {...selectedObject, SubTasks: keepSubs} );
      }

      /// Refresh Note data table
      onSaveSubTasks(dataNotes);

      /// After Refresh records, Point to the Updated note
      if (saveMode === saveModeEn.INSERT || saveMode === saveModeEn.UPDATE)
      {
          onSelectedItem(values);
      }
      else{
          onSelectedItem(null);
      }

      if (message.trim() !== '')
      {
          alert(message);
      }


    }
    
    async function saveSubTasks() 
    {
      var result = true;
      var values = selectedObject;


      // Add back the field 'SubTaasks' to object
      if (values['SubTasks'] === undefined)
      {
        setSelectedObject( {...values, SubTasks: keepSubs} );
      }

      if (firstSubTasks.length === 0 && values.SubTasks.length===0)
      {
        return result;
      }

      if (firstSubTasks.length === values.SubTasks.length)
      {
        // Checks if at least one item is missing
        const isMissing1 = firstSubTasks.some((item) => !values.SubTasks.some((e) => e.Title === item.Title) || 
                                                        !values.SubTasks.some((e) => e.IsDone === item.IsDone && e.FirebaseID === item.FirebaseID));
        const isMissing2 = values.SubTasks.some((item) => !firstSubTasks.some((e) => e.Title === item.Title) || 
                                                          !firstSubTasks.some((e) => e.IsDone === item.IsDone && e.FirebaseID === item.FirebaseID))
        if (!isMissing1 && !isMissing2)
        {
          return result;
        }
      }

      /// Set All SubTasks with parent 'NoteID'
      values.SubTasks.map((item) => item.NoteID = selectedObject.NoteID);
      setSelectedObject(values);


      /// Delete Old records
      result = await deleteSubTasks();

      if (!result)
      {
        alert("שגיאה בעידכון תתי-המשימות!");
      }

      /// Save the New records
      for (let i = 0; i < values.SubTasks.length; i++)
      {
          const item = values.SubTasks[i];
          result = await FirebaseHanle.InsertRecord("TBL_NotesChilds", item);
      }

      if (!result)
      {
        alert("שגיאה בעידכון תתי-המשימות!");
      }


      return result;
    }

    async function deleteSubTasks() 
    {
      var result = true;
      

      // Add back the field 'SubTaasks' to object
      // var values = selectedObject;
      // if (values['SubTasks'] === undefined || values.SubTasks.length === 0)
      // {
      //   setSelectedObject( {...selectedObject, SubTasks: firstSubTasks} );
      // }
      //selectedObject.SubTasks.map((item) => item.NoteID = selectedItem.NoteID)
      //setSelectedObject(selectedObject);
      
      /// Delete Old record
      const dataSubs = await FirebaseHanle.GetQuerySync("TBL_NotesChilds", "NoteID", selectedObject.NoteID);
      
      for (let i = 0; i < dataSubs.length; i++) 
      {
        const item = dataSubs[i];
        result = await FirebaseHanle.DeleteRecord("TBL_NotesChilds", item.FirebaseID);
      }

      if (!result)
      {
        alert("שגיאה במחיקת תתי-המשימות!");
      }


      return result;
    }

    async function valuesToObject( values )
    {
      values['Title'] = String(title).trim();
      values['Description'] = String(desc).trim();
      values['ListTypeID'] = typeListID;
      values['StatusID'] = statusID;
      values['DateDue'] = String(dateDue).replace('T', ' ');
      values['SubjectLabels'] = subjects;

  
      selectedObject['Title'] = String(title).trim();
      selectedObject['Description'] = String(desc).trim();
      selectedObject['ListTypeID'] = typeListID;
      selectedObject['StatusID'] = statusID;
      selectedObject['DateDue'] = String(dateDue).replace('T', ' ');
      selectedObject['SubjectLabels'] = subjects;


      return values;
    }

    function handleSubjectsChange(e)
    {
      setSubjectsArray(e);
      /// Transfer from combo objects to seperated string
      const result = Globals.lookupObjectToSeperatedString(e);
      setSubjects(result);
    }
  
    function handleShowSubTasksScreen()
    {
      setShowSubTasksScreen(!showSubTasksScreen);
    }

    function handleAddSubLine()
    {
      f_update_mode = 1;
      const noteChildbject = NoteChild();
      noteChildbject.Title = 'שורה חדשה';
      noteChildbject.IsDone = false;
      // const newLine =     //CreateSubNewline('שורה חדשה', false, null, subObjectsList.length, selectedItem);
      //         <CreateSubNewline 
      //                       key={subObjectsList.length}
      //                       itemObject={selectedItem}
      //                       defaultTitle={'שורה חדשה'} 
      //                       defaultIsDone={false} 
      //                       onDeleteLine={null} 
      //                       lineIndex={subObjectsList.length} />
      //setSubObjectsList([...subObjectsList, noteChildbject]);

      //return newLine
    };



    return (

        <form className="form_note_screen" onSubmit={(e) => handleSubmit(e)}>
          
          <div className='div_items_fields'>
            
            <div className='div_items_fields1'>
              <input    id='txtTitle' name='txtTitle' value={title} placeholder='הקלד כותרת'  type='text'  onChange={(e) => setTitle(e.target.value)}/>
              <textarea id='txtDesc'  name='txtDesc'  value={desc}  placeholder='הקלד הערות'  style={{fontSize: '23px', height: '100%'}} onChange={(e) => setDesc(e.target.value)}> </textarea>
            </div>

            <div className='div_items_fields2'>

              <div style={{display: 'flex', flexDirection: 'row', rowGap: '6px', justifyContent: 'space-between'}}>
                <Globals.FieldInScreen  captionText="סוג פריט"  fieldID="txt_typeListID" 
                  control={<Globals.FillCombox id="txt_typeListID"  data={dataListTypes} defaultValue={typeListID} style={{width: '250px', fontSize: '19px'}} onChangeFunc={setTypeListID}/>}
                />

                <Globals.FieldInScreen  captionText="מצב פריט"  fieldID="txt_statusID"
                  control={<Globals.FillCombox id="txt_statusID" data={dataStatuses}  defaultValue={statusID}   style={{width: '250px', fontSize: '19px'}} onChangeFunc={setStatusID}/>}
                />
              </div>

              <Globals.FieldInScreen  captionText="בחר תאריך יעד"  fieldID="txt_dateDue"
                control={<input id="txt_dateDue" name="txt_dateDue" type="datetime-local" value={dateDue} onChange={(e) => setDateDue(e.target.value)}></input>}
              />

              <Select 
                name="subjects"
                value={subjectsArray}
                options={dataSubject} 
                defaultValue={subjectsArray}
                isMulti 
                closeMenuOnSelect={false} 
                onChange={(e) => handleSubjectsChange(e)}
                isClearable={true}
                isRtl={true}
                //styles={colourStyles}
                // className="basic-single"
                // classNamePrefix="select"
                // isDisabled={isDisabled}
                // isLoading={isLoading}
                //isSearchable={isSearchable}
              />

              <div style={{display: 'flex', flexDirection: 'row', gap: '16px'}}>
                  <button type='button' style={{backgroundColor: 'green', color: 'white', height: '30px'}} onClick={(e) => handleShowSubTasksScreen()}>תת-משימות</button>
                  <button type='button' style={{backgroundColor: 'green', color: 'white', height: '30px'}} onClick={(e) => handleAddSubLine()}>תמונות</button>
              </div>

            </div>

          </div>


          <div className='div_buttons_row'>
            <div>
              <button type='submit' style={{backgroundColor: 'red', color: 'white'}} onClick={(e) => handleDelete(e)}>מחיקה</button>
              <label style={{color: '#B4B7BC', fontSize: '16px', paddingTop: '0px', paddingRight: '20px'}}>נערך לאחרונה: {lastUpdate}</label>
            </div>
            <button type='submit' className='button_save' onClick={saveObject}>שמירה</button>
          </div>
    
          {showSubTasksScreen /* || (selectedObject && selectedObject.SubTasks && selectedObject.SubTasks.length > 0) */  &&
                    <SonsPanel  noteObject={selectedObject} onClose={() => setShowSubTasksScreen(false)} onUpdateSubTasks={updateSons}/>
                    // <ShowSubLines  itemObject={selectedItem} subTaskList={subObjectsList} /*onDeleteSubTask={onDeleteSubTask}*//>
          }
        </form>
        
    );
}

// ---- Detail panel (the "Sons" form) -----------------------------------
function SonsPanel({ noteObject, onClose, onUpdateSubTasks }) 
{
  const subTasks = noteObject.SubTasks;


  const addRow = () => {
    const id = newRowId();
    onUpdateSubTasks(noteObject.NoteID, [...subTasks, { id: id,  FirebaseID: id, NoteID: noteObject.NoteID, IsDone: false, Title: "" }]);
  };

  const deleteRow = (rowId) => {
    onUpdateSubTasks(noteObject.NoteID, subTasks.filter((subTask) => subTask.FirebaseID !== rowId));
  };

  const toggleChecked = (rowId) => {
    onUpdateSubTasks(noteObject.NoteID, subTasks.map((subTask) => (subTask.id === rowId ? { ...subTask, IsDone: !subTask.IsDone } : subTask)));
  };

  const updateText = (rowId, value) => {
    onUpdateSubTasks(noteObject.NoteID, subTasks.map((subTask) => (subTask.id === rowId ? { ...subTask, Title: value } : subTask)))
  };


  return (

    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        justifyContent: "flex-end",
        fontFamily: "'sans-serif, Segoe UI', -apple-system, BlinkMacSystemFont",
        left: 10
      }}
    >

      {/* overlay */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(20, 28, 46, 0.45)",
        }}
      />

      {/* drawer */}
      <div
        style={{
          position: "relative",
          width: "min(480px, 92vw)",
          height: "100%",
          background: "#FBFAF8",
          boxShadow: "-12px 0 32px rgba(20,28,46,0.18)",
          display: "flex",
          flexDirection: "column",
          animation: "slideIn 0.22s ease-out",
        }}
      >
        <style>{`
          @keyframes slideIn {
            from { transform: translateX(24px); opacity: 0.6; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}</style>

        {/* header */}
        <div
          style={{
            padding: "22px 24px",
            borderBottom: "1px solid #E4E0D8",
            display: "flex",
            flexDirection: 'column',
            alignItems: "start",
            //justifyContent: "space-between",
            background: "#1B2A4A",
          }}
        >
    
          <div style={{display: 'flex', flexDirection: 'row', width: '100%', /* gap: '60px', */ justifyContent: 'space-between'/* , alignItems: 'space-between' */}}>
            <div
              style={{
                fontSize: 20,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#C9A15A",
                fontWeight: 700,
                marginBottom: 4,
                //display: 'flex',
                //flexDirection: 'row',
                //alignItems: 'center',
                //justifyContent: 'flex-end'
              }}
            >
              תתי-משימות
            </div>

            {/* <div style={{ fontSize: 19, fontWeight: 700, color: "#FBFAF8" }}>
              {noteObject.Title}
            </div> */}

            <button
              onClick={onClose}
              type='button'
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "none",
                borderRadius: 8,
                width: 29,
                height: 29,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#FBFAF8",
              }}
              aria-label="סגור"
            >
              X
              {/* <X size={18} /> */}
            </button>
          </div>

          <br/>

          <div
            style={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              marginBottom: 14,
            }}
            >
              <span style={{fontSize: 15, color: "#FBFAF8", fontWeight: 600, letterSpacing: "0.03em"}}>
                {subTasks.length} {"פריטים"}
              </span>
          </div>

        </div>



        {/* Main Rows Div */}
        <div style={{ flex: 1, overflowY: "auto", padding: "18px 24px" }}>
          
          {/* Sub Headers */}
          {subTasks.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "36px 12px",
                color: "#9CA3AF",
                fontSize: 14,
                border: "1.5px dashed #E4E0D8",
                borderRadius: 10,
              }}
            >
              אין תתי-משימות. לחץ על ׳הוסף׳
            </div>
          )}



          {/* Field Rowד entry */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {subTasks.map((row) => (
              <div
                key={row.FirebaseID}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "#fff",
                  border: "1px solid #E4E0D8",
                  borderRadius: 10,
                  padding: "10px 12px",
                }}
              >
                <input
                  type="checkbox"
                  checked={row.IsDone}
                  onChange={() => toggleChecked(row.id)}
                  style={{
                    width: 18,
                    height: 18,
                    accentColor: "#1B2A4A",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                />

                <input
                  type="text"
                  value={row.Title}
                  onChange={(e) => updateText(row.id, e.target.value)}
                  placeholder="הקלד טקסט..."
                  style={{
                    flex: 1,
                    border: "1px solid transparent",
                    background: "#F7F5F1",
                    borderRadius: 6,
                    padding: "7px 10px",
                    fontSize: 14,
                    color: "#1F2937",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#1B2A4A")}
                  onBlur={(e) => (e.target.style.borderColor = "transparent")}
                />

                <button
                  onClick={() => deleteRow(row.FirebaseID)}
                  type='button'
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    color: "#B0473F",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 6,
                    borderRadius: 6,
                    flexShrink: 0,
                    boxShadow: '0px 0px 0px transparent'
                  }}
                  aria-label="Delete row"
                  title="Delete row"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </div>

        </div>

        {/* footer */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #E4E0D8" }}>
          <button
            onClick={addRow}
            type='button'
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              background: "#1B2A4A",
              color: "#FBFAF8",
              border: "none",
              borderRadius: 9,
              padding: "11px 0",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Plus size={17} />
            הוסף שורה
          </button>
        </div>
      </div>
    </div>
  );
}

function Note()
{
  
  var note =
      {
          NoteID: 0,
          Title: '',
          Description: '',
          LastUpdateDate: '',
          CardBackColor: '',
          ParentNoteID: 0,
          ListTypeID: 1,
          StatusID: 1,
          PriorityID: 1,
          DateDue: '',
          //DateDueToDate: '',
          //TimeDue: '',
          SubTasks: [],
          //ListIndex: 0,
          IsFavorite: false,
          SubjectLabels: '',
          FirebaseID: '',
          //IsSelect: false,
          CreateUserID: 0,
          //Images: [],
          //CARD_BACKCOLOR_NOTE: '',
          //CARD_BACKCOLOR_CALENDAR_EVENT: ''
      };

      return note;
}

function NoteChild()
{
  var noteChild =
  {
      NoteID: 0,
      Title: '',
      IsDone: false,
      FirebaseID: ''
  };

  return noteChild;
}


// function ShowSubLines({ itemObject, subTaskList /* , onDeleteSubTask */ })
// {
//   const [subObjectsList, setSubObjectsList] = useState(subTaskList);


  
//   if (f_update_mode === 1)
//   {
//     f_update_mode = 2;
//     setSubObjectsList(subTaskList);
//   }

//   function handleDeleteSubLine(lineIndex)
//   {
//       console.log(subObjectsList[lineIndex].Title);
//       const removeItem = 
//               [
//               ...subObjectsList.slice(0, lineIndex),
//               ...subObjectsList.slice(lineIndex + 1)
//               ];
//       //const newArray = subLinesList.filter((e) => i !== subLinesList[lineIndex]);
//       setSubObjectsList(removeItem);

//       //onDeleteSubTask(lineIndex);
//   }


//   return (

//     <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px', padding: '10px', overflow: 'auto', maxHeight: '465px', paddingRight: '10px', direction: 'rtl', textAlign: 'right', backgroundColor: '#f9f9f9', border: '1px solid #ccc', borderRadius: '5px'}}>

//       <div style={{/* display: 'flex', flexDirection: 'column', */ gap: '0px', columnGap: '80px', border: '1px solid #ccc', padding: '10px', borderRadius: '5px', bakgroundColor: '#f9f9f9'}}>
//       {
//         subObjectsList.map((item, index) => (
//                 <CreateSubNewline 
//                     key={index}
//                     itemObject={item}
//                     defaultTitle={item.Title} 
//                     defaultIsDone={item.IsDone} 
//                     onDeleteLine={handleDeleteSubLine} 
//                     lineIndex={index} />
//         ))
//       }
//       </div>

//     </div>

//   );
// }

// function CreateSubNewline({defaultTitle, defaultIsDone, onDeleteLine, lineIndex, itemObject})
// {
//   const [title, setTitle] = useState(defaultTitle);
//   const [isDone, setIsDone] = useState(defaultIsDone);


//   if (f_update_mode === 2)
//   {
//     f_update_mode = 3;
//     setTitle(defaultTitle);
//     setIsDone(defaultIsDone);
//   }


//   function handleDeleteSubLine(lineIndex)
//   { 
//     //e.preventDefault();
//     console.log(lineIndex);
//     f_update_mode = 4;
//     onDeleteLine(lineIndex);
//   }
  


//   return (

//     <div style={{display: 'flex', flexDirection: 'row', rowGap: '10px', gap: '50px', padding: '10px', borderRadius: '5px', justifyContent: 'right', border: '1px solid #ccc', backgroundColor: '#f9f9f9'}}>
//       <label  name='lblLineIndex'  style={{fontSize: '20px', color: 'black', marginTop: '2px'}}> {(lineIndex < 9) ? `0${lineIndex+1}` : lineIndex+1} </label>
//       <input  type="checkbox"   checked={isDone} onChange={(e) => setIsDone(e.target.checked)}  style={{height: '25', width: '25px', marginTop: '2px', backgroundColor: 'red', color: 'black'}}/> 
//       <textarea  type="multilines" value={title} maxLength={200}  onChange={(e) => setTitle(e.target.value)} style={{color: 'black', backgroundColor: 'yellow', width: '350px', direction: 'rtl', textAlign: 'right'}}/>
//       <button name='btnDeleteLine' type='button' onClick={(e) => handleDeleteSubLine(lineIndex)} style={{backgroundColor: 'transparent', color: 'black', height: '30px', width: '30px', marginTop: '0px', paddingTop: '25px'}}>
//         X
//       </button>
//     </div>

//   );

// }

/// Not in Use
// function DatabaseChoose({ selectedItem, onSelectedItem })
// {

//   const [windowEl, setWindowEl] = useState(document.getElementById('floatingWindow'));
//   const [overlayEl, setOverlayEl] = useState(document.getElementById('windowOverlay'));

//   function toggleWindow(show) 
//   {
//     if (show) 
//       {
//         windowEl.style.display = 'block';
//         overlayEl.style.display = 'block';
//     } 
//     else 
//       {
//         windowEl.style.display = 'none';
//         overlayEl.style.display = 'none';
//     }
//   }


//   return (

//     <div style={{display: 'none', position: 'fixed', flexDirection: 'column', gap: '10px', marginTop: '10px'}}>
//       <h1>בחר מסד נתונים</h1>
//       <p>Click the button below to see the floating window in action.</p>
      
//       {/* <!-- Trigger Button --> */}
//       <button onclick={toggleWindow(true)}>Open Floating Window</button>

//       {/* <!-- Overlay background component --> */}
//       <div class="overlay" id="windowOverlay" onclick={toggleWindow(false)}></div>

//       {/* <!-- Floating Window Structure --> */}
//       <div class="floating-window" id="floatingWindow">
//           <div class="window-header">
//               <span>Notification</span>
//               <button class="close-btn" onclick={toggleWindow(false)}>&times;</button>
//           </div>

//           <div class="window-content">
//               <p>This is a custom floating window built using clean HTML, CSS, and basic JavaScript.</p>

//               <select value={selectedItem} onChange={(e) => onSelectedItem(Number(e.target.value))}>
//               {
//                 FirebaseHanle.DataBasesConfigList.map((item, index) =>
//                 (
//                   <option value={index} key={index}>{item.projectId} {index+1}</option>
//                 ))  
//               }
//               </select>
//           </div>
//       </div>
    
      
//     </div>

//   );
// }

// function ShowMessageBox2({title, defaultValue, withTextbox}) 
// {
//   const [isOpen, setIsOpen] = useState(false);
//   const [inputValue, setInputValue] = useState(defaultValue);
//   const [answer, setAnswer] = useState(null);
//   const dialogRef = useRef(null);
//   //const isOpen = true;


//   if (f_update_mode)
//   {
//       f_update_mode = false;
//       // Focus the dialog seamlessly when it opens
//       setTimeout(() => dialogRef.current?.showModal(), 0);
//   }

//   // const openPrompt = () => {
//   //     setIsOpen(true);
//   //     // Focus the dialog seamlessly when it opens
//   //     setTimeout(() => dialogRef.current?.showModal(), 0);
//   // };

//   const handleClose = (action) => {
//       setIsOpen(false);
//       dialogRef.current?.close();

//       if (action === 'yes') 
//       {
//          setAnswer('yes');
//       } 
//       else 
//       {
//          setInputValue('no'); 
//       }
//       return action;
//   };

//   return (

//     <div >
//       {/* <button onClick={openPrompt}>Open Prompt</button> */}

//       {isOpen && (
//         <dialog ref={dialogRef} style={{ width: '400px', height: '200px', padding: '20px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
//           <h3>{title}</h3>
          
//           { withTextbox && <input 
//                               type="text" 
//                               value={""} 
//                               style={{backgroundColor: '#aba1ab', color: 'white'}}
//                               onChange={(e) => setInputValue(e.target.value) } 
//                               />
//           }

//           <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'row', gap: '20px' }}>
//             <button style={{height: '30px', fontSize: '16px', paddingTop: '26px'}} onClick={() => handleClose('no')}>ביטול</button>
//             <button style={{height: '30px', fontSize: '16px', paddingTop: '26px'}} onClick={() => handleClose('yes')}>אישור</button>
//           </div>
//         </dialog>
//       )}

//       {/* {answer && <p>You entered: {answer}</p>} */}
//     </div>

//   );
// }



// function ShowInput()
// {
//   const [username, setUsername] = useState('');
//   const [error, setError] = useState('');



//   // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   //   const value = e.target.value;
//   //   setUsername(value);

//   //   // Dynamic simple validation
//   //   if (value.length < 3) {
//   //     setError('Username must be at least 3 characters long.');
//   //   } else {
//   //     setError('');
//   //   }
//   // };


//   return (
//     <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
//       <h2>Sign Up Form</h2>
      
//       <InputBox
//         id="username"
//         label="Username"
//         type="text"
//         placeholder="Enter your username"
//         value={username}
//         onChange= {null}      //{handleChange}
//         error={error}
//       />

//       <p>Current State Value: <strong>{username}</strong></p>
//     </div>
//   );
// }
