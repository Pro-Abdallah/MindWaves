import { useState, useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'

// Per-island visual theme config
const ISLAND_THEMES = {
  1: { grass: '#2d6a3f', rock: '#2a3d5a', trunk: '#2c1a0a', fog: '#aaccee', special: 'crystal' },
  2: { grass: '#1a0800', rock: '#0d0505', trunk: '#1a0800', fog: '#ff5500', special: 'lava' },
  3: { grass: '#1c2b1c', rock: '#111611', trunk: '#1a1a1a', fog: '#1a2a2a', special: 'sparse' },
  4: { grass: '#3a6050', rock: '#2a3545', trunk: '#1e1208', fog: '#88bbcc', special: 'twin' },
  5: { grass: '#1a4a1a', rock: '#1a1a08', trunk: '#0d0805', fog: '#226622', special: 'roots' },
  6: { grass: '#3a5a3a', rock: '#2a3a4a', trunk: '#1c1008', fog: '#99bbcc', special: 'lighthouse' },
}

function seededRng(seed) {
  let s = seed
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff }
}

/** Animated glowing particles floating upward around the island */
function FloatingParticles({ count, color, radius, height }) {
  const ref = useRef()
  const particles = useMemo(() => {
    const rng = seededRng(count * 999)
    return Array.from({ length: count }, () => ({
      angle: rng() * Math.PI * 2,
      dist: radius * (0.3 + rng() * 0.9),
      speed: 0.18 + rng() * 0.35,
      phase: rng() * Math.PI * 2,
      size: 0.025 + rng() * 0.04,
    }))
  }, [count, radius])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime()
    const pos = ref.current.geometry.attributes.position
    particles.forEach((p, i) => {
      const yRaw = ((t * p.speed + p.phase) % (height * 1.8))
      pos.setXYZ(
        i,
        Math.cos(p.angle + t * 0.12) * p.dist,
        yRaw - 0.2,
        Math.sin(p.angle + t * 0.12) * p.dist
      )
    })
    pos.needsUpdate = true
  })

  const positions = useMemo(() => {
    const arr = new Float32Array(particles.length * 3)
    particles.forEach((p, i) => {
      arr[i * 3]     = Math.cos(p.angle) * p.dist
      arr[i * 3 + 1] = 0
      arr[i * 3 + 2] = Math.sin(p.angle) * p.dist
    })
    return arr
  }, [particles])

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.055}
        transparent
        opacity={0.8}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}

/** Lighthouse tower structure */
function Lighthouse({ scale }) {
  return (
    <group>
      {/* Base */}
      <mesh position={[0, scale * 0.18, 0]}>
        <cylinderGeometry args={[scale * 0.09, scale * 0.12, scale * 0.36, 8]} />
        <meshStandardMaterial color="#e8e4da" roughness={0.7} />
      </mesh>
      {/* Red stripe */}
      <mesh position={[0, scale * 0.3, 0]}>
        <cylinderGeometry args={[scale * 0.092, scale * 0.092, scale * 0.08, 8]} />
        <meshStandardMaterial color="#c0392b" roughness={0.6} />
      </mesh>
      {/* Upper tower */}
      <mesh position={[0, scale * 0.52, 0]}>
        <cylinderGeometry args={[scale * 0.07, scale * 0.09, scale * 0.28, 8]} />
        <meshStandardMaterial color="#e8e4da" roughness={0.7} />
      </mesh>
      {/* Lamp house */}
      <mesh position={[0, scale * 0.72, 0]}>
        <cylinderGeometry args={[scale * 0.1, scale * 0.07, scale * 0.12, 8]} />
        <meshStandardMaterial color="#2c5f8a" roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Glowing lens */}
      <mesh position={[0, scale * 0.72, 0]}>
        <sphereGeometry args={[scale * 0.065, 8, 8]} />
        <meshStandardMaterial
          color="#fffaaa"
          emissive="#ffee44"
          emissiveIntensity={3.0}
          roughness={0.0}
          metalness={0.0}
        />
      </mesh>
      {/* Beacon light */}
      <pointLight position={[0, scale * 0.72, 0]} color="#ffee44" intensity={5} distance={20} decay={2} />
    </group>
  )
}

/** Lava crack streaks on cliff face */
function LavaCracks({ scale, cliffH }) {
  const cracks = useMemo(() => Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2
    return { x: Math.cos(a) * scale * 0.5, z: Math.sin(a) * scale * 0.5, rotY: a }
  }), [scale])

  return (
    <group>
      {cracks.map((c, i) => (
        <mesh key={i} position={[c.x, -cliffH * 0.35, c.z]} rotation={[0, c.rotY, 0.3]}>
          <planeGeometry args={[scale * 0.06, cliffH * 0.55]} />
          <meshStandardMaterial
            color="#ff4400"
            emissive="#ff2200"
            emissiveIntensity={2.5}
            roughness={0.2}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
      <pointLight position={[0, -cliffH * 0.4, 0]} color="#ff3300" intensity={3} distance={12} decay={2} />
    </group>
  )
}

export default function Island({
  id, title, subtitle, position, color, accentColor,
  scale = 2, elevation = 1, route, onExploreStart
}) {
  const navigate = useNavigate()
  const groupRef = useRef()
  const mistRefs = [useRef(), useRef(), useRef()]
  const crystalRef = useRef()

  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  const randomPhase = useRef(Math.random() * Math.PI * 2)
  const theme = ISLAND_THEMES[id] || ISLAND_THEMES[1]

  // Displaced terrain geometry
  const terrainGeo = useMemo(() => {
    const geo = new THREE.CylinderGeometry(scale * 1.12, scale * 1.28, scale * 0.28, 20, 4)
    const rng = seededRng(id * 7919)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      if (pos.getY(i) > 0.01) {
        pos.setX(i, pos.getX(i) + (rng() - 0.5) * scale * 0.3)
        pos.setZ(i, pos.getZ(i) + (rng() - 0.5) * scale * 0.3)
        pos.setY(i, pos.getY(i) + (rng() - 0.2) * scale * 0.14)
      }
    }
    geo.computeVertexNormals()
    return geo
  }, [id, scale])

  const R = scale * 1.12
  const cliffH = scale * 1.85

  const rng = useMemo(() => seededRng(id * 3571), [id])

  // Trees
  const trees = useMemo(() => {
    const rng2 = seededRng(id * 2311)
    const count = theme.special === 'sparse' ? 3 : 7 + Math.floor(rng2() * 4)
    return Array.from({ length: count }, () => {
      const angle = rng2() * Math.PI * 2
      const dist  = rng2() * R * 0.68
      const h     = 0.32 + rng2() * 0.5
      const lean  = (rng2() - 0.5) * 0.22
      return { x: Math.cos(angle) * dist, z: Math.sin(angle) * dist, h, lean }
    })
  }, [id, R, theme.special])

  // Boulders
  const boulders = useMemo(() => {
    const rng2 = seededRng(id * 8191)
    return Array.from({ length: 9 }, () => {
      const a = rng2() * Math.PI * 2
      const d = R * (0.5 + rng2() * 0.48)
      return { x: Math.cos(a) * d, z: Math.sin(a) * d, s: scale * (0.07 + rng2() * 0.14), rotY: rng2() * Math.PI }
    })
  }, [id, R, scale])

  // Roots
  const rootCount = theme.special === 'roots' ? 16 : 8
  const roots = useMemo(() => {
    const rng2 = seededRng(id * 4567)
    return Array.from({ length: rootCount }, (_, i) => {
      const a = (i / rootCount) * Math.PI * 2 + rng2() * 0.5
      const d = R * (0.3 + rng2() * 0.6)
      const len = scale * (0.5 + rng2() * 0.85)
      return { x: Math.cos(a) * d, z: Math.sin(a) * d, len, t: scale * (0.015 + rng2() * 0.025) }
    })
  }, [id, R, scale, rootCount])

  // Moss patches
  const moss = useMemo(() => {
    const rng2 = seededRng(id * 1337)
    return Array.from({ length: 8 }, () => {
      const a = rng2() * Math.PI * 2
      const d = rng2() * R * 0.9
      return { x: Math.cos(a) * d, z: Math.sin(a) * d, s: scale * (0.12 + rng2() * 0.22), rotY: rng2() * Math.PI }
    })
  }, [id, R, scale])

  // Floating animation
  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
    const freq = hovered ? 1.4 : 0.75
    const amp  = hovered ? 0.28 : 0.15
    groupRef.current.position.y = position[1] + Math.sin(t * freq + randomPhase.current) * amp
    groupRef.current.rotation.y = Math.sin(t * 0.02 + randomPhase.current) * 0.035

    // Rotating crystal
    if (crystalRef.current) {
      crystalRef.current.rotation.y = t * 1.8
      crystalRef.current.position.y = scale * 0.58 + Math.sin(t * 2.5 + randomPhase.current) * 0.07
    }

    // Multi-layer mist rings rotating at different speeds
    const speeds = [0.09, -0.14, 0.06]
    mistRefs.forEach((ref, i) => {
      if (ref.current) {
        ref.current.rotation.y = t * speeds[i]
        ref.current.material.opacity = 0.1 + Math.sin(t * 0.7 + i + randomPhase.current) * 0.04
      }
    })
  })

  const handleClick = (e) => {
    e.stopPropagation()
    if (clicked) return
    setClicked(true)
    onExploreStart ? onExploreStart(position, route) : navigate(route)
  }

  const particleColor = theme.special === 'lava' ? '#ff6600' : accentColor

  return (
    <group
      ref={groupRef}
      position={[position[0], position[1], position[2]]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true);  document.body.style.cursor = 'pointer' }}
      onPointerOut={(e)  => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'default' }}
      onClick={handleClick}
    >
      {/* ── 1. Displaced terrain cap ── */}
      <mesh geometry={terrainGeo} position={[0, 0.06, 0]} receiveShadow castShadow>
        <meshStandardMaterial color={theme.grass} roughness={0.94} metalness={0.0} />
      </mesh>

      {/* ── 2. Moss patches on terrain ── */}
      {moss.map((m, i) => (
        <mesh key={`moss-${i}`} position={[m.x, 0.21, m.z]} rotation={[-Math.PI / 2, 0, m.rotY]}>
          <circleGeometry args={[m.s, 7]} />
          <meshStandardMaterial color={theme.grass} roughness={1.0} transparent opacity={0.75} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* ── 3. Sandy beach ledge ── */}
      <mesh position={[0, -0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[R * 0.88, R * 1.3, 22]} />
        <meshStandardMaterial color="#b89a60" roughness={1.0} side={THREE.DoubleSide} />
      </mesh>

      {/* ── 4. Three-tier layered cliff geology ── */}
      <mesh position={[0, -cliffH * 0.18, 0]} rotation={[Math.PI, 0.2, 0]} castShadow>
        <coneGeometry args={[R * 0.94, cliffH * 0.38, 7, 3]} />
        <meshStandardMaterial color={color} roughness={0.97} metalness={0.08} flatShading />
      </mesh>
      <mesh position={[0.18, -cliffH * 0.52, 0.12]} rotation={[Math.PI, 0.7, 0]} castShadow>
        <coneGeometry args={[R * 0.7, cliffH * 0.4, 6, 2]} />
        <meshStandardMaterial color={theme.rock} roughness={0.99} metalness={0.05} flatShading />
      </mesh>
      <mesh position={[-0.12, -cliffH * 0.86, -0.08]} rotation={[Math.PI, 1.1, 0]} castShadow>
        <coneGeometry args={[R * 0.38, cliffH * 0.4, 5, 1]} />
        <meshStandardMaterial color={color} roughness={0.98} metalness={0.06} flatShading />
      </mesh>

      {/* ── 5. Cliff ledge protrusions (2 horizontal rocky ledges) ── */}
      {[0.38, 0.65].map((t, i) => (
        <mesh key={`ledge-${i}`} position={[0, -cliffH * t, 0]} rotation={[-Math.PI / 2, 0, i * 0.9]}>
          <ringGeometry args={[R * (0.5 - i * 0.1), R * (0.96 - i * 0.05), 9]} />
          <meshStandardMaterial color={theme.rock} roughness={1.0} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* ── 6. Hanging root tendrils ── */}
      {roots.map((r, i) => (
        <mesh key={`root-${i}`} position={[r.x, -cliffH * 0.28, r.z]} castShadow>
          <cylinderGeometry args={[r.t * 0.5, r.t * 0.18, r.len, 4]} />
          <meshStandardMaterial color={theme.trunk} roughness={1.0} />
        </mesh>
      ))}

      {/* ── 7. Edge boulders ── */}
      {boulders.map((b, i) => (
        <mesh key={`boulder-${i}`} position={[b.x, 0.04, b.z]} rotation={[0.2, b.rotY, 0.15]} castShadow>
          <dodecahedronGeometry args={[b.s, 0]} />
          <meshStandardMaterial color={theme.rock} roughness={0.88} metalness={0.1} flatShading />
        </mesh>
      ))}

      {/* ── 8. Tree cluster with lean variation ── */}
      {trees.map((tree, i) => {
        const trunkH = scale * tree.h
        const f1 = scale * (0.14 + tree.h * 0.09)
        const f2 = f1 * 0.72
        const f3 = f2 * 0.62
        return (
          <group key={`tree-${i}`} position={[tree.x, 0.06, tree.z]} rotation={[tree.lean, 0, tree.lean * 0.5]}>
            <mesh position={[0, trunkH * 0.5, 0]} castShadow>
              <cylinderGeometry args={[scale * 0.028, scale * 0.038, trunkH, 5]} />
              <meshStandardMaterial color={theme.trunk} roughness={1.0} />
            </mesh>
            <mesh position={[0, trunkH * 0.78, 0]} castShadow>
              <coneGeometry args={[f1, f1 * 1.35, 6]} />
              <meshStandardMaterial color={accentColor} roughness={0.9} flatShading />
            </mesh>
            <mesh position={[0, trunkH + f1 * 0.55, 0]} castShadow>
              <coneGeometry args={[f2, f2 * 1.2, 6]} />
              <meshStandardMaterial color={accentColor} roughness={0.87} flatShading />
            </mesh>
            <mesh position={[0, trunkH + f1 * 1.05, 0]} castShadow>
              <coneGeometry args={[f3, f3 * 1.1, 5]} />
              <meshStandardMaterial color={hovered ? '#a8e6c8' : accentColor} roughness={0.84} flatShading />
            </mesh>
          </group>
        )
      })}

      {/* ── 9. Special: Lighthouse (island 6) ── */}
      {theme.special === 'lighthouse' && <Lighthouse scale={scale} />}

      {/* ── 10. Special: Lava cracks (island 2) ── */}
      {theme.special === 'lava' && <LavaCracks scale={scale} cliffH={cliffH} />}

      {/* ── 11. Glowing crystal (most islands) ── */}
      {theme.special !== 'lighthouse' && theme.special !== 'lava' && (
        <mesh ref={crystalRef} position={[0, scale * 0.58, 0]} castShadow>
          <octahedronGeometry args={[scale * 0.13, 0]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={hovered ? 3.5 : 1.2}
            roughness={0.04}
            metalness={0.95}
            flatShading
          />
        </mesh>
      )}

      {/* ── 12. Three-layer rotating mist rings ── */}
      {[
        { ref: mistRefs[0], y: -cliffH * 0.3,  inner: R * 0.5,  outer: R * 2.0, opacity: 0.11 },
        { ref: mistRefs[1], y: -cliffH * 0.52, inner: R * 0.35, outer: R * 1.6, opacity: 0.08 },
        { ref: mistRefs[2], y: -cliffH * 0.72, inner: R * 0.2,  outer: R * 1.2, opacity: 0.06 },
      ].map((m, i) => (
        <mesh key={`mist-${i}`} ref={m.ref} position={[0, m.y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[m.inner, m.outer, 36]} />
          <meshBasicMaterial
            color={theme.fog}
            transparent
            opacity={m.opacity}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* ── 13. Floating particles ── */}
      <FloatingParticles count={hovered ? 18 : 10} color={particleColor} radius={R * 1.1} height={scale * 1.4} />

      {/* ── 14. Hover glow ripple ── */}
      {hovered && (
        <mesh position={[0, -cliffH * 0.92, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[R * 0.6, R * 2.1, 44]} />
          <meshBasicMaterial
            color={accentColor}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* ── 15. Island accent point light ── */}
      <pointLight
        position={[0, 1.0, 0]}
        color={accentColor}
        intensity={hovered ? 5.0 : 0.8}
        distance={hovered ? 20 : 8}
        decay={2}
      />

      {/* ── 16. HTML Label ── */}
      <Html
        distanceFactor={22}
        position={[0, scale + 1.1, 0]}
        center
        style={{
          pointerEvents: 'none',
          transition: 'all 0.3s ease',
          opacity: clicked ? 0 : 1,
          transform: `scale(${hovered ? 1.06 : 1})`
        }}
      >
        <div
          className={`ow-island-label ${hovered ? 'ow-island-label--active' : ''}`}
          style={{ '--island-accent': accentColor }}
        >
          <h3 className="ow-island-label__title">{title}</h3>
          <span className="ow-island-label__sub">{subtitle}</span>
          <span className="ow-island-label__action">EXPLORE</span>
        </div>
      </Html>
    </group>
  )
}
