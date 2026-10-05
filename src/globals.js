
//import { exp } from 'firebase/firestore/pipelines';
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import {DeleteAllRecords, InsertRecord} from './components/firebase.js';
import { Plus, Trash2/* , X, ChevronRight, Users, Subtitles, CheckLine, Check, CheckIcon, CheckLineIcon, EllipsisVertical */ } from "lucide-react";


const listTypesEn = { Reminder: 1, Note: 2, Task: 3, Event: 5, Work: 4, Recipe: 6, ShopList: 7 };


export function dateSetFormat(date)
{
   var result = new Date(date)
   //var result = new Date().toLocaleString('en-IL', { timeZone: 'Asia/Jerusalem' }).replace(', ', 'T')
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

export function FieldInScreen({ captionText, fieldID, control, width })
{

  return (
      
      <div style={{display: 'flex', flexDirection: 'column', rowGap: '6px', width: `${(width) ? `${width}%`: null}`}}>
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

export function GridEdited(id, rowIndex, colIndex, value, itemObject, fieldName) 
{
   var edit = {id: id, row: rowIndex, col: colIndex, value: value, itemObject: itemObject, fieldName: fieldName};
   return edit;
}

export function LookupManage({ title, tableName, originalData, onClose, onSaveLookup }) 
{
  const [data, setData] = useState(originalData);
  const [lblMessage, setLblMessage] = useState(`${data.length} פריטים`);




  const addRow = () => 
  {
    // Finf the max ID + 1
    const tmpList = data.map((e) => e.value);
    const max = Math.max(...tmpList); 
    const newItem = {label: '', value: max + 1};
    const list = [...data];
    list.push(newItem);
    setData(list);
    handleScrollToControl();
    //handleFocus();
  };

  const deleteRow = (id) => {
    const newList = [...data].filter((item, index) => index !== id);
    setData(newList);
  };

  const setID = (oldIndex, newID) => {
    const newList = [...data].map((item, index) => (index === oldIndex ? { ...item, value: newID } : item));
    setData(newList);
  };

  const updateText = (oldIndex, value) => {
    const newList = [...data].map((item, index) => (index === oldIndex ? {...item, label: value } : item));
    setData(newList);
  };

  async function handleSaveLookup()
  {
    await saveLookups();

    onSaveLookup(tableName, data); 
    onClose();
  }

  async function saveLookups()
  {
    var result = false;

    setLblMessage('אנא המתן לשמירת נתונים ...');

    result = await DeleteAllRecords(tableName);

    for (const item of data) 
    {
      const obj = {ID: item.value , Description: String(item.label).trim()};
      result = await InsertRecord(tableName, obj);
    }

    setLblMessage(`${data.length} פריטים`);

    if (result)
    {
      alert("הפריטים נשמרו בהצלחה!");
    }
    else
    {
      alert("שגיאה בשמירת הנתונים!");
    } 
    
  }

  const targetControlRef = useRef(null);
  const handleScrollToControl = () => 
  {
    if (targetControlRef && targetControlRef.current)
    {
      // Smoothly scroll the container to make the target control visible
      targetControlRef.current?.scrollIntoView({
        behavior: 'smooth', 
        block: 'nearest', // Aligns element within the scrollable area
      });
      // Scroll manuali
        // Moves the inner scrollbar down by 100 pixels
        //targetControlRef.current.scrollTop = 30;
        //targetControlRef.current.scrollTop = targetControlRef.current.scrollHeight;
      }
  };
  // const inputRef = useRef(null);
  // const handleFocus = () => 
  // {
  //   // 3. Access the DOM node and trigger focus
  //   if (inputRef.current) 
  //   {
  //     inputRef.current.focus();
  //   };
  // };
  // useEffect(() => 
  // {
  //   // Triggers automatically once the component mounts
  //   if (inputRef.current) 
  //   {
  //     inputRef.current.focus();
  //   }
  // }, []); // Empty dependency array ensures this runs only once

  //const containerRef = useRef(null);






  return (

    <div
      style={{
        position: "absolute",
        left: '200px',
        inset: 0,
        zIndex: 50,
        display: "flex",
        justifyContent: "flex-end",
        fontFamily: "'sans-serif, Segoe UI', -apple-system, BlinkMacSystemFont",
      }}
    >

      {/* overlay */}
      <div
        style={{
          position: 'absolute',
          left: '300px',
          top: '250px',
          inset: 0,
          background: "rgba(20, 28, 46, 0.45)",
        }}
      />

      {/* drawer */}
      <div
        style={{
          position: 'fixed',
          width: "min(480px, 92vw)",
          height: "100%",
          background: "#e5e1d8",
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
            padding: "23px 20px",
            borderBottom: "1px solid #E4E0D8",
            display: "flex",
            flexDirection: 'column',
            alignItems: "start",
            justifyContent: "space-between",
            background: "#1B2A4A",
          }}
        >
    
          <div style={{display: 'flex', flexDirection: 'row', /* gap: '60px', */ justifyContent: 'space-between', width: '100%', fontWeight: 700, marginBottom: '30px', color: "#C9A15A"}}>
            
              {title}

              <div style={{display: 'flex', flexDirection: 'row', gap: '20px', justifyContent: 'left'}}>
                <button
                  onClick={onClose}
                  type='button'
                  style={{
                    background: "rgba(223, 16, 16, 1.0)",
                    //border: "1px solid #E4E0D8",
                    borderRadius: '5px',
                    width: '60px',
                    height: '30px',
                    display: "flex",
                    fontSize: '18px',
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#FBFAF8",
                  }}
                  aria-label="בטל">
                  ביטול
                  {/* <X size={18} /> */}
                </button>

                <button
                  onClick={handleSaveLookup}
                  type='button'
                  style={{
                    background: "#1ea70c",
                    //border: "1px solid #E4E0D8",
                    borderRadius: '5px',
                    width: '60px',
                    height: '30px',
                    display: "flex",
                    fontSize: '18px',
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#FBFAF8",
                  }}
                  aria-label="אישור"
                >
                  אישור
                  {/* <X size={18} /> */}
                </button>
              </div>

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
              <span style={{fontSize: '18px', color: "#FBFAF8", fontWeight: 600, letterSpacing: "0.03em"}}>
                {lblMessage}
              </span>
          </div>
        </div>



        {/* Main Rows Div */}
        <div style={{ flex: 1, overflowY: "auto", padding: "15px 15px" }}>
          
          {/* Sub Headers */}
          {data.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "36px 12px",
                color: "#676b73",
                fontSize: '20px',
                border: "1.5px dashed #E4E0D8",
                borderRadius: 10,
              }}
            >
              אין {title}. לחץ על ׳הוסף שורה׳
            </div>
          )}



          {/* Field Rowד entry */}
          <div style={{ display: "flex", flexDirection: "column", gap: '8px' }}>
            {data.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: '20px',
                  alignItems: "center",
                  background: "#fff",
                  border: "1px solid #E4E0D8",
                  borderRadius: 8,
                  padding: "10px 12px",
                }}
              >

                <input
                  type="text"
                  value={item.value}
                  onChange={(e) => setID(Number(index), Number(e.target.value))}
                  style={{
                    border: "1px solid 'blue'",
                    width: '40px',
                    height: '40px',
                    borderRadius: 6,
                    fontSize: '23px',
                    background: "#F7F5F1",
                    color: "#1F2937",
                    flexShrink: 0,
                  }}/>

                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => updateText(index, e.target.value)}
                  placeholder="הקלד טקסט..."
                  style={{
                    border: "1px solid 'blue'",
                    borderRadius: 6,
                    padding: "7px 10px",
                    fontSize: '23px',
                    background: "#F7F5F1",
                    color: "#1F2937",
                    outline: "none",
                    width: '100%',
                  }}
                  ref={(index===data.length-1) ? targetControlRef : null}
                  onFocus={(e) => (e.target.style.borderColor = "#1B2A4A")}
                  onBlur={(e) => (e.target.style.borderColor = "transparent")}/>

                <button
                  onClick={() => deleteRow(index)}
                  type='button'
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    color: "#B0473F",
                    display: "flex",
                    //alignItems: "left",
                    justifyContent: "left",
                    padding: 6,
                    borderRadius: 6,
                    flexShrink: 0,
                    boxShadow: '0px 0px 0px transparent'
                  }}
                  aria-label="מחק שורה"
                  title="מחק שורה">
                  <Trash2 size={17} />
                </button>
                
              </div>
            ))}
          </div>

        </div>


        {/* footer */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #E4E0D8" }}>
          <button
            onClick={(e) => addRow()}
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

export function getGradientColorByListType(listTypeID)
{
  let gradientColor = '';
  
  const mainColor = getColorByListType(listTypeID);

  switch (listTypeID)
    {
      case listTypesEn.Reminder:
        gradientColor = "linear-gradient(45deg, " + mainColor + " 10%, rgba(240, 240, 240, 0.95) 90%)";
        break;
      case listTypesEn.Note:
        gradientColor = "linear-gradient(45deg, " + mainColor + " 10%, rgba(240, 240, 240, 0.95) 90%)";
        break;

      case listTypesEn.Event:
        gradientColor = "linear-gradient(45deg, " + mainColor + " 10%, rgba(240, 240, 240, 0.95) 90%)";
        break;

      case listTypesEn.Work:
        gradientColor = "linear-gradient(45deg, " + mainColor + " 10%, rgba(240, 240, 240, 0.95) 90%)";
        break;

      case listTypesEn.ShopList:
        gradientColor = "linear-gradient(45deg, " + mainColor + " 10%, rgba(240, 240, 240, 0.95) 90%)";
        break;

      case listTypesEn.Task:
      default:
        gradientColor = "linear-gradient(45deg, " + mainColor + " 10%, rgba(240, 240, 240, 0.95) 90%)";
        break;
    }

  return gradientColor;
}

export function getColorByListType(listTypeID)
{

  let gradientColor = '';

  switch (listTypeID)
  {
    case listTypesEn.Reminder:
      gradientColor = '#cfead7f2';
      //gradientColor = 'rgba(207, 234, 215, 0.95)';
      break;
    case listTypesEn.Note:
      gradientColor = '#ffefc3f2';
      //gradientColor = 'rgba(255, 239, 195, 0.95)';
      break;

    case listTypesEn.Event:
      gradientColor = '#f7b983f2';
      //gradientColor = 'rgba(247,185,131, 0.95)';
      break;

    case listTypesEn.Work:
      gradientColor = '#afcbfaf2';
      //gradientColor = 'rgba(175, 203, 250, 0.95)';
      break;

    case listTypesEn.Recipe:
      gradientColor = '#a7cccaf2';
      //gradientColor = 'rgba(167, 204, 202, 0.95)';
      break;

    case listTypesEn.ShopList:
      gradientColor = '#fad2cff2';
      //gradientColor = 'rgba(250, 210, 207, 0.95)';
      break;

    case listTypesEn.Task:
    default:
      gradientColor = '#e1bee7f2';
      //gradientColor = 'rgba(225, 190, 231, 0.95)';
      break;
  }

  return gradientColor;
}

export function ControMoveAndResizeInitialize(controlName, controlObj, eventNameForMoving, eventNameForReSizing)
{
    const [controlObject, setControlObject] = useState(controlObj);      //document.getElementById(controlName));

    const maxWidth = 1100;
    const maxHeight = 700;
    const minWidth = 280;
    var minHeight = 100;

    var mousePosition;
    var offsetForMove = [0, 0];
    var offsetForResize = [0, 0];
    var mouseMode = 0; // 0-Close, 1-Move, 2-ReSize
    var keepLastControlTop = 0;
    var keepLastControlLeft = 0;



    var control = controlObject;
    //var control = document.getElementById(controlName);

    if (!control)
    {
        control = document.getElementById(controlName);
        setControlObject(control);
        //alert('Error: Control not found: ' + controlName);
        return;
    }
    
    keepLastControlTop = parseInt(control.style.top);
    keepLastControlLeft = parseInt(control.style.left);

    //var controlInfo = document.createElement("label");
    //controlInfo.id = 'lblChatWinResizeData';
    ////control = document.createElement("div");
    //controlInfo.style.position = "absolute";
    //controlInfo.style.left = "0px";
    //controlInfo.style.top = "800px";
    //controlInfo.style.width = "700px";
    //controlInfo.style.height = "100px";
    //controlInfo.style.background = "red";
    //controlInfo.style.color = "white";
    //document.body.appendChild(controlInfo);

    control.addEventListener('mousedown', function (e)
    {
       // console.log("mousedown -  mouse state:", mouseMode, " ,mouse location -", "clientX:", e.clientX, " ,clientY:", e.clientY);

        if (mouseMode === 0)
        {
            //console.log("mousedown -  mouse state: 0");
            mouseMode = 1;
            document.body.style.cursor = 'move';
            offsetForMove = [control.offsetLeft - e.clientX, control.offsetTop - e.clientY];
        }

    }, true);


    // For Move action
    document.addEventListener('mouseup', function ()
    {
        //console.log("mouseup -", " mouse state:", mouseMode);

        //if (mouseMode == 1)
        //{
            document.body.style.cursor = 'default';     /*'auto'; */
        //}

        //console.log("Mouse up event - Mouse Mode: " + String(mouseMode), "Last && Current posstion:", control.style.top, control.style.left, keepLastControlTop, keepLastControlLeft, "Diff:", parseInt(control.style.top) - keepLastControlTop);

        // Rais ReSized event
        if ((eventNameForReSizing !== null && mouseMode === 2))
        {
            try
            {
                //alert('Going to rais resize event: ' + controlName);
                eventNameForReSizing(controlName);
            }
            catch (err) 
            {
                var str = err.message;
                alert('Error: Rais ReSized event(): ' + str);
            }
        }
        // Raise Moved event
        else if (eventNameForMoving !== null && mouseMode === 1 &&
          (Math.abs(parseInt(control.style.top) - keepLastControlTop) > 5 ||
          Math.abs(parseInt(control.style.left) - keepLastControlLeft) > 5))
        {
            try {
                //alert('Going to rais move event: ' + controlName);
                eventNameForMoving(controlName);
            }
            catch (err) {
                var msg = err.message;
                alert('Error: Raise Moved event: ' + msg);
            }

        }

        mouseMode = 0;

        keepLastControlTop = parseInt(control.style.top);
        keepLastControlLeft = parseInt(control.style.left);
        
    }, true);


    document.addEventListener('mousemove', function (event)
    {
        event.preventDefault();

        if (mouseMode === 0)
        {
            return;
        }

        mousePosition = { x: event.clientX, y: event.clientY };

        if (mouseMode === 1)
        {
            control.style.left = (mousePosition.x + offsetForMove[0]) + 'px';
            control.style.top = (mousePosition.y + offsetForMove[1]) + 'px';
            //console.log("Mouse Move event - Mouse Mode 1 - Mouse location -", "clientX:", event.clientX, " clientY:",event.clientY, "top: " + String(control.style.top) + "  left: " + String(control.style.left))
        }
        else if (mouseMode === 2)
        {
            var newX = mousePosition.x + offsetForResize[0];
            var newY = mousePosition.y + offsetForResize[1];
            if (newX <= maxWidth && newX >= minWidth)
            {
                control.style.width = newX + 'px';
            }
            if (newY <= maxHeight && newY >= minHeight)
            {
                control.style.height = newY + 'px';
            }
            //console.log("Mouse move event - Mouse Mode 2 - Mouse location -", "clientX:", event.clientX, " clientY:", event.clientY, "width: " + String(control.style.width) + "  height: " + String(control.style.height))
        }

    }, true);

    // Start ReSizing action
    control.addEventListener('dblclick', function (e)
    {
        mouseMode = 2;

        //console.log("Mouse dblclick event - ", "mouse location:" , "  clientX: ", e.clientX, ", clientY:", e.clientY);

        document.body.style.cursor = 'nw-resize';

        offsetForResize = [control.offsetWidth - e.clientX, control.offsetHeight - e.clientY];

        // Set the mouse in specific location
        //window.clientX = 900;
        //window.clientY = 500;
        //e.clientX = 900;
        //e.clientY = 500;

    }, true);

}

/// './assets/click.mp3'
export function PlaySound(file)
{
  // Import your local MP3 file (Vite or Webpack will handle the path transformation)
  //import clickSound from './assets/click.mp3'; 

  const SoundButton = () => 
  {
    const playSound = () => 
    {
      try
      {
        const path = "./assets/" + file;
        const audio = new Audio(path);      ///* clickSound */); // Can also be a web URL like "https://example.com"
        audio.muted = false;
        // Set volume here (0.0 = muted, 0.5 = 50% volume, 1.0 = 100% volume)
        audio.volume = 0.7;
        audio.play()
        // .then(() => 
        // {
        //   console.log("Audio playing successfully!");
        // })
        .catch((error) =>
        {
          console.error("Playback failed:", error);
        });
      }
      catch (error)
      {
        console.log(error);
      }
    };

    playSound();

    return true;
    
    // return (
    //   <button onClick={playSound}>
    //     🔊 Play Sound Effect
    //   </button>
    // );
  };

  SoundButton();


  // useEffect(() => 
  // {
  //   function play()
  //   {
  //     const path = "./assets/" + file;
  //     const audio = new Audio(path);
  //     audio.muted = false;
  //     audio.volume = 0.9;
  //
  //     // Attempt to autoplay immediately when the component loads
  //     audio.play()
  //       .then(() => 
  //       {
  //         console.log("Autoplay worked!");
  //       })
  //       .catch((error) =>
  //       {
  //         console.warn("Autoplay blocked. Waiting for user interaction...", error);
  //
  //         // Fallback: Play the sound the very moment the user clicks anywhere on the window
  //         // const playOnInteraction = () => {
  //         //   audio.play().catch(e => console.error(e));
  //         //   window.removeEventListener('click', playOnInteraction);
  //         // };
  //         // window.addEventListener('click', playOnInteraction);
  //       });
  //     }
  //
  //     // Execute the Function var
  //     return () => play;
  //
  //     // Cleanup listener if the component unmounts before a click happens
  //     // return () => 
  //     // {
  //     //   window.removeEventListener('click', playOnInteraction);
  //     // };
  //   }, [file]);
  //
  // return null; // Renders nothing visual to the DOM
  //
  // Use a ref so the same Audio instance persists between renders
  // const audioRef = useRef(new Audio("./assets/" + file));
  //
  // const handlePlaySound = () => 
  // {
  //   // Set volume here (0.0 = muted, 0.5 = 50% volume, 1.0 = 100% volume)
  //   audioRef.current.volume = 0.9;
  //   audioRef.current.play()
  //     .then(() => {
  //       console.log("Audio playing successfully!");
  //     })
  //     .catch((error) => {
  //       console.error("Playback failed:", error);
  //     });
  // };
  //
  // return ( handlePlaySound() )
  //       //   <div>
  //       //     < handlePlaySound />
  //       //   </div>
  //       // );

}
/// Set the Sub-Tasks objects to the Parent Task object, based on the NoteID
export function setSubTasksToParent(dataNotes, dataChilds)
{
  const subsSorted = [...dataChilds].sort((a, b) => a.NoteID - b.NoteID);

  for (var i = 0; i < subsSorted.length; i++)
  {
    const sub = subsSorted[i];
    const noteID = sub.NoteID;
    const note = dataNotes.find((n) => n.NoteID === noteID);
    
    const subList = subsSorted.filter((sub) => sub.NoteID === noteID);
    i = i + subList.length - 1;
    if (note)
    {
      if (subList.length > 0)
      {
        note["SubTasks"] = subList;
      }
      else
      {
        note["SubTasks"] = [];
      }
    }
  }

  return dataNotes;
}
