import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ReactConfetti from 'react-confetti';
import toast from 'react-hot-toast';

const CompletionComponent = () => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    
    // Hide confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);
  
  const floatingHearts = [...Array(20)].map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 2,
    size: Math.random() * 20 + 20,
  }));
  
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Confetti */}
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          colors={['#ec4899', '#a855f7', '#f43f5e', '#eab308', '#06b6d4']}
          numberOfPieces={200}
          recycle={false}
        />
      )}
      
      {/* Floating Hearts Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingHearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ 
              y: '100%', 
              x: `${heart.left}%`,
              opacity: 0,
              scale: 0
            }}
            animate={{ 
              y: '-20%',
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              rotate: [0, 360]
            }}
            transition={{ 
              duration: heart.duration,
              delay: heart.delay,
              ease: "easeOut"
            }}
            className="absolute"
            style={{ fontSize: `${heart.size}px` }}
          >
            {['💕', '💝', '💖', '💗', '💓', '💞'][Math.floor(Math.random() * 6)]}
          </motion.div>
        ))}
      </div>
      
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="w-full max-w-2xl mx-auto relative z-10"
      >
        {/* Celebration Card */}
        <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 md:p-10 border border-white/50 dark:border-white/10 shadow-2xl text-center">
          {/* Animated Trophy/Emoji */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-6xl md:text-7xl mb-4"
          >
            🎉
          </motion.div>
          
          {/* Main Title */}
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Congratulations! 🎉
            </span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            You've completed the surprise experience!
          </motion.p>
          
          {/* Decorative Divider */}
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
              />
            ))}
          </div>
          
          {/* Message Card */}
          <motion.div 
            className="bg-white/50 dark:bg-gray-900/50 rounded-xl p-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex justify-center gap-2 mb-3">
              <span className="text-2xl">💕</span>
              <span className="text-2xl">💝</span>
              <span className="text-2xl">💕</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed">
              Thank you for being part of this special moment. 
              This experience was created just for you with lots of love! ❤️
            </p>
          </motion.div>
          
          {/* Share Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-6"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Spread the love and create magical moments for your loved ones!
            </p>
            
            {/* Share Buttons */}
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => {
                  navigator.share?.({
                    title: 'Magical Surprise Experience',
                    text: 'I just had an amazing surprise experience! You should create one too!',
                    url: window.location.href,
                  });
                }}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-sm font-semibold shadow-lg hover:shadow-blue-500/25 transition-all flex items-center gap-2"
              >
                📱 Share
              </button>
              
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Link copied to clipboard!');
                }}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-semibold shadow-lg hover:shadow-purple-500/25 transition-all flex items-center gap-2"
              >
                🔗 Copy Link
              </button>
            </div>
          </motion.div>
          
          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-pink-500/25 transition-all"
            >
              Create Your Own Surprise ✨
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm text-gray-700 dark:text-white rounded-xl font-semibold border border-pink-300 dark:border-pink-500/30 hover:bg-white/60 transition-all"
            >
              Watch Again 🎬
            </button>
          </motion.div>
          
          {/* Footer Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xs text-gray-400 dark:text-gray-500 mt-6"
          >
            Made with 💕 for creating beautiful moments
          </motion.p>
        </div>
        
        {/* Star Rating Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-full">
            <span className="text-yellow-400 text-sm">★★★★★</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Loved this experience?
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CompletionComponent;