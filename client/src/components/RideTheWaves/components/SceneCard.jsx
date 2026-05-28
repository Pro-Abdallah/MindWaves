import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChoiceCard from './ChoiceCard';
import ResultOverlay from './ResultOverlay';

export default function SceneCard({ scene, onChoice, selectedChoice, showFeedback, onContinue }) {
  const [isMuted, setIsMuted] = useState(false);

  if (!scene) return null;

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.video
          key={scene.videoSrc}
          className="ride-bg-video"
          src={scene.videoSrc}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        />
      </AnimatePresence>

      <div className="ride-overlay" />

      {/* Mute Toggle Button */}
      <button 
        className="ride-mute-btn" 
        onClick={() => setIsMuted(!isMuted)}
        title={isMuted ? "Unmute Audio" : "Mute Audio"}
      >
        {isMuted ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        )}
      </button>

      <motion.div 
        className="scene-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 1 }}
      >
        <div className="scene-header">
          <motion.h2 
            className="scene-title"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {scene.title}
          </motion.h2>
          
          <motion.div 
            className="scene-situation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {scene.situation}
          </motion.div>
        </div>

        <motion.div 
          className="choices-grid"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2, delayChildren: 1 }
            }
          }}
        >
          {scene.choices.map((choice, index) => (
            <ChoiceCard 
              key={index} 
              choice={choice} 
              onSelect={onChoice}
              disabled={showFeedback} // disable clicking other choices after one is selected
            />
          ))}
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showFeedback && (
          <ResultOverlay 
            choice={selectedChoice} 
            onContinue={onContinue} 
          />
        )}
      </AnimatePresence>
    </>
  );
}
