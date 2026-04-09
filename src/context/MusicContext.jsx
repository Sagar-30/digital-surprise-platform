import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Howl } from 'howler';

const MusicContext = createContext();

export const useMusic = () => useContext(MusicContext);

export const MusicProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(null);
  const soundRef = useRef(null);
  
  const initializeMusic = (src) => {
    if (!src) return;
    
    // Don't reinitialize if same source
    if (currentSrc === src && soundRef.current) return;
    
    // Clean up old instance
    if (soundRef.current) {
      soundRef.current.unload();
    }
    
    setCurrentSrc(src);
    
    soundRef.current = new Howl({
      src: [src],
      loop: true,
      volume: 0.5,
      html5: true,
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onend: () => {
        if (soundRef.current) {
          soundRef.current.play();
        }
      },
    });
  };
  
  const play = () => {
    if (soundRef.current) {
      soundRef.current.play();
    }
  };
  
  const pause = () => {
    if (soundRef.current) {
      soundRef.current.pause();
    }
  };
  
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
  
  // Try to autoplay on user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (currentSrc && soundRef.current && !isPlaying) {
        soundRef.current.play();
      }
    };
    
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);
    
    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [currentSrc, isPlaying]);
  
  return (
    <MusicContext.Provider value={{
      initializeMusic,
      play,
      pause,
      togglePlay,
      toggleMute,
      isPlaying,
      isMuted,
      currentSrc,
    }}>
      {children}
    </MusicContext.Provider>
  );
};