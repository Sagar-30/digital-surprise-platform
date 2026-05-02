import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import useSurpriseStore from '../store/surpriseStore.jsx';

const CreateSurprisePage = () => {
  const navigate = useNavigate();
  const { createSurprise, uploadFile } = useSurpriseStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    occasion: 'birthday',
    unlockDate: '',
    message: '',
    images: [],
    music: null,
    video: null,
    quiz: [],
    memories: [],
    hasPassword: false,
    password: '',
  });
  const [uploading, setUploading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [errors, setErrors] = useState({});

  // Generate preview URLs for images
  useEffect(() => {
    const urls = formData.images.map(file => URL.createObjectURL(file));
    setPreviewImages(urls);
    return () => urls.forEach(url => URL.revokeObjectURL(url));
  }, [formData.images]);

  const onDrop = (acceptedFiles, type) => {
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], ...acceptedFiles]
    }));
    // Clear error for images if any
    if (errors.images) {
      setErrors(prev => ({ ...prev, images: null }));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => onDrop(files, 'images'),
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 10
  });

  // Validate current step before proceeding
  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.title.trim()) {
        newErrors.title = 'Please enter a surprise title';
      }
      if (!formData.unlockDate) {
        newErrors.unlockDate = 'Please select unlock date & time';
      }
      if (!formData.message.trim()) {
        newErrors.message = 'Please write a secret message';
      }
      if (formData.hasPassword && !formData.password.trim()) {
        newErrors.password = 'Please enter a password';
      }
    }

    if (currentStep === 2) {
      if (formData.images.length === 0) {
        newErrors.images = 'Please upload at least one photo';
      }
      // Music and video are optional - no validation needed
    }

    if (currentStep === 3) {
      // Quiz validation - at least one complete question if any added
      if (formData.quiz.length > 0) {
        formData.quiz.forEach((q, idx) => {
          if (!q.text.trim()) {
            newErrors[`quiz_${idx}_text`] = `Question ${idx + 1}: Please enter the question`;
          }
          q.options.forEach((opt, optIdx) => {
            if (!opt.trim()) {
              newErrors[`quiz_${idx}_option_${optIdx}`] = `Question ${idx + 1}: Option ${optIdx + 1} is empty`;
            }
          });
        });
      }

      // Memory validation - at least one complete memory if any added
      if (formData.memories.length > 0) {
        formData.memories.forEach((memory, idx) => {
          if (!memory.title?.trim()) {
            newErrors[`memory_${idx}_title`] = `Memory ${idx + 1}: Please enter a title`;
          }
          if (!memory.caption?.trim()) {
            newErrors[`memory_${idx}_caption`] = `Memory ${idx + 1}: Please enter a description`;
          }
          if (!memory.date) {
            newErrors[`memory_${idx}_date`] = `Memory ${idx + 1}: Please select a date`;
          }
        });
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Show error toast
      toast.error('Please fill in all required fields');
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // const handleSubmit = async () => {
  //   // Final validation before submit
  //   if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
  //     toast.error('Please fill in all required fields');
  //     setStep(1);
  //     return;
  //   }

  //   setUploading(true);
  //   try {
  //     const imageUrls = [];
  //     for (const image of formData.images) {
  //       const url = await uploadFile(image, `surprises/${Date.now()}_${image.name}`);
  //       imageUrls.push(url);
  //     }

  //     let musicUrl = null;
  //     if (formData.music) {
  //       musicUrl = await uploadFile(formData.music, `music/${Date.now()}_${formData.music.name}`);
  //     }

  //     let videoUrl = null;
  //     if (formData.video) {
  //       videoUrl = await uploadFile(formData.video, `videos/${Date.now()}_${formData.video.name}`);
  //     }

  //     // Process memories images
  //     const processedMemories = await Promise.all(formData.memories.map(async (memory) => {
  //       let imageUrl = null;
  //       if (memory.image) {
  //         imageUrl = await uploadFile(memory.image, `memories/${Date.now()}_${memory.image.name}`);
  //       }
  //       return {
  //         ...memory,
  //         image: imageUrl,
  //         imagePreview: undefined // Remove preview URL
  //       };
  //     }));

  //     const surpriseData = {
  //       ...formData,
  //       images: imageUrls,
  //       music: musicUrl,
  //       video: videoUrl,
  //       memories: processedMemories,
  //       status: 'active',
  //       createdAt: new Date().toISOString()
  //     };

  //     const id = await createSurprise(surpriseData);
  //     toast.success('Surprise created successfully! 🎉');

  //     // Navigate to share page instead of surprise page
  //     navigate(`/share?id=${id}`);
  //   } catch (error) {
  //     toast.error('Failed to create surprise');
  //     console.error(error);
  //   } finally {
  //     setUploading(false);
  //   }
  // };


  const handleSubmit = async () => {
    if (!formData.title || !formData.unlockDate || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setUploading(true);
    try {
      // Upload images
      const imageUrls = [];
      for (const image of formData.images) {
        const url = await uploadFile(image, `surprises/${Date.now()}_${image.name}`);
        imageUrls.push(url);
      }

      // Upload music
      let musicUrl = null;
      if (formData.music) {
        musicUrl = await uploadFile(formData.music, `music/${Date.now()}_${formData.music.name}`);
      }

      // Upload video
      let videoUrl = null;
      if (formData.video) {
        videoUrl = await uploadFile(formData.video, `videos/${Date.now()}_${formData.video.name}`);
      }

      // Process memories images
      const processedMemories = await Promise.all(formData.memories.map(async (memory) => {
        let imageUrl = null;
        if (memory.image) {
          imageUrl = await uploadFile(memory.image, `memories/${Date.now()}_${memory.image.name}`);
        }
        return {
          title: memory.title || '',
          caption: memory.caption || '',
          date: memory.date || '',
          image: imageUrl,
        };
      }));

      // Process quiz questions - remove empty ones
      const processedQuiz = formData.quiz
        .filter(q => q.text && q.text.trim() !== '') // Remove empty questions
        .map(q => ({
          text: q.text,
          options: q.options.map(opt => opt || ''), // Ensure options are strings
          correct: q.correct || 0
        }));

      // IMPORTANT: Clean the data - remove undefined values
      const surpriseData = {
        title: formData.title || '',
        occasion: formData.occasion || 'birthday',
        unlockDate: formData.unlockDate || '',
        message: formData.message || '',
        images: imageUrls || [],
        music: musicUrl || null,
        video: videoUrl || null,
        quiz: processedQuiz,
        memories: processedMemories,
        hasPassword: formData.hasPassword || false,
        views: 0,
        status: 'active'
      };

      // Only add password field if hasPassword is true AND password is not empty
      if (formData.hasPassword && formData.password && formData.password.trim() !== '') {
        surpriseData.password = formData.password;
      }

      // Remove any undefined or null values from the object
      Object.keys(surpriseData).forEach(key => {
        if (surpriseData[key] === undefined) {
          delete surpriseData[key];
        }
      });

      console.log('Cleaned surprise data:', surpriseData); // Debug log

      const id = await createSurprise(surpriseData);
      toast.success('Surprise created successfully! 🎉');
      navigate(`/share?id=${id}`);
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to create surprise: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const steps = [
    { number: 1, title: "Basic Info", icon: "💝", color: "from-pink-400 to-rose-400" },
    { number: 2, title: "Add Media", icon: "📸", color: "from-purple-400 to-indigo-400" },
    { number: 3, title: "Interactive", icon: "🎮", color: "from-blue-400 to-cyan-400" },
    { number: 4, title: "Publish", icon: "✨", color: "from-orange-400 to-amber-400" }
  ];

  const occasions = [
    { value: 'birthday', label: 'Birthday', emoji: '🎂', color: 'from-pink-400 to-rose-400' },
    { value: 'anniversary', label: 'Anniversary', emoji: '💝', color: 'from-purple-400 to-indigo-400' },
    { value: 'graduation', label: 'Graduation', emoji: '🎓', color: 'from-blue-400 to-cyan-400' },
    { value: 'just-because', label: 'Just Because', emoji: '✨', color: 'from-orange-400 to-amber-400' }
  ];

  return (
    <div className="min-h-screen py-8 md:py-12 px-4 relative overflow-hidden">
      {/* Animated Background - same as before */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 dark:from-pink-900 dark:via-purple-900 dark:to-blue-900" />
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20"
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20"
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-xl md:text-2xl pointer-events-none"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [0, -80, 0], x: [0, Math.random() * 40 - 20, 0], opacity: [0, 0.4, 0] }}
            transition={{ duration: Math.random() * 5 + 3, repeat: Infinity, delay: Math.random() * 5 }}
          >
            {['💕', '💝', '💖', '💗'][i % 4]}
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 md:mb-8">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-5xl md:text-6xl mb-3">
              🎀
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
              Create Your Surprise
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
              Let's make something magical and memorable! ✨
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8 md:mb-12">
            <div className="flex justify-between items-center">
              {steps.map((s, idx) => (
                <div key={s.number} className="flex-1 flex flex-col items-center">
                  <motion.div
                    className={`relative z-10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base ${step >= s.number ? `bg-gradient-to-r ${s.color} shadow-lg` : 'bg-gray-300 dark:bg-gray-700'}`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {step > s.number ? '✓' : s.icon}
                  </motion.div>
                  <div className="text-center mt-2">
                    <p className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hidden sm:block">
                      {s.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-4 md:hidden">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Step {step} of 4: {steps[step - 1].title}
              </p>
            </div>
          </div>

          {/* Form Steps */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/50 dark:border-white/10 shadow-2xl"
            >
              {step === 1 && (
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                    <span>💝</span> Basic Information
                  </h2>
                  <div className="space-y-5">
                    {/* Title Field */}
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">
                        Surprise Title <span className="text-pink-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => {
                          setFormData({ ...formData, title: e.target.value });
                          if (errors.title) setErrors({ ...errors, title: null });
                        }}
                        className={`w-full px-4 py-3 bg-white/50 dark:bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-800 dark:text-white placeholder-gray-500 ${errors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-pink-300 dark:border-pink-500/30 focus:border-pink-500 focus:ring-pink-500/20'}`}
                        placeholder="e.g., Happy Birthday My Love!"
                      />
                      {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                    </div>

                    {/* Occasion Field */}
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">
                        Occasion
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {occasions.map((occ) => (
                          <motion.button
                            key={occ.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, occasion: occ.value })}
                            className={`px-4 py-2 rounded-xl transition-all ${formData.occasion === occ.value ? `bg-gradient-to-r ${occ.color} text-white shadow-lg` : 'bg-white/50 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 border border-pink-300 dark:border-pink-500/30'}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span className="text-lg mr-2">{occ.emoji}</span>
                            <span className="text-sm">{occ.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Unlock Date Field */}
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">
                        Unlock Date & Time <span className="text-pink-500">*</span>
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.unlockDate}
                        onChange={(e) => {
                          setFormData({ ...formData, unlockDate: e.target.value });
                          if (errors.unlockDate) setErrors({ ...errors, unlockDate: null });
                        }}
                        className={`w-full px-4 py-3 bg-white/50 dark:bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-800 dark:text-white ${errors.unlockDate ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-pink-300 dark:border-pink-500/30 focus:border-pink-500 focus:ring-pink-500/20'}`}
                      />
                      {errors.unlockDate && <p className="text-red-500 text-xs mt-1">{errors.unlockDate}</p>}
                    </div>

                    {/* Secret Message Field */}
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">
                        Secret Message <span className="text-pink-500">*</span>
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => {
                          setFormData({ ...formData, message: e.target.value });
                          if (errors.message) setErrors({ ...errors, message: null });
                        }}
                        className={`w-full px-4 py-3 bg-white/50 dark:bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-800 dark:text-white placeholder-gray-500 ${errors.message ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-pink-300 dark:border-pink-500/30 focus:border-pink-500 focus:ring-pink-500/20'}`}
                        rows="4"
                        placeholder="Write a heartfelt message that will appear in the surprise..."
                      />
                      {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                    </div>

                    {/* Password Protection */}
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="hasPassword"
                        checked={formData.hasPassword}
                        onChange={(e) => setFormData({ ...formData, hasPassword: e.target.checked })}
                        className="w-5 h-5 rounded border-pink-300 text-pink-500 focus:ring-pink-500"
                      />
                      <label htmlFor="hasPassword" className="text-gray-700 dark:text-gray-300 font-semibold">
                        Add password protection 🔒
                      </label>
                    </div>

                    {formData.hasPassword && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">
                          Secret Password
                        </label>
                        <input
                          type="password"
                          value={formData.password}
                          onChange={(e) => {
                            setFormData({ ...formData, password: e.target.value });
                            if (errors.password) setErrors({ ...errors, password: null });
                          }}
                          className={`w-full px-4 py-3 bg-white/50 dark:bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-800 dark:text-white ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-pink-300 dark:border-pink-500/30 focus:border-pink-500 focus:ring-pink-500/20'}`}
                          placeholder="Set a secret password"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                    <span>📸</span> Add Media
                  </h2>
                  <div className="space-y-6">
                    {/* Photos Field - Required */}
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">
                        Photos <span className="text-pink-500">*</span>
                      </label>
                      <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-xl p-6 md:p-8 text-center cursor-pointer transition-all ${isDragActive ? 'border-pink-500 bg-pink-50/50 dark:bg-pink-900/20' : errors.images ? 'border-red-500' : 'border-pink-300 dark:border-pink-500/30 hover:border-pink-500'}`}
                      >
                        <input {...getInputProps()} />
                        <div className="text-4xl mb-2">📷</div>
                        <p className="text-gray-700 dark:text-gray-300">
                          {isDragActive ? 'Drop your photos here' : 'Drag & drop photos here, or click to select'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          Supports: JPG, PNG, GIF (Max 10 images)
                        </p>
                      </div>
                      {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}

                      {previewImages.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {previewImages.map((url, idx) => (
                            <motion.div key={idx} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="relative group">
                              <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-24 md:h-32 object-cover rounded-lg" />
                              <button
                                onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                ×
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Background Music - Optional */}
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">
                        Background Music 🎵 <span className="text-gray-400 text-sm font-normal">(Optional)</span>
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={(e) => setFormData({ ...formData, music: e.target.files[0] })}
                          className="w-full px-4 py-3 bg-white/50 dark:bg-gray-900/50 border border-pink-300 dark:border-pink-500/30 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all text-gray-800 dark:text-white file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                        />
                        {formData.music && (
                          <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                            ✓ {formData.music.name} selected
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Video Message - Optional */}
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">
                        Video Message 🎬 <span className="text-gray-400 text-sm font-normal">(Optional)</span>
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => setFormData({ ...formData, video: e.target.files[0] })}
                          className="w-full px-4 py-3 bg-white/50 dark:bg-gray-900/50 border border-pink-300 dark:border-pink-500/30 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all text-gray-800 dark:text-white file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                        />
                        {formData.video && (
                          <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                            ✓ {formData.video.name} selected
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                    <span>🎮</span> Interactive Elements
                  </h2>
                  <div className="space-y-8">
                    {/* Quiz Section - Optional but validated if added */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <label className="text-gray-700 dark:text-gray-300 font-semibold">
                          Quiz Questions 📝 <span className="text-gray-400 text-sm font-normal">(Optional)</span>
                        </label>
                        <motion.button
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            quiz: [...prev.quiz, { text: '', options: ['', '', '', ''], correct: 0 }]
                          }))}
                          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg text-sm font-semibold shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          + Add Question
                        </motion.button>
                      </div>

                      <div className="space-y-4">
                        {formData.quiz.map((q, idx) => (
                          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/30 dark:bg-gray-900/30 rounded-xl p-4 border border-pink-200 dark:border-pink-500/20">
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="text-gray-800 dark:text-white font-semibold">Question {idx + 1}</h3>
                              <button onClick={() => { const newQuiz = [...formData.quiz]; newQuiz.splice(idx, 1); setFormData({ ...formData, quiz: newQuiz }); }} className="text-red-500 hover:text-red-600">🗑️</button>
                            </div>
                            <input type="text" placeholder="Enter your question" value={q.text} onChange={(e) => { const newQuiz = [...formData.quiz]; newQuiz[idx].text = e.target.value; setFormData({ ...formData, quiz: newQuiz }); }} className="w-full px-4 py-2 mb-3 bg-white/50 dark:bg-gray-900/50 border border-pink-300 dark:border-pink-500/30 rounded-lg focus:outline-none focus:border-pink-500 text-gray-800 dark:text-white" />
                            {errors[`quiz_${idx}_text`] && <p className="text-red-500 text-xs -mt-2 mb-2">{errors[`quiz_${idx}_text`]}</p>}
                            {q.options.map((opt, optIdx) => (
                              <input key={optIdx} type="text" placeholder={`Option ${optIdx + 1}`} value={opt} onChange={(e) => { const newQuiz = [...formData.quiz]; newQuiz[idx].options[optIdx] = e.target.value; setFormData({ ...formData, quiz: newQuiz }); }} className="w-full px-4 py-2 mb-2 bg-white/50 dark:bg-gray-900/50 border border-pink-300 dark:border-pink-500/30 rounded-lg focus:outline-none focus:border-pink-500 text-gray-800 dark:text-white" />
                            ))}
                            {errors[`quiz_${idx}_option_0`] && <p className="text-red-500 text-xs -mt-1 mb-2">{errors[`quiz_${idx}_option_0`]}</p>}
                            <select value={q.correct} onChange={(e) => { const newQuiz = [...formData.quiz]; newQuiz[idx].correct = parseInt(e.target.value); setFormData({ ...formData, quiz: newQuiz }); }} className="w-full px-4 py-2 bg-white/50 dark:bg-gray-900/50 border border-pink-300 dark:border-pink-500/30 rounded-lg focus:outline-none focus:border-pink-500 text-gray-800 dark:text-white">
                              {q.options.map((_, optIdx) => (<option key={optIdx} value={optIdx}>Correct Answer: Option {optIdx + 1}</option>))}
                            </select>
                          </motion.div>
                        ))}
                      </div>
                      {formData.quiz.length === 0 && (<div className="text-center py-6 text-gray-500 dark:text-gray-400"><div className="text-4xl mb-2">📝</div><p>No quiz questions added yet</p><p className="text-sm">Click "Add Question" to create a fun quiz!</p></div>)}
                    </div>

                    {/* Memories Section - Optional but validated if added */}
                    <div className="border-t border-pink-200 dark:border-pink-500/20 pt-6">
                      <div className="flex justify-between items-center mb-4">
                        <label className="text-gray-700 dark:text-gray-300 font-semibold">
                          Our Story Memories 📖 <span className="text-gray-400 text-sm font-normal">(Optional)</span>
                        </label>
                        <motion.button
                          onClick={() => setFormData(prev => ({ ...prev, memories: [...prev.memories, { title: '', caption: '', date: '', image: null, imagePreview: null }] }))}
                          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg text-sm font-semibold shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          + Add Memory
                        </motion.button>
                      </div>

                      <div className="space-y-4">
                        {formData.memories.map((memory, idx) => (
                          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/30 dark:bg-gray-900/30 rounded-xl p-4 border border-pink-200 dark:border-pink-500/20">
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="text-gray-800 dark:text-white font-semibold">Memory {idx + 1}</h3>
                              <button onClick={() => { const newMemories = [...formData.memories]; newMemories.splice(idx, 1); setFormData({ ...formData, memories: newMemories }); }} className="text-red-500 hover:text-red-600">🗑️</button>
                            </div>
                            <input type="text" placeholder="Title (e.g., Our First Date)" value={memory.title} onChange={(e) => { const newMemories = [...formData.memories]; newMemories[idx].title = e.target.value; setFormData({ ...formData, memories: newMemories }); }} className="w-full px-4 py-2 mb-3 bg-white/50 dark:bg-gray-900/50 border border-pink-300 dark:border-pink-500/30 rounded-lg focus:outline-none focus:border-pink-500 text-gray-800 dark:text-white text-sm" />
                            {errors[`memory_${idx}_title`] && <p className="text-red-500 text-xs -mt-2 mb-2">{errors[`memory_${idx}_title`]}</p>}
                            <textarea placeholder="Write about this beautiful memory..." value={memory.caption} onChange={(e) => { const newMemories = [...formData.memories]; newMemories[idx].caption = e.target.value; setFormData({ ...formData, memories: newMemories }); }} rows="3" className="w-full px-4 py-2 mb-3 bg-white/50 dark:bg-gray-900/50 border border-pink-300 dark:border-pink-500/30 rounded-lg focus:outline-none focus:border-pink-500 text-gray-800 dark:text-white text-sm" />
                            {errors[`memory_${idx}_caption`] && <p className="text-red-500 text-xs -mt-2 mb-2">{errors[`memory_${idx}_caption`]}</p>}
                            <input type="date" value={memory.date} onChange={(e) => { const newMemories = [...formData.memories]; newMemories[idx].date = e.target.value; setFormData({ ...formData, memories: newMemories }); }} className="w-full px-4 py-2 mb-3 bg-white/50 dark:bg-gray-900/50 border border-pink-300 dark:border-pink-500/30 rounded-lg focus:outline-none focus:border-pink-500 text-gray-800 dark:text-white text-sm" />
                            {errors[`memory_${idx}_date`] && <p className="text-red-500 text-xs -mt-2 mb-2">{errors[`memory_${idx}_date`]}</p>}
                            <div className="mt-2">
                              <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">Memory Image (optional)</label>
                              <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if (file) { const newMemories = [...formData.memories]; newMemories[idx].image = file; newMemories[idx].imagePreview = URL.createObjectURL(file); setFormData({ ...formData, memories: newMemories }); } }} className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100" />
                              {memory.imagePreview && (<div className="mt-2 relative inline-block"><img src={memory.imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg" /><button onClick={() => { const newMemories = [...formData.memories]; newMemories[idx].image = null; newMemories[idx].imagePreview = null; setFormData({ ...formData, memories: newMemories }); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">×</button></div>)}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      {formData.memories.length === 0 && (<div className="text-center py-8 text-gray-500 dark:text-gray-400"><div className="text-4xl mb-2">📖</div><p>No memories added yet</p><p className="text-sm">Click "Add Memory" to start your beautiful story timeline!</p></div>)}
                      {formData.memories.length > 0 && (<div className="mt-4 p-4 bg-pink-50/50 dark:bg-pink-900/20 rounded-lg"><p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2"><span>✨</span> You have {formData.memories.length} beautiful memory{formData.memories.length !== 1 ? 'ies' : ''} that will appear in your story timeline<span>✨</span></p></div>)}
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                    <span>✨</span> Preview & Publish
                  </h2>
                  <div className="space-y-6">
                    <div className="bg-white/30 dark:bg-gray-900/30 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2"><span>📋</span> Surprise Summary</h3>
                      <div className="space-y-3">
                        <div className="flex flex-wrap justify-between py-2 border-b border-pink-200 dark:border-pink-500/20"><span className="text-gray-600 dark:text-gray-400">Title:</span><span className="text-gray-800 dark:text-white font-semibold">{formData.title || 'Not set'}</span></div>
                        <div className="flex flex-wrap justify-between py-2 border-b border-pink-200 dark:border-pink-500/20"><span className="text-gray-600 dark:text-gray-400">Occasion:</span><span className="text-gray-800 dark:text-white font-semibold capitalize">{formData.occasion}</span></div>
                        <div className="flex flex-wrap justify-between py-2 border-b border-pink-200 dark:border-pink-500/20"><span className="text-gray-600 dark:text-gray-400">Unlock Date:</span><span className="text-gray-800 dark:text-white font-semibold">{formData.unlockDate ? new Date(formData.unlockDate).toLocaleString() : 'Not set'}</span></div>
                        <div className="flex flex-wrap justify-between py-2 border-b border-pink-200 dark:border-pink-500/20"><span className="text-gray-600 dark:text-gray-400">Photos:</span><span className="text-gray-800 dark:text-white font-semibold">{formData.images.length} images</span></div>
                        <div className="flex flex-wrap justify-between py-2 border-b border-pink-200 dark:border-pink-500/20"><span className="text-gray-600 dark:text-gray-400">Music:</span><span className="text-gray-800 dark:text-white font-semibold">{formData.music ? '✓ Added' : 'Not added'}</span></div>
                        <div className="flex flex-wrap justify-between py-2 border-b border-pink-200 dark:border-pink-500/20"><span className="text-gray-600 dark:text-gray-400">Video:</span><span className="text-gray-800 dark:text-white font-semibold">{formData.video ? '✓ Added' : 'Not added'}</span></div>
                        <div className="flex flex-wrap justify-between py-2 border-b border-pink-200 dark:border-pink-500/20"><span className="text-gray-600 dark:text-gray-400">Quiz Questions:</span><span className="text-gray-800 dark:text-white font-semibold">{formData.quiz.length} questions</span></div>
                        <div className="flex flex-wrap justify-between py-2 border-b border-pink-200 dark:border-pink-500/20"><span className="text-gray-600 dark:text-gray-400">Memories:</span><span className="text-gray-800 dark:text-white font-semibold">{formData.memories.length} memories</span></div>
                        <div className="flex flex-wrap justify-between py-2"><span className="text-gray-600 dark:text-gray-400">Password Protected:</span><span className="text-gray-800 dark:text-white font-semibold">{formData.hasPassword ? '✓ Yes' : 'No'}</span></div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl p-6 text-white text-center"><div className="text-3xl mb-2">🎉</div><p className="text-lg font-semibold mb-2">Ready to Share the Love?</p><p className="text-sm opacity-90">Your surprise will be available at the scheduled time</p></div>
                    <motion.button onClick={handleSubmit} disabled={uploading} className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-pink-500/25 transition-all disabled:opacity-50" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      {uploading ? (<span className="flex items-center justify-center gap-2"><svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Creating Your Surprise...</span>) : 'Publish Surprise 💕'}
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6 md:mt-8 gap-4">
            {step > 1 && (<motion.button onClick={handleBack} className="flex-1 px-6 py-3 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm text-gray-700 dark:text-white rounded-xl font-semibold border border-pink-300 dark:border-pink-500/30 hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>← Back</motion.button>)}
            {step < 4 && (<motion.button onClick={handleNext} className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-pink-500/25 transition-all" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Next →</motion.button>)}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateSurprisePage;