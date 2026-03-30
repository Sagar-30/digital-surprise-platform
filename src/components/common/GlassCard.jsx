import { motion } from 'framer-motion';

const GlassCard = ({ children, className = "", animate = true }) => {
  const Component = animate ? motion.div : 'div';
  
  return (
    <Component
      className={`glass-card p-6 ${className}`}
      initial={animate ? { opacity: 0, y: 20 } : undefined}
      animate={animate ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.5 }}
    >
      {children}
    </Component>
  );
};

export default GlassCard;