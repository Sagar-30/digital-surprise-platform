import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const Piece = ({ piece, index, onDrop, isCompleted }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'PIECE',
    item: { index, currentPos: piece.currentPos },
    canDrag: () => !isCompleted,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'PIECE',
    drop: (item) => onDrop(item.index, index),
    canDrop: () => !isCompleted,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));
  
  return (
    <motion.div
      ref={(node) => drag(drop(node))}
      className={`relative cursor-move rounded-lg overflow-hidden ${
        isDragging ? 'opacity-50 cursor-grabbing' : ''
      } ${isOver ? 'ring-4 ring-pink-500 shadow-lg' : ''} ${
        isCompleted ? 'cursor-default' : ''
      }`}
      style={{
        backgroundImage: `url(${piece.imageUrl})`,
        backgroundPosition: `${piece.backgroundPositionX}% ${piece.backgroundPositionY}%`,
        backgroundSize: `${piece.gridSize * 100}%`,
        backgroundRepeat: 'no-repeat',
      }}
      whileHover={!isCompleted ? { scale: 1.02, zIndex: 10 } : {}}
      whileTap={!isCompleted ? { scale: 0.98 } : {}}
    >
      <div className="w-full h-full" />
    </motion.div>
  );
};

const PuzzleGameComponent = ({ imageUrl, onComplete }) => {
  const [pieces, setPieces] = useState([]);
  const [gridSize, setGridSize] = useState(3);
  const [completed, setCompleted] = useState(false);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  useEffect(() => {
    if (imageUrl) {
      loadImageAndCreatePieces();
    }
  }, [imageUrl, gridSize]);
  
  const loadImageAndCreatePieces = () => {
    const img = new Image();
    img.src = imageUrl;
    
    img.onload = () => {
      setImageLoaded(true);
      createPieces(gridSize);
    };
    
    img.onerror = () => {
      console.error('Failed to load image');
      // Fallback: create pieces with placeholder
      createPieces(gridSize);
    };
  };
  
  const createPieces = (size) => {
    const newPieces = [];
    const totalPieces = size * size;
    
    for (let i = 0; i < totalPieces; i++) {
      const row = Math.floor(i / size);
      const col = i % size;
      
      // Calculate background position for this piece
      // Each piece shows a different part of the image
      const backgroundPositionX = (col / (size - 1)) * 100;
      const backgroundPositionY = (row / (size - 1)) * 100;
      
      newPieces.push({
        id: i,
        currentPos: i,
        correctPos: i,
        imageUrl: imageUrl,
        gridSize: size,
        row: row,
        col: col,
        backgroundPositionX: backgroundPositionX,
        backgroundPositionY: backgroundPositionY,
      });
    }
    
    // Shuffle pieces
    for (let i = newPieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newPieces[i].currentPos, newPieces[j].currentPos] = 
      [newPieces[j].currentPos, newPieces[i].currentPos];
    }
    
    setPieces(newPieces.sort((a, b) => a.currentPos - b.currentPos));
    setStartTime(Date.now());
    setMoves(0);
    setCompleted(false);
    setTimeSpent(0);
  };
  
  useEffect(() => {
    let timer;
    if (startTime && !completed) {
      timer = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [startTime, completed]);
  
  const handleDrop = (dragIndex, dropIndex) => {
    if (completed) return;
    
    setMoves(prev => prev + 1);
    
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
      setTimeout(() => {
        onComplete();
      }, 500);
    }
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const resetGame = () => {
    createPieces(gridSize);
  };
  
  const getHint = () => {
    setShowHint(true);
    setTimeout(() => setShowHint(false), 3000);
  };
  
  const gridSizes = [
    { value: 3, label: 'Easy', icon: '😊', size: '3x3', color: 'from-green-400 to-emerald-400' },
    { value: 4, label: 'Medium', icon: '🤔', size: '4x4', color: 'from-yellow-400 to-orange-400' },
    { value: 5, label: 'Hard', icon: '🔥', size: '5x5', color: 'from-red-400 to-pink-400' }
  ];
  
  if (!imageLoaded) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🖼️</div>
          <p className="text-gray-600 dark:text-gray-300">Loading image...</p>
        </div>
      </div>
    );
  }
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-4xl w-full mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6 md:mb-8"
          >
            <div className="text-4xl md:text-5xl mb-3">🧩</div>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
              Complete the Puzzle
            </h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
              Drag and drop the pieces to reveal the surprise!
            </p>
          </motion.div>
          
          {/* Game Stats */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-xl p-3 text-center border border-white/50 dark:border-white/10"
            >
              <div className="text-xl md:text-2xl mb-1">🎯</div>
              <div className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">{moves}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Moves</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-xl p-3 text-center border border-white/50 dark:border-white/10"
            >
              <div className="text-xl md:text-2xl mb-1">⏱️</div>
              <div className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">{formatTime(timeSpent)}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Time</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-xl p-3 text-center border border-white/50 dark:border-white/10"
            >
              <div className="text-xl md:text-2xl mb-1">{gridSize}x{gridSize}</div>
              <div className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">
                {gridSizes.find(g => g.value === gridSize)?.label}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Difficulty</div>
            </motion.div>
          </div>
          
          {/* Controls */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <select
              value={gridSize}
              onChange={(e) => {
                setGridSize(Number(e.target.value));
                setCompleted(false);
              }}
              className="px-4 py-2 bg-white/50 dark:bg-gray-900/50 border border-pink-300 dark:border-pink-500/30 rounded-xl focus:outline-none focus:border-pink-500 text-gray-800 dark:text-white"
            >
              {gridSizes.map(size => (
                <option key={size.value} value={size.value}>
                  {size.icon} {size.size} - {size.label}
                </option>
              ))}
            </select>
            
            <motion.button
              onClick={resetGame}
              className="px-4 py-2 bg-white/50 dark:bg-gray-900/50 border border-pink-300 dark:border-pink-500/30 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-white/60 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🔄 New Game
            </motion.button>
            
            <motion.button
              onClick={getHint}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl shadow-lg hover:shadow-pink-500/25 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              💡 Hint
            </motion.button>
          </div>
          
          {/* Hint Message */}
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center mb-4 p-3 bg-pink-100 dark:bg-pink-900/30 rounded-xl text-pink-600 dark:text-pink-400 text-sm"
              >
                💡 Tip: Focus on completing one row or column at a time!
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Puzzle Grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white/20 dark:bg-gray-900/20 backdrop-blur-sm rounded-2xl p-4 border border-white/50 dark:border-white/10 shadow-2xl"
          >
            <div 
              className="grid gap-1 rounded-xl overflow-hidden"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                aspectRatio: '1/1',
              }}
            >
              {pieces.map((piece, idx) => (
                <Piece
                  key={`${piece.id}-${piece.currentPos}`}
                  piece={piece}
                  index={idx}
                  onDrop={handleDrop}
                  isCompleted={completed}
                />
              ))}
            </div>
          </motion.div>
          
          {/* Completion Animation */}
          <AnimatePresence>
            {completed && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
              >
                <motion.div
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-8 text-center shadow-2xl pointer-events-auto"
                >
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Puzzle Completed!</h3>
                  <p className="text-pink-100">
                    You solved it in {moves} moves and {formatTime(timeSpent)}!
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Progress Indicator */}
          {!completed && pieces.length > 0 && (
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Progress</span>
                <span>{Math.round((pieces.filter(p => p.currentPos === p.correctPos).length / pieces.length) * 100)}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(pieces.filter(p => p.currentPos === p.correctPos).length / pieces.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default PuzzleGameComponent;