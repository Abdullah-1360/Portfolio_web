import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Activity, Brain, CheckCircle, FileText, Scan, User } from 'lucide-react';

const steps = [
  { icon: User, title: 'Approach', desc: 'Patient enters the booth as the AI camera assesses age range and initial state.' },
  { icon: Scan, title: 'Intake', desc: 'A multilingual avatar guides consent capture and chief complaint collection.' },
  { icon: Activity, title: 'Vitals', desc: 'Automated collection of blood pressure, temperature, SpO2, and heart rate.' },
  { icon: Brain, title: 'AI Analysis', desc: 'Symptoms are cross-referenced with history and current vitals.' },
  { icon: FileText, title: 'Remote Review', desc: 'A board-certified clinician can review data in real time through a secure handoff.' },
  { icon: CheckCircle, title: 'Care Plan', desc: 'Prescription, referral, or discharge instructions are generated instantly.' },
];

export function PatientJourney() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);

  return (
    <section id="journey" ref={containerRef} className="relative min-h-[200vh] overflow-hidden py-20">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <h2 className="text-4xl font-bold text-white md:text-6xl">
              Guided <span className="text-cyan-400">Patient Journey</span>
            </h2>
            <p className="mt-6 text-xl text-slate-300">
              Every interaction is staged to feel clear, calm, and clinically trustworthy from first contact through
              triage.
            </p>
          </div>

          <motion.div style={{ x }} className="flex w-[200%] gap-8">
            {steps.map((step, index) => (
              <div key={step.title} className="w-[calc(16.666%_-_2rem)] flex-shrink-0">
                <div className="group relative h-full overflow-hidden rounded-3xl border border-slate-700/50 bg-slate-900/80 p-8 backdrop-blur-xl transition-colors hover:border-cyan-500/35">
                  {index < steps.length - 1 ? (
                    <div className="absolute right-[-1rem] top-1/2 h-0.5 w-8 bg-gradient-to-r from-cyan-500/50 to-transparent" />
                  ) : null}

                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-xl font-bold text-white shadow-lg shadow-cyan-500/25">
                      {index + 1}
                    </div>
                    <step.icon className="h-8 w-8 text-cyan-400" />
                  </div>

                  <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                  <p className="mt-4 leading-7 text-slate-300">{step.desc}</p>
                  <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-700 group-hover:w-full" />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="absolute left-0 top-1/2 h-px w-full bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
    </section>
  );
}
