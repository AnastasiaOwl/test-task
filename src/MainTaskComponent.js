import React, { useState, useEffect } from 'react';
import SymbolSelector from './SymbolSelector';

const MainTaskComponent = () => {
  const [inputTitle, setInputTitle] = useState('');
  const [symbols, setSymbols] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [selectedSymbols, setSelectedSymbols] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffsets, setDragOffsets] = useState({});
  const [selectionBox, setSelectionBox] = useState({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  });

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, selectedSymbols]);

  const handleShow = () => {
    if (!inputTitle) {
      alert('Please enter your sentence here...');
      return;
    }

    const symbolsArray = inputTitle.split('').map((symbol, index) => ({
      character: symbol,
      chosen: false,
      color: 'white',
      x: 15 * index,
      y: 15,
    }));
    setSymbols(symbolsArray);
    setInputTitle('');
  };
  
  const selectSymbol = (index) => {
    const symbol = symbols[index];
    const updatedSymbols = symbols.map((s, i) => ({
      ...s,
      chosen: i === index,
      color: i === index ? 'red' : 'white',
    }));
    setSymbols(updatedSymbols);
    setSelectedSymbols([index]);
  };

  const handleMouseDown = (e, index) => {
    e.preventDefault();
    const ctrlPressed = e.ctrlKey || e.metaKey;
    if (ctrlPressed) {
      toggleSymbolSelection(index);
    } else {
      selectSymbol(index);
    }
     setIsDragging(true);
     const updatedOffsets = { ...dragOffsets }; 
     selectedSymbols.forEach((i) => {
       updatedOffsets[i] = {
         x: e.clientX - symbols[i].x,
         y: e.clientY - symbols[i].y,
       };
     });
     updatedOffsets[index] = {
      x: e.clientX - symbols[index].x,
      y: e.clientY - symbols[index].y,
    };
     setDragOffsets(updatedOffsets);
     if (selectedSymbols.length === 0) {
      setIsDragging(true);
      setSelectionBox({
        startX: e.clientX,
        startY: e.clientY,
        endX: e.clientX,
        endY: e.clientY,
      });
    }
  };

  const toggleSymbolSelection = (index) => {
    const isSelected = selectedSymbols.includes(index);
    let updatedSelectedSymbols = [...selectedSymbols];
    if (isSelected) {
      updatedSelectedSymbols = updatedSelectedSymbols.filter((item) => item !== index);
    } else {
      updatedSelectedSymbols.push(index);
    }
    const updatedSymbols = symbols.map((symbol, i) => ({
      ...symbol,
      chosen: updatedSelectedSymbols.includes(i),
      color: updatedSelectedSymbols.includes(i) ? 'red' : 'white',
    }));
    setSymbols(updatedSymbols);
    setSelectedSymbols(updatedSelectedSymbols);
    setSelectedSymbol(updatedSelectedSymbols.length === 1 ? symbols[updatedSelectedSymbols[0]] : null);
  };

  const handleMouseMove = (e) => {
    if (isDragging && selectedSymbols.length > 0) {
      const updatedSymbols = symbols.map((symbol, index) => {
        if (selectedSymbols.includes(index)) {
          if (dragOffsets[index]) {
            const offsetX = e.clientX - dragOffsets[index].x;
            const offsetY = e.clientY - dragOffsets[index].y;
            
            let collisionIndex = -1;
            symbols.forEach((s, i) => {
              if (i !== index && offsetX >= s.x && offsetX <= s.x + 15 && offsetY >= s.y && offsetY <= s.y + 15) {
                collisionIndex = i;
              }
            });
  
            if (collisionIndex !== -1) {
              const temp = { ...symbols[collisionIndex] };
              const updated = [...symbols];
              updated[collisionIndex] = { ...symbols[index], x: temp.x, y: temp.y };
              updated[index] = { ...temp, x: offsetX, y: offsetY };
              return updated[index];
            }
  
            return {
              ...symbol,
              x: offsetX,
              y: offsetY,
            };
          }
        }
        return symbol;
      });
      setSymbols(updatedSymbols);
    }
    if (selectedSymbols.length === 0) {
      setSelectionBox({
        ...selectionBox,
        endX: e.clientX,
        endY: e.clientY,
      });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    setDragOffsets({});
  };

  return (
    <>
      <input
        type="text"
        placeholder="Enter your sentence here..."
        value={inputTitle}
        onChange={(e) => setInputTitle(e.target.value)}
      />
      <button onClick={handleShow}>Press Me</button>
      <div style={{ position: 'relative' }}>
      {selectionBox.startX !== 0 && (
        <div
          style={{
            position: 'absolute',
            left: `${Math.min(selectionBox.startX, selectionBox.endX)}px`,
            top: `${Math.min(selectionBox.startY, selectionBox.endY)}px`,
            width: `${Math.abs(selectionBox.endX - selectionBox.startX)}px`,
            height: `${Math.abs(selectionBox.endY - selectionBox.startY)}px`,
            border: '1px dashed white',
            opacity: 0.3,
            zIndex: 999,
          }}
        />
      )}
        {symbols.length > 0 && (
          <div>
            {symbols.map((symbol, index) => (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  color: symbol.color,
                  left: `${symbol.x}px`,
                  top: `${symbol.y}px`,
                }}
                onMouseDown={(e) => handleMouseDown(e, index)}
              >
                {symbol.character}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MainTaskComponent;
