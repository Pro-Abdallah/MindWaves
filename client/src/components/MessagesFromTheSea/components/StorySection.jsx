import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import StoryInlinePopup from './StoryInlinePopup'
import './StorySection.css'

export default function StorySection({ story, index }) {
  const sectionRef = useRef(null)
  
  // Fade in text as it comes into view
  const inView = useInView(sectionRef, { margin: '-20%' })

  // Magic scroll trigger: when section is in the absolute center of the viewport
  // We use a tight margin so it only opens when you are truly looking at it
  const isCentered = useInView(sectionRef, { margin: '-40% 0px -40% 0px' })
  const [isOpened, setIsOpened] = useState(false)

  // Wait 2 seconds before triggering the opening animation so the user can read the text
  useEffect(() => {
    let timer;
    if (isCentered) {
      timer = setTimeout(() => {
        setIsOpened(true)
      }, 2000) // 2 seconds delay
    } else {
      setIsOpened(false)
    }
    return () => clearTimeout(timer)
  }, [isCentered])
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
        
        {/* TEXT CONTENT PANE - Fades out when opened */}
        <motion.div 
          className="story-section-content"
          initial={{ opacity: 0, x: isReversed ? 40 : -40 }}
          animate={{ 
            opacity: isOpened ? 0 : (inView ? 1 : 0), 
            x: isOpened ? (isReversed ? 20 : -20) : (inView ? 0 : (isReversed ? 40 : -40)),
            filter: isOpened ? 'blur(10px)' : 'blur(0px)'
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ pointerEvents: isOpened ? 'none' : 'auto' }}
        >
          <div className="story-meta">
            <span className="story-number">0{index + 1}</span>
            <span className="story-category" style={{ color: story.color }}>
              {story.category}
            </span>
          </div>
          <h2 className="story-heading">{story.label}</h2>
          <h3 className="story-tagline" style={{ color: story.color }}>{story.tagline}</h3>
          <p className="story-desc">{story.description}</p>
          <p className="story-scroll-hint" style={{ color: story.color }}>
            ↓ Scroll down to open
          </p>
        </motion.div>

        {/* BOTTLE IMAGE PANE - Fades/Transforms when opened */}
        <motion.div 
          className="story-section-visual"
          animate={{ 
            opacity: isOpened ? 0 : 1,
            scale: isOpened ? 1.5 : 1,
            filter: isOpened ? 'blur(20px)' : 'blur(0px)'
          }}
          transition={{ duration: 0.8 }}
        >
          <motion.div className="story-bottle-wrapper" style={{ y: yParallax }}>
            
            {/* TRANSPARENT GENERATED BOTTLE IMAGE */}
            <motion.div
              animate={{ 
                y: [-15, 15, -15], 
                rotate: [-2, 2, -2],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="story-bottle-animator"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              <img 
                src={`/bottle-${story.type}.png`}
                alt={`Floating Bottle for ${story.label}`} 
                style={{
                  width: '100%',
                  maxWidth: '350px',
                  height: 'auto',
                  /* Since images are now true transparent PNGs, we don't need mix-blend-mode or strong contrast filters */
                  filter: 'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.6))'
                }}
              />
              
              {/* Optional: A subtle glow matching the story color behind the bottle to help it pop against dark ocean */}
              <div 
                className="story-bottle-glow" 
                style={{ 
                  backgroundColor: story.glowColor,
                  position: 'absolute',
                  width: '60%',
                  height: '60%',
                  filter: 'blur(50px)',
                  zIndex: -1,
                  opacity: 0.4
                }} 
              />
            </motion.div>

          </motion.div>
        </motion.div>

        {/* INLINE STORY POPUP */}
        <StoryInlinePopup story={story} isOpened={isOpened} />

      </div>
    </section>
  )
}
