import React, { useState, useEffect } from 'react';

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
    const totalWidth = symbolsArray.length * 15; 
    const centerOffset = (window.innerWidth - totalWidth) / 2; 

    const centeredSymbolsArray = symbolsArray.map((symbol, index) => ({
      ...symbol,
      x: centerOffset + 15 * index, 
    }));

    setSymbols(centeredSymbolsArray);
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

  const handleOuterMouseDown = (e) => {
    setSelectionBox({
      startX: e.clientX,
      startY: e.clientY,
      endX: e.clientX,
      endY: e.clientY,
    });
    setIsDragging(true);
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
    if (isDragging && selectedSymbols.length === 0) {
      setSelectionBox({
        startX: selectionBox.startX,
        startY: selectionBox.startY,
        endX: e.pageX,
        endY: e.pageY,
      });
        const mouseX = e.clientX;
        const mouseY = e.clientY;
    
        const updatedSymbols = symbols.map((symbol, index) => {
          const symbolX = symbol.x;
          const symbolY = symbol.y;
          const symbolWidth = 15; // Assuming each symbol has a width of 15
          const symbolHeight = 15; // Assuming each symbol has a height of 15
    
          const boxStartX = Math.min(selectionBox.startX, selectionBox.endX);
          const boxEndX = Math.max(selectionBox.startX, selectionBox.endX);
          const boxStartY = Math.min(selectionBox.startY, selectionBox.endY);
          const boxEndY = Math.max(selectionBox.startY, selectionBox.endY);
    
          const symbolIsInSelection =
            symbolX + symbolWidth >= boxStartX &&
            symbolX <= boxEndX &&
            symbolY + symbolHeight >= boxStartY &&
            symbolY <= boxEndY;
    
          if (symbolIsInSelection) {
            // If symbol is not already selected, toggle its selection
            if (!selectedSymbols.includes(index)) {
              toggleSymbolSelection(index);
            }
          } else {
            // If symbol is selected but not in the selection box, toggle its selection
            if (selectedSymbols.includes(index)) {
              toggleSymbolSelection(index);
            }
          }
          // Return the symbol with updated selection status
          return symbol;
        });
    
        setSymbols(updatedSymbols);
    }
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
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    setDragOffsets({});
  };

  return (
    <>
     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <input
        type="text"
        placeholder="Enter your sentence here..."
        value={inputTitle}
        onChange={(e) => setInputTitle(e.target.value)}
      />
      <button onClick={handleShow}>Press Me</button>
      <div
        style={{ 
          position: 'relative',
          width: '100vw',
          height: '85vh',
          overflow: 'hidden',
          cursor: isDragging ? 'grabbing' : 'auto',
        }}
        onMouseDown={handleOuterMouseDown}
      >
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
            display: isDragging ? 'block' : 'none',
          }}
        />
        {symbols.length > 0 && (
          <div style={{ 
            display: 'flex',
          }}>
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
      </div>
    </>
  );
};

export default MainTaskComponent;
