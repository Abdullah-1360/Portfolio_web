'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Workflow, MessageSquare, GitBranch, Cpu, Layers, PenTool,
  Terminal, Server, Database, Smartphone, Code2,
  BookOpen, Monitor, HardDrive, Wrench
} from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import SectionHeader from './SectionHeader';
import { fadeUp, scalePop, staggerContainer } from '@/lib/motion';
import type { Skill, SkillLevel } from '@/types';

// Lucide icons — no emojis
const SKILL_ICONS: Record<string, React.ReactNode> = {
  'n8n':          <Workflow size={18} strokeWidth={1.6} />,
  'uchat':        <MessageSquare size={18} strokeWidth={1.6} />,
  'ai workflows': <Layers size={18} strokeWidth={1.6} />,
  'mcp dev':      <Cpu size={18} strokeWidth={1.6} />,
  'llm quant.':   <BookOpen size={18} strokeWidth={1.6} />,
  'prompt eng.':  <PenTool size={18} strokeWidth={1.6} />,
  'ollama':       <Terminal size={18} strokeWidth={1.6} />,
  'node.js':      <Server size={18} strokeWidth={1.6} />,
  'express.js':   <Server size={18} strokeWidth={1.6} />,
  'mongodb':      <Database size={18} strokeWidth={1.6} />,
  'flutter/dart': <Smartphone size={18} strokeWidth={1.6} />,
  'python':       <Code2 size={18} strokeWidth={1.6} />,
  'ansible':      <Wrench size={18} strokeWidth={1.6} />,
  'linux admin':  <Monitor size={18} strokeWidth={1.6} />,
  'git':          <GitBranch size={18} strokeWidth={1.6} />,
  'whm/cpanel':   <HardDrive size={18} strokeWidth={1.6} />,
};

const LEVEL_STYLE: Record<SkillLevel, { dot: string; text: string; label: string }> = {
  Proficient: { dot: 'bg-[var(--accent)]',      text: 'text-[var(--accent)]',      label: 'Proficient' },
  Familiar:   { dot: 'bg-[var(--text-muted)]',  text: 'text-[var(--text-muted)]',  label: 'Familiar'   },
  Learning:   { dot: 'bg-[var(--text-faint)]',  text: 'text-[var(--text-faint)]',  label: 'Learning'   },
};

export default function SkillsSection({ skills }: { skills: Skill[] }) {
  const cats = ['All', ...Array.from(new Set(skills.map((s) => s.category)))];
  const [active, setActive] = useState('All');
  const filtered = active === 'All' ? skills : skills.filter((s) => s.category === active);

  return (
    <SectionWrapper id="skills" className="bg-[var(--bg-2)]/40">
      <SectionHeader number="02" title="Skills & Technologies" />

      {/* Category filters */}
      <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-8">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`px-4 py-1.5 text-xs font-semibold mono border rounded-sm
                        transition-colors duration-150 ${
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
          variants={staggerContainer(0.04)}
          initial="hidden" animate="show" exit={{ opacity: 0 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
        >
          {filtered.map((skill) => {
            const lvl = LEVEL_STYLE[skill.level as SkillLevel] ?? LEVEL_STYLE.Familiar;
            const icon = SKILL_ICONS[skill.name.toLowerCase()];
            return (
              <motion.div
                key={skill.name}
                variants={scalePop}
                className="bg-[var(--card)] border border-[var(--card-border)] rounded-lg
                           p-4 flex items-center gap-3 hover:border-[var(--border-accent)]
                           transition-colors duration-200"
              >
                {/* Icon box */}
                <div className="w-9 h-9 rounded-md bg-[var(--bg-3)] flex items-center
                                justify-center text-[var(--accent)] shrink-0">
                  {icon ?? <Code2 size={18} strokeWidth={1.6} />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--text)] truncate leading-tight">
                    {skill.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${lvl.dot}`} />
                    <span className={`mono ${lvl.text}`} style={{ fontSize: '0.65rem' }}>
                      {lvl.label}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </SectionWrapper>
  );
}
