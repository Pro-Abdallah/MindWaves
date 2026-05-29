import React from 'react';
import { motion } from 'framer-motion';

export default function BottleModal({ message, onClose }) {
  if (!message) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200, 
      }}
    >
      {/* Background Blur Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(1, 5, 10, 0.7)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          cursor: 'pointer'
        }}
      />

      {/* The Paper Message Content */}
      <motion.div
        initial={{ y: 50, scale: 0.9, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 50, scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        style={{
          position: 'relative',
          zIndex: 10,
          width: '90%',
          maxWidth: '500px',
          background: 'rgba(250, 248, 245, 0.95)',
          border: `1px solid rgba(255, 255, 255, 0.3)`,
          boxShadow: `0 30px 60px rgba(0,0,0,0.5), inset 0 0 30px rgba(255,255,255,0.5)`,
          borderRadius: '12px',
          padding: '50px 40px',
          color: '#111',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '30px'
        }}
      >
        <button 
          onClick={onClose}
          style={{ 
            position: 'absolute', 
            top: '20px', 
            right: '20px', 
            background: 'none', 
            border: 'none', 
            fontSize: '24px', 
            color: '#666',
            cursor: 'pointer',
            transition: 'color 0.2s'
          }}
        >
          ✕
        </button>

        <div style={{ textAlign: 'center', borderBottom: `1px solid rgba(0,0,0,0.1)`, paddingBottom: '20px', width: '100%' }}>
          <p style={{ margin: 0, fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#666' }}>
            A message from the sea
          </p>
        </div>

        <p style={{ 
          fontSize: '20px', 
          lineHeight: '1.8', 
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
          textAlign: 'center',
          margin: 0,
          color: '#222'
        }}>
          "{message.text}"
        </p>

        <div style={{ 
          width: '40px', 
          height: '40px', 
          borderRadius: '50%', 
          background: '#111',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '10px',
          boxShadow: `0 0 20px rgba(0,0,0,0.2)`
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
      </motion.div>
    </div>
  );
}
