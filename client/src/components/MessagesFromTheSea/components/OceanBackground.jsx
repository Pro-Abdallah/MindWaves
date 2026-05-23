import { motion } from 'framer-motion'

/**
 * OceanBackground
 * Renders the photorealistic ocean background with a subtle, cinematic slow-pan effect.
 */
export default function OceanBackground({ opacity = 1 }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: -10, // slightly larger to allow panning
        opacity,
        transition: 'opacity 0.8s ease',
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0
      }}
    >
      <motion.div
        style={{
          width: '105%',
          height: '105%',
          backgroundImage: 'url("/realistic-ocean-bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        animate={{
          x: ['-2.5%', '0%', '-2.5%'],
          y: ['-2.5%', '0%', '-2.5%'],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {/* Dark overlay to ensure text legibility and match moody vibe */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(2,14,24,0.4) 0%, rgba(2,14,24,0.1) 40%, rgba(2,14,24,0.7) 100%)'
        }}
      />
    </div>
  )
}
