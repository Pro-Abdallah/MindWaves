import React from 'react';
import { motion } from 'framer-motion';

export default function OceanBackground({ isBlurred = false }) {
  return (
    <div className="bottle-ocean-bg">
      {/* Base Ocean Image, darkened and conditionally blurred */}
      <div 
        className="bottle-ocean-image" 
        style={{ 
          backgroundImage: `url('/realistic-ocean-bg.png')`,
          filter: isBlurred ? 'blur(15px)' : 'none',
          transition: 'filter 1s ease-in-out'
        }}
      />
      
      {/* Moody Gradients to create the deep sea feel */}
      <div className="bottle-ocean-gradient" />
      
      {/* Ambient Moving Lights (Glows) */}
      <motion.div 
        className="ambient-glow glow-1"
        animate={{ 
          x: ['-5%', '5%', '-5%'], 
          y: ['-5%', '5%', '-5%'],
          opacity: [0.3, 0.6, 0.3] 
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      <motion.div 
        className="ambient-glow glow-2"
        animate={{ 
          x: ['5%', '-5%', '5%'], 
          y: ['5%', '-5%', '5%'],
          opacity: [0.2, 0.5, 0.2] 
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
