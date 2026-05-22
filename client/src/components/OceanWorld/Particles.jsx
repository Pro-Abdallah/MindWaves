import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Floating particle system representing ocean mist and light rays.
 * Uses a custom ShaderMaterial on Points for high-performance floating animations.
 */
export default function Particles({ count = 350 }) {
  const pointsRef = useRef()

  // Generate random positions and speeds for particles
  const [positions, randoms] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const rand = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      // Spread across a cylinder-like volume
      const angle = Math.random() * Math.PI * 2
      const radius = 10 + Math.random() * 55
      pos[i * 3] = Math.cos(angle) * radius // X
      pos[i * 3 + 1] = Math.random() * 12 // Y (elevation above water)
      pos[i * 3 + 2] = Math.sin(angle) * radius // Z

      rand[i * 3] = Math.random() // speed multiplier X
      rand[i * 3 + 1] = Math.random() // speed multiplier Y
      rand[i * 3 + 2] = Math.random() // speed multiplier Z
    }
    return [pos, rand]
  }, [count])

  // Custom shader uniforms
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("#91BFF6") }, // Sky Blue
    uColorMist: { value: new THREE.Color("#DFE1E6") } // Mist
  }), [])

  // Animate the particles' time uniform
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime()
    }
  })

  // Vertex Shader for drifting/floating positions
  const vertexShader = `
    uniform float uTime;
    attribute vec3 aRandom;
    varying float vAlpha;
    varying vec3 vColor;

    void main() {
      vec3 pos = position;

      // Gentle wave/float offsets based on time and individual particle random speeds
      pos.x += sin(uTime * 0.15 + aRandom.x * 100.0) * 1.5;
      pos.y += cos(uTime * 0.25 + aRandom.y * 100.0) * 1.2 + (uTime * 0.1);
      pos.z += cos(uTime * 0.15 + aRandom.z * 100.0) * 1.5;

      // Wrap Y coordinate to keep particles within a ceiling height
      pos.y = mod(pos.y, 14.0) - 1.0;

      vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      gl_Position = projectionMatrix * viewPosition;

      // Fade out particles near the top and bottom bounds
      float fadeBottom = smoothstep(-1.0, 1.0, pos.y);
      float fadeTop = 1.0 - smoothstep(10.0, 13.0, pos.y);
      vAlpha = fadeBottom * fadeTop;

      // Fade out particles that are very far from center
      float dist = length(pos.xz);
      vAlpha *= (1.0 - smoothstep(40.0, 65.0, dist));

      // Vary point size slightly based on distance to camera
      gl_PointSize = (18.0 + aRandom.z * 15.0) / -viewPosition.z;
    }
  `

  // Fragment Shader for a soft glowing round particle shape
  const fragmentShader = `
    uniform vec3 uColor;
    varying float vAlpha;

    void main() {
      // Shape points into soft circles (billboarding)
      float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
      if (distanceToCenter > 0.5) discard;

      // Smooth glow outline falloff
      float glow = 1.0 - (distanceToCenter * 2.0);
      glow = pow(glow, 2.0);

      gl_FragColor = vec4(uColor, glow * vAlpha * 0.7);
    }
  `

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          args={[randoms, 3]}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
