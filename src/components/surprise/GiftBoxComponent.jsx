import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GiftBoxComponent = ({ onOpen, surpriseContent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleOpen = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsOpen(true);
    
    setTimeout(() => {
      onOpen();
      setIsAnimating(false);
    }, 1000);
  };
  
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <AnimatePresence>
        {!isOpen ? (
          <motion.div
            className="relative cursor-pointer"
            onClick={handleOpen}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="w-64 h-64 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl shadow-2xl relative"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(236, 72, 153, 0.5)',
                  '0 0 40px rgba(236, 72, 153, 0.8)',
                  '0 0 20px rgba(236, 72, 153, 0.5)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {/* Lid */}
              <motion.div
                className="absolute -top-8 left-0 right-0 h-16 bg-gradient-to-br from-red-400 to-pink-400 rounded-t-xl"
                animate={isAnimating ? { y: -80, rotateX: 90 } : {}}
                transition={{ duration: 0.5 }}
              />
              
              {/* Ribbon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-full bg-yellow-400" />
                <div className="absolute inset-x-0 h-8 bg-yellow-400" />
              </div>
              
              {/* Bow */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                <div className="w-12 h-12 bg-yellow-400 rounded-full" />
                <div className="absolute -left-8 top-0 w-8 h-12 bg-yellow-400 rounded-full" />
                <div className="absolute -right-8 top-0 w-8 h-12 bg-yellow-400 rounded-full" />
              </div>
            </motion.div>
            <p className="text-center text-white mt-4">Click to open your surprise!</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              🎁 Surprise! 🎁
            </h2>
            <p className="text-xl text-purple-300">{surpriseContent}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GiftBoxComponent;