import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import OceanBackground from './components/OceanBackground';
import PaperMessageCard from './components/PaperMessageCard';
import WriteMessageCard from './components/WriteMessageCard';
import { useBottleMessages } from './hooks/useBottleMessages';
import './ABottleReturned.css';

export default function ABottleReturned() {
  const { messages, isLoading, error, fetchMessages } = useBottleMessages();

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return (
    <div className="bottle-returned-container">
      <OceanBackground isBlurred={false} />
      
      <div className="bottle-ui-layer scrollable-list-layer">
        
        <motion.div 
          className="voices-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="bottle-eyebrow">
            <span className="bottle-wave-icon">〰</span>
            A Bottle Returned
            <span className="bottle-wave-icon">〰</span>
          </div>
          <h2 className="voices-title">VOICES CARRIED BY THE CURRENT</h2>
        </motion.div>

        <WriteMessageCard />

        <div className="messages-list-container">

          {isLoading && messages.length === 0 ? (
            <div className="sea-status">
              <p>Searching the sea...</p>
            </div>
          ) : error ? (
            <div className="sea-status error">
              <p>Error connecting to the sea: {error}</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="sea-status">
              <p>The sea is completely calm.</p>
            </div>
          ) : (
            <div className="messages-list">
              {messages.map((msg, index) => (
                <PaperMessageCard key={msg.id} message={msg} index={index} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

