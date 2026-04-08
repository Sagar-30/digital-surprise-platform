import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GiftBoxComponent = ({ onOpen, surpriseContent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [particles, setParticles] = useState([]);
  
  const handleOpen = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    // Create celebration particles
    const newParticles = [];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.5,
      });
    }
    setParticles(newParticles);
    
    setTimeout(() => {
      setIsOpen(true);
      setTimeout(() => {
        onOpen();
        setIsAnimating(false);
      }, 500);
    }, 800);
  };
  
  return (
    <div className="min-h-[60vh] flex justify-center items-center p-4 relative overflow-hidden">
      {/* Celebration Particles */}
      <AnimatePresence>
        {isAnimating && !isOpen && particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              x: `${particle.x}%`, 
              y: '50%',
              scale: 0,
              opacity: 1
            }}
            animate={{ 
              y: '-20%',
              x: `${particle.x + (Math.random() - 0.5) * 40}%`,
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              rotate: Math.random() * 360
            }}
            transition={{ 
              duration: 1,
              delay: particle.delay,
              ease: "easeOut"
            }}
            className="absolute text-2xl pointer-events-none"
          >
            {['🎉', '✨', '💕', '🎁', '🎀', '⭐', '💝'][Math.floor(Math.random() * 7)]}
          </motion.div>
        ))}
      </AnimatePresence>
      
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="gift-closed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="relative cursor-pointer"
            onClick={handleOpen}
          >
            {/* Glow effect */}
            <motion.div
              className="absolute -inset-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full filter blur-2xl opacity-50"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* Main Gift Box */}
            <motion.div
              className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl shadow-2xl"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(236, 72, 153, 0.4)',
                  '0 0 40px rgba(236, 72, 153, 0.7)',
                  '0 0 20px rgba(236, 72, 153, 0.4)',
                ],
                y: [0, -5, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-2xl" />
              
              {/* Lid */}
              <motion.div
                className="absolute -top-8 sm:-top-10 left-0 right-0 h-12 sm:h-14 bg-gradient-to-br from-pink-400 to-rose-400 rounded-t-xl"
                animate={isAnimating ? { 
                  y: -100, 
                  rotateX: 180,
                  opacity: 0,
                } : {}}
                transition={{ duration: 0.6, type: "spring" }}
              />
              
              {/* Vertical Ribbon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 sm:w-8 h-full bg-gradient-to-b from-yellow-400 to-amber-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-6 sm:h-8 bg-gradient-to-r from-yellow-400 to-amber-500" />
                </div>
              </div>
              
              {/* Ribbon pattern */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/2 left-0 right-0 h-px bg-white/50" />
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/50" />
              </div>
              
              {/* Bow */}
              <motion.div 
                className="absolute -top-10 sm:-top-12 left-1/2 transform -translate-x-1/2"
                animate={isAnimating ? { scale: 0, rotate: 180 } : {}}
                transition={{ duration: 0.4 }}
              >
                <div className="relative">
                  {/* Center knot */}
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full shadow-lg" />
                  
                  {/* Left loop */}
                  <motion.div 
                    className="absolute -left-8 sm:-left-10 top-0 w-8 h-12 sm:w-10 sm:h-14 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full"
                    animate={{ rotate: [0, -10, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  
                  {/* Right loop */}
                  <motion.div 
                    className="absolute -right-8 sm:-right-10 top-0 w-8 h-12 sm:w-10 sm:h-14 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full"
                    animate={{ rotate: [0, 10, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  
                  {/* Tail ends */}
                  <div className="absolute -bottom-6 -left-4 w-6 h-8 bg-yellow-400 rounded-full transform rotate-45" />
                  <div className="absolute -bottom-6 -right-4 w-6 h-8 bg-yellow-400 rounded-full transform -rotate-45" />
                </div>
              </motion.div>
              
              {/* Sparkles on the box */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-yellow-300 text-sm"
                  style={{
                    left: `${Math.random() * 80 + 10}%`,
                    top: `${Math.random() * 80 + 10}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.3,
                    repeat: Infinity,
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </motion.div>
            
            {/* Click instruction */}
            <motion.p 
              className="text-center text-gray-600 dark:text-gray-300 mt-6 text-sm sm:text-base"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              💝 Click to open your surprise! 💝
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="gift-open"
            initial={{ opacity: 0, scale: 0, rotateY: 90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="text-center max-w-md mx-auto"
          >
            {/* Surprise content card */}
            <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/50 dark:border-white/10 shadow-2xl">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="text-6xl md:text-7xl mb-4"
              >
                🎁
              </motion.div>
              
              <motion.h2 
                className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-3"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Surprise! 🎉
              </motion.h2>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                  {surpriseContent}
                </p>
                
                {/* Decorative hearts */}
                <div className="flex justify-center gap-3 text-2xl">
                  {[...Array(5)].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      💕
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </div>
            
            {/* Confetti effect after opening */}
            <AnimatePresence>
              {isOpen && (
                <>
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={`confetti-${i}`}
                      initial={{ 
                        x: '50%', 
                        y: '50%',
                        scale: 0,
                        rotate: 0
                      }}
                      animate={{ 
                        x: `${Math.random() * 100}%`,
                        y: `${Math.random() * 100}%`,
                        scale: [0, 1, 0],
                        rotate: Math.random() * 360
                      }}
                      transition={{ 
                        duration: 1.5,
                        delay: i * 0.05,
                        ease: "easeOut"
                      }}
                      className="fixed pointer-events-none text-xl"
                    >
                      {['🎉', '✨', '💕', '🎊', '⭐'][Math.floor(Math.random() * 5)]}
                    </motion.div>
                  ))}
                </>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GiftBoxComponent;