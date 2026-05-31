import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { islandsData } from '../components/OceanWorld/islands.data'
import './IslandPage.css'

/**
 * High-Performance GPU Glide Timeline
 *  0 ms     — Page fades in (PageLayout)
 *  400 ms   — Big title fades IN (centered via transform translate3d)
 *  4000 ms  — Title glides to top-left and scales down (pure GPU transform, zero layout repaint)
 *  4400 ms  — Highlight intro text appears (centered)
 *  10400 ms — Highlight fades, full paragraph + quote + button appear
 */
export default function IslandPage() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [phase, setPhase]               = useState('title')   // title | content
  const [contentPhase, setContentPhase] = useState('hidden')  // hidden | highlight | full
  const [isVisible, setIsVisible]       = useState(false)

  const island = islandsData.find(i => i.id === parseInt(id, 10))

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    // Micro-delay to trigger native CSS fade-in transition
    const t0 = setTimeout(() => setIsVisible(true), 50)

    // 4 s: switch from big centered title → mini badge
    const t1 = setTimeout(() => {
      setPhase('content')
      document.body.style.overflow = ''
    }, 4000)

    // 4.4 s: show highlight intro text
    const t2 = setTimeout(() => setContentPhase('highlight'), 4400)

    // 10.4 s: switch to full content
    const t3 = setTimeout(() => setContentPhase('full'), 10400)

    return () => {
      clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3)
      document.body.style.overflow = ''
    }
  }, [])

  if (!island) {
    return (
      <div className="ip-error-page">
        <h2>Island Not Found</h2>
        <button onClick={() => navigate('/understanding-the-waves')}>Return to Ocean</button>
      </div>
    )
  }

  const fullParagraph = island.mainContent.join(' ')
  const isContent     = phase === 'content'

  return (
    <div className="ip-page">
      {/* Hero background — fixed, uniformly dimmed */}
      <div className="ip-hero-bg" style={{ backgroundImage: `url(${island.heroImage})` }} />
      <div className="ip-hero-dim" />

      {/* ── Title block — GPU-accelerated translate3d glide ── */}
      <div
        className={`ip-title-block ${isVisible ? 'ip-title-block--visible' : ''} ${isContent ? 'ip-title-block--mini' : ''}`}
      >
        <span className="ip-title__tag" style={{ color: island.accentColor }}>
          TOPIC 0{island.id}&nbsp;·&nbsp;{island.subtitle.toUpperCase()}
        </span>

        <h1 className="ip-title__heading">
          {island.title}
        </h1>

        <div className="ip-title__line" style={{ background: island.accentColor }} />
      </div>

      {/* Narrative content (Centered) */}
      <div className="ip-content-wrap">
        <div className="ip-content">
          <AnimatePresence mode="wait">
            {(contentPhase === 'highlight' || contentPhase === 'full') && (
              <motion.div
                key="highlight"
                className="ip-highlight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              >
                <div className="ip-highlight__bar" style={{ background: island.accentColor }} />
                <p className="ip-highlight__text">{island.introText}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {contentPhase === 'full' && (
              <motion.div
                key="full"
                className="ip-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              >
                <p className="ip-full__paragraph">{fullParagraph}</p>
                <div
                  className="ip-full__divider"
                  style={{ background: `linear-gradient(90deg, transparent, ${island.color}99, transparent)` }}
                />
                <div className="ip-full__quote">
                  <span className="ip-full__quote-mark" style={{ color: island.accentColor }}>"</span>
                  <p className="ip-full__quote-text" style={{ color: island.accentColor }}>
                    {island.endingLine}
                  </p>
                </div>
                <div className="ip-full__footer">
                  <button
                    id="ip-back-btn"
                    className="ip-back-btn"
                    onClick={() => navigate('/understanding-the-waves')}
                    style={{ '--accent': island.accentColor, '--accent-dim': island.color }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round" className="ip-back-btn__icon">
                      <line x1="19" y1="12" x2="5" y2="12" />
                      <polyline points="12 19 5 12 12 5" />
                    </svg>
                    RETURN TO OCEAN JOURNEY
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
