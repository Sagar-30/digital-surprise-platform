import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import useSurpriseStore from '../store/surpriseStore.jsx';

const CreateSurprisePageNew = () => {
  const navigate = useNavigate();
  const { createSurprise, uploadFile } = useSurpriseStore();
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [showPreview, setShowPreview] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('cute');
  const [activeModal, setActiveModal] = useState(null);
  const [tempBondSelection, setTempBondSelection] = useState([]);
  const [letterText, setLetterText] = useState('');
  const [isLetterSaved, setIsLetterSaved] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    occasion: 'birthday',
    unlockDate: '',
    unlockTime: '',
    cake: 'Strawberry Princess',
    bond: ['Sweet', 'Loyal', 'My rock'],
    vibe: 'Sweet & Warm',
    friend: 'Kitty',
    images: [],
    music: null,
    video: null,
  });
  const [uploading, setUploading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);

  // Cake options with images
  const cakeOptions = [
    { value: 'Chocolate Fantasy', emoji: '🍫', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=80&h=80&fit=crop', label: 'Chocolate Fantasy', desc: 'Rich chocolate layers with ganache' },
    { value: 'Princess Double Storey', emoji: '👑', image: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=80&h=80&fit=crop', label: 'Princess Double Storey', desc: 'Elegant two-tier princess cake' },
    { value: 'Galaxy Classic', emoji: '🌌', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=80&h=80&fit=crop', label: 'Galaxy Classic', desc: 'Magical galaxy themed design' },
    { value: 'Strawberry Princess', emoji: '🍓', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=80&h=80&fit=crop', label: 'Strawberry Princess', desc: 'Fresh strawberry cream delight' }
  ];

  // Bond options
  const bondOptions = [
    { value: 'Sweet', emoji: '💗', label: 'Sweet', desc: 'Always caring and kind' },
    { value: 'Loyal', emoji: '🤝', label: 'Loyal', desc: 'Stands by your side always' },
    { value: 'My rock', emoji: '🪨', label: 'My rock', desc: 'Strong and dependable' },
    { value: 'Bestie', emoji: '⭐', label: 'Bestie', desc: 'Partner in crime' },
    { value: 'Always there', emoji: '🤍', label: 'Always there', desc: 'Never let you down' },
    { value: 'Kind heart', emoji: '😊', label: 'Kind heart', desc: 'Pure and gentle soul' }
  ];

  // Vibe options
  const vibeOptions = [
    { value: 'Sweet & Warm', emoji: '🎀', label: 'Sweet & Warm', color: 'from-pink-400 to-rose-400', desc: 'Cozy and heartwarming' },
    { value: 'Fun & Playful', emoji: '😂', label: 'Fun & Playful', color: 'from-yellow-400 to-orange-400', desc: 'Energetic and joyful' },
    { value: 'Deep Love', emoji: '🔥', label: 'Deep Love', color: 'from-red-400 to-pink-500', desc: 'Passionate and romantic' }
  ];

  // Friend options
  const friendOptions = [
    { value: 'Bunny', emoji: '🐰', image: 'https://cdn-icons-png.flaticon.com/512/616/616408.png', label: 'Bunny', desc: 'Soft and cuddly companion' },
    { value: 'Kitty', emoji: '🐱', image: 'https://cdn-icons-png.flaticon.com/512/616/616430.png', label: 'Kitty', desc: 'Playful and curious friend' },
    { value: 'Teddy', emoji: '🧸', image: 'https://cdn-icons-png.flaticon.com/512/616/616478.png', label: 'Teddy', desc: 'Classic bear hugger' }
  ];

  // Generate preview URLs for images
  useEffect(() => {
    const urls = formData.images.map(file => URL.createObjectURL(file));
    setPreviewImages(urls);
    return () => urls.forEach(url => URL.revokeObjectURL(url));
  }, [formData.images]);

  const onDrop = useCallback((acceptedFiles) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...acceptedFiles]
    }));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif'] },
    maxFiles: 5
  });

  const openModal = useCallback((modalName) => {
    if (modalName === 'bond') {
      setTempBondSelection([...formData.bond]);
    }
    if (modalName === 'letter') {
      setIsLetterSaved(false);
    }
    setActiveModal(modalName);
  }, [formData.bond]);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setTempBondSelection([]);
  }, []);

  const saveBondSelection = useCallback(() => {
    setFormData(prev => ({ ...prev, bond: tempBondSelection }));
    closeModal();
  }, [tempBondSelection, closeModal]);

  const handleBondToggle = useCallback((bondValue) => {
    setTempBondSelection(prev => {
      if (prev.includes(bondValue)) {
        return prev.filter(b => b !== bondValue);
      } else {
        if (prev.length < 3) {
          return [...prev, bondValue];
        }
        toast.error('You can only select up to 3 bonds');
        return prev;
      }
    });
  }, []);

  const saveLetter = useCallback(() => {
    setIsLetterSaved(true);
    closeModal();
  }, [closeModal]);

  const handleSubmit = async () => {
    if (!formData.name || !formData.unlockDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    setUploading(true);
    try {
      const imageUrls = [];
      for (const image of formData.images) {
        const url = await uploadFile(image, `surprises/${Date.now()}_${image.name}`);
        imageUrls.push(url);
      }

      let musicUrl = null;
      if (formData.music) {
        musicUrl = await uploadFile(formData.music, `music/${Date.now()}_${formData.music.name}`);
      }

      let videoUrl = null;
      if (formData.video) {
        videoUrl = await uploadFile(formData.video, `videos/${Date.now()}_${formData.video.name}`);
      }

      const defaultLetter = `Dear ${formData.name || 'Friend'},

Happy Birthday! 🎂

You mean the world to me. Every moment with you is special, and I wanted to create something unique just for you.

This surprise is made with lots of love and care. I hope it brings a smile to your face!

With all my love,
❤️`;

      const surpriseData = {
        ...formData,
        letter: letterText || defaultLetter,
        images: imageUrls,
        music: musicUrl,
        video: videoUrl,
        unlockDate: `${formData.unlockDate}T${formData.unlockTime || '00:00'}`,
        status: 'active',
        createdAt: new Date().toISOString()
      };

      const id = await createSurprise(surpriseData);
      toast.success('Surprise created successfully! 🎉');
      navigate(`/payment/${id}?plan=${selectedPlan}&style=${selectedStyle}`);
    } catch (error) {
      toast.error('Failed to create surprise');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  // Star Field Component
  const StarField = useMemo(() => () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-blue-950 to-indigo-950" />
      {[...Array(100)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 h-0.5 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, Math.random() * 0.8 + 0.2, 0],
          }}
          transition={{
            duration: Math.random() * 6 + 4,
            repeat: Infinity,
            delay: Math.random() * 10,
          }}
        />
      ))}
      <motion.div
        className="absolute top-10 right-10 w-16 h-16 bg-yellow-100 rounded-full shadow-2xl"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <div className="absolute top-10 right-10 w-16 h-16 bg-gray-950 rounded-full transform translate-x-3 -translate-y-2" />
    </div>
  ), []);

  // Cake Selection Modal
  const CakeModal = () => (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/90 backdrop-blur-md"
      onClick={closeModal}
    >
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-md bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 rounded-2xl overflow-hidden max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-white/20 flex justify-between items-center sticky top-0 bg-gray-900/95">
          <h3 className="text-white font-semibold text-lg font-poppins">Choose a cake 🍰</h3>
          <button onClick={closeModal} className="text-white text-2xl">✕</button>
        </div>
        <div className="p-4 overflow-y-auto space-y-3">
          {cakeOptions.map((cake) => (
            <button
              key={cake.value}
              onClick={() => {
                setFormData(prev => ({ ...prev, cake: cake.value }));
                closeModal();
              }}
              className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${formData.cake === cake.value ? 'bg-pink-500/30 border-2 border-pink-500' : 'bg-white/10 hover:bg-white/20'}`}
            >
              <img src={cake.image} alt={cake.label} className="w-14 h-14 rounded-lg object-cover" />
              <div className="flex-1 text-left">
                <div className="flex items-center gap-1">
                  <span className="text-xl">{cake.emoji}</span>
                  <span className="text-white font-medium font-poppins">{cake.label}</span>
                </div>
                <p className="text-white/60 text-xs">{cake.desc}</p>
              </div>
              {formData.cake === cake.value && <span className="text-pink-400 text-xl">✓</span>}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );

  // Bond Selection Modal
  const BondModal = () => (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/90 backdrop-blur-md"
      onClick={closeModal}
    >
      <div className="w-full max-w-md bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 rounded-2xl overflow-hidden max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-white/20 flex justify-between items-center sticky top-0 bg-gray-900/95">
          <div>
            <h3 className="text-white font-semibold text-lg font-poppins">What describes your bond? 💗</h3>
            <p className="text-pink-300 text-xs mt-1">Choose any 3 ({tempBondSelection.length}/3)</p>
          </div>
          <button onClick={closeModal} className="text-white text-2xl">✕</button>
        </div>
        <div className="p-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            {bondOptions.map((bond) => (
              <button
                key={bond.value}
                onClick={() => handleBondToggle(bond.value)}
                className={`p-3 rounded-xl text-left transition-all ${tempBondSelection.includes(bond.value) ? 'bg-pink-500/30 border-2 border-pink-500' : 'bg-white/10 hover:bg-white/20'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{bond.emoji}</span>
                  <span className="text-white font-medium font-poppins">{bond.label}</span>
                </div>
                <p className="text-white/50 text-xs">{bond.desc}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-white/20 sticky bottom-0 bg-gray-900/95">
          <button
            onClick={saveBondSelection}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold font-poppins"
          >
            Save Selection ({tempBondSelection.length}/3)
          </button>
        </div>
      </div>
    </div>
  );

  // Vibe Selection Modal
  const VibeModal = () => (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/90 backdrop-blur-md"
      onClick={closeModal}
    >
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-md bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-white/20 flex justify-between items-center">
          <h3 className="text-white font-semibold text-lg font-poppins">Pick the vibe ✨</h3>
          <button onClick={closeModal} className="text-white text-2xl">✕</button>
        </div>
        <div className="p-4 space-y-3">
          {vibeOptions.map((vibe) => (
            <button
              key={vibe.value}
              onClick={() => {
                setFormData(prev => ({ ...prev, vibe: vibe.value }));
                closeModal();
              }}
              className={`w-full p-4 rounded-xl text-left transition-all ${formData.vibe === vibe.value ? `bg-gradient-to-r ${vibe.color} shadow-lg` : 'bg-white/10 hover:bg-white/20'}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{vibe.emoji}</span>
                <div>
                  <div className="text-white font-medium font-poppins">{vibe.label}</div>
                  <p className="text-white/60 text-xs">{vibe.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );

  // Friend Selection Modal
  const FriendModal = () => (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/90 backdrop-blur-md"
      onClick={closeModal}
    >
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-md bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-white/20 flex justify-between items-center">
          <h3 className="text-white font-semibold text-lg font-poppins">Choose a little friend 🧸</h3>
          <button onClick={closeModal} className="text-white text-2xl">✕</button>
        </div>
        <div className="p-4 space-y-3">
          {friendOptions.map((friend) => (
            <button
              key={friend.value}
              onClick={() => {
                setFormData(prev => ({ ...prev, friend: friend.value }));
                closeModal();
              }}
              className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${formData.friend === friend.value ? 'bg-pink-500/30 border-2 border-pink-500' : 'bg-white/10 hover:bg-white/20'}`}
            >
              <img src={friend.image} alt={friend.label} className="w-12 h-12 object-contain" />
              <div className="flex-1 text-left">
                <div className="flex items-center gap-1">
                  <span className="text-xl">{friend.emoji}</span>
                  <span className="text-white font-medium font-poppins">{friend.label}</span>
                </div>
                <p className="text-white/60 text-xs">{friend.desc}</p>
              </div>
              {formData.friend === friend.value && <span className="text-pink-400 text-xl">✓</span>}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );

  // Letter Editor Modal - Fixed re-render issue
  const LetterModal = () => (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/90 backdrop-blur-md"
      onClick={closeModal}
    >
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-md bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 rounded-2xl overflow-hidden max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-white/20 flex justify-between items-center sticky top-0 bg-gray-900/95">
          <h3 className="text-white font-semibold text-lg font-poppins">Edit your letter 💌</h3>
          <button onClick={closeModal} className="text-white text-2xl">✕</button>
        </div>
        <div className="p-4 overflow-y-auto">
          <div className="bg-white/10 rounded-xl p-4 mb-4">
            <p className="text-white/60 text-xs mb-2">Preview</p>
            <div className="bg-white/5 rounded-lg p-3 max-h-32 overflow-y-auto">
              <p className="text-white/80 text-sm italic whitespace-pre-wrap font-poppins">
                {letterText || `Dear ${formData.name || 'Friend'},\n\nHappy Birthday! 🎂\n\nYou mean the world to me...`}
              </p>
            </div>
          </div>
          
          <div className="bg-white/10 rounded-xl p-4">
            <label className="text-white/80 text-sm mb-2 block font-poppins">Write your heartfelt message:</label>
            <textarea
              value={letterText}
              onChange={(e) => setLetterText(e.target.value)}
              rows={12}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 font-poppins text-sm"
              placeholder="Write your special message here..."
            />
          </div>
          
          <div className="bg-white/10 rounded-xl p-4 mt-4">
            <p className="text-white/60 text-xs mb-2 font-poppins">💡 Tips for a great letter:</p>
            <ul className="text-white/50 text-xs space-y-1 list-disc pl-4 font-poppins">
              <li>Start with a warm greeting</li>
              <li>Share a favorite memory</li>
              <li>Express your feelings honestly</li>
              <li>End with a loving note</li>
            </ul>
          </div>
        </div>
        <div className="p-4 border-t border-white/20 sticky bottom-0 bg-gray-900/95">
          <button
            onClick={saveLetter}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold font-poppins"
          >
            Save Letter
          </button>
        </div>
      </motion.div>
    </div>
  );

  const PreviewModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 rounded-3xl overflow-hidden"
      >
        <div className="relative bg-black rounded-3xl p-2">
          <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl overflow-hidden">
            <div className="p-4">
              <div className="text-center mb-4">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-4xl mb-3">
                  🎂
                </div>
                <h3 className="text-lg font-bold text-gray-800 font-poppins">Happy Birthday, {formData.name || 'Friend'}!</h3>
                <p className="text-sm text-gray-600 font-poppins">Get ready for a magical surprise! ✨</p>
              </div>

              <div className="bg-white/50 rounded-xl p-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl mb-2">🎬</div>
                  <p className="text-sm text-gray-700 font-poppins">Preview of your surprise</p>
                  <div className="mt-2 h-1 bg-gray-300 rounded-full overflow-hidden">
                    <div className="w-1/2 h-full bg-pink-500 rounded-full" />
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <p className="text-sm font-semibold text-gray-700 text-center font-poppins">Pick a style — this is how it will look</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedStyle('classic')}
                    className={`p-3 rounded-xl transition-all ${selectedStyle === 'classic' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'bg-white/50 text-gray-700'}`}
                  >
                    <div className="text-xl mb-1">✨ 💜 ✨</div>
                    <div className="text-sm font-semibold font-poppins">Classic</div>
                    <div className="text-xs font-poppins">Magical & Cinematic</div>
                  </button>
                  <button
                    onClick={() => setSelectedStyle('cute')}
                    className={`p-3 rounded-xl transition-all ${selectedStyle === 'cute' ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg' : 'bg-white/50 text-gray-700'}`}
                  >
                    <div className="text-xl mb-1">♥ ♡ ❤</div>
                    <div className="text-sm font-semibold font-poppins">Cute & Sweet</div>
                    <div className="text-xs font-poppins">Playful & Pink</div>
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="bg-white/30 rounded-xl p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 line-through font-poppins">₹499</span>
                    <span className="text-2xl font-bold text-pink-600 font-poppins">₹199</span>
                    <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full font-poppins">60% OFF</span>
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={uploading}
                    className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg disabled:opacity-50 font-poppins"
                  >
                    {uploading ? 'Creating...' : 'Get this at ₹199'}
                  </button>
                  <div className="mt-2 text-center text-xs text-gray-600 font-poppins">
                    ✓ Secure payment via Razorpay<br />
                    ⚡ Instant delivery after payment
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowPreview(false)}
          className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg"
        >
          ✕
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen py-8 px-4 relative overflow-hidden">
      <StarField />

      <div className="container mx-auto max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3 animate-bounce">🎂</div>
          <h1 className="text-2xl font-bold text-white font-poppins">Create a Birthday Surprise</h1>
          <p className="text-sm text-purple-200 font-poppins">Make someone's day extra special! ✨</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <label className="block text-white mb-2 font-semibold font-poppins">
                  Whose birthday is it? <span className="text-pink-300">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 font-poppins"
                  placeholder="Enter name"
                />
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <label className="block text-white mb-2 font-semibold font-poppins">
                  When is the special day? <span className="text-pink-300">*</span>
                </label>
                <input
                  type="date"
                  value={formData.unlockDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, unlockDate: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500 mb-3 font-poppins"
                />
                <input
                  type="time"
                  value={formData.unlockTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, unlockTime: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500 font-poppins"
                />
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!formData.name || !formData.unlockDate}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg disabled:opacity-50 transition-transform hover:scale-[1.02] active:scale-[0.98] font-poppins"
              >
                Continue →
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 pb-20"
            >
              {/* Cake Selection with Image */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-white font-semibold font-poppins">Cake 🍰</label>
                  <button
                    onClick={() => openModal('cake')}
                    className="text-sm text-pink-300 hover:text-pink-200 font-poppins"
                  >
                    Change
                  </button>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl">
                  <img 
                    src={cakeOptions.find(c => c.value === formData.cake)?.image} 
                    alt={formData.cake}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xl">{cakeOptions.find(c => c.value === formData.cake)?.emoji}</span>
                      <span className="text-white font-medium font-poppins">{formData.cake}</span>
                    </div>
                    <p className="text-white/50 text-xs font-poppins">{cakeOptions.find(c => c.value === formData.cake)?.desc}</p>
                  </div>
                </div>
              </div>

              {/* Bond Selection */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-white font-semibold font-poppins">Bond 💗</label>
                  <button
                    onClick={() => openModal('bond')}
                    className="text-sm text-pink-300 hover:text-pink-200 font-poppins"
                  >
                    Change
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.bond.map((bond) => (
                    <span key={bond} className="px-3 py-1 bg-white/10 rounded-full text-white text-sm flex items-center gap-1 font-poppins">
                      <span>{bondOptions.find(b => b.value === bond)?.emoji}</span>
                      {bond}
                    </span>
                  ))}
                </div>
              </div>

              {/* Vibe Selection */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-white font-semibold font-poppins">Vibe ✨</label>
                  <button
                    onClick={() => openModal('vibe')}
                    className="text-sm text-pink-300 hover:text-pink-200 font-poppins"
                  >
                    Change
                  </button>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl">
                  <span className="text-2xl">{vibeOptions.find(v => v.value === formData.vibe)?.emoji}</span>
                  <span className="text-white font-poppins">{formData.vibe}</span>
                </div>
              </div>

              {/* Friend Selection */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-white font-semibold font-poppins">Little Friend 🧸</label>
                  <button
                    onClick={() => openModal('friend')}
                    className="text-sm text-pink-300 hover:text-pink-200 font-poppins"
                  >
                    Change
                  </button>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl">
                  <img 
                    src={friendOptions.find(f => f.value === formData.friend)?.image} 
                    alt={formData.friend}
                    className="w-10 h-10 object-contain"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xl">{friendOptions.find(f => f.value === formData.friend)?.emoji}</span>
                      <span className="text-white font-medium font-poppins">{formData.friend}</span>
                    </div>
                    <p className="text-white/50 text-xs font-poppins">{friendOptions.find(f => f.value === formData.friend)?.desc}</p>
                  </div>
                </div>
              </div>

              {/* Letter */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-white font-semibold font-poppins">Letter 💌</label>
                  <button
                    onClick={() => openModal('letter')}
                    className="text-sm text-pink-300 hover:text-pink-200 font-poppins"
                  >
                    {isLetterSaved || letterText ? 'Edit' : 'Write'}
                  </button>
                </div>
                <div className="p-3 bg-white/10 rounded-xl min-h-[80px]">
                  <p className="text-white/80 text-sm line-clamp-3 font-poppins">
                    {letterText || `Dear ${formData.name || 'Friend'},`}
                  </p>
                </div>
              </div>

              {/* Photos Upload */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
                <label className="block text-white mb-2 font-semibold font-poppins">
                  Upload Photos 📸 <span className="text-pink-300">*</span>
                </label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${isDragActive ? 'border-pink-500 bg-pink-500/20' : 'border-white/30 hover:border-pink-500'}`}
                >
                  <input {...getInputProps()} />
                  <div className="text-3xl mb-1">📷</div>
                  <p className="text-white/70 text-sm font-poppins">Drag & drop or click to upload</p>
                  <p className="text-white/50 text-xs font-poppins">Max 5 photos</p>
                </div>
                {previewImages.length > 0 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                    {previewImages.map((url, idx) => (
                      <div key={idx} className="relative flex-shrink-0">
                        <img src={url} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
                        <button
                          onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Music & Video Upload */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
                <label className="block text-white mb-2 font-semibold font-poppins">Background Music 🎵</label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setFormData(prev => ({ ...prev, music: e.target.files[0] }))}
                  className="w-full text-white/70 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-pink-500 file:text-white font-poppins"
                />
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
                <label className="block text-white mb-2 font-semibold font-poppins">Video Message 🎬</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setFormData(prev => ({ ...prev, video: e.target.files[0] }))}
                  className="w-full text-white/70 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-pink-500 file:text-white font-poppins"
                />
              </div>

              <div className="flex gap-3 sticky bottom-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-white/20 text-white rounded-xl font-semibold font-poppins"
                >
                  Back
                </button>
                <button
                  onClick={() => setShowPreview(true)}
                  className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg font-poppins"
                >
                  See Preview →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {activeModal === 'cake' && <CakeModal />}
        {activeModal === 'bond' && <BondModal />}
        {activeModal === 'vibe' && <VibeModal />}
        {activeModal === 'friend' && <FriendModal />}
        {activeModal === 'letter' && <LetterModal />}
        {showPreview && <PreviewModal />}
      </AnimatePresence>
    </div>
  );
};

export default CreateSurprisePageNew;