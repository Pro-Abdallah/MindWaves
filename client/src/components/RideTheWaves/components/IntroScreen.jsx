import { motion } from 'framer-motion';

export default function IntroScreen({ onStart }) {
  return (
    <motion.div 
      className="ride-intro"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <motion.h1 
        className="ride-intro-title"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
      >
        BEHIND THE WORDS
      </motion.h1>
      
      <motion.p 
        className="ride-intro-desc"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
      >
        Start this interactive game to experience real-life situations with people living with Bipolar Disorder.
      </motion.p>
      
      <motion.p 
        className="ride-intro-note"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        In each scene, you will take the role of a mother, father, coworker, or classmate. Choose what you would do in each situation and discover how supportive and understanding your responses are.
      </motion.p>
      
      <motion.button 
        className="ride-btn"
        onClick={onStart}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Start
      </motion.button>
    </motion.div>
  );
}
