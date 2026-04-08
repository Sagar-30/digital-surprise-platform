import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';

const Piece = ({ piece, index, onDrop, isCompleted, gridSize }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'PIECE',
    item: { index },
    canDrag: !isCompleted,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'PIECE',
    drop: (item) => {
      if (item.index !== index && !isCompleted) {
        onDrop(item.index, index);
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className="relative overflow-hidden rounded-lg"
      style={{ aspectRatio: '1/1' }}
    >
      <div
        style={{
          position: 'absolute',
          width: `${gridSize * 100}%`,
          height: `${gridSize * 100}%`,
          transform: `translate(-${piece.col * (100 / gridSize)}%, -${piece.row * (100 / gridSize)}%)`,
        }}
      >
        <img
          src={piece.imageUrl}
          alt=""
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
          }}
        />
      </div>
    </div>
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

  // Generate puzzle pieces
  const generatePuzzle = () => {
    const newPieces = [];
    
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const id = row * gridSize + col;
        newPieces.push({
          id: id,
          correctIndex: id,
          currentIndex: id,
          row: row,
          col: col,
          imageUrl: imageUrl,
        });
      }
    }
    
    // Shuffle pieces
    for (let i = newPieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newPieces[i].currentIndex, newPieces[j].currentIndex] =
        [newPieces[j].currentIndex, newPieces[i].currentIndex];
    }
    
    // Sort by current index for display
    const sortedPieces = [...newPieces].sort((a, b) => a.currentIndex - b.currentIndex);
    setPieces(sortedPieces);
    setStartTime(Date.now());
    setMoves(0);
    setCompleted(false);
  };

  // Initialize puzzle when imageUrl or gridSize changes
  useEffect(() => {
    if (imageUrl) {
      generatePuzzle();
    }
  }, [imageUrl, gridSize]);

  // Timer
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
    
    // Swap current indices
    const tempIndex = dragPiece.currentIndex;
    dragPiece.currentIndex = dropPiece.currentIndex;
    dropPiece.currentIndex = tempIndex;
    
    // Resort by current index
    newPieces.sort((a, b) => a.currentIndex - b.currentIndex);
    setPieces(newPieces);
    
    // Check if solved
    const isSolved = newPieces.every(piece => piece.currentIndex === piece.correctIndex);
    if (isSolved && !completed) {
      setCompleted(true);
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetGame = () => {
    generatePuzzle();
  };

  const getHint = () => {
    setShowHint(true);
    setTimeout(() => setShowHint(false), 3000);
  };

  const gridSizes = [
    { value: 3, label: 'Easy', icon: '😊', size: '3x3' },
    { value: 4, label: 'Medium', icon: '🤔', size: '4x4' },
    { value: 5, label: 'Hard', icon: '🔥', size: '5x5' }
  ];

  return (
    <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-4xl w-full mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6 md:mb-8"
          >
            <div className="text-5xl md:text-6xl mb-3">🧩</div>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
              Complete the Puzzle
            </h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
              Drag and drop the pieces to reveal the surprise!
            </p>
          </motion.div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
            <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-xl p-3 text-center border border-white/50 dark:border-white/10">
              <div className="text-2xl md:text-3xl mb-1">🎯</div>
              <div className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{moves}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Moves</div>
            </div>
            
            <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-xl p-3 text-center border border-white/50 dark:border-white/10">
              <div className="text-2xl md:text-3xl mb-1">⏱️</div>
              <div className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{formatTime(timeSpent)}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Time</div>
            </div>
            
            <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-xl p-3 text-center border border-white/50 dark:border-white/10">
              <div className="text-2xl md:text-3xl mb-1">{gridSize}x{gridSize}</div>
              <div className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                {gridSizes.find(g => g.value === gridSize)?.label}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Difficulty</div>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <select
              value={gridSize}
              onChange={(e) => setGridSize(Number(e.target.value))}
              className="px-4 py-2 bg-white/50 dark:bg-gray-900/50 border border-pink-300 dark:border-pink-500/30 rounded-xl focus:outline-none focus:border-pink-500 text-gray-800 dark:text-white"
            >
              {gridSizes.map(size => (
                <option key={size.value} value={size.value}>
                  {size.icon} {size.size} - {size.label}
                </option>
              ))}
            </select>
            
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-white/50 dark:bg-gray-900/50 border border-pink-300 dark:border-pink-500/30 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-white/60 transition-all"
            >
              🔄 New Game
            </button>
            
            <button
              onClick={getHint}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl shadow-lg hover:shadow-pink-500/25 transition-all"
            >
              💡 Hint
            </button>
          </div>
          
          {/* Hint */}
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center mb-4 p-3 bg-pink-100 dark:bg-pink-900/30 rounded-xl text-pink-600 dark:text-pink-400 text-sm"
              >
                💡 Tip: Start with the corners and edges first!
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Puzzle Grid */}
          <div className="bg-white/20 dark:bg-gray-900/20 backdrop-blur-sm rounded-2xl p-4 border border-white/50 dark:border-white/10 shadow-2xl">
            <div 
              className="grid gap-1 rounded-xl overflow-hidden"
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
                  isCompleted={completed}
                  gridSize={gridSize}
                />
              ))}
            </div>
          </div>
          
          {/* Progress */}
          {!completed && pieces.length > 0 && (
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Progress</span>
                <span>
                  {Math.round((pieces.filter(p => p.currentIndex === p.correctIndex).length / pieces.length) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(pieces.filter(p => p.currentIndex === p.correctIndex).length / pieces.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}
          
          {/* Completion Celebration */}
          <AnimatePresence>
            {completed && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="fixed inset-0 flex items-center justify-center z-50"
              >
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                  className="relative bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-8 text-center shadow-2xl mx-4"
                >
                  <div className="text-7xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Puzzle Completed!</h3>
                  <p className="text-pink-100">
                    You solved it in {moves} moves and {formatTime(timeSpent)}!
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DndProvider>
  );
};

export default PuzzleGameComponent;