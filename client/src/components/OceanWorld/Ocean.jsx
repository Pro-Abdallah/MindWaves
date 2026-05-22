import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Ocean water plane component.
 * Uses a custom ShaderMaterial to displace vertices in a wave-like manner
 * and color them using the project's ocean blue palette.
 */
export default function Ocean() {
  const meshRef = useRef()

  // Custom shader uniforms
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColorDeep: { value: new THREE.Color("#05395E") }, // Deep Navy
    uColorMid: { value: new THREE.Color("#5184C0") },  // Steel Blue
    uColorPeak: { value: new THREE.Color("#91BFF6") }, // Sky Blue
    uColorMist: { value: new THREE.Color("#DFE1E6") }  // Mist
  }), [])

  // Animate the wave time uniform on each frame
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime()
    }
  })

  // Vertex Shader for wave displacement
  const vertexShader = `
    uniform float uTime;
    varying vec3 vPosition;
    varying float vElevation;
    varying vec3 vNormal;

    // Simple pseudo-random hash
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    // Simple noise function
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
                 mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
    }

    void main() {
      vPosition = position;
      
      // Calculate waves using multiple sine/cosine waves and noise
      float elevation = sin(position.x * 0.15 + uTime * 0.8) * 0.35
                      + cos(position.y * 0.18 + uTime * 0.6) * 0.35;
      
      // Add micro-ripples via noise
      elevation += noise(position.xy * 0.4 + uTime * 1.2) * 0.15;

      vElevation = elevation;
      
      vec3 displacedPosition = position;
      displacedPosition.z = elevation; // Offset height (in PlaneGeometry, normal is along Z axis before rotation)

      vec4 modelPosition = modelMatrix * vec4(displacedPosition, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      gl_Position = projectionMatrix * viewPosition;

      vNormal = normalMatrix * vec3(0.0, 0.0, 1.0); // simple normal direction
    }
  `

  // Fragment Shader for coloring and ambient lighting matching the palette
  const fragmentShader = `
    uniform vec3 uColorDeep;
    uniform vec3 uColorMid;
    uniform vec3 uColorPeak;
    uniform vec3 uColorMist;
    
    varying vec3 vPosition;
    varying float vElevation;
    varying vec3 vNormal;

    void main() {
      // Normalize elevation to range [0.0, 1.0] for color blending
      // Elevation swings roughly from -0.85 to +0.85
      float mixStrength = (vElevation + 0.85) / 1.7;
      mixStrength = clamp(mixStrength, 0.0, 1.0);

      // Gradient color blend based on wave height
      vec3 waterColor = mix(uColorDeep, uColorMid, mixStrength);
      
      // Add foam/peak highlight on the highest parts of waves
      if (vElevation > 0.4) {
        float peakStrength = smoothstep(0.4, 0.8, vElevation);
        waterColor = mix(waterColor, uColorPeak, peakStrength);
      }

      // Add a subtle touch of mist highlight on the extreme wave tops
      if (vElevation > 0.65) {
        float mistStrength = smoothstep(0.65, 0.85, vElevation);
        waterColor = mix(waterColor, uColorMist, mistStrength * 0.3);
      }

      // Ambient reflection based on height
      vec3 viewDir = vec3(0.0, 0.0, 1.0);
      float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 3.0);
      waterColor += uColorPeak * fresnel * 0.25;

      gl_FragColor = vec4(waterColor, 0.94);
    }
  `

  return (
    <mesh 
      ref={meshRef} 
      rotation={[-Math.PI * 0.5, 0, 0]} 
      position={[0, -0.5, 0]}
      receiveShadow
    >
      <planeGeometry args={[180, 180, 96, 96]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
