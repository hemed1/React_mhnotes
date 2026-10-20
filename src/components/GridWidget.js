

import { useState, useMemo } from 'react';
import './gridWidget.css'; // קובץ העיצוב שלנו
import { GridEdited }  from '../globals.js';
import { SaveIcon, Edit3, Edit, Trash2 /*, Calendar1Icon */} from "lucide-react";




var itemsToSave = [];
export var f_grid_mode = 0;



export function GridWidget( {data, title, tableName, arrayColumns, 
                            top, left, width, height,
                            onSaveFuncName, backgroundColor = '#454545b3'} )     /*  'transparent'*/
{
   const [dataItems, setDataItems] = useState(data);
   const [selectedRowIndex, setSelectedRowIndex] = useState(0);
   const [isEditMode, setIsEditMode] = useState(false);
   const [sortDirection, setSortDirection] = useState('asc');
   const [sortFieldName, setSortFieldName] = useState(arrayColumns[0].fieldName);
   const [searchArray, setSearchArray] = useState([]);
   


   /// First time after change item
   if (f_grid_mode === 0)
   {
      //sortFieldName = arrayColumns[0].fieldName;
      setSortFieldName(arrayColumns[0].fieldName);
      itemsToSave = [];
      //setItemsToSave([]);
      f_grid_mode = 1;
      var list = [];
      for (var i=0; i<arrayColumns.length; i++)
      {
         list.push({id: i, value: ''});
      }
      setSearchArray(list);
   }


   const index = arrayColumns.findIndex((item) => item.fieldName === sortFieldName);
   var _type = 'string';
   if (index > -1)
   {
      _type = arrayColumns[index].type;
   }
      
   const sortedProducts = useMemo(() => 
                        {
                           switch (_type)
                           {
                              case 'number':
                                 if (sortDirection === 'asc')
                                 {
                                    return [...dataItems].sort((a, b) => Number(a[sortFieldName]) - Number(b[sortFieldName]));
                                 }
                                 else
                                 {
                                    return [...dataItems].sort((a, b) => Number(b[sortFieldName]) - Number(a[sortFieldName]));
                                 }
                                 //break;

                              case 'bool':
                                 if (sortDirection === 'asc')
                                 {
                                    return [...dataItems].sort((a, b) => Number(a[sortFieldName]) - Number(b[sortFieldName]));
                                 }
                                 else
                                 {
                                    return [...dataItems].sort((a, b) => Number(b[sortFieldName]) - Number(a[sortFieldName]));
                                 }
                                 //break;

                              case 'date':
                                 // if (sortDirection === 'asc')
                                 // {
                                 //    return [...dataItems].sort((a, b) =>    
                                 //             (new Date(String(a[sortFieldName]).substring(0, 16).replace('T', ', ').replace(', ', ' ')))
                                 //             - 
                                 //             (new Date(String(b[sortFieldName]).substring(0, 16).replace('T', ', ').replace(', ', ' '))) 
                                 //          );
                                 // }
                                 // else
                                 // {
                                 //    return [...dataItems].sort((a, b) =>                
                                 //             (new Date(String(b[sortFieldName]).substring(0, 16).replace('T', ', ').replace(', ', ' ')))
                                 //             - 
                                 //             (new Date(String(a[sortFieldName]).substring(0, 16).replace('T', ', ').replace(', ', ' '))) 
                                 //          );
                                 // }
                                 break;

                              case 'string': 
                              default:
                                 if (sortDirection === 'asc')
                                 {
                                    return [...dataItems].sort((a, b) => String(a[sortFieldName]).localeCompare(String(b[sortFieldName])));
                                 }
                                 else
                                 {
                                    return [...dataItems].sort((a, b) => String(b[sortFieldName]).localeCompare(String(a[sortFieldName])));
                                 }
                                 //break;
                           }
                        
   }, [dataItems, sortFieldName, sortDirection, _type]);
    
   var keepID = null;

   // פונקציה לעדכון תא ספציפי לפי שורה ועמודה
   const updateCell = (targetRowIndex, targetColIndex, recordID, newValue) => 
         {
            setDataItems(prevGrid => 
                        {
                           var resultItems = [...dataItems];
                           var updatedItem = null;
                           let id;

                           const item = prevGrid.find((item3) => item3[getIDValue(item3)[0]] === recordID);
                           
                           if (item)
                           {
                              /// Find the ID of the record
                              id = getIDValue(item)[1];
                              if (id===null && item["Title"] !== null && item["Title"] !== undefined && item["Title"] !== '' )
                              {
                                 try
                                 {
                                    item["FirebaseID"] = item.Title;
                                 }
                                 catch (error) 
                                 {
                                    console.log(error);
                                 } 
                              }

                              if (keepID === null)
                              {
                                 keepID = id;
                              }

                              // Update Specific Cell with new value
                              for (let c = 0; c < arrayColumns.length; c++)
                              {
                                 const col = Object.keys(item).findIndex(key => key === arrayColumns[c].fieldName);
                                 if (col > -1 && c === targetColIndex)            /* && item.id === recordID */
                                 {
                                    var data = null;
                                    switch (arrayColumns[c].type)
                                    {
                                       case 'number':
                                          data = Number(newValue);
                                          break;
                                       case 'bool':
                                          data = Boolean(newValue);
                                          break;
                                       case 'date':
                                          data = new Date(newValue);
                                          break;
                                       case 'string':
                                       default:
                                          data = newValue;
                                          break;
                                    }

                                    /// When exaption record without id
                                    if (arrayColumns[c].fieldName === 'FirebaseID')
                                    {
                                       const tmp = keepID;
                                       const foundItem2 = itemsToSave.find(item => item.FirebaseID === tmp && item.row === targetRowIndex && item.col === targetColIndex);
                                       if (foundItem2 && item.Title !== item.FirebaseID)
                                       {
                                          foundItem2.FirebaseID = data;
                                          keepID = foundItem2.FirebaseID;
                                       }
                                    }

                                    /// Update direcrtly the item with new data
                                    item[arrayColumns[c].fieldName] = data;
                                    updatedItem = {...item} ;
                                    
                                    /// Add to array of chaged records (itemsToSave   )
                                    const keep = keepID;;
                                    const foundItem = itemsToSave.find(item2 => item2.id === keep && item2.row === targetRowIndex && item2.col === targetColIndex);
                                    if (!foundItem) 
                                    {
                                       const newEdit = new GridEdited(keep, targetRowIndex, targetColIndex, data, item, arrayColumns[c].fieldName);
                                       itemsToSave.push(newEdit);
                                    }
                                    else
                                    {
                                       foundItem.value = data;
                                    }
                                    
                                    break;
                                 }  
                              }
                           }

                           /// Update
                           if (updatedItem && updatedItem !== null)
                           {
                              resultItems = [...dataItems].map((item2, index2) => 
                                 (item2['FirebaseID']!== undefined && item2.FirebaseID===updatedItem.FirebaseID) ||
                                 (item2['id']!== undefined && item2.id===updatedItem.id) ||
                                 (item2['ID']!== undefined && item2.ID===updatedItem.ID)
                                 ? updatedItem 
                                 : item2 );
                              //return updatedItem;
                           }
         
                           return resultItems;
                        }
            );
         };




  async function handleSaveChanges()
  {
    
    const newData = await onSaveFuncName(tableName, itemsToSave);

    setDataItems(newData);
    
    itemsToSave = []; // נקה את הרשימה לאחר השמירה
    setIsEditMode(false);
  }

  function handleEndEdit()
  {
      //control.value = isEditMode ? 'מצב עריכה' : 'עריכה'
      setIsEditMode(!isEditMode);
  }

  function handleSort( fieldName )
  {
      //sortFieldName = fieldName;
      setSortFieldName(fieldName);

      const direction = sortDirection === 'asc' ? 'desc' : 'asc';
      setSortDirection(direction);
  }

  function handleDeleteRecord()
  {
      const newEdit = new GridEdited(sortedProducts[selectedRowIndex].id, selectedRowIndex, 0, 'deleted', sortedProducts[selectedRowIndex], sortFieldName);
      const foundItem = itemsToSave.find((edit) => edit.id === newEdit.id && edit.row === selectedRowIndex);
      if (!foundItem) 
      {
         itemsToSave.push(newEdit);
      }
      else
      {
         const index = itemsToSave.findIndex((edit) => edit.id === newEdit.id && edit.row === selectedRowIndex);
         itemsToSave.splice(index, 1);
      }

      // Just to refresh state
      setSortDirection(sortDirection);
  }

  function getRowColor(item, itemsToSave, rowIndex, defaultColor) 
  {
      const itemObject = itemsToSave.find((edit) => edit.id === item.id /* && edit.row === rowIndex */);

      if (!itemObject)
      {
         return defaultColor;
      }
      
      if (itemObject.value==='deleted')
      {
         return 'red'; 
      }
      else
      {
         return 'green';
      }

      //return defaultColor
  }

  function handleSearch(colIndex, value)
  {
      var original = [...searchArray];

      // for (var i=0; i< searchArray.length; i++)
      // {
         const updatedItem = {...original[colIndex], value: value };
         const resultItems = original.map((item, index) => (index===colIndex) ? updatedItem : item );
         original = resultItems;
      // }

      setSearchArray(original);
  }

  function handleFilter(mode)
  {
      switch (mode)
      {
         default:
         case 1:   // Today
            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];
            handleSearch(arrayColumns.findIndex((item) => item.fieldName === 'DateDue'), todayStr);
            break;
      }
  }

  function getIDValue(record)
  {
      if (record['FirebaseID']!== undefined && record['FirebaseID']!== null)
      {
         return ['FirebaseID', record['FirebaseID']];
      }
      else if (record['id']!== undefined && record['id']!== null)
      {
         return ['id', record['id']];
      }
      else if (record['ID']!== undefined && record['ID']!== null)
      {
         return ['ID', record['ID']];
      }

      return null;
  }





  return (

    <form className="page-container" style={{marginRight:'25px', marginLeft:'25px', top: top, /* left: left, */ maxWidth: width, height: height, backgroundColor: backgroundColor}}>
      
      <h2 style={{textAlign: 'center', color: 'white'}}>{title}</h2>

      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: '15px', paddingLeft: '10px', paddingRight: '10px', paddingTop: '10px'}}>
         <button type="button" onClick={handleSaveChanges} style={{width: '70px', display: 'flex', padding: '5px 10px', backgroundColor: 'red' ,  color: 'white', border: 'none', borderRadius: '4px'}} title="שמירת שינויים" >
            <SaveIcon size={25} />
         </button>
         <button type="button" onClick={handleEndEdit} style={{width: '70px', display: 'flex', padding: '5px 10px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '4px'}} title="עריכה" >
               {isEditMode  && <Edit3 size={25} />}
               {!isEditMode && <Edit size={25} />}
         </button>
         <button type="button" onClick={(e) => handleDeleteRecord()} style={{width: '70px', display: 'flex', padding: '5px 10px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '4px'}} title="מחיקה" >
               {isEditMode  && <Trash2 size={25} />}
               {!isEditMode && <Trash2 size={25} />}
         </button>
         {/* <button type="button" onClick={(e) => handleFilter(1)} style={{width: '70px', display: 'flex', padding: '5px 10px', backgroundColor: '#ffa94d',  color: 'white', border: 'none', borderRadius: '4px'}} title="להיום" >
            <Calendar1Icon size={25} />
         </button> */}

      </div>
     

      <div className="grid-container" >

         {/* // Search */}
         <div style={{display: 'flex', flexDirection: 'row', gap: '1px', paddingRight: '6px'}}>
            {searchArray.map((col, colIndex) =>
               <input type="text"
                     style={{
                              backgroundColor: 'rgba(164, 201, 237, 0.5)', 
                              color: '#fff',
                              minWidth: arrayColumns[colIndex].width,      //String(Number(arrayColumns[colIndex].width.substring(0, arrayColumns[colIndex].width.length - 2))-10)+'px',  
                              paddingLeft: '7px', 
                              paddingRight: '7px', 
                              marginBottom: '7px',
                              marginLeft: '0px',
                              marginRight: '0px',
                              boxSizing: 'border-box' }}    /* , minWidth: '3000px'   */
                     value={String(col['value'])}
                     onChange={(e) => handleSearch(colIndex, e.target.value)}/>
            )}
         </div>


         <table  style={{tableLayout: 'fixed', borderCollapse: 'collapse'}}>   
            
            {/* // Headers Caption */}
            <thead style={{position: 'sticky', top: '0' , zIndex: '3', textAlign: 'center'}}>
               <tr className='grid-headers'>
                  {arrayColumns.map((col , index) => 
                  (
                     <th key={index} className='gridCol' style={{width: col.width, textAlign: 'center'}} onClick={() => handleSort(col.fieldName)}>{col.caption}</th>
                  ))}
               </tr>  
            </thead>  


            <tbody>

            {
               sortedProducts
                     .filter((item) => 
                           {
                              var found = true;
                              for (var i=0; i<searchArray.length; i++)
                              {
                                 const obj = searchArray[i]; 
                                 const value = String(obj.value).trim();
                                 found = (( value !== '')  
                                          ? (String(item[arrayColumns[i].fieldName]).indexOf(value)>-1)
                                          : true)
                                 if (!found)
                                 {
                                    break;
                                 }
                                 // searchArray.map((e, colIndex) => (
                                 //          (String(e.value).trim() !== '')  
                                 //          ? (String(item[arrayColumns[colIndex].fieldName]).indexOf(String(e.value).trim())>-1)
                                 //          : true
                                 //   )
                                 //)
                              }
                              return found;
                           })

                     .map((item, rowIndex) => 
                     (
                        <tr key={rowIndex} className={`row-item ${ selectedRowIndex === rowIndex ? "selected" : ""}`}  
                           style={{color: getRowColor(item, itemsToSave, rowIndex, 'black')}}
                           onClick={(e) => setSelectedRowIndex(rowIndex)}>
                        {
                           arrayColumns.map((col, colIndex) => 
                           (
                              <td key={colIndex} className='gridCol' title={item[col.fieldName]} 
                                  style={{
                                    width: col.width, 
                                    color: getRowColor(item, itemsToSave, rowIndex, col.color), 
                                    direction: (col.fieldName!=='FirebaseID' || col.type==='date') ? 'rtl' : 'ltr', 
                                    textAlign: (col.fieldName!=='FirebaseID' || col.type==='date') ? 'right' : 'left'}}> 
                                 {
                                    !isEditMode
                                       ?  (col.lookupTable === undefined || col.lookupTable === null || col.lookupTable.length === 0) 
                                          ? String(item[col.fieldName]) 
                                          : (col.lookupTable.find((lookupItem) => lookupItem.value === item[col.fieldName]))?.label || String(item[col.fieldName])
                                       : <input 
                                          type='text'     //{(col.type==='number') ? "number": "text"}
                                          style={{width: String(Number(col.width.substring(0, col.width.length - 2))-25)+'px'}}
                                          value={String(item[col.fieldName])}
                                          onChange={(e) => updateCell(rowIndex, colIndex, (getIDValue(item)[1]!=null ? getIDValue(item)[1] : item.Title), e.target.value)}
                                        />
                                 }
                              </td>
                           ))
                        }
                        </tr>
                     ))
            }

            </tbody>

         </table> 

         
      </div>


    </form>

  );

}


export function GridReset()
{
   f_grid_mode = 0;
} 



