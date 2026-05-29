import React from 'react';
import { motion } from 'framer-motion';
import PlayButton from './PlayButton';

// Decorative wave bar heights for the poster atmosphere
const BARS = Array.from({ length: 40 }, (_, i) => ({
  height: 15 + Math.abs(Math.sin(i * 0.7)) * 75,
  delay: i * 0.06,
}));

export default function TrailerHero({ onPlay }) {
  return (
    <div className="trailer-frame-wrapper">
      <div className="trailer-frame-border">

        {/* Cinematic corner accents */}
        <div className="trailer-corner-tr" />
        <div className="trailer-corner-bl" />

        {/* Poster overlay — shown before play */}
        <div className="trailer-poster" onClick={onPlay}>

          {/* Dark background */}
          <div className="trailer-poster-bg" />

          {/* Animated wave bars at the bottom */}
          <div className="trailer-poster-waves">
            {BARS.map((bar, i) => (
              <span
                key={i}
                style={{
                  height: `${bar.height}%`,
                  animationDelay: `${bar.delay}s`,
                  animationDuration: `${1.8 + (i % 4) * 0.3}s`,
                }}
              />
            ))}
          </div>

          {/* Centered poster content */}
          <div className="trailer-poster-content">
            <motion.p
              className="trailer-poster-sub"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              MindWaves · 2025
            </motion.p>

            <motion.h2
              className="trailer-poster-title"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 80 }}
            >
              Riding the Waves of the Mind
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, type: 'spring', stiffness: 120 }}
            >
              <PlayButton onClick={onPlay} />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              style={{
                fontSize: '11px',
                letterSpacing: '0.2em',
                color: 'rgba(255,255,255,0.25)',
                textTransform: 'uppercase',
                marginTop: '8px',
              }}
            >
              Click to watch
            </motion.p>
          </div>
        </div>

        {/* Fallback empty iframe — hidden under poster */}
        <iframe
          className="trailer-iframe"
          src="about:blank"
          title="Trailer placeholder"
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>
    </div>
  );
}
