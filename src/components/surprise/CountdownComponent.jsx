import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { differenceInSeconds, format } from 'date-fns';

const CountdownComponent = ({ targetDate, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  
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
  
  return (
    <div className="text-center">
      <motion.h2 
        className="text-3xl font-bold text-white mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Your surprise is coming soon ❤️
      </motion.h2>
      
      <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <motion.div
            key={unit}
            className="glass-card p-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-4xl md:text-6xl font-bold text-purple-400">
              {value}
            </div>
            <div className="text-sm text-gray-300 mt-2 capitalize">
              {unit}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CountdownComponent;