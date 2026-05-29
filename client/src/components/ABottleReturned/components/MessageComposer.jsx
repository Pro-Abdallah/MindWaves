import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function MessageComposer({ onSubmit, onCancel }) {
  const [text, setText] = useState('');
  const [animState, setAnimState] = useState('hidden'); 
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    setAnimState('opening');
    const timer = setTimeout(() => {
      setAnimState('composing');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async () => {
    if (!text.trim() || animState !== 'composing') return;
    setAnimState('packing');
    setTimeout(() => {
      setAnimState('throwing');
      setTimeout(async () => {
        await onSubmit(text);
      }, 2000); 
    }, 1200); 
  };

  // Responsive paper dimensions
  const paperWidth  = isMobile ? Math.min(window.innerWidth - 40, 420) : 500;
  const paperOffset = paperWidth / 2;

  const bottleVariants = {
    hidden:    { y: 300,  scale: 0,   rotate: -30, opacity: 0 },
    opening:   { y: isMobile ? 100 : 150, scale: 1, rotate: 0, opacity: 1, transition: { duration: 1, type: 'spring' } },
    composing: { y: isMobile ? 200 : 250, scale: 0.8, rotate: 10, opacity: 0.8, transition: { duration: 1 } },
    packing:   { y: isMobile ? 100 : 150, scale: 1,  rotate: 0, opacity: 1,  transition: { duration: 1 } },
    throwing:  { y: -300, scale: 0.2, rotate: 180, opacity: 0, transition: { duration: 2, ease: 'easeInOut' } }
  };

  const paperVariants = {
    hidden:    { y: 50,   scale: 0.1, opacity: 0, zIndex: 5 },
    opening:   { y: -150, scale: 0.5, opacity: 1, zIndex: 15, transition: { duration: 1, delay: 0.5 } },
    composing: { y: isMobile ? -30 : -50, scale: 1, opacity: 1, zIndex: 20, transition: { duration: 0.8, type: 'spring' } },
    packing:   { y: 50,   scale: 0.1, opacity: 0, zIndex: 5, transition: { duration: 1 } },
    throwing:  { y: 50,   scale: 0,   opacity: 0 }
  };

  return (
    <div 
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
        animate={{ opacity: animState === 'throwing' ? 0 : 0.8 }}
        transition={{ duration: 1 }}
        style={{
          position: 'absolute',
          inset: 0,
          background: '#01050A',
          zIndex: 1
        }}
        onClick={animState === 'composing' ? onCancel : undefined}
      />

      {/* Interactive Canvas */}
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        maxWidth: '600px', 
        height: isMobile ? '500px' : '600px',
        zIndex: 10,
        padding: '0 16px',
        boxSizing: 'border-box'
      }}>
        
        {/* The Realistic Bottle */}
        <motion.img 
          src="/realistic-bottle.png"
          variants={bottleVariants}
          initial="hidden"
          animate={animState}
          style={{
            position: 'absolute',
            left: '50%',
            marginLeft: isMobile ? '-80px' : '-100px',
            width: isMobile ? '160px' : '200px',
            zIndex: 10,
            filter: `drop-shadow(0 0 30px rgba(255,255,255,0.4))`
          }}
        />

        {/* The Glass Paper / Message Canvas */}
        <motion.div 
          variants={paperVariants}
          initial="hidden"
          animate={animState}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginLeft: `-${paperOffset}px`,
            marginTop: isMobile ? '-160px' : '-200px',
            width: `${paperWidth}px`,
            background: 'rgba(250, 248, 245, 0.97)',
            backdropFilter: 'blur(10px)',
            border: `1px solid rgba(255, 255, 255, 0.5)`,
            boxShadow: `0 20px 50px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.8)`,
            borderRadius: '12px',
            padding: isMobile ? '24px' : '40px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            boxSizing: 'border-box',
            pointerEvents: animState === 'composing' ? 'auto' : 'none'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ 
              margin: 0, 
              fontSize: isMobile ? '17px' : '20px', 
              fontWeight: 500, 
              color: '#111', 
              letterSpacing: '0.05em' 
            }}>
              Your Message
            </h2>
            <button 
              onClick={onCancel}
              aria-label="Close composer"
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#666', 
                cursor: 'pointer', 
                fontSize: '20px',
                padding: '4px 8px',
                lineHeight: 1,
                minWidth: '44px',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
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
              height: isMobile ? '120px' : '180px',
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid rgba(0,0,0,0.1)',
              color: '#333',
              fontSize: isMobile ? '15px' : '18px',
              lineHeight: '1.6',
              resize: 'none',
              outline: 'none',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              paddingBottom: '12px'
            }}
          />

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <motion.button
              onClick={handleSubmit}
              disabled={!text.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: isMobile ? '10px 24px' : '12px 32px',
                background: '#111',
                color: '#fff',
                border: 'none',
                borderRadius: '30px',
                fontSize: isMobile ? '12px' : '14px',
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: !text.trim() ? 'not-allowed' : 'pointer',
                opacity: !text.trim() ? 0.5 : 1,
                boxShadow: `0 0 20px rgba(0,0,0,0.3)`,
                minHeight: '44px',
                touchAction: 'manipulation'
              }}
            >
              Seal &amp; Send
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
