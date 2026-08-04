

import { useState } from 'react';
import './gridWidget.css'; // קובץ העיצוב שלנו
// import { Wheat } from 'lucide-react';


export default function GridWidget( data ) 
{
   const [dataItems/* , setDataItems */] = useState(data);
   // const [selectedRow, setSelectedRow] = useState(1);

   if (!dataItems)
   {
      return (
         <form className="page-container">
            <h1>הגריד שלי ב-React</h1>
         </form>
      )
   }

  // נתוני דוגמה לפריטים ברשת
  const items = [
    { id: 1, title: 'כרטיס 1', desc: 'תוכן כרטיס ראשון' },
    { id: 2, title: 'כרטיס 2', desc: 'תוכן כרטיס שני' },
    { id: 3, title: 'כרטיס 3', desc: 'תוכן כרטיס שלישי' },
    { id: 4, title: 'כרטיס 4', desc: 'תוכן כרטיס רביעי' },
  ];

  return (

    <form className="page-container">
      <h1 style={{textAlign: 'center', color: 'white'}}>הגריד שלי ב-React</h1>
      
      <br/>
      <hr/>
      <br/>
      
      {/* מעטפת הגריד הראשי */}
      <div className="grid-container">
        {/* <table /* style={{borderCollapse: 'separate', borderSpacing: '40px 20px'}}> */}

         {items.map((item) => (

            // <div key={item.id} className="grid-item"  /* onClick={setSelectedRow(item.id)} */>     {/* ${(selectedRow === item.id) ? "selected" : ""} */}
               
               <tr key={item.id} className="grid-item" /* onClick={setSelectedRow(item.id)} */>
                  <td className='gridCol' style={{color: 'red'}}>{item.id}</td>
                  <td className='gridCol' style={{color: 'green'}}>{item.title}</td>
                  <td className='gridCol' style={{color: 'orange'}}>{item.desc}</td>
               </tr>

            // </div>
            )
         )}

       {/* </table> */}
      </div>
    </form>

  );

}


//  {/* מעטפת הגריד הראשי */}
// <div className="grid-container">
//    {items.map((item) => (
//       <div key={item.id} className="grid-item">
//       <h3>{item.title}</h3>
//       <p>{item.desc}</p>
//       </div>
//    ))}
// </div>


