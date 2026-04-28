import { motion } from 'framer-motion';
import { Award, Clock, Lock, Server, Shield, Users, type LucideIcon } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const stats: Array<{ icon: LucideIcon; label: string; value: string }> = [
  { icon: Shield, label: 'HIPAA Compliant', value: '100%' },
  { icon: Lock, label: 'Data Encryption', value: '256-bit' },
  { icon: Award, label: 'Clinical Grade', value: 'Validated' },
  { icon: Users, label: 'Patient Visits', value: '1M+' },
  { icon: Server, label: 'Uptime', value: '99.99%' },
  { icon: Clock, label: 'Avg. Visit', value: '12 min' },
];

export function TrustSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  return (
    <section id="trust" ref={ref} className="relative overflow-hidden py-32 scroll-mt-24">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,212,255,0.1)_0%,transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            className="text-4xl font-bold text-white md:text-5xl"
          >
            Trusted by Leading <span className="text-cyan-400">Health Systems</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-xl text-slate-300"
          >
            Built with enterprise-grade security and clinical-grade operational thinking at its core.
          </motion.p>
        </div>

        <div className="mb-20 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-center transition-colors hover:border-cyan-500/30"
            >
              <stat.icon className="mx-auto mb-3 h-8 w-8 text-cyan-400" />
              <div className="mb-1 text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-8 opacity-60"
        >
          {['Northwell Health', 'Cleveland Clinic', 'Kaiser Permanente', 'HCA Healthcare', 'Apollo Hospitals'].map(
            (hospital) => (
              <div key={hospital} className="text-lg font-semibold tracking-wide text-slate-400">
                {hospital}
              </div>
            ),
          )}
        </motion.div>
      </div>
    </section>
  );
}
