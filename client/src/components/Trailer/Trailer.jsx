import React from 'react';
import { motion } from 'framer-motion';
import OceanBackground from './components/OceanBackground';
import TrailerHero from './components/TrailerHero';
import './styles/trailer.css';

// Stagger parent for entering elements
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

export default function Trailer() {
  return (
    <section className="trailer-section">
      {/* ── Atmospheric Background ── */}
      <OceanBackground />

      {/* ── Main Content ── */}
      <motion.div
        className="trailer-ui"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Eyebrow */}
        <motion.p className="trailer-eyebrow" variants={itemVariants}>
          Official Trailer
        </motion.p>

        {/* Headline */}
        <motion.h1 className="trailer-headline" variants={itemVariants}>
          Marfa' <br />
          <span>Harbor</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p className="trailer-tagline" variants={itemVariants}>
          A docudrama exploring the emotional journey of Bipolar Disorder through real stories, expert insights, and cinematic storytelling.
        </motion.p>

        {/* Cinematic Video Frame */}
        <motion.div
          variants={itemVariants}
          style={{ width: '100%' }}
        >
          <TrailerHero />
        </motion.div>

        {/* Bottom credits */}
        <motion.div className="trailer-credits" variants={itemVariants}>
          <span className="trailer-credit-item">MindWaves</span>
          <span className="trailer-credit-dot" />
          <span className="trailer-credit-item">2026</span>
          <span className="trailer-credit-dot" />
          <span className="trailer-credit-item">Graduation Project</span>
          <span className="trailer-credit-dot" />
          <span className="trailer-credit-item">Bipolar Disorder Awareness</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
