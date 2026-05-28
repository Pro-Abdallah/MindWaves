import { motion } from 'framer-motion';

export default function ProgressWave({ current, total }) {
  const percentage = (current / total) * 100;

  return (
    <div className="progress-container">
      <motion.div 
        className="progress-fill"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      />
    </div>
  );
}
