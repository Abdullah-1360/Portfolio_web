'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, ChevronRight } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import SectionHeader from './SectionHeader';
import { fadeLeft, staggerContainer } from '@/lib/motion';
import type { Experience } from '@/types';

const fmt = (d: string | null) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present';

function duration(start: string, end: string | null) {
  const s = new Date(start);
  const e = end ? new Date(end) : new Date();
  const months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
  if (months < 12) return `${months}mo`;
  const y = Math.floor(months / 12), m = months % 12;
  return m > 0 ? `${y}y ${m}mo` : `${y}y`;
}

export default function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  const [sel, setSel] = useState(0);
  const exp = experiences[sel];

  return (
    <SectionWrapper id="experience" className="bg-[var(--bg-2)]/40">
      <SectionHeader number="04" title="Experience"
        subtitle="Where I've worked and what I've built." />

      <div className="grid lg:grid-cols-[240px_1fr] gap-6">
        {/* Sidebar */}
        <motion.div variants={staggerContainer(0.06)} className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
          {experiences.map((e, i) => (
            <motion.button key={e.id} variants={fadeLeft} onClick={() => setSel(i)}
              className={`flex-shrink-0 lg:flex-shrink text-left px-4 py-3 rounded-2xl border
                          transition-all duration-200 cursor-pointer
                          ${sel === i
                            ? 'bg-[var(--accent-dim)] border-[var(--border-accent)] text-[var(--text)]'
                            : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-accent)] hover:bg-[var(--bg-3)]'
                          }`}>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold leading-tight"
                     style={{ fontFamily: 'Archivo, sans-serif' }}>{e.company}</p>
                  <p className="text-xs text-[var(--text-faint)] mt-0.5 whitespace-nowrap"
                     style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {fmt(e.startDate)} – {fmt(e.endDate)}
                  </p>
                </div>
                {sel === i && <ChevronRight size={13} className="text-[var(--accent)] shrink-0 hidden lg:block" />}
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Detail */}
        <AnimatePresence mode="wait">
          <motion.div key={sel}
            initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card rounded-2xl p-6 md:p-8">
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="text-xl font-bold text-[var(--text)] mb-1"
                      style={{ fontFamily: 'Archivo, sans-serif' }}>{exp.title}</h3>
                  <p className="text-[var(--accent)] font-semibold text-sm"
                     style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{exp.company}</p>
                </div>
                <span className="mono px-3 py-1 rounded-xl bg-[var(--bg-3)] border border-[var(--border)] whitespace-nowrap">
                  {duration(exp.startDate, exp.endDate)}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 mt-3">
                <span className="flex items-center gap-1.5 text-xs text-[var(--text-faint)]"
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  <Calendar size={11} />{fmt(exp.startDate)} – {fmt(exp.endDate)}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-[var(--text-faint)]"
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  <MapPin size={11} />{exp.location}
                </span>
              </div>
            </div>

            <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-5"
               style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{exp.description}</p>

            <div className="mb-6">
              <p className="text-xs font-semibold text-[var(--text)] mb-3 uppercase tracking-wider"
                 style={{ fontFamily: 'JetBrains Mono, monospace' }}>Key Contributions</p>
              <ul className="space-y-2.5">
                {exp.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--text-muted)]"
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0 mt-1.5" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {exp.technologies.map((t) => <span key={t} className="tag">{t}</span>)}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </SectionWrapper>
  );
}
