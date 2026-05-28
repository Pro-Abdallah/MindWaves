import { motion } from 'framer-motion';

export default function ResultOverlay({ choice, onContinue }) {
  if (!choice) return null;

  return (
    <motion.div 
      className="result-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="result-content">
        <motion.p 
          className="result-feedback"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{
            color: choice.isSupportive ? '#a3d9e8' : '#e0e0e0',
            textShadow: choice.isSupportive ? '0 0 20px rgba(163, 217, 232, 0.3)' : 'none'
          }}
        >
          {choice.feedback}
        </motion.p>
        
        <motion.button 
          className="ride-btn"
          onClick={onContinue}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Continue
        </motion.button>
      </div>
    </motion.div>
  );
}
