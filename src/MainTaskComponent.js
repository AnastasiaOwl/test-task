import React, { useState, useEffect } from 'react';

const MainTaskComponent = () => {
  const [inputTitle, setInputTitle] = useState('');
  const [symbols, setSymbols] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, selectedSymbol]);

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

  const highlightSymbol = (index) => {
    const updatedSymbols = symbols.map((symbol, i) => {
      if (i === index) {
        return { ...symbol, chosen: true, color: 'red' };
      } else {
        return { ...symbol, chosen: false, color: 'white' };
      }
    });
    setSymbols(updatedSymbols);
    setSelectedSymbol(updatedSymbols[index]);
  };

  const handleMouseDown = (e, index) => {
    e.preventDefault();
    setIsDragging(true);
    highlightSymbol(index);
    const symbol = symbols[index];
    const offsetX = e.clientX - symbol.x;
    const offsetY = e.clientY - symbol.y;
    setDragOffset({ x: offsetX, y: offsetY });
  };

  const handleMouseMove = (e) => {
    if (isDragging && selectedSymbol) {
      const updatedSymbols = symbols.map((symbol) => {
        if (symbol === selectedSymbol) {
          return {
            ...symbol,
            x: e.clientX - dragOffset.x,
            y: e.clientY - dragOffset.y,
          };
        }
        return symbol;
      });
      setSymbols(updatedSymbols);
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
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
