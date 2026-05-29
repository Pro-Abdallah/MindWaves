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
                  <div style={{ position: 'absolute', top: '120px', left: '50%', transform: 'translateX(-50%)', opacity: 0.3, fontSize: '12px', letterSpacing: '0.2em' }}>
                    {messages.length} BOTTLES DRIFTING
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

