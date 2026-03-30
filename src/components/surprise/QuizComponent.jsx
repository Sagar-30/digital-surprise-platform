import { useState } from 'react';
import { motion } from 'framer-motion';

const QuizComponent = ({ questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  
  const handleAnswer = (selectedOption) => {
    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);
    
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Check if all answers are correct
      const allCorrect = newAnswers.every(
        (answer, idx) => answer === questions[idx].correct
      );
      setShowResult(true);
      if (allCorrect) {
        onComplete();
      }
    }
  };
  
  if (showResult) {
    const isCorrect = answers.every(
      (answer, idx) => answer === questions[idx].correct
    );
    
    return (
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {isCorrect ? (
          <div>
            <h3 className="text-2xl font-bold text-green-400 mb-4">
              🎉 Congratulations! 🎉
            </h3>
            <p className="text-white">You know me so well!</p>
          </div>
        ) : (
          <div>
            <h3 className="text-2xl font-bold text-red-400 mb-4">
              😢 Not quite right...
            </h3>
            <button
              onClick={() => {
                setCurrentQuestion(0);
                setAnswers([]);
                setShowResult(false);
              }}
              className="neon-button"
            >
              Try Again
            </button>
          </div>
        )}
      </motion.div>
    );
  }
  
  const question = questions[currentQuestion];
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="text-white mb-2">
          Question {currentQuestion + 1} of {questions.length}
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-purple-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>
      
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="glass-card p-8"
      >
        <h3 className="text-2xl font-bold text-white mb-6">
          {question.text}
        </h3>
        
        <div className="space-y-4">
          {question.options.map((option, idx) => (
            <motion.button
              key={idx}
              onClick={() => handleAnswer(option)}
              className="w-full text-left glass-input hover:bg-white/20 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {option}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default QuizComponent;