import React, { useState, useEffect } from 'react';

const MainTaskComponent = () => {
  const [inputTitle, setInputTitle] = useState('');
  const [symbols, setSymbols] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [selectedSymbols, setSelectedSymbols] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [initialPositions, setInitialPositions] = useState({});

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
    setSelectedSymbol(symbol);
    setSelectedSymbols([index]);
    const updatedSymbols = symbols.map((s, i) => ({
      ...s,
      color: i === index ? 'red' : 'white',
    }));
    setSymbols(updatedSymbols);
  };

  const handleMouseDown = (e, index) => {
    e.preventDefault();
    const ctrlPressed = e.ctrlKey || e.metaKey; // Check for Ctrl or Cmd key
    if (ctrlPressed) {
      toggleSymbolSelection(index);
    } else {
      selectSymbol(index);
    }
    setIsDragging(true);
    const symbol = symbols[index];
    const offsetX = e.clientX - symbol.x;
    const offsetY = e.clientY - symbol.y;
    setDragOffset({ x: offsetX, y: offsetY });

    const initialPos = {};
    selectedSymbols.forEach((i) => {
      initialPos[i] = { x: symbols[i].x, y: symbols[i].y };
    });
    setInitialPositions(initialPos);
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
          const newX = e.clientX - dragOffset.x;
          const newY = e.clientY - dragOffset.y;
          return {
            ...symbol,
            x: newX,
            y: newY,
          };
        }
        return symbol;
      });
      setSymbols(updatedSymbols);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setInitialPositions({});
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
