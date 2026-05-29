import React from 'react';
import { motion } from 'framer-motion';

export default function OceanBackground() {
  return (
    <div className="trailer-ocean-bg">
      {/* Real ocean photo — blurred and darkened */}
      <div
        className="trailer-ocean-img"
        style={{ backgroundImage: `url('/realistic-ocean-bg.png')` }}
      />

      {/* Dark cinematic gradient veil */}
      <div className="trailer-ocean-gradient" />

      {/* Ambient teal glow 1 — top-left */}
      <motion.div
        className="trailer-glow trailer-glow-1"
        animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.06, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Ambient teal glow 2 — bottom-right */}
      <motion.div
        className="trailer-glow trailer-glow-2"
        animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.04, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      {/* Center subtle pulse */}
      <motion.div
        className="trailer-glow trailer-glow-3"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* Film-grain scanlines */}
      <div className="trailer-scanlines" />
    </div>
  );
}
