import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OceanBackground from './components/OceanBackground';
import MessageComposer from './components/MessageComposer';
import FloatingMessages from './components/FloatingMessages';
import BottleModal from './components/BottleModal';
import { useBottleMessages } from './hooks/useBottleMessages';
import './ABottleReturned.css';

export default function ABottleReturned() {
  const { messages, isLoading, error, fetchMessages, sendMessage } = useBottleMessages();
  const [viewState, setViewState] = useState('browsing'); // 'browsing', 'composing'
  const [selectedBottle, setSelectedBottle] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return (
    <div className="bottle-returned-container">
      <OceanBackground isBlurred={viewState === 'composing' || selectedBottle !== null} />
      
      <div className="bottle-ui-layer">
        
        {/* Header / Actions */}
        {viewState === 'browsing' && (
          <motion.button 
            className="write-message-btn"
            onClick={() => setViewState('composing')}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
            Write a Message
          </motion.button>
        )}

        <AnimatePresence mode="wait">
          {viewState === 'browsing' && (
            <motion.div 
              key="browsing"
              className="browsing-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ width: '100%', height: '100%' }}
            >
              {isLoading && messages.length === 0 ? (
                <div style={{ textAlign: 'center', opacity: 0.5, marginTop: '20vh' }}>
                  <p>Searching the sea...</p>
                </div>
              ) : error ? (
                <div style={{ textAlign: 'center', color: '#ff6b6b', marginTop: '20vh' }}>
                  <p>Error connecting to the sea: {error}</p>
                </div>
              ) : messages.length === 0 ? (
                <div style={{ textAlign: 'center', opacity: 0.5, marginTop: '20vh' }}>
                  <p>The sea is completely calm.</p>
                  <p style={{ fontSize: '12px' }}>No messages found yet. Be the first to write one.</p>
                </div>
              ) : (
                <>
                  <div style={{
                    position: 'absolute',
                    top: '12vh',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                    zIndex: 10
                  }}>
                    <div style={{
                      opacity: 0.5,
                      fontSize: '12px',
                      letterSpacing: '0.25em',
                      whiteSpace: 'nowrap',
                      textTransform: 'uppercase',
                      color: '#e0e0e0'
                    }}>
                      {messages.length} Bottles Drifting
                    </div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1, duration: 1 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: 'rgba(163, 217, 232, 0.08)',
                        border: '1px solid rgba(163, 217, 232, 0.25)',
                        borderRadius: '100px',
                        padding: '10px 24px',
                        backdropFilter: 'blur(12px)',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                        color: '#a3d9e8'
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                      <span style={{
                        fontSize: 'clamp(14px, 1.8vw, 16px)',
                        fontWeight: 400,
                        letterSpacing: '0.05em',
                        whiteSpace: 'nowrap'
                      }}>
                        Tap any drifting bottle to read its message
                      </span>
                    </motion.div>
                  </div>
                  <FloatingMessages 
                    messages={messages} 
                    onBottleClick={(msg) => setSelectedBottle(msg)} 
                  />
                </>
              )}
            </motion.div>
          )}

          {viewState === 'composing' && (
            <motion.div 
              key="composing"
              className="composing-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { delay: 1 } }}
            >
              <MessageComposer 
                onSubmit={async (text) => {
                  await sendMessage(text);
                  setViewState('browsing');
                }}
                onCancel={() => setViewState('browsing')}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedBottle && (
            <BottleModal 
              message={selectedBottle} 
              onClose={() => setSelectedBottle(null)} 
            />
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

