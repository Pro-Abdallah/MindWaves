import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
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
            href="/New Islands Image.jpg" 
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
