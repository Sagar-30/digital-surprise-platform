import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Howl } from 'howler';

const MusicPlayer = ({ src, autoPlay = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const soundRef = useRef(null);
  
  useEffect(() => {
    if (src) {
      soundRef.current = new Howl({
        src: [src],
        loop: true,
        volume: 0.5,
        onplay: () => setIsPlaying(true),
        onpause: () => setIsPlaying(false),
      });
      
      if (autoPlay) {
        soundRef.current.play();
      }
    }
    
    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, [src, autoPlay]);
  
  const togglePlay = () => {
    if (soundRef.current) {
      if (isPlaying) {
        soundRef.current.pause();
      } else {
        soundRef.current.play();
      }
    }
  };
  
  const toggleMute = () => {
    if (soundRef.current) {
      soundRef.current.mute(!isMuted);
      setIsMuted(!isMuted);
    }
  };
  
  if (!src) return null;
  
  return (
    <motion.div
      className="fixed bottom-4 right-4 glass-card p-2 flex gap-2 z-50"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 1 }}
    >
      <button
        onClick={togglePlay}
        className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors flex items-center justify-center"
      >
        {isPlaying ? '⏸️' : '▶️'}
      </button>
      <button
        onClick={toggleMute}
        className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors flex items-center justify-center"
      >
        {isMuted ? '🔇' : '🔊'}
      </button>
    </motion.div>
  );
};

export default MusicPlayer;