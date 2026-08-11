

import { useState, useMemo } from 'react';
import './gridWidget.css'; // קובץ העיצוב שלנו
import { GridEdited }  from '../globals.js';
import { SaveIcon, Edit3, Edit, DeleteIcon} from "lucide-react";


let edit = {id: 0,row: 0, col: 0, value: '', itemObject: {}, fieldName: ''};
var itemsToSave = [];
var f_grid_mode = 0;
//var sortFieldName = '';



export function GridWidget( {data, title, tableName, arrayColumns, 
                                     top, left, width, height,
                                     onSaveFuncName, backgroundColor = '#e6e4e4'} ) 
{
   const [dataItems, setDataItems] = useState(data);
   const [selectedRowIndex, setSelectedRowIndex] = useState(0);
   const [isEditMode, setIsEditMode] = useState(false);
   const [sortDirection, setSortDirection] = useState('asc');
   const [sortFieldName, setSortFieldName] = useState(arrayColumns[0].fieldName);
   //const [itemsToSave, setItemsToSave] = useState([]);

   
   /// First time after change item
   if (f_grid_mode === 0)
   {
      //sortFieldName = arrayColumns[0].fieldName;
      setSortFieldName(arrayColumns[0].fieldName);
      itemsToSave = [];
      //setItemsToSave([]);
      f_grid_mode = 1;
   }


   const index = arrayColumns.findIndex((item) => item.fieldName === sortFieldName);
   var _type = 'string';
   if (index > -1)
   {
      _type = arrayColumns[index].type;
   }
      
   var sortedProducts = useMemo(() => 
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
    

   // פונקציה לעדכון תא ספציפי לפי שורה ועמודה
   const updateCell = (targetRowIndex, targetColIndex, newValue) => 
         {
            setDataItems(prevGrid => 
                        {
                           var resultItems = [];
                           
                           prevGrid.map((item, index) => 
                           {
                              //var foundItem = null;
                              var updatedItem = null;
                              // Change Specific Cell with new value
                              for (let c = 0; c < arrayColumns.length; c++)
                              {
                                 const col = Object.keys(item).findIndex(key => key === arrayColumns[c].fieldName);
                                 // אם הגענו בדיוק לתא שרצינו לעדכן - נחזיר את הערך החדש
                                 if (col > -1 && index === targetRowIndex && c === targetColIndex /* && newValue !== item[arrayColumns[c].fieldName] */) 
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

                                    updatedItem = { ...item, [arrayColumns[c].fieldName]: data };
                                    item[arrayColumns[c].fieldName] = data;
                                    
                                    const foundItem = itemsToSave.find(edit => edit.id === item.FirebaseID && edit.row === targetRowIndex && edit.col === targetColIndex);
                                    if (!foundItem) 
                                    {
                                       const newEdit = new GridEdited(item.FirebaseID, targetRowIndex, targetColIndex, data, item, arrayColumns[c].fieldName);
                                       itemsToSave.push(newEdit);
                                       //setItemsToSave(itemsToSave);
                                    }
                                    else
                                    {
                                       foundItem.value = data;
                                       //const list = itemsToSave.map(edit => (edit.id===foundItem.id) ? foundItem : edit);
                                       //setItemsToSave(list);
                                    }
                                    
                                    break;
                                 }  
                              }

                              if (updatedItem && updatedItem !== null)
                              {
                                 //dataItems.splice(index, 1);
                                 //const {...newItem} = updatedItem;
                                 //resultItems = [...prevGrid, foundItem];
                                 //const [ item, ...tmpItems ] = dataItems;
                                  //resultItems.push(updatedItem);
                                 resultItems = [...dataItems].map(e => (e.FirebaseID===updatedItem.FirebaseID) ? updatedItem : e );    //, updatedItem];
                                 setDataItems(resultItems);
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
         };


  async function handleSaveChanges()
  {
    
    const newData = await onSaveFuncName(tableName, itemsToSave);

    setDataItems(newData);
    //itemsToSave = []; // נקה את הרשימה לאחר השמירה
    //setIsEditMode(false);
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
      const newEdit = new GridEdited(sortedProducts[selectedRowIndex].FirebaseID, selectedRowIndex, 0, 'deleted', sortedProducts[selectedRowIndex], sortFieldName);
      const foundItem = itemsToSave.find(edit => edit.id === newEdit.id && edit.row === selectedRowIndex);
      if (!foundItem) 
      {
         itemsToSave.push(newEdit);
         //setItemsToSave(itemsToSave);
      }
      else
      {
         const index = itemsToSave.findIndex(edit => edit.id === newEdit.id && edit.row === selectedRowIndex);
         //const [ foundItem, ...tmpItems ] = itemsToSave;
         itemsToSave.splice(index, 1);
         //setItemsToSave(itemsToSave);
         //itemsToSave = tmpItems;
         //const res = [...itemsToSave].filter(item => !(item.id === res.id && edit.row === selectedRowIndex));
         //itemsToSave = res;
      }
  }



  return (

    <form className="page-container" style={{top: top, left: left, width: width, height: height, backgroundColor: backgroundColor}}>
      
      <h2 style={{textAlign: 'center', color: 'black'}}>{title}</h2>
      
      {/* <hr/> */}

      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: '15px', paddingLeft: '10px', paddingRight: '10px'}}>
         <button type="button" onClick={handleSaveChanges} style={{display: 'flex', padding: '5px 10px', backgroundColor: 'red' ,  color: 'white', border: 'none', borderRadius: '4px'}} title="שמירת שינויים" >
            <SaveIcon size={15} />
         </button>
         <button type="button" onClick={handleEndEdit}     style={{display: 'flex', padding: '5px 10px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '4px'}} title="עריכה" >
               {isEditMode  && <Edit3 size={15} />}
               {!isEditMode && <Edit size={15} />}
         </button>
         <button type="button" onClick={(e) => handleDeleteRecord()} style={{display: 'flex', padding: '5px 10px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '4px'}} title="עריכה" >
               {isEditMode  && <DeleteIcon size={15} />}
               {!isEditMode && <DeleteIcon size={15} />}
         </button>
         <div style={{display: 'flex', justifyContent: 'flex-end', width: '100%', paddingTop: '5px'}}>
            <p style={{textAlign: 'left'}}>{tableName}</p>
         </div>
      </div>
     

      <table >

         <tr style={{backgroundColor: 'lightblue', color: 'black', direction: 'rtl', display: 'flex', flexDirection: 'row', 
                     borderBottom: '2px solid #212020', alignItems: 'center', paddingLeft: '20px', paddingRight: '4px', borderRadius: '5px'}}>
               {arrayColumns.map((col , index) => (
                  <th key={index} className='gridCol' style={{width: col.width}} onClick={() => handleSort(col.fieldName)}>{col.caption}</th>
               ))}
         </tr>
      
         <div className="grid-container" style={{maxHeight: String(Number(height.substring(0, height.length - 2)) - 170)+'px'}}>
         {
            sortedProducts.map((item, rowIndex) => (
               <tr key={rowIndex} className={`row-item ${ selectedRowIndex === rowIndex ? "selected" : ""}`}  
                  style={{color: (itemsToSave.find(edit => edit.id === item.FirebaseID && edit.row === rowIndex))
                     ? (itemsToSave.find(edit => edit.id === item.FirebaseID && edit.row === rowIndex).value==='deleted') 
                        ? 'red' 
                        : 'black'
                     : 'black'
                  }}  
                  onClick={() => setSelectedRowIndex(rowIndex)}>
               {
                  arrayColumns.map((col, colIndex) => (
                     
                     <td className='gridCol' title={item[col.fieldName]} style={{color: (itemsToSave.find(edit => edit.id === item.FirebaseID && edit.row === rowIndex)) ? 'red' : col.color, width: col.width}} >
                           {
                              !isEditMode
                                 ? (String(item[col.fieldName]).length > 40)
                                       ? String(item[col.fieldName]).substring(0, 40) + '...'
                                       : String(item[col.fieldName])
                                 : 
                                 <input 
                                    type="text"
                                    style={{width: String(Number(col.width.substring(0, col.width.length - 2))-25)+'px'/* , boxSizing: 'border-box' */}}
                                    value={String(item[col.fieldName])}
                                    onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                                 />
                           }
                     </td>
                  ))
               }
               </tr>
            ))
         }
         </div>

      </table>

    </form>

  );

}


export function GridReset()
{
   f_grid_mode = 0;
} 



 
         // items.map((item) => (
         //    // <div key={item.id} className="grid-item"  /* onClick={setSelectedRow(item.id)} */>     {/* ${(selectedRow === item.id) ? "selected" : ""} */}  
         //       <tr key={item.id} className="grid-item" /* onClick={setSelectedRow(item.id)} */>
         //          <td className='gridCol' style={{color: 'red'}}>{item.id}</td>
         //          <td className='gridCol' style={{color: 'green'}}>{item.title}</td>
         //          <td className='gridCol' style={{color: 'orange'}}>{item.desc}</td>
         //       </tr>
            // </div>
//  {/* מעטפת הגריד הראשי */}
// <div className="grid-container">
//    {items.map((item) => (
//       <div key={item.id} className="grid-item">
//       <h3>{item.title}</h3>
//       <p>{item.desc}</p>
//       </div>
//    ))}
// </div>


