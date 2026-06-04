import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './VideoStory.css'

/**
 * VideoStory
 * Uses native browser video controls for maximum compatibility,
 * especially on mobile. Wraps it in a cinematic styled container.
 */
export default function VideoStory({ story }) {
  const videoRef = useRef(null)
  const [started, setStarted] = useState(false)

  const handleStart = () => {
    const v = videoRef.current
    if (!v) return
    v.play()
    setStarted(true)
  }

  return (
    <div className="video-story">
      <motion.div
        className="video-player-wrap"
        initial={{ opacity: 0, scale: 0.96, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2 }}
        style={{ '--accent': story.color }}
      >
        {/* Video element — native controls for smooth mobile experience */}
        <video
          ref={videoRef}
          className="video-el"
          src={story.src}
          poster={story.poster}
          playsInline
          preload="metadata"
          controls={started}
          onEnded={() => setStarted(false)}
        />

        {/* Big play overlay (before start) */}
        <AnimatePresence>
          {!started && (
            <motion.div
              className="video-start-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              onClick={handleStart}
            >
              <motion.div
                className="video-start-btn"
                style={{ background: story.color }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.93 }}
              >
                <svg viewBox="0 0 24 24" fill="white">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </motion.div>
              <p className="video-start-label">{story.tagline}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Corner glow */}
        <div
          className="video-corner-glow"
          style={{ background: `radial-gradient(circle at 20% 80%, ${story.color}30 0%, transparent 60%)` }}
        />
      </motion.div>
    </div>
  )
}
