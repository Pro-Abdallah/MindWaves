import React from 'react';
import { motion } from 'framer-motion';

// Wave bar heights for the decorative equaliser
const BAR_HEIGHTS = [25, 45, 70, 55, 90, 60, 40, 80, 50, 35, 65, 85, 45, 30, 70, 55, 90, 40];

export default function PlayButton({ onClick }) {
  return (
    <motion.div
      className="play-btn-wrapper"
      onClick={onClick}
      whileTap={{ scale: 0.93 }}
    >
      {/* Pulsing rings */}
      <div className="play-btn-ring" />
      <div className="play-btn-ring" />
      <div className="play-btn-ring" />

      {/* Main circle */}
      <motion.div
        className="play-btn-circle"
        whileHover={{ scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        <div className="play-btn-triangle" />
      </motion.div>
    </motion.div>
  );
}
