import { motion } from 'framer-motion';
import { Calendar, Mail, Phone } from 'lucide-react';

export function FinalCTA() {
  return (
    <section id="final-cta" className="relative flex min-h-screen items-center justify-center py-20">
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/20 via-transparent to-transparent" />
      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-bold leading-tight text-white md:text-7xl">
            Ready to Transform
            <br />
            <span className="bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">Patient Care?</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-xl text-slate-300">
            Join the health systems already using SmartCare AI to deliver faster, more accurate care at a fraction of
            the friction.
          </p>

          <div className="mb-16 mt-12 flex flex-col items-center justify-center gap-6 md:flex-row">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="mailto:enterprise@smartcare.ai"
              className="flex items-center gap-3 rounded-full bg-cyan-500 px-10 py-5 text-lg font-bold text-slate-950 shadow-2xl shadow-cyan-500/25 transition-all hover:bg-cyan-400"
            >
              <Calendar className="h-6 w-6" />
              Schedule Pilot Program
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="tel:+15551234567"
              className="flex items-center gap-3 rounded-full border border-slate-700 bg-slate-800 px-10 py-5 text-lg font-bold text-white transition-all hover:bg-slate-700"
            >
              <Phone className="h-6 w-6" />
              Talk to Sales
            </motion.a>
          </div>

          <div className="flex flex-col items-center justify-center gap-8 text-slate-400 md:flex-row">
            <a href="mailto:enterprise@smartcare.ai" className="flex items-center gap-2 transition-colors hover:text-cyan-400">
              <Mail className="h-5 w-5" />
              enterprise@smartcare.ai
            </a>
            <div className="hidden h-6 w-px bg-slate-700 md:block" />
            <div>+1 (555) 123-4567</div>
          </div>

          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
