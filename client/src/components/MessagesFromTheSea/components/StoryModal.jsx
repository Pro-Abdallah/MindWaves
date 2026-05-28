import { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AudioStory from './AudioStory'
import VideoStory from './VideoStory'
import ComicStory from './ComicStory'
import TextStory from './TextStory'
import './StoryModal.css'

const STORY_COMPONENTS = {
  audio: AudioStory,
  video: VideoStory,
  comic: ComicStory,
  text: TextStory,
}

/**
 * StoryModal
 * Fullscreen cinematic overlay that wraps the active story experience.
 * Opens with a wave-wipe reveal. Closes on ESC or X button.
 */
export default function StoryModal({ story, onClose }) {
  // ESC to close
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Prevent body scroll
  useEffect(() => {
    if (!story) return;
    
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => { 
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    }
  }, [story])

  const handleClose = useCallback(() => {
    // Forcefully stop any playing media immediately so it doesn't play during the exit animation
    document.querySelectorAll('audio, video').forEach(el => {
      el.pause();
    });
    onClose();
  }, [onClose]);

  const StoryComponent = story ? STORY_COMPONENTS[story.type] : null

  return createPortal(
    <AnimatePresence>
      {story && (
        <div className="story-modal-portal-root">
          {/* Backdrop */}
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={handleClose}
          />

          {/* Modal panel */}
          <motion.div
            className="modal-panel"
            role="dialog"
            aria-modal="true"
            aria-label={story.label}
            initial={{ opacity: 0, y: '100%', scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: '60%', scale: 0.94 }}
            transition={{
              type: 'spring',
              damping: 28,
              stiffness: 180,
              mass: 1,
            }}
            style={{ '--accent': story.color, '--glow': story.glowColor }}
          >
            {/* Ambient top glow */}
            <div
              className="modal-top-glow"
              style={{ background: `linear-gradient(to bottom, ${story.color}25 0%, transparent 100%)` }}
            />

            {/* Header bar */}
            <div className="modal-header">
              <div className="modal-header-left">
                <div className="modal-dot" style={{ background: story.color }} />
                <span className="modal-label" style={{ color: story.color }}>
                  {story.label}
                </span>
              </div>

              <motion.button
                className="modal-close"
                onClick={handleClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close story"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </motion.button>
            </div>

            {/* Story content */}
            <div className="modal-body">
              {StoryComponent && <StoryComponent story={story} />}
            </div>

            {/* Bottom wave decoration */}
            <div className="modal-wave-deco" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
