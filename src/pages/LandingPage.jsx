import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const floatingElements = Array(20).fill(null);
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating background elements */}
      {floatingElements.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-purple-500 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: Math.random() * 5 + 3,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
      
      <div className="relative z-10">
        <nav className="glass-card m-4 px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            SurpriseBox
          </h1>
          <div className="flex gap-4">
            {user ? (
              <button
                onClick={() => navigate('/create')}
                className="neon-button text-sm"
              >
                Create Surprise
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="neon-button text-sm"
              >
                Get Started
              </button>
            )}
          </div>
        </nav>
        
        <main className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              Create Magical Moments
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Turn any occasion into an unforgettable digital surprise experience.
              From birthday celebrations to anniversary memories, make them feel special.
            </p>
            
            <motion.button
              onClick={() => navigate('/create')}
              className="neon-button text-lg px-8 py-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Creating Your Surprise
            </motion.button>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            {[
              {
                icon: "🎁",
                title: "Personalized Experiences",
                description: "Create unique surprises with photos, videos, music, and interactive games"
              },
              {
                icon: "🔒",
                title: "Time-Locked Surprises",
                description: "Set a specific time for your surprise to unlock automatically"
              },
              {
                icon: "✨",
                title: "Shareable Moments",
                description: "Generate a unique link to share your surprise with anyone, anywhere"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                className="glass-card p-6 text-center hover:shadow-xl transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LandingPage;