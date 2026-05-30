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
          <div className="hero-bottles-row" style={{ position: 'relative' }}>
            
            {/* Unified Sea Surface under all bottles */}
            <div style={{
              position: 'absolute',
              bottom: '5%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '110%',
              height: '100px',
              zIndex: 0,
            }}>
              {/* Deep water shadow to ground them */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at center, rgba(3, 22, 40, 0.9) 0%, rgba(2, 14, 24, 0.6) 50%, transparent 75%)',
                borderRadius: '50%',
                transform: 'rotateX(75deg)',
                filter: 'blur(15px)'
              }} />
              {/* Subtle water reflection / surface line */}
              <motion.div 
                animate={{ scaleX: [1, 1.05, 1], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  inset: '30% 5%',
                  background: 'radial-gradient(ellipse at center, rgba(145, 191, 246, 0.2) 0%, transparent 70%)',
                  borderRadius: '50%',
                  transform: 'rotateX(75deg)',
                  filter: 'blur(8px)'
                }}
              />
              <motion.div 
                animate={{ scaleX: [0.95, 1.02, 0.95], opacity: [0.4, 0.1, 0.4] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  inset: '45% 15%',
                  borderTop: '1px solid rgba(145, 191, 246, 0.4)',
                  borderRadius: '50%',
                  transform: 'rotateX(75deg)',
                }}
              />
            </div>

            {/* Bottles */}
            {[
              { type: 'audio', y: 10, r: -5 },
              { type: 'video', y: -10, r: 3 },
              { type: 'comic', y: 20, r: -2 },
              { type: 'text', y: -5, r: 5 },
            ].map((bottle, i) => (
              <motion.img 
                key={i}
                src={`/bottle-${bottle.type}.png`} 
                alt={`${bottle.type} Story Bottle`} 
                className="hero-bottle-item" 
                animate={{ 
                  y: [bottle.y - 8, bottle.y + 8, bottle.y - 8],
                  rotate: [bottle.r, bottle.r + (i % 2 === 0 ? 2 : -2), bottle.r]
                }}
                transition={{ duration: 5 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'relative', zIndex: 1, transform: `translateY(${bottle.y}px) rotate(${bottle.r}deg)` }} 
              />
            ))}
          </div>

          {/* Scroll Cue */}
          <motion.div 
            className="mfts-scroll-cue"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            style={{ marginBottom: '3vh' }}
          >
            <span>Scroll</span>
            <motion.div 
              className="mfts-scroll-line"
              animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0], transformOrigin: ['top', 'top', 'bottom'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              animate={{ y: [0, 5, 0], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ color: 'rgba(145, 191, 246, 0.9)', marginTop: '-2px' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </motion.div>
          </motion.div>

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
