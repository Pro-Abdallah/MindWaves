import { motion } from 'framer-motion';

export default function FinalPopup({ score, totalScenes, onRetry, onExit }) {
  let scoreClass = 'score-mixed';
  let title = 'Your Impact';
  let message = 'You are trying to help, but some choices may still hurt others without realizing it. Learning more about bipolar disorder can help you support people in a better way.';

  // Determine result tier
  // If score is heavily positive (> 2), green.
  // If score is heavily negative (< -1), red.
  // Otherwise, mixed.
  // Since score can go from -4 to +4:
  if (score >= 2) {
    scoreClass = 'score-green';
    message = 'You showed great awareness and understanding. Your choices build a better life for those around you.';
  } else if (score <= -2) {
    scoreClass = 'score-red';
    message = 'Some of your choices may cause pain to others. Try to learn more about the nature of mental illness.';
  }

  // Calculate percentage for the bar (mapping -4..4 to 0..100)
  const normalizedScore = score + totalScenes; // 0 to 8
  const maxScore = totalScenes * 2;
  const percentage = (normalizedScore / maxScore) * 100;

  return (
    <motion.div 
      className="final-popup"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      <div className="final-content">
        <motion.h2 
          className="final-title"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          {title}
        </motion.h2>

        <motion.p 
          className="final-message"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          {message}
        </motion.p>

        <motion.div 
          className="score-bar-container"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '100%', opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <motion.div 
            className={`score-bar-fill ${scoreClass}`}
            initial={{ width: '0%' }}
            animate={{ width: `${percentage}%` }}
            transition={{ delay: 2.2, duration: 1.5, ease: 'easeOut' }}
          />
        </motion.div>

        <motion.div 
          className="final-actions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
        >
          <button className="ride-btn" onClick={onRetry}>Try Again</button>
          <button className="ride-btn" onClick={onExit} style={{ background: 'transparent' }}>Exit</button>
        </motion.div>
      </div>
    </motion.div>
  );
}
