import { useState } from 'react';
import { motion } from 'framer-motion';

const BondRevealComponent = ({ bonds, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMessage, setShowMessage] = useState(false);

  const bondOptions = {
    'Sweet': { emoji: '💗', label: 'Sweet', desc: 'Always caring and kind' },
    'Loyal': { emoji: '🤝', label: 'Loyal', desc: 'Stands by your side always' },
    'My rock': { emoji: '🪨', label: 'My rock', desc: 'Strong and dependable' },
    'Bestie': { emoji: '⭐', label: 'Bestie', desc: 'Partner in crime' },
    'Always there': { emoji: '🤍', label: 'Always there', desc: 'Never let you down' },
    'Kind heart': { emoji: '😊', label: 'Kind heart', desc: 'Pure and gentle soul' }
  };

  const handleNext = () => {
    if (currentIndex + 1 < bonds.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowMessage(true);
      setTimeout(() => onComplete(), 2000);
    }
  };

  const currentBond = bondOptions[bonds[currentIndex]];

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold text-white text-center mb-2 font-poppins"
        >
          What Makes You Special 💗
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-300 text-center mb-8 font-poppins"
        >
          {currentIndex + 1} of {bonds.length}
        </motion.p>

        {!showMessage ? (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 text-center border border-white/20 shadow-2xl"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5 }}
              className="text-6xl mb-4"
            >
              {currentBond.emoji}
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-2 font-poppins">
              {currentBond.label}
            </h3>
            <p className="text-gray-300 mb-6 font-poppins">{currentBond.desc}</p>
            
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-pink-500/25 transition-all font-poppins"
            >
              {currentIndex + 1 < bonds.length ? 'Next →' : 'See All →'}
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 text-center border border-white/20 shadow-2xl"
          >
            <div className="flex justify-center gap-3 mb-4">
              {bonds.map((bond, idx) => (
                <motion.span
                  key={idx}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-3xl"
                >
                  {bondOptions[bond]?.emoji}
                </motion.span>
              ))}
            </div>
            <h3 className="text-2xl font-bold text-pink-400 mb-2 font-poppins">
              You're Amazing! 💕
            </h3>
            <p className="text-white font-poppins">
              All these qualities make you truly special!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BondRevealComponent;