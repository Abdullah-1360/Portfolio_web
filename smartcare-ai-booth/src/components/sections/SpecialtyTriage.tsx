import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Brain, Eye, Headphones, Heart, Stethoscope, Wind, type LucideIcon } from 'lucide-react';

const specialties: Array<{ icon: LucideIcon; name: string; color: string; delay: number }> = [
  { icon: Headphones, name: 'ENT Care', color: 'from-sky-500 to-cyan-400', delay: 0 },
  { icon: Heart, name: 'Cardiology', color: 'from-rose-500 to-orange-400', delay: 0.1 },
  { icon: Wind, name: 'Respiratory', color: 'from-cyan-500 to-blue-500', delay: 0.2 },
  { icon: Stethoscope, name: 'General Triage', color: 'from-emerald-500 to-teal-400', delay: 0.3 },
  { icon: Brain, name: 'Mental Health', color: 'from-amber-500 to-orange-500', delay: 0.4 },
  { icon: Eye, name: 'Dermatology', color: 'from-coral to-rose-400', delay: 0.5 },
];

export function SpecialtyTriage() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="triage" ref={ref} className="relative min-h-screen py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="text-4xl font-bold text-white md:text-6xl"
          >
            Intelligent <span className="text-cyan-400">Specialty Routing</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-xl text-slate-300"
          >
            AI-driven triage protocols automatically route patients to the appropriate clinical pathway and specialist.
          </motion.p>
        </div>

        <div className="relative mx-auto max-w-5xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="absolute left-1/2 top-1/2 z-20 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-cyan-500 bg-slate-900 text-center shadow-2xl shadow-cyan-500/40"
          >
            <div>
              <div className="text-2xl font-bold text-white">AI</div>
              <div className="text-xs text-cyan-400">CORE</div>
            </div>
          </motion.div>

          <svg className="pointer-events-none absolute inset-0 h-full w-full">
            {specialties.map((_, index) => {
              const angle = index * 60 * (Math.PI / 180);
              const x1 = 50 + 15 * Math.cos(angle);
              const y1 = 50 + 15 * Math.sin(angle);
              const x2 = 50 + 40 * Math.cos(angle);
              const y2 = 50 + 40 * Math.sin(angle);

              return (
                <motion.line
                  key={index}
                  x1={`${x1}%`}
                  y1={`${y1}%`}
                  x2={`${x2}%`}
                  y2={`${y2}%`}
                  stroke="url(#triage-gradient)"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={isInView ? { pathLength: 1 } : {}}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              );
            })}
            <defs>
              <linearGradient id="triage-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#5ce1e6" stopOpacity="0.5" />
              </linearGradient>
            </defs>
          </svg>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 md:gap-16">
            {specialties.map((specialty, index) => (
              <motion.div
                key={specialty.name}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: specialty.delay + 0.3 }}
                className={index === 1 || index === 4 ? 'md:mt-32' : ''}
              >
                <div className="group rounded-2xl border border-slate-700 bg-slate-900/80 p-6 text-center backdrop-blur-md transition-all duration-300 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/20">
                  <div
                    className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${specialty.color} shadow-lg transition-transform group-hover:scale-110`}
                  >
                    <specialty.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{specialty.name}</h3>
                  <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-gradient-to-r from-cyan-500 to-transparent" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
