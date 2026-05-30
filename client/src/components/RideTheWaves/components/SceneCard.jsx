import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChoiceCard from './ChoiceCard';
import ResultOverlay from './ResultOverlay';

// Derive a clean role label from the scene title (e.g. "The Mother" → "MOTHER")
function getRoleLabel(title = '') {
  return title.replace(/^the\s+/i, '').toUpperCase();
}

export default function SceneCard({ scene, onChoice, selectedChoice, showFeedback, onContinue }) {
  const videoRef = useRef(null);
  const [videoWatched, setVideoWatched] = useState(false);
  const [isPlaying, setIsPlaying]       = useState(false);
  const [progress, setProgress]         = useState(0);

  // Reset whenever the scene changes
  useEffect(() => {
    setVideoWatched(false);
    setIsPlaying(false);
    setProgress(0);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [scene?.id]);

  if (!scene) return null;

  const roleLabel = getRoleLabel(scene.title);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setVideoWatched(true);
  };

  return (
    <>
      {/* Dark overlay — ocean bg is rendered by parent */}
      <div className="ride-overlay" />

      <motion.div
        className="scene-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 1 }}
      >
        {/* ── ROLE BADGE ── */}
        <motion.div
          className="scene-role-badge"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <span className="scene-role-label">ROLE</span>
          <span className="scene-role-name">{roleLabel}</span>
        </motion.div>

        {/* ── SITUATION ── */}
        <motion.div
          className="scene-situation"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.8 }}
        >
          {scene.situation}
        </motion.div>

        {/* ── INLINE VIDEO PLAYER ── */}
        <motion.div
          className="scene-video-wrap"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <video
            ref={videoRef}
            className="scene-video-el"
            src={scene.videoSrc}
            playsInline
            preload="metadata"
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnded}
          />

          {/* Play overlay — shown when not yet played */}
          {!isPlaying && !videoWatched && (
            <motion.div
              className="scene-video-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <button className="scene-play-btn" onClick={handlePlay} aria-label="Play video">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </button>
              <p className="scene-video-hint">Watch the scene before choosing your response</p>
            </motion.div>
          )}

          {/* Replay overlay — shown when video finished */}
          {videoWatched && !isPlaying && (
            <motion.div
              className="scene-video-overlay scene-video-overlay--watched"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <button className="scene-play-btn scene-play-btn--replay" onClick={handleReplay} aria-label="Replay video">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 .49-4.14" />
                </svg>
              </button>
            </motion.div>
          )}

          {/* Progress bar */}
          {isPlaying && (
            <div className="scene-video-progress">
              <div className="scene-video-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          )}
        </motion.div>

        {/* ── CHOICES (only after video watched) ── */}
        <AnimatePresence>
          {videoWatched ? (
            <motion.div
              className="choices-grid"
              key="choices"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
              }}
            >
              {scene.choices.map((choice, index) => (
                <ChoiceCard
                  key={index}
                  choice={choice}
                  onSelect={onChoice}
                  disabled={showFeedback}
                />
              ))}
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              className="scene-watch-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              ↑ Watch the video above to unlock your choices
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {showFeedback && (
          <ResultOverlay choice={selectedChoice} onContinue={onContinue} />
        )}
      </AnimatePresence>
    </>
  );
}
