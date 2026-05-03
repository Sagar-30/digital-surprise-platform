import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QuizComponent = ({ questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]); // Store selected indices instead of values
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isPerfect, setIsPerfect] = useState(false);
  const [score, setScore] = useState(0);
  
  // Calculate score whenever answers change
  useEffect(() => {
    if (answers.length > 0) {
      const correctCount = answers.filter((answerIdx, idx) => answerIdx === questions[idx]?.correct).length;
      setScore(correctCount);
    }
  }, [answers, questions]);
  
  const handleAnswer = (selectedOptionValue, selectedIndex) => {
    setSelectedOption(selectedOptionValue);
    setSelectedIndex(selectedIndex);
    const isAnswerCorrect = selectedIndex === questions[currentQuestion].correct;
    
    // Add visual feedback
    setTimeout(() => {
      const newAnswers = [...answers, selectedIndex]; // Store index instead of value
      setAnswers(newAnswers);
      setSelectedOption(null);
      setSelectedIndex(null);
      
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Calculate final score
        const finalScore = newAnswers.filter((answerIdx, idx) => answerIdx === questions[idx]?.correct).length;
        const allCorrect = finalScore === questions.length;
        setIsPerfect(allCorrect);
        setScore(finalScore);
        setShowResult(true);
        
        // Only auto-complete if all answers are correct
        if (allCorrect) {
          setTimeout(() => {
            onComplete();
          }, 2000);
        }else{
          setTimeout(() => {
            onComplete();
          }, 3000);
        }
      }
    }, 500);
  };
  
  const handleTryAgain = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setSelectedOption(null);
    setSelectedIndex(null);
    setScore(0);
    setIsPerfect(false);
  };
  
  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    const allCorrect = score === questions.length;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-[60vh] flex items-center justify-center p-4"
      >
        <div className="text-center max-w-md mx-auto">
          {allCorrect ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl p-8 border border-white/50 dark:border-white/10 shadow-2xl"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 0.8 }}
                className="text-7xl mb-4"
              >
                🎉
              </motion.div>
              <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-3">
                Perfect Score!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                You got all {questions.length} questions correct!
              </p>
              <div className="flex justify-center gap-2 mb-6">
                {[...Array(5)].map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="text-2xl"
                  >
                    ⭐
                  </motion.span>
                ))}
              </div>
              <p className="text-pink-500 dark:text-pink-400 font-semibold">
                You know me so well! 💕
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl p-8 border border-white/50 dark:border-white/10 shadow-2xl"
            >
              <div className="text-7xl mb-4">📝</div>
              <h3 className="text-2xl md:text-3xl font-bold text-orange-500 mb-3">
                Quiz Completed!
              </h3>
              
              {/* Score Display */}
              <div className="mb-6">
                <div className="text-5xl font-bold text-gray-800 dark:text-white mb-2">
                  {score}/{questions.length}
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  You got {score} out of {questions.length} questions correct
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  ({percentage}% accuracy)
                </p>
              </div>
              
              {/* Show which questions were wrong */}
              <div className="mt-4 mb-6 text-left">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Review your answers:
                </p>
                <div className="space-y-2">
                  {questions.map((q, idx) => {
                    const isAnswerCorrect = answers[idx] === q.correct;
                    return (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <span className={isAnswerCorrect ? "text-green-500" : "text-red-500"}>
                          {isAnswerCorrect ? "✓" : "✗"}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400 flex-1">
                          {q.text}
                        </span>
                        {!isAnswerCorrect && (
                          <span className="text-xs text-pink-500">
                            Correct: {q.options[q.correct]}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-6 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-500 to-pink-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              
              {/* Result Message */}
              <div className="mt-4 p-4 bg-pink-50/50 dark:bg-pink-900/20 rounded-xl">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {score >= questions.length * 0.7 ? (
                    "🎯 Great job! You know me very well!"
                  ) : score >= questions.length * 0.5 ? (
                    "🙂 Not bad! Want to learn more about me?"
                  ) : (
                    "💕 It's okay! Every moment together is a chance to learn more about each other!"
                  )}
                </p>
              </div>
              
              {/* Note that quiz doesn't auto-complete */}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                Take your time to review and learn more about each other! 💝
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  }
  
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full mx-auto">
        {/* Header with progress */}
        <div className="mb-6 md:mb-8">
          <div className="flex justify-between items-center mb-3">
            <div className="text-sm md:text-base text-gray-600 dark:text-gray-300">
              Question {currentQuestion + 1} of {questions.length}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-600 dark:text-gray-300">Score:</span>
              <span className="text-sm font-bold text-pink-500">{score}/{currentQuestion}</span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="relative">
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            {/* Floating hearts on progress */}
            <motion.div
              className="absolute -top-2 text-sm"
              style={{ left: `${progress}%` }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              💕
            </motion.div>
          </div>
        </div>
        
        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/50 dark:border-white/10 shadow-2xl"
          >
            {/* Question number badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-100 dark:bg-pink-900/30 rounded-full mb-4">
              <span className="text-pink-500 text-sm">📝</span>
              <span className="text-pink-600 dark:text-pink-400 text-sm font-semibold">
                Question {currentQuestion + 1}
              </span>
            </div>
            
            {/* Question text */}
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-6 leading-relaxed">
              {question.text}
            </h3>
            
            {/* Options */}
            <div className="space-y-3 md:space-y-4">
              {question.options.map((option, idx) => {
                const isSelected = selectedIndex === idx;
                const isCorrectAnswer = idx === question.correct;
                
                return (
                  <motion.button
                    key={idx}
                    onClick={() => !selectedOption && handleAnswer(option, idx)}
                    disabled={selectedOption !== null}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      selectedOption === null
                        ? 'bg-white/50 dark:bg-gray-900/50 border border-pink-300 dark:border-pink-500/30 hover:border-pink-500 hover:shadow-lg'
                        : isSelected
                          ? isCorrectAnswer
                            ? 'bg-green-500/20 border-2 border-green-500 shadow-lg'
                            : 'bg-red-500/20 border-2 border-red-500 shadow-lg'
                          : isCorrectAnswer && selectedOption !== null
                            ? 'bg-green-500/20 border-2 border-green-500'
                            : 'bg-white/30 dark:bg-gray-800/30 border border-white/20 opacity-50'
                    }`}
                    whileHover={selectedOption === null ? { scale: 1.02 } : {}}
                    whileTap={selectedOption === null ? { scale: 0.98 } : {}}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        selectedOption === null
                          ? 'bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400'
                          : isSelected
                            ? isCorrectAnswer
                              ? 'bg-green-500 text-white'
                              : 'bg-red-500 text-white'
                            : isCorrectAnswer && selectedOption !== null
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-300 dark:bg-gray-600 text-gray-500'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className={`flex-1 text-sm md:text-base ${
                        selectedOption !== null && isCorrectAnswer
                          ? 'text-green-700 dark:text-green-300 font-semibold'
                          : selectedOption === option && !isCorrectAnswer
                            ? 'text-red-700 dark:text-red-300'
                            : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {option}
                      </span>
                      {selectedOption !== null && isCorrectAnswer && (
                        <span className="text-green-500 text-xl">✓</span>
                      )}
                      {selectedOption === option && !isCorrectAnswer && (
                        <span className="text-red-500 text-xl">✗</span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
            
            {/* Progress indicator dots */}
            <div className="flex justify-center gap-2 mt-6 pt-4 border-t border-pink-200 dark:border-pink-800/30">
              {questions.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentQuestion
                      ? 'w-6 bg-pink-500'
                      : idx < currentQuestion
                        ? (answers[idx] === questions[idx]?.correct ? 'w-1.5 bg-green-500' : 'w-1.5 bg-red-500')
                        : 'w-1.5 bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Hint or motivational message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mt-6"
        >
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
            {currentQuestion === 0 && "💡 Take your time, there's no rush!"}
            {currentQuestion === Math.floor(questions.length / 2) && "🎯 You're doing great! Keep going!"}
            {currentQuestion === questions.length - 1 && "🌟 Last question! You got this!"}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default QuizComponent;