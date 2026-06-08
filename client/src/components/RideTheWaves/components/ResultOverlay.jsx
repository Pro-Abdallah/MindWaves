import { motion } from 'framer-motion';

export default function ResultOverlay({ choice, onContinue, score, totalScenes }) {
  if (!choice) return null;

  // Calculate percentage for the bar (mapping -totalScenes..totalScenes to 0..100)
  const normalizedScore = score + totalScenes; 
  const maxScore = totalScenes * 2;
  const percentage = maxScore > 0 ? Math.max(0, Math.min(100, (normalizedScore / maxScore) * 100)) : 0;

  let scoreClass = 'score-mixed';
  if (score >= 2) {
    scoreClass = 'score-green';
  } else if (score <= -2) {
    scoreClass = 'score-red';
  }

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
        
        {score !== undefined && totalScenes !== undefined && (
          <motion.div 
            className="score-bar-container"
            style={{ maxWidth: '400px', margin: '0 auto 2.5rem' }}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '100%', opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.div 
              className={`score-bar-fill ${scoreClass}`}
              initial={{ width: '0%' }}
              animate={{ width: `${percentage}%` }}
              transition={{ delay: 1, duration: 1, ease: 'easeOut' }}
            />
          </motion.div>
        )}

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
