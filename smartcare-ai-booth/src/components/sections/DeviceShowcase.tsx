import { Activity, Eye, Heart, Stethoscope, Thermometer, Wind } from 'lucide-react';
import { DeviceCard } from '../ui/DeviceCard';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const devices = [
  {
    title: 'AI Stethoscope',
    subtitle: 'Digital auscultation with real-time heart sound analysis and anomaly detection.',
    metric: 'AI Analysis',
    icon: <Stethoscope className="h-6 w-6" />,
  },
  {
    title: 'Digital Otoscope',
    subtitle: 'High-definition ear canal imaging with automated pathology screening.',
    metric: '4K Camera',
    icon: <Eye className="h-6 w-6" />,
  },
  {
    title: 'Vital Signs Monitor',
    subtitle: 'Comprehensive BP, SpO2, and pulse monitoring with clinical accuracy.',
    metric: 'Cloud Sync',
    icon: <Activity className="h-6 w-6" />,
  },
  {
    title: 'Smart Spirometer',
    subtitle: 'Pulmonary function testing with COPD and asthma screening algorithms.',
    metric: 'Guided',
    icon: <Wind className="h-6 w-6" />,
  },
  {
    title: 'IR Thermometer',
    subtitle: 'Contactless temperature screening with fever detection protocols.',
    metric: '1s Reading',
    icon: <Thermometer className="h-6 w-6" />,
  },
  {
    title: 'ECG Sensor',
    subtitle: 'Medical-grade 12-lead ECG with immediate cardiac event detection.',
    metric: 'AFib Detect',
    icon: <Heart className="h-6 w-6" />,
  },
];

export function DeviceShowcase() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  return (
    <section id="devices" ref={ref} className="relative min-h-screen scroll-mt-24 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-white md:text-6xl">
            Integrated <span className="text-cyan-400">Diagnostic Suite</span>
          </h2>
          <p className="mt-6 max-w-2xl text-xl text-slate-300">
            Six precision medical devices working in harmony, guided by AI and remotely supervised by clinical
            specialists.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {devices.map((device, index) => (
            <div
              key={device.title}
              className={`transition duration-700 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <DeviceCard {...device} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
