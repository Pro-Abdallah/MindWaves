import { useState, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { islandsData } from './islands.data'
import '../../styles/SectionLabel.css'
import './OceanWorld.css'

const VIEWBOX = { x: 0, y: 0, w: 1600, h: 900 }

// Absolute coordinates matching the visual centers of each island in the new island map image
// Derived from: New Islands Image.jpg (2752x1536), scaled to 1600x900 SVG space
const TOOLTIP_CENTERS = {
  1: { x: 470, y: 560 },   // Still Island (green grassy island, bottom-left)
  2: { x: 450, y: 280 },   // Burning Island (volcano, top-left)
  3: { x: 770, y: 410 },   // Sunken Island (misty/foggy island, center)
  4: { x: 985, y: 265 },   // Twin Islands (twin rocky peaks, top-right)
  5: { x: 1100, y: 500 },  // Root Island (green tree-covered island, right)
  6: { x: 1035, y: 705 },  // Lighthouse Island (rocky island with lighthouse, bottom-right)
}

// Custom coordinate paths outlining the actual visual boundaries of each island in the 1600x900 SVG grid space
const HITBOX_PATHS = {
  1: "M 321 548 L 536 518 L 611 603 L 601 718 L 491 763 L 326 753 L 236 683 L 251 588 Z",         // Still Island
  2: "M 294 181 L 489 171 L 559 256 L 539 361 L 409 401 L 264 371 L 204 271 Z",                    // Burning Island
  3: "M 586 350 L 761 340 L 817 399 L 803 469 L 698 490 L 565 455 L 523 396 Z",                    // Sunken Island
  4: "M 823 182 L 1043 152 L 1163 227 L 1143 347 L 1038 387 L 848 367 L 768 287 Z",                 // Twin Islands
  5: "M 931 391 L 1161 356 L 1306 436 L 1321 566 L 1201 611 L 961 601 L 866 506 L 881 406 Z",     // Root Island
  6: "M 877 588 L 1047 553 L 1212 618 L 1237 738 L 1147 818 L 937 808 L 787 733 L 797 638 Z",     // Lighthouse Island
}

/* ─────────────────────────────────────────────
   Island Modal — cinematic pop-up overlay
───────────────────────────────────────────── */
function IslandModal({ island, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <motion.div
      className="ow-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${island.title} island details`}
    >
      <motion.div
        className="ow-modal-card"
        initial={{ opacity: 0, scale: 0.88, y: 60 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 40 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{ '--island-accent': island.accentColor, '--island-color': island.color }}
      >
        {/* ── Header: island image with gradient overlay ── */}
        <div className="ow-modal-header">
          <div
            className="ow-modal-header-bg"
            style={{ backgroundImage: `url(${island.heroImage})` }}
          />
          <div
            className="ow-modal-header-gradient"
            style={{ background: `linear-gradient(to bottom, rgba(2,12,30,0.05) 0%, ${island.color}f0 100%)` }}
          />
          <div className="ow-modal-header-content">
            <span className="ow-modal-subtitle">{island.subtitle}</span>
            <h2 className="ow-modal-title">{island.title}</h2>
          </div>
        </div>

        {/* ── Close button ── */}
        <button className="ow-modal-close" onClick={onClose} aria-label="Close island panel">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* ── Body ── */}
        <div className="ow-modal-body">
          {/* Intro text */}
          <p className="ow-modal-intro">{island.introText}</p>

          {/* Accent divider */}
          <div className="ow-modal-divider" />

          {/* Numbered fact blocks */}
          <div className="ow-modal-facts">
            {island.mainContent.map((text, i) => (
              <motion.div
                key={i}
                className="ow-modal-fact"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.08, duration: 0.35, ease: 'easeOut' }}
              >
                <span className="ow-modal-fact-num">{String(i + 1).padStart(2, '0')}</span>
                <p className="ow-modal-fact-text">{text}</p>
              </motion.div>
            ))}
          </div>

          {/* Ending quote */}
          {island.endingLine && (
            <motion.blockquote
              className="ow-modal-ending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + island.mainContent.length * 0.08, duration: 0.4 }}
            >
              "{island.endingLine}"
            </motion.blockquote>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   OceanWorld — main interactive map
───────────────────────────────────────────── */
export default function OceanWorld() {
  const [hoveredIdx, setHoveredIdx]     = useState(null)
  const [selectedIsland, setSelectedIsland] = useState(null)

  const handleIslandClick = useCallback((island) => {
    setSelectedIsland(island)
  }, [])

  const handleCloseModal = useCallback(() => {
    setSelectedIsland(null)
  }, [])

  return (
    <div className="ow-container" role="region" aria-label="Understanding The Waves ocean world">

      {/* ── Section label at the top ── */}
      <div className="sh-board-label">
        <h2 className="sh-board-label__title">Every journey begins with understanding</h2>
        {/* <p className="sh-board-label__desc">
          Each island reveals a different side of bipolar disorder. Click to explore.
        </p> */}
        <p className="sh-board-label__sub">
          Each island reveals a different side of bipolar disorder. Click to explore.
        </p>
      </div>

      {/* ── Full Screen Interactive SVG Chart ── */}
      <div className="ow-fullscreen-wrapper">
        <svg
          viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}`}
          preserveAspectRatio="xMidYMid slice"
          className="ow-fullscreen-svg"
        >
          {/* Background image */}
          <image
            href="/Island New Expand.png"
            x="0" y="0" width="1600" height="900"
            style={{
              filter: (hoveredIdx !== null || selectedIsland) ? 'brightness(0.35) saturate(0.8)' : 'none',
              transition: 'filter 0.4s ease',
            }}
          />

          {/* Invisible interactive hitboxes */}
          {islandsData.map((island, idx) => {
            const pathData = HITBOX_PATHS[island.id]
            if (!pathData) return null
            return (
              <path
                key={island.id}
                d={pathData}
                className="ow-hitbox-path"
                style={{ '--accent-color': island.accentColor || '#1fe5d5' }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => handleIslandClick(island)}
              />
            )
          })}

          {/* Sonar pulse rings on each island center */}
          {islandsData.map((island, idx) => {
            const center = TOOLTIP_CENTERS[island.id]
            if (!center) return null
            const isHovered = hoveredIdx === idx
            const hasHover  = hoveredIdx !== null
            return (
              <g
                key={`sonar-${island.id}`}
                style={{
                  '--accent-color': island.accentColor || '#1fe5d5',
                  opacity: hasHover ? (isHovered ? 1.0 : 0.1) : 0.75,
                  transition: 'opacity 0.4s ease',
                }}
              >
                <circle cx={center.x} cy={center.y} className="ow-sonar-ring" />
                <circle cx={center.x} cy={center.y} className="ow-sonar-ring ow-sonar-ring--delay" />
                <circle cx={center.x} cy={center.y} className="ow-sonar-dot" />
              </g>
            )
          })}

          {/* Hover tooltip (only when no modal is open) */}
          <AnimatePresence>
            {hoveredIdx !== null && !selectedIsland && (() => {
              const island = islandsData[hoveredIdx]
              const center = TOOLTIP_CENTERS[island.id]
              if (!center) return null

              const width  = 200
              const height = 42
              // Clamp so tooltip doesn't overflow SVG viewbox
              const rawX   = center.x - width / 2
              const rawY   = center.y - height - 18
              const x = Math.max(8, Math.min(rawX, VIEWBOX.w - width - 8))
              const y = Math.max(8, rawY)

              return (
                <foreignObject
                  key={`tooltip-${island.id}`}
                  x={x} y={y}
                  width={width} height={height}
                  style={{ pointerEvents: 'none', overflow: 'visible' }}
                >
                  <motion.div
                    className="ow-hotspot-tooltip"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    style={{ '--accent-color': island.accentColor || '#1fe5d5' }}
                  >
                    <h3 className="ow-tooltip-title">{island.title}</h3>
                  </motion.div>
                </foreignObject>
              )
            })()}
          </AnimatePresence>
        </svg>
      </div>

      {/* ── Island Modal popup ── */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedIsland && (
            <IslandModal island={selectedIsland} onClose={handleCloseModal} />
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  )
}
