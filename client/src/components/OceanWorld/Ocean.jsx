import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Ocean — corrected coordinate system + visible dramatic waves.
 *
 * Root bug that was killing waves:
 *   PlaneGeometry lives in the LOCAL XY plane (position.z = 0 for every vertex).
 *   Previous code used `dot(d, p.xz)` — since p.z is ALWAYS 0, every wave
 *   collapsed into a 1-D stripe and looked frozen / flat.
 *   Fix: use `dot(d, p.xy)` for horizontal position, displace in local Z.
 *   After the mesh rotation (-PI/2 around X), local Z → world Y (up). ✓
 *
 * Performance:
 *   128×128 grid, 4 waves, 3-octave fBm in fragment — light and smooth.
 */
export default function Ocean() {
  const meshRef = useRef()

  const uniforms = useMemo(() => ({
    uTime:      { value: 0.0 },
    uColDeep:   { value: new THREE.Color('#003d7a') },   // vivid deep blue
    uColMid:    { value: new THREE.Color('#0077bb') },   // ocean blue
    uColLight:  { value: new THREE.Color('#22aadd') },   // bright surface
    uSunDir:    { value: new THREE.Vector3(0.6, 0.75, 0.3).normalize() },
    uSkyColor:  { value: new THREE.Color('#0099cc') },   // Fresnel sky tint
  }), [])

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime()
  })

  // ─────────────────────────────────────────────────────────────────────────
  // VERTEX SHADER
  // PlaneGeometry is in the LOCAL XY plane (z = 0 for all verts).
  // We use position.xy as horizontal coords and displace in the Z direction.
  // After the mesh rotation of -PI/2 around X  →  local Z becomes world Y (up).
  // ─────────────────────────────────────────────────────────────────────────
  const vertexShader = /* glsl */`
    #define PI 3.14159265

    uniform float uTime;

    varying vec3  vWorldPos;
    varying vec3  vNormal;
    varying float vWaveH;

    // w = (dirX, dirZ, amplitude, wavelength)
    // Uses position.xy as horizontal plane.  Displacement goes into Z (→ world Y after rotation).
    vec3 gerstner(vec4 w, vec3 p, float Q, inout vec3 T, inout vec3 B) {
      float k     = 2.0 * PI / w.w;
      float omega = sqrt(9.81 * k);
      vec2  d     = normalize(w.xy);

      // *** KEY FIX: dot on p.xy (horizontal plane of local geometry) ***
      float ph = k * dot(d, p.xy) - omega * uTime;
      float s  = sin(ph);
      float c  = cos(ph);
      float Qa = Q * w.z;

      // Tangent (dP/dX) and Binormal (dP/dY) accumulation
      T += vec3(-d.x*d.x*Qa*k*s,  -d.x*d.y*Qa*k*s,   d.x*w.z*k*c);
      B += vec3(-d.x*d.y*Qa*k*s,  -d.y*d.y*Qa*k*s,   d.y*w.z*k*c);

      // Displacement: horizontal XY, vertical Z
      return vec3(Qa*d.x*c,  Qa*d.y*c,  w.z*s);
    }

    void main() {
      vec3 p = position;
      vec3 T = vec3(1.0, 0.0, 0.0);   // tangent along local X
      vec3 B = vec3(0.0, 1.0, 0.0);   // binormal along local Y

      // 4 waves — big amplitudes so they're clearly visible from the camera
      p += gerstner(vec4( 1.00,  0.45, 0.80, 20.0), position, 0.28, T, B);
      p += gerstner(vec4( 0.50, -0.87, 0.60, 13.0), position, 0.24, T, B);
      p += gerstner(vec4(-0.55,  0.84, 0.35,  7.5), position, 0.20, T, B);
      p += gerstner(vec4(-0.82, -0.57, 0.20,  4.0), position, 0.15, T, B);

      // Analytic normal from tangent frame, then transform to world space
      vec3 localNormal = normalize(cross(T, B));
      vNormal   = normalize(mat3(modelMatrix) * localNormal);
      vWaveH    = p.z;   // local Z = displacement height

      vec4 worldPos = modelMatrix * vec4(p, 1.0);
      vWorldPos     = worldPos.xyz;

      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `

  // ─────────────────────────────────────────────────────────────────────────
  // FRAGMENT SHADER
  // World-space lighting — normals are already in world space from vertex stage.
  // fBm adds micro-ripple shimmer cheaply (3 octaves only).
  // ─────────────────────────────────────────────────────────────────────────
  const fragmentShader = /* glsl */`
    uniform float uTime;
    uniform vec3  uColDeep;
    uniform vec3  uColMid;
    uniform vec3  uColLight;
    uniform vec3  uSunDir;
    uniform vec3  uSkyColor;

    varying vec3  vWorldPos;
    varying vec3  vNormal;
    varying float vWaveH;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }
    float snoise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      f = f*f*(3.0 - 2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x),
                 mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y) * 2.0 - 1.0;
    }
    // 3-octave fBm — micro surface shimmer
    float fbm(vec2 p) {
      return snoise(p)*0.5 + snoise(p*2.03)*0.25 + snoise(p*4.1)*0.125;
    }

    void main() {
      vec3  N       = normalize(vNormal);
      vec3  viewDir = normalize(cameraPosition - vWorldPos);
      float t       = uTime * 0.5;

      // Perturb world-space normal with animated fBm micro-ripples
      vec2  uv = vWorldPos.xz * 0.25;
      float bx = fbm(uv + vec2( t*0.11,  t*0.07));
      float bz = fbm(uv + vec2(-t*0.08,  t*0.13));
      N = normalize(N + vec3(bx, 0.0, bz) * 0.15);

      // ── 3-stop colour ramp based on world-space wave height ──────────
      // vWaveH is local Z (= world Y after rotation), range roughly -0.8 to +0.8 per wave
      // total stacked range ≈ -2 to +2
      float blend = smoothstep(-1.5, 2.0, vWaveH);
      vec3  col   = mix(uColDeep, uColMid,   smoothstep(0.0, 0.5, blend));
      col         = mix(col,      uColLight, smoothstep(0.5, 1.0, blend));

      // ── Diffuse from sun ─────────────────────────────────────────────
      float diff = max(dot(N, uSunDir), 0.0);
      col += uColMid * diff * 0.45;

      // ── Schlick Fresnel — sky reflection at grazing angles ────────────
      float NdotV  = clamp(dot(N, viewDir), 0.0, 1.0);
      float fresnel = 0.02 + 0.98 * pow(1.0 - NdotV, 5.0);
      col = mix(col, uSkyColor, fresnel * 0.72);

      // ── Sharp sun specular glint ──────────────────────────────────────
      vec3  H     = normalize(uSunDir + viewDir);
      float NdotH = max(dot(N, H), 0.0);
      col += vec3(1.0, 0.96, 0.88) * pow(NdotH, 500.0) * 4.0;

      // ── Broad sky shimmer ─────────────────────────────────────────────
      col += uSkyColor * pow(NdotH, 20.0) * 0.3;

      gl_FragColor = vec4(col, 1.0);
    }
  `

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.5, 0]}
      receiveShadow
    >
      <planeGeometry args={[240, 240, 128, 128]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.FrontSide}
        transparent={false}
      />
    </mesh>
  )
}
