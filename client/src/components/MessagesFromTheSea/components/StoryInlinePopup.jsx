import { motion } from 'framer-motion'
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

export default function StoryInlinePopup({ story, index }) {
  const StoryComponent = story ? STORY_COMPONENTS[story.type] : null

  if (!StoryComponent) return null;

  return (
    <motion.div
      className="inline-story-content"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.8 }}
      style={{ 
        width: '100%',
        maxWidth: '1000px',
        margin: '4rem auto 0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10,
        pointerEvents: 'auto'
      }}
    >
      <div style={{ 
        marginBottom: '2rem', 
        textAlign: 'center', 
        borderBottom: `1px solid ${story.color}50`, 
        paddingBottom: '1rem', 
        width: '100%' 
      }}>

        <h3 style={{ 
          margin: '8px 0 0 0', 
          fontSize: '20px', 
          color: '#fff', 
          textShadow: `0 0 10px ${story.glowColor}` 
        }}>
          {story.lead}
        </h3>
      </div>
      <StoryComponent story={story} />
    </motion.div>
  )
}
