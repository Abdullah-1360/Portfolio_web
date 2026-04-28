'use client';

import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { Skill, SkillLevel } from '@/types';

const LEVEL_COLOR: Record<SkillLevel, string> = {
  Proficient: '#f0883e',
  Familiar:   '#6e7681',
  Learning:   '#30363d',
};

const LEVEL_EMISSIVE: Record<SkillLevel, number> = {
  Proficient: 0.5,
  Familiar:   0.2,
  Learning:   0.1,
};

// ── Single orb ────────────────────────────────────────────────────
function SkillOrb({
  skill,
  position,
  index,
}: {
  skill: Skill;
  position: [number, number, number];
  index: number;
}) {
  const meshRef  = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const lvl   = skill.level as SkillLevel;
  const color = LEVEL_COLOR[lvl];

  const linePositions = useMemo(
    () => new Float32Array([0, 0, 0, -position[0], -position[1], -position[2]]),
    [position],
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    const target = hovered ? 1.4 : 1.0;
    meshRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.12);
  });

  return (
    <Float speed={1.5 + (index % 4) * 0.4} rotationIntensity={0.1} floatIntensity={0.3}>
      <group position={position}>

        {/* Outer glow ring on hover */}
        {hovered && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.19, 0.24, 32]} />
            <meshBasicMaterial color={color} transparent opacity={0.6} side={THREE.DoubleSide} />
          </mesh>
        )}

        {/* Main orb — uniform size */}
        <mesh
          ref={meshRef}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
          onPointerOut={() => setHovered(false)}
        >
          <sphereGeometry args={[0.14, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 1.0 : LEVEL_EMISSIVE[lvl]}
            roughness={0.25}
            metalness={0.7}
          />
        </mesh>

        {/* Always-visible label */}
        <Html
          position={[0, 0.28, 0]}
          center
          distanceFactor={8}
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          <div
            className={`transition-all duration-200 whitespace-nowrap
                        ${hovered ? 'opacity-100' : 'opacity-70'}`}
          >
            <div
              className="px-2 py-1 rounded-md text-center"
              style={{
                background: 'rgba(13,17,23,0.85)',
                border: `1px solid ${hovered ? color : 'rgba(240,136,62,0.2)'}`,
                backdropFilter: 'blur(8px)',
              }}
            >
              <p style={{
                fontSize: '0.6rem',
                fontWeight: 600,
                color: hovered ? color : '#e6edf3',
                fontFamily: 'var(--font-jetbrains), monospace',
                letterSpacing: '0.03em',
              }}>
                {skill.name}
              </p>
            </div>
          </div>
        </Html>

        {/* Connection line to center — using lineSegments for R3F v8 compatibility */}
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={linePositions}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={color}
            transparent
            opacity={hovered ? 0.5 : 0.15}
          />
        </lineSegments>
      </group>
    </Float>
  );
}

// ── Central core ──────────────────────────────────────────────────
function Core() {
  const icoRef  = useRef<THREE.Mesh>(null);
  const ring1   = useRef<THREE.Mesh>(null);
  const ring2   = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (icoRef.current) {
      icoRef.current.rotation.y += 0.006;
      icoRef.current.rotation.x = Math.sin(t * 0.3) * 0.08;
    }
    if (ring1.current) ring1.current.rotation.z += 0.01;
    if (ring2.current) ring2.current.rotation.z -= 0.007;
  });

  return (
    <group>
      {/* Wireframe icosahedron */}
      <mesh ref={icoRef}>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshStandardMaterial
          color="#f0883e"
          emissive="#f0883e"
          emissiveIntensity={0.6}
          wireframe
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Inner solid glow */}
      <mesh>
        <sphereGeometry args={[0.42, 16, 16]} />
        <meshStandardMaterial
          color="#f0883e"
          emissive="#f0883e"
          emissiveIntensity={0.3}
          transparent
          opacity={0.12}
        />
      </mesh>

      {/* Orbit ring 1 */}
      <mesh ref={ring1} rotation={[Math.PI / 2.5, 0, 0]}>
        <ringGeometry args={[0.72, 0.76, 64]} />
        <meshBasicMaterial color="#f0883e" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Orbit ring 2 — tilted */}
      <mesh ref={ring2} rotation={[Math.PI / 1.4, 0.4, 0]}>
        <ringGeometry args={[0.85, 0.88, 64]} />
        <meshBasicMaterial color="#da3633" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// ── Orbit group ───────────────────────────────────────────────────
function OrbitGroup({ skills }: { skills: Skill[] }) {
  const groupRef = useRef<THREE.Group>(null);

  // Fibonacci sphere distribution — even spacing
  const positions = useMemo<[number, number, number][]>(() => {
    const golden = Math.PI * (3 - Math.sqrt(5));
    return skills.map((_, i) => {
      const y   = 1 - (i / (skills.length - 1)) * 2;
      const r   = Math.sqrt(1 - y * y);
      const theta = golden * i;
      const radius = 2.6;
      return [
        radius * r * Math.cos(theta),
        radius * y,
        radius * r * Math.sin(theta),
      ];
    });
  }, [skills]);

  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += 0.002;
  });

  return (
    <group ref={groupRef}>
      <Core />
      {skills.map((skill, i) => (
        <SkillOrb key={skill.name} skill={skill} position={positions[i]} index={i} />
      ))}
    </group>
  );
}

// ── Scene lights ──────────────────────────────────────────────────
function Lights() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 4, 4]}   intensity={20} color="#f0883e" />
      <pointLight position={[-4, -3, -4]} intensity={10} color="#da3633" />
      <pointLight position={[0, 5, 0]}   intensity={8}  color="#ffffff" />
    </>
  );
}

// ── Exported component ────────────────────────────────────────────
export default function SkillsOrbs({ skills }: { skills: Skill[] }) {
  return (
    <div className="w-full h-[480px] cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 48 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Lights />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI * 0.75}
        />
        <OrbitGroup skills={skills} />
      </Canvas>
    </div>
  );
}
