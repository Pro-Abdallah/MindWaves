import { useRef } from 'react'
import { motion } from 'framer-motion'
import { crewData } from './team.data'
import './WhyWeSail.css'

function IconLinkedin() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function IconTwitter() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </svg>
  )
}

function IconEmail() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

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

  // Floating lanterns decoration mimicking sunset light rising
  const lanterns = useRef(
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: 10 + Math.random() * 80,
      delay: Math.random() * 10,
      duration: 15 + Math.random() * 15,
      size: 8 + Math.random() * 12
    }))
  )

  const missionPoints = [
    "Raise awareness about bipolar disorder using simple, clear, and scientifically accurate information.",
    "Correct misconceptions surrounding bipolar disorder.",
    "Build empathy through interactive storytelling and emotional decision-making.",
    "Combine medical accuracy with human-centered storytelling.",
    "Highlight the importance of family understanding and social support.",
    "Create engaging digital content for younger audiences.",
    "Encourage respectful and informed mental health conversations."
  ]

  const visionPoints = [
    "A society that understands bipolar disorder beyond stereotypes and fear.",
    "Open and stigma-free mental health conversations.",
    "Ethical and accurate media representation of psychological conditions.",
    "Interactive storytelling as a tool for emotional connection and awareness.",
    "A generation that responds with empathy, support, and knowledge instead of judgment."
  ]

  return (
    <section className="wws-container" id="why-we-sail" aria-label="Why We Sail Section">
      {/* ── Immersive Sunset Sea Backdrop ── */}
      <div className="wws-ambient-bg">
        <div className="wws-sunset-glow" />
        <div className="wws-water-reflection" />
        
        {/* Floating sky lanterns */}
        <div className="wws-lanterns">
          {lanterns.current.map(l => (
            <span
              key={l.id}
              className="wws-lantern"
              style={{
                left: `${l.left}%`,
                width: `${l.size}px`,
                height: `${l.size}px`,
                animationDelay: `${l.delay}s`,
                animationDuration: `${l.duration}s`
              }}
            />
          ))}
        </div>
      </div>

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
          {/* WHO WE ARE */}
          <motion.div variants={cardVariants} className="wws-panel">
            <span className="wws-panel__tag">ORIGIN</span>
            <h3 className="wws-panel__title">Who We Are</h3>
            <div className="wws-panel__body">
              <p>
                We are the creators of the Mind Waves Interactive Story, a team of media students and storytellers committed to reshaping how bipolar disorder is understood in Arab media.
              </p>
              <p>
                Our interactive story is built on real interviews, medical research, and social analysis. We designed it as an immersive experience where the audience does not simply watch events unfold, but actively participates in them.
              </p>
              <p>
                Through choice-based storytelling, emotional scenarios, and realistic consequences, we aim to bring audiences closer to the lived experience of bipolar disorder.
              </p>
              <p>
                We believe that true understanding begins when people are invited to step inside the experience — not just observe it from a distance.
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

        {/* ── THE CREW (Team section) ── */}
        <div className="wws-crew-section">
          <div className="wws-crew-header">
            <span className="wws-crew-header__tag">THE CREATORS</span>
            <h3 className="wws-crew-header__title">The Crew</h3>
            <p className="wws-crew-header__sub">The minds guiding the journey.</p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="wws-crew-grid"
          >
            {crewData.map(member => (
              <motion.div
                key={member.id}
                variants={cardVariants}
                className="wws-crew-card"
              >
                {/* Photo container with soft glow */}
                <div className="wws-crew-card__photo-container">
                  <div className="wws-crew-card__photo-glow" />
                  <img
                    src={member.image}
                    alt={`${member.name} - ${member.role}`}
                    className="wws-crew-card__img"
                    loading="lazy"
                  />
                </div>

                {/* Info */}
                <h4 className="wws-crew-card__name">{member.name}</h4>
                <span className="wws-crew-card__role">{member.role}</span>
                <p className="wws-crew-card__bio">{member.bio}</p>

                {/* Social Links */}
                <div className="wws-crew-card__socials">
                  <a
                    href={member.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="wws-crew-card__social-link"
                    aria-label={`${member.name} LinkedIn Profile`}
                  >
                    <IconLinkedin />
                  </a>
                  <a
                    href={member.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="wws-crew-card__social-link"
                    aria-label={`${member.name} Twitter Profile`}
                  >
                    <IconTwitter />
                  </a>
                  <a
                    href={member.social.email}
                    className="wws-crew-card__social-link"
                    aria-label={`Send email to ${member.name}`}
                  >
                    <IconEmail />
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  )
}
