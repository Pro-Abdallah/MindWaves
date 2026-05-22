import { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'

/**
 * Detailed procedural floating island component.
 * Renders a rocky tapered underside, flat terrain cap, boulders, low-poly trees,
 * and a glowing center crystal to clearly communicate a 'floating island' visual.
 */
export default function Island({
  id,
  title,
  subtitle,
  position,
  color,
  accentColor,
  scale = 2,
  elevation = 1,
  route,
  onExploreStart
}) {
  const navigate = useNavigate()
  const groupRef = useRef()
  const crystalRef = useRef()

  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  // Floating phase offsets
  const randomPhase = useRef(Math.random() * Math.PI * 2)

  // Animate floating motion and rotating crystal core
  useFrame((state) => {
    if (!groupRef.current) return
    const time = state.clock.getElapsedTime()

    // 1. Bobbing floating motion
    const bobFreq = hovered ? 1.6 : 0.9
    const bobAmp = hovered ? 0.35 : 0.18
    const floatY = Math.sin(time * bobFreq + randomPhase.current) * bobAmp
    groupRef.current.position.y = position[1] + floatY

    // 2. Slow overall rotation
    const rotSpeed = hovered ? 0.18 : 0.05
    groupRef.current.rotation.y = time * rotSpeed + randomPhase.current

    // 3. Central crystal rotation & bobbing
    if (crystalRef.current) {
      crystalRef.current.rotation.y = time * 1.5
      crystalRef.current.position.y = 0.55 + Math.sin(time * 2.5 + randomPhase.current) * 0.08
    }
  })

  const handleClick = (e) => {
    e.stopPropagation()
    if (clicked) return
    setClicked(true)

    if (onExploreStart) {
      onExploreStart(position, route)
    } else {
      navigate(route)
    }
  }

  // Dimension helpers
  const baseRadius = scale * 1.1
  const rockUndersideHeight = scale * 1.5

  return (
    <group
      ref={groupRef}
      position={[position[0], position[1], position[2]]}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        setHovered(false)
        document.body.style.cursor = 'default'
      }}
      onClick={handleClick}
    >
      {/* ── 1. Inverted Rocky Underside (Tapering downwards) ── */}
      <mesh position={[0, -rockUndersideHeight / 2, 0]} rotation={[Math.PI, 0, 0]} castShadow receiveShadow>
        {/* Irregular 5-sided cone rotated downward to look like rough stone cliffs */}
        <coneGeometry args={[baseRadius, rockUndersideHeight, 5]} />
        <meshStandardMaterial
          color={color}
          roughness={0.95}
          metalness={0.1}
          flatShading
        />
      </mesh>

      {/* ── 2. Flat Grass/Moss Top Cap ── */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI * 0.5, 0, 0]} receiveShadow>
        <cylinderGeometry args={[baseRadius, baseRadius * 1.05, 0.15, 8]} />
        <meshStandardMaterial
          color={hovered ? accentColor : "#05395E"} // Highlights when hovered
          roughness={0.9}
          flatShading
        />
      </mesh>

      {/* ── 3. Cliff Rocks/Boulders around the Cap ── */}
      <group position={[0, 0.08, 0]}>
        {/* Boulder A */}
        <mesh position={[-baseRadius * 0.7, 0.08, baseRadius * 0.4]} rotation={[0.2, 0.5, 0.1]} castShadow>
          <dodecahedronGeometry args={[scale * 0.28]} />
          <meshStandardMaterial color={color} roughness={0.8} flatShading />
        </mesh>
        {/* Boulder B */}
        <mesh position={[baseRadius * 0.65, 0.06, -baseRadius * 0.5]} rotation={[0.4, -0.2, 0.5]} castShadow>
          <boxGeometry args={[scale * 0.4, scale * 0.3, scale * 0.4]} />
          <meshStandardMaterial color={color} roughness={0.8} flatShading />
        </mesh>
      </group>

      {/* ── 4. Low-Poly Trees (Trunk + Foliage) ── */}
      <group position={[0, 0.1, 0]}>
        {/* Tree 1 */}
        <group position={[-baseRadius * 0.35, 0, -baseRadius * 0.3]}>
          <mesh position={[0, 0.2, 0]} castShadow>
            <cylinderGeometry args={[scale * 0.04, scale * 0.05, scale * 0.4, 4]} />
            <meshStandardMaterial color="#05395E" roughness={0.95} />
          </mesh>
          <mesh position={[0, 0.5, 0]} castShadow>
            <coneGeometry args={[scale * 0.2, scale * 0.55, 4]} />
            <meshStandardMaterial color={accentColor} roughness={0.9} flatShading />
          </mesh>
        </group>

        {/* Tree 2 */}
        <group position={[baseRadius * 0.3, 0, baseRadius * 0.35]}>
          <mesh position={[0, 0.15, 0]} castShadow>
            <cylinderGeometry args={[scale * 0.03, scale * 0.04, scale * 0.3, 4]} />
            <meshStandardMaterial color="#05395E" roughness={0.95} />
          </mesh>
          <mesh position={[0, 0.4, 0]} castShadow>
            <coneGeometry args={[scale * 0.16, scale * 0.45, 4]} />
            <meshStandardMaterial color={accentColor} roughness={0.9} flatShading />
          </mesh>
        </group>

        {/* Tree 3 (Smaller background tree) */}
        <group position={[baseRadius * 0.1, 0, -baseRadius * 0.6]}>
          <mesh position={[0, 0.1, 0]} castShadow>
            <cylinderGeometry args={[scale * 0.02, scale * 0.03, scale * 0.25, 4]} />
            <meshStandardMaterial color="#05395E" roughness={0.95} />
          </mesh>
          <mesh position={[0, 0.3, 0]} castShadow>
            <coneGeometry args={[scale * 0.12, scale * 0.35, 4]} />
            <meshStandardMaterial color={color} roughness={0.9} flatShading />
          </mesh>
        </group>
      </group>

      {/* ── 5. Floating Glowing Core/Crystal (Magical Beacon) ── */}
      <mesh ref={crystalRef} position={[0, 0.55, 0]} castShadow>
        <octahedronGeometry args={[scale * 0.15]} />
        <meshStandardMaterial
          color={accentColor}
          roughness={0.2}
          metalness={0.9}
          emissive={accentColor}
          emissiveIntensity={hovered ? 2.5 : 0.8}
          flatShading
        />
      </mesh>

      {/* ── 6. Hover Light Source ── */}
      <pointLight
        position={[0, 0.8, 0]}
        color={accentColor}
        intensity={hovered ? 3.5 : 0.6}
        distance={hovered ? 15 : 6}
        decay={2}
      />

      {/* ── 7. Ring Ripple Effect (Subtle mesh below island) ── */}
      {hovered && (
        <mesh position={[0, -rockUndersideHeight - 0.2, 0]} rotation={[-Math.PI * 0.5, 0, 0]}>
          <ringGeometry args={[baseRadius * 0.8, baseRadius * 1.6, 32]} />
          <meshBasicMaterial
            color={accentColor}
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* ── 8. Projected 2D HTML Label ── */}
      <Html
        distanceFactor={22}
        position={[0, scale + 0.8, 0]}
        center
        style={{
          pointerEvents: 'none',
          transition: 'all 0.3s ease',
          opacity: clicked ? 0 : 1,
          transform: `scale(${hovered ? 1.05 : 1})`
        }}
      >
        <div className={`ow-island-label ${hovered ? 'ow-island-label--active' : ''}`}>
          <h3 className="ow-island-label__title">{title}</h3>
          <span className="ow-island-label__sub">{subtitle}</span>
          <span className="ow-island-label__action">EXPLORE</span>
        </div>
      </Html>
    </group>
  )
}
