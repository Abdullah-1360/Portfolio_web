import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Particles } from './Particles';

export function HologramAI({ visible = true }: { visible?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const beamRef = useRef<THREE.Mesh>(null);
  const ringGeometry = useMemo(() => new THREE.RingGeometry(0.5, 0.52, 64), []);

  useFrame((state) => {
    if (!groupRef.current || !visible) {
      return;
    }

    groupRef.current.position.y = 1.4 + Math.sin(state.clock.elapsedTime * 0.8) * 0.12;

    if (ringsRef.current) {
      ringsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.45) * 0.12;
      ringsRef.current.rotation.y += 0.012;
    }

    if (beamRef.current) {
      beamRef.current.position.y = Math.sin(state.clock.elapsedTime * 2.2) * 0.25;
    }
  });

  if (!visible) {
    return null;
  }

  return (
    <group ref={groupRef} position={[0, 1.4, 0]}>
      <group ref={ringsRef}>
        {[0, 1, 2].map((index) => (
          <mesh
            key={index}
            geometry={ringGeometry}
            rotation={[Math.PI / 2, 0, 0]}
            position={[0, -0.45 + index * 0.42, 0]}
            scale={1 + index * 0.28}
          >
            <meshBasicMaterial color="#00d4ff" transparent opacity={0.3 - index * 0.08} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>

      <mesh>
        <capsuleGeometry args={[0.3, 1, 4, 8]} />
        <meshStandardMaterial
          color="#a5f3fc"
          transparent
          opacity={0.15}
          emissive="#00d4ff"
          emissiveIntensity={0.5}
        />
      </mesh>

      <mesh ref={beamRef}>
        <planeGeometry args={[1.85, 0.05]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.6} />
      </mesh>

      <Particles count={60} color="#00d4ff" spread={[2, 3.2, 2]} size={0.05} opacity={0.6} />
    </group>
  );
}
