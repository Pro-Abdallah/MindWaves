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
          className="inline-story-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ 
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20,
            pointerEvents: 'auto',
            width: '100%',
            height: '100%',
            padding: '2rem'
          }}
        >
          {StoryComponent && <StoryComponent story={story} />}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
