import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactConfetti from 'react-confetti';
import useSurpriseStore from '../store/surpriseStore.jsx';
import CountdownComponent from '../components/surprise/CountdownComponent';
import PuzzleGameComponent from '../components/surprise/PuzzleGameComponent';
import MusicPlayer from '../components/surprise/MusicPlayer';
import QuizComponent from '../components/surprise/QuizComponent';
import CakeRevealComponent from '../components/surprise/CakeRevealComponent';
import BondRevealComponent from '../components/surprise/BondRevealComponent';
import VibeRevealComponent from '../components/surprise/VibeRevealComponent';
import FriendRevealComponent from '../components/surprise/FriendRevealComponent';
import MessageReveal from '../components/surprise/MessageReveal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import VideoPlayerComponent from '../components/surprise/VideoPlayerComponent';
import CompletionComponent from '../components/surprise/CompletionComponent';

const SurpriseViewerPage = () => {
  const { id } = useParams();
  const { getSurprise, currentSurprise, isLoading } = useSurpriseStore();
  const [stage, setStage] = useState('countdown'); //countdown
  const [showConfetti, setShowConfetti] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Load saved stage from localStorage
    const savedStage = localStorage.getItem(`surprise_stage_${id}`);
    if (savedStage && savedStage !== 'complete') {
      setStage(savedStage);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      getSurprise(id);
    }
  }, [id, getSurprise]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === currentSurprise.password) {
      setIsAuthenticated(true);
    }
  };

  const handleCountdownComplete = () => {
    setStage('puzzle');
    localStorage.setItem(`surprise_stage_${id}`, 'puzzle');
  };

  const handlePuzzleComplete = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    // setStage('quiz');
    // localStorage.setItem(`surprise_stage_${id}`, 'quiz');
    setStage('cake');
    localStorage.setItem(`surprise_stage_${id}`, 'cake');
  };

  const handleQuizComplete = () => {
    setStage('cake');
    localStorage.setItem(`surprise_stage_${id}`, 'cake');
  };

  const handleCakeComplete = () => {
    setStage('bond');
    localStorage.setItem(`surprise_stage_${id}`, 'bond');
  };

  const handleBondComplete = () => {
    setStage('vibe');
    localStorage.setItem(`surprise_stage_${id}`, 'vibe');
  };

  const handleVibeComplete = () => {
    setStage('friend');
    localStorage.setItem(`surprise_stage_${id}`, 'friend');
  };

  const handleFriendComplete = () => {
    setStage('message');
    localStorage.setItem(`surprise_stage_${id}`, 'message');
  };

  const handleMessageComplete = () => {
    setStage('video');
    localStorage.setItem(`surprise_stage_${id}`, 'video');
  };

  const handleVideoComplete = () => {
    setStage('complete');
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
    localStorage.removeItem(`surprise_stage_${id}`);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!currentSurprise) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-white mb-4">Surprise not found</h2>
          <p className="text-gray-300">This surprise doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  if (currentSurprise.hasPassword && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-950 via-blue-950 to-indigo-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl"
        >
          <h2 className="text-2xl font-bold text-white mb-4 text-center font-poppins">
            Secret Entry 🔒
          </h2>
          <p className="text-gray-300 mb-6 text-center font-poppins">
            This surprise is protected. Enter the password to continue.
          </p>
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4 font-poppins"
              placeholder="Enter password..."
              autoFocus
            />
            <button type="submit" className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-pink-500/25 transition-all font-poppins">
              Unlock Surprise
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 relative overflow-hidden bg-gradient-to-br from-gray-950 via-blue-950 to-indigo-950">
      {showConfetti && <ReactConfetti />}
      {/* {currentSurprise.music && <MusicPlayer src={currentSurprise.music} autoPlay />} */}
      {currentSurprise.music ? <MusicPlayer src={currentSurprise.music} autoPlay /> : <MusicPlayer autoPlay />}

      <div className="container mx-auto px-4 relative z-10">
        <AnimatePresence mode="wait">
          {stage === 'countdown' && (
            <motion.div
              key="countdown"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CountdownComponent
                targetDate={currentSurprise.unlockDate}
                onComplete={handleCountdownComplete}
              />
            </motion.div>
          )}

          {stage === 'puzzle' && currentSurprise.images && currentSurprise.images.length > 0 && (
            <motion.div
              key="puzzle"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
            >
              <PuzzleGameComponent
                imageUrl={currentSurprise.images[0]}
                onComplete={handlePuzzleComplete}
              />
            </motion.div>
          )}

          {stage === 'quiz' && currentSurprise.quiz && currentSurprise.quiz.length > 0 && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
            >
              <QuizComponent
                questions={currentSurprise.quiz}
                onComplete={handleQuizComplete}
              />
            </motion.div>
          )}

          {stage === 'cake' && currentSurprise.cake && (
            <motion.div
              key="cake"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <CakeRevealComponent
                cakeType={currentSurprise.cake}
                onComplete={handleCakeComplete}
              />
            </motion.div>
          )}

          {stage === 'bond' && currentSurprise.bond && currentSurprise.bond.length > 0 && (
            <motion.div
              key="bond"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
            >
              <BondRevealComponent
                bonds={currentSurprise.bond}
                onComplete={handleBondComplete}
              />
            </motion.div>
          )}

          {stage === 'vibe' && currentSurprise.vibe && (
            <motion.div
              key="vibe"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <VibeRevealComponent
                vibe={currentSurprise.vibe}
                onComplete={handleVibeComplete}
              />
            </motion.div>
          )}

          {stage === 'friend' && currentSurprise.friend && (
            <motion.div
              key="friend"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
            >
              <FriendRevealComponent
                friend={currentSurprise.friend}
                onComplete={handleFriendComplete}
              />
            </motion.div>
          )}

          {stage === 'message' && currentSurprise.letter && (
            <motion.div
              key="message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <MessageReveal
                message={currentSurprise.letter}
                onComplete={handleMessageComplete}
              />
            </motion.div>
          )}

          {stage === 'video' && currentSurprise.video && (
            <VideoPlayerComponent
              videoSrc={currentSurprise.video}
              onComplete={handleVideoComplete}
            />
          )}

          {stage === 'complete' && (
            <CompletionComponent />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SurpriseViewerPage;