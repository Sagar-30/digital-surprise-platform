import { useState } from 'react';
import { motion } from 'framer-motion';

const shareMessages = [
  "🎂✨ A magical birthday journey awaits! Click to begin the celebration →",
  "🎁💕 I've hidden a special surprise just for you. Unlock it here →",
  "🎉🎂 The candles are lit, the cake is ready. Your surprise is waiting →",
  "💝✨ Close your eyes and click. A magical moment awaits →",
  "🎂🎁 Happy Birthday! Your personalized experience is ready to unfold →",
  "✨💕 A beautiful surprise, crafted with love, is waiting just for you →",
  "🎀🎂 The magic begins now. Click to reveal your special moment →",
  "💕🎁 I've created something magical. Click to see your surprise →",
  "🎂✨ Make a wish and click! Your birthday adventure starts here →",
  "💝🎉 Your name is on the cake! Come celebrate your special surprise →"
];

const ShareMessage = ({ name, onSelect }) => {
  const [selectedMessage, setSelectedMessage] = useState(shareMessages[0]);
  const [customMessage, setCustomMessage] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  const handleShare = () => {
    const message = useCustom ? customMessage : selectedMessage;
    onSelect(message);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold text-lg font-poppins">✨ Choose Your Magic Message ✨</h3>
      
      {!useCustom ? (
        <>
          <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto">
            {shareMessages.map((msg, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedMessage(msg)}
                className={`p-3 rounded-xl text-left text-sm transition-all ${
                  selectedMessage === msg 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' 
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                } font-poppins`}
              >
                {msg.replace('→', '✨')}
              </motion.button>
            ))}
          </div>
          
          <button
            onClick={() => setUseCustom(true)}
            className="text-pink-400 text-sm hover:text-pink-300 font-poppins"
          >
            ✏️ Write my own message
          </button>
        </>
      ) : (
        <div className="space-y-3">
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Write your personalized surprise message..."
            rows={3}
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 font-poppins"
          />
          <button
            onClick={() => setUseCustom(false)}
            className="text-gray-400 text-sm hover:text-gray-300 font-poppins"
          >
            ← Back to pre-written messages
          </button>
        </div>
      )}
      
      <button
        onClick={handleShare}
        className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-pink-500/25 transition-all font-poppins"
      >
        Share with Magic ✨
      </button>
    </div>
  );
};

export default ShareMessage;