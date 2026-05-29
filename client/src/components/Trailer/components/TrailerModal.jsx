import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// YouTube embed ID
const VIDEO_ID = 'RrWBhVlD1H8';

export default function TrailerModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="trailer-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          onClick={onClose}
        >
          <motion.div
            className="trailer-modal-inner"
            initial={{ scale: 0.88, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="trailer-modal-close"
              onClick={onClose}
              aria-label="Close trailer"
            >
              ✕
            </button>

            {/* 16:9 ratio container */}
            <div className="trailer-modal-ratio">
              <iframe
                className="trailer-modal-iframe"
                src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&color=white`}
                title="MindWaves Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
