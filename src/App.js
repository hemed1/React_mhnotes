

import './App.css';
import './styles.css';
import { useState } from 'react';
import {GetTableData, UpdateField, InsertRecord, UpdateRecord, DeleteRecord, GetTable} from './firebase';

// TAODO:
// enum saveModeEn {
//   INSERT = 'idle',
//   UPDATE = 'loading',
//   DELETE = 'success',
// }

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

var data = [];
var dataListTypes = [];
var dataStatuses = [];

/// Fields controller vars
var f_update_mode = true;
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
    // f_title = selectedItem.Title;
    // f_desc = selectedItem.Description;
    // f_listTypeID = Number(selectedItem.ListTypeID);
    // f_statusID = Number(selectedItem.StatusID);
    // f_dateDue = selectedItem.DateDue.replace(' ', 'T');

    setSelectedItem((curr) => curr?.NoteID === selectedItem.NoteID ? null : selectedItem);
    console.log(selectedItem.Title);
  }

  return (

    <div className="app">
    
      <ListData 
          data={data} 
          selectedItem ={selectedItem} 
          onSelectedItem={handleSelectItem} />

      {selectedItem && 
          <NoteScreen 
              selectedItem={selectedItem}/>}

    </div>

  );

}

function init(){

  getData();

}

function getData() {

  data = GetTableData("TBL_Notes");

  dataListTypes = GetTableData('TBL_ListTypes');
  dataStatuses = GetTableData('TBL_Statuses');
  

  return data;
}

function ListData({data, selectedItem, onSelectedItem}) {
  
  const [currOpenIndex, setCurrOpenIndex] = useState(null);


  return (
      
      <form className="accordion">

        <ul className='list' key="friend-list">
        {
          data.map((e, index) => (
                                    <ListDataItem   newIndex={index} 
                                                    currOpenIndex={currOpenIndex}
                                                    itemObject={e}
                                                    selectedItem={selectedItem}
                                                    onSelectedItem={onSelectedItem}
                                                    key={index}
                                    >
                                        {e.Description}
                                    </ListDataItem>
                        ))
        }
        </ul>
      </form>

  );



}
 
function ListDataItem({newIndex, currOpenIndex, itemObject, selectedItem, onSelectedItem, children}) {

  const isSelected = selectedItem?.id === itemObject.id;
  const [isOpen, setIsOpen] = useState(false);     //(newIndex === currOpenIndex);


  return(
   
    <li className={`item ${isSelected ? "open" : ""}`} onClick={() => onSelectedItem(itemObject)}>
      <p className='number'>{(newIndex < 9) ? `0${newIndex+1}` : newIndex+1}</p>
      <p className='title'>{itemObject.Title}</p>
      <button type="button" className='icon' onClick={(e) => {
                                                e.stopPropagation();
                                                setIsOpen(!isOpen);
                                              }}>
        {isOpen ? "-" : "+"}
      </button>
      {isOpen && 
          <div className='content-box'>{children}</div>
      }
    </li>
  );

}

function NoteScreen({ selectedItem }) {

    /// Controls values
    const [title, setTitle] = useState(selectedItem?.Title || '');
    const [desc, setDesc] = useState(selectedItem?.Description || '');
    const [typeListID, setTypeListID] = useState(selectedItem?.ListTypeID || 3);
    const [statusID, setStatusID] = useState(selectedItem?.StatusID || 1);
    const [dateDue, setDateDue] = useState(selectedItem?.StatusID || Date().toLocaleString('en-IL', { timeZone: 'Asia/Jerusalem' }).replace(', ', 'T'));

    const [saveMode, setSaveMode] = useState(2);    //saveModeEn.UPDATE;
    

    if (f_update_mode)
    {
      f_update_mode = false;
      setTitle(selectedItem?.Title);
      setDesc(selectedItem?.Description);
      setTypeListID(selectedItem?.ListTypeID);
      setStatusID(selectedItem?.StatusID);
      setDateDue(selectedItem.DateDue);
    }

    function handleTextChange(mode, value) {
      switch (mode) {
        case 1:
          //f_title = value;
          setTitle(value)
          break;
        case 2:
          //f_desc = value;
          setDesc(value);
          break;
        case 3:
          //f_listTypeID = Number(value);
          setTypeListID(Number(value));
          break;
        case 4:
          //f_statusID = Number(value);
          setStatusID(Number(value));
          break;
        case 5:
          //f_dateDue = value.replace(', ', 'T');
          setDateDue(value);
          break;
        default:
          break;
      }
    }

    function handleSubmit(e)
    {
      e.preventDefault();

      //handleOK(e);

    }

    async function handleDelete(e)
    {
      setSaveMode(3); //saveModeEn.DELETE;
      await handleOK(e);
    }

    function handleInsert()
    {
        setSaveMode(1);   //  saveModeEn.INSERT;
        setTitle('');  //TODO:
        setDesc('');
    }

    async function handleOK(e)
    {
      e.preventDefault();
      //saveMode = saveModeEn.UPDATE;

      var result = null;
      var values = selectedItem;


      switch (saveMode)
      {
        case 1:   //saveModeEn.INSERT:
          values = selectedItem;
          values['Title'] = title;
          values['Description'] = desc;
          values['ListTypeID'] = typeListID;
          values['StatusID'] = statusID;
          values.DateDue = dateDue;
          result = await InsertRecord("TBL_Notes", values);
          if (result !== '')
          {
            alert("המשימה נוספה בהצלחה!");
          }
          else
          {
            alert("שגיאה בהוספת המשימה!");
          } 
          break;

        case 2:   //saveModeEn.UPDATE:
          values = selectedItem;
          values['Title'] = title;
          values['Description'] = desc;
          values['ListTypeID'] = typeListID;
          values['StatusID'] = statusID;
          values.DateDue = dateDue;
          result = await UpdateRecord("TBL_Notes", selectedItem.FirebaseID, values);
          if (result)
          {
            alert("העידכון נשמר בהצלחה!");
          }
          else
          {
            alert("שגיאה בעידכון!");
          } 
          break;

        case 3:   //saveModeEn.DELETE:
          result = await DeleteRecord("TBL_Notes", selectedItem.FirebaseID);
          if (result)
          {
            alert("המשימה נמחקה בהצלחה!");
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

      <form className="form_note_screen" onSubmit={handleSubmit}>
        
        <div className='div_items_fields'>
          <div className='div_items_fields1'>
            <input    id='title' value={title} placeholder='הקלד כותרת' type='text'  onChange={(e) => setTitle(e.target.value)}/>
            <textarea id='desc'  value={desc}  placeholder='הקלד הערות'  style={{height: '100%'}} onChange={(e) => setDesc(e.target.value)}> </textarea>
          </div>

          <div className='div_items_fields2'>

            <div style={{display: 'flex', flexDirection: 'row', rowGap: '6px', justifyContent: 'space-between'}}>
              
              <FieldInScreen  captionText="סוג פריט"  fieldID="txt_typeListID">
                <FillCombox id="txt_typeListID"  data={dataListTypes} defaultValue={typeListID} style={{width: '250px', fontSize: 19}} onChangeFunc={setTypeListID} mode={3}/>
              </FieldInScreen>

              <FieldInScreen  captionText="מצב פריט"  fieldID="txt_statusID">
                <FillCombox id="txt_statusID" data={dataStatuses}  defaultValue={statusID}   style={{width: '250px', fontSize: 19}} onChangeFunc={setStatusID} mode={4}/>
              </FieldInScreen>
            </div>

            <FieldInScreen  captionText="בחר תאריך יעד"  fieldID="txt_dateDue">
              <input id="txt_dateDue" type="datetime-local" id="start-date" name="trip-start" value={dateDue} onChange={(e) => setDateDue(e.target.value)}></input>   {/* 'date' */}
            </FieldInScreen>
            
          </div>
        </div>


         <div className='div_buttons_row' style={{justifyContent: 'space-between'}}>
          <div style={{display: 'flex', width: '580px', justifyContent: 'space-evenly'}}>
            <button type='button' onClick={handleDelete}>מחיקה</button>
            <button type='button' onClick={handleInsert}>חדש</button>
          </div>
          <button type='submit' className='button_save' onClick={handleOK}>שמירה</button>
        </div>

        
      </form>
    );
}

function FieldInScreen({ captionText, fieldID, children }){

  return (
      
      <div style={{display: 'flex', flexDirection: 'column', rowGap: '6px'}}>
        <label for={fieldID}>{captionText}</label>
        {children}
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