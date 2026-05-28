import { motion } from 'framer-motion';

export default function ChoiceCard({ choice, onSelect, disabled }) {
  return (
    <motion.div 
      className="choice-card"
      onClick={() => !disabled && onSelect(choice)}
      whileHover={!disabled ? { scale: 1.03 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      style={{
        pointerEvents: disabled ? 'none' : 'auto',
        opacity: disabled ? 0.6 : 1
      }}
    >
      <div className="choice-text">{choice.text}</div>
    </motion.div>
  );
}
