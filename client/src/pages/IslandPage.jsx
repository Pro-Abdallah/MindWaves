import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { islandsData } from '../components/OceanWorld/islands.data'
import './IslandPage.css'

/**
 * Detailed Island presentation page.
 * Displays details for the chosen topic, complete with premium animations
 * and ocean layout matching the aesthetic guidelines.
 */
export default function IslandPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  // Find the details corresponding to the clicked ID
  const island = islandsData.find(item => item.id === parseInt(id, 10))

  if (!island) {
    return (
      <div className="ip-error-page">
        <h2>Island Not Found</h2>
        <button onClick={() => navigate('/')}>Return to Ocean</button>
      </div>
    )
  }

  return (
    <div className="ip-container">
      {/* ── Background Grid & Radial Glow ── */}
      <div className="ip-background" />

      {/* ── Main Content Container ── */}
      <main className="ip-content">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="ip-card"
        >
          {/* Tag */}
          <span className="ip-card__tag" style={{ color: island.accentColor }}>
            TOPIC 0{island.id} • {island.title.toUpperCase()}
          </span>

          {/* Title */}
          <h1 className="ip-card__title">{island.title}</h1>
          <p className="ip-card__subtitle" style={{ color: island.accentColor }}>
            {island.subtitle}
          </p>

          {/* Divider line */}
          <div className="ip-card__divider" style={{ background: `linear-gradient(90deg, transparent, ${island.color}, transparent)` }} />

          {/* Description/Main Body */}
          <section className="ip-card__body">
            {/* Intro Text */}
            <div className="ip-card__intro" style={{ borderLeftColor: island.accentColor }}>
              <p className="ip-card__intro-text">{island.introText}</p>
            </div>

            {/* Main Content Paragraphs */}
            <div className="ip-card__paragraphs">
              {island.mainContent.map((paragraph, index) => (
                <p key={index} className="ip-card__paragraph">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Divider line */}
            <div className="ip-card__divider" style={{ background: `linear-gradient(90deg, transparent, ${island.color}, transparent)`, margin: '28px 0 20px 0' }} />

            {/* Ending Quote Line */}
            <div className="ip-card__quote-wrapper">
              <span className="ip-card__quote-deco" style={{ color: island.accentColor }}>“</span>
              <p className="ip-card__quote-text" style={{ color: island.accentColor }}>
                {island.endingLine}
              </p>
            </div>
          </section>

          {/* Back button */}
          <button 
            className="ip-card__back-btn" 
            onClick={() => navigate('/')}
            style={{ borderColor: island.color }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ip-card__back-icon">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            RETURN TO OCEAN JOURNEY
          </button>
        </motion.div>
      </main>
    </div>
  )
}
