import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { islandsData } from './islands.data'
import './OceanWorld.css'

// Absolute percentage coordinates matching the visual centers of the actual islands in the chart picture (for CSS zoom-origins)
const TOOLTIP_CENTERS = {
  1: { top: '49%', left: '14%', x: 224, y: 441 },   // Still Island (Snowy mountains center)
  2: { top: '29%', left: '35%', x: 560, y: 261 },   // Burning Island (Volcano crater center)
  3: { top: '70%', left: '36%', x: 576, y: 630 },   // Sunken Island (Castle ruins center)
  4: { top: '28%', left: '65%', x: 1040, y: 252 },  // Twin Islands (Stone arch center)
  5: { top: '62%', left: '71%', x: 1136, y: 558 },  // Root Island (Giant tree canopy center)
  6: { top: '45%', left: '91%', x: 1456, y: 405 },  // Lighthouse Island (Lighthouse deck center)
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

    const coords = TOOLTIP_CENTERS[island.id] || { top: '50%', left: '50%' }
    const origin = `${coords.left} ${coords.top}`
    
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
          viewBox="0 0 1600 900" 
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
          />

          {/* Ship graphics removed to maintain clean widescreen aesthetic without occlusion */}

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
        </svg>
      </div>


      {/* ── Framed Footer ── */}
      <footer className="ow-footer-framed">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.8 }}
          className="ow-footer-framed__guidance"
        >
          <span>Safe Harbor Bipolar Recovery Map • Click any island to explore</span>
        </motion.div>
      </footer>

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
