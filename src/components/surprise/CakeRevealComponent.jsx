import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const CakeRevealComponent = ({ cakeType, onComplete }) => {
  const [stage, setStage] = useState('candles'); // candles, cutting, revealed
  const [litCandles, setLitCandles] = useState([true, true, true, true, true]);
  const [blowingCandle, setBlowingCandle] = useState(null);
  const [isBlowing, setIsBlowing] = useState(false);
  const [cutProgress, setCutProgress] = useState(0);
  const [showKnife, setShowKnife] = useState(false);
  const [particles, setParticles] = useState([]);

  const cakeOptions = {
    'Chocolate Fantasy': { emoji: '🍫', image: '/cake/chocolate-cake.webp', label: 'Chocolate Fantasy', desc: 'Rich chocolate layers with ganache' },
    'Princess Double Storey': { emoji: '👑', image: '/cake/princess-cake.webp', label: 'Princess Double Storey', desc: 'Elegant two-tier princess cake' },
    'Galaxy Classic': { emoji: '🌌', image: '/cake/galaxy-cake.webp', label: 'Galaxy Classic', desc: 'Magical galaxy themed design' },
    'Strawberry Princess': { emoji: '🍓', image: '/cake/strawberry-cake.webp', label: 'Strawberry Princess', desc: 'Fresh strawberry cream delight' }
  };

  const cake = cakeOptions[cakeType] || cakeOptions['Galaxy Classic'];

  // Blow candle one by one
  const blowCandle = (index) => {
    if (!litCandles[index] || isBlowing) return;
    
    setBlowingCandle(index);
    setIsBlowing(true);
    
    // Create puff particles
    const newParticles = [];
    for (let i = 0; i < 10; i++) {
      newParticles.push({
        id: Date.now() + i,
        x: 30 + index * 10,
        y: 50,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 5 + 2,
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
    
    setTimeout(() => {
      setLitCandles(prev => {
        const newState = [...prev];
        newState[index] = false;
        return newState;
      });
      setBlowingCandle(null);
      setIsBlowing(false);
      
      // Play blow sound effect (optional)
      const audio = new Audio('/sounds/blow.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {});
      
      // Check if all candles are blown
      const allBlown = litCandles.filter((_, idx) => idx !== index && litCandles[idx]).length === 0;
      if (allBlown || (litCandles.filter(c => c).length === 1 && index === litCandles.findIndex(c => c))) {
        // Small delay before moving to cutting stage
        setTimeout(() => {
          setStage('cutting');
          setShowKnife(true);
        }, 1000);
      }
    }, 800);
  };

  // Handle cake cutting with knife drag
  const handleCutStart = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    if (startX > 30 && startX < rect.width - 30) {
      setCutProgress(10);
    }
  };

  const handleCutMove = (e) => {
    if (cutProgress >= 100) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const progress = Math.min(100, Math.max(0, ((x - 30) / (rect.width - 60)) * 100));
    setCutProgress(progress);
    
    // Add cutting particles
    if (progress > cutProgress && progress % 20 < 5) {
      const newParticles = [];
      for (let i = 0; i < 5; i++) {
        newParticles.push({
          id: Date.now() + i,
          x: x / rect.width * 100,
          y: 55 + Math.random() * 10,
          angle: Math.random() * Math.PI * 2,
          speed: Math.random() * 3 + 1,
        });
      }
      setParticles(prev => [...prev, ...newParticles]);
    }
  };

  const handleCutEnd = () => {
    if (cutProgress >= 90) {
      setCutProgress(100);
      setTimeout(() => {
        setStage('revealed');
        setTimeout(() => {
          onComplete();
        }, 2000);
      }, 500);
    } else {
      setCutProgress(0);
      toast.error('Cut all the way through the cake!');
    }
  };

  // Clean up particles
  useEffect(() => {
    const timer = setInterval(() => {
      setParticles(prev => prev.slice(-50));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-gray-950 via-blue-950 to-indigo-950">
      {/* Background stars */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${Math.random() * 3 + 2}s infinite`
            }}
          />
        ))}
      </div>

      <div className="max-w-md w-full mx-auto text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold text-white mb-2 font-poppins"
        >
          {stage === 'candles' && "🎂 Make a Wish! 🎂"}
          {stage === 'cutting' && "🔪 Cut the Cake! 🔪"}
          {stage === 'revealed' && "🎉 Cake Time! 🎉"}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-300 mb-8 font-poppins"
        >
          {stage === 'candles' && "Blow out the candles one by one!"}
          {stage === 'cutting' && "Drag the knife across the cake"}
          {stage === 'revealed' && "The cake is ready to enjoy!"}
        </motion.p>

        {/* Cake Container */}
        <div className="relative">
          {/* Cake glow effect */}
          <motion.div
            className="absolute -inset-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full filter blur-2xl opacity-30"
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Cake Image */}
          <div 
            className="relative cursor-pointer"
            onMouseMove={stage === 'cutting' ? handleCutMove : undefined}
            onMouseUp={stage === 'cutting' ? handleCutEnd : undefined}
            onMouseLeave={stage === 'cutting' ? handleCutEnd : undefined}
          >
            <img
              src={cake.image}
              alt={cake.label}
              className="w-80 h-80 mx-auto object-contain rounded-2xl"
            />
            
            {/* Candles */}
            {stage === 'candles' && (
              <div className="absolute inset-0">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      bottom: '45%',
                      left: `${30 + i * 10}%`,
                      transform: 'translateX(-50%)',
                    }}
                  >
                    {/* Candle stick */}
                    <div className="w-3 h-8 bg-gradient-to-r from-red-400 to-pink-500 rounded-full" />
                    
                    {/* Flame */}
                    {litCandles[i] && (
                      <motion.div
                        className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          y: [0, -3, 0]
                        }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      >
                        <div className="relative">
                          <div className="w-4 h-4 bg-orange-400 rounded-full filter blur-sm" />
                          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-300 rounded-full" />
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Blow button */}
                    {litCandles[i] && (
                      <button
                        onClick={() => blowCandle(i)}
                        disabled={isBlowing}
                        className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs whitespace-nowrap hover:bg-white/30 transition-all"
                      >
                        💨 Blow
                      </button>
                    )}
                    
                    {/* Blowing animation */}
                    {blowingCandle === i && (
                      <motion.div
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-2xl"
                      >
                        💨
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
            
            {/* Cutting knife */}
            {stage === 'cutting' && showKnife && (
              <motion.div
                initial={{ x: -50, rotate: -30 }}
                animate={{ x: `${cutProgress}%`, rotate: -30 }}
                transition={{ type: 'spring', damping: 20 }}
                className="absolute -top-4 left-0 text-3xl filter drop-shadow-lg"
                style={{ marginLeft: '-15px' }}
              >
                🔪
              </motion.div>
            )}
            
            {/* Cut line */}
            {stage === 'cutting' && cutProgress > 0 && (
              <div 
                className="absolute top-1/2 h-0.5 bg-white/60 rounded-full"
                style={{ 
                  width: `${cutProgress}%`,
                  left: '15%',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
              />
            )}
            
            {/* Cutting instruction */}
            {stage === 'cutting' && cutProgress === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm animate-pulse">
                  👆 Drag knife across the cake
                </div>
              </div>
            )}
          </div>
          
          {/* Particles effect */}
          <AnimatePresence>
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{ 
                  x: `${particle.x}%`, 
                  y: `${particle.y}%`,
                  scale: 0,
                  opacity: 1
                }}
                animate={{ 
                  x: `${particle.x + Math.cos(particle.angle) * particle.speed * 10}%`,
                  y: `${particle.y + Math.sin(particle.angle) * particle.speed * 10}%`,
                  scale: 1,
                  opacity: 0
                }}
                transition={{ duration: 1 }}
                className="absolute text-xl pointer-events-none"
              >
                ✨
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {/* Status message */}
        {stage === 'candles' && (
          <p className="text-center text-white/70 mt-6 text-sm font-poppins">
            {litCandles.filter(c => c).length} candles remaining 💨
          </p>
        )}
        
        {stage === 'cutting' && cutProgress > 0 && cutProgress < 100 && (
          <div className="mt-6">
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-100"
                style={{ width: `${cutProgress}%` }}
              />
            </div>
            <p className="text-white/70 text-sm mt-2 font-poppins">
              {Math.round(cutProgress)}% cut
            </p>
          </div>
        )}
        
        {/* Revealed message */}
        {stage === 'revealed' && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-6 text-center"
          >
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h3 className="text-2xl font-bold text-pink-400 mb-2 font-poppins">
              Happy Birthday! 🎂
            </h3>
            <p className="text-white mb-2 font-poppins">
              The {cake.label} cake looks amazing!
            </p>
            <p className="text-gray-300 text-sm font-poppins">
              Your wish has been granted... ✨
            </p>
          </motion.div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default CakeRevealComponent;