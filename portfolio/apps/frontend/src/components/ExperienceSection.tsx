'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Briefcase } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import SectionHeader from './SectionHeader';
import { fadeUp, fadeLeft, staggerContainer } from '@/lib/motion';
import type { Experience } from '@/types';

const fmt = (d: string | null) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present';

function duration(start: string, end: string | null) {
  const s = new Date(start);
  const e = end ? new Date(end) : new Date();
  const months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
  if (months < 12) return `${months} mo`;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return m > 0 ? `${y}y ${m}mo` : `${y}y`;
}

export default function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  const [sel, setSel] = useState(0);
  const exp = experiences[sel];

  return (
    <SectionWrapper id="experience" className="bg-[var(--bg-2)]/50">
      <SectionHeader number="04" title="Experience" />

      {/* Timeline summary — shows all roles at a glance */}
      <motion.div variants={fadeUp} className="mb-10">
        <div className="relative pl-6 border-l-2 border-[var(--border-accent)] space-y-0">
          {experiences.map((e, i) => (
            <button
              key={e.id}
              onClick={() => setSel(i)}
              className={`relative w-full text-left py-3 pl-4 pr-3 rounded-md transition-colors
                          duration-150 group ${sel === i ? 'bg-[var(--accent-glow)]' : 'hover:bg-[var(--bg-3)]'}`}
            >
              {/* Timeline dot */}
              <span className={`absolute -left-[1.45rem] top-4 w-3 h-3 rounded-full border-2
                                transition-colors ${
                                  sel === i
                                    ? 'bg-[var(--accent)] border-[var(--accent)]'
                                    : 'bg-[var(--bg)] border-[var(--border-accent)]'
                                }`} />

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <div>
                  <span className={`text-sm font-semibold transition-colors ${
                    sel === i ? 'text-[var(--accent)]' : 'text-[var(--text)]'
                  }`}>
                    {e.title}
                  </span>
                  <span className="text-[var(--text-faint)] text-sm"> @ {e.company}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="mono">{fmt(e.startDate)} – {fmt(e.endDate)}</span>
                  <span className="tag">{duration(e.startDate, e.endDate)}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={sel}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="card p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
            <div>
              <h3 className="text-lg font-bold text-[var(--text)]">
                {exp.title} <span className="text-[var(--accent)]">@ {exp.company}</span>
              </h3>
              <div className="flex flex-wrap gap-4 mt-2">
                <span className="mono flex items-center gap-1.5">
                  <Calendar size={11} className="text-[var(--accent)]" />
                  {fmt(exp.startDate)} – {fmt(exp.endDate)}
                </span>
                <span className="mono flex items-center gap-1.5">
                  <MapPin size={11} className="text-[var(--accent)]" />
                  {exp.location}
                </span>
                <span className="mono flex items-center gap-1.5">
                  <Briefcase size={11} className="text-[var(--accent)]" />
                  {duration(exp.startDate, exp.endDate)}
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-5">{exp.description}</p>

          <motion.ul
            variants={staggerContainer(0.06)}
            initial="hidden" animate="show"
            className="space-y-2.5 mb-5"
          >
            {exp.responsibilities.map((r, i) => (
              <motion.li key={i} variants={fadeLeft} className="flex gap-3 text-sm text-[var(--text-muted)]">
                <span className="text-[var(--accent)] shrink-0 text-xs mt-0.5">▹</span>
                {r}
              </motion.li>
            ))}
          </motion.ul>

          <div className="flex flex-wrap gap-2 pt-4 border-t border-[var(--card-border)]">
            {exp.technologies.map((t) => <span key={t} className="tag">{t}</span>)}
          </div>
        </motion.div>
      </AnimatePresence>
    </SectionWrapper>
  );
}
