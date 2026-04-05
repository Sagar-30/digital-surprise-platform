import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { differenceInSeconds } from 'date-fns';

const CountdownComponent = ({ targetDate, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const diff = differenceInSeconds(new Date(targetDate), new Date());
      if (diff <= 0) {
        onComplete();
        return null;
      }
      
      const days = Math.floor(diff / 86400);
      const hours = Math.floor((diff % 86400) / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;
      
      return { days, hours, minutes, seconds };
    };
    
    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      if (!newTimeLeft) clearInterval(timer);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [targetDate, onComplete]);
  
  if (!timeLeft) return null;
  
  const timeUnits = [
    { key: 'days', label: 'Days', icon: '📅', color: 'from-pink-400 to-rose-400' },
    { key: 'hours', label: 'Hours', icon: '⏰', color: 'from-purple-400 to-indigo-400' },
    { key: 'minutes', label: 'Minutes', icon: '⏱️', color: 'from-blue-400 to-cyan-400' },
    { key: 'seconds', label: 'Seconds', icon: '💕', color: 'from-orange-400 to-amber-400' }
  ];
  
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-8">
      <div className="text-center max-w-4xl mx-auto">
        {/* Animated header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-12"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-5xl md:text-7xl mb-4"
          >
            ⏰
          </motion.div>
          
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Your surprise is coming soon
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm md:text-base text-gray-600 dark:text-gray-300"
          >
            Get ready for something magical! ✨
          </motion.p>
        </motion.div>
        
        {/* Countdown timer grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12">
          {timeUnits.map((unit, idx) => (
            <motion.div
              key={unit.key}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: idx * 0.1, type: "spring" }}
              whileHover={{ y: -5, scale: 1.05 }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              className="relative group"
            >
              <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/50 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all">
                {/* Decorative icon */}
                <div className="text-2xl md:text-3xl mb-2 md:mb-3">
                  {unit.icon}
                </div>
                
                {/* Number */}
                <motion.div 
                  className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-1 md:mb-2"
                  animate={{
                    scale: isHovered ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <span className={`bg-gradient-to-r ${unit.color} bg-clip-text text-transparent`}>
                    {String(timeLeft[unit.key]).padStart(2, '0')}
                  </span>
                </motion.div>
                
                {/* Label */}
                <div className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300 capitalize font-semibold">
                  {unit.label}
                </div>
                
                {/* Progress bar for seconds (optional visual) */}
                {unit.key === 'seconds' && (
                  <motion.div 
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-b-2xl"
                    initial={{ width: '0%' }}
                    animate={{ width: `${(timeLeft.seconds / 60) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Decorative message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <div className="flex justify-center gap-2 text-xl md:text-2xl">
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              💕
            </motion.span>
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1, delay: 0.2, repeat: Infinity }}
            >
              🎀
            </motion.span>
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1, delay: 0.4, repeat: Infinity }}
            >
              💝
            </motion.span>
          </div>
          
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 animate-pulse">
            The magic is loading... ✨
          </p>
        </motion.div>
        
        {/* Floating hearts animation */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-xl md:text-2xl"
              initial={{
                x: `${Math.random() * 100}%`,
                y: '100%',
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
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeOut"
              }}
            >
              {['💕', '💝', '💖', '💗', '💓'][i % 5]}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CountdownComponent;