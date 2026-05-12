import { useState } from 'react';
import { motion } from 'framer-motion';

const VibeRevealComponent = ({ vibe, onComplete }) => {
  const [showMessage, setShowMessage] = useState(false);

  const vibeOptions = {
    'Sweet & Warm': { emoji: '🎀', label: 'Sweet & Warm', color: 'from-pink-400 to-rose-400', desc: 'Cozy and heartwarming' },
    'Fun & Playful': { emoji: '😂', label: 'Fun & Playful', color: 'from-yellow-400 to-orange-400', desc: 'Energetic and joyful' },
    'Deep Love': { emoji: '🔥', label: 'Deep Love', color: 'from-red-400 to-pink-500', desc: 'Passionate and romantic' }
  };

  const currentVibe = vibeOptions[vibe] || vibeOptions['Sweet & Warm'];

  const handleContinue = () => {
    setShowMessage(true);
    setTimeout(() => onComplete(), 1500);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold text-white mb-2 font-poppins"
        >
          The Perfect Vibe ✨
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-300 mb-8 font-poppins"
        >
          The energy you bring...
        </motion.p>

        {!showMessage ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`bg-gradient-to-r ${currentVibe.color} rounded-2xl p-8 shadow-2xl`}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1 }}
              className="text-7xl mb-4"
            >
              {currentVibe.emoji}
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-2 font-poppins">
              {currentVibe.label}
            </h3>
            <p className="text-white/90 mb-6 font-poppins">{currentVibe.desc}</p>
            
            <button
              onClick={handleContinue}
              className="px-6 py-3 bg-white text-gray-800 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all font-poppins"
            >
              That's So True! 💕
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl"
          >
            <div className="text-5xl mb-4">✨</div>
            <h3 className="text-xl font-bold text-white mb-2 font-poppins">
              Your vibe is absolutely {vibe}!
            </h3>
            <p className="text-gray-300 font-poppins">
              It's what makes every moment special 🌟
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default VibeRevealComponent;