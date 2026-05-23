import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './VideoStory.css'

/**
 * VideoStory
 * Cinematic custom video player — no default browser controls.
 * Features: custom overlay, play/pause, seek bar, volume, fullscreen.
 */
export default function VideoStory({ story }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [started, setStarted] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const hideTimer = useRef(null)
  const wrapRef = useRef(null)

  const resetHideTimer = useCallback(() => {
    setShowControls(true)
    clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => {
      if (playing) setShowControls(false)
    }, 2800)
  }, [playing])

  useEffect(() => {
    return () => clearTimeout(hideTimer.current)
  }, [])

  const togglePlay = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      v.play()
      setPlaying(true)
      setStarted(true)
    } else {
      v.pause()
      setPlaying(false)
    }
    resetHideTimer()
  }, [resetHideTimer])

  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    setCurrentTime(v.currentTime)
  }, [])

  const handleLoaded = useCallback(() => {
    setDuration(videoRef.current?.duration || 0)
  }, [])

  const handleEnded = useCallback(() => {
    setPlaying(false)
    setShowControls(true)
  }, [])

  const handleSeek = useCallback(e => {
    const v = videoRef.current
    if (!v || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    v.currentTime = ratio * duration
    setCurrentTime(ratio * duration)
    resetHideTimer()
  }, [duration, resetHideTimer])

  const handleVolume = useCallback(e => {
    const v = parseFloat(e.target.value)
    setVolume(v)
    if (videoRef.current) videoRef.current.volume = v
    setMuted(v === 0)
    resetHideTimer()
  }, [resetHideTimer])

  const toggleMute = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
    resetHideTimer()
  }, [resetHideTimer])

  const toggleFullscreen = useCallback(() => {
    const el = wrapRef.current
    if (!document.fullscreenElement) {
      el?.requestFullscreen()
      setFullscreen(true)
    } else {
      document.exitFullscreen()
      setFullscreen(false)
    }
    resetHideTimer()
  }, [resetHideTimer])

  const fmt = s => {
    if (!s || isNaN(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const progress = duration ? (currentTime / duration) * 100 : 0

  return (
    <div className="video-story">
      <motion.div
        className="video-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="video-badge" style={{ color: story.color }}>▶ Video Story</div>
        <h2 className="video-title">A Window Into the Storm</h2>
        <p className="video-desc">{story.description}</p>
      </motion.div>

      <motion.div
        className="video-player-wrap"
        ref={wrapRef}
        initial={{ opacity: 0, scale: 0.96, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2 }}
        onMouseMove={resetHideTimer}
        onMouseLeave={() => playing && setShowControls(false)}
        style={{ '--accent': story.color }}
      >
        {/* Cinematic letter-box bars */}
        <div className="letterbox letterbox-top" />
        <div className="letterbox letterbox-bottom" />

        {/* Video element */}
        <video
          ref={videoRef}
          className="video-el"
          src={story.src}
          poster={story.poster}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoaded}
          onEnded={handleEnded}
          onClick={togglePlay}
          playsInline
          preload="metadata"
        />

        {/* Big play overlay (before start) */}
        <AnimatePresence>
          {!started && (
            <motion.div
              className="video-start-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              onClick={togglePlay}
            >
              <motion.div
                className="video-start-btn"
                style={{ background: story.color }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.93 }}
              >
                <svg viewBox="0 0 24 24" fill="white">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </motion.div>
              <p className="video-start-label">{story.tagline}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls overlay */}
        <AnimatePresence>
          {(showControls || !playing) && started && (
            <motion.div
              className="video-controls-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Gradient scrim */}
              <div className="controls-scrim" />

              {/* Center play/pause */}
              <motion.button
                className="video-center-btn"
                onClick={togglePlay}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={playing ? 'Pause' : 'Play'}
              >
                {playing ? (
                  <svg viewBox="0 0 24 24" fill="white">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </motion.button>

              {/* Bottom bar */}
              <div className="video-bottom-bar">
                {/* Seek */}
                <div className="seek-track" onClick={handleSeek}>
                  <div className="seek-fill" style={{ width: `${progress}%`, background: story.color }} />
                  <div
                    className="seek-thumb"
                    style={{ left: `${progress}%`, background: story.color }}
                  />
                </div>

                <div className="video-controls-row">
                  <button className="vid-btn" onClick={togglePlay} aria-label="Toggle play">
                    {playing ? (
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16" rx="1" />
                        <rect x="14" y="4" width="4" height="16" rx="1" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>

                  <div className="vid-volume-row">
                    <button className="vid-btn" onClick={toggleMute} aria-label="Toggle mute">
                      {muted || volume === 0 ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                          <line x1="23" y1="9" x2="17" y2="15" />
                          <line x1="17" y1="9" x2="23" y2="15" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                        </svg>
                      )}
                    </button>
                    <input
                      type="range" min="0" max="1" step="0.02"
                      value={muted ? 0 : volume}
                      onChange={handleVolume}
                      className="vid-volume-slider"
                      style={{ '--accent': story.color }}
                    />
                  </div>

                  <span className="vid-time">
                    {fmt(currentTime)} / {fmt(duration)}
                  </span>

                  <button className="vid-btn vid-fs-btn" onClick={toggleFullscreen} aria-label="Fullscreen">
                    {fullscreen ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Corner glow */}
        <div className="video-corner-glow" style={{ background: `radial-gradient(circle at 20% 80%, ${story.color}30 0%, transparent 60%)` }} />
      </motion.div>
    </div>
  )
}
