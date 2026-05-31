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

  // Ship movement physics refs (direct DOM manipulation loop for 60fps performance)
  // Stationary at center of the map — only sails when user clicks an island
  const SHIP_HOME = { x: 800, y: 450 }  // center of the 1600x900 chart
  const shipPos = useRef({ x: 800, y: 450 })
  const shipAngle = useRef(-30)  // facing slightly right, looks natural at rest
  const targetPos = useRef(null)
  const isSailing = useRef(false)
  const pendingRoute = useRef(null)
  const activeIslandId = useRef(null)

  // Spawning wake particles
  const wakeParticles = useRef([])

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

  // 60FPS High-Performance Animation Loop
  useEffect(() => {
    let animId
    let time = 0

    const update = () => {
      time += 0.016 // ~60fps step
      
      const shipEl = document.getElementById('ow-svg-ship')
      if (shipEl) {
        if (targetPos.current) {
          // ── Sailing to user-clicked island ──
          const dx = targetPos.current.x - shipPos.current.x
          const dy = targetPos.current.y - shipPos.current.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist > 35) {
            isSailing.current = true

            // Smoothly rotate ship towards target
            const targetRad = Math.atan2(dy, dx)
            let targetDeg = targetRad * (180 / Math.PI)
            let diff = targetDeg - shipAngle.current
            diff = ((diff + 180) % 360) - 180
            shipAngle.current += diff * 0.1

            // Move forward
            const rad = shipAngle.current * (Math.PI / 180)
            shipPos.current.x += Math.cos(rad) * 14.5
            shipPos.current.y += Math.sin(rad) * 14.5

            // Spawn wake foam
            if (Math.random() < 0.6) {
              const rad2 = shipAngle.current * (Math.PI / 180)
              wakeParticles.current.push({
                x: shipPos.current.x - Math.cos(rad2) * 60 + (Math.random() - 0.5) * 12,
                y: shipPos.current.y - Math.sin(rad2) * 60 + (Math.random() - 0.5) * 12,
                life: 1.0,
                size: 5 + Math.random() * 6,
                vx: -Math.cos(rad2) * 2.2 + (Math.random() - 0.5) * 0.9,
                vy: -Math.sin(rad2) * 2.2 + (Math.random() - 0.5) * 0.9
              })
            }
          } else {
            // Arrived at island
            isSailing.current = false
            targetPos.current = null
            handleArrival()
          }
        }
        // If no target: ship stays perfectly still at its current position

        // Ship transform — center pivot at (50, 30) in the 100x60 SVG viewbox
        const scaleVal = 1.8
        const cx = 50 * scaleVal
        const cy = 30 * scaleVal

        shipEl.setAttribute(
          'transform',
          `translate(${shipPos.current.x - cx}, ${shipPos.current.y - cy}) scale(${scaleVal}) rotate(${shipAngle.current} 50 30)`
        )
      }

      // Render wake foam bubbles directly in the SVG
      const wakeContainer = document.getElementById('ow-svg-wake-container')
      if (wakeContainer) {
        wakeParticles.current.forEach(p => {
          p.life -= 0.018
          p.x += p.vx
          p.y += p.vy
        })
        wakeParticles.current = wakeParticles.current.filter(p => p.life > 0)

        wakeContainer.innerHTML = wakeParticles.current.map(p => `
          <circle 
            cx="${p.x}" 
            cy="${p.y}" 
            r="${p.size * p.life}" 
            fill="#a0d8ef" 
            opacity="${p.life * 0.55}" 
          />
          <circle 
            cx="${p.x + (Math.random()-0.5)*3}" 
            cy="${p.y + (Math.random()-0.5)*3}" 
            r="${p.size * p.life * 0.4}" 
            fill="#ffffff" 
            opacity="${p.life * 0.35}" 
          />
        `).join('')
      }

      animId = requestAnimationFrame(update)
    }

    animId = requestAnimationFrame(update)
    return () => cancelAnimationFrame(animId)
  }, [])

  const handleIslandClick = (island) => {
    if (transitioning) return

    const coords = TOOLTIP_CENTERS[island.id]
    if (coords) {
      targetPos.current = { x: coords.x, y: coords.y }
      activeIslandId.current = island.id
      pendingRoute.current = island.route
    } else {
      // Fallback if coordinates missing
      navigate(island.route)
    }
  }

  const handleArrival = () => {
    const islandId = activeIslandId.current
    const coords = TOOLTIP_CENTERS[islandId] || { top: '50%', left: '50%' }
    const origin = `${coords.left} ${coords.top}`
    
    // Save zoom origin in session storage for the zone-out animation on return!
    sessionStorage.setItem('mw-prev-zoom', origin)
    
    setZoomOrigin(origin)
    setIsZoomed(true)
    setTransitioning(true)
    
    // Transition route once the zoom completes
    setTimeout(() => {
      navigate(pendingRoute.current)
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

          {/* Bioluminescent foam wake trail container */}
          <g id="ow-svg-wake-container" />

          {/* ── Realistic Tall Ship Galleon (100x60 viewbox, bow points RIGHT along +X) ── */}
          <g id="ow-svg-ship">
            <defs>
              {/* Hull wood gradient — dark oak with grain */}
              <linearGradient id="hullGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#5c3012" />
                <stop offset="40%" stopColor="#3d1e0a" />
                <stop offset="100%" stopColor="#1a0b03" />
              </linearGradient>
              {/* Sail gradient — canvas aged white */}
              <linearGradient id="sailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#faf6ee" />
                <stop offset="60%" stopColor="#ede5d4" />
                <stop offset="100%" stopColor="#d4c8b0" />
              </linearGradient>
              {/* Copper bottom */}
              <linearGradient id="copperGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#7c4f1e" />
                <stop offset="100%" stopColor="#3d2508" />
              </linearGradient>
            </defs>

            {/* === WAKE / WATER FOAM === */}
            <ellipse cx="16" cy="30" rx="14" ry="6" fill="#c8e8f5" opacity="0.35" />
            <ellipse cx="10" cy="30" rx="8" ry="3" fill="#ffffff" opacity="0.25" />

            {/* === HULL BODY === */}
            {/* Copper-bottom keel underbody */}
            <path d="M 20 34 C 30 39, 70 39, 88 33 C 78 37, 26 37, 20 34 Z" fill="url(#copperGrad)" />
            {/* Main hull — sleek elongated galleon shape, bow right */}
            <path d="M 88 24 C 94 27, 97 30, 94 33 C 90 37, 78 38, 60 38 C 40 38, 22 37, 17 33 C 13 30, 14 27, 17 24 C 22 21, 40 20, 60 20 C 78 20, 90 21, 88 24 Z" fill="url(#hullGrad)" stroke="#8b5a2b" strokeWidth="0.6" />
            {/* Hull top rail — golden gunwale strip */}
            <path d="M 88 24 C 90 21, 78 20, 60 20 C 40 20, 22 21, 17 24" stroke="#c8922a" strokeWidth="1.2" fill="none" />
            {/* Lower hull waterline shadow */}
            <path d="M 88 33 C 78 36, 40 37, 17 33" stroke="#0d0704" strokeWidth="0.8" fill="none" opacity="0.6" />

            {/* Hull plank lines (realistic wood grain) */}
            <line x1="20" y1="22" x2="88" y2="22" stroke="#4a2510" strokeWidth="0.4" opacity="0.5" />
            <line x1="18" y1="25" x2="90" y2="25" stroke="#4a2510" strokeWidth="0.4" opacity="0.4" />
            <line x1="17" y1="28" x2="92" y2="28" stroke="#3d1e0a" strokeWidth="0.4" opacity="0.4" />
            <line x1="17" y1="31" x2="91" y2="31" stroke="#3d1e0a" strokeWidth="0.4" opacity="0.35" />
            <line x1="18" y1="34" x2="88" y2="34" stroke="#3d1e0a" strokeWidth="0.4" opacity="0.3" />

            {/* Gun ports — dark rectangular openings */}
            <rect x="30" y="25" width="4" height="5" rx="0.5" fill="#0a0503" stroke="#c8922a" strokeWidth="0.3" />
            <rect x="42" y="25" width="4" height="5" rx="0.5" fill="#0a0503" stroke="#c8922a" strokeWidth="0.3" />
            <rect x="54" y="25" width="4" height="5" rx="0.5" fill="#0a0503" stroke="#c8922a" strokeWidth="0.3" />
            <rect x="66" y="25" width="4" height="5" rx="0.5" fill="#0a0503" stroke="#c8922a" strokeWidth="0.3" />
            <rect x="30" y="32" width="4" height="4" rx="0.5" fill="#0a0503" stroke="#c8922a" strokeWidth="0.3" />
            <rect x="42" y="32" width="4" height="4" rx="0.5" fill="#0a0503" stroke="#c8922a" strokeWidth="0.3" />
            <rect x="54" y="32" width="4" height="4" rx="0.5" fill="#0a0503" stroke="#c8922a" strokeWidth="0.3" />

            {/* Bow decoration — carved figurehead area */}
            <path d="M 88 24 C 96 26, 100 29, 97 32 C 93 35, 88 33 Z" fill="#5c3012" stroke="#c8922a" strokeWidth="0.5" />
            <circle cx="97" cy="29" r="1.5" fill="#e8c84a" opacity="0.9" /> {/* Figurehead gold point */}

            {/* Stern transom — flat back with carved detail */}
            <path d="M 17 24 C 12 26, 10 29, 12 33 C 14 36, 17 33 Z" fill="#4a2510" stroke="#c8922a" strokeWidth="0.6" />
            {/* Stern lantern */}
            <circle cx="12" cy="29" r="2" fill="#f5c842" opacity="0.9" />
            <circle cx="12" cy="29" r="1" fill="#fff8c0" />

            {/* === DECK STRUCTURES === */}
            {/* Quarterdeck (stern raised) */}
            <rect x="17" y="20" width="18" height="4" rx="1" fill="#4a2510" stroke="#8b5a2b" strokeWidth="0.4" />
            {/* Forecastle (bow raised) */}
            <rect x="72" y="20" width="16" height="4" rx="1" fill="#4a2510" stroke="#8b5a2b" strokeWidth="0.4" />
            {/* Deck rope coils */}
            <circle cx="23" cy="22" r="1.5" fill="none" stroke="#a07840" strokeWidth="0.6" />
            <circle cx="80" cy="22" r="1.5" fill="none" stroke="#a07840" strokeWidth="0.6" />

            {/* === MASTS === */}
            {/* Mizzen mast (stern) */}
            <line x1="27" y1="22" x2="27" y2="2" stroke="#2a1406" strokeWidth="1.8" strokeLinecap="round" />
            {/* Main mast (center) */}
            <line x1="50" y1="21" x2="50" y2="-4" stroke="#2a1406" strokeWidth="2.2" strokeLinecap="round" />
            {/* Fore mast */}
            <line x1="73" y1="22" x2="73" y2="1" stroke="#2a1406" strokeWidth="1.8" strokeLinecap="round" />
            {/* Bowsprit — angled forward from bow */}
            <line x1="88" y1="21" x2="106" y2="14" stroke="#2a1406" strokeWidth="1.4" strokeLinecap="round" />

            {/* === YARDS (horizontal spars) === */}
            {/* Main yard */}
            <line x1="38" y1="4" x2="62" y2="4" stroke="#3d2008" strokeWidth="1.4" />
            <line x1="40" y1="10" x2="60" y2="10" stroke="#3d2008" strokeWidth="1.1" />
            {/* Mizzen yard */}
            <line x1="19" y1="7" x2="35" y2="7" stroke="#3d2008" strokeWidth="1.1" />
            {/* Fore yard */}
            <line x1="63" y1="5" x2="83" y2="5" stroke="#3d2008" strokeWidth="1.2" />
            <line x1="65" y1="11" x2="81" y2="11" stroke="#3d2008" strokeWidth="1.0" />

            {/* === SAILS — billowing canvas, full and wind-filled === */}
            {/* Mizzen topsail */}
            <path d="M 19 7 C 22 9, 26 12, 27 14 C 26 12, 21 9, 19 7 Z" fill="url(#sailGrad)" stroke="#c8b89a" strokeWidth="0.4" opacity="0.92" />
            {/* Mizzen lower sail — billowing */}
            <path d="M 19 7 C 24 10, 30 16, 27 22 C 22 18, 18 12, 19 7 Z" fill="url(#sailGrad)" stroke="#c8b89a" strokeWidth="0.5" />

            {/* Main topsail */}
            <path d="M 38 4 C 45 3, 55 3, 62 4 C 58 7, 52 8, 50 8 C 48 8, 42 7, 38 4 Z" fill="url(#sailGrad)" stroke="#c8b89a" strokeWidth="0.4" />
            {/* Main lower sail — large & billowing forward */}
            <path d="M 38 4 C 40 8, 46 16, 50 21 C 54 16, 60 8, 62 4 C 58 8, 52 14, 50 16 C 48 14, 42 8, 38 4 Z" fill="url(#sailGrad)" stroke="#c8b89a" strokeWidth="0.5" />
            {/* Main middle sail */}
            <path d="M 40 10 C 43 13, 50 15, 60 10 C 57 13, 50 16, 40 10 Z" fill="#ede5d4" stroke="#c8b89a" strokeWidth="0.4" opacity="0.85" />

            {/* Fore topsail */}
            <path d="M 63 5 C 68 4, 78 4, 83 5 C 80 8, 75 9, 73 9 C 71 9, 66 8, 63 5 Z" fill="url(#sailGrad)" stroke="#c8b89a" strokeWidth="0.4" />
            {/* Fore lower sail — large billowing */}
            <path d="M 63 5 C 65 9, 70 16, 73 22 C 76 16, 81 9, 83 5 C 79 8, 75 14, 73 16 C 71 14, 66 8, 63 5 Z" fill="url(#sailGrad)" stroke="#c8b89a" strokeWidth="0.5" />
            {/* Fore middle sail */}
            <path d="M 65 11 C 68 14, 73 15, 81 11 C 78 14, 73 16, 65 11 Z" fill="#ede5d4" stroke="#c8b89a" strokeWidth="0.4" opacity="0.85" />

            {/* Triangular jib sail (bowsprit) */}
            <path d="M 83 5 C 92 10, 100 15, 106 14 C 96 13, 86 10, 83 5 Z" fill="#faf6ee" stroke="#c8b89a" strokeWidth="0.5" opacity="0.9" />
            <path d="M 83 21 C 90 18, 100 16, 106 14 C 96 15, 87 18, 83 21 Z" fill="#faf6ee" stroke="#c8b89a" strokeWidth="0.4" opacity="0.85" />

            {/* === RIGGING LINES (ropes from mast to hull) === */}
            <line x1="27" y1="2" x2="17" y2="20" stroke="#6b4c2a" strokeWidth="0.4" opacity="0.7" />
            <line x1="27" y1="2" x2="37" y2="20" stroke="#6b4c2a" strokeWidth="0.4" opacity="0.7" />
            <line x1="50" y1="-4" x2="35" y2="20" stroke="#6b4c2a" strokeWidth="0.5" opacity="0.65" />
            <line x1="50" y1="-4" x2="65" y2="20" stroke="#6b4c2a" strokeWidth="0.5" opacity="0.65" />
            <line x1="73" y1="1" x2="60" y2="20" stroke="#6b4c2a" strokeWidth="0.4" opacity="0.7" />
            <line x1="73" y1="1" x2="86" y2="20" stroke="#6b4c2a" strokeWidth="0.4" opacity="0.7" />
            <line x1="106" y1="14" x2="83" y2="21" stroke="#6b4c2a" strokeWidth="0.35" opacity="0.6" />
            {/* Crow's nest stays */}
            <line x1="50" y1="-4" x2="27" y2="4" stroke="#6b4c2a" strokeWidth="0.35" opacity="0.5" />
            <line x1="50" y1="-4" x2="73" y2="4" stroke="#6b4c2a" strokeWidth="0.35" opacity="0.5" />

            {/* Crow's nest (main mast) */}
            <rect x="46" y="-6" width="8" height="4" rx="1" fill="#3d2008" stroke="#6b4c2a" strokeWidth="0.5" />

            {/* === FLAGS === */}
            {/* Main mast flag */}
            <path d="M 50 -7 L 44 -5 L 50 -3 Z" fill="#1a7a8a" />
            {/* Fore mast pennant */}
            <path d="M 73 0 L 68 2 L 73 3 Z" fill="#1a7a8a" opacity="0.9" />

            {/* === SHADOW UNDER SHIP === */}
            <ellipse cx="55" cy="40" rx="35" ry="4" fill="#000814" opacity="0.18" />
          </g>

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

      {/* ── Dashboard UI Header ── */}
      <header className="ow-header-framed">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="ow-header-framed__content"
        >
          <span className="ow-header-framed__tag">Interactive Sea Chart</span>
          <h2 className="ow-header-framed__title">Understanding The Waves</h2>
          <p className="ow-header-framed__subtitle">
            Click on any floating island on the chart below to navigate your ship and explore Bipolar Disorder.
          </p>
        </motion.div>
      </header>

      {/* ── Framed Footer ── */}
      <footer className="ow-footer-framed">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.8 }}
          className="ow-footer-framed__guidance"
        >
          <span>Safe Harbor Bipolar Recovery Map • Click any island to sail</span>
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
