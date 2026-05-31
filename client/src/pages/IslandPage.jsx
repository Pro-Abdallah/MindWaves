import { useParams, useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { islandsData } from '../components/OceanWorld/islands.data'
import './IslandPage.css'

/**
 * Detailed Island presentation page.
 * Cinematic hero image with zoom-in effect, frameless flowing content.
 */
export default function IslandPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const heroRef = useRef(null)

  const island = islandsData.find(item => item.id === parseInt(id, 10))

  // Parallax scroll effect on the hero image
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroScale    = useTransform(scrollYProgress, [0, 1], [1.12, 1.22])
  const heroOpacity  = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const heroY        = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])

  if (!island) {
    return (
      <div className="ip-error-page">
        <h2>Island Not Found</h2>
        <button onClick={() => navigate('/understanding-the-waves')}>Return to Ocean</button>
      </div>
    )
  }

  return (
    <div className="ip-page">

      {/* ── HERO SECTION ── */}
      <section className="ip-hero" ref={heroRef}>
        {/* Zoom-in background image */}
        <motion.div
          className="ip-hero__img"
          style={{
            backgroundImage: `url(${island.heroImage})`,
            scale: heroScale,
            y: heroY,
          }}
        />

        {/* Dark gradient overlays */}
        <div className="ip-hero__overlay-top" />
        <div className="ip-hero__overlay-bottom" />

        {/* Hero text — fades as you scroll */}
        <motion.div className="ip-hero__text" style={{ opacity: heroOpacity }}>
          <motion.span
            className="ip-hero__tag"
            style={{ color: island.accentColor }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            TOPIC 0{island.id} &nbsp;·&nbsp; {island.subtitle.toUpperCase()}
          </motion.span>

          <motion.h1
            className="ip-hero__title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {island.title}
          </motion.h1>

          <motion.div
            className="ip-hero__line"
            style={{ background: island.accentColor }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          />
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="ip-hero__scroll-cue"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <div className="ip-hero__scroll-arrow" style={{ borderColor: island.accentColor }} />
          <span style={{ color: island.accentColor }}>SCROLL</span>
        </motion.div>
      </section>

      {/* ── CONTENT SECTION ── */}
      <section className="ip-content">

        {/* Ambient background glow */}
        <div
          className="ip-content__glow"
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${island.color}22 0%, transparent 70%)` }}
        />

        {/* Intro block */}
        <motion.div
          className="ip-content__intro"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
        >
          <div className="ip-content__intro-bar" style={{ background: island.accentColor }} />
          <p className="ip-content__intro-text">{island.introText}</p>
        </motion.div>

        {/* Divider */}
        <div
          className="ip-content__divider"
          style={{ background: `linear-gradient(90deg, transparent, ${island.color}88, transparent)` }}
        />

        {/* Main paragraphs */}
        <div className="ip-content__body">
          {island.mainContent.map((paragraph, index) => (
            <motion.p
              key={index}
              className="ip-content__paragraph"
              initial={{ opacity: 0, x: index % 2 === 0 ? -24 : 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
            >
              {paragraph}
            </motion.p>
          ))}
        </div>

        {/* Divider */}
        <div
          className="ip-content__divider"
          style={{ background: `linear-gradient(90deg, transparent, ${island.color}88, transparent)` }}
        />

        {/* Ending quote */}
        <motion.div
          className="ip-content__quote"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9 }}
        >
          <span className="ip-content__quote-mark" style={{ color: island.accentColor }}>"</span>
          <p className="ip-content__quote-text" style={{ color: island.accentColor }}>
            {island.endingLine}
          </p>
        </motion.div>

        {/* Back button */}
        <motion.div
          className="ip-content__footer"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
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
        </motion.div>

      </section>
    </div>
  )
}
