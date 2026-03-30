import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const MessageReveal = ({ message, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);
  
  useEffect(() => {
    if (index < message.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + message[index]);
        setIndex(index + 1);
      }, 100);
      
      return () => clearTimeout(timer);
    } else if (index === message.length) {
      setTimeout(onComplete, 1000);
    }
  }, [index, message, onComplete]);
  
  return (
    <motion.div
      className="glass-card p-8 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <h2 className="text-3xl font-bold text-white mb-6">A Special Message for You</h2>
      <p className="text-xl text-purple-300 leading-relaxed">
        {displayText}
        {index < message.length && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="inline-block w-0.5 h-6 bg-purple-400 ml-1"
          />
        )}
      </p>
    </motion.div>
  );
};

export default MessageReveal;