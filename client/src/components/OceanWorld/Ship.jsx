import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Animated ship/boat drifting slowly through the 3D ocean environment.
 * Hand-crafted procedurally using low-poly primitives.
 */
export default function Ship() {
  const shipRef = useRef()

  // Track movement parameters
  const speed = 0.05
  const orbitRadius = 24

  useFrame((state) => {
    if (!shipRef.current) return
    const time = state.clock.getElapsedTime()

    // 1. Slow orbit around the center of the ocean
    const angle = time * speed
    const x = Math.cos(angle) * orbitRadius
    const z = Math.sin(angle) * orbitRadius

    // 2. Position the ship
    shipRef.current.position.x = x
    shipRef.current.position.z = z

    // 3. Float/Bob on waves (Y axis oscillation)
    // Synchronized with wave frequency
    const bob = Math.sin(time * 1.1) * 0.18
    shipRef.current.position.y = bob - 0.15

    // 4. Orient/Rotate the ship so it faces forward along its movement vector
    // Tangent angle is angle + Math.PI/2
    const tangentAngle = angle + Math.PI * 0.5
    shipRef.current.rotation.y = -tangentAngle

    // 5. Gentle rolling motion (X and Z rotations) to simulate wave tilt
    shipRef.current.rotation.x = Math.sin(time * 1.5) * 0.05 // pitch
    shipRef.current.rotation.z = Math.cos(time * 1.2) * 0.04 // roll
  })

  return (
    <group ref={shipRef} scale={[0.8, 0.8, 0.8]}>
      {/* ── Boat Hull ── */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.4, 3.2]} />
        <meshStandardMaterial
          color="#05395E" // Deep Navy hull
          roughness={0.6}
          flatShading
        />
      </mesh>

      {/* ── Bow (Front point of ship) ── */}
      <mesh position={[0, 0, 1.85]} rotation={[Math.PI * 0.5, 0, 0]}>
        <coneGeometry args={[0.85, 1.2, 4]} />
        <meshStandardMaterial
          color="#5184C0" // Steel Blue bow
          roughness={0.6}
          flatShading
        />
      </mesh>

      {/* ── Stern Deck Cabin (Rear structure) ── */}
      <mesh position={[0, 0.35, -0.9]} castShadow>
        <boxGeometry args={[0.9, 0.4, 1.0]} />
        <meshStandardMaterial
          color="#DFE1E6" // Mist cabin
          roughness={0.8}
        />
      </mesh>

      {/* ── Main Mast ── */}
      <mesh position={[0, 1.4, 0.3]} castShadow>
        <cylinderGeometry args={[0.06, 0.09, 2.6, 6]} />
        <meshStandardMaterial color="#5184C0" roughness={0.7} />
      </mesh>

      {/* ── Sail ── */}
      <mesh position={[0, 1.7, 0.75]} rotation={[0, -0.2, 0]} castShadow>
        <boxGeometry args={[0.02, 1.5, 1.1]} />
        <meshStandardMaterial
          color="#DFE1E6" // Mist sail
          roughness={0.9}
        />
      </mesh>

      {/* ── Lantern / Glow ── */}
      <group position={[0, 0.5, -1.5]}>
        <mesh>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshBasicMaterial color="#91BFF6" />
        </mesh>
        <pointLight
          color="#91BFF6"
          intensity={1.8}
          distance={6}
          decay={1.5}
        />
      </group>
    </group>
  )
}
