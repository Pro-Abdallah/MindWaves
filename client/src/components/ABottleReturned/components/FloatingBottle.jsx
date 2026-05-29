import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

export default function FloatingBottle({ message, onClick, style, animation, wobbleDuration }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const spinControls = useAnimation();

  const handleClick = async () => {
    if (isSpinning) return;
    setIsSpinning(true);

    // Run a clean 360° spin animation explicitly
    await spinControls.start({
      rotate: [0, 360],
      scale: [1, 1.25, 1],
      transition: { duration: 0.75, ease: 'easeInOut' }
    });

    // Reset the controls back to rest
    await spinControls.start({
      rotate: 0,
      scale: 1,
      transition: { duration: 0 }
    });

    setIsSpinning(false);
    // Now open the modal AFTER spin
    onClick(message);
  };

  return (
    <motion.div
      style={{
        position: 'absolute',
        pointerEvents: 'auto',
        cursor: isSpinning ? 'wait' : 'pointer',
        ...style
      }}
      animate={animation}
    >
      {/* Idle floating wobble wrapper */}
      <motion.div
        animate={!isSpinning ? {
          y: ['-15px', '15px', '-15px'],
          rotate: ['-8deg', '5deg', '-8deg']
        } : {}}
        transition={{
          duration: wobbleDuration,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        onClick={handleClick}
        whileHover={{
          scale: 1.15,
          y: -18,
          transition: { duration: 0.25, ease: 'easeOut' }
        }}
        // Fast snap-back on mouse leave
        style={{ 
          position: 'relative', 
          width: '180px',
          originX: '50%', 
          originY: '50%'
        }}
      >
        {/* Spin controls wrapper — sits on top of wobble */}
        <motion.div animate={spinControls} style={{ width: '100%' }}>
          {/* Glow */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.35)',
              filter: 'blur(35px)',
              opacity: 0.75,
              zIndex: 1,
              pointerEvents: 'none'
            }}
          />

          {/* Bottle image */}
          <img
            src="/realistic-bottle.png"
            alt="Floating Message Bottle"
            style={{
              width: '100%',
              position: 'relative',
              zIndex: 2,
              filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.5))',
              display: 'block'
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
