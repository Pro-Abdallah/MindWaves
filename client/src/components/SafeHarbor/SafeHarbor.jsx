import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { infoResources, therapyPlatforms, emergencyHotlines } from './support.data'
import './SafeHarbor.css'

const bulletinBoard = '/safe-harbor-bulletin-board.png'


/* ── SVG Icons ── */
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

/* ── Note hotspot config: positions measured precisely from the image ── */
const NOTES = [
  {
    id: 'therapy',
    label: 'Seek Therapy',
    top:    '37%',
    left:   '9%',
    width:  '25%',
    height: '36%',
    rotate: '-2deg',
    thumbtack: '#e04040',
  },
  {
    id: 'info',
    label: 'Get More Information',
    top:    '32%',
    left:   '35%',
    width:  '28%',
    height: '41%',
    rotate: '0deg',
    thumbtack: '#e07830',
  },
  {
    id: 'help',
    label: 'Call for Help',
    top:    '35%',
    left:   '62%',
    width:  '26%',
    height: '36%',
    rotate: '2deg',
    thumbtack: '#3a7bc8',
  },
]

export default function SafeHarbor() {
  const [activeNote, setActiveNote] = useState(null) // null | 'therapy' | 'info' | 'help'
  const boardRef = useRef(null)

  const open  = (id) => setActiveNote(id)
  const close = ()   => setActiveNote(null)

  return (
    <section className="sh-root" id="safe-harbor" aria-label="Safe Harbor Section">

      {/* ── Full-page bulletin board ── */}
      <div className="sh-board-wrap" ref={boardRef}>
        <img
          src={bulletinBoard}
          alt="Wooden bulletin board with three paper notes on a coastal dock"
          className="sh-board-img"
          draggable={false}
        />

        {/* ── Clickable note hotspots overlaid on board ── */}
        {NOTES.map((note) => (
          <button
            key={note.id}
            className="sh-note-hotspot"
            style={{
              top: note.top,
              left: note.left,
              width: note.width,
              height: note.height,
              transform: `rotate(${note.rotate})`,
            }}
            onClick={() => open(note.id)}
            aria-label={`Open ${note.label} panel`}
            title={note.label}
          >
            {/* Invisible but keyboard-focusable — hover shows a ripple */}
            <span className="sh-note-ripple" />
          </button>
        ))}

        {/* ── Section label at the top ── */}
        <div className="sh-board-label">
          <span className="sh-board-label__tag">SECTION IV</span>
          <h2 className="sh-board-label__title">Safe Harbor</h2>
        </div>

        {/* ── Hint text at the bottom ── */}
        <p className="sh-board-hint">Tap a note to open it</p>
      </div>

      {/* ── Paper scroll overlay (modal) ── */}
      <AnimatePresence>
        {activeNote && (
          <motion.div
            className="sh-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.div
              className="sh-paper"
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              exit={{ scaleY: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              style={{ originY: 0 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={`${activeNote} details`}
            >
              {/* Paper top torn edge */}
              <div className="sh-paper__torn-top" />

              {/* Thumbtack pin at top */}
              <div
                className="sh-paper__pin"
                style={{ background: NOTES.find(n => n.id === activeNote)?.thumbtack }}
              />

              {/* Close button */}
              <button className="sh-paper__close" onClick={close} aria-label="Close paper">
                <IconClose />
              </button>

              {/* Paper body */}
              <div className="sh-paper__body">

                {/* ── THERAPY CONTENT ── */}
                {activeNote === 'therapy' && (
                  <>
                    <span className="sh-paper__stamp sh-paper__stamp--therapy">THERAPY</span>
                    <h3 className="sh-paper__title">Seek Therapy</h3>
                    <p className="sh-paper__intro">Professional support to help manage emotional waves over time.</p>
                    <div className="sh-paper__scroll">
                      <div className="sh-therapy-grid">
                        {therapyPlatforms.map(platform => (
                          <div key={platform.id} className="sh-therapy-card">
                            <span className="sh-therapy-card__cat">{platform.category}</span>
                            <h4 className="sh-therapy-card__name">{platform.name}</h4>
                            <p className="sh-therapy-card__desc">{platform.desc}</p>
                            <a
                              href={platform.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="sh-therapy-card__link"
                              aria-label={`Visit ${platform.name}`}
                            >
                              <span>{platform.cta}</span>
                              <IconExternalLink />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* ── INFORMATION CONTENT ── */}
                {activeNote === 'info' && (
                  <>
                    <span className="sh-paper__stamp sh-paper__stamp--info">RESOURCES</span>
                    <h3 className="sh-paper__title">Get More Information</h3>
                    <p className="sh-paper__intro">Articles, facts &amp; trusted resources on bipolar waves.</p>
                    <div className="sh-paper__scroll">
                      <div className="sh-info-list">
                        {infoResources.map(info => (
                          <div key={info.id} className="sh-info-item">
                            <h4 className="sh-info-item__title">{info.title}</h4>
                            <p className="sh-info-item__desc">"{info.desc}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* ── EMERGENCY CONTENT ── */}
                {activeNote === 'help' && (
                  <>
                    <span className="sh-paper__stamp sh-paper__stamp--emergency">EMERGENCY</span>
                    <h3 className="sh-paper__title">Call for Help</h3>
                    <p className="sh-paper__intro">If you need immediate support, these services are available.</p>
                    <div className="sh-paper__scroll">
                      <div className="sh-hotline-list">
                        {emergencyHotlines.map(hotline => (
                          <div key={hotline.id} className="sh-hotline-card">
                            <p className="sh-hotline-card__title">{hotline.title}</p>
                            <a
                              href={`tel:${hotline.phone}`}
                              className="sh-hotline-card__phone-btn"
                              aria-label={`Call ${hotline.phone}`}
                            >
                              <span className="sh-hotline-card__phone-icon"><IconPhone /></span>
                              <span className="sh-hotline-card__phone-num">{hotline.phone}</span>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

              </div>

              {/* Paper bottom torn edge */}
              <div className="sh-paper__torn-bottom" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
