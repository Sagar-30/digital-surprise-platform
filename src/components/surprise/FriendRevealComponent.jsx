import { useState } from 'react';
import { motion } from 'framer-motion';

const FriendRevealComponent = ({ friend, onComplete }) => {
  const [showMessage, setShowMessage] = useState(false);

  const friendOptions = {
    'Bunny': { emoji: '🐰', image: '/friend/bunny.webp', label: 'Bunny', desc: 'Soft and cuddly companion' },
    'Kitty': { emoji: '🐱', image: '/friend/kitty.webp', label: 'Kitty', desc: 'Playful and curious friend' },
    'Teddy': { emoji: '🧸', image: '/friend/teddy.webp', label: 'Teddy', desc: 'Classic bear hugger' }
  };

  const currentFriend = friendOptions[friend] || friendOptions['Kitty'];

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
          Your Little Friend 🧸
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-300 mb-8 font-poppins"
        >
          A special companion just for you!
        </motion.p>

        {!showMessage ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <img
                src={currentFriend.image}
                alt={currentFriend.label}
                className="w-40 h-40 mx-auto object-contain mb-4"
              />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-2 font-poppins">
              {currentFriend.label}
            </h3>
            <p className="text-gray-300 mb-6 font-poppins">{currentFriend.desc}</p>
            
            <button
              onClick={handleContinue}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-pink-500/25 transition-all font-poppins"
            >
              A Perfect Match! 💕
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl"
          >
            <div className="text-5xl mb-4">🎁</div>
            <h3 className="text-xl font-bold text-white mb-2 font-poppins">
              Your {currentFriend.label} friend is here!
            </h3>
            <p className="text-gray-300 font-poppins">
              Ready to share this special journey with you 🐾
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FriendRevealComponent;