import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Procedural Sailboat — hand-crafted 3D low-poly galleon.
 * 
 * Features:
 *  - Multilayered wooden hull, golden railings, and curved bowsprit.
 *  - Multiple billowing warm cream sails catching the wind.
 *  - Glowing magical waterline (MindWaves cyan underglow) and stern lantern.
 *  - Real-time animated fluttering flag.
 *  - Dynamic bioluminescent particle wake trail trailing behind the boat.
 *  - Dual-mode movement: idle orbit OR fast smooth sailing to clicked island.
 */
export default function Ship({ target, onArrived }) {
  const shipRef = useRef()
  const flagRef = useRef()
  const wakePointsRef = useRef()

  // Track physical position and heading in refs to avoid React re-renders on every frame
  const currentPos = useRef(new THREE.Vector3(24, -0.15, 0)) // start on orbit path
  const lastTime = useRef(0)

  // Initialize particle wake memory
  const wakeParticles = useMemo(() => {
    return Array.from({ length: 45 }, () => ({
      pos: new THREE.Vector3(9999, 9999, 9999), // spawn offscreen
      life: 0,
      maxLife: 1.0 + Math.random() * 1.2,
      speedX: 0,
      speedZ: 0,
      size: 0.06 + Math.random() * 0.08,
    }))
  }, [])

  // Spawning index tracker
  const spawnIdx = useRef(0)

  // Setup initial buffer positions for particles
  const positions = useMemo(() => new Float32Array(45 * 3), [])

  useFrame((state) => {
    if (!shipRef.current) return
    const time = state.clock.getElapsedTime()
    
    // Calculate delta time
    if (lastTime.current === 0) lastTime.current = time
    const dt = Math.min(time - lastTime.current, 0.1) // clamp dt to avoid huge jumps
    lastTime.current = time

    // ── Movement & Steering Logic ──
    const heading = new THREE.Vector3()

    if (target) {
      // 1. FAST SAILING MODE (towards clicked island)
      const targetVec = new THREE.Vector3(target[0], -0.15, target[2])
      const toTarget = targetVec.clone().sub(currentPos.current)
      toTarget.y = 0 // stay in water plane
      const dist = toTarget.length()

      if (dist > 2.2) {
        // Find angle to target (Z is forward in our model space)
        const targetAngle = Math.atan2(toTarget.x, toTarget.z)
        
        // Smoothly interpolate rotation to face target
        let diff = targetAngle - shipRef.current.rotation.y
        diff = Math.atan2(Math.sin(diff), Math.cos(diff)) // normalize to -PI to PI
        shipRef.current.rotation.y += diff * 6.0 * dt // turn speed

        // Move forward along current heading direction
        heading.set(
          Math.sin(shipRef.current.rotation.y),
          0,
          Math.cos(shipRef.current.rotation.y)
        ).normalize()

        // Sailing velocity (Fast)
        const sailSpeed = 16.5 
        currentPos.current.addScaledVector(heading, sailSpeed * dt)
      } else {
        // Arrived at destination!
        if (onArrived) {
          onArrived()
        }
      }
    } else {
      // 2. IDLE ORBIT MODE (gentle drift around ocean center)
      const orbitSpeed = 0.05
      const orbitRadius = 24
      const angle = time * orbitSpeed
      
      const targetX = Math.cos(angle) * orbitRadius
      const targetZ = Math.sin(angle) * orbitRadius

      currentPos.current.x = THREE.MathUtils.lerp(currentPos.current.x, targetX, 0.05)
      currentPos.current.z = THREE.MathUtils.lerp(currentPos.current.z, targetZ, 0.05)

      // Orient forward along tangent of orbit
      const tangentAngle = angle + Math.PI * 0.5
      shipRef.current.rotation.y = THREE.MathUtils.lerp(shipRef.current.rotation.y, -tangentAngle, 0.05)
      
      heading.set(
        Math.sin(shipRef.current.rotation.y),
        0,
        Math.cos(shipRef.current.rotation.y)
      ).normalize()
    }

    // Apply translation
    shipRef.current.position.copy(currentPos.current)

    // 3. Floating wave physics (Y bobbing & tilting)
    const waveFreq = target ? 2.5 : 1.2
    const waveAmp  = target ? 0.08 : 0.16
    const bob = Math.sin(time * waveFreq) * waveAmp
    shipRef.current.position.y = bob - 0.16

    // Roll & Pitch dynamics (heavier pitch when sailing fast)
    const pitchFreq = target ? 3.0 : 1.5
    const rollFreq  = target ? 2.4 : 1.1
    shipRef.current.rotation.x = Math.sin(time * pitchFreq) * (target ? 0.08 : 0.04) // pitch
    shipRef.current.rotation.z = Math.cos(time * rollFreq) * (target ? 0.06 : 0.03) // roll

    // 4. Flutter flag animation
    if (flagRef.current) {
      flagRef.current.rotation.y = Math.sin(time * 6.5) * 0.28
      flagRef.current.rotation.z = Math.cos(time * 4.0) * 0.08
    }

    // 5. ── Bioluminescent Wake Particles ──
    const wakeGeo = wakePointsRef.current?.geometry
    const wakePosAttr = wakeGeo?.attributes.position

    if (wakePosAttr) {
      const headingX = Math.sin(shipRef.current.rotation.y)
      const headingZ = Math.cos(shipRef.current.rotation.y)

      // Spawning foam at the stern of the boat
      const sternX = currentPos.current.x - headingX * 1.6
      const sternZ = currentPos.current.z - headingZ * 1.6
      const sternY = currentPos.current.y - 0.08

      // Spawn a new bubble foam particle
      const isMoving = target !== null || Math.random() < 0.35
      if (isMoving && Math.random() < 0.7) {
        const p = wakeParticles[spawnIdx.current]
        p.pos.set(
          sternX + (Math.random() - 0.5) * 0.45,
          sternY + (Math.random() - 0.5) * 0.04,
          sternZ + (Math.random() - 0.5) * 0.45
        )
        p.life = p.maxLife
        // Drift backwards + outwards relative to heading
        p.speedX = -headingX * (target ? 4.0 : 1.5) + (Math.random() - 0.5) * 0.95
        p.speedZ = -headingZ * (target ? 4.0 : 1.5) + (Math.random() - 0.5) * 0.95
        
        spawnIdx.current = (spawnIdx.current + 1) % wakeParticles.length
      }

      // Update particle physics, write directly to Float32Array positions
      for (let i = 0; i < wakeParticles.length; i++) {
        const p = wakeParticles[i]
        if (p.life > 0) {
          p.life -= dt
          p.pos.x += p.speedX * dt
          p.pos.z += p.speedZ * dt
          p.pos.y += Math.sin(p.life * 3.0) * 0.03 * dt
          
          positions[i * 3]     = p.pos.x
          positions[i * 3 + 1] = p.pos.y
          positions[i * 3 + 2] = p.pos.z
        } else {
          // Hide dead particle under water
          positions[i * 3]     = 9999
          positions[i * 3 + 1] = -100
          positions[i * 3 + 2] = 9999
        }
      }
      wakePosAttr.needsUpdate = true
    }
  })

  return (
    <group>
      {/* ── Bioluminescent Wake Points ── */}
      <points ref={wakePointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#1fe5d5" // glowing teal foam
          size={0.24}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* ── Ship Mesh Group ── */}
      <group ref={shipRef} scale={[0.8, 0.8, 0.8]}>
        {/* 1. Main Oak Deck Hull */}
        <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
          <boxGeometry args={[1.3, 0.35, 3.4]} />
          <meshStandardMaterial
            color="#3a2010" // Dark oak wood
            roughness={0.7}
            flatShading
          />
        </mesh>

        {/* 2. Raised Stern Quarterdeck */}
        <mesh castShadow receiveShadow position={[0, 0.42, -1.1]}>
          <boxGeometry args={[1.3, 0.32, 1.2]} />
          <meshStandardMaterial
            color="#2d170a" // Slightly darker wood
            roughness={0.72}
            flatShading
          />
        </mesh>

        {/* 3. Curved Bow (Front) */}
        <mesh position={[0, 0.1, 1.95]} rotation={[Math.PI * 0.5, 0, 0]} castShadow>
          <cylinderGeometry args={[0.0, 0.65, 0.9, 4]} />
          <meshStandardMaterial
            color="#005d7a" // Beautiful slate teal
            roughness={0.65}
            flatShading
          />
        </mesh>

        {/* 4. Golden Bowsprit (Front tip pole) */}
        <mesh position={[0, 0.35, 2.3]} rotation={[0.22, 0, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.07, 1.4, 5]} />
          <meshStandardMaterial
            color="#d4af37" // Shiny gold trim
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>

        {/* 5. Golden Left & Right Railings */}
        <mesh position={[-0.66, 0.32, 0]} castShadow>
          <boxGeometry args={[0.06, 0.22, 3.4]} />
          <meshStandardMaterial
            color="#d4af37"
            roughness={0.35}
            metalness={0.75}
          />
        </mesh>
        <mesh position={[0.66, 0.32, 0]} castShadow>
          <boxGeometry args={[0.06, 0.22, 3.4]} />
          <meshStandardMaterial
            color="#d4af37"
            roughness={0.35}
            metalness={0.75}
          />
        </mesh>

        {/* 6. Glowing Waterline Ribbon (Bioluminescent aura) */}
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[1.36, 0.06, 3.46]} />
          <meshBasicMaterial
            color="#1fe5d5"
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* 7. Main Mast (Center) */}
        <mesh position={[0, 1.6, 0.1]} castShadow>
          <cylinderGeometry args={[0.04, 0.08, 3.0, 6]} />
          <meshStandardMaterial color="#1a0c02" roughness={0.75} />
        </mesh>

        {/* 8. Fore Mast (Front) */}
        <mesh position={[0, 1.4, 1.1]} castShadow>
          <cylinderGeometry args={[0.035, 0.07, 2.6, 6]} />
          <meshStandardMaterial color="#1a0c02" roughness={0.75} />
        </mesh>

        {/* 9. Masts Crosstrees (Horizontal beams) */}
        <mesh position={[0, 2.2, 0.1]}>
          <boxGeometry args={[1.8, 0.06, 0.08]} />
          <meshStandardMaterial color="#1a0c02" roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.9, 1.1]}>
          <boxGeometry args={[1.4, 0.05, 0.07]} />
          <meshStandardMaterial color="#1a0c02" roughness={0.7} />
        </mesh>

        {/* 10. Billowing Warm Cream Sails */}
        {/* Main Sail */}
        <mesh position={[0, 1.3, 0.1]} rotation={[0.06, -0.08, -0.02]} castShadow>
          <boxGeometry args={[1.6, 1.4, 0.04]} />
          <meshStandardMaterial
            color="#fffdf9"
            roughness={0.9}
            flatShading
          />
        </mesh>
        {/* Upper Main Sail */}
        <mesh position={[0, 2.5, 0.1]} rotation={[0.09, -0.05, -0.02]} castShadow>
          <boxGeometry args={[1.1, 0.8, 0.03]} />
          <meshStandardMaterial
            color="#fffdf9"
            roughness={0.9}
            flatShading
          />
        </mesh>
        {/* Fore Sail */}
        <mesh position={[0, 1.1, 1.1]} rotation={[0.06, -0.1, -0.03]} castShadow>
          <boxGeometry args={[1.3, 1.2, 0.04]} />
          <meshStandardMaterial
            color="#fffdf9"
            roughness={0.9}
            flatShading
          />
        </mesh>
        {/* Triangular Jib Sail (Front wind-catcher) */}
        <mesh position={[0, 1.3, 1.8]} rotation={[0.38, -0.12, 0.18]} castShadow>
          <coneGeometry args={[0.55, 1.5, 3]} />
          <meshStandardMaterial
            color="#fffdf9"
            roughness={0.9}
            flatShading
          />
        </mesh>

        {/* 11. Animated Fluttering Top Flag */}
        <mesh ref={flagRef} position={[0, 3.1, -0.1]} castShadow>
          <boxGeometry args={[0.02, 0.18, 0.45]} />
          <meshBasicMaterial color="#1fe5d5" />
        </mesh>

        {/* 12. Hanging Stern Lantern */}
        <group position={[0, 0.55, -1.8]}>
          {/* Gold bracket */}
          <mesh rotation={[0.3, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.5, 4]} />
            <meshStandardMaterial
              color="#d4af37"
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>
          {/* Glowing lantern bulb */}
          <mesh position={[0, 0.25, -0.1]}>
            <sphereGeometry args={[0.16, 8, 8]} />
            <meshBasicMaterial color="#ffcc33" />
          </mesh>
          {/* Real point light */}
          <pointLight
            color="#ffee55"
            intensity={3.5}
            distance={8}
            decay={1.5}
          />
        </group>
      </group>
    </group>
  )
}
