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
            TOPIC 0{island.id} • BIPOLAR KNOWLEDGE
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
            <p className="ip-card__desc">{island.description}</p>
            
            <div className="ip-card__pdf-alert">
              <svg className="ip-card__pdf-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <div>
                <h4 className="ip-card__pdf-title">Research Documents Coming Soon</h4>
                <p className="ip-card__pdf-sub">The full clinical education and PDF content will be integrated inside this panel in the next stage.</p>
              </div>
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
