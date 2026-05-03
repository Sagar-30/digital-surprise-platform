import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MessageReveal = ({ message, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);
  const [showEnvelope, setShowEnvelope] = useState(true);
  const [isOpening, setIsOpening] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  
  useEffect(() => {
    if (!showEnvelope && index < message.length) {
      const speed = Math.random() * 60 + 50;
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + message[index]);
        setIndex(index + 1);
      }, speed);
      
      return () => clearTimeout(timer);
    } else if (!showEnvelope && index === message.length) {
      setIsTypingComplete(true);
    }
  }, [index, message, showEnvelope]);
  
  const openEnvelope = () => {
    setIsOpening(true);
    setTimeout(() => {
      setShowEnvelope(false);
      setIsOpening(false);
    }, 800);
  };
  
  const handleContinue = () => {
    onComplete();
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
          <motion.div
            className="absolute -inset-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full filter blur-2xl opacity-50"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          <div className="relative w-64 h-48 sm:w-80 sm:h-56 bg-gradient-to-br from-pink-400 to-rose-400 rounded-lg shadow-2xl">
            <motion.div
              className="absolute -top-12 left-0 w-full h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-t-lg"
              animate={isOpening ? { y: -80, rotateX: 180, opacity: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-pink-600" 
                   style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }} />
            </motion.div>
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl">💕</span>
              </div>
            </div>
            
            <div className="absolute bottom-4 left-4 right-4 h-px bg-white/30" />
            <div className="absolute bottom-8 left-4 right-4 h-px bg-white/20" />
          </div>
          
          <p className="text-center text-gray-600 dark:text-gray-300 mt-6 text-sm sm:text-base animate-pulse">
            💝 Click to open your letter 💝
          </p>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl mx-auto"
      >
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 md:p-10 shadow-2xl border border-pink-200 dark:border-pink-500/20">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-pink-100 dark:bg-pink-900/30 rounded-full">
              <span className="text-pink-500">✉️</span>
              <span className="text-pink-600 dark:text-pink-400 text-sm font-semibold">A Love Letter Just For You</span>
              <span className="text-pink-500">💕</span>
            </div>
          </div>
          
          {/* Message Display */}
          <div className="min-h-[250px]">
            <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {displayText}
              {!isTypingComplete && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="inline-block w-0.5 h-5 bg-gradient-to-r from-pink-500 to-purple-500 ml-1"
                />
              )}
            </p>
          </div>
          
          {/* Typing Indicator */}
          {!isTypingComplete && (
            <div className="flex items-center gap-1 mt-4">
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-200" />
              <span className="text-xs text-gray-400 ml-2">Writing your message...</span>
            </div>
          )}
          
          {/* Signature */}
          {isTypingComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 text-right"
            >
              <div className="inline-block">
                <div className="text-3xl mb-1">💕</div>
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  With all my love
                </p>
              </div>
            </motion.div>
          )}
          
          {/* Continue Button */}
          {isTypingComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center"
            >
              <motion.button
                onClick={handleContinue}
                className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold shadow-lg hover:shadow-pink-500/25 transition-all flex items-center gap-2 mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Continue to Next Stage</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.button>
              <p className="text-center text-xs text-gray-400 mt-3">
                Take your time reading this special message 💕
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default MessageReveal;