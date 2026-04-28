import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Points } from 'three';

type ParticlesProps = {
  count?: number;
  color?: string;
  spread?: [number, number, number];
  size?: number;
  opacity?: number;
};

export function Particles({
  count = 180,
  color = '#7cf5d5',
  spread = [7, 4, 5],
  size = 0.04,
  opacity = 0.72,
}: ParticlesProps) {
  const pointsRef = useRef<Points>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      const stride = index * 3;
      values[stride] = (Math.random() - 0.5) * spread[0];
      values[stride + 1] = (Math.random() - 0.5) * spread[1];
      values[stride + 2] = (Math.random() - 0.5) * spread[2];
    }

    return values;
  }, [count, spread]);

  useFrame((state) => {
    if (!pointsRef.current) {
      return;
    }

    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.04;
    pointsRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.1;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={size} sizeAttenuation transparent opacity={opacity} />
    </points>
  );
}
