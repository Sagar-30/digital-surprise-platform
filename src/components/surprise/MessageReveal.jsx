import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MessageReveal = ({ message, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);
  const [showEnvelope, setShowEnvelope] = useState(true);
  const [isOpening, setIsOpening] = useState(false);
  
  useEffect(() => {
    if (!showEnvelope && index < message.length) {
      const speed = Math.random() * 60 + 50;
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + message[index]);
        setIndex(index + 1);
      }, speed);
      
      return () => clearTimeout(timer);
    } else if (!showEnvelope && index === message.length) {
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  }, [index, message, onComplete, showEnvelope]);
  
  const openEnvelope = () => {
    setIsOpening(true);
    setTimeout(() => {
      setShowEnvelope(false);
      setIsOpening(false);
    }, 800);
  };
  
  if (showEnvelope) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative cursor-pointer"
          onClick={openEnvelope}
        >
          {/* Envelope glow */}
          <motion.div
            className="absolute -inset-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full filter blur-2xl opacity-50"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Envelope body */}
          <div className="relative w-64 h-48 sm:w-80 sm:h-56 bg-gradient-to-br from-pink-400 to-rose-400 rounded-lg shadow-2xl">
            {/* Envelope flap */}
            <motion.div
              className="absolute -top-12 left-0 w-full h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-t-lg"
              animate={isOpening ? { 
                y: -80, 
                rotateX: 180,
                opacity: 0
              } : {}}
              transition={{ duration: 0.5 }}
            >
              {/* Triangle fold effect */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-pink-600 clip-triangle" />
            </motion.div>
            
            {/* Envelope seal */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl">💕</span>
              </div>
            </div>
            
            {/* Decorative lines */}
            <div className="absolute bottom-4 left-4 right-4 h-px bg-white/30" />
            <div className="absolute bottom-8 left-4 right-4 h-px bg-white/20" />
          </div>
          
          <p className="text-center text-gray-600 dark:text-gray-300 mt-6 text-sm sm:text-base">
            💝 Click to open your letter 💝
          </p>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating hearts background */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: '100%', x: `${Math.random() * 100}%`, opacity: 0 }}
          animate={{ y: '-20%', opacity: [0, 0.5, 0] }}
          transition={{ duration: Math.random() * 4 + 3, repeat: Infinity, delay: Math.random() * 5 }}
          className="absolute text-xl pointer-events-none"
        >
          💕
        </motion.div>
      ))}
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="w-full max-w-2xl mx-auto"
      >
        {/* Letter Card */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 md:p-10 shadow-2xl border border-pink-200 dark:border-pink-500/20">
          {/* Letterhead decoration */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-100 dark:bg-pink-900/30 rounded-full">
              <span className="text-pink-500">✉️</span>
              <span className="text-pink-600 dark:text-pink-400 text-xs font-semibold">A Love Letter</span>
            </div>
          </div>
          
          {/* Message */}
          <div className="min-h-[200px]">
            <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {displayText}
              {index < message.length && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="inline-block w-0.5 h-5 bg-pink-500 ml-1"
                />
              )}
            </p>
          </div>
          
          {/* Signature */}
          {index === message.length && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 text-right"
            >
              <div className="inline-block">
                <div className="text-2xl mb-1">💕</div>
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  With all my love
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default MessageReveal;