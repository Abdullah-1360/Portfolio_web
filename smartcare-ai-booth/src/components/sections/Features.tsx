import { motion, useInView } from 'framer-motion';
import { Bot, Cpu, Globe, Monitor, Share2, Shield, type LucideIcon } from 'lucide-react';
import { useRef } from 'react';

const featureGroups: Array<{
  icon: LucideIcon;
  title: string;
  description: string;
}> = [
  {
    icon: Monitor,
    title: 'Smart Medical Mirror',
    description:
      'High-resolution display provides real-time biometric visualization and guided diagnostic instructions with augmented overlays.',
  },
  {
    icon: Bot,
    title: 'AI Intake Avatar',
    description:
      'An empathetic, multilingual assistant reduces clinician burden while improving patient confidence and speed.',
  },
  {
    icon: Share2,
    title: 'Remote Integration',
    description:
      'Seamless connections with hospital EMR systems and telehealth platforms enable immediate specialist consultation.',
  },
  {
    icon: Shield,
    title: 'Clinical Security',
    description:
      'HIPAA-oriented architecture with encryption, access controls, and audit trails keeps enterprise deployments grounded.',
  },
  {
    icon: Globe,
    title: 'Global Accessibility',
    description:
      'Support for 40+ languages and culturally adapted protocols expands access without compromising clarity.',
  },
  {
    icon: Cpu,
    title: 'Digital Twin',
    description:
      'Predictive health modeling supports proactive recommendations and richer chronic disease management pathways.',
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center">
          <h2 className="text-4xl font-bold text-white md:text-6xl">
            Next-Generation <span className="text-cyan-400">Capabilities</span>
          </h2>
        </div>

        <div className="space-y-20">
          {featureGroups.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof featureGroups)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const isEven = index % 2 === 0;
  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8 }}
      className={`flex flex-col items-center gap-12 py-8 ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
    >
      <div className="flex-1">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10">
          <Icon className="h-8 w-8 text-cyan-400" />
        </div>
        <h3 className="text-3xl font-bold text-white md:text-4xl">{feature.title}</h3>
        <p className="mt-6 text-lg leading-8 text-slate-300">{feature.description}</p>
        <button className="mt-8 flex items-center gap-2 font-semibold text-cyan-400 transition-all hover:gap-4">
          Learn more <span>-&gt;</span>
        </button>
      </div>

      <div className="relative flex-1">
        <div className="relative mx-auto aspect-square max-w-md">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 blur-3xl" />
          <div className="relative flex h-full items-center justify-center overflow-hidden rounded-3xl border border-slate-700 bg-slate-900/50 p-8 backdrop-blur-xl">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
            <Icon className="relative z-10 h-32 w-32 text-cyan-400/50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute h-48 w-48 rounded-full border border-cyan-500/30"
              />
              <motion.div
                animate={{ scale: [1.2, 1.4, 1.2], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                className="absolute h-64 w-64 rounded-full border border-cyan-500/20"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
