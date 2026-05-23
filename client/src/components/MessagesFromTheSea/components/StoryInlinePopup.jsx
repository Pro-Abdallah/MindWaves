import { motion, AnimatePresence } from 'framer-motion'
import AudioStory from './AudioStory'
import VideoStory from './VideoStory'
import ComicStory from './ComicStory'
import TextStory from './TextStory'
import './StoryModal.css' // We can reuse the modal styles for the panel

const STORY_COMPONENTS = {
  audio: AudioStory,
  video: VideoStory,
  comic: ComicStory,
  text: TextStory,
}

export default function StoryInlinePopup({ story, isOpened }) {
  const StoryComponent = story ? STORY_COMPONENTS[story.type] : null

  return (
    <AnimatePresence>
      {isOpened && (
        <motion.div
          className="inline-story-popup"
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -50 }}
          transition={{
            type: 'spring',
            damping: 25,
            stiffness: 200,
            delay: 1.0 // Wait for 1 second so the bottle opening animation is fully visible
          }}
          style={{ 
            position: 'absolute',
            inset: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20,
            pointerEvents: 'auto',
          }}
        >
          {/* We reuse the modal-panel class for that beautiful glassmorphic window */}
          <div 
            className="modal-panel" 
            style={{ 
              position: 'relative', 
              width: '100%', 
              maxWidth: '900px',
              height: '80vh',
              maxHeight: '700px',
              boxShadow: `0 20px 60px ${story.glowColor}`,
              '--accent': story.color, 
              '--glow': story.glowColor 
            }}
          >
            <div
              className="modal-top-glow"
              style={{ background: `linear-gradient(to bottom, ${story.color}35 0%, transparent 100%)` }}
            />

            <div className="modal-header">
              <div className="modal-header-left">
                <div className="modal-dot" style={{ background: story.color }} />
                <span className="modal-label" style={{ color: story.color }}>
                  {story.label}
                </span>
              </div>
            </div>

            <div className="modal-body" style={{ overflowY: 'auto', paddingBottom: '40px' }}>
              {StoryComponent && <StoryComponent story={story} />}
            </div>

            <div className="modal-wave-deco" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
