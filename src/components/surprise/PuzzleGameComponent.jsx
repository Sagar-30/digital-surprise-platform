import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const Piece = ({ piece, index, onDrop }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'PIECE',
    item: { index, currentPos: piece.currentPos },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'PIECE',
    drop: (item) => onDrop(item.index, index),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));
  
  return (
    <motion.div
      ref={(node) => drag(drop(node))}
      className={`cursor-move ${isDragging ? 'opacity-50' : ''} ${isOver ? 'ring-2 ring-purple-500' : ''}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <img
        src={piece.url}
        alt={`Puzzle piece ${index}`}
        className="w-full h-full object-cover rounded-lg"
      />
    </motion.div>
  );
};

const PuzzleGameComponent = ({ imageUrl, onComplete }) => {
  const [pieces, setPieces] = useState([]);
  const [gridSize, setGridSize] = useState(3);
  const [completed, setCompleted] = useState(false);
  
  useEffect(() => {
    generatePuzzle();
  }, [imageUrl, gridSize]);
  
  const generatePuzzle = () => {
    const newPieces = [];
    const pieceWidth = 100 / gridSize;
    
    for (let i = 0; i < gridSize * gridSize; i++) {
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      
      newPieces.push({
        id: i,
        currentPos: i,
        correctPos: i,
        url: `${imageUrl}?${row}-${col}`,
        style: {
          backgroundPosition: `-${col * pieceWidth}% -${row * pieceWidth}%`,
          backgroundSize: `${gridSize * 100}%`,
        }
      });
    }
    
    // Shuffle pieces
    for (let i = newPieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newPieces[i].currentPos, newPieces[j].currentPos] = 
      [newPieces[j].currentPos, newPieces[i].currentPos];
    }
    
    setPieces(newPieces.sort((a, b) => a.currentPos - b.currentPos));
  };
  
  const handleDrop = (dragIndex, dropIndex) => {
    if (completed) return;
    
    const newPieces = [...pieces];
    const dragPiece = newPieces[dragIndex];
    const dropPiece = newPieces[dropIndex];
    
    // Swap positions
    [dragPiece.currentPos, dropPiece.currentPos] = 
    [dropPiece.currentPos, dragPiece.currentPos];
    
    newPieces.sort((a, b) => a.currentPos - b.currentPos);
    setPieces(newPieces);
    
    // Check if solved
    const isSolved = newPieces.every(piece => piece.currentPos === piece.correctPos);
    if (isSolved && !completed) {
      setCompleted(true);
      onComplete();
    }
  };
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="max-w-2xl mx-auto">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-2xl font-bold text-white">Complete the Puzzle</h3>
          <select
            value={gridSize}
            onChange={(e) => setGridSize(Number(e.target.value))}
            className="glass-input"
          >
            <option value={3}>3x3 Easy</option>
            <option value={4}>4x4 Medium</option>
            <option value={5}>5x5 Hard</option>
          </select>
        </div>
        
        <div 
          className="grid gap-1 bg-white/10 p-4 rounded-xl"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            aspectRatio: '1/1',
          }}
        >
          {pieces.map((piece, idx) => (
            <Piece
              key={piece.id}
              piece={piece}
              index={idx}
              onDrop={handleDrop}
            />
          ))}
        </div>
        
        {completed && (
          <motion.div
            className="mt-4 text-center text-green-400 font-bold"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            🎉 Puzzle Completed! 🎉
          </motion.div>
        )}
      </div>
    </DndProvider>
  );
};

export default PuzzleGameComponent;