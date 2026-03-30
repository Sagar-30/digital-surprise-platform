import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import useSurpriseStore from '../store/surpriseStore';
import GlassCard from '../components/common/GlassCard';

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
  
  const onDrop = (acceptedFiles, type) => {
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], ...acceptedFiles]
    }));
  };
  
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files) => onDrop(files, 'images'),
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    }
  });
  
  const handleSubmit = async () => {
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
      
      const surpriseData = {
        ...formData,
        images: imageUrls,
        music: musicUrl,
        video: videoUrl,
        status: 'active',
      };
      
      const id = await createSurprise(surpriseData);
      toast.success('Surprise created successfully!');
      navigate(`/surprise/${id}`);
    } catch (error) {
      toast.error('Failed to create surprise');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2 text-center">
            Create Your Surprise
          </h1>
          <p className="text-gray-300 text-center mb-8">
            Let's make something special! ✨
          </p>
          
          {/* Progress Steps */}
          <div className="flex justify-between mb-12">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= num ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-400'
                }`}>
                  {num}
                </div>
                {num < 4 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    step > num ? 'bg-purple-600' : 'bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          {/* Form Steps */}
          {step === 1 && (
            <GlassCard>
              <h2 className="text-2xl font-bold text-white mb-6">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white mb-2">Surprise Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="glass-input w-full"
                    placeholder="e.g., Happy Birthday Love!"
                  />
                </div>
                
                <div>
                  <label className="block text-white mb-2">Occasion</label>
                  <select
                    value={formData.occasion}
                    onChange={(e) => setFormData({...formData, occasion: e.target.value})}
                    className="glass-input w-full"
                  >
                    <option value="birthday">Birthday 🎂</option>
                    <option value="anniversary">Anniversary 💝</option>
                    <option value="graduation">Graduation 🎓</option>
                    <option value="just-because">Just Because ✨</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-white mb-2">Unlock Date & Time</label>
                  <input
                    type="datetime-local"
                    value={formData.unlockDate}
                    onChange={(e) => setFormData({...formData, unlockDate: e.target.value})}
                    className="glass-input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-white mb-2">Secret Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="glass-input w-full"
                    rows="4"
                    placeholder="Write a heartfelt message..."
                  />
                </div>
                
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    id="hasPassword"
                    checked={formData.hasPassword}
                    onChange={(e) => setFormData({...formData, hasPassword: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <label htmlFor="hasPassword" className="text-white">
                    Add password protection
                  </label>
                </div>
                
                {formData.hasPassword && (
                  <div>
                    <label className="block text-white mb-2">Password</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="glass-input w-full"
                    />
                  </div>
                )}
              </div>
            </GlassCard>
          )}
          
          {step === 2 && (
            <GlassCard>
              <h2 className="text-2xl font-bold text-white mb-6">Add Media</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-white mb-2">Photos</label>
                  <div {...getRootProps()} className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 transition-colors">
                    <input {...getInputProps()} />
                    <p className="text-white">Drag & drop photos here, or click to select</p>
                    <p className="text-sm text-gray-400 mt-2">Supports: JPG, PNG, GIF</p>
                  </div>
                  {formData.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {formData.images.map((file, idx) => (
                        <div key={idx} className="relative">
                          <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-24 object-cover rounded" />
                          <button
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== idx)
                            }))}
                            className="absolute top-1 right-1 bg-red-500 rounded-full w-5 h-5 text-xs flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-white mb-2">Background Music</label>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => setFormData({...formData, music: e.target.files[0]})}
                    className="glass-input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-white mb-2">Video Message</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setFormData({...formData, video: e.target.files[0]})}
                    className="glass-input w-full"
                  />
                </div>
              </div>
            </GlassCard>
          )}
          
          {step === 3 && (
            <GlassCard>
              <h2 className="text-2xl font-bold text-white mb-6">Interactive Elements</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-white mb-2">Quiz Questions</label>
                  <button
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      quiz: [...prev.quiz, { text: '', options: ['', '', '', ''], correct: 0 }]
                    }))}
                    className="neon-button text-sm"
                  >
                    + Add Question
                  </button>
                  
                  {formData.quiz.map((q, idx) => (
                    <div key={idx} className="mt-4 p-4 glass-card">
                      <input
                        type="text"
                        placeholder="Question"
                        value={q.text}
                        onChange={(e) => {
                          const newQuiz = [...formData.quiz];
                          newQuiz[idx].text = e.target.value;
                          setFormData({...formData, quiz: newQuiz});
                        }}
                        className="glass-input w-full mb-2"
                      />
                      {q.options.map((opt, optIdx) => (
                        <input
                          key={optIdx}
                          type="text"
                          placeholder={`Option ${optIdx + 1}`}
                          value={opt}
                          onChange={(e) => {
                            const newQuiz = [...formData.quiz];
                            newQuiz[idx].options[optIdx] = e.target.value;
                            setFormData({...formData, quiz: newQuiz});
                          }}
                          className="glass-input w-full mb-2"
                        />
                      ))}
                      <select
                        value={q.correct}
                        onChange={(e) => {
                          const newQuiz = [...formData.quiz];
                          newQuiz[idx].correct = parseInt(e.target.value);
                          setFormData({...formData, quiz: newQuiz});
                        }}
                        className="glass-input w-full"
                      >
                        {q.options.map((_, optIdx) => (
                          <option key={optIdx} value={optIdx}>Correct Answer: Option {optIdx + 1}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          )}
          
          {step === 4 && (
            <GlassCard>
              <h2 className="text-2xl font-bold text-white mb-6">Preview & Publish</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-lg">
                  <h3 className="text-white font-semibold">Summary</h3>
                  <p className="text-gray-300">Title: {formData.title || 'Not set'}</p>
                  <p className="text-gray-300">Occasion: {formData.occasion}</p>
                  <p className="text-gray-300">Photos: {formData.images.length}</p>
                  <p className="text-gray-300">Quiz Questions: {formData.quiz.length}</p>
                </div>
                
                <button
                  onClick={handleSubmit}
                  disabled={uploading}
                  className="neon-button w-full"
                >
                  {uploading ? 'Creating Surprise...' : 'Publish Surprise'}
                </button>
              </div>
            </GlassCard>
          )}
          
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-2 glass-card text-white"
              >
                Back
              </button>
            )}
            {step < 4 && (
              <button
                onClick={() => setStep(step + 1)}
                className="neon-button ml-auto"
              >
                Next
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateSurprisePage;