import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import StoryInlinePopup from './StoryInlinePopup'
import './StorySection.css'

export default function StorySection({ story, index }) {
  const sectionRef = useRef(null)
  
  // Fade in text as it comes into view
  const inView = useInView(sectionRef, { margin: '-20%' })

  // Parallax effect for the bottle based on scroll position
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })
  
  const yParallax = useTransform(scrollYProgress, [0, 1], [80, -80])
  const isReversed = index % 2 !== 0

  return (
    <section 
      className={`story-full-section ${isReversed ? 'story-reversed' : ''}`}
      ref={sectionRef}
      id={`story-section-${story.id}`}
    >
      <div className="story-section-inner">
        
        {/* TEXT CONTENT PANE */}
        <motion.div 
          className="story-section-content"
          initial={{ opacity: 0, x: isReversed ? 40 : -40 }}
          animate={{ 
            opacity: inView ? 1 : 0, 
            x: inView ? 0 : (isReversed ? 40 : -40)
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span 
              style={{ 
                color: story.color, 
                textShadow: `0 0 15px ${story.color}`,
                fontSize: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                background: `radial-gradient(circle, ${story.color}30 0%, transparent 70%)`,
                borderRadius: '50%'
              }}
            >
              {story.type === 'audio' && '♪'}
              {story.type === 'video' && '▶'}
              {story.type === 'comic' && '◈'}
              {story.type === 'text' && '✦'}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <h2 
                className="story-heading" 
                style={{ 
                  margin: 0,
                  textShadow: `0 0 25px ${story.glowColor}`
                }}
              >
                {story.label}
              </h2>
              {/* Removed the 'Pause here for a second to open...' text */}
            </div>
          </div>
        </motion.div>

        {/* BOTTLE IMAGE PANE */}
        <motion.div 
          className="story-section-visual"
        >
          <motion.div className="story-bottle-wrapper" style={{ y: yParallax, position: 'relative', display: 'flex', justifyContent: 'center' }}>
            
            {/* Water Surface / Ripples to ground the bottle */}
            <div style={{
              position: 'absolute',
              bottom: '10%', // Position at the base of the bottle
              left: '50%',
              transform: 'translateX(-50%)',
              width: '240px',
              height: '60px',
              zIndex: 0,
            }}>
              {/* Core water shadow/glow */}
              <motion.div 
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `radial-gradient(ellipse at center, ${story.glowColor} 0%, rgba(0,0,0,0.8) 40%, transparent 70%)`,
                  borderRadius: '50%',
                  transform: 'rotateX(70deg)',
                  filter: 'blur(8px)'
                }}
              />
              {/* Expanding ripple ring 1 */}
              <motion.div 
                animate={{ scale: [0.8, 1.8], opacity: [0.6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  border: `2px solid ${story.color}`,
                  borderRadius: '50%',
                  transform: 'rotateX(70deg)'
                }}
              />
              {/* Expanding ripple ring 2 */}
              <motion.div 
                animate={{ scale: [0.8, 1.8], opacity: [0.6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeOut", delay: 2 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  border: `2px solid ${story.color}`,
                  borderRadius: '50%',
                  transform: 'rotateX(70deg)'
                }}
              />
            </div>

            {/* TRANSPARENT GENERATED BOTTLE IMAGE */}
            <motion.div
              animate={{ 
                y: [-12, 12, -12], 
                rotate: [-2, 2, -2],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="story-bottle-animator"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 1
              }}
            >
              <img 
                src={`/bottle-${story.type}.png`}
                alt={`Floating Bottle for ${story.label}`} 
                style={{
                  width: '100%',
                  maxWidth: '350px',
                  height: 'auto',
                  filter: 'drop-shadow(0 25px 25px rgba(0, 0, 0, 0.8))'
                }}
              />
              
              {/* A subtle glow matching the story color behind the bottle to help it pop against dark ocean */}
              <div 
                className="story-bottle-glow" 
                style={{ 
                  backgroundColor: story.glowColor,
                  position: 'absolute',
                  width: '60%',
                  height: '60%',
                  filter: 'blur(50px)',
                  zIndex: -1,
                  opacity: 0.3
                }} 
              />
            </motion.div>

          </motion.div>
        </motion.div>

      </div>

      {/* INLINE STORY CONTENT (NOW STATICALLY RENDERED BELOW) */}
      <StoryInlinePopup story={story} index={index} />

    </section>
  )
}
