

import { useState, useMemo } from 'react';
import './gridWidget.css'; // קובץ העיצוב שלנו
import { GridEdited }  from '../globals.js';
import { SaveIcon, Edit3, Edit, DeleteIcon} from "lucide-react";


//let edit = {id: 0,row: 0, col: 0, value: '', itemObject: {}, fieldName: ''};
var itemsToSave = [];
export var f_grid_mode = 0;
//var sortFieldName = '';



export function GridWidget( {data, title, tableName, arrayColumns, 
                            top, left, width, height,
                            onSaveFuncName, backgroundColor = '#454545b3'} ) 
{
   const [dataItems, setDataItems] = useState(data);
   const [selectedRowIndex, setSelectedRowIndex] = useState(0);
   const [isEditMode, setIsEditMode] = useState(false);
   const [sortDirection, setSortDirection] = useState('asc');
   const [sortFieldName, setSortFieldName] = useState(arrayColumns[0].fieldName);
   //const [itemsToSave, setItemsToSave] = useState([]);
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
                                 if (sortDirection === 'asc')
                                 {
                                    return [...dataItems].sort((a, b) =>    
                                             (new Date(String(a[sortFieldName]).substring(0, 16).replace('T', ', ').replace(', ', ' ')))
                                             - 
                                             (new Date(String(b[sortFieldName]).substring(0, 16).replace('T', ', ').replace(', ', ' '))) 
                                          );
                                 }
                                 else
                                 {
                                    return [...dataItems].sort((a, b) =>                
                                             (new Date(String(b[sortFieldName]).substring(0, 16).replace('T', ', ').replace(', ', ' ')))
                                             - 
                                             (new Date(String(a[sortFieldName]).substring(0, 16).replace('T', ', ').replace(', ', ' '))) 
                                          );
                                 }
                                 //break;

                              case 'string': 
                              default:
                                 if (sortDirection === 'asc')
                                 {
                                    //return [...dataItems].sort((a, b) => String(a[sortFieldName]) - String(b[sortFieldName]));
                                    return [...dataItems].sort((a, b) => String(a[sortFieldName]).localeCompare(String(b[sortFieldName])));
                                 }
                                 else
                                 {
                                    //return [...dataItems].sort((a, b) => String(b[sortFieldName]) - String(a[sortFieldName]));
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
                           var resultItems = [];
                           
                           prevGrid.map((item, index) =>  
                           {
                              var updatedItem = null;
                              /// When exaption record without id
                              if (item["id"] === null || item["id"] === undefined || item["id"] === '')
                              {
                                 item["id"] = item.Title;
                              }

                              /// Find the specific record by its ID
                              if (item.id === recordID)
                              {
                                 if (keepID === null)
                                 {
                                    /// When exaption record without id
                                    if (item["FirebaseID"] === null || item["FirebaseID"] === undefined || item["FirebaseID"] === '')
                                    {
                                       item["FirebaseID"] = keepID;
                                       if (item["Title"] !== null && item["Title"] !== undefined && item["Title"] !== '' )
                                       {
                                          keepID = item["Title"];
                                       }
                                    }
                                    else
                                    {  
                                       /// When Very exaption record without id
                                       if (item["Title"] === item["id"])
                                       {
                                          keepID = item["id"];
                                       }
                                       else
                                       {
                                          keepID = item["FirebaseID"];
                                       }
                                    }
                                 }

                                 // Update Specific Cell with new value
                                 for (let c = 0; c < arrayColumns.length; c++)
                                 {
                                    const col = Object.keys(item).findIndex(key => key === arrayColumns[c].fieldName);
                                    if (col > -1 && c === targetColIndex /* && item.id === recordID */ /* && index === targetRowIndex */  /* && newValue !== item[arrayColumns[c].fieldName] */) 
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
                                          const foundItem2 = itemsToSave.find(item => item.id === tmp && item.row === targetRowIndex && item.col === targetColIndex);
                                          if (foundItem2 && item.Title !== item.id)
                                          {
                                             foundItem2.id = data;
                                             keepID = foundItem2.id;
                                          }
                                       }

                                       /// Update direcrtly the item with new data
                                       //updatedItem = { ...item, [arrayColumns[c].fieldName]: data };
                                       item[arrayColumns[c].fieldName] = data;
                                       updatedItem = {...item}      //, [arrayColumns[c].fieldName]: data };
                                      
                                       /// Addd to array of chaged records (itemsToSave   )
                                       const keep = keepID;;
                                       const foundItem = itemsToSave.find(item => item.id === keep && item.row === targetRowIndex && item.col === targetColIndex);
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

                              if (updatedItem && updatedItem !== null)
                              {
                                 resultItems = [...dataItems].map((item2, index2) => (item2.id===updatedItem.FirebaseID) ? updatedItem : item2 );
                                 
                                 return updatedItem;
                              }
                              else
                              {
                                 return item;
                              }
                           });
         
                           return resultItems;
                        }
            );
            //setSelectedRowIndex(selectedRowIndex);
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





  return (

    <form className="page-container" style={{marginRight:'25px', marginLeft:'25px', top: top, /* left: left, */ maxWidth: width, height: height, backgroundColor: backgroundColor}}>
      
      <h2 style={{textAlign: 'center', color: 'white'}}>{title}</h2>

      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: '15px', paddingLeft: '10px', paddingRight: '10px'}}>
         <button type="button" onClick={handleSaveChanges} style={{display: 'flex', padding: '5px 10px', backgroundColor: 'red' ,  color: 'white', border: 'none', borderRadius: '4px'}} title="שמירת שינויים" >
            <SaveIcon size={15} />
         </button>
         <button type="button" onClick={handleEndEdit}     style={{display: 'flex', padding: '5px 10px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '4px'}} title="עריכה" >
               {isEditMode  && <Edit3 size={15} />}
               {!isEditMode && <Edit size={15} />}
         </button>
         <button type="button" onClick={(e) => handleDeleteRecord()} style={{display: 'flex', padding: '5px 10px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '4px'}} title="מחיקה" >
               {isEditMode  && <DeleteIcon size={15} />}
               {!isEditMode && <DeleteIcon size={15} />}
         </button>
         <div style={{display: 'flex', justifyContent: 'flex-end', width: '100%', paddingTop: '5px'}}>
            <p style={{textAlign: 'left', color: 'white'}}>{tableName}</p>
         </div>
      </div>
     

      <div className="grid-container" >

         {/* // Search */}
         <div style={{display: 'flex', flexDirection: 'row', gap: '1px', paddingRight: '6px'}}>
            {searchArray.map((col, colIndex) =>
               <input type="text"  /* className='gridCol' */
                     style={{ /*display: 'flex' , flexDirection: 'row' , gap: '0px',*/
                              backgroundColor: 'rgba(164, 201, 237, 0.5)', 
                              color: '#fff',
                              minWidth: arrayColumns[colIndex].width,      //String(Number(arrayColumns[colIndex].width.substring(0, arrayColumns[colIndex].width.length - 2))-10)+'px',  
                              paddingLeft: '7px', 
                              paddingRight: '7px', 
                              marginBottom: '7px',
                              marginLeft: '0px',
                              boxSizing: 'border-box' }}    /* , minWidth: '3000px'   */
                     value={String(col['value'])}
                     onChange={(e) => handleSearch(colIndex, e.target.value)}/>
            )}
         </div>

         <table  style={{tableLayout: 'fixed', borderCollapse: 'collapse' /* width: '100%', */  /* , maxWidth: '2000px', maxHeight: '720px' */}}>   
            
            <thead>
               {/* // Headers Caption */}
               <tr className='grid-headers'>
                     {arrayColumns.map((col , index) => 
                     (
                        <th key={index} className='gridCol' style={{width: col.width, position: 'sticky', top: '0',  zIndex: '2'}} onClick={() => handleSort(col.fieldName)}>{col.caption}</th>
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

                     .map((item, rowIndex) => (
                        <tr key={rowIndex} className={`row-item ${ selectedRowIndex === rowIndex ? "selected" : ""}`}  
                           style={{color: getRowColor(item, itemsToSave, rowIndex, 'black')}}
                           onClick={(e) => setSelectedRowIndex(rowIndex)}>
                        {
                           arrayColumns.map((col, colIndex) => (
                           
                              <td key={colIndex} className='gridCol' title={item[col.fieldName]} style={{width: col.width, color: getRowColor(item, itemsToSave, rowIndex, col.color)}}> 
                                 {
                                    !isEditMode
                                       ? String(item[col.fieldName])
                                       // ? (String(item[col.fieldName]).length > 40)
                                       //       ? String(item[col.fieldName]).substring(0, 30) + '...'
                                       //       : String(item[col.fieldName])
                                       : 
                                       <input 
                                          type='text'     //{(col.type==='number') ? "number": "text"}
                                          style={{width: String(Number(col.width.substring(0, col.width.length - 2))-25)+'px'/* , boxSizing: 'border-box' */}}
                                          value={String(item[col.fieldName])}
                                          onChange={(e) => updateCell(rowIndex, colIndex, (item["id"] === null || item["id"] === undefined || item["id"] === '') ? item.Title : item["id"], e.target.value)}
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



