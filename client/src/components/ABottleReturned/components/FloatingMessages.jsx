import React from 'react';
import FloatingBottle from './FloatingBottle';

export default function FloatingMessages({ messages, onBottleClick }) {
  // We want to randomize the positions of the bottles so they float naturally
  // but keep it stable on re-renders, so we can use the message ID as a seed.
  
  const getPseudoRandom = (seed) => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>
      {messages.map((msg, index) => {
        // Generate stable random values for this specific bottle
        const seed = msg.id || index;
        const startY = 20 + getPseudoRandom(seed) * 60; // Random Y between 20% and 80%
        const floatDuration = 40 + getPseudoRandom(seed + 1) * 60; // 40s to 100s
        const floatDelay = getPseudoRandom(seed + 2) * -50; // Random negative delay so they start already on screen
        const wobbleDuration = 4 + getPseudoRandom(seed + 3) * 4; // 4s to 8s
        const scale = 0.6 + getPseudoRandom(seed + 4) * 0.4; // 0.6 to 1.0

        return (
          <FloatingBottle
            key={msg.id || index}
            message={msg}
            onClick={onBottleClick}
            style={{
              top: `${startY}%`,
              left: '-10%', // Start off-screen left
              transform: `scale(${scale})`
            }}
            animation={{
              x: ['0vw', '120vw'],
              transition: {
                x: {
                  duration: floatDuration,
                  repeat: Infinity,
                  ease: "linear",
                  delay: floatDelay
                }
              }
            }}
            wobbleDuration={wobbleDuration}
          />
        );
      })}
    </div>
  );
}
