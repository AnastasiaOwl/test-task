import React, { useState, useEffect } from 'react';

const MainTaskComponent = () => {
  const [inputTitle, setInputTitle] = useState('');
  const [symbols, setSymbols] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [selectedSymbols, setSelectedSymbols] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffsets, setDragOffsets] = useState({});

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
              symbols[collisionIndex] = { ...symbols[index], x: temp.x, y: temp.y };
              symbols[index] = { ...temp, x: offsetX, y: offsetY };
              return symbols[index];
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
      <input
        type="text"
        placeholder="Enter your sentence here..."
        value={inputTitle}
        onChange={(e) => setInputTitle(e.target.value)}
      />
      <button onClick={handleShow}>Press Me</button>
      <div style={{ position: 'relative' }}>
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
