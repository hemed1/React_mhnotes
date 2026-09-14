
// FloatingWindow.jsx
import React, { useState, useRef } from 'react';
import './floatingWindow.css';



export default function FloatingWindow({ title, isOpen, onClose, onSelectedItem, children }) 
{
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isMinimized, setIsMinimized] = useState(false);
  //const dragRef = useRef(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  if (!isOpen) return null;

  const handleMouseDown = (e) => {
    // Record initial distance between mouse click and window top-left corner
    offsetRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    setPosition({
      x: e.clientX - offsetRef.current.x,
      y: e.clientY - offsetRef.current.y,
    });
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="floating-window" style={{ top: `${position.y}px`, left: `${position.x}px` }}>
      
      {/* Header bar handles dragging */}
      <div className="window-header" onMouseDown={handleMouseDown}>
        <span className="window-title">{title}</span>
        <div className="window-controls">
          <button style={{paddingBottom: '15px'}} onClick={() => setIsMinimized(!isMinimized)}>{isMinimized ? '🔳' : '➖'}</button>
          <button style={{paddingBottom: '15px'}} onClick={onClose}>❌</button>
        </div>
      </div>
      
      {/* Dynamic content area */}
      {!isMinimized && 
         <div className="window-content">
            
            {children}
         
         </div>
      }
    </div>
  );
}
