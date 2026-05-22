import { useState, useRef, useEffect, useCallback } from 'react'
import './CinematicIntro.css'
import firstHalfSrc  from '../../../Assets/FirstHalf.mp4'
import secondHalfSrc from '../../../Assets/SecondHalf.mp4'

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

/** Glassmorphism Skip button shown during second video */
function SkipButton({ onClick }) {
  return (
    <button
      className="ci-skip-btn"
      onClick={onClick}
      aria-label="Skip intro"
    >
      <span className="ci-skip-btn__label">Skip</span>
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
        {/* Double forward chevron */}
        <polyline points="13 17 18 12 13 7" />
        <polyline points="6 17 11 12 6 7" />
      </svg>
    </button>
  )
}

/* ─────────────────────────────────────────────────────────────── */
/*  Main Component                                                  */
/* ─────────────────────────────────────────────────────────────── */

export default function CinematicIntro({ onComplete }) {
  /* ── State ── */
  const [phase, setPhase]                   = useState('loading')
  const [autoplayFailed, setAutoplayFailed] = useState(false)
  // First video starts muted (required for autoplay). User can toggle it.
  const [firstVideoMuted, setFirstVideoMuted] = useState(true)

  /* ── Refs ── */
  const firstVideoRef  = useRef(null)
  const secondVideoRef = useRef(null)

  /* ── Lock body scroll for duration of intro ── */
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

  /* ── Sync muted state → first video DOM element ── */
  useEffect(() => {
    const video = firstVideoRef.current
    if (video) video.muted = firstVideoMuted
  }, [firstVideoMuted])

  /* ── Attempt autoplay of first video when it's ready ── */
  useEffect(() => {
    const video = firstVideoRef.current
    if (!video) return

    const tryPlay = async () => {
      setPhase('firstVideo')
      try {
        // Must start muted for autoplay to succeed
        video.muted = true
        await video.play()
      } catch {
        /*
         * Autoplay was blocked (common on mobile without prior interaction).
         * Show the Start button — clicking it provides the user gesture
         * needed to play with sound.
         */
        setAutoplayFailed(true)
        setPhase('awaitingStart')
      }
    }

    video.addEventListener('canplay', tryPlay, { once: true })
    return () => video.removeEventListener('canplay', tryPlay)
  }, [])

  /* ── Handlers ── */

  /** Toggle mute on the first video */
  const handleSoundToggle = useCallback(() => {
    setFirstVideoMuted(prev => !prev)
  }, [])

  /** First video ended → reveal Start button */
  const handleFirstVideoEnd = useCallback(() => {
    setPhase('awaitingStart')
  }, [])

  /** Exit the intro with a cinematic fade */
  const handleExit = useCallback(() => {
    // Pause second video immediately to stop sound during fade
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

  /**
   * Start button pressed.
   * This IS a user gesture, so we can play the second video WITH SOUND.
   */
  const handleStart = useCallback(async () => {
    setPhase('secondVideo')
    const video = secondVideoRef.current
    if (!video) return

    // ✅ Unmuted — allowed because this runs inside a click handler
    video.muted  = false
    video.volume = 1.0

    try {
      await video.play()
    } catch {
      // If it still fails (e.g. very restrictive browser), fall back muted
      video.muted = true
      try { await video.play() } catch { handleExit() }
    }
  }, [handleExit])

  /** Second video ended → exit naturally */
  const handleSecondVideoEnd = useCallback(() => {
    handleExit()
  }, [handleExit])

  /* ── Early exit when fully done ── */
  if (phase === 'done') return null

  /* ── Derived booleans ── */
  const showFirstVideo  = phase === 'firstVideo' || phase === 'awaitingStart'
  const showSecondVideo = phase === 'secondVideo'
  const isExiting       = phase === 'exiting'

  /* ─────────────────────────────────────────────────────────── */
  /*  Render                                                      */
  /* ─────────────────────────────────────────────────────────── */
  return (
    <div
      className={`ci-overlay${isExiting ? ' ci-overlay--exiting' : ''}`}
      aria-modal="true"
      role="dialog"
      aria-label="Cinematic intro"
    >
      {/* ── Scanline ambient effect ── */}
      <div className="ci-scanline" aria-hidden="true" />

      {/* ── Edge vignette ── */}
      <div className="ci-vignette" aria-hidden="true" />

      {/* ── Loading spinner ── */}
      {phase === 'loading' && <Loader />}

      {/* ── First video (FirstHalf.mp4) ──
          Always rendered for preloading. Starts muted for autoplay. */}
      <video
        ref={firstVideoRef}
        className={`ci-video${showFirstVideo ? ' ci-video--active' : ''}`}
        src={firstHalfSrc}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={handleFirstVideoEnd}
        aria-hidden="true"
      />

      {/* ── Second video (SecondHalf.mp4) ──
          NOT muted — plays with full audio after Start click. */}
      <video
        ref={secondVideoRef}
        className={`ci-video${showSecondVideo ? ' ci-video--active' : ''}`}
        src={secondHalfSrc}
        playsInline
        preload="auto"
        onEnded={handleSecondVideoEnd}
        aria-hidden="true"
      />

      {/* ── Sound toggle during first video ── */}
      {phase === 'firstVideo' && (
        <SoundToggle muted={firstVideoMuted} onToggle={handleSoundToggle} />
      )}

      {/* ── START button — appears after first video ── */}
      {phase === 'awaitingStart' && (
        <StartButton onClick={handleStart} autoplayFailed={autoplayFailed} />
      )}

      {/* ── SKIP button — visible only during second video ── */}
      {phase === 'secondVideo' && (
        <SkipButton onClick={handleExit} />
      )}
    </div>
  )
}
