
import React, { useState } from 'react';
import './menusComponent.css';
import { changeDatabase, DataBasesConfigList } from './firebase.js';



export default function MenusComponent({ itemObject }) 
{

    const [selectedCode, setSelectedCode] = useState(2);
    const [isMenuOpen1, setIsMenuOpen1] = useState(false);
    const [selectedDatabaseIndex, setSelectedDatabaseIndex] = useState(null);


    async function handleSelectDatabase(databaseIndex)
    { 
        //f_dataaseIndex = databaseIndex;
        await changeDatabase(databaseIndex);
        setSelectedDatabaseIndex(databaseIndex);
    }

    function toggleMenu1() {
        setSelectedCode(2);
        setIsMenuOpen1(!isMenuOpen1);
    }   



    return (

      <nav className="navbar">

        <ul className="nav-menu">
            
            <li key='1' className='nav-item'>
                <a key='1' className={(selectedCode === 1) ? "active" : ""} href="#home" onClick={(e) => setSelectedCode(1)}>Home</a>
            </li>
            
            
            {/* <!-- First Dropdown Parent --> */}
            <li key='2'className="nav-item">
                <a key={2} href="#services" className={`has-children ${(selectedCode === 2) ? "active" : ""}`} onClick={(e) => setSelectedCode(2)}>Services</a>
                {/* <!-- Level 1 Dropdown --> */}
                <ul className="submenu">
                    <li>
                        <a href="#web-design" onClick={(e) => toggleMenu1()}>Web Design</a>
                        {
                            (isMenuOpen1 && (
                                    <div style={{display: 'flex', flexDirection: 'column', gridColumnStartap: '10px', backgroundColor: '#f0f0f0', height: '300px', overflowY: 'auto', paddingRight: '10px', direction: 'rtl', textAlign: 'right'}}>
                                        <ul value={selectedDatabaseIndex}  style={{listStyleType: 'none'}}  /* onChange={(e) => handleSelectDatabase(Number(e.target.value))} */ >
                                        {
                                            DataBasesConfigList.map((item, index) =>
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
                                )
                            )
                        }
                    </li>
                    
                    {/* <!-- Nested Submenu Parent --> */}
                    <li>
                        <a href='#development' className="has-children">Development</a>
                        {/* <!-- Level 2 Dropdown (Submenu) --> */}
                        <ul className="submenu">
                            <li><a key={21} className='has-children' href="#frontend" onClick={(e) => setSelectedCode(21)}>Frontend</a></li>
                            <li><a href="#backend"      onClick={(e) => setSelectedCode(2)}>Backend</a></li>
                            <li><a href="#mobile-apps"  onClick={(e) => setSelectedCode(2)}>Mobile Apps</a></li>
                        </ul>
                    </li>
                    
                    <li><a href="#marketing">SEO Marketing</a></li>
                </ul>
            </li>

         
            <li key='3' className="nav-item">
                <a key='3' className={(selectedCode === 3) ? "active" : ""} onClick={(e) => setSelectedCode(3)} href="#contact">Contact</a>
            </li>


            {/* <!-- Second Dropdown Parent --> */}
            <li key='4' className="nav-item">
                <a key='4' className={"has-children" + (selectedCode === 4 ? " active" : "")} href="#about"  onClick={(e) => setSelectedCode(4)}>About</a>
                <ul className="submenu">
                    <li><button>Our Team</button></li>
                    <li><button>Company History</button></li>
                </ul>
            </li>   

        </ul>
        
    </nav>
   );
}
