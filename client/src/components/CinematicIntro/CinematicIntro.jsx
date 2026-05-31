import { useState, useRef, useEffect, useCallback } from 'react'
import './CinematicIntro.css'

const firstHalfSrc  = 'https://res.cloudinary.com/dwgbbvjbz/video/upload/Intro_2_pef8yr.mp4'
const secondHalfSrc = 'https://res.cloudinary.com/dwgbbvjbz/video/upload/Whole_Message_m0wrrn.mp4'

function IconVolumeOn() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  )
}

function IconVolumeMute() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  )
}

function Loader() {
  return (
    <div className="ci-loader" role="status" aria-label="Loading experience">
      <div className="ci-loader__ring" aria-hidden="true" />
      <p className="ci-loader__text">Loading Experience</p>
    </div>
  )
}

function SoundToggle({ muted, onToggle }) {
  return (
    <button
      className="ci-sound-btn"
      onClick={onToggle}
      aria-label={muted ? 'Unmute video' : 'Mute video'}
      title={muted ? 'Click to unmute' : 'Click to mute'}
    >
      <span className="ci-sound-btn__icon">
        {muted ? <IconVolumeMute /> : <IconVolumeOn />}
      </span>
      <span className="ci-sound-btn__label">
        {muted ? 'Unmute' : 'Mute'}
      </span>
    </button>
  )
}

function StartButton({ onClick, autoplayFailed }) {
  return (
    <div className="ci-start-wrapper">
      <button
        className="ci-start-btn"
        onClick={onClick}
        aria-label="Start cinematic intro"
      >
        <span className="ci-start-btn__border" aria-hidden="true" />
        <span className="ci-start-btn__inner">
          <span className="ci-start-btn__text">START</span>
          <svg
            className="ci-start-btn__arrow"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </span>
      </button>

      {autoplayFailed && (
        <p className="ci-autoplay-hint">Click to begin your experience</p>
      )}
    </div>
  )
}

function SkipButton({ onClick }) {
  return (
    <button
      className="ci-skip-btn"
      onClick={onClick}
      aria-label="Continue to app"
    >
      <span className="ci-skip-btn__label">Next</span>
      <svg
        className="ci-skip-btn__icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  )
}

function IntroNavbar() {
  return (
    <div className="ci-navbar-strip" aria-label="MindWaves navigation">
      <img src="/logo 1.png"         alt="MindWaves Logo" className="ci-navbar-logo-img" />
      <img src="/mind waves png.png" alt="MindWaves"      className="ci-navbar-logo-text" />
    </div>
  )
}

export default function CinematicIntro({ onComplete }) {
  const [phase, setPhase]                   = useState('loading')
  const [autoplayFailed, setAutoplayFailed] = useState(false)
  
  // Single sound state that controls audio for the active video
  const [isMuted, setIsMuted]               = useState(false)

  const firstVideoRef  = useRef(null)
  const secondVideoRef = useRef(null)

  // Lock body scroll for duration of intro
  useEffect(() => {
    const prevOverflow   = document.body.style.overflow
    const prevUserSelect = document.body.style.userSelect

    document.body.style.overflow   = 'hidden'
    document.body.style.userSelect = 'none'

    return () => {
      document.body.style.overflow   = prevOverflow
      document.body.style.userSelect = prevUserSelect
    }
  }, [])

  // Sync muted state to first video DOM element
  useEffect(() => {
    const video = firstVideoRef.current
    if (video) video.muted = isMuted
  }, [isMuted])

  // Sync muted state to second video DOM element (when it is running)
  useEffect(() => {
    const video = secondVideoRef.current
    if (video) video.muted = isMuted
  }, [isMuted])

  // Attempt autoplay of first video
  useEffect(() => {
    const video = firstVideoRef.current
    if (!video) return

    const tryPlay = async () => {
      setPhase('firstVideo')
      try {
        video.muted = false
        setIsMuted(false) 
        await video.play()
      } catch {
        setAutoplayFailed(true)
        setPhase('awaitingStart')
      }
    }

    video.addEventListener('canplay', tryPlay, { once: true })
    return () => video.removeEventListener('canplay', tryPlay)
  }, [])

  // Unified audio toggling handler
  const handleSoundToggle = useCallback(() => {
    setIsMuted(prev => !prev)
  }, [])

  // First video finished
  const handleFirstVideoEnd = useCallback(() => {
    setPhase('awaitingStart')
  }, [])

  // Exit intro
  const handleExit = useCallback(() => {
    const v2 = secondVideoRef.current
    if (v2) v2.pause()

    setPhase('exiting')

    setTimeout(() => {
      setPhase('done')
      document.body.style.overflow   = ''
      document.body.style.userSelect = ''
      onComplete?.()
    }, 1100)
  }, [onComplete])

  // Start clicked (User Gesture)
  const handleStart = useCallback(async () => {
    setPhase('secondVideo')
    const video = secondVideoRef.current
    if (!video) return

    // Since the user explicitly clicked Start, we can play with audio (unmuted)
    setIsMuted(false)
    video.muted = false
    video.volume = 1.0

    try {
      await video.play()
    } catch {
      // Fallback if browser blocks
      video.muted = true
      setIsMuted(true)
      try { await video.play() } catch { handleExit() }
    }
  }, [handleExit])

  const handleSecondVideoEnd = useCallback(() => {
    handleExit()
  }, [handleExit])

  if (phase === 'done') return null

  const showFirstVideo  = phase === 'firstVideo' || phase === 'awaitingStart'
  const showSecondVideo = phase === 'secondVideo'
  const isExiting       = phase === 'exiting'

  // Determine if we show sound control
  // Spec: "mute and unmute toggle buttons before start and after start"
  const showSoundControl = phase === 'firstVideo' || phase === 'awaitingStart' || phase === 'secondVideo'

  return (
    <div
      className={`ci-overlay${isExiting ? ' ci-overlay--exiting' : ''}`}
      aria-modal="true"
      role="dialog"
      aria-label="Cinematic intro"
    >
      <div className="ci-scanline" aria-hidden="true" />
      <div className="ci-vignette" aria-hidden="true" />

      {phase === 'loading' && <Loader />}

      <video
        ref={firstVideoRef}
        className={`ci-video${showFirstVideo ? ' ci-video--active' : ''}`}
        src={firstHalfSrc}
        autoPlay
        playsInline
        preload="auto"
        onEnded={handleFirstVideoEnd}
        aria-hidden="true"
      />

      <video
        ref={secondVideoRef}
        className={`ci-video${showSecondVideo ? ' ci-video--active' : ''}`}
        src={secondHalfSrc}
        playsInline
        preload="auto"
        onEnded={handleSecondVideoEnd}
        aria-hidden="true"
      />

      {/* ── Sound toggle button (visible before AND after start) ── */}
      {showSoundControl && (
        <SoundToggle muted={isMuted} onToggle={handleSoundToggle} />
      )}

      {/* ── START button — appears after first video ── */}
      {phase === 'awaitingStart' && (
        <StartButton onClick={handleStart} autoplayFailed={autoplayFailed} />
      )}

      {/* ── SKIP/NEXT button — visible only during second video ── */}
      {phase === 'secondVideo' && (
        <SkipButton onClick={handleExit} />
      )}

      {/* ── Navbar strip — visible during second video ── */}
      {phase === 'secondVideo' && (
        <IntroNavbar />
      )}
    </div>
  )
}
