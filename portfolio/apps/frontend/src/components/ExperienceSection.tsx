'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Briefcase } from 'lucide-react';
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

      {/* ── Timeline selector ── */}
      <div className="mb-8">
        {/* Desktop: vertical timeline with left border */}
        <div className="hidden md:block relative pl-6 border-l-2 border-[var(--border-accent)]">
          {experiences.map((e, i) => (
            <button
              key={e.id}
              onClick={() => setSel(i)}
              className={`group relative w-full text-left py-3 pl-4 pr-3 rounded-md
                          transition-colors duration-150
                          ${sel === i ? 'bg-[var(--accent-glow)]' : 'hover:bg-[var(--bg-3)]'}`}
            >
              {/* Timeline dot */}
              <span className={`absolute -left-[1.45rem] top-4 w-3 h-3 rounded-full border-2
                                transition-colors ${
                                  sel === i
                                    ? 'bg-[var(--accent)] border-[var(--accent)]'
                                    : 'bg-[var(--bg)] border-[var(--border-accent)]'
                                }`} />
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-sm font-semibold transition-colors ${
                    sel === i ? 'text-[var(--accent)]' : 'text-[var(--text)]'
                  }`}>
                    {e.title}
                  </span>
                  <span className="text-[var(--text-faint)] text-sm">@ {e.company}</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="mono text-[10px]">{fmt(e.startDate)} – {fmt(e.endDate)}</span>
                  <span className="tag text-[10px] py-0">{duration(e.startDate, e.endDate)}</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Mobile: horizontal chip scroll */}
        <div className="md:hidden flex gap-2 overflow-x-auto pb-2">
          {experiences.map((e, i) => (
            <button
              key={e.id}
              onClick={() => setSel(i)}
              className={`shrink-0 px-3 py-2 rounded-md text-xs font-medium mono border
                          transition-colors ${
                            sel === i
                              ? 'border-[var(--accent)] bg-[var(--accent-glow)] text-[var(--accent)]'
                              : 'border-[var(--border)] text-[var(--text-faint)]'
                          }`}
            >
              {e.company}
            </button>
          ))}
        </div>
      </div>

      {/* ── Detail panel ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={sel}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="card p-4 md:p-6 relative overflow-hidden"
        >
          {/* Idea 1: bottom border always visible on active card */}
          <span className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r
                           from-[var(--accent)] to-transparent" />

          <h3 className="text-lg font-bold text-[var(--text)] mb-1">
            {exp.title} <span className="text-[var(--accent)]">@ {exp.company}</span>
          </h3>

          <div className="flex flex-wrap gap-4 mb-5 mt-2">
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

          <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-5">{exp.description}</p>

          <motion.ul
            variants={staggerContainer(0.06)}
            initial="hidden" animate="show"
            className="space-y-2.5 mb-5"
          >
            {exp.responsibilities.map((r, i) => (
              <motion.li key={i} variants={fadeLeft}
                className="flex gap-3 text-sm text-[var(--text-muted)]">
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
