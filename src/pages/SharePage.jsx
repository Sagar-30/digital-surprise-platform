import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const SharePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [surpriseId, setSurpriseId] = useState(null);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    // Get the surprise ID from URL params or location state
    const params = new URLSearchParams(location.search);
    const id = params.get('id') || location.state?.surpriseId;
    if (id) {
      setSurpriseId(id);
    } else {
      // If no ID, redirect to home
      navigate('/');
    }
  }, [location, navigate]);
  
  const shareLink = `${window.location.origin}/surprise/${surpriseId}`;
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast.success('Link copied to clipboard! 📋');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };
  
  const shareViaWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`🎁 I created a special surprise for you! Click here to open it: ${shareLink}`)}`, '_blank');
  };
  
  const shareViaEmail = () => {
    window.location.href = `mailto:?subject=Special Surprise For You!&body=🎁 I created a special surprise for you! Click here to open it: ${shareLink}`;
  };
  
  const shareViaFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`, '_blank');
  };
  
  const shareViaTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('🎁 I created a special surprise for you!')}&url=${encodeURIComponent(shareLink)}`, '_blank');
  };
  
  const viewSurprise = () => {
    navigate(`/surprise/${surpriseId}`);
  };
  
  const createAnother = () => {
    navigate('/create');
  };
  
  return (
    <div className="min-h-screen py-8 md:py-12 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 dark:from-pink-900 dark:via-purple-900 dark:to-blue-900" />
        
        {/* Floating hearts */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-xl md:text-2xl pointer-events-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: Math.random() * 8 + 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            💕
          </motion.div>
        ))}
      </div>
      
      <div className="container mx-auto max-w-2xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 md:p-10 border border-white/50 dark:border-white/10 shadow-2xl"
        >
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="text-center mb-6"
          >
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl"
              >
                ✓
              </motion.div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
              Surprise Created Successfully! 🎉
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Your magical surprise is ready to be shared
            </p>
          </motion.div>
          
          {/* Share Link Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">
              Share this link with your loved one:
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 px-4 py-3 bg-white/50 dark:bg-gray-900/50 border border-pink-300 dark:border-pink-500/30 rounded-xl focus:outline-none text-gray-800 dark:text-white text-sm"
              />
              <button
                onClick={copyToClipboard}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-pink-500/25 transition-all whitespace-nowrap"
              >
                {copied ? 'Copied! ✓' : 'Copy Link 📋'}
              </button>
            </div>
          </motion.div>
          
          {/* Share Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <label className="block text-gray-700 dark:text-gray-300 mb-3 font-semibold">
              Or share directly via:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={shareViaWhatsApp}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all"
              >
                <span className="text-xl">💚</span>
                <span className="text-sm">WhatsApp</span>
              </button>
              <button
                onClick={shareViaEmail}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all"
              >
                <span className="text-xl">📧</span>
                <span className="text-sm">Email</span>
              </button>
              <button
                onClick={shareViaFacebook}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl transition-all"
              >
                <span className="text-xl">📘</span>
                <span className="text-sm">Facebook</span>
              </button>
              <button
                onClick={shareViaTwitter}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl transition-all"
              >
                <span className="text-xl">🐦</span>
                <span className="text-sm">Twitter</span>
              </button>
            </div>
          </motion.div>
          
          {/* QR Code Section (Optional) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6 p-4 bg-white/30 dark:bg-gray-900/30 rounded-xl text-center"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Or scan this QR code to open on mobile
            </p>
            <div className="inline-block p-2 bg-white rounded-lg">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shareLink)}`}
                alt="QR Code"
                className="w-32 h-32 mx-auto"
              />
            </div>
          </motion.div>
          
          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <button
              onClick={viewSurprise}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-pink-500/25 transition-all"
            >
              View Surprise 🎁
            </button>
            <button
              onClick={createAnother}
              className="flex-1 px-6 py-3 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm text-gray-700 dark:text-white rounded-xl font-semibold border border-pink-300 dark:border-pink-500/30 hover:bg-white/60 transition-all"
            >
              Create Another ✨
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SharePage;