import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState, useEffect, useRef } from 'react';
import useSurpriseStore from '../store/surpriseStore';
import toast from 'react-hot-toast';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { getUserSurprises } = useSurpriseStore();
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userSurprises, setUserSurprises] = useState([]);
  const [loadingSurprises, setLoadingSurprises] = useState(false);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  // Fetch user's surprises
  useEffect(() => {
    if (user) {
      fetchUserSurprises();
    }
  }, [user]);

  const fetchUserSurprises = async () => {
    setLoadingSurprises(true);
    try {
      const surprises = await getUserSurprises();
      setUserSurprises(surprises);
    } catch (error) {
      console.error('Error fetching surprises:', error);
    } finally {
      setLoadingSurprises(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/');
    setUserMenuOpen(false);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest('.user-menu-container')) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [userMenuOpen]);

  const testimonials = [
  {
    name: "Aarav Sharma",
    role: "Made for 5th Anniversary",
    text: "The most beautiful digital experience ever! My wife was in tears. Worth every penny!",
    rating: 5,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=boy1",
    color: "from-pink-400 to-rose-400"
  },
  {
    name: "Ananya Verma",
    role: "Birthday Surprise",
    text: "The puzzle game and countdown made it so exciting. He said it was the best gift ever!",
    rating: 5,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=girl1",
    color: "from-purple-400 to-pink-400"
  },
  {
    name: "Rohan Mehta",
    role: "Long Distance Love",
    text: "Being miles apart, this brought us closer. The video message feature is incredible.",
    rating: 5,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=boy2",
    color: "from-amber-400 to-orange-400"
  }
];

  const pricingPlans = [
    {
      name: "Sweet Start",
      price: "$9.99",
      features: ["1 Magical Surprise", "3 Fun Games", "Music Magic", "1 Week Support", "Basic Templates"],
      popular: false,
      color: "from-blue-400 to-cyan-400",
      icon: "🍭",
      bgColor: "bg-gradient-to-br from-blue-50/10 to-cyan-50/10"
    },
    {
      name: "Premium Love",
      price: "$19.99",
      features: ["5 Heartfelt Surprises", "All Games + Puzzles", "Video Messages", "1 Month Support", "Premium Templates", "Custom Domain"],
      popular: true,
      color: "from-pink-400 to-rose-400",
      icon: "💝",
      bgColor: "bg-gradient-to-br from-pink-50/10 to-rose-50/10"
    },
    {
      name: "Ultimate Magic",
      price: "$49.99",
      features: ["Unlimited Surprises", "Everything Included", "Priority Support", "Analytics Dashboard", "White Label", "Personal Assistant"],
      popular: false,
      color: "from-purple-400 to-indigo-400",
      icon: "✨",
      bgColor: "bg-gradient-to-br from-purple-50/10 to-indigo-50/10"
    }
  ];

  const floatingEmojis = ['🎀', '💝', '🎁', '✨', '⭐', '🌸', '🌺', '🦋', '💫', '🎈', '🍰', '🎂'];

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getUserName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  return (
    <div ref={containerRef} className="min-h-screen relative overflow-x-hidden">
      {/* Dreamy Gradient Background - Responsive */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 dark:from-pink-900 dark:via-purple-900 dark:to-blue-900" />

        {/* Animated blobs - Hidden on mobile for performance */}
        <div className="hidden md:block">
          <motion.div
            className="absolute top-0 -left-40 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-0 -right-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20"
            animate={{
              x: [0, -100, 0],
              y: [0, 80, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-40 left-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20"
            animate={{
              x: [0, 50, -50, 0],
              y: [0, -50, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Cute floating elements - Reduced on mobile */}
        {floatingEmojis.slice(0, window.innerWidth < 768 ? 6 : 12).map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-xl md:text-2xl pointer-events-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.random() * 50 - 25, 0],
              rotate: [0, 360],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 8,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      {/* Sparkle overlay - Reduced on mobile */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(window.innerWidth < 768 ? 20 : 50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 md:w-1 md:h-1 bg-pink-300 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Custom cursor - Hidden on mobile */}
      <div className="hidden lg:block">
        <motion.div
          className="fixed w-12 h-12 pointer-events-none z-50 flex items-center justify-center"
          style={{
            left: mousePosition.x - 24,
            top: mousePosition.y - 24,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full filter blur-xl opacity-30" />
          <span className="text-2xl relative">💕</span>
        </motion.div>
      </div>

      {/* Navbar - Responsive */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg mx-2 md:mx-4 mt-2 rounded-xl md:rounded-2xl'
          : 'bg-transparent mt-2 md:mt-6'
          }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
          <motion.div
            className="flex items-center gap-2 md:gap-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-2xl md:text-3xl"
            >
              🎀
            </motion.div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              SurpriseBox
            </h1>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 lg:gap-8 items-center">
            {['Features', 'How It Works', 'Love Stories', 'Pricing'].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                className="text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors cursor-pointer font-medium text-sm lg:text-base"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {item}
              </motion.a>
            ))}
          </div>

          {/* Desktop Auth Buttons with User Profile */}
          <div className="hidden md:flex gap-2 lg:gap-3 items-center">
            {user ? (
              <div className="relative user-menu-container">
                <motion.button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full shadow-lg hover:shadow-pink-500/25 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-sm">
                    {getUserInitials()}
                  </div>
                  <span className="text-white text-sm font-semibold hidden lg:inline">
                    {getUserName()}
                  </span>
                  <span className="text-white text-xs">▼</span>
                </motion.button>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-pink-200 dark:border-pink-500/30 overflow-hidden z-50"
                    >
                      {/* User Info Header */}
                      <div className="p-4 bg-gradient-to-r from-pink-500 to-purple-500">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-xl font-bold">
                            {getUserInitials()}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-semibold">{getUserName()}</h4>
                            <p className="text-pink-100 text-xs">{user?.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Stats Section */}
                      <div className="p-4 border-b border-pink-200 dark:border-pink-500/20">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-800 dark:text-white">
                              {userSurprises.length}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Surprises Created</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-800 dark:text-white">
                              {userSurprises.filter(s => s.status === 'active').length}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Active Surprises</div>
                          </div>
                        </div>
                      </div>

                      {/* My Surprises List */}
                      <div className="max-h-64 overflow-y-auto">
                        <div className="px-4 py-2 bg-pink-50 dark:bg-pink-900/20">
                          <h5 className="text-xs font-semibold text-gray-600 dark:text-gray-400">MY SURPRISES</h5>
                        </div>
                        {loadingSurprises ? (
                          <div className="p-4 text-center">
                            <div className="inline-block w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-xs text-gray-500 mt-2">Loading...</p>
                          </div>
                        ) : userSurprises.length > 0 ? (
                          <div className="divide-y divide-pink-100 dark:divide-pink-900/30">
                            {userSurprises.slice(0, 5).map((surprise) => (
                              <div key={surprise.id} className="p-3 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors">
                                <div className="flex justify-between items-start mb-1">
                                  <p className="text-sm font-medium text-gray-800 dark:text-white truncate flex-1">
                                    {surprise.title}
                                  </p>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${surprise.status === 'active'
                                    ? 'bg-green-100 text-green-600'
                                    : 'bg-gray-100 text-gray-500'
                                    }`}>
                                    {surprise.status || 'active'}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                  {surprise.unlockDate ? new Date(surprise.unlockDate).toLocaleDateString() : 'No date set'}
                                </p>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      navigate(`/surprise/${surprise.id}`);
                                      setUserMenuOpen(false);
                                    }}
                                    className="text-xs text-pink-500 hover:text-pink-600 font-semibold"
                                  >
                                    View
                                  </button>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(`${window.location.origin}/surprise/${surprise.id}`);
                                      toast.success('Link copied!');
                                      setUserMenuOpen(false);
                                    }}
                                    className="text-xs text-purple-500 hover:text-purple-600 font-semibold"
                                  >
                                    Share
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-6 text-center">
                            <div className="text-3xl mb-2">🎁</div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">No surprises created yet</p>
                            <button
                              onClick={() => {
                                navigate('/create');
                                setUserMenuOpen(false);
                              }}
                              className="mt-2 text-xs text-pink-500 font-semibold"
                            >
                              Create your first surprise →
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Menu Items */}
                      <div className="border-t border-pink-200 dark:border-pink-500/20">
                        <button
                          onClick={() => {
                            navigate('/create');
                            setUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors flex items-center gap-2"
                        >
                          <span>✨</span> Create New Surprise
                        </button>
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors flex items-center gap-2"
                        >
                          <span>🚪</span> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <motion.button
                  onClick={() => navigate('/login')}
                  className="px-4 lg:px-5 py-2 text-gray-700 dark:text-gray-300 hover:text-pink-500 transition-colors text-sm lg:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login
                </motion.button>
                <motion.button
                  onClick={() => navigate('/login')}
                  className="px-4 lg:px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold shadow-lg hover:shadow-pink-500/25 transition-all text-sm lg:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign Up 💕
                </motion.button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-2xl text-gray-700 dark:text-gray-300"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-pink-200 dark:border-pink-900/30"
            >
              <div className="px-4 py-4 space-y-3">
                {/* User Info for Mobile */}
                {user && (
                  <div className="pb-3 mb-2 border-b border-pink-200 dark:border-pink-900/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {getUserInitials()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">{getUserName()}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-800 dark:text-white">{userSurprises.length}</div>
                        <div className="text-xs text-gray-500">Surprises</div>
                      </div>
                      <button
                        onClick={() => {
                          navigate('/create');
                          setMobileMenuOpen(false);
                        }}
                        className="flex-1 px-3 py-1.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg text-sm"
                      >
                        New Surprise
                      </button>
                    </div>
                  </div>
                )}

                {['Features', 'How It Works', 'Love Stories', 'Pricing'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                    className="block text-gray-700 dark:text-gray-300 hover:text-pink-500 transition-colors py-2 text-base"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                <div className="pt-4 space-y-3">
                  {!user ? (
                    <>
                      <button
                        onClick={() => {
                          navigate('/login');
                          setMobileMenuOpen(false);
                        }}
                        className="w-full px-6 py-2 text-gray-700 dark:text-gray-300 border border-pink-300 dark:border-pink-500/30 rounded-full"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => {
                          navigate('/login');
                          setMobileMenuOpen(false);
                        }}
                        className="w-full px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold"
                      >
                        Sign Up 💕
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          navigate('/create');
                          setMobileMenuOpen(false);
                        }}
                        className="w-full px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold"
                      >
                        Create Surprise ✨
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="w-full px-6 py-2 text-red-600 border border-red-300 rounded-full"
                      >
                        Sign Out
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <main className="relative z-10 pt-16 md:pt-20">
        {/* Hero Section - Responsive */}
        <section className="min-h-screen flex items-center justify-center px-4">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              style={{ opacity, scale }}
              className="relative"
            >
              {/* Decorative elements - Hidden on mobile */}
              <div className="hidden md:block">
                <motion.div
                  className="absolute -top-20 -left-20 text-6xl"
                  animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  🎀
                </motion.div>
                <motion.div
                  className="absolute -bottom-20 -right-20 text-6xl"
                  animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  💝
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="mb-4 md:mb-6"
              >
                <span className="inline-flex items-center gap-1 md:gap-2 px-3 md:px-6 py-1.5 md:py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full text-pink-600 dark:text-pink-400 text-xs md:text-sm font-semibold shadow-lg">
                  <span className="text-base md:text-lg">✨</span>
                  <span className="hidden sm:inline">The Sweetest Way to Say I Love You</span>
                  <span className="sm:hidden">Sweetest Surprises</span>
                  <span className="text-base md:text-lg">✨</span>
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-4 md:mb-6"
              >
                <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Create Magical
                </span>
                <br />
                <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                  Moments of Love
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4"
              >
                Turn every occasion into a heartwarming digital adventure.
                With interactive games, personalized videos, and emotional storytelling -
                create surprises that will be cherished forever. 💕
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center px-4"
              >
                <motion.button
                  onClick={() => navigate(user ? '/create' : '/login')}
                  className="group relative px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold text-sm md:text-lg shadow-2xl hover:shadow-pink-500/50 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Creating Magic 🎁
                  </span>
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </motion.button>

                <motion.button
                  className="px-6 md:px-8 py-3 md:py-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-700 dark:text-white rounded-full font-semibold text-sm md:text-lg border border-pink-300 dark:border-pink-500/30 hover:border-pink-500 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Watch Demo 🎬
                </motion.button>
              </motion.div>

              {/* Trust Badges - Responsive */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 md:mt-16 flex flex-wrap justify-center gap-2 md:gap-6 items-center px-4"
              >
                <div className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-full text-xs md:text-sm">
                  <div className="flex text-yellow-400 text-sm md:text-base">★★★★★</div>
                  <span className="text-gray-700 dark:text-gray-300">4.9/5 (2k+ reviews)</span>
                </div>
                <div className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-full text-xs md:text-sm">
                  <span className="text-green-500 text-base md:text-lg">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">30-day guarantee</span>
                </div>
                <div className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-full text-xs md:text-sm">
                  <span className="text-blue-500 text-base md:text-lg">🔒</span>
                  <span className="text-gray-700 dark:text-gray-300">Secure & private</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section - Responsive Grid */}
        <section id="features" className="py-12 md:py-20 px-4">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-8 md:mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4">
                <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  Sweet Features
                </span>
                <br />
                <span className="text-gray-800 dark:text-white text-2xl sm:text-3xl md:text-4xl">Made with Love 💕</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
                Every feature is designed to create heartwarming moments and lasting memories
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {[
                {
                  icon: "🧩",
                  title: "Interactive Love Games",
                  description: "Cute puzzle games, romantic quizzes, and digital gift boxes",
                  color: "from-pink-400 to-rose-400",
                  stats: "15+ Sweet Games",
                  bg: "bg-pink-50 dark:bg-pink-950/20",
                  delay: 0
                },
                {
                  icon: "🎵",
                  title: "Heartfelt Media",
                  description: "Upload photos, videos, and love songs to create cinematic moments",
                  color: "from-purple-400 to-indigo-400",
                  stats: "4K Quality",
                  bg: "bg-purple-50 dark:bg-purple-950/20",
                  delay: 0.1
                },
                {
                  icon: "⏰",
                  title: "Time-Lock Magic",
                  description: "Set exact time for surprises to unlock with cute countdown",
                  color: "from-blue-400 to-cyan-400",
                  stats: "Perfect Timing",
                  bg: "bg-blue-50 dark:bg-blue-950/20",
                  delay: 0.2
                },
                {
                  icon: "📖",
                  title: "Our Story Timeline",
                  description: "Create beautiful memory timelines with scroll animations",
                  color: "from-orange-400 to-amber-400",
                  stats: "Cherished Memories",
                  bg: "bg-orange-50 dark:bg-orange-950/20",
                  delay: 0.3
                },
                {
                  icon: "🎬",
                  title: "Video Hugs",
                  description: "Record and share emotional video messages from the heart",
                  color: "from-rose-400 to-pink-400",
                  stats: "HD Quality",
                  bg: "bg-rose-50 dark:bg-rose-950/20",
                  delay: 0.4
                },
                {
                  icon: "🎉",
                  title: "Celebration Magic",
                  description: "Confetti, fireworks, and animations for grand reveals",
                  color: "from-yellow-400 to-orange-400",
                  stats: "10+ Effects",
                  bg: "bg-yellow-50 dark:bg-yellow-950/20",
                  delay: 0.5
                }
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: feature.delay }}
                  viewport={{ once: true }}
                  onHoverStart={() => setHoveredFeature(idx)}
                  onHoverEnd={() => setHoveredFeature(null)}
                  className={`${feature.bg} backdrop-blur-sm rounded-2xl p-6 md:p-8 relative overflow-hidden group cursor-pointer border border-white/50 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all`}
                  whileHover={{ y: -5 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                  <motion.div
                    animate={hoveredFeature === idx ? { rotate: [0, 10, -10, 0], scale: 1.1 } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-4xl md:text-5xl mb-3 md:mb-4"
                  >
                    {feature.icon}
                  </motion.div>

                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-2 md:mb-3">{feature.title}</h3>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-3 md:mb-4">{feature.description}</p>

                  <div className="flex justify-between items-center">
                    <span className="text-xs md:text-sm text-pink-500 dark:text-pink-400 font-semibold">{feature.stats}</span>
                    <motion.div
                      className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center text-pink-500 text-sm md:text-base"
                      animate={hoveredFeature === idx ? { x: 5 } : {}}
                    >
                      💕
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works - Responsive */}
        <section id="how-it-works" className="py-12 md:py-20 px-4">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-8 md:mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4">
                <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  Made with Love
                </span>
                <br />
                <span className="text-gray-800 dark:text-white text-2xl sm:text-3xl md:text-4xl">in 3 Simple Steps 💝</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300">Creating magic has never been this easy and sweet</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {[
                {
                  step: "01",
                  title: "Pour Your Heart",
                  description: "Add photos, videos, music, and write your heartfelt message",
                  icon: "💖",
                  gradient: "from-pink-400 to-rose-400",
                  color: "pink"
                },
                {
                  step: "02",
                  title: "Add Sweet Surprises",
                  description: "Choose games, quizzes, and set the perfect unlock time",
                  icon: "🎁",
                  gradient: "from-purple-400 to-indigo-400",
                  color: "purple"
                },
                {
                  step: "03",
                  title: "Share the Love",
                  description: "Get a magical link and watch their beautiful reaction",
                  icon: "✨",
                  gradient: "from-amber-400 to-orange-400",
                  color: "orange"
                }
              ].map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: idx * 0.2 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 md:p-8 text-center relative z-10 border border-white/50 dark:border-white/10 shadow-xl">
                    <motion.div
                      className={`w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 rounded-full bg-gradient-to-r ${step.gradient} flex items-center justify-center text-3xl md:text-4xl shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {step.icon}
                    </motion.div>

                    <div className="text-5xl md:text-7xl font-bold text-pink-200 dark:text-pink-800/30 absolute top-2 right-2 md:top-4 md:right-4">
                      {step.step}
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-2 md:mb-3">{step.title}</h3>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">{step.description}</p>

                    {idx < 2 && (
                      <div className="hidden md:block absolute -right-6 top-1/2 transform -translate-y-1/2">
                        <motion.div
                          animate={{ x: [0, 10, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="text-2xl md:text-3xl text-pink-400"
                        >
                          💕
                        </motion.div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section - Responsive */}
        {/* <section id="pricing" className="py-12 md:py-20 px-4">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-8 md:mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4">
                <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  Sweet Prices
                </span>
                <br />
                <span className="text-gray-800 dark:text-white text-2xl sm:text-3xl md:text-4xl">for Sweet Moments 💕</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300">Choose the perfect plan to make someone's day special</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
              {pricingPlans.map((plan, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className={`relative ${plan.popular ? 'md:transform md:scale-105' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                      <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 md:px-4 py-1 rounded-full text-xs md:text-sm font-semibold shadow-lg flex items-center gap-1 whitespace-nowrap">
                        <span>⭐</span> Most Loved <span>⭐</span>
                      </span>
                    </div>
                  )}

                  <div className={`${plan.bgColor} backdrop-blur-sm rounded-2xl p-6 md:p-8 h-full border-2 ${plan.popular ? 'border-pink-400 dark:border-pink-500' : 'border-white/50 dark:border-white/10'} shadow-xl relative overflow-hidden`}>
                    <div className="text-3xl md:text-5xl mb-3 md:mb-4">{plan.icon}</div>

                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-2">{plan.name}</h3>
                    <div className="mb-4 md:mb-6">
                      <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">{plan.price}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">/month</span>
                    </div>

                    <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                      {plan.features.map((feature, fIdx) => (
                        <motion.li
                          key={fIdx}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: fIdx * 0.05 }}
                          className="flex items-center gap-2 text-sm md:text-base text-gray-700 dark:text-gray-300"
                        >
                          <span className="text-pink-400 text-base md:text-lg">💕</span>
                          <span className="flex-1">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>

                    <motion.button
                      onClick={() => navigate(user ? '/create' : '/login')}
                      className={`w-full py-2.5 md:py-3 rounded-full font-semibold transition-all text-sm md:text-base ${plan.popular
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg hover:shadow-pink-500/25'
                        : 'bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-white border border-pink-300 dark:border-pink-500/30 hover:border-pink-500'
                        }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Choose Plan 💝
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section> */}

        {/* Love Stories Section - Responsive */}
        <section id="love-stories" className="py-12 md:py-20 px-4">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-8 md:mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4">
                <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  Love Stories
                </span>
                <br />
                <span className="text-gray-800 dark:text-white text-2xl sm:text-3xl md:text-4xl">from Our Community 💕</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300">Real moments created with love</p>
            </motion.div>

            <div className="max-w-4xl mx-auto px-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/50 dark:border-white/10 shadow-xl"
                >
                  <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center">
                    <div className="relative">
                      <img
                        src={testimonials[activeTestimonial].image}
                        alt={testimonials[activeTestimonial].name}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-pink-400 shadow-lg"
                      />
                      <div className="absolute -bottom-1 -right-1 text-xl md:text-2xl">💕</div>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <div className="flex justify-center md:justify-start mb-2">
                        {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-base md:text-xl">★</span>
                        ))}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm md:text-lg italic mb-3 md:mb-4">
                        "{testimonials[activeTestimonial].text}"
                      </p>
                      <h4 className="text-gray-800 dark:text-white font-bold text-base md:text-lg">
                        {testimonials[activeTestimonial].name}
                      </h4>
                      <p className="text-pink-500 dark:text-pink-400 text-xs md:text-sm">
                        {testimonials[activeTestimonial].role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-center gap-2 mt-4 md:mt-6">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestimonial(idx)}
                    className={`transition-all ${idx === activeTestimonial
                      ? 'w-6 md:w-8 h-1.5 md:h-2 bg-pink-500 rounded-full'
                      : 'w-1.5 md:w-2 h-1.5 md:h-2 bg-pink-300 dark:bg-pink-700 rounded-full'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Responsive */}
        <section className="py-12 md:py-20 px-4">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-2xl md:rounded-3xl p-8 md:p-12 text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 opacity-90" />
              <div
                className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"
              />
              <div className="hidden md:block">
                <motion.div
                  className="absolute top-5 left-5 text-3xl"
                  animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  💕
                </motion.div>
                <motion.div
                  className="absolute bottom-5 right-5 text-3xl"
                  animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  💝
                </motion.div>
              </div>

              <div className="relative z-10">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-5xl md:text-7xl mb-3 md:mb-4"
                >
                  🎀
                </motion.div>

                <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-3 md:mb-4">
                  Ready to Create Magic?
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-pink-100 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
                  Join thousands of happy hearts who've created unforgettable moments of love
                </p>

                <motion.button
                  onClick={() => navigate(user ? '/create' : '/login')}
                  className="px-6 md:px-8 py-3 md:py-4 bg-white text-pink-600 rounded-full font-bold text-base md:text-lg shadow-2xl hover:shadow-xl transition-all inline-flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Your Love Story 💕
                </motion.button>

                <p className="text-xs md:text-sm text-pink-100 mt-4">
                  No credit card required • Cancel anytime • Made with 💕
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer - Responsive */}
        <footer className="py-8 md:py-12 px-4 border-t border-pink-200 dark:border-pink-900/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-3 md:mb-4">
                  <div className="text-2xl md:text-3xl animate-bounce">🎀</div>
                  <h3 className="text-lg md:text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    SurpriseBox
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">
                  Creating magical moments with love since 2024
                </p>
                <div className="flex justify-center sm:justify-start gap-2 md:gap-3 mt-3 md:mt-4">
                  <span className="text-xl md:text-2xl">💕</span>
                  <span className="text-xl md:text-2xl">💝</span>
                  <span className="text-xl md:text-2xl">✨</span>
                </div>
              </div>

              <div className="text-center sm:text-left">
                <h4 className="text-gray-800 dark:text-white font-semibold mb-2 md:mb-3 text-sm md:text-base">Explore</h4>
                <ul className="space-y-1.5 md:space-y-2 text-gray-600 dark:text-gray-400 text-xs md:text-sm">
                  <li><a href="#features" className="hover:text-pink-500 transition-colors">Features</a></li>
                  <li><a href="#how-it-works" className="hover:text-pink-500 transition-colors">How It Works</a></li>
                  <li><a href="#pricing" className="hover:text-pink-500 transition-colors">Pricing</a></li>
                  <li><a href="#love-stories" className="hover:text-pink-500 transition-colors">Love Stories</a></li>
                </ul>
              </div>

              <div className="text-center sm:text-left">
                <h4 className="text-gray-800 dark:text-white font-semibold mb-2 md:mb-3 text-sm md:text-base">Company</h4>
                <ul className="space-y-1.5 md:space-y-2 text-gray-600 dark:text-gray-400 text-xs md:text-sm">
                  <li><a href="# " className="hover:text-pink-500 transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-pink-500 transition-colors">Love Blog</a></li>
                  <li><a href="#" className="hover:text-pink-500 transition-colors">Contact</a></li>
                  <li><a href="#" className="hover:text-pink-500 transition-colors">Careers</a></li>
                </ul>
              </div>

              <div className="text-center sm:text-left">
                <h4 className="text-gray-800 dark:text-white font-semibold mb-2 md:mb-3 text-sm md:text-base">Legal</h4>
                <ul className="space-y-1.5 md:space-y-2 text-gray-600 dark:text-gray-400 text-xs md:text-sm">
                  <li><a href="#" className="hover:text-pink-500 transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-pink-500 transition-colors">Terms of Love</a></li>
                  <li><a href="#" className="hover:text-pink-500 transition-colors">Refund Policy</a></li>
                </ul>
              </div>
            </div>

            <div className="text-center text-gray-500 dark:text-gray-400 text-xs md:text-sm pt-6 md:pt-8 border-t border-pink-200 dark:border-pink-900/30">
              <p>Made with <span className="text-pink-500">💕</span> for creating beautiful moments</p>
              <p className="mt-1 md:mt-2">© 2024 SurpriseBox. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;