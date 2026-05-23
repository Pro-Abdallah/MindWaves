import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import OceanBackground from './components/OceanBackground'
import StorySection from './components/StorySection'
import { STORIES } from './data/stories'
import './MessagesFromTheSea.css'

/**
 * MessagesFromTheSea
 * ──────────────────
 * Section entry point. Renders:
 *   - Animated ocean canvas background
 *   - Cinematic section header (scroll-revealed)
 *   - 4 Full-height sequential story sections
 *   - Scroll-triggered inline story popups
 */
export default function MessagesFromTheSea() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-60px' })

  return (
    <section
      id="messages-from-the-sea"
      className="mfts-section"
      ref={sectionRef}
      aria-label="Messages From the Sea"
    >
      {/* Living ocean canvas */}
      <OceanBackground />

      {/* Horizon fog */}
      <div className="mfts-horizon" />

      {/* Content */}
      <div className="mfts-inner">

        {/* ── Section header (Intro) ── */}
        <div className="mfts-header" ref={headerRef}>
          <motion.div
            className="mfts-eyebrow"
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="mfts-wave-icon">〰</span>
            Messages From the Sea
            <span className="mfts-wave-icon">〰</span>
          </motion.div>

          <motion.h2
            className="mfts-title"
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            The ocean carries stories
            <br />
            <em>no one dared speak aloud.</em>
          </motion.h2>

          <motion.p
            className="mfts-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.3 }}
          >
            Scroll down to uncover the four messages
            <br />
            that drifted here across the water.
          </motion.p>

          {/* The 4 floating transparent bottles in the header */}
          <div className="hero-bottles-row">
            <img src="/bottle-audio.png" alt="Audio Story Bottle" className="hero-bottle-item" style={{ transform: 'translateY(10px) rotate(-5deg)' }} />
            <img src="/bottle-video.png" alt="Video Story Bottle" className="hero-bottle-item" style={{ transform: 'translateY(-10px) rotate(3deg)' }} />
            <img src="/bottle-comic.png" alt="Comic Story Bottle" className="hero-bottle-item" style={{ transform: 'translateY(20px) rotate(-2deg)' }} />
            <img src="/bottle-text.png" alt="Text Story Bottle" className="hero-bottle-item" style={{ transform: 'translateY(-5px) rotate(5deg)' }} />
          </div>
        </div>

        {/* ── Full-Height Sequential Story Sections ── */}
        <div className="mfts-stories-container">
          {STORIES.map((story, i) => (
            <StorySection
              key={story.id}
              story={story}
              index={i}
            />
          ))}
        </div>

        {/* Deep ocean below cards */}
        <div className="mfts-deep-ocean" />

        {/* ── Ambient floating particles ── */}
        <div className="mfts-ambient-particles" aria-hidden="true">
          {Array.from({ length: 14 }).map((_, i) => (
            <motion.div
              key={i}
              className="mfts-ambient-dot"
              style={{
                left: `${5 + Math.random() * 90}%`,
                top: `${10 + Math.random() * 80}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.08, 0.35, 0.08],
              }}
              transition={{
                duration: 4 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 6,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
