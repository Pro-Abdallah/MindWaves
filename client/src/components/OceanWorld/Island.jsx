import { useState, useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'

// Simple seeded RNG
function seededRng(seed) {
  let s = seed
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff }
}

// Simple 3D noise for terrain deformation
function noise3D(x, y, z) {
  const sin1 = Math.sin(x * 1.5 + y * 2.1 + z * 0.9)
  const sin2 = Math.sin(x * 0.8 + y * 1.2 + z * 1.7)
  return (sin1 + sin2) * 0.5
}

/** 
 * Generalized Particle System
 * Supports rising (embers, magic) and falling (dripping water/lava).
 */
function ThematicParticles({ count, color, radius, height, randomPhase, isDripping, isFast }) {
  const ref = useRef()
  const particles = useMemo(() => {
    const rng = seededRng(count * 999)
    return Array.from({ length: count }, () => ({
      angle: rng() * Math.PI * 2,
      dist: radius * (0.2 + rng() * 1.3),
      speed: (0.1 + rng() * 0.4) * (isFast ? 2.5 : 1.0) * (isDripping ? -1 : 1),
      phase: rng() * Math.PI * 2,
      size: 0.05 + rng() * 0.1,
    }))
  }, [count, radius, isDripping, isFast])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime()
    const pos = ref.current.geometry.attributes.position
    particles.forEach((p, i) => {
      // Modulo wrap around logic works differently for negative speeds
      let yRaw = (t * p.speed + p.phase) % (height * 2.0)
      if (yRaw < 0) yRaw += height * 2.0

      pos.setXYZ(
        i,
        Math.cos(p.angle + t * 0.1 + randomPhase) * p.dist,
        yRaw - height, // Centered around Y=0
        Math.sin(p.angle + t * 0.1 + randomPhase) * p.dist
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
        size={isFast ? 0.15 : 0.1}
        transparent
        opacity={0.8}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}

/** 
 * ISLAND 1: The Still Island
 * Calm, serene. Smooth grass terrain with a beautiful glowing magical tree in the center.
 */
function StillIsland({ scale, color, accentColor, hovered }) {
  // Smooth domed terrain
  const terrainGeo = useMemo(() => {
    const geo = new THREE.CylinderGeometry(scale * 1.2, scale * 0.8, scale * 1.5, 32, 8)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      let vx = pos.getX(i)
      let vy = pos.getY(i)
      let vz = pos.getZ(i)
      
      // Smooth noise for a calm landscape
      if (vy > 0) {
        vy += noise3D(vx, vy, vz) * scale * 0.15 // gentle bumps
      } else {
        vy -= Math.abs(noise3D(vx, vy, vz)) * scale * 0.3 // smooth rounded bottom
      }
      pos.setXYZ(i, vx, vy, vz)
    }
    geo.computeVertexNormals()
    return geo
  }, [scale])

  return (
    <group>
      <mesh geometry={terrainGeo} castShadow receiveShadow position={[0, -scale*0.5, 0]}>
        <meshStandardMaterial color={color} roughness={0.9} metalness={0.0} flatShading={false} />
      </mesh>
      
      {/* Central Magical Tree */}
      <group position={[0, scale * 0.2, 0]}>
        {/* Trunk */}
        <mesh position={[0, scale * 0.6, 0]}>
          <cylinderGeometry args={[scale * 0.08, scale * 0.15, scale * 1.2, 8]} />
          <meshStandardMaterial color="#223344" roughness={1.0} />
        </mesh>
        {/* Glowing Leaves/Canopy */}
        <mesh position={[0, scale * 1.5, 0]}>
          <sphereGeometry args={[scale * 0.8, 16, 16]} />
          <meshStandardMaterial 
            color={accentColor} 
            emissive={accentColor}
            emissiveIntensity={hovered ? 2.5 : 1.0}
            transparent opacity={0.9}
            roughness={0.1}
          />
        </mesh>
        <pointLight position={[0, scale * 1.5, 0]} color={accentColor} intensity={hovered ? 3.0 : 1.0} distance={15} />
      </group>

      <ThematicParticles count={hovered ? 40 : 20} color={accentColor} radius={scale * 1.5} height={scale * 2} randomPhase={0} isDripping={false} isFast={false} />
    </group>
  )
}

/** 
 * ISLAND 2: The Burning Island
 * Volcanic, chaotic. Jagged inverted cone. Crater on top with lava. Lava drips/embers falling.
 */
function BurningIsland({ scale, color, accentColor, hovered }) {
  // Enhanced fractal noise for ultra-jagged rock
  const fractalNoise = (x, y, z) => {
    let n = noise3D(x, y, z)
    n += noise3D(x * 2.5, y * 2.5, z * 2.5) * 0.5
    n += noise3D(x * 5.0, y * 5.0, z * 5.0) * 0.25
    return n
  }

  // Jagged Volcanic Terrain
  const terrainGeo = useMemo(() => {
    const geo = new THREE.CylinderGeometry(scale * 1.5, scale * 0.05, scale * 2.2, 24, 12)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      let vx = pos.getX(i)
      let vy = pos.getY(i)
      let vz = pos.getZ(i)
      
      const n = fractalNoise(vx, vy, vz)
      
      if (vy > scale * 0.8) {
        // Create a deep, menacing crater
        const distToCenter = Math.sqrt(vx*vx + vz*vz)
        if (distToCenter < scale * 1.1) {
          // Inner crater drops down significantly
          vy -= Math.pow((scale * 1.1 - distToCenter), 1.2) * 1.2
        }
        vy += n * scale * 0.4 // jagged rim spikes
      } else {
        // Jagged, fractured sides
        vx += n * scale * 0.5 * (vy / scale)
        vz -= n * scale * 0.5 * (vy / scale)
      }
      pos.setXYZ(i, vx, vy, vz)
    }
    geo.computeVertexNormals()
    return geo
  }, [scale])

  // 3D Viscous Lava Flows (thick glowing streams instead of flat planes)
  const lavaFlows = useMemo(() => {
    const rng = seededRng(888)
    return Array.from({ length: 7 }, () => {
      const angle = rng() * Math.PI * 2
      const radius = scale * 1.3
      const len = scale * (0.5 + rng() * 1.5)
      return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        rotY: -angle,
        length: len,
        thickness: scale * (0.05 + rng() * 0.08),
        yOffset: scale * 0.6 - (len * 0.5) // Start near rim and flow down
      }
    })
  }, [scale])

  // Shattered floating orbital rocks
  const debris = useMemo(() => {
    const rng = seededRng(777)
    return Array.from({ length: 12 }, () => {
      const angle = rng() * Math.PI * 2
      const dist = scale * (1.6 + rng() * 1.2)
      return {
        x: Math.cos(angle) * dist,
        z: Math.sin(angle) * dist,
        y: scale * (rng() * 1.5 - 0.5),
        size: scale * (0.05 + rng() * 0.15),
        speed: (rng() - 0.5) * 0.5
      }
    })
  }, [scale])

  const debrisRef = useRef()
  useFrame((state) => {
    if (debrisRef.current) {
      debrisRef.current.rotation.y = state.clock.getElapsedTime() * 0.15
    }
  })

  return (
    <group>
      {/* Main Volcano Body */}
      <mesh geometry={terrainGeo} castShadow receiveShadow position={[0, -scale*0.6, 0]}>
        <meshStandardMaterial
          color="#7a3520"
          emissive="#3d0e00"
          emissiveIntensity={hovered ? 1.2 : 0.6}
          roughness={0.85}
          metalness={0.1}
          flatShading={true}
        />
      </mesh>

      {/* Deep Magma Core */}
      <mesh position={[0, scale * 0.1, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <circleGeometry args={[scale * 0.9, 24]} />
        <meshStandardMaterial 
          color="#ff2200" 
          emissive="#ff4400" 
          emissiveIntensity={hovered ? 6.0 : 2.5} 
          roughness={0.1}
          metalness={0.8}
        />
        <pointLight color="#ff4400" intensity={hovered ? 8.0 : 3.0} distance={25} decay={2} />
      </mesh>

      {/* External lava-glow lights that illuminate the island sides */}
      <pointLight position={[scale * 2.2, scale * 0.5, 0]}       color="#ff5500" intensity={hovered ? 6.0 : 3.5} distance={scale * 7} decay={1.5} />
      <pointLight position={[-scale * 2.0, scale * 0.3, scale * 1.2]} color="#ff3300" intensity={hovered ? 5.0 : 2.8} distance={scale * 6} decay={1.5} />
      <pointLight position={[scale * 0.8, scale * 0.8, -scale * 2.2]} color="#ff6600" intensity={hovered ? 4.5 : 2.5} distance={scale * 6} decay={1.5} />

      {/* Volcanic Heat Pillar (Subtle glowing core beam) */}
      <mesh position={[0, scale * 1.5, 0]}>
        <cylinderGeometry args={[scale * 0.6, scale * 0.9, scale * 3.0, 16]} />
        <meshBasicMaterial 
          color="#ffaa00" 
          transparent 
          opacity={hovered ? 0.15 : 0.05} 
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 3D Viscous Lava dripping down the sides */}
      {lavaFlows.map((flow, i) => (
        <mesh key={i} position={[flow.x * 0.8, flow.yOffset, flow.z * 0.8]} rotation={[0.2, flow.rotY, 0]}>
          <cylinderGeometry args={[flow.thickness, flow.thickness * 0.3, flow.length, 6]} />
          <meshStandardMaterial 
            color="#ff3300" 
            emissive="#ff2200" 
            emissiveIntensity={hovered ? 4.0 : 2.0} 
            roughness={0.1} 
            metalness={0.5} 
          />
        </mesh>
      ))}

      {/* Shattered Orbital Debris */}
      <group ref={debrisRef}>
        {debris.map((rock, i) => (
          <mesh key={i} position={[rock.x, rock.y, rock.z]} rotation={[rock.speed, rock.speed, rock.speed]}>
            <dodecahedronGeometry args={[rock.size, 0]} />
            <meshStandardMaterial color="#38201a" roughness={0.9} metalness={0.1} flatShading />
            {/* Glowing cracks on debris */}
            <mesh scale={1.05}>
              <dodecahedronGeometry args={[rock.size, 0]} />
              <meshBasicMaterial color="#ff2200" wireframe transparent opacity={0.4} blending={THREE.AdditiveBlending} />
            </mesh>
          </mesh>
        ))}
      </group>

      {/* Intense Embers & Ash */}
      {/* Heavy dripping magma drops */}
      <ThematicParticles count={hovered ? 40 : 20} color="#ff3300" radius={scale * 1.2} height={scale * 2.5} randomPhase={1.2} isDripping={true} isFast={true} />
      {/* Rising hot ash and sparks */}
      <ThematicParticles count={hovered ? 80 : 35} color="#ffaa00" radius={scale * 1.4} height={scale * 3.0} randomPhase={0.5} isDripping={false} isFast={true} />
      {/* Dark rising smoke */}
      <ThematicParticles count={hovered ? 30 : 10} color="#111111" radius={scale * 1.0} height={scale * 3.5} randomPhase={3.3} isDripping={false} isFast={false} />
    </group>
  )
}

/** 
 * ISLAND 3: The Sunken Island
 * Melancholic, heavy, overgrown. Deep teal/blue. Drooping vines and bioluminescent moss. Dripping water.
 */
function SunkenIsland({ scale, color, accentColor, hovered }) {
  // Heavy, blocky, bottom-heavy terrain
  const terrainGeo = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(scale * 1.4, 3)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      let vx = pos.getX(i)
      let vy = pos.getY(i)
      let vz = pos.getZ(i)
      
      const n = noise3D(vx, vy, vz)
      
      if (vy > 0) {
        vy = vy * 0.3 + n * scale * 0.1 // flat, sad top
      } else {
        vy -= Math.abs(n) * scale * 1.2 // deep, hanging bottom
      }
      pos.setXYZ(i, vx, vy, vz)
    }
    geo.computeVertexNormals()
    return geo
  }, [scale])

  // Drooping weeping willow vines
  const vines = useMemo(() => {
    const rng = seededRng(99)
    return Array.from({ length: 15 }, () => {
      const angle = rng() * Math.PI * 2
      const radius = scale * (0.8 + rng() * 0.5)
      return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        y: scale * 0.2,
        length: scale * (1.0 + rng() * 2.0),
      }
    })
  }, [scale])

  return (
    <group>
      <mesh geometry={terrainGeo} castShadow receiveShadow position={[0, -scale*0.4, 0]}>
        <meshStandardMaterial color={color} roughness={0.9} metalness={0.1} flatShading={true} />
      </mesh>

      {/* Bioluminescent moss patches */}
      <mesh position={[0, scale * 0.1, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <circleGeometry args={[scale * 1.1, 16]} />
        <meshStandardMaterial 
          color="#0d2424" 
          emissive={accentColor} 
          emissiveIntensity={hovered ? 1.5 : 0.5} 
          transparent opacity={0.6}
        />
      </mesh>

      {/* Hanging Vines */}
      {vines.map((vine, i) => (
        <mesh key={i} position={[vine.x, vine.y - vine.length/2, vine.z]}>
          <cylinderGeometry args={[0.03, 0.01, vine.length, 4]} />
          <meshStandardMaterial color="#081820" roughness={1.0} />
        </mesh>
      ))}

      {/* Ambient underglow representing deep-sea bioluminescence */}
      <pointLight position={[0, -scale * 1.5, 0]} color={accentColor} intensity={hovered ? 3.0 : 1.0} distance={15} />

      {/* Slowly dripping water particles */}
      <ThematicParticles count={hovered ? 50 : 25} color={accentColor} radius={scale * 1.4} height={scale * 2} randomPhase={2.5} isDripping={true} isFast={false} />
    </group>
  )
}


export default function Island({
  id, title, subtitle, position, color, accentColor,
  scale = 2, elevation = 1, route, onExploreStart, onHoverChange
}) {
  const navigate = useNavigate()
  const groupRef = useRef()

  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  const randomPhase = useRef(Math.random() * Math.PI * 2)

  // Subtle floating animation
  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
    const freq = hovered ? 1.2 : 0.6
    
    // Different islands have different float intensities
    // Still (1) is very gentle, Burning (2) is erratic/fast, Sunken (3) is heavy/slow
    let amp = 0.15
    if (id === 1) amp = 0.1
    if (id === 2) amp = hovered ? 0.35 : 0.2
    if (id === 3) amp = 0.05
    
    groupRef.current.position.y = position[1] + elevation + Math.sin(t * freq + randomPhase.current) * amp
    
    if (id === 1) groupRef.current.rotation.y = Math.sin(t * 0.1 + randomPhase.current) * 0.05
    if (id === 2) groupRef.current.rotation.y = Math.sin(t * 0.3 + randomPhase.current) * 0.1
    if (id === 3) groupRef.current.rotation.y = Math.sin(t * 0.05 + randomPhase.current) * 0.02
  })

  const handlePointerOver = (e) => {
    e.stopPropagation()
    setHovered(true)
    document.body.style.cursor = 'pointer'
    if (onHoverChange) onHoverChange(title)
  }

  const handlePointerOut = (e) => {
    e.stopPropagation()
    setHovered(false)
    document.body.style.cursor = 'default'
    if (onHoverChange) onHoverChange(null)
  }

  const handleClick = (e) => {
    e.stopPropagation()
    if (clicked) return
    setClicked(true)
    onExploreStart ? onExploreStart(position, route) : navigate(route)
  }

  return (
    <group
      ref={groupRef}
      position={[position[0], position[1] + elevation, position[2]]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* Conditionally render the specific island type based on ID */}
      {id === 1 && <StillIsland scale={scale} color={color} accentColor={accentColor} hovered={hovered} />}
      {id === 2 && <BurningIsland scale={scale} color={color} accentColor={accentColor} hovered={hovered} />}
      {id === 3 && <SunkenIsland scale={scale} color={color} accentColor={accentColor} hovered={hovered} />}

      {/* ── Hover Water Ripple Underneath ── */}
      <mesh position={[0, -position[1] - elevation + 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[scale * 0.5, scale * (hovered ? 2.5 : 1.5), 32]} />
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={hovered ? 0.3 : 0.0}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* ── Interactive HTML UI Label (Optional Explore Button) ── */}
      <Html
        distanceFactor={25}
        position={[0, scale * 2.0, 0]}
        center
        style={{
          pointerEvents: 'none',
          transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
          opacity: clicked ? 0 : (hovered ? 1 : 0),
          transform: `scale(${hovered ? 1.1 : 1})`,
          zIndex: hovered ? 100 : 0
        }}
      >
        <div className={`ow-island-label ${hovered ? 'ow-island-label--active' : ''}`}>
          <span className="ow-island-label__sub" style={{ textShadow: `0 0 10px ${accentColor}` }}>{subtitle}</span>
          <span className="ow-island-label__action" style={{ color: accentColor, borderColor: accentColor }}>
            EXPLORE
          </span>
        </div>
      </Html>
    </group>
  )
}
