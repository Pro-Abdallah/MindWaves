import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import WaveSurfer from 'wavesurfer.js'
import './AudioStory.css'

/**
 * AudioStory
 * Immersive audio player with WaveSurfer waveform, live subtitles,
 * ambient particles, and cinematic atmosphere.
 */
export default function AudioStory({ story }) {
  const containerRef = useRef(null)
  const wsRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [currentSub, setCurrentSub] = useState(null)
  const [loadError, setLoadError] = useState(false)

  // Init WaveSurfer
  useEffect(() => {
    if (!containerRef.current) return

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: 'rgba(145,191,246,0.3)',
      progressColor: story.color,
      cursorColor: story.color,
      barWidth: 3,
      barGap: 2,
      barRadius: 3,
      height: 80,
      normalize: true,
      backend: 'WebAudio',
    })

    ws.on('ready', () => {
      setReady(true)
      setDuration(ws.getDuration())
    })

    ws.on('audioprocess', t => {
      setCurrentTime(t)
    })

    ws.on('finish', () => {
      setPlaying(false)
      setCurrentTime(0)
    })

    ws.on('error', () => setLoadError(true))

    ws.load(story.src)
    ws.setVolume(volume)
    wsRef.current = ws

    return () => ws.destroy()
  }, [story.src, story.color])

  // Sync subtitles
  useEffect(() => {
    if (!story.subtitles) return
    const sub = story.subtitles.find(
      s => currentTime >= s.start && currentTime < s.end
    )
    setCurrentSub(sub || null)
  }, [currentTime, story.subtitles])

  const togglePlay = useCallback(() => {
    if (!wsRef.current || !ready) return
    wsRef.current.playPause()
    setPlaying(p => !p)
  }, [ready])

  const handleVolume = useCallback(e => {
    const v = parseFloat(e.target.value)
    setVolume(v)
    wsRef.current?.setVolume(v)
  }, [])

  const handleSeek = useCallback(e => {
    if (!wsRef.current || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    wsRef.current.seekTo(ratio)
    setCurrentTime(ratio * duration)
  }, [duration])

  const fmt = s => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div className="audio-story">
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
        <div className="audio-eq-bars">
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

        {/* WaveSurfer container */}
        <div
          className="waveform-container"
          ref={containerRef}
          onClick={handleSeek}
          style={{ cursor: ready ? 'pointer' : 'default' }}
        />

        {/* Loading state */}
        {!ready && !loadError && (
          <div className="audio-loading">
            <motion.div
              className="loading-dot"
              animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={{ background: story.color }}
            />
            <span>Loading audio…</span>
          </div>
        )}

        {loadError && (
          <div className="audio-loading">
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
            style={{ '--accent': story.color }}
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

        {/* Progress bar */}
        <div className="audio-progress-track" onClick={handleSeek}>
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
