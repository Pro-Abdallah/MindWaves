import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { islandsData } from './islands.data'

/**
 * Renders glowing, curved paths connecting the islands.
 * The paths represent neural/emotional routes and pulse dynamically.
 */
function CurvedPath({ start, end, color }) {
  const lineRef = useRef()

  // Generate a CatmullRom curve that bends sideways to create a beautiful flow
  const points = useMemo(() => {
    const startVec = new THREE.Vector3(start[0], -0.2, start[2])
    const endVec = new THREE.Vector3(end[0], -0.2, end[2])

    // Find midpoint
    const midVec = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5)
    
    // Displace midpoint perpendicular to the direction to create a horizontal curve
    const dir = new THREE.Vector3().subVectors(endVec, startVec).normalize()
    const perp = new THREE.Vector3(-dir.z, 0, dir.x).multiplyScalar(3.0) // horizontal bend
    midVec.add(perp)
    // Dip it slightly below the water surface level
    midVec.y = -0.4

    const curve = new THREE.CatmullRomCurve3([startVec, midVec, endVec])
    return curve.getPoints(50)
  }, [start, end])

  // Animate the dash offset or opacity to simulate pulsing flow
  useFrame((state) => {
    if (!lineRef.current) return
    const time = state.clock.getElapsedTime()
    
    // Pulse light intensity
    lineRef.current.material.opacity = 0.25 + Math.sin(time * 2.2) * 0.15
  })

  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(points.flatMap(p => [p.x, p.y, p.z])), 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={0.3}
        linewidth={2} // Note: WebGL standard restricts linewidth to 1.0 on most platforms, but we add glow via design
        blending={THREE.AdditiveBlending}
      />
    </line>
  )
}

export default function ConnectionPaths() {
  // Define links between islands
  const connections = useMemo(() => [
    { from: 1, to: 2, color: "#5184C0" },
    { from: 2, to: 5, color: "#91BFF6" },
    { from: 5, to: 4, color: "#5184C0" },
    { from: 4, to: 3, color: "#91BFF6" },
    { from: 3, to: 1, color: "#DFE1E6" },
    { from: 6, to: 1, color: "#91BFF6" },
    { from: 6, to: 2, color: "#5184C0" }
  ], [])

  return (
    <group>
      {connections.map((conn, idx) => {
        const islandFrom = islandsData.find(i => i.id === conn.from)
        const islandTo = islandsData.find(i => i.id === conn.to)
        
        if (!islandFrom || !islandTo) return null

        return (
          <CurvedPath
            key={idx}
            start={islandFrom.position}
            end={islandTo.position}
            color={conn.color}
          />
        )
      })}
    </group>
  )
}
