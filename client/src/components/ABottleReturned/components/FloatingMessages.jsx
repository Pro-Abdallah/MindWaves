import React, { useMemo } from 'react';
import FloatingBottle from './FloatingBottle';

export default function FloatingMessages({ messages, onBottleClick }) {
  const isMobile = window.innerWidth < 640;

  const getPseudoRandom = (seed) => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  // Memoize calculated positions so they don't shift on re-render
  const bottleConfigs = useMemo(() => {
    return messages.map((msg, index) => {
      const seed = msg.id || index;
      // On mobile, keep bottles in a tighter vertical band (25-70%) to avoid navbar
      const yMin = isMobile ? 25 : 20;
      const yRange = isMobile ? 45 : 60;
      const startY = yMin + getPseudoRandom(seed) * yRange;
      const floatDuration = 35 + getPseudoRandom(seed + 1) * 55;
      const floatDelay = getPseudoRandom(seed + 2) * -50;
      const wobbleDuration = 4 + getPseudoRandom(seed + 3) * 4;
      // On mobile, cap scale lower so bottles don't overflow
      const scaleMin = isMobile ? 0.35 : 0.5;
      const scaleRange = isMobile ? 0.3 : 0.5;
      const scale = scaleMin + getPseudoRandom(seed + 4) * scaleRange;

      return { msg, startY, floatDuration, floatDelay, wobbleDuration, scale };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length, isMobile]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5,
        overflow: 'hidden'
      }}
    >
      {bottleConfigs.map(({ msg, startY, floatDuration, floatDelay, wobbleDuration, scale }, index) => (
        <FloatingBottle
          key={msg.id || index}
          message={msg}
          onClick={onBottleClick}
          style={{
            top: `${startY}%`,
            left: '-15%',
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
          }}
          animation={{
            x: ['0vw', '125vw'],
            transition: {
              x: {
                duration: floatDuration,
                repeat: Infinity,
                ease: 'linear',
                delay: floatDelay,
              },
            },
          }}
          wobbleDuration={wobbleDuration}
        />
      ))}
    </div>
  );
}
