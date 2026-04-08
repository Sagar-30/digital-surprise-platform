import { useInView } from 'react-intersection-observer';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const TimelineItem = ({ item, index, isLast }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Get icon based on index or item
  const getIcon = () => {
    if (item.icon) return item.icon;
    const icons = ['💕', '💝', '✨', '📸', '🎉', '🎁', '🌸', '⭐'];
    return icons[index % icons.length];
  };
  
  // Get title
  const title = item.title || item.name || `Memory ${index + 1}`;
  
  // Get caption/description
  const caption = item.caption || item.description || item.message || "A beautiful memory we share 💕";
  
  // Get date
  const date = item.date || item.createdAt || "";
  
  // Get image
  const imageUrl = item.image || item.imageUrl || item.url || null;
  
  // Format date if it's a timestamp
  const formatDate = (dateValue) => {
    if (!dateValue) return "";
    if (dateValue.toDate) {
      return dateValue.toDate().toLocaleDateString();
    }
    if (typeof dateValue === 'string') {
      return new Date(dateValue).toLocaleDateString();
    }
    return dateValue;
  };
  
  return (
    <motion.div
      ref={ref}
      className="relative mb-6 md:mb-8"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Timeline connecting line */}
      {!isLast && (
        <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-gradient-to-b from-pink-400 to-purple-400 hidden sm:block" />
      )}
      
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {/* Timeline icon */}
        <div className="flex-shrink-0">
          <motion.div
            className="relative w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white text-lg shadow-lg z-10"
            whileHover={{ scale: 1.1, rotate: 10 }}
            transition={{ duration: 0.3 }}
          >
            {getIcon()}
          </motion.div>
        </div>
        
        {/* Content card */}
        <div className="flex-1">
          <motion.div
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden border border-pink-200 dark:border-pink-500/20 shadow-lg hover:shadow-xl transition-all"
            whileHover={{ y: -3 }}
          >
            {/* Image section */}
            {imageUrl && !imageError && (
              <div className="relative overflow-hidden h-40 sm:h-48">
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                {date && (
                  <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg text-white text-xs">
                    {formatDate(date)}
                  </div>
                )}
              </div>
            )}
            
            {/* Content */}
            <div className="p-4">
              <div className="flex justify-between items-start gap-2 mb-2">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  {title}
                </h3>
                {date && !imageUrl && (
                  <span className="text-xs text-pink-500 dark:text-pink-400 flex-shrink-0">
                    {formatDate(date)}
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {isExpanded || caption.length <= 120 
                  ? caption 
                  : `${caption.substring(0, 120)}...`
                }
              </p>
              
              {caption.length > 120 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-2 text-pink-500 dark:text-pink-400 text-xs font-semibold hover:text-pink-600 transition-colors"
                >
                  {isExpanded ? 'Show less ↑' : 'Read more ↓'}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const TimelineComponent = ({ memories = [] }) => {
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('timeline');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading or wait for data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  
  // Sample fallback memories if none provided
  const defaultMemories = [
    {
      title: "Our First Meeting",
      caption: "The day we first met. It was an instant connection! From that moment, I knew something special was beginning. 💕",
      date: "March 15, 2024",
      icon: "💕"
    },
    {
      title: "First Date",
      caption: "Beautiful evening together. We talked for hours and didn't want the night to end. Perfect memories that I'll always treasure. 🌅",
      date: "March 22, 2024",
      icon: "💝"
    },
    {
      title: "Making It Official",
      caption: "The best decision ever! Every day with you feels like a blessing. So grateful to have you in my life. 💑",
      date: "April 10, 2024",
      icon: "✨"
    },
    {
      title: "Our First Trip",
      caption: "Amazing adventure together! We explored new places, tried new foods, and created unforgettable memories. 🏔️",
      date: "June 5, 2024",
      icon: "📸"
    },
    {
      title: "Celebrating Love",
      caption: "Every moment with you is a celebration of love. Thank you for being you! 🎉",
      date: "August 20, 2024",
      icon: "🎉"
    }
  ];
  
  // Use provided memories or fallback
  const displayMemories = (memories && memories.length > 0) ? memories : defaultMemories;
  
  // Get unique years for filter
  const getYear = (dateStr) => {
    if (!dateStr) return null;
    try {
      if (dateStr.toDate) {
        return dateStr.toDate().getFullYear();
      }
      return new Date(dateStr).getFullYear();
    } catch (e) {
      return null;
    }
  };
  
  const years = ['all', ...new Set(displayMemories.map(m => getYear(m.date) || getYear(m.createdAt)).filter(Boolean))];
  
  const filteredMemories = filter === 'all' 
    ? displayMemories 
    : displayMemories.filter(m => {
        const year = getYear(m.date) || getYear(m.createdAt);
        return year && year.toString() === filter;
      });
  
  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl animate-pulse mb-4">📖</div>
          <p className="text-gray-500 dark:text-gray-400">Loading memories...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-8 px-4 relative">
      {/* Simple background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 via-purple-50/50 to-blue-50/50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-blue-950/20" />
      
      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-4xl mb-3">📖</div>
          <h2 className="text-2xl sm:text-3xl font-bold">
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Our Beautiful Story
            </span>
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            A journey filled with love and special moments 💕
          </p>
        </motion.div>
        
        {/* Controls */}
        {years.length > 2 && (
          <div className="flex justify-center gap-2 mb-6 flex-wrap">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setFilter(year)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  filter === year
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md'
                    : 'bg-white/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:bg-white/70'
                }`}
              >
                {year === 'all' ? 'All' : year}
              </button>
            ))}
          </div>
        )}
        
        {/* View mode toggle */}
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              viewMode === 'timeline'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md'
                : 'bg-white/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400'
            }`}
          >
            Timeline 📅
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              viewMode === 'grid'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md'
                : 'bg-white/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400'
            }`}
          >
            Grid View 🖼️
          </button>
        </div>
        
        {/* Content */}
        {filteredMemories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-gray-500 dark:text-gray-400">No memories for this year</p>
            <button
              onClick={() => setFilter('all')}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg text-sm"
            >
              View All
            </button>
          </div>
        ) : viewMode === 'timeline' ? (
          <div>
            {filteredMemories.map((memory, idx) => (
              <TimelineItem
                key={idx}
                item={memory}
                index={idx}
                isLast={idx === filteredMemories.length - 1}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredMemories.map((memory, idx) => {
              const title = memory.title || memory.name || `Memory ${idx + 1}`;
              const caption = memory.caption || memory.description || "A beautiful memory 💕";
              const imageUrl = memory.image || memory.imageUrl || null;
              
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden border border-pink-200 dark:border-pink-500/20 shadow-md"
                >
                  {imageUrl && (
                    <div className="h-32 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-3">
                    <h3 className="font-bold text-gray-800 dark:text-white text-sm mb-1">
                      {title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                      {caption}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
        
        {/* Footer stats */}
        {filteredMemories.length > 0 && (
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full text-xs text-gray-500 dark:text-gray-400">
              <span>📸 {filteredMemories.length} Memories</span>
              <span>❤️</span>
              <span>✨ Made with Love</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineComponent;