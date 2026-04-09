import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const MusicPlayer = ({ src, autoPlay = true }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(autoPlay);
  const audioRef = useRef(null);
  
  useEffect(() => {
    if (!src) return;
    
    audioRef.current = new Audio(src);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;
    
    audioRef.current.addEventListener('play', () => setIsPlaying(true));
    audioRef.current.addEventListener('pause', () => setIsPlaying(false));
    
    // Try autoplay immediately
    if (autoPlay) {
      audioRef.current.play().catch(() => {
        // Autoplay failed, show play button
        setShowPlayButton(true);
      });
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [src, autoPlay]);
  
  const startPlayback = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setShowPlayButton(false);
    }
  };
  
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };
  
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  if (!src) return null;
  
  return (
    <>
      {/* Big Play Button Overlay for first interaction */}
      {showPlayButton && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={startPlayback}
        >
          <motion.button
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-24 h-24 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white text-4xl shadow-2xl"
          >
            ▶️
          </motion.button>
          <p className="absolute bottom-20 text-white text-center">
            Tap to start the magical experience with music 🎵
          </p>
        </motion.div>
      )}
      
      {/* Mini Player */}
      <motion.div
        className="fixed bottom-4 right-4 glass-card p-2 flex gap-2 z-50"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:shadow-lg transition-all flex items-center justify-center text-white"
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        <button
          onClick={toggleMute}
          className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:shadow-lg transition-all flex items-center justify-center text-white"
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
      </motion.div>
    </>
  );
};

export default MusicPlayer;