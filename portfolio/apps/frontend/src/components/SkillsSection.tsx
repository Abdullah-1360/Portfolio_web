'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import SectionWrapper from './SectionWrapper';
import SectionHeader from './SectionHeader';
import { fadeUp, scalePop, staggerContainer } from '@/lib/motion';
import type { Skill, SkillLevel } from '@/types';

const ICONS: Record<string, string> = {
  'n8n': '⚙️', 'uchat': '💬', 'ai workflows': '🔄',
  'mcp dev': '🧩', 'llm quant.': '🔬', 'prompt eng.': '✍️', 'ollama': '🦙',
  'node.js': '🟢', 'express.js': '🚂', 'mongodb': '🍃', 'flutter/dart': '🐦', 'python': '🐍',
  'ansible': '📋', 'linux admin': '🐧', 'git': '🌿', 'whm/cpanel': '🖥️',
};

const LEVEL_CONFIG: Record<SkillLevel, { label: string; color: string; bg: string; dot: string }> = {
  Proficient: {
    label: 'Proficient',
    color: 'text-[var(--accent)]',
    bg: 'bg-[var(--accent-glow)]',
    dot: 'bg-[var(--accent)]',
  },
  Familiar: {
    label: 'Familiar',
    color: 'text-[var(--warm)]',
    bg: 'bg-[rgba(232,130,12,0.1)]',
    dot: 'bg-[var(--warm)]',
  },
  Learning: {
    label: 'Learning',
    color: 'text-[var(--text-faint)]',
    bg: 'bg-[var(--bg-3)]',
    dot: 'bg-[var(--text-faint)]',
  },
};

export default function SkillsSection({ skills }: { skills: Skill[] }) {
  const cats = ['All', ...Array.from(new Set(skills.map((s) => s.category)))];
  const [active, setActive] = useState('All');
  const filtered = active === 'All' ? skills : skills.filter((s) => s.category === active);

  return (
    <SectionWrapper id="skills" className="bg-[var(--bg-2)]/50">
      <SectionHeader number="02" title="Skills & Technologies" />

      {/* Legend */}
      <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4 mb-6">
        {(Object.entries(LEVEL_CONFIG) as [SkillLevel, typeof LEVEL_CONFIG[SkillLevel]][]).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
            <span className={`mono ${cfg.color}`}>{cfg.label}</span>
          </div>
        ))}
      </motion.div>

      {/* Category filters */}
      <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-8">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`px-4 py-1.5 rounded-sm text-xs font-semibold mono border transition-colors
                        duration-150 ${
                          active === c
                            ? 'bg-[var(--accent)] text-[#0B1628] border-[var(--accent)]'
                            : 'border-[var(--border)] text-[var(--text-faint)] hover:border-[var(--border-accent)] hover:text-[var(--accent)]'
                        }`}
          >
            {c}
          </button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          variants={staggerContainer(0.05)}
          initial="hidden" animate="show" exit={{ opacity: 0 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
        >
          {filtered.map((skill) => {
            const cfg = LEVEL_CONFIG[skill.level as SkillLevel] ?? LEVEL_CONFIG.Familiar;
            return (
              <motion.div
                key={skill.name}
                variants={scalePop}
                className="card p-4 flex items-center gap-3 group"
              >
                <span className="text-xl shrink-0">
                  {ICONS[skill.name.toLowerCase()] ?? '⚙️'}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--text)] truncate leading-tight">
                    {skill.name}
                  </p>
                  <span className={`inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded-sm
                                    text-xs font-medium ${cfg.color} ${cfg.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </SectionWrapper>
  );
}
