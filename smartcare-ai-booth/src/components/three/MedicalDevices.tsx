import { Float, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Activity, Eye, Heart, Stethoscope, Thermometer, Wind, type LucideIcon } from 'lucide-react';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

type DeviceId = 'stethoscope' | 'thermometer' | 'otoscope' | 'bp' | 'spirometer' | 'ecg';

type DeviceConfig = {
  id: DeviceId;
  icon: LucideIcon;
  position: [number, number, number];
  label: string;
  desc: string;
};

type MedicalDevicesProps = {
  activeDevice: DeviceId | null;
  setActiveDevice: (id: DeviceId | null) => void;
};

type DeviceNodeProps = DeviceConfig & {
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
};

const devices: DeviceConfig[] = [
  {
    id: 'stethoscope',
    icon: Stethoscope,
    position: [-2.5, 1, 1],
    label: 'Digital Stethoscope',
    desc: 'AI-powered auscultation analysis',
  },
  {
    id: 'thermometer',
    icon: Thermometer,
    position: [2.5, 1.5, 0.5],
    label: 'IR Thermometer',
    desc: 'Contactless fever detection',
  },
  {
    id: 'otoscope',
    icon: Eye,
    position: [-2, -0.5, 1.5],
    label: 'Digital Otoscope',
    desc: 'HD ear canal imaging',
  },
  {
    id: 'bp',
    icon: Activity,
    position: [2, 0, 1.5],
    label: 'BP Monitor',
    desc: 'Oscillometric measurement',
  },
  {
    id: 'spirometer',
    icon: Wind,
    position: [0, 2.5, 1],
    label: 'Spirometer',
    desc: 'Lung function analysis',
  },
  {
    id: 'ecg',
    icon: Heart,
    position: [2.5, -1, 0],
    label: 'ECG Sensor',
    desc: '12-lead cardiac monitoring',
  },
];

export function MedicalDevices({ activeDevice, setActiveDevice }: MedicalDevicesProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.12;
    }
  });

  return (
    <group ref={groupRef}>
      {devices.map((device) => (
        <DeviceNode
          key={device.id}
          {...device}
          isActive={activeDevice === device.id}
          onHover={() => setActiveDevice(device.id)}
          onLeave={() => setActiveDevice(null)}
        />
      ))}
    </group>
  );
}

function DeviceNode({ position, label, desc, isActive, onHover, onLeave, icon: Icon }: DeviceNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const linePoints = useMemo(() => new Float32Array([...position, 0, 0, 0]), [position]);

  useFrame(() => {
    if (!meshRef.current) {
      return;
    }

    const scale = isActive ? 1.28 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.08);
  });

  return (
    <Float speed={3} rotationIntensity={0.2} floatIntensity={0.32}>
      <group>
        <mesh ref={meshRef} position={position} onPointerOver={onHover} onPointerOut={onLeave}>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial
            color={isActive ? '#00d4ff' : '#5ce1e6'}
            emissive={isActive ? '#00d4ff' : '#5ce1e6'}
            emissiveIntensity={isActive ? 0.85 : 0.32}
            transparent
            opacity={0.92}
          />

          {isActive ? (
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.2, 0.25, 32]} />
              <meshBasicMaterial color="#00d4ff" transparent opacity={0.5} side={THREE.DoubleSide} />
            </mesh>
          ) : null}
        </mesh>

        <Html position={[position[0], position[1] + 0.42, position[2]]} distanceFactor={10} style={{ pointerEvents: 'none' }}>
          <div
            className={`min-w-[210px] rounded-2xl border border-cyan-500/25 bg-slate-950/88 p-3 text-center shadow-2xl shadow-cyan-500/20 backdrop-blur-md transition-all duration-300 ${
              isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
            }`}
          >
            <Icon className="mx-auto mb-2 h-6 w-6 text-cyan-400" />
            <h3 className="text-sm font-semibold text-cyan-100">{label}</h3>
            <p className="mt-1 text-xs text-slate-400">{desc}</p>
          </div>
        </Html>

        <line>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[linePoints, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color="#00d4ff" transparent opacity={0.2} />
        </line>
      </group>
    </Float>
  );
}
