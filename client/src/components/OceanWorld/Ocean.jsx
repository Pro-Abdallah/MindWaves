import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Deep, glassy, serene ocean without foam.
 * Uses Gerstner waves but with smoother, darker styling for a premium aesthetic.
 */
export default function Ocean() {
  const meshRef = useRef()

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uDeepColor: { value: new THREE.Color("#010b14") },    // Very deep black-blue
    uSurfaceColor: { value: new THREE.Color("#05284a") }, // Dark sapphire blue
    uWaveSteepness: { value: 0.15 }, // Lower steepness for smoother, calmer waves
    uWaveLength: { value: 16.0 },    // Longer, more majestic waves
    uWaveSpeed: { value: 0.8 },      // Slower, more relaxing
    uLightDir: { value: new THREE.Vector3(0.5, 1.0, 0.5).normalize() },
  }), [])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime() * 0.6
    }
  })

  // Gerstner Wave Shader
  const vertexShader = `
    uniform float uTime;
    uniform float uWaveSteepness;
    uniform float uWaveLength;
    uniform float uWaveSpeed;

    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying float vElevation;

    // Gerstner wave function
    vec3 gerstnerWave(vec4 wave, vec3 p, inout vec3 tangent, inout vec3 binormal) {
      float steepness = wave.z;
      float amplitude = wave.w;
      float k = 2.0 * 3.14159 / uWaveLength;
      float c = sqrt(9.8 / k);
      vec2 d = normalize(wave.xy);
      float f = k * (dot(d, p.xz) - c * uTime * uWaveSpeed);
      float a = steepness / k;

      tangent += vec3(
        -d.x * d.x * (steepness * sin(f)),
        d.x * (steepness * cos(f)),
        -d.x * d.y * (steepness * sin(f))
      );
      binormal += vec3(
        -d.x * d.y * (steepness * sin(f)),
        d.y * (steepness * cos(f)),
        -d.y * d.y * (steepness * sin(f))
      );
      return vec3(
        d.x * (a * cos(f)),
        a * sin(f),
        d.y * (a * cos(f))
      );
    }

    void main() {
      vec3 gridPoint = position;
      vec3 tangent = vec3(1.0, 0.0, 0.0);
      vec3 binormal = vec3(0.0, 0.0, 1.0);
      vec3 p = gridPoint;

      // Add smoother, longer waves
      p += gerstnerWave(vec4(1.0, 0.3, 0.15, 1.2), gridPoint, tangent, binormal);
      p += gerstnerWave(vec4(0.7, -0.7, 0.15, 0.8), gridPoint, tangent, binormal);
      p += gerstnerWave(vec4(-0.4, 0.8, 0.1, 0.5), gridPoint, tangent, binormal);

      vec3 normal = normalize(cross(binormal, tangent));
      vNormal = normal;
      vElevation = p.y;
      
      vec4 modelPosition = modelMatrix * vec4(p, 1.0);
      vWorldPosition = modelPosition.xyz;
      gl_Position = projectionMatrix * viewMatrix * modelPosition;
    }
  `

  const fragmentShader = `
    uniform vec3 uDeepColor;
    uniform vec3 uSurfaceColor;
    uniform vec3 uLightDir;
    
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying float vElevation;

    void main() {
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      vec3 normal = normalize(vNormal);

      // Smooth blend between deep and surface color based on height
      float heightMix = smoothstep(-1.0, 1.5, vElevation);
      vec3 color = mix(uDeepColor, uSurfaceColor, heightMix);

      // Diffuse lighting (very subtle for dark water)
      float diff = max(dot(normal, uLightDir), 0.0);
      color += uSurfaceColor * diff * 0.15;

      // Glassy Fresnel reflection (reflecting a soft cyan/moonlight sky)
      float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);
      vec3 skyReflection = vec3(0.3, 0.6, 0.9); // Cyan moonlight glow
      color = mix(color, skyReflection, fresnel * 0.4);

      // Specular highlight for a glassy look (no foam)
      vec3 halfVector = normalize(uLightDir + viewDir);
      float spec = pow(max(dot(normal, halfVector), 0.0), 256.0);
      vec3 specColor = vec3(0.7, 0.9, 1.0);
      color += specColor * spec * 0.6;

      // Edge fading for soft horizon
      float dist = length(vWorldPosition.xz);
      float alpha = smoothstep(120.0, 80.0, dist);

      gl_FragColor = vec4(color, alpha * 0.98);
    }
  `

  return (
    <mesh 
      ref={meshRef} 
      rotation={[-Math.PI * 0.5, 0, 0]} 
      position={[0, -0.5, 0]}
      receiveShadow
    >
      <planeGeometry args={[250, 250, 256, 256]} />
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
