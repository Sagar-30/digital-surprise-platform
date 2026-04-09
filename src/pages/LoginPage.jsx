import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const navigate = useNavigate();
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, sendPasswordReset } = useAuth();

  // Load saved email if remember me was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    
    if (!resetMode && !isLogin && password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (!resetMode && !isLogin && !agreeTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }
    
    setLoading(true);
    
    try {
      if (resetMode) {
        await sendPasswordReset(resetEmail);
        toast.success('Password reset email sent! Check your inbox.');
        setResetMode(false);
        setResetEmail('');
      } else if (isLogin) {
        await signInWithEmail(email, password);
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        toast.success('Welcome back! 🎉');
        navigate('/');
      } else {
        await signUpWithEmail(email, password, name);
        toast.success('Account created successfully! 🎉');
        navigate('/');
      }
    } catch (error) {
      let message = 'Authentication failed';
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'Email already in use';
          break;
        case 'auth/invalid-email':
          message = 'Invalid email address';
          break;
        case 'auth/weak-password':
          message = 'Password should be at least 6 characters';
          break;
        case 'auth/user-not-found':
          message = 'User not found';
          break;
        case 'auth/wrong-password':
          message = 'Wrong password';
          break;
        default:
          message = error.message;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Signed in successfully! 🎉');
      navigate('/');
    } catch (error) {
      toast.error('Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const floatingHearts = ['💕', '💝', '💖', '💗', '💓', '💞', '💘', '❤️', '🧡', '💛', '💚', '💙'];

  if (resetMode) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 dark:from-pink-900 dark:via-purple-900 dark:to-blue-900" />
        
        {/* Floating Hearts */}
        <div className="absolute inset-0 overflow-hidden">
          {floatingHearts.map((heart, i) => (
            <motion.div
              key={i}
              className="absolute text-xl md:text-2xl pointer-events-none"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 50 - 25, 0],
                opacity: [0, 0.5, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: Math.random() * 5 + 3,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            >
              {heart}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/50 dark:border-white/10 shadow-2xl">
            <div className="text-center mb-6 md:mb-8">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-5xl md:text-6xl mb-3 md:mb-4"
              >
                🔐
              </motion.div>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
                Reset Password
              </h2>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                Enter your email to receive reset link
              </p>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-gray-900/50 border border-pink-300 dark:border-pink-500/30 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all text-gray-800 dark:text-white placeholder-gray-500"
                  placeholder="Email address"
                  required
                  autoFocus
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-pink-500/25 transition-all disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Sending...' : 'Send Reset Email'}
              </motion.button>

              <button
                type="button"
                onClick={() => setResetMode(false)}
                className="w-full text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors text-sm md:text-base"
              >
                ← Back to Login
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 dark:from-pink-900 dark:via-purple-900 dark:to-blue-900" />
        
        {/* Animated blobs */}
        <div className="hidden md:block">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20"
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Floating Hearts and Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingHearts.slice(0, window.innerWidth < 768 ? 8 : 12).map((heart, i) => (
          <motion.div
            key={i}
            className="absolute text-base md:text-xl pointer-events-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -80, 0],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0, 0.6, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            {heart}
          </motion.div>
        ))}
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/50 dark:border-white/10 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-6xl md:text-7xl mb-3 md:mb-4"
            >
              {isLogin ? '💕' : '🎁'}
            </motion.div>
            
            <motion.h2 
              className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
            >
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </motion.h2>
            
            <motion.p 
              className="text-sm md:text-base text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {isLogin 
                ? 'Sign in to continue your magical journey' 
                : 'Join us and start creating beautiful surprises'}
            </motion.p>
          </div>

          {/* Auth Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleEmailAuth}
              className="space-y-4"
            >
              {!isLogin && (
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-gray-900/50 border border-pink-300 dark:border-pink-500/30 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all text-gray-800 dark:text-white placeholder-gray-500"
                    placeholder="Full name"
                    required
                  />
                </div>
              )}
              
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-gray-900/50 border border-pink-300 dark:border-pink-500/30 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all text-gray-800 dark:text-white placeholder-gray-500"
                  placeholder="Email address"
                  required
                />
              </div>
              
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-gray-900/50 border border-pink-300 dark:border-pink-500/30 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all text-gray-800 dark:text-white placeholder-gray-500 pr-12"
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-pink-500 transition-colors"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              
              {!isLogin && (
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-gray-900/50 border border-pink-300 dark:border-pink-500/30 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all text-gray-800 dark:text-white placeholder-gray-500"
                    placeholder="Confirm password"
                    required
                  />
                </div>
              )}

              {isLogin && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-pink-300 text-pink-500 focus:ring-pink-500"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Remember me</span>
                  </label>
                  
                  <button
                    type="button"
                    onClick={() => setResetMode(true)}
                    className="text-sm text-pink-500 hover:text-pink-600 dark:text-pink-400 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {!isLogin && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded border-pink-300 text-pink-500 focus:ring-pink-500"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    I agree to the{' '}
                    <a href="#" className="text-pink-500 hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-pink-500 hover:underline">Privacy Policy</a>
                  </span>
                </label>
              )}
              
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-pink-500/25 transition-all disabled:opacity-50 relative overflow-hidden group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">
                  {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                </span>
                {!loading && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: '200%' }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </motion.button>
            </motion.form>
          </AnimatePresence>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-pink-200 dark:border-pink-800/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-transparent text-gray-500 dark:text-gray-400">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In */}
          <motion.button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm px-4 py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-white/60 dark:hover:bg-gray-900/60 transition-all group border border-pink-300 dark:border-pink-500/30"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-gray-700 dark:text-white font-medium">Continue with Google</span>
          </motion.button>

          {/* Toggle between Login and Signup */}
          <div className="mt-6 text-center">
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                  setName('');
                  setAgreeTerms(false);
                }}
                className="text-pink-500 hover:text-pink-600 dark:text-pink-400 font-semibold transition-colors"
              >
                {isLogin ? 'Sign Up Free 💕' : 'Sign In'}
              </button>
            </p>
          </div>

          {/* Features List */}
          <motion.div 
            className="mt-6 md:mt-8 pt-6 border-t border-pink-200 dark:border-pink-800/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="grid grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm">
              <div className="flex items-center gap-1 md:gap-2 text-gray-600 dark:text-gray-300">
                <span className="text-pink-400 text-base md:text-lg">✨</span>
                <span>Create surprises</span>
              </div>
              <div className="flex items-center gap-1 md:gap-2 text-gray-600 dark:text-gray-300">
                <span className="text-pink-400 text-base md:text-lg">🎁</span>
                <span>Share moments</span>
              </div>
              <div className="flex items-center gap-1 md:gap-2 text-gray-600 dark:text-gray-300">
                <span className="text-pink-400 text-base md:text-lg">🔒</span>
                <span>Private & secure</span>
              </div>
              {/* <div className="flex items-center gap-1 md:gap-2 text-gray-600 dark:text-gray-300">
                <span className="text-pink-400 text-base md:text-lg">🚀</span>
                <span>Free to use</span>
              </div> */}
            </div>
          </motion.div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-gray-500 dark:text-gray-400 hover:text-pink-500 transition-colors text-xs md:text-sm flex items-center justify-center gap-1 mx-auto"
            >
              <span>←</span> Back to Home
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;