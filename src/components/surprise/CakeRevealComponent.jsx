import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const CakeRevealComponent = ({ cakeType, onComplete }) => {
  const [stage, setStage] = useState('candles'); // candles, cutting, revealed
  const [litCandles, setLitCandles] = useState([true, true, true, true, true]);
  const [isBlowingAll, setIsBlowingAll] = useState(false);
  const [cutProgress, setCutProgress] = useState(0);
  const [showKnife, setShowKnife] = useState(false);
  const [particles, setParticles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const cakeContainerRef = useRef(null);
  const knifeRef = useRef(null);

  const cakeOptions = {
    'Chocolate Fantasy': { emoji: '🍫', image: '/cake/chocolate-cake.webp', label: 'Chocolate Fantasy', desc: 'Rich chocolate layers with ganache' },
    'Princess Double Storey': { emoji: '👑', image: '/cake/princess-cake.webp', label: 'Princess Double Storey', desc: 'Elegant two-tier princess cake' },
    'Galaxy Classic': { emoji: '🌌', image: '/cake/galaxy-cake.webp', label: 'Galaxy Classic', desc: 'Magical galaxy themed design' },
    'Strawberry Princess': { emoji: '🍓', image: '/cake/strawberry-cake.webp', label: 'Strawberry Princess', desc: 'Fresh strawberry cream delight' }
  };

  const cake = cakeOptions[cakeType] || cakeOptions['Galaxy Classic'];

  // Blow all candles at once with microphone detection or button
  const blowAllCandles = () => {
    if (isBlowingAll) return;
    
    setIsBlowingAll(true);
    
    // Create puff particles for all candles
    const newParticles = [];
    for (let candle = 0; candle < 5; candle++) {
      for (let i = 0; i < 8; i++) {
        newParticles.push({
          id: Date.now() + candle * 100 + i,
          x: 30 + candle * 10,
          y: 45,
          angle: Math.random() * Math.PI * 2,
          speed: Math.random() * 8 + 3,
        });
      }
    }
    setParticles(prev => [...prev, ...newParticles]);
    
    // Play blow sound
    const audio = new Audio('/sounds/blow.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {});
    
    // Blow out candles one by one with delay
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < 5) {
        setLitCandles(prev => {
          const newState = [...prev];
          newState[currentIndex] = false;
          return newState;
        });
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsBlowingAll(false);
        
        // Move to cutting stage after all candles are blown
        setTimeout(() => {
          setStage('cutting');
          setShowKnife(true);
        }, 1000);
      }
    }, 200);
  };

  // Handle cake cutting - Mobile friendly
  const handleCutStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const rect = cakeContainerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = clientX - rect.left;
      if (x > 30 && x < rect.width - 30) {
        setCutProgress(10);
      }
    }
  };

  const handleCutMove = (e) => {
    if (!isDragging || cutProgress >= 100) return;
    e.preventDefault();
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const rect = cakeContainerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = Math.min(rect.width - 30, Math.max(30, clientX - rect.left));
      const progress = Math.min(100, Math.max(0, ((x - 30) / (rect.width - 60)) * 100));
      setCutProgress(progress);
      
      // Add cutting particles
      if (progress > cutProgress && progress % 15 < 5) {
        const newParticles = [];
        for (let i = 0; i < 8; i++) {
          newParticles.push({
            id: Date.now() + i,
            x: (x / rect.width) * 100,
            y: 55 + Math.random() * 10,
            angle: Math.random() * Math.PI * 2,
            speed: Math.random() * 4 + 2,
          });
        }
        setParticles(prev => [...prev, ...newParticles]);
      }
    }
  };

  const handleCutEnd = () => {
    setIsDragging(false);
    if (cutProgress >= 90) {
      setCutProgress(100);
      setTimeout(() => {
        setStage('revealed');
        setTimeout(() => {
          onComplete();
        }, 2000);
      }, 500);
    } else if (cutProgress > 0) {
      toast.error('Cut all the way through the cake!');
      setCutProgress(0);
    }
  };

  // Add global event listeners for touch/mouse end
  useEffect(() => {
    const handleGlobalEnd = () => {
      if (isDragging) {
        handleCutEnd();
      }
    };
    
    window.addEventListener('mouseup', handleGlobalEnd);
    window.addEventListener('touchend', handleGlobalEnd);
    
    return () => {
      window.removeEventListener('mouseup', handleGlobalEnd);
      window.removeEventListener('touchend', handleGlobalEnd);
    };
  }, [isDragging, cutProgress]);

  // Clean up particles
  useEffect(() => {
    const timer = setInterval(() => {
      setParticles(prev => prev.slice(-50));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Animated flame component
  const Flame = () => (
    <motion.div
      className="relative"
      animate={{ 
        scale: [1, 1.1, 0.95, 1.05, 1],
      }}
      transition={{ duration: 0.5, repeat: Infinity }}
    >
      {/* Outer flame */}
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-orange-400 rounded-full filter blur-sm" />
      {/* Middle flame */}
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3.5 h-3.5 bg-orange-300 rounded-full filter blur-sm" />
      {/* Inner flame */}
      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-200 rounded-full" />
      {/* Core flame */}
      <div className="absolute -top-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
    </motion.div>
  );

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
          {stage === 'candles' && "Blow out all the candles together!"}
          {stage === 'cutting' && "Drag your finger/knife across the cake"}
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
          
          {/* Cake Image - Made draggable for mobile */}
          <div 
            ref={cakeContainerRef}
            className="relative select-none touch-none"
            onMouseDown={stage === 'cutting' ? handleCutStart : undefined}
            onMouseMove={stage === 'cutting' ? handleCutMove : undefined}
            onTouchStart={stage === 'cutting' ? handleCutStart : undefined}
            onTouchMove={stage === 'cutting' ? handleCutMove : undefined}
          >
            <img
              src={cake.image}
              alt={cake.label}
              className="w-80 h-80 mx-auto object-contain rounded-2xl pointer-events-none"
              draggable="false"
            />
            
            {/* Candles */}
            {stage === 'candles' && (
              <div className="absolute inset-0">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute"
                    style={{
                      bottom: '45%',
                      left: `${30 + i * 10}%`,
                      transform: 'translateX(-50%)',
                    }}
                  >
                    {/* Candle stick */}
                    <div className="w-3 h-8 bg-gradient-to-r from-red-400 to-pink-500 rounded-full shadow-md" />
                    
                    {/* Candle wick */}
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-gray-800 rounded-full" />
                    
                    {/* Flame */}
                    {litCandles[i] && <Flame />}
                  </div>
                ))}
              </div>
            )}
            
            {/* Cutting knife - Mobile friendly version */}
            {stage === 'cutting' && showKnife && (
              <motion.div
                ref={knifeRef}
                initial={{ x: -50, rotate: -30 }}
                animate={{ x: `${cutProgress}%`, rotate: -30 }}
                transition={{ type: 'spring', damping: 20 }}
                className="absolute -top-6 left-0 text-4xl filter drop-shadow-lg"
                style={{ marginLeft: '-20px' }}
              >
                🔪
              </motion.div>
            )}
            
            {/* Cut line with animation */}
            {stage === 'cutting' && cutProgress > 0 && (
              <>
                <div 
                  className="absolute top-1/2 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                  style={{ 
                    width: `${cutProgress}%`,
                    left: '15%',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    boxShadow: '0 0 5px rgba(236, 72, 153, 0.5)'
                  }}
                />
                {/* Sparkle effect at cut point */}
                {cutProgress < 100 && (
                  <div
                    className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
                    style={{
                      left: `calc(15% + ${cutProgress}%)`,
                      top: '50%',
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                )}
              </>
            )}
            
            {/* Cutting instruction overlay */}
            {stage === 'cutting' && cutProgress === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm animate-bounce font-poppins">
                  👆 Slide your finger across the cake
                </div>
              </div>
            )}
            
            {/* Dragging indicator */}
            {stage === 'cutting' && isDragging && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse" />
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
        
        {/* Blow All Candles Button */}
        {stage === 'candles' && (
          <div className="mt-8 space-y-4">
            <button
              onClick={blowAllCandles}
              disabled={isBlowingAll}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-pink-500/25 transition-all disabled:opacity-50 flex items-center gap-2 mx-auto font-poppins"
            >
              <span className="text-xl">💨</span>
              {isBlowingAll ? 'Blowing candles...' : 'Blow All Candles'}
            </button>
            <p className="text-center text-white/50 text-sm font-poppins">
              {litCandles.filter(c => c).length} candles remaining
            </p>
          </div>
        )}
        
        {/* Cutting progress bar */}
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
        .touch-none {
          touch-action: none;
        }
      `}</style>
    </div>
  );
};

export default CakeRevealComponent;