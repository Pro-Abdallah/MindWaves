import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { islandsData } from './islands.data'
import './OceanWorld.css'

const VIEWBOX = { x: 0, y: 0, w: 1600, h: 900 }

// Absolute coordinates matching the visual centers of each island in the new island map image
// Derived from: New Islands Image.jpg (2752x1536), scaled to 1600x900 SVG space
const TOOLTIP_CENTERS = {
  1: { x: 334, y: 492 },   // Still Island (green grassy island, bottom-left)
  2: { x: 401, y: 219 },   // Burning Island (volcano, top-left)
  3: { x: 752, y: 360 },   // Sunken Island (misty/foggy island, center)
  4: { x: 1017, y: 193 },  // Twin Islands (twin rocky peaks, top-right)
  5: { x: 1139, y: 389 },  // Root Island (green tree-covered island, right)
  6: { x: 1133, y: 632 },  // Lighthouse Island (rocky island with lighthouse, bottom-right)
}

// Custom coordinate paths outlining the actual visual boundaries of each island in the 1600x900 SVG grid space
const HITBOX_PATHS = {
  1: "M 185 480 L 400 450 L 475 535 L 465 650 L 355 695 L 190 685 L 100 615 L 115 520 Z",         // Still Island
  2: "M 245 120 L 440 110 L 510 195 L 490 300 L 360 340 L 215 310 L 155 210 Z",                    // Burning Island
  3: "M 490 275 L 740 260 L 820 345 L 800 445 L 650 475 L 460 425 L 400 340 Z",                    // Sunken Island
  4: "M 855 110 L 1075 80 L 1195 155 L 1175 275 L 1070 315 L 880 295 L 800 215 Z",                 // Twin Islands
  5: "M 970 280 L 1200 245 L 1345 325 L 1360 455 L 1240 500 L 1000 490 L 905 395 L 920 295 Z",     // Root Island
  6: "M 975 515 L 1145 480 L 1310 545 L 1335 665 L 1245 745 L 1035 735 L 885 660 L 895 565 Z",     // Lighthouse Island
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

      {/* ── Full Screen Interactive SVG Chart ── */}
      <div className="ow-fullscreen-wrapper">
        <svg
          viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}`}
          preserveAspectRatio="xMidYMid slice"
          className="ow-fullscreen-svg"
        >
          {/* Background image */}
          <image
            href="/New Islands Image.jpg"
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
      <AnimatePresence>
        {selectedIsland && (
          <IslandModal island={selectedIsland} onClose={handleCloseModal} />
        )}
      </AnimatePresence>
    </div>
  )
}
