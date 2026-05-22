import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { infoResources, therapyPlatforms, emergencyHotlines } from './support.data'
import './SafeHarbor.css'

function IconClose() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function IconExternalLink() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

export default function SafeHarbor() {
  const [activeModal, setActiveModal] = useState(null) // null | 'info' | 'therapy' | 'help'

  const cardRef1 = useRef(null)
  const cardRef2 = useRef(null)
  const cardRef3 = useRef(null)

  // Escape key to close active modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveModal(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Lock scroll when modal is open
  useEffect(() => {
    if (activeModal) {
      document.body.style.overflowY = 'hidden'
    } else {
      document.body.style.overflowY = ''
    }
    return () => {
      document.body.style.overflowY = ''
    }
  }, [activeModal])

  // Mouse 3D tilt effect logic
  const handleMouseMove = (e, ref) => {
    const card = ref.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    
    // Normalize coordinates to compute rotation angles
    const tiltX = (y / (rect.height / 2)) * 10 // Max 10 deg rotation on X axis
    const tiltY = -(x / (rect.width / 2)) * 10 // Max 10 deg rotation on Y axis
    
    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.04, 1.04, 1.04)`
  }

  const handleMouseLeave = (ref) => {
    const card = ref.current
    if (!card) return
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
  }

  // Floating particles background for Safe Harbor
  const particles = useRef(
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 6 + Math.random() * 10,
      duration: 10 + Math.random() * 15,
      delay: Math.random() * 6
    }))
  )

  return (
    <section className="sh-container" id="safe-harbor" aria-label="Safe Harbor Section">
      {/* ── Ambient Background Layer ── */}
      <div className="sh-ambient-bg">
        <div className="sh-glow-orb sh-glow-orb--teal" />
        <div className="sh-glow-orb sh-glow-orb--navy" />
        
        {/* Soft floating bubbles */}
        <div className="sh-particles">
          {particles.current.map(p => (
            <span
              key={p.id}
              className="sh-particle"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Main Layout Content ── */}
      <div className="sh-content">
        <div className="sh-header">
          <span className="sh-header__tag">SECTION IV</span>
          <h2 className="sh-header__title">Safe Harbor</h2>
          <p className="sh-header__subtitle">
            "A place for guidance, support, and safe emotional resources."
          </p>
        </div>

        {/* ── Three Floating Cards Grid ── */}
        <div className="sh-grid">
          {/* Card 1: Information */}
          <div
            ref={cardRef1}
            className="sh-card"
            onMouseMove={(e) => handleMouseMove(e, cardRef1)}
            onMouseLeave={() => handleMouseLeave(cardRef1)}
            onClick={() => setActiveModal('info')}
            role="button"
            tabIndex={0}
            aria-label="Get More Information resources"
            onKeyDown={(e) => e.key === 'Enter' && setActiveModal('info')}
          >
            <div className="sh-card__glow" />
            <div className="sh-card__inner">
              <span className="sh-card__badge">RESOURCES</span>
              <h3 className="sh-card__title">Get More Information</h3>
              <p className="sh-card__desc">Articles, facts & trusted resources on bipolar waves.</p>
              <span className="sh-card__cta">Explore Articles</span>
            </div>
          </div>

          {/* Card 2: Therapy */}
          <div
            ref={cardRef2}
            className="sh-card"
            onMouseMove={(e) => handleMouseMove(e, cardRef2)}
            onMouseLeave={() => handleMouseLeave(cardRef2)}
            onClick={() => setActiveModal('therapy')}
            role="button"
            tabIndex={0}
            aria-label="Seek Therapy resources"
            onKeyDown={(e) => e.key === 'Enter' && setActiveModal('therapy')}
          >
            <div className="sh-card__glow" />
            <div className="sh-card__inner">
              <span className="sh-card__badge">THERAPY</span>
              <h3 className="sh-card__title">Seek Therapy</h3>
              <p className="sh-card__desc">Professional support to help manage emotional waves over time.</p>
              <span className="sh-card__cta">Find Therapists</span>
            </div>
          </div>

          {/* Card 3: Call for Help */}
          <div
            ref={cardRef3}
            className="sh-card sh-card--emergency"
            onMouseMove={(e) => handleMouseMove(e, cardRef3)}
            onMouseLeave={() => handleMouseLeave(cardRef3)}
            onClick={() => setActiveModal('help')}
            role="button"
            tabIndex={0}
            aria-label="Call for Help emergency lines"
            onKeyDown={(e) => e.key === 'Enter' && setActiveModal('help')}
          >
            <div className="sh-card__glow" />
            <div className="sh-card__inner">
              <span className="sh-card__badge sh-card__badge--emergency">EMERGENCY</span>
              <h3 className="sh-card__title">Call for Help</h3>
              <p className="sh-card__desc">If you need immediate support, these services are available.</p>
              <span className="sh-card__cta">View Hotlines</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── MODALS: Cinematic popups with backdrop-filter blurs ── */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="sh-modal-overlay"
            onClick={() => setActiveModal(null)}
          >
            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="sh-modal"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              {/* Close Button */}
              <button
                className="sh-modal__close-btn"
                onClick={() => setActiveModal(null)}
                aria-label="Close modal"
              >
                <IconClose />
              </button>

              {/* ── Modal Contents ── */}
              
              {/* Modal 1: GET MORE INFORMATION */}
              {activeModal === 'info' && (
                <div className="sh-modal-content">
                  <span className="sh-modal__tag">RESOURCES</span>
                  <h3 className="sh-modal__title">Get More Information</h3>
                  <p className="sh-modal__subtitle">Articles, facts & trusted resources</p>

                  <div className="sh-modal__scrollable">
                    <div className="sh-info-list">
                      {infoResources.map(info => (
                        <div key={info.id} className="sh-info-item">
                          <h4 className="sh-info-item__title">{info.title}</h4>
                          <p className="sh-info-item__desc">"{info.desc}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Modal 2: SEEK THERAPY */}
              {activeModal === 'therapy' && (
                <div className="sh-modal-content">
                  <span className="sh-modal__tag">THERAPY</span>
                  <h3 className="sh-modal__title">Seek Therapy</h3>
                  <p className="sh-modal__subtitle">Professional support can help you manage emotional challenges over time</p>

                  <div className="sh-modal__scrollable">
                    <div className="sh-therapy-grid">
                      {therapyPlatforms.map(platform => (
                        <div key={platform.id} className="sh-therapy-card">
                          <div className="sh-therapy-card__meta">
                            <span className="sh-therapy-card__cat">{platform.category}</span>
                            <h4 className="sh-therapy-card__name">{platform.name}</h4>
                          </div>
                          <p className="sh-therapy-card__desc">{platform.desc}</p>
                          <a
                            href={platform.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="sh-therapy-card__link"
                            aria-label={`Visit ${platform.name} web page`}
                          >
                            <span>{platform.cta}</span>
                            <IconExternalLink />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Modal 3: CALL FOR HELP */}
              {activeModal === 'help' && (
                <div className="sh-modal-content">
                  <span className="sh-modal__tag sh-modal__tag--emergency">EMERGENCY</span>
                  <h3 className="sh-modal__title">Call for Help</h3>
                  <p className="sh-modal__subtitle">If you need immediate support, these services are available.</p>

                  <div className="sh-modal__scrollable">
                    <div className="sh-hotline-list">
                      {emergencyHotlines.map(hotline => (
                        <div key={hotline.id} className="sh-hotline-card">
                          <div className="sh-hotline-card__info">
                            <h4 className="sh-hotline-card__title">{hotline.title}</h4>
                          </div>
                          <a
                            href={`tel:${hotline.phone}`}
                            className="sh-hotline-card__phone-btn"
                            aria-label={`Call hotline number ${hotline.phone}`}
                          >
                            <span className="sh-hotline-card__phone-icon">
                              <IconPhone />
                            </span>
                            <span className="sh-hotline-card__phone-num">{hotline.phone}</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
