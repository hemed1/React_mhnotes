

import './App.css';
import './styles.css';
import { useState, useMemo } from 'react';
import {GetTableData, UpdateField, InsertRecord, UpdateRecord, DeleteRecord, GetTable, database} from './firebase';


const texes = [
  {
    title: "Where are these chairs assembled?",
    text: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusantium, quaerat temporibus quas dolore provident nisi ut aliquid ratione beatae sequi aspernatur veniam repellendus."
  },
  {
    title: "How long do I have to return my chair?",
    text: "Pariatur recusandae dignissimos fuga voluptas unde optio nesciunt commodi beatae, explicabo natus."
  },
  {
    title: "Do you ship to countries outside the EU?",
    text:"Excepturi velit laborum, perspiciatis nemo perferendis reiciendis aliquam possimus dolor sed! Dolore laborum ducimus veritatis facere molestias!"
  }
];


// enum saveModeEn {
//     INSERT: 1,
//     UPDATE: 2,
//     DELETE: 3,
// }

var data = [];
var dataBaseTable = [];
var dataListTypes = [];
var dataStatuses = [];

/// Fields controller vars
var f_update_mode = true;
var f_sort_mode = true;
var f_load_db = true;
// var f_title = '';
// var f_desc = '';
// var f_listTypeID = 3;
// var f_statusID = 1;
// var f_dateDue = Date().toLocaleString('en-IL', { timeZone: 'Asia/Jerusalem' }).replace(', ', 'T'); 





export default function App() {
  
  const [selectedItem, setSelectedItem] = useState(null);


  init();

  
  function handleSelectItem(selectedItem)
  { 
    f_update_mode = true;
  
    setSelectedItem((curr) => curr?.NoteID === selectedItem.NoteID ? null : selectedItem);
  }

  return (

    <div className="app">


      <ListData 
          data={data} 
          selectedItem ={selectedItem} 
          onSelectedItem={handleSelectItem}
          sortByField="title" />

      {selectedItem && 
          <NoteScreen 
              selectedItem={selectedItem} 
              onSelectedItem={handleSelectItem} />
      }

    </div>

  );

}

async function init(){

  await getData();

}

async function getData() {

  // if (!f_load_db)
  // {
  //   return null;
  // }

  data = /* await */ GetTableData("TBL_Notes");

  dataBaseTable = /* await */ GetTableData("TBL_Databases");

  dataListTypes = /* await */ GetTableData('TBL_ListTypes');
  dataStatuses = /* await */ GetTableData('TBL_Statuses');
  
  f_load_db = false;

  return data;
}

function ListData({data, selectedItem, onSelectedItem, sortByField}) {
  
  const [currOpenIndex, setCurrOpenIndex] = useState(null);
  const [items, setItems] = useState(null);
  const [sortBy, setSortBy] = useState('date_update'); 
  const [searchText, setSearchText] = useState('');

  
  // Compute the sorted array dynamically 
  const sortedProducts = useMemo(() => 
                          {
                            switch (sortBy)
                            {
                              case 'date_update':
                                //const sorted = [...data].sort((a, b) => (new Date(b.LastUpdateDate)) - (new Date(a.LastUpdateDate)));
                                //const sorted = data.toSorted((a, b) => (new Date(b.LastUpdateDate))/* .getTime() */ - (new Date(a.LastUpdateDate))/* .getTime() */);
                                return [...data].sort((a, b) => 
                                                  (
                                                    (new Date(String(b.LastUpdateDate.substring(0, 16).replace('T', ' ').replace(', ', ' '))))
                                                    - 
                                                    (new Date(String(a.LastUpdateDate.substring(0, 16).replace('T', ' ').replace(', ', ' '))))
                                                  ));
                                break;
                            
                              case 'date_due':
                                //const sorted = [...data].sort((a, b) => (new Date(a.DateDue)) - (new Date(b.DateDue)));
                                //const sorted = data.toSorted((a, b) => (new Date(a.DateDue))/* .getTime() */ - (new Date(b.DateDue))/* .getTime() */);
                                return [...data].sort((a, b) => 
                                                  (new Date(String(b.DateDue).substring(0, 16).replace('T', ', ').replace(', ', ' '))) 
                                                  - 
                                                  (new Date(String(a.DateDue).substring(0, 16).replace('T', ', ').replace(', ', ' '))));
                                break;
                            
                              case 'title': 
                                return [...data].sort((a, b) => String(a.Title).localeCompare(String(b.Title)));
                                break;
                              
                              case 'today':
                                const today = new Date()/* .getTime() */;
                                //const target = new Date('2026-06-15, 10:30')/* .getTime() */;
                                //console.log(target.toDateString() + "  -  " + today.toDateString());
                                return [...data].filter((item) => (new Date(item.DateDue)).toDateString() === today.toDateString());
                                break;

                              default:
                                return [...data].sort((a, b) => (new Date(b.LastUpdateDate)) - (new Date(a.LastUpdateDate)));;
                                break;
                          }
                        }, [data, sortBy]);



  function handleSearchText(e, text)
  {
    e.preventDefault();
    setSearchText(text);
  }

  function handleChange(e, text)
  {
    e.preventDefault();
    setSortBy(text);
  }

  function handleInsert()
  {
      const itemObject = Note();

      onSelectedItem(itemObject);
  }



  return (
    
        <div style={{display: 'flex', flexDirection: 'column', rowGap: '15px', marginTop: '30px', marginRight: '50px'}}>

          <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            <div style={{display: 'flex', flexDirection: 'row', gap: '40px', justifyContent: 'space-between'}}>
              <button type='button' onClick={(e, text) => handleChange(e, 'title')}>כותרת</button>
              <button type='button' onClick={(e, text) => handleChange(e, 'date_due')}>תאריך ביצוע</button>
              <button type='button' onClick={(e, text) => handleChange(e, 'date_update')}>תאריך עדכון</button>
              <button type='button' onClick={(e, text) => handleChange(e, 'today')}>להיום</button>
              <button type='button' style={{width: '60px', backgroundColor: 'green', color: 'white'}}  onClick={handleInsert}>חדש</button>
            </div>
            <input type='text' value={searchText} placeholder='חפש...'  onChange={(e) => setSearchText(e.target.value)}   style={{height: '40px', width: '700px'}}></input>
          </div>

          <form className="accordion">
            <ul className='list' key="friend-list">
            {
              sortedProducts
                        .filter(item => 
                            (String(searchText) !== '')  
                            ? ((String(item.Title).indexOf(searchText)>-1) || (String(item.Description).indexOf(searchText)>-1))
                            : true
                        )
                        .map((item, index) => 
                        (
                          <ListDataItem   newIndex={index} 
                                          currOpenIndex={currOpenIndex}
                                          itemObject={item}
                                          selectedItem={selectedItem}
                                          onSelectedItem={onSelectedItem}
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
 
function ListDataItem({newIndex, currOpenIndex, itemObject, selectedItem, onSelectedItem, children}) {

  const isSelected = selectedItem?.id === itemObject.id;
  const [isOpen, setIsOpen] = useState(false);     //(newIndex === currOpenIndex);

  //console.log(String(newIndex), itemObject.DateDue.substring(0, 16), itemObject.LastUpdateDate.substring(0, 16));


  return(
   
    <li className={`item ${isSelected /* || isOpen */ ? "open" : ""}`} onClick={() => onSelectedItem(itemObject)}>
      <p className='number'>{(newIndex < 9) ? `0${newIndex+1}` : newIndex+1}</p>
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

function NoteScreen({ selectedItem, onSelectedItem }) 
{

    /// Controls values
    const [title, setTitle] = useState(selectedItem?.Title || '');
    const [desc, setDesc] = useState(selectedItem?.Description || '');
    const [typeListID, setTypeListID] = useState(selectedItem?.ListTypeID || 3);
    const [statusID, setStatusID] = useState(selectedItem?.StatusID || 1);
    const [dateDue, setDateDue] = useState(selectedItem?.DateDue || Date().toLocaleString('en-IL', { timeZone: 'Asia/Jerusalem' }).replace(', ', 'T'));

    const [saveMode, setSaveMode] = useState((selectedItem?.NoteID===0) ? 1 : 2);    //saveModeEn.UPDATE;
    

    if (f_update_mode)
    {
      f_update_mode = false;
      setTitle(selectedItem?.Title);
      setDesc(selectedItem?.Description);
      setTypeListID(selectedItem?.ListTypeID);
      setStatusID(selectedItem?.StatusID);
      setDateDue(selectedItem.DateDue);
      //if (selectedItem.NoteID === 0)
      //{
        //handleInsert();
      //}
    }

    // TODO:
    // if (saveMode === 1)
    // {
    //   if (document.getElementById("txtTitle") !== null)
    //   {
    //     document.getElementById("txtTitle").focus();
    //   }
    // }


    async function handleSubmit(e)
    {
      e.preventDefault();

      await handleOK(e);
    }

    async function handleDelete(e)
    {
      //e.preventDefault();
      setSaveMode(3); //saveModeEn.DELETE;
      
      //handleOK(e);
    }

    function handleInsert()
    {
      setSaveMode(1); //saveModeEn.NEW;
      
      //document.getElementById("title").focus();
    }

    async function handleOK(e)
    {
      e.preventDefault();

      var result = null;
      var values = selectedItem;


      switch (saveMode)
      {
        case 1:   //saveModeEn.INSERT:
          values = selectedItem;
          values['Title'] = String(title).trim();
          values['Description'] = String(desc).trim();
          values['ListTypeID'] = typeListID;
          values['StatusID'] = statusID;
          values.DateDue = dateDue;
          values.FirebaseID='';
          const noteID = Number(dataBaseTable[0].NumeratorNotesID)+1;
          values['NoteID'] = noteID;
          result = await InsertRecord("TBL_Notes", values);
          result = await UpdateField('TBL_Databases', dataBaseTable[0].FirebaseID, {NumeratorNotesID: noteID});
          setSaveMode(2);
          if (result !== '')
          {
            alert("הפריט נוסף בהצלחה!");
          }
          else
          {
            alert("שגיאה בהוספת הפריט!");
          } 
          onSelectedItem(values);
          break;

        case 2:   //saveModeEn.UPDATE:
          values = selectedItem;
          values['Title'] = String(title).trim();
          values['Description'] = String(desc).trim();
          values['ListTypeID'] = typeListID;
          values['StatusID'] = statusID;
          //console.log(String(values.LastUpdateDate).substring(0, 10) + '   ' + values.LastUpdateDate);
          values.DateDue = dateDue;
          result = await UpdateRecord("TBL_Notes", selectedItem.FirebaseID, values);
          if (result)
          {
            alert("עידכון הפריט עבר בהצלחה!");
          }
          else
          {
            alert("שגיאה בעידכון הפריט!");
          } 
          break;

        case 3:   //saveModeEn.DELETE:
          result = await DeleteRecord("TBL_Notes", selectedItem.FirebaseID);
          setSaveMode(2);
          if (result)
          {
            alert("הפריט נמחק בהצלחה!");
          }
          else
          {
            alert("שגיאה בפעולת המחיקה!");
          } 
          break;

        default:
          break;
      }

    }
    
  

    return (

        <form className="form_note_screen" onSubmit={(e) => handleSubmit(e)}>
          
          <div className='div_items_fields'>
            <div className='div_items_fields1'>
              <input    id='txtTitle' name='txtTitle' value={title} placeholder='הקלד כותרת' type='text'  onChange={(e) => setTitle(e.target.value)}/>
              <textarea id='txtDesc' name='txtDesc'  value={desc}  placeholder='הקלד הערות'  style={{height: '100%'}} onChange={(e) => setDesc(e.target.value)}> </textarea>
            </div>

            <div className='div_items_fields2'>

              <div style={{display: 'flex', flexDirection: 'row', rowGap: '6px', justifyContent: 'space-between'}}>
                <FieldInScreen  captionText="סוג פריט"  fieldID="txt_typeListID" 
                  control={<FillCombox id="txt_typeListID"  data={dataListTypes} defaultValue={typeListID} style={{width: '250px', fontSize: 19}} onChangeFunc={setTypeListID} mode={3}/>}
                />

                <FieldInScreen  captionText="מצב פריט"  fieldID="txt_statusID"
                  control={<FillCombox id="txt_statusID" data={dataStatuses}  defaultValue={statusID}   style={{width: '250px', fontSize: 19}} onChangeFunc={setStatusID} mode={4}/>}
                />
              </div>

              <FieldInScreen  captionText="בחר תאריך יעד"  fieldID="txt_dateDue"
                control={<input id="txt_dateDue" type="datetime-local" id="start-date" name="trip-start" value={dateDue} onChange={(e) => setDateDue(e.target.value)}></input>}
              />
              
            </div>
          </div>


          <div className='div_buttons_row'>
            {/* <div style={{display: 'flex', width: '580px', justifyContent: 'space-evenly'}}> */}
              <button type='submit' style={{backgroundColor: 'red', color: 'white'}} onClick={(e) => handleDelete(e)}>מחיקה</button>
            {/* </div> */}
            <button type='submit' className='button_save' onClick={handleOK}>שמירה</button>
          </div>
    
        </form>
        
    );
}

function FieldInScreen({ captionText, fieldID, control }){

  return (
      
      <div style={{display: 'flex', flexDirection: 'column', rowGap: '6px'}}>
        <label htmlFor={fieldID}>{captionText}</label>
        {control}
      </div>
  );
}

function FillCombox({data, defaultValue, style, onChangeFunc, mode})
{
  const [currentValue, setCurrentValue] = useState(defaultValue);
  
  //const data = GetTableData(tableName);

  //const [tableData, setDataTable] = useState([]);
  // if (tableData.length === 0)
  // {
  //const data = GetTableData(tableName);
  //  setDataTable(dataListTypes);
  // }
  
  function handleChoose(e)
  {
    setCurrentValue(Number(e.target.value));
  }


  return (
    <select value={defaultValue} onChange={(e) => onChangeFunc(e.target.value)} style={style}>
    {
        data.map((e) => (
                          <option value={e.ID} key={e.ID}>                       
                              {e.Description}
                          </option>
                        ))
    }
    </select> 
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
          //SubTasks: [],
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