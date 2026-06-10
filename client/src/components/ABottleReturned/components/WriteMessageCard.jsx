import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './PaperMessageCard.css';
import './WriteMessageCard.css';

export default function WriteMessageCard() {
  const [isWriting, setIsWriting] = useState(false);
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setIsWriting(false);
      setText('');
      setSubmitted(false);
    }, 3000);
  };

  if (!isWriting) {
    return (
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button 
          className="write-message-btn"
          onClick={() => setIsWriting(true)}
        >
          Write a Message
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      className="paper-message-card"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{ marginBottom: '40px' }}
    >
      <div className="paper-texture"></div>
      <div className="paper-tape top-left"></div>
      <div className="paper-tape bottom-right"></div>
      
      {!submitted ? (
        <form onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <textarea
            className="paper-text write-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your message here... it will be cast into the sea."
            rows={4}
            autoFocus
          ></textarea>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button 
              type="button" 
              onClick={() => setIsWriting(false)}
              className="write-action-btn cancel-btn"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="write-action-btn submit-btn"
              disabled={!text.trim()}
            >
              Cast to Sea
            </button>
          </div>
        </form>
      ) : (
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '20px 0' }}>
          <p className="paper-text" style={{ fontStyle: 'italic', color: '#8c7e5a' }}>
            Your message has been cast into the sea...
          </p>
        </div>
      )}
    </motion.div>
  );
}
