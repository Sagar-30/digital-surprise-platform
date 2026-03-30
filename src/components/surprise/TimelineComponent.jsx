import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

const TimelineItem = ({ item, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });
  
  return (
    <motion.div
      ref={ref}
      className="flex gap-6 mb-8"
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
          {index + 1}
        </div>
        {index < 2 && <div className="w-0.5 h-full bg-purple-400 mx-auto mt-2" />}
      </div>
      
      <div className="flex-grow">
        <div className="glass-card p-4">
          {item.image && (
            <img
              src={item.image}
              alt={item.caption}
              className="w-full h-48 object-cover rounded-lg mb-3"
            />
          )}
          <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
          <p className="text-gray-300">{item.caption}</p>
          <p className="text-sm text-purple-400 mt-2">{item.date}</p>
        </div>
      </div>
    </motion.div>
  );
};

const TimelineComponent = ({ memories }) => {
  return (
    <div className="max-w-3xl mx-auto py-12">
      <h2 className="text-3xl font-bold text-center text-white mb-12">
        Our Story 📖
      </h2>
      <div className="relative">
        {memories.map((memory, idx) => (
          <TimelineItem key={idx} item={memory} index={idx} />
        ))}
      </div>
    </div>
  );
};

export default TimelineComponent;