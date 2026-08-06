

import { useState } from 'react';
import './gridWidget.css'; // קובץ העיצוב שלנו
import { GridEdited }  from '../globals.js';
// import { Wheat } from 'lucide-react';

let edit = {id: 0,row: 0, col: 0, value: '', itemObject: {}, fieldName: ''};
var itemsToSave = [];


export default function GridWidget( {data, arrayColumns, onSaveFuncName, backgroundColor = 'white', selectRowColor = '#e9b9e4c6'} ) 
{
   const [dataItems, setDataItems] = useState(data);
   const [selectedRowIndex, setSelectedRowIndex] = useState(0);
   const [isEditMode, setIsEditMode] = useState(false);


  // נתוני דוגמה לפריטים ברשת
//   const items = [
//     { id: 1, title: 'כרטיס 1', desc: 'תוכן כרטיס ראשון' },
//     { id: 2, title: 'כרטיס 2', desc: 'תוכן כרטיס שני' },
//     { id: 3, title: 'כרטיס 3', desc: 'תוכן כרטיס שלישי' },
//     { id: 4, title: 'כרטיס 4', desc: 'תוכן כרטיס רביעי' },
//   ];

   // פונקציה לעדכון תא ספציפי לפי שורה ועמודה
   const updateCell = (targetRowIndex, targetColIndex, newValue) => {
    setDataItems(prevGrid => 
                {
                  var items = [];
                  prevGrid.map((item, index) =>
                  {
                     // Change Specific Cell with new value
                     for (let c = 0; c < arrayColumns.length; c++)
                     {
                        const col = Object.keys(item).findIndex(key => key === arrayColumns[c].fieldName);
                        // אם הגענו בדיוק לתא שרצינו לעדכן - נחזיר את הערך החדש
                        if (col > -1 && index === targetRowIndex && c === targetColIndex /* && newValue !== item[arrayColumns[c].fieldName] */) 
                        {
                           item[arrayColumns[c].fieldName] = newValue;
                           const res = itemsToSave.find(edit => edit.id === item.id && edit.row === targetRowIndex && edit.col === targetColIndex);
                           if (!res) 
                           {
                              const newEdit = new GridEdited(item.id, targetRowIndex, targetColIndex, newValue, item, arrayColumns[c].fieldName);
                              itemsToSave.push(newEdit);
                           }
                           else
                           {
                              res.value = newValue;
                           }
                           break; // יציאה מהלולאה לאחר עדכון התא
                        }  
                     }
                     items.push(item);
                  });
                  //setSelectedRowIndex(targetRowIndex);
                  return items;
                }
     );
  };

  async function handleSaveChanges()
  {
    //console.log('Items to save:', itemsToSave);
    
    await onSaveFuncName(itemsToSave);

    //itemsToSave = []; // נקה את הרשימה לאחר השמירה
    //setIsEditMode(false);
  }

  function handleEndEdit()
  {
      //control.value = isEditMode ? 'מצב עריכה' : 'עריכה'
      setIsEditMode(!isEditMode);
  }


  return (

    <form className="page-container">
      <h2 style={{textAlign: 'center', color: 'white'}}>הגריד שלי ב-React</h2>
      
      <br/>
      <hr/>
      <div style={{display: 'flex', justifyContent: 'flex-end', gap: '20px'}}>
         <input type="button" onClick={handleSaveChanges} style={{width: '100px', padding: '5px 10px', backgroundColor: 'red' ,  color: 'white', border: 'none', borderRadius: '4px'}} value="שמירת שינויים" />
         <input type="button" onClick={handleEndEdit}     style={{width: '100px', padding: '5px 10px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '4px'}} value="עריכה" />
      </div>
      <br/> 
      <br/>

      <table style={{borderCollapse: 'separate', borderSpacing: '40px 20px'}}>

         <tr style={{backgroundColor: 'lightblue', color: 'black', direction: 'rtl', display: 'flex', flexDirection: 'row', borderBottom: '2px solid #212020', alignItems: 'center', paddingLeft: '10px', paddingRight: '10px', borderRadius: '5px'}}>
               {arrayColumns.map((col, index) => (
                  <th key={index} className='gridCol' style={{width: col.width}}>{col.caption}</th>
               ))}
         </tr>

      
         <div className="grid-container">
         {
            dataItems.map((item, rowIndex) => (
               <tr key={rowIndex} className={`row-item ${ selectedRowIndex === rowIndex ? "selected" : ""}`} style={{}}  onClick={() => setSelectedRowIndex(rowIndex)}>
            
                  {
                     arrayColumns.map((col, colIndex) => (
                        
                        <td className='gridCol' title={item[col.fieldName]} style={{color: col.color, width: col.width}} onDoubleClick={() => updateCell(rowIndex, colIndex, 'X')}>
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


