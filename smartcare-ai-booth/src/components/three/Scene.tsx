import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, PerspectiveCamera, Stars } from '@react-three/drei';
import { Suspense, useMemo, useState } from 'react';
import { gsap } from 'gsap';
import { Booth } from './Booth';
import { HologramAI } from './HologramAI';
import { MedicalDevices } from './MedicalDevices';
import { LoadingScreen } from '../ui/LoadingScreen';
import { Particles } from './Particles';

type DeviceId = 'stethoscope' | 'thermometer' | 'otoscope' | 'bp' | 'spirometer' | 'ecg';

function CameraController({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree();
  const positions = useMemo(
    () => [
      { x: 0, y: 0.4, z: 8 },
      { x: 4, y: 2, z: 6 },
      { x: -4, y: 1, z: 6 },
      { x: 0, y: 3, z: 10 },
      { x: 6, y: 0.5, z: 4.8 },
      { x: 0, y: -1.4, z: 6.4 },
    ],
    [],
  );

  useFrame(() => {
    const scaledProgress = scrollProgress * (positions.length - 1);
    const index = Math.floor(scaledProgress);
    const nextIndex = Math.min(index + 1, positions.length - 1);
    const alpha = scaledProgress % 1;
    const current = positions[index];
    const next = positions[nextIndex];

    camera.position.x = gsap.utils.interpolate(current.x, next.x, alpha);
    camera.position.y = gsap.utils.interpolate(current.y, next.y, alpha);
    camera.position.z = gsap.utils.interpolate(current.z, next.z, alpha);
    camera.lookAt(0, 0.2, 0);
  });

  return null;
}

function SceneContent({
  scrollProgress,
  activeDevice,
  setActiveDevice,
}: {
  scrollProgress: number;
  activeDevice: DeviceId | null;
  setActiveDevice: (id: DeviceId | null) => void;
}) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0.4, 8]} fov={45} />
      <CameraController scrollProgress={scrollProgress} />

      <ambientLight intensity={0.2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={120} color="#00d4ff" castShadow />
      <spotLight position={[-10, 10, -5]} angle={0.3} penumbra={1} intensity={35} color="#5ce1e6" />
      <pointLight position={[0, 5, 0]} intensity={18} color="#ffffff" />

      <Stars radius={100} depth={50} count={3500} factor={4} saturation={0} fade speed={1} />
      <Particles count={180} color="#5ce1e6" spread={[10, 7, 10]} size={0.03} opacity={0.35} />
      <Environment preset="city" />

      <group position={[0, -1, 0]}>
        <Booth scrollProgress={scrollProgress} />
        <MedicalDevices activeDevice={activeDevice} setActiveDevice={setActiveDevice} />
        <HologramAI visible={scrollProgress > 0.2 && scrollProgress < 0.84} />
      </group>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#0a1628" metalness={0.8} roughness={0.2} />
      </mesh>
      <ContactShadows position={[0, -3, 0]} opacity={0.38} scale={20} blur={2.5} far={4.5} />
    </>
  );
}

export function Scene({ scrollProgress }: { scrollProgress: number }) {
  const [activeDevice, setActiveDevice] = useState<DeviceId | null>(null);

  return (
    <div className="fixed inset-0 z-0">
      <Canvas shadows dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={['#020617']} />
        <fog attach="fog" args={['#020617', 12, 24]} />
        <Suspense fallback={<LoadingScreen />}>
          <SceneContent
            scrollProgress={scrollProgress}
            activeDevice={activeDevice}
            setActiveDevice={setActiveDevice}
          />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,212,255,0.12),transparent_34%)]" />
        <div className="absolute inset-x-0 top-0 h-32 animate-scan bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent opacity-30" />
      </div>
    </div>
  );
}
