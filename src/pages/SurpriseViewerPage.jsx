import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactConfetti from 'react-confetti';
import useSurpriseStore from '../store/surpriseStore';
import CountdownComponent from '../components/surprise/CountdownComponent';
import PuzzleGameComponent from '../components/surprise/PuzzleGameComponent';
import MusicPlayer from '../components/surprise/MusicPlayer';
import QuizComponent from '../components/surprise/QuizComponent';
import GiftBoxComponent from '../components/surprise/GiftBoxComponent';
import TimelineComponent from '../components/surprise/TimelineComponent';
import MessageReveal from '../components/surprise/MessageReveal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import VideoPlayerComponent from '../components/surprise/VideoPlayerComponent';
import CompletionComponent from '../components/surprise/CompletionComponent';

const SurpriseViewerPage = () => {
  const { id } = useParams();
  const { getSurprise, currentSurprise, isLoading } = useSurpriseStore();
  const [stage, setStage] = useState('countdown'); // countdown, puzzle, quiz, gift, message, timeline, video, complete
  const [showConfetti, setShowConfetti] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let localStage = localStorage.getItem("Surprisestage");
    // console.log(localStage)
    if (localStage) {
      // setStage(localStage)
      // setStage("gift")
    } else {
      setStage("countdown")
    }
  }, []);

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
    localStorage.setItem("Surprisestage", 'puzzle');
  };

  const handlePuzzleComplete = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    setStage('quiz');
    localStorage.setItem("Surprisestage", "quiz");
  };

  const handleQuizComplete = () => {
    setStage('gift');
    localStorage.setItem("Surprisestage", "gift");
  };

  const handleGiftOpen = () => {
    setStage('message');
    localStorage.setItem("Surprisestage", "message");
  };

  const handleMessageComplete = () => {
    setStage('timeline');
    localStorage.setItem("Surprisestage", "timeline");
  };

  const handleTimelineComplete = () => {
    setStage('video');
    localStorage.setItem("Surprisestage", "video");
  };

  const handleVideoComplete = () => {
    setStage('complete');

    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
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
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 max-w-md w-full"
        >
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            Secret Entry 🔒
          </h2>
          <p className="text-gray-300 mb-6 text-center">
            This surprise is protected. Enter the password to continue.
          </p>
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input w-full mb-4"
              placeholder="Enter password..."
              autoFocus
            />
            <button type="submit" className="neon-button w-full">
              Unlock Surprise
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      {showConfetti && <ReactConfetti />}
      <MusicPlayer src={currentSurprise.music} autoPlay />

      <div className="container mx-auto px-4">
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

          {stage === 'puzzle' && (
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

          {stage === 'quiz' && currentSurprise.quiz.length > 0 && (
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

          {stage === 'gift' && (
            <motion.div
              key="gift"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <GiftBoxComponent
                onOpen={handleGiftOpen}
                surpriseContent="You're amazing! Here's a special surprise for you! 🎁"
              />
            </motion.div>
          )}

          {stage === 'message' && (
            <motion.div
              key="message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <MessageReveal
                message={currentSurprise.message}
                onComplete={handleMessageComplete}
              />
            </motion.div>
          )}

          {stage === 'timeline' && currentSurprise.memories?.length > 0 && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <TimelineComponent memories={currentSurprise.memories} />
              <div className="text-center mt-8">
                <button onClick={handleTimelineComplete} className="neon-button">
                  Continue →
                </button>
              </div>
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