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
          backgroundImage: 'url("/5.png")',
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
      {/* Removed dark overlay */}
    </div>
  )
}
