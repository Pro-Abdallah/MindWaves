import { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { islandsData } from './islands.data'
import Ocean from './Ocean'
import Island from './Island'
import Ship from './Ship'
import Particles from './Particles'
import ConnectionPaths from './ConnectionPaths'

/**
 * Controller component to handle mouse parallax and cinematic zoom transitions.
 */
function CameraController({ zoomTarget, setZoomTarget, onZoomFinished }) {
  const { camera, mouse } = useThree()
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0))
  const defaultCamPos = useRef(new THREE.Vector3(0, 16, 28))

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    if (zoomTarget) {
      // ── Cinematic Zoom transition on Click ──
      // Target position slightly offset for a nice dramatic angle
      const targetCamPos = new THREE.Vector3(
        zoomTarget.position[0],
        zoomTarget.position[1] + 2.5,
        zoomTarget.position[2] + 4.5
      )

      camera.position.lerp(targetCamPos, 0.065)
      currentLookAt.current.lerp(new THREE.Vector3(...zoomTarget.position), 0.065)
      camera.lookAt(currentLookAt.current)

      // When close enough, trigger navigation
      if (camera.position.distanceTo(targetCamPos) < 0.15) {
        onZoomFinished()
      }
    } else {
      // ── Idle Parallax and Gentle drift ──
      // Gentle cinematic drift
      const driftX = Math.sin(time * 0.12) * 2.0
      const driftZ = Math.cos(time * 0.1) * 1.5

      // Mouse interactive offsets
      const mouseX = mouse.x * 6.5
      const mouseZ = -mouse.y * 4.5

      const targetX = defaultCamPos.current.x + driftX + mouseX
      const targetZ = defaultCamPos.current.z + driftZ + mouseZ
      const targetY = defaultCamPos.current.y + (mouse.y * 2.0)

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.04)
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.04)
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.04)

      // Gently look at the center of the world with mouse drift
      const targetLookAt = new THREE.Vector3(mouseX * 0.3, -1.0, mouseZ * 0.3)
      currentLookAt.current.lerp(targetLookAt, 0.04)
      camera.lookAt(currentLookAt.current)
    }
  })

  return null
}

export default function Scene({ onExploreStart }) {
  const [zoomTarget, setZoomTarget] = useState(null)
  const [pendingRoute, setPendingRoute] = useState(null)

  const handleIslandExplore = (position, route) => {
    setZoomTarget({ position })
    setPendingRoute(route)
  }

  const handleZoomFinished = () => {
    if (onExploreStart && pendingRoute) {
      onExploreStart(pendingRoute)
    }
  }

  return (
    <>
      {/* ── Parallax and camera controls ── */}
      <CameraController
        zoomTarget={zoomTarget}
        setZoomTarget={setZoomTarget}
        onZoomFinished={handleZoomFinished}
      />

      {/* ── Environment Atmosphere ── */}
      <color attach="background" args={["#020E18"]} />
      <fogExp2 attach="fog" color="#020E18" density={0.015} />

      {/* ── Lighting ── */}
      <ambientLight intensity={0.45} color="#5184C0" />

      {/* Main moonlight/directional light */}
      <directionalLight
        position={[25, 30, 20]}
        intensity={1.8}
        color="#91BFF6"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Subtle ocean underglow */}
      <directionalLight
        position={[-10, -15, -10]}
        intensity={0.4}
        color="#05395E"
      />

      {/* ── Dynamic Components ── */}
      <Ocean />
      <Ship />
      <Particles count={400} />
      <ConnectionPaths />

      {/* ── 6 Interactive Islands ── */}
      {islandsData.map((island) => (
        <Island
          key={island.id}
          id={island.id}
          title={island.title}
          subtitle={island.subtitle}
          position={island.position}
          color={island.color}
          accentColor={island.accentColor}
          scale={island.scale}
          elevation={island.elevation}
          route={island.route}
          onExploreStart={handleIslandExplore}
        />
      ))}
    </>
  )
}
