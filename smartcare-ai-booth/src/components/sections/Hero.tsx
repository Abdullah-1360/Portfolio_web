import { ArrowRight, Play, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section id="experience" className="relative flex min-h-screen items-center justify-center px-4 pt-24 text-center sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(0,212,255,0.16),transparent_28%),radial-gradient(circle_at_bottom,rgba(92,225,230,0.08),transparent_24%)]" />
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35 }}
          className="pointer-events-none"
        >
          <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300 backdrop-blur-sm">
            <Shield className="h-4 w-4" />
            Hospital-Grade AI Diagnostics
          </div>

          <h1 className="mt-6 font-display text-6xl font-bold leading-[0.92] text-white sm:text-7xl lg:text-8xl">
            SmartCare <span className="bg-gradient-to-r from-cyan-300 to-cyan-500 bg-clip-text text-transparent">AI Booth</span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-xl leading-8 text-slate-300 md:text-2xl">
            The future of autonomous healthcare. A complete diagnostic ecosystem powered by AI, delivering
            specialist-level triage in any setting.
          </p>

          <div className="pointer-events-auto mt-10 flex flex-col items-center justify-center gap-4 md:flex-row">
            <a
              href="#final-cta"
              className="group inline-flex items-center gap-2 rounded-full bg-cyan-500 px-8 py-4 text-lg font-semibold text-slate-950 shadow-2xl shadow-cyan-500/25 transition-all hover:bg-cyan-400"
            >
              Book a Demo
              <ArrowRight className="h-4 w-4" />
            </a>

            <button className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10">
              <Play className="h-5 w-5" />
              Watch Film
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7 }}
          className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="flex h-10 w-6 justify-center rounded-full border-2 border-white/20 p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-cyan-400"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
