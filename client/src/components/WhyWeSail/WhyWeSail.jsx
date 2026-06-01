import { motion } from 'framer-motion'
import { projectTeam } from './team.data'
import OceanBackground from '../ABottleReturned/components/OceanBackground'
import './WhyWeSail.css'

export default function WhyWeSail() {
  // Stagger animations variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.215, 0.610, 0.355, 1.000] }
    }
  }

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  }

  const missionPoints = [
    "To raise awareness about bipolar disorder using simple, clear, and scientifically accurate information.",
    "To correct common misconceptions surrounding the disorder, especially confusion with other mental health conditions.",
    "To build empathy by allowing audiences to experience emotional and social challenges through interactive decision-making."
  ]

  const visionPoints = [
    "A society that understands bipolar disorder beyond stereotypes and fear.",
    "Open, informed, and stigma-free conversations about mental health.",
    "Media that represents psychological conditions ethically, accurately, and with dignity.",
    "Interactive storytelling as a powerful tool for awareness, education, and emotional connection.",
    "A generation that responds to mental health challenges with empathy, support, and knowledge rather than judgment."
  ]

  return (
    <section className="wws-container" id="why-we-sail" aria-label="Why We Sail Section">
      <OceanBackground isBlurred={false} />

      {/* ── Section Content Wrapper ── */}
      <div className="wws-content">
        
        {/* ── Section Header ── */}
        <div className="wws-header">
          <span className="wws-header__tag">THE FINAL CHAPTER</span>
          <h2 className="wws-header__title">Why We Sail</h2>
          <p className="wws-header__subtitle">
            "Every wave carries a story. Every story deserves understanding."
          </p>
        </div>

        {/* ── Floating Story Panels ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="wws-panels-grid"
        >
          {/* WHY WE SAIL */}
          <motion.div variants={cardVariants} className="wws-panel">
            <span className="wws-panel__tag">ORIGIN</span>
            <h3 className="wws-panel__title">Why We Sail</h3>
            <div className="wws-panel__body">
              <p>
                Mind Waves is an integrated mental health awareness project built around three main 
                elements: a documentary film, a social media campaign, and an interactive story experience. 
                The project focuses on raising awareness about Bipolar Disorder, correcting common 
                misconceptions surrounding the disorder, and encouraging more empathetic and informed 
                conversations about mental health in Arab media.
              </p>
              <p>
                At the heart of Mind Waves is the Interactive Story, one of the project’s most important 
                elements. Instead of making the audience passive viewers, the experience places users 
                inside emotional and social situations inspired by real experiences related to Bipolar 
                Disorder. Through interactive storytelling, users are encouraged to better understand the 
                disorder, empathize with those experiencing it, and reflect on emotional and psychological 
                challenges from a closer perspective.
              </p>
            </div>
          </motion.div>

          {/* OUR MISSION */}
          <motion.div variants={cardVariants} className="wws-panel">
            <span className="wws-panel__tag">PURPOSE</span>
            <h3 className="wws-panel__title">Our Mission</h3>
            <div className="wws-panel__body">
              <ul className="wws-mission-list">
                {missionPoints.map((point, index) => (
                  <motion.li
                    key={index}
                    variants={listItemVariants}
                    className="wws-mission-item"
                  >
                    <span className="wws-mission-dot" />
                    <span className="wws-mission-text">{point}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* OUR VISION */}
          <motion.div variants={cardVariants} className="wws-panel wws-panel--vision">
            <span className="wws-panel__tag">HORIZON</span>
            <h3 className="wws-panel__title">Our Vision</h3>
            <div className="wws-panel__body">
              <ul className="wws-vision-list">
                {visionPoints.map((point, index) => (
                  <motion.li
                    key={index}
                    variants={listItemVariants}
                    className="wws-vision-item"
                  >
                    <svg className="wws-vision-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{point}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Final Emotional Highlighted Statement */}
              <div className="wws-vision-highlight">
                <div className="wws-vision-highlight__glow" />
                <h4 className="wws-vision-highlight__text">
                  "Our vision is to transform awareness into understanding, and understanding into lasting social change."
                </h4>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ── PROJECT TEAM ── */}
        <div className="wws-crew-section">
          <div className="wws-crew-header">
            <span className="wws-crew-header__tag">THE CREATORS</span>
            <h3 className="wws-crew-header__title">Project Team</h3>
            <p className="wws-crew-header__sub">The minds guiding the journey.</p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="wws-crew-grid"
          >
            {projectTeam.map(item => (
              <motion.div
                key={item.id}
                variants={cardVariants}
                className="wws-crew-card"
              >
                <span className="wws-crew-card__role">{item.role}</span>
                <div className="wws-crew-card__members">
                  {item.members.map((name, idx) => (
                    <div key={idx} className="wws-crew-card__member-name">
                      {name}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  )
}
