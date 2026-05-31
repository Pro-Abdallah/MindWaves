import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Scene from './Scene'
import { islandsData } from './islands.data'
import './OceanWorld.css'

/**
 * Interactive Ocean World component.
 * Acts as the wrapper of the R3F Canvas and overlay HTML interfaces.
 */
export default function OceanWorld() {
  const navigate = useNavigate()
  
  // Track active focus for keyboard navigation (index of active island)
  const [focusIdx, setFocusIdx] = useState(-1)
  
  // Trigger overlay exit transition state
  const [transitioning, setTransitioning] = useState(false)

  // Handle keyboard navigation for accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (transitioning) return

      if (e.key === 'Tab' || e.key === 'ArrowRight') {
        e.preventDefault()
        setFocusIdx((prev) => (prev + 1) % islandsData.length)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setFocusIdx((prev) => (prev - 1 + islandsData.length) % islandsData.length)
      } else if (e.key === 'Enter' && focusIdx >= 0) {
        e.preventDefault()
        handleExploreTrigger(islandsData[focusIdx].route)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [focusIdx, transitioning])

  const handleExploreTrigger = (route) => {
    setTransitioning(true)
    // Wait for the camera zoom and fade overlays before pushing route
    setTimeout(() => {
      navigate(route)
    }, 900)
  }

  return (
    <div className="ow-container" role="region" aria-label="Understanding The Waves ocean world">
      {/* ── Background canvas ── */}
      <div className="ow-canvas-wrapper">
        <Canvas
          shadows
          camera={{ position: [0, 16, 28], fov: 55 }}
          gl={{ antialias: true }}
        >
          <Scene onExploreStart={handleExploreTrigger} />
        </Canvas>
      </div>

      {/* ── Overlay UI Header ── */}
      <header className="ow-header">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          className="ow-header__content"
        >
          <h2 className="ow-header__title">Understanding The Waves</h2>
          <p className="ow-header__subtitle">
            An interactive mental-health exploration. Click on the floating islands to explore Bipolar Disorder concepts.
          </p>
        </motion.div>
      </header>

      {/* ── Accessibility / Keyboard instruction helper ── */}
      <footer className="ow-footer">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1.5, duration: 1.0 }}
          className="ow-footer__guidance"
        >
          <span>Use <strong>Mouse Drag</strong> to look around • <strong>Tab / Arrows</strong> to select • <strong>Enter</strong> to explore</span>
        </motion.div>
      </footer>

      {/* ── Active keyboard navigation indicator overlay ── */}
      {focusIdx >= 0 && (
        <div className="ow-focus-hud">
          <div className="ow-focus-hud__card">
            <span className="ow-focus-hud__idx">ISLAND {focusIdx + 1} OF {islandsData.length}</span>
            <h4 className="ow-focus-hud__title">{islandsData[focusIdx].title}</h4>
            <p className="ow-focus-hud__desc">{islandsData[focusIdx].description}</p>
            <button 
              className="ow-focus-hud__btn" 
              onClick={() => handleExploreTrigger(islandsData[focusIdx].route)}
            >
              EXPLORE ISLAND
            </button>
          </div>
        </div>
      )}

      {/* ── Cinematic Transition Fade-out Mask ── */}
      <AnimatePresence>
        {transitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="ow-transition-mask"
          />
        )}
      </AnimatePresence>
    </div>
  )
}
