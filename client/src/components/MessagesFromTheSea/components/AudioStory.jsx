import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './AudioStory.css'

/**
 * AudioStory
 * Immersive audio player with native playback, live subtitles,
 * ambient particles, and cinematic atmosphere.
 */
export default function AudioStory({ story }) {
  const audioRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [currentSub, setCurrentSub] = useState(null)
  const [loadError, setLoadError] = useState(false)

  // Force stop audio when unmounted
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  // Bulletproof ready state checking
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const checkReady = () => {
      if (audio.readyState >= 3) {
        setReady(true)
        setDuration(audio.duration)
      }
    }

    checkReady()
    audio.addEventListener('canplay', checkReady)
    audio.addEventListener('loadeddata', checkReady)
    audio.addEventListener('loadedmetadata', checkReady)
    
    // Update time continuously
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }
    audio.addEventListener('timeupdate', onTimeUpdate)
    
    const onEnded = () => {
      setPlaying(false)
      setCurrentTime(0)
    }
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('canplay', checkReady)
      audio.removeEventListener('loadeddata', checkReady)
      audio.removeEventListener('loadedmetadata', checkReady)
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('ended', onEnded)
    }
  }, [story.src])

  // Sync subtitles
  useEffect(() => {
    if (!story.subtitles) return
    const sub = story.subtitles.find(
      s => currentTime >= s.start && currentTime < s.end
    )
    setCurrentSub(sub || null)
  }, [currentTime, story.subtitles])

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !ready) return
    if (audioRef.current.paused) {
      audioRef.current.play()
      setPlaying(true)
    } else {
      audioRef.current.pause()
      setPlaying(false)
    }
  }, [ready])

  const handleVolume = useCallback(e => {
    const v = parseFloat(e.target.value)
    setVolume(v)
    if (audioRef.current) {
      audioRef.current.volume = v
    }
  }, [])

  const handleSeek = useCallback(e => {
    if (!audioRef.current || !duration) return

    const trackElement = e.currentTarget

    const updateTime = (clientX) => {
      const rect = trackElement.getBoundingClientRect()
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      const newTime = ratio * duration
      
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }

    updateTime(e.clientX)

    const onMove = (moveEvent) => {
      updateTime(moveEvent.clientX)
    }

    const onUp = () => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onUp)
    }

    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onUp)
  }, [duration])

  const fmt = s => {
    if (!s || isNaN(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div className="audio-story">
      {/* Audio element for fast streaming */}
      <audio
        ref={audioRef}
        src={story.src}
        preload="auto"
        onError={() => setLoadError(true)}
      />

      {/* Ambient particle field */}
      <div className="audio-particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="audio-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              background: story.color,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.6, 0.1],
              scale: [1, 1.4, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Story header */}
      <motion.div
        className="audio-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="audio-badge" style={{ color: story.color }}>
          ♪ Audio Story
        </div>
        <h2 className="audio-title">A Voice From the Depths</h2>
        <p className="audio-desc">{story.description}</p>
      </motion.div>

      {/* Player card */}
      <motion.div
        className="audio-player-card"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.2 }}
        style={{ '--accent': story.color }}
      >
        {/* Equalizer visual when playing */}
        <div className="audio-eq-bars" style={{ minHeight: '80px' }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="eq-bar"
              style={{ background: story.color }}
              animate={playing ? {
                scaleY: [0.3, 1, 0.5, 0.8, 0.2, 1, 0.4],
              } : { scaleY: 0.2 }}
              transition={{
                duration: 0.8 + Math.random() * 0.4,
                repeat: Infinity,
                delay: i * 0.06,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Loading state */}
        {!ready && !loadError && (
          <div className="audio-loading" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <motion.div
              className="loading-dot"
              animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={{ background: story.color }}
            />
            <span>Loading stream…</span>
          </div>
        )}

        {loadError && (
          <div className="audio-loading" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <span style={{ color: '#ff6b6b' }}>⚠ Could not load audio file</span>
          </div>
        )}

        {/* Controls row */}
        <div className="audio-controls">
          <span className="audio-time">{fmt(currentTime)}</span>

          <motion.button
            className="audio-play-btn"
            onClick={togglePlay}
            disabled={!ready}
            style={{ '--accent': story.color, opacity: ready ? 1 : 0.5 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            aria-label={playing ? 'Pause' : 'Play'}
          >
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
          </motion.button>

          <span className="audio-time">{fmt(duration)}</span>

          {/* Volume */}
          <div className="audio-volume">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={volume}
              onChange={handleVolume}
              className="volume-slider"
              style={{ '--accent': story.color }}
            />
          </div>
        </div>

        {/* Progress bar overlay */}
        <div className="audio-progress-track" onPointerDown={handleSeek} style={{ cursor: ready ? 'pointer' : 'default' }}>
          <motion.div
            className="audio-progress-fill"
            style={{
              width: duration ? `${(currentTime / duration) * 100}%` : '0%',
              background: story.color,
            }}
          />
        </div>
      </motion.div>

      {/* Subtitle display */}
      <AnimatePresence mode="wait">
        {currentSub && (
          <motion.div
            key={currentSub.text}
            className="audio-subtitle"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            style={{ borderColor: story.color + '60' }}
          >
            <span className="subtitle-bar" style={{ background: story.color }} />
            <p>{currentSub.text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
