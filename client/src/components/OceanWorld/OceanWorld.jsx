import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { islandsData } from './islands.data'
import './OceanWorld.css'

const VIEWBOX = { x: 0, y: 0, w: 1600, h: 900 }

// Absolute coordinates matching the visual centers of the actual islands in the chart picture
const TOOLTIP_CENTERS = {
  1: { x: 224, y: 441 },   // Still Island (Snowy mountains center)
  2: { x: 560, y: 261 },   // Burning Island (Volcano crater center)
  3: { x: 576, y: 630 },   // Sunken Island (Castle ruins center)
  4: { x: 1040, y: 252 },  // Twin Islands (Stone arch center)
  5: { x: 1136, y: 558 },  // Root Island (Giant tree canopy center)
  6: { x: 1456, y: 405 },  // Lighthouse Island (Lighthouse deck center)
}

// Custom coordinate paths outlining the actual visual boundaries of each island in the 1600x900 SVG grid space
const HITBOX_PATHS = {
  1: "M 224 306 L 384 405 L 432 468 L 368 540 L 224 576 L 64 540 L 16 468 L 80 369 Z", // Still Island snowy outline
  2: "M 544 153 L 688 216 L 768 297 L 688 378 L 560 414 L 416 378 L 352 288 L 416 207 Z", // Burning Island volcano outline
  3: "M 560 495 L 704 567 L 784 666 L 720 738 L 576 774 L 448 738 L 384 630 L 448 540 Z", // Sunken Island ruins outline
  4: "M 1040 171 L 1184 198 L 1248 252 L 1152 324 L 1008 351 L 864 324 L 816 252 L 896 189 Z", // Twin Islands arch outline
  5: "M 1136 378 L 1280 459 L 1344 549 L 1408 648 L 1280 738 L 1136 846 L 992 738 L 928 639 L 880 540 L 992 450 Z", // Root Island tree canopy outline
  6: "M 1456 171 L 1504 252 L 1552 324 L 1600 405 L 1584 585 L 1504 774 L 1392 612 L 1328 477 L 1408 315 L 1424 252 Z", // Lighthouse Island outline
}

/**
 * Interactive Ocean World component — Aspect-Ratio Preserving Full Screen SVG Hitbox Chart.
 * 
 * Takes the absolute full width and height of the page. Uses a professional SVG coordinate system
 * with preserveAspectRatio="xMidYMid slice" to scale and cover the screen dynamically.
 * 
 * Hitboxes are 100% invisible by default to display the raw beautiful picture itself. 
 * Clicking an island navigates you there. Tooltips have been removed on hover.
 * 
 * A majestic 2D vector galleon sailboat (rendered big, centered initially at 800x450, and 
 * completely steady/not floating) sails fast across the screen toward the clicked island,
 * trailing bioluminescent foam bubbles, before zooming in ("zone in") to transition.
 */
export default function OceanWorld() {
  const navigate = useNavigate()
  const [hoveredIdx, setHoveredIdx] = useState(null)
  const [transitioning, setTransitioning] = useState(false)
  const [zoomOrigin, setZoomOrigin] = useState('50% 50%')
  const [isZoomed, setIsZoomed] = useState(false)

  // Zoom-out transition on mount
  useEffect(() => {
    const prevZoom = sessionStorage.getItem('mw-prev-zoom')
    if (prevZoom) {
      setZoomOrigin(prevZoom)
      setIsZoomed(true)
      sessionStorage.removeItem('mw-prev-zoom')
    }
    
    // Smooth zoom out from active zoom/mount state on load
    const timer = setTimeout(() => {
      setIsZoomed(false)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  const handleIslandClick = (island) => {
    if (transitioning) return

    const coords = TOOLTIP_CENTERS[island.id]
    let origin = '50% 50%'
    if (coords) {
      const leftPct = ((coords.x - VIEWBOX.x) / VIEWBOX.w) * 100
      const topPct = ((coords.y - VIEWBOX.y) / VIEWBOX.h) * 100
      origin = `${leftPct}% ${topPct}%`
    }
    
    // Save zoom origin in session storage for the zone-out animation on return!
    sessionStorage.setItem('mw-prev-zoom', origin)
    
    setZoomOrigin(origin)
    setIsZoomed(true)
    setTransitioning(true)
    
    // Transition route once the zoom completes
    setTimeout(() => {
      navigate(island.route)
    }, 750)
  }

  return (
    <div className="ow-container" role="region" aria-label="Understanding The Waves ocean world">
      {/* ── Full Screen Interactive SVG Chart Container ── */}
      <div className="ow-fullscreen-wrapper">
        <svg 
          viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}`} 
          preserveAspectRatio="xMidYMid slice" 
          className="ow-fullscreen-svg"
          style={{
            transformOrigin: zoomOrigin,
            transform: isZoomed ? 'scale(4.2)' : 'scale(1)',
            filter: transitioning ? 'brightness(0.12) blur(5px)' : 'none',
            transition: 'transform 0.8s cubic-bezier(0.25, 1, 0.35, 1), filter 0.8s ease',
          }}
        >
          {/* Background Image rendered inside the SVG to share the exact same scaling & cropping space! */}
          <image 
            href="/Gemini_Generated_Image_f44bisf44bisf44b.png" 
            x="0" 
            y="0" 
            width="1600" 
            height="900" 
            style={{
              filter: hoveredIdx !== null ? 'brightness(0.35) saturate(0.8)' : 'none',
              transition: 'filter 0.4s ease',
            }}
          />

          {/* Interactive SVG Hitboxes */}
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

          {/* Sonar pulses for island centers (cool landing hints) */}
          {islandsData.map((island, idx) => {
            const center = TOOLTIP_CENTERS[island.id]
            if (!center) return null

            const isHovered = hoveredIdx === idx
            const hasHover = hoveredIdx !== null

            return (
              <g 
                key={`sonar-${island.id}`} 
                style={{ 
                  '--accent-color': island.accentColor || '#1fe5d5',
                  opacity: hasHover ? (isHovered ? 1.0 : 0.15) : 0.8,
                  transition: 'opacity 0.4s ease',
                }}
              >
                <circle
                  cx={center.x}
                  cy={center.y}
                  className="ow-sonar-ring"
                />
                <circle
                  cx={center.x}
                  cy={center.y}
                  className="ow-sonar-ring ow-sonar-ring--delay"
                />
                <circle
                  cx={center.x}
                  cy={center.y}
                  className="ow-sonar-dot"
                />
              </g>
            )
          })}

          {/* Active Hover Tooltip */}
          <AnimatePresence>
            {hoveredIdx !== null && !isZoomed && !transitioning && (() => {
              const island = islandsData[hoveredIdx]
              const center = TOOLTIP_CENTERS[island.id]
              if (!center) return null

              const width = 260
              const height = 175
              const x = center.x - width / 2
              const y = center.y - height - 15

              return (
                <foreignObject
                  key={`tooltip-${island.id}`}
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  style={{ pointerEvents: 'none' }}
                >
                  <motion.div
                    className="ow-hotspot-tooltip"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    style={{ '--accent-color': island.accentColor || '#1fe5d5' }}
                  >
                    <span className="ow-tooltip-subtitle" style={{ color: island.accentColor }}>
                      {island.subtitle}
                    </span>
                    <h3 className="ow-tooltip-title">
                      {island.title}
                    </h3>
                    <p className="ow-tooltip-desc">
                      {island.introText}
                    </p>
                    <div className="ow-tooltip-action">
                      <span>Explore Island</span>
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 1L9 4L6 7" stroke="#1fe5d5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 4L1 4" stroke="#1fe5d5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </motion.div>
                </foreignObject>
              )
            })()}
          </AnimatePresence>
        </svg>
      </div>

      {/* ── Cinematic Transition Fade-out Mask ── */}
      <AnimatePresence>
        {transitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="ow-transition-mask"
          />
        )}
      </AnimatePresence>
    </div>
  )
}
