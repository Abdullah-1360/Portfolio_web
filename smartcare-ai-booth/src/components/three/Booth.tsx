import { Float, MeshTransmissionMaterial, RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group, Mesh, MeshStandardMaterial } from 'three';

export function Booth({ scrollProgress }: { scrollProgress: number }) {
  const boothRef = useRef<Group>(null);
  const screenRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (boothRef.current) {
      boothRef.current.rotation.y = scrollProgress * Math.PI * 0.45 + Math.sin(state.clock.elapsedTime * 0.18) * 0.05;
      boothRef.current.position.y = -0.15 + Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
    }

    if (screenRef.current) {
      const material = screenRef.current.material as MeshStandardMaterial;
      material.emissiveIntensity = 0.55 + Math.sin(state.clock.elapsedTime * 2.2) * 0.15;
    }
  });

  return (
    <group ref={boothRef} position={[0, -1.1, 0]}>
      <mesh position={[0, -2.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.6, 64]} />
        <meshStandardMaterial color="#00d4ff" transparent opacity={0.12} emissive="#00d4ff" emissiveIntensity={0.25} />
      </mesh>

      <RoundedBox args={[3, 4, 3]} radius={0.18} smoothness={5}>
        <meshStandardMaterial color="#102341" metalness={0.85} roughness={0.14} envMapIntensity={1.2} />
      </RoundedBox>

      <mesh position={[0, 0, 1.54]}>
        <planeGeometry args={[2.5, 3.45]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.45}
          chromaticAberration={0.18}
          anisotropy={0.3}
          distortion={0}
          distortionScale={0}
          temporalDistortion={0}
          transmission={1}
          roughness={0.08}
          ior={1.42}
          color="#a5f3fc"
        />
      </mesh>

      <mesh ref={screenRef} position={[0, 1.8, 0]}>
        <boxGeometry args={[2.78, 0.1, 2.78]} />
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.55} />
      </mesh>

      <RoundedBox args={[0.22, 3.85, 2.82]} radius={0.06} position={[-1.58, 0, 0]}>
        <meshStandardMaterial color="#0b1930" metalness={0.75} roughness={0.22} />
      </RoundedBox>
      <RoundedBox args={[0.22, 3.85, 2.82]} radius={0.06} position={[1.58, 0, 0]}>
        <meshStandardMaterial color="#0b1930" metalness={0.75} roughness={0.22} />
      </RoundedBox>

      <Float speed={2} rotationIntensity={0.08} floatIntensity={0.15}>
        <mesh position={[-1.72, 0.42, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[1.45, 1.95]} />
          <meshStandardMaterial color="#020617" emissive="#00d4ff" emissiveIntensity={0.16} />
        </mesh>
      </Float>

      <mesh position={[0, 2.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.02, 1.22, 48]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.85}
          transparent
          opacity={0.62}
        />
      </mesh>

      {[
        [-1.4, -1.4],
        [1.4, -1.4],
        [-1.4, 1.4],
        [1.4, 1.4],
      ].map(([x, z], index) => (
        <mesh key={index} position={[x, 0, z]}>
          <cylinderGeometry args={[0.05, 0.05, 4, 16]} />
          <meshStandardMaterial color="#5ce1e6" emissive="#5ce1e6" emissiveIntensity={0.45} />
        </mesh>
      ))}

      <RoundedBox args={[3.4, 0.14, 1]} radius={0.04} smoothness={4} position={[0, -1.45, 1.34]}>
        <meshStandardMaterial color="#0b1930" metalness={0.55} roughness={0.22} />
      </RoundedBox>
    </group>
  );
}
