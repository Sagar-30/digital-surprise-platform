import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VideoPlayerComponent = ({ videoSrc, onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef(null);
  const controlsTimeout = useRef(null);
  
  useEffect(() => {
    const videoElement = videoRef.current;
    
    if (videoElement) {
      // Load video metadata first
      videoElement.load();
      
      // Add event listener for canplay through
      const handleCanPlayThrough = () => {
        setIsLoading(false);
        videoElement.play().catch(e => console.log("Auto-play prevented:", e));
      };
      
      videoElement.addEventListener('canplaythrough', handleCanPlayThrough);
      
      // Cleanup function
      return () => {
        if (videoElement) {
          videoElement.removeEventListener('canplaythrough', handleCanPlayThrough);
        }
      };
    }
  }, [videoSrc]);
  
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };
  
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };
  
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  const handleProgressBarClick = (e) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = rect.width;
      const clickPercentage = (x / width) * 100;
      const newTime = (clickPercentage / 100) * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
    }
  };
  
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    controlsTimeout.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 2000);
  };
  
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl mx-auto"
      >
        <div 
          className="relative rounded-2xl overflow-hidden shadow-2xl bg-black/50 backdrop-blur-sm"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => isPlaying && setShowControls(false)}
        >
          {/* Loading Overlay */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/70 flex items-center justify-center z-10"
              >
                <div className="text-center">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin mx-auto mb-4" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl">🎬</span>
                    </div>
                  </div>
                  <p className="text-white text-sm font-medium">Preparing your video...</p>
                  <p className="text-white/60 text-xs mt-1">This ensures smooth playback</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Video Element with optimizations */}
          <video
            ref={videoRef}
            src={videoSrc}
            preload="metadata"
            className="w-full h-auto rounded-2xl"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onWaiting={() => setIsBuffering(true)}
            onPlaying={() => setIsBuffering(false)}
            onEnded={onComplete}
            autoPlay
            playsInline
          />
          
          {/* Buffering Overlay */}
          <AnimatePresence>
            {isBuffering && !isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-white text-sm">Buffering...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Video Controls */}
          <AnimatePresence>
            {showControls && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-20"
              >
                {/* Progress Bar */}
                <div 
                  className="w-full h-1 bg-white/30 rounded-full cursor-pointer mb-3 group"
                  onClick={handleProgressBarClick}
                >
                  <div 
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                
                {/* Controls Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Play/Pause Button */}
                    <button
                      onClick={handlePlayPause}
                      className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all"
                    >
                      {isPlaying ? '⏸️' : '▶️'}
                    </button>
                    
                    {/* Mute Button */}
                    <button
                      onClick={handleMute}
                      className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all"
                    >
                      {isMuted ? '🔇' : '🔊'}
                    </button>
                    
                    {/* Time Display */}
                    <div className="text-white text-xs">
                      {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
                    </div>
                  </div>
                  
                  {/* Quality Indicator */}
                  <div className="text-white/60 text-xs">
                    HD
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Play Button Overlay (when paused) */}
          <AnimatePresence>
            {!isPlaying && !showControls && !isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute inset-0 flex items-center justify-center bg-black/30"
              >
                <button
                  onClick={handlePlayPause}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white text-3xl shadow-2xl hover:scale-110 transition-transform"
                >
                  ▶️
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Video Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-full">
            <span className="text-pink-500">🎬</span>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              A special video message for you
            </span>
            <span className="text-pink-500">💕</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VideoPlayerComponent;