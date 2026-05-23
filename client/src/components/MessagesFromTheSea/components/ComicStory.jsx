import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import HTMLFlipBook from 'react-pageflip'
import './ComicStory.css'

/**
 * ComicStory
 * Book-flip experience using react-pageflip.
 * Features: page flip, progress indicator, keyboard nav, ambient glow.
 */
export default function ComicStory({ story }) {
  const bookRef = useRef(null)
  const [page, setPage] = useState(0)
  const [flipping, setFlipping] = useState(false)
  const total = story.pages.length

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
    if (e.key === 'ArrowLeft') goPrev()
  }, [goNext, goPrev])

  const progressPct = total > 1 ? (page / (total - 1)) * 100 : 0

  return (
    <div className="comic-story" onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Header */}
      <motion.div
        className="comic-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="comic-badge" style={{ color: story.color }}>
          ◈ Illustrated Story
        </div>
        <h2 className="comic-title">Turn the Page</h2>
        <p className="comic-desc">{story.description}</p>
      </motion.div>

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
          ref={bookRef}
          width={380}
          height={520}
          size="fixed"
          minWidth={220}
          maxWidth={500}
          minHeight={300}
          maxHeight={680}
          showCover={true}
          mobileScrollSupport={true}
          onFlip={onFlip}
          onChangeState={s => { if (s.data === 'flipping') setFlipping(true) }}
          className="comic-flipbook"
          flippingTime={700}
          usePortrait={false}
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
              {/* Page number */}
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

      {/* Keyboard hint */}
      <motion.p
        className="comic-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        Use ← → arrow keys or click the page edges to turn
      </motion.p>
    </div>
  )
}
