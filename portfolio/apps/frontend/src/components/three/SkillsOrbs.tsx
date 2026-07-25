'use client';

import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { Skill, SkillLevel } from '@/types';

const LEVEL_COLOR: Record<SkillLevel, string> = {
  Proficient: '#F0883E',
  Familiar:   '#FB923C',
  Learning:   '#EA580C',
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
        <mesh
          ref={meshRef}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
          onPointerOut={() => setHovered(false)}
        >
          <sphereGeometry args={[0.16, 24, 24]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={LEVEL_EMISSIVE[lvl]}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
        <Html center distanceFactor={7.5} style={{ pointerEvents: 'none' }}>
          <div
            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold whitespace-nowrap
              transition-all duration-200 border
              ${hovered
                ? 'bg-[var(--accent)] text-white border-transparent scale-110 shadow-lg'
                : 'bg-[var(--bg-2)]/90 text-[var(--text)] border-[var(--border)]'
              }`}
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {skill.name}
          </div>
        </Html>
      </group>
    </Float>
  );
}

function Core() {
  const icoRef = useRef<THREE.Mesh>(null);
  const ring1  = useRef<THREE.Mesh>(null);
  const ring2  = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (icoRef.current) icoRef.current.rotation.y += delta * 0.2;
    if (ring1.current)  ring1.current.rotation.z += delta * 0.15;
    if (ring2.current)  ring2.current.rotation.x += delta * 0.1;
  });

  return (
    <group>
      <mesh ref={icoRef}>
        <icosahedronGeometry args={[0.52, 1]} />
        <meshStandardMaterial color="#F0883E" emissive="#F0883E" emissiveIntensity={0.7}
          wireframe transparent opacity={0.75} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#F0883E" emissive="#F0883E" emissiveIntensity={0.25}
          transparent opacity={0.08} />
      </mesh>
      <mesh ref={ring1} rotation={[Math.PI / 2.5, 0, 0]}>
        <ringGeometry args={[0.7, 0.73, 64]} />
        <meshBasicMaterial color="#F0883E" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ring2} rotation={[Math.PI / 1.4, 0.4, 0]}>
        <ringGeometry args={[0.82, 0.85, 64]} />
        <meshBasicMaterial color="#FB923C" transparent opacity={0.2} side={THREE.DoubleSide} />
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
        <pointLight position={[4, 4, 4]}   intensity={25} color="#F0883E" />
        <pointLight position={[-4, -3, -4]} intensity={12} color="#FB923C" />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false}
          minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI * 0.75} />
        <OrbitGroup skills={skills} />
      </Canvas>
    </div>
  );
}
