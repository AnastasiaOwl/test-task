import React, { useState, useEffect } from 'react';

const SymbolSelector = ({ symbols, setSymbols, selectedSymbols, setSelectedSymbols }) => {
  const [isSelecting, setIsSelecting] = useState(false);
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
  }, [isSelecting, selectedSymbols]);

  const handleMouseDown = (e) => {
    setIsSelecting(true);
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    setSelectionBox({
      startX: mouseX,
      startY: mouseY,
      endX: mouseX,
      endY: mouseY,
    });
  };

const handleMouseMove = (e) => {
  if (isSelecting) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    setSelectionBox({
      ...selectionBox,
      endX: mouseX,
      endY: mouseY,
    });
  }
};

  const handleMouseUp = () => {
    if (isSelecting) {
      setIsSelecting(false);
      const minX = Math.min(selectionBox.startX, selectionBox.endX);
      const maxX = Math.max(selectionBox.startX, selectionBox.endX);
      const minY = Math.min(selectionBox.startY, selectionBox.endY);
      const maxY = Math.max(selectionBox.startY, selectionBox.endY);

      const newSelectedSymbols = symbols.reduce((selected, symbol, index) => {
        const symbolX = symbol.x;
        const symbolY = symbol.y;
        if (symbolX >= minX && symbolX <= maxX && symbolY >= minY && symbolY <= maxY) {
          selected.push(index);
        }
        return selected;
      }, []);

      setSelectedSymbols(newSelectedSymbols);
    }
  };


  return (
    <div
      style={{
        position: 'absolute',
        border: '1px dashed white',
        opacity: 1, 
        zIndex: 1000,
        background: 'rgba(0, 0, 0, 0.1)',
        left: Math.min(selectionBox.startX, selectionBox.endX),
        top: Math.min(selectionBox.startY, selectionBox.endY),
        width: Math.abs(selectionBox.endX - selectionBox.startX),
        height: Math.abs(selectionBox.endY - selectionBox.startY),
      }}
      onMouseDown={handleMouseDown}
    ></div>
  );
};

export default SymbolSelector;
