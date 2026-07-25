'use client';

import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { Skill, SkillLevel } from '@/types';

const LEVEL_COLOR: Record<SkillLevel, string> = {
  Proficient: '#22C55E',
  Familiar:   '#22D3EE',
  Learning:   '#A78BFA',
};

const LEVEL_EMISSIVE: Record<SkillLevel, number> = {
  Proficient: 0.6,
  Familiar:   0.3,
  Learning:   0.2,
};

function SkillOrb({ skill, position, index }: { skill: Skill; position: [number, number, number]; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const lvl   = skill.level as SkillLevel;
  const color = LEVEL_COLOR[lvl];

  useFrame(() => {
    if (!meshRef.current) return;
    const target = hovered ? 1.6 : 1.0;
    meshRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.1);
  });

  return (
    <Float speed={1.4 + (index % 4) * 0.3} rotationIntensity={0.06} floatIntensity={0.22}>
      <group position={position}>
        {hovered && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.22, 0.28, 32]} />
            <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
          </mesh>
        )}
        <mesh
          ref={meshRef}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
          onPointerOut={() => setHovered(false)}
        >
          <sphereGeometry args={[0.14, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 1.2 : LEVEL_EMISSIVE[lvl]}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
        {hovered && (
          <Html position={[0, 0.34, 0]} center distanceFactor={9}
                style={{ pointerEvents: 'none', userSelect: 'none' }}>
            <div style={{
              background: 'rgba(9,9,11,0.92)',
              border: `1px solid ${color}`,
              borderRadius: '8px',
              padding: '5px 12px',
              whiteSpace: 'nowrap',
              backdropFilter: 'blur(12px)',
              boxShadow: `0 0 16px ${color}50`,
            }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color, fontFamily: 'JetBrains Mono, monospace', margin: 0 }}>
                {skill.name}
              </p>
              <p style={{ fontSize: '9px', color: '#71717A', fontFamily: 'JetBrains Mono, monospace', margin: '2px 0 0' }}>
                {skill.level}
              </p>
            </div>
          </Html>
        )}
      </group>
    </Float>
  );
}

function Core() {
  const icoRef = useRef<THREE.Mesh>(null);
  const ring1  = useRef<THREE.Mesh>(null);
  const ring2  = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (icoRef.current) {
      icoRef.current.rotation.y += 0.005;
      icoRef.current.rotation.x = Math.sin(t * 0.3) * 0.07;
    }
    if (ring1.current) ring1.current.rotation.z += 0.009;
    if (ring2.current) ring2.current.rotation.z -= 0.006;
  });

  return (
    <group>
      <mesh ref={icoRef}>
        <icosahedronGeometry args={[0.52, 1]} />
        <meshStandardMaterial color="#22C55E" emissive="#22C55E" emissiveIntensity={0.7}
          wireframe transparent opacity={0.75} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#22C55E" emissive="#22C55E" emissiveIntensity={0.25}
          transparent opacity={0.08} />
      </mesh>
      <mesh ref={ring1} rotation={[Math.PI / 2.5, 0, 0]}>
        <ringGeometry args={[0.7, 0.73, 64]} />
        <meshBasicMaterial color="#22C55E" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ring2} rotation={[Math.PI / 1.4, 0.4, 0]}>
        <ringGeometry args={[0.82, 0.85, 64]} />
        <meshBasicMaterial color="#22D3EE" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function OrbitGroup({ skills }: { skills: Skill[] }) {
  const groupRef = useRef<THREE.Group>(null);

  const positions = useMemo<[number, number, number][]>(() => {
    const golden = Math.PI * (3 - Math.sqrt(5));
    const n = skills.length;
    return skills.map((_, i) => {
      const y = 1 - (i / Math.max(n - 1, 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      const radius = 2.5;
      return [radius * r * Math.cos(theta), radius * y, radius * r * Math.sin(theta)];
    });
  }, [skills]);

  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += 0.0018;
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

export default function SkillsOrbs({ skills }: { skills: Skill[] }) {
  return (
    <div className="w-full h-[480px] cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 7], fov: 48 }} dpr={[1, 1.5]}
              gl={{ antialias: true, alpha: true }} style={{ background: 'transparent' }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[4, 4, 4]}   intensity={25} color="#22C55E" />
        <pointLight position={[-4, -3, -4]} intensity={12} color="#22D3EE" />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false}
          minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI * 0.75} />
        <OrbitGroup skills={skills} />
      </Canvas>
    </div>
  );
}
