import React, { useMemo } from 'react';
import FloatingBottle from './FloatingBottle';

export default function FloatingMessages({ messages, onBottleClick }) {
  const isMobile = window.innerWidth < 640;

  // 1. Stable messages array
  const stableMessages = useMemo(() => [...messages].reverse(), [messages]);

  // 2. Pre-calculate a much sparser shuffled grid for massive margins
  const shuffledSlots = useMemo(() => {
    // Fewer lanes = massive vertical distance between bottles
    const numLanes = isMobile ? 3 : 4; 
    // Fewer time slots = massive horizontal distance between bottles
    const numTimeSlots = isMobile ? 4 : 5; 
    const slots = [];
    
    for (let l = 0; l < numLanes; l++) {
      for (let t = 0; t < numTimeSlots; t++) {
        slots.push({ l, t });
      }
    }
    
    let seed = 9999; 
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };
    
    for (let i = slots.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [slots[i], slots[j]] = [slots[j], slots[i]];
    }
    
    return { slots, numLanes, numTimeSlots };
  }, [isMobile]);

  const bottleConfigs = useMemo(() => {
    return stableMessages.map((msg, index) => {
      const yMin = isMobile ? 12 : 15;
      const yRange = isMobile ? 50 : 55;
      
      const { slots, numLanes, numTimeSlots } = shuffledSlots;
      
      const slot = slots[index % slots.length];
      const wrapCount = Math.floor(index / slots.length);
      
      const laneHeight = yRange / Math.max(1, numLanes - 1);
      
      let hash = 0;
      const idStr = String(msg.id || index);
      for (let i = 0; i < idStr.length; i++) hash = (hash << 5) - hash + idStr.charCodeAt(i);
      
      // Keep random offset small so they don't break out of their massive safe lanes
      const randomYOffset = ((Math.abs(hash) % 100) / 100 - 0.5) * (laneHeight * 0.4); 
      const startY = yMin + (slot.l * laneHeight) + randomYOffset;
      
      // Slower duration makes them more peaceful and physically stretches the time slots wider
      const floatDuration = isMobile ? 45 : 65; 
      
      const timeSlotDuration = floatDuration / numTimeSlots;
      const delayOffset = ((Math.abs(hash * 2) % 100) / 100 - 0.5) * (timeSlotDuration * 0.3);
      
      // If we have more bottles than slots, shift the overflow bottles exactly halfway into the time slot to keep them safe
      const wrapOffset = wrapCount * (timeSlotDuration * 0.5);
      
      const floatDelay = -(slot.t * timeSlotDuration) + delayOffset - wrapOffset;
      
      const scaleMin = isMobile ? 0.35 : 0.4;
      const scaleMax = isMobile ? 0.5 : 0.65;
      const scale = scaleMin + (slot.l / (numLanes - 1)) * (scaleMax - scaleMin);
      
      const wobbleDuration = 4 + (Math.abs(hash) % 4);

      return { msg, startY, floatDuration, floatDelay, wobbleDuration, scale };
    });
  }, [stableMessages, shuffledSlots, isMobile]);

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
