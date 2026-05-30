import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import HTMLFlipBook from 'react-pageflip'
import './ComicStory.css'

/**
 * ComicStory
 * Book-flip experience using react-pageflip.
 * Responsive: portrait (single-page) on mobile, two-page spread on desktop.
 */
export default function ComicStory({ story }) {
  const bookRef = useRef(null)
  const [page, setPage]       = useState(0)
  const [flipping, setFlipping] = useState(false)
  const [bookSize, setBookSize] = useState({ width: 380, height: 520, portrait: false })
  const total = story.pages.length

  const containerRef = useRef(null)

  // ── Compute responsive book dimensions ──────────────────────────────────
  useEffect(() => {
    // Focus the container so arrow keys work immediately
    if (containerRef.current) {
      containerRef.current.focus()
    }
    const calc = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight

      if (vw < 640) {
        // Mobile: single-page portrait mode, fill ~90% of available width
        const maxW = Math.min(vw * 0.88, 360)
        const maxH = Math.min(vh * 0.58, 500)
        setBookSize({ width: maxW, height: maxH, portrait: true })
      } else if (vw < 1024) {
        // Tablet: slightly smaller two-page spread
        const maxW = Math.min(vw * 0.42, 340)
        const maxH = Math.min(vh * 0.55, 480)
        setBookSize({ width: maxW, height: maxH, portrait: false })
      } else {
        // Desktop: full two-page spread
        setBookSize({ width: 380, height: 520, portrait: false })
      }
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  const onFlip = useCallback(e => {
    setPage(e.data)
    setFlipping(false)
  }, [])

  const goNext = useCallback(() => {
    if (page < total - 1) {
      setFlipping(true)
      bookRef.current?.pageFlip().flipNext()
    }
  }, [page, total])

  const goPrev = useCallback(() => {
    if (page > 0) {
      setFlipping(true)
      bookRef.current?.pageFlip().flipPrev()
    }
  }, [page])

  const handleKeyDown = useCallback(e => {
    if (e.key === 'ArrowRight') goNext()
    if (e.key === 'ArrowLeft')  goPrev()
  }, [goNext, goPrev])

  const progressPct = total > 1 ? (page / (total - 1)) * 100 : 0

  return (
    <div className="comic-story" onKeyDown={handleKeyDown} tabIndex={0} ref={containerRef}>



      {/* Book container */}
      <motion.div
        className="comic-book-wrap"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        style={{ '--accent': story.color, '--glow': story.glowColor }}
      >
        {/* Page glow */}
        <div className="comic-glow" />

        <HTMLFlipBook
          key={`${bookSize.width}-${bookSize.portrait}`} // re-mount when size changes
          ref={bookRef}
          width={bookSize.width}
          height={bookSize.height}
          size="fixed"
          minWidth={180}
          maxWidth={500}
          minHeight={260}
          maxHeight={680}
          showCover={true}
          mobileScrollSupport={true}
          onFlip={onFlip}
          onChangeState={s => { if (s.data === 'flipping') setFlipping(true) }}
          className="comic-flipbook"
          flippingTime={700}
          usePortrait={bookSize.portrait}
          startPage={0}
          drawShadow={true}
          maxShadowOpacity={0.6}
          useMouseEvents={true}
          swipeDistance={30}
        >
          {story.pages.map((src, i) => (
            <div key={i} className="comic-page">
              <img
                src={src}
                alt={`Page ${i + 1}`}
                className="comic-page-img"
                draggable={false}
              />
              <div className="comic-page-num">
                {i === 0 ? 'Cover' : i === story.pages.length - 1 ? 'End' : i}
              </div>
            </div>
          ))}
        </HTMLFlipBook>

        {/* Page flip indicator */}
        <AnimatePresence>
          {flipping && (
            <motion.div
              className="flip-indicator"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{ color: story.color }}
            >
              ↻
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Navigation */}
      <motion.div
        className="comic-nav"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        style={{ '--accent': story.color }}
      >
        <motion.button
          className="comic-nav-btn"
          onClick={goPrev}
          disabled={page === 0}
          whileHover={{ scale: 1.08, x: -2 }}
          whileTap={{ scale: 0.93 }}
          aria-label="Previous page"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Prev</span>
        </motion.button>

        <div className="comic-progress-wrap">
          <div className="comic-progress-track">
            <motion.div
              className="comic-progress-fill"
              style={{ width: `${progressPct}%`, background: story.color }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <span className="comic-page-count" style={{ color: story.color }}>
            {page === 0 ? 'Cover' : page === total - 1 ? 'The End' : `Page ${page} of ${total - 2}`}
          </span>
        </div>

        <motion.button
          className="comic-nav-btn"
          onClick={goNext}
          disabled={page >= total - 1}
          whileHover={{ scale: 1.08, x: 2 }}
          whileTap={{ scale: 0.93 }}
          aria-label="Next page"
        >
          <span>Next</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </motion.button>
      </motion.div>

      {/* Keyboard hint — hidden on touch devices */}
      <motion.p
        className="comic-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        {bookSize.portrait
          ? 'Swipe or use the buttons to turn pages'
          : 'Use ← → arrow keys or click the page edges to turn'}
      </motion.p>
    </div>
  )
}
