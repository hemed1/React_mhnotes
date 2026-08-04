
//import { exp } from 'firebase/firestore/pipelines';
import React from 'react';
import { useState, useEffect, useRef } from 'react';


export function dateSetFormat(date)
{
   var result = new Date(date)

   // console.log(result.toLocaleString());
   // console.log(result.toDateString());
   
   //var result = date.toLocaleDateString('en-US', { weekday: 'long' }); 
   //var result = date.toLocaleString().substring(0, 16).replace(', ', ' ')/* .replace(".", "-",) */;

   var res = String(result.getFullYear()) + '-' + String(result.getMonth() + 1).padStart(2, '0') + '-' + String(result.getDate()).padStart(2, '0');
   res += ' ' + String(result.getHours()).padStart(2, '0') + ':' + String(result.getMinutes()).padStart(2, '0');


   return res;
}

export function InputBox(
                  { 
                     label, 
                     type = 'text', 
                     value, 
                     onChange, 
                     placeholder, 
                     error, 
                     ...props 
                  })

{
      return (
         <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1rem', gap: '0.5rem' }}>
            {label && <label style={{ fontWeight: '600', fontSize: '14px' }}>{label}</label>}
            
            <input
               type={type}
               value={value}
               onChange={onChange}
               placeholder={placeholder}
               style={{
                  padding: '10px',
                  borderRadius: '4px',
                  border: error ? '1px solid red' : '1px solid #ccc',
                  fontSize: '16px',
                  outline: 'none'
               }}
               {...props}
            />
            
            {error && <span style={{ color: 'red', fontSize: '12px' }}>{error}</span>}
         </div>
      );
};

export function FieldInScreen({ captionText, fieldID, control }){

  return (
      
      <div style={{display: 'flex', flexDirection: 'column', rowGap: '6px'}}>
        <label htmlFor={fieldID}>{captionText}</label>
        {control}
      </div>
  );
}

export function FillCombox({data, defaultValue, style, onChangeFunc})
{
  //const [currentValue, setCurrentValue] = useState(defaultValue);
  
  
  function handleChange(e)
  {
    onChangeFunc(Number(e.target.value));
    //setCurrentValue(e.target.value);
  }


  return (
    <select value={defaultValue} onChange={(e) => handleChange(e)} style={style}>
    {
        data.map((e) => (
                          <option value={e.value} key={e.value}>                       
                              {e.label}
                          </option>
                        ))
    }
    </select> 
  );

}

export async function ShowMessageBox(title, defaultValue, withTextbox) 
{
//   const [isOpen, setIsOpen] = useState(false);
//   const [inputValue, setInputValue] = useState(defaultValue);
//   const [answer, setAnswer] = useState(null);
   const dialogRef = useRef(null);
   const isOpen = true;

  // const openPrompt = () => {
  //     //setIsOpen(true);
  //     // Focus the dialog seamlessly when it opens
  //     setTimeout(() => dialogRef.current?.showModal(), 0);
  // };

  const handleClose = (action) => {
      //setIsOpen(false);
      dialogRef.current?.close();

      if (action === 'yes') 
      {
         //setAnswer(inputValue);
      } 
      else 
      {
         //setInputValue('no'); 
      }
      return action;
  };

  return (

    <div >
      {/* <button onClick={openPrompt}>Open Prompt</button> */}

      {isOpen && (
        <dialog ref={dialogRef} style={{ width: '200px', height: '80px', padding: '20px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3>{title}</h3>
          
          { withTextbox && <input 
                              type="text" 
                              value={""} 
                              style={{backgroundColor: '#aba1ab', color: 'white'}}
                              /* onChange={(e) => setInputValue(e.target.value) }*/ 
                              />
          }

          <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'row', gap: '20px' }}>
            <button style={{height: '30px', fontSize: '16px', paddingTop: '26px'}} onClick={() => handleClose('no')}>ביטול</button>
            <button style={{height: '30px', fontSize: '16px', paddingTop: '26px'}} onClick={() => handleClose('yes')}>אישור</button>
          </div>
        </dialog>
      )}

      {/* {answer && <p>You entered: {answer}</p>} */}
    </div>

  );
}

//// Transfer from Seperate string, to Lookup Array
export function seperatedStringToLookupObject(fieldValue, lookupValues)
{
  var elements = [];
  
  if (String(fieldValue).trim() === '')
  {
    return elements;
  }

  const strList = String(fieldValue).split(', ')
  for (let i = 0; i < strList.length; i++) 
  {
    const foundList = [...lookupValues].filter((item) => String(item.label) === String(strList[i]));
    if (foundList.length>0)
    {
      //elements = ([foundList[0], ...elements]);
      elements.push(foundList[0]);
    }
  }


  return elements;
}

/// Transfer From combo objects to seperated string
export function lookupObjectToSeperatedString(lookupObject)
{
    const strList = lookupObject.map((item) =>  String(item.label) );
    const result = strList.join(", ");

    return result;
}

/// Add field to Object
export function addFieldToObject(prevObj, fieldNameToAdd)
{
    // const addField = () => {
  //         setSelectedObject(prevUser => (
  //                             {
  //                               ...prevUser,       // 1. Copy all existing properties
  //                               SubTasks: []  // 2. Add the new property
  //                             }
  //                         ));
  //                       };
//  const addField = (  (prevObj) => 
//                       {
//                         const { SubTasks: [], ...newObj } = prevObj; 
//                         return newObj; 
//                       }
//                     );
  //selectedItem = addField(selectedItem);

    return {...prevObj, [fieldNameToAdd]: []};
}

/// Remove field fron Object
export function removeFieldFromObject(prevObject, fieldNameToRemove )
{
  // const removeField = ( (prevList) => 
  //                       {
  //                         const { SubTasks, ...newlist } = prevList; 
  //                         return newlist; 
  //                       });
  //values = removeField(values);
  // const removeItem = (keyToRemove) => {
  //       setSelectedObject(prevObject => {
  //         // Dynamically match the key to exclude it
  //         const { [keyToRemove]: _, ...remainingObject } = prevObject;
  //         return remainingObject;
  //       });
  //     };


  // const removeItem = (fieldNameToRemove) => {
  //         setSelectedObject(prevObject => {
            // Dynamically match the key to exclude it
            const { [fieldNameToRemove]: _, ...remainingObject } = prevObject;
            return remainingObject;
          // });
}

/// Let the User Choose a Local Disk (File Input control)
export function FileFromDisk() 
{
  const [fileContent, setFileContent] = useState("");

  const handleFileChange = (event) => 
                          {
                            const file = event.target.files[0];
                            if (!file) return;

                            const reader = new FileReader();
                            // Triggered when the file reading finishes
                            reader.onload = (e) => {
                              setFileContent(e.target.result);
                            };
                            // Read file as plain text (use readAsDataURL for images/base64)
                            reader.readAsText(file);
                          };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <pre>{fileContent}</pre>
    </div>
  );
}

/// Read a Project File (already exist inside your project PUBLIC directory
export  function FileFromPublicFolder(fileName) 
{
  const [data, setData] = useState("");

  useEffect(() => {
    // Looks for 'data.txt' inside the public directory
    fetch("/" + fileName)
      .then((response) => response.text())
      .then((text) => setData(text))
      .catch((err) => console.error("Error reading file:", err));
  }, [fileName]);

  return (
    <div>
      <h3>Bundled File Content:</h3>
      <p>{data}</p>
    </div>
  );
}






