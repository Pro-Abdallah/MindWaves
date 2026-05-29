import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function MessageComposer({ onSubmit, onCancel }) {
  const [text, setText] = useState('');
  const [animState, setAnimState] = useState('hidden'); 
  // States: 'hidden' -> 'opening' -> 'composing' -> 'packing' -> 'throwing'
  
  useEffect(() => {
    // Start the cinematic entrance automatically
    setAnimState('opening');
    const timer = setTimeout(() => {
      setAnimState('composing');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async () => {
    if (!text.trim() || animState !== 'composing') return;
    
    // 1. Paper slides back into bottle
    setAnimState('packing');
    
    // 2. Bottle throws into the sea
    setTimeout(() => {
      setAnimState('throwing');
      
      // 3. Actually submit
      setTimeout(async () => {
        await onSubmit(text);
      }, 2000); 
    }, 1200); 
  };

  // --- Animation Variants ---
  
  const bottleVariants = {
    hidden: { y: 300, scale: 0, rotate: -30, opacity: 0 },
    opening: { y: 150, scale: 1, rotate: 0, opacity: 1, transition: { duration: 1, type: 'spring' } },
    composing: { y: 250, scale: 0.8, rotate: 10, opacity: 0.8, transition: { duration: 1 } },
    packing: { y: 150, scale: 1, rotate: 0, opacity: 1, transition: { duration: 1 } },
    throwing: { 
      y: -300, 
      scale: 0.2, 
      rotate: 180, 
      opacity: 0, 
      transition: { duration: 2, ease: "easeInOut" } 
    }
  };

  const paperVariants = {
    hidden: { y: 50, scale: 0.1, opacity: 0, zIndex: 5 },
    opening: { y: -150, scale: 0.5, opacity: 1, zIndex: 15, transition: { duration: 1, delay: 0.5 } },
    composing: { y: -50, scale: 1, opacity: 1, zIndex: 20, transition: { duration: 0.8, type: 'spring' } },
    packing: { y: 50, scale: 0.1, opacity: 0, zIndex: 5, transition: { duration: 1 } },
    throwing: { y: 50, scale: 0, opacity: 0 } // hidden inside bottle
  };

  return (
    <div 
      className="composer-container"
      style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        pointerEvents: animState === 'throwing' ? 'none' : 'auto'
      }}
    >
      {/* Dark overlay backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: animState === 'throwing' ? 0 : 0.7 }}
        transition={{ duration: 1 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#01050A',
          zIndex: 1
        }}
        onClick={animState === 'composing' ? onCancel : undefined}
      />

      {/* Interactive Canvas */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '600px', height: '600px', zIndex: 10 }}>
        
        {/* The Realistic Bottle */}
        <motion.img 
          src="/realistic-bottle.png"
          variants={bottleVariants}
          initial="hidden"
          animate={animState}
          style={{
            position: 'absolute',
            left: '50%',
            marginLeft: '-100px', // Assuming ~200px wide
            width: '200px',
            zIndex: 10,
            filter: `drop-shadow(0 0 30px rgba(255,255,255,0.4))`
          }}
        />

        {/* The Glass Paper / Message Canvas */}
        <motion.div 
          className="glass-paper"
          variants={paperVariants}
          initial="hidden"
          animate={animState}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginLeft: '-250px',
            marginTop: '-200px',
            width: '500px',
            background: 'rgba(250, 248, 245, 0.95)',
            backdropFilter: 'blur(10px)',
            border: `1px solid rgba(255, 255, 255, 0.5)`,
            boxShadow: `0 20px 50px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.8)`,
            borderRadius: '12px',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            pointerEvents: animState === 'composing' ? 'auto' : 'none'
          }}
        >
          <div className="composer-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 500, color: '#111', letterSpacing: '0.05em' }}>
              Your Message
            </h2>
            <button 
              onClick={onCancel}
              style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '18px' }}
            >
              ✕
            </button>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind? Cast it into the sea..."
            style={{
              width: '100%',
              height: '180px',
              background: 'transparent',
              border: 'none',
              color: '#333',
              fontSize: '18px',
              lineHeight: '1.6',
              resize: 'none',
              outline: 'none',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400
            }}
          />

          <div className="composer-actions" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
            <motion.button
              onClick={handleSubmit}
              disabled={!text.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '12px 32px',
                background: '#111',
                color: '#fff',
                border: 'none',
                borderRadius: '30px',
                fontSize: '14px',
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: !text.trim() ? 'not-allowed' : 'pointer',
                opacity: !text.trim() ? 0.5 : 1,
                boxShadow: `0 0 20px rgba(0,0,0,0.3)`
              }}
            >
              Seal & Send
            </motion.button>
          </div>
        </motion.div>
        
      </div>
    </div>
  );
}
