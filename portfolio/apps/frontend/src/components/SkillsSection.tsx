'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
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

// Lazy-load 3D — only on client, no SSR
const SkillsOrbs = dynamic(() => import('./three/SkillsOrbs'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

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
  Proficient: { dot: 'bg-[var(--accent)]',     text: 'text-[var(--accent)]',     label: 'Proficient' },
  Familiar:   { dot: 'bg-[var(--text-muted)]', text: 'text-[var(--text-muted)]', label: 'Familiar'   },
  Learning:   { dot: 'bg-[var(--text-faint)]', text: 'text-[var(--text-faint)]', label: 'Learning'   },
};

export default function SkillsSection({ skills }: { skills: Skill[] }) {
  const cats = ['All', ...Array.from(new Set(skills.map((s) => s.category)))];
  const [active, setActive] = useState('All');
  const [view, setView] = useState<'3d' | 'grid'>('3d');
  const filtered = active === 'All' ? skills : skills.filter((s) => s.category === active);

  return (
    <SectionWrapper id="skills" className="bg-[var(--bg-2)]/40">
      <SectionHeader number="02" title="Skills & Technologies" />

      {/* View toggle + category filters */}
      <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`px-4 py-1.5 text-xs font-semibold mono border rounded-sm
                          transition-colors duration-150 ${
                            active === c
                              ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                              : 'border-[var(--border)] text-[var(--text-faint)] hover:border-[var(--border-accent)] hover:text-[var(--accent)]'
                          }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* 3D / Grid toggle — hidden on mobile */}
        <div className="hidden md:flex items-center gap-1 border border-[var(--border)] rounded-sm p-0.5">
          {(['3d', 'grid'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1 text-xs mono rounded-sm transition-colors ${
                view === v
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--text-faint)] hover:text-[var(--accent)]'
              }`}
            >
              {v === '3d' ? '3D View' : 'Grid'}
            </button>
          ))}
        </div>
      </motion.div>

      {/* 3D view — desktop only */}
      <div className="hidden md:block">
        <motion.div
          variants={fadeUp}
          className="relative rounded-xl border border-[var(--card-border)] overflow-hidden"
          style={{ background: 'var(--bg)' }}
        >
          {/* Grid overlay */}
          <div className="absolute inset-0 pointer-events-none"
               style={{
                 backgroundImage: 'linear-gradient(rgba(240,136,62,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(240,136,62,0.03) 1px, transparent 1px)',
                 backgroundSize: '48px 48px',
                 maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
                 WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
               }} />

          {/* Always mounted — hidden via CSS, not unmounted */}
          <div style={{ display: view === '3d' ? 'block' : 'none' }}>
            <SkillsOrbs skills={filtered} />
            <p className="absolute bottom-3 left-1/2 -translate-x-1/2 mono text-[var(--text-faint)]
                          pointer-events-none" style={{ fontSize: '0.6rem' }}>
              hover orbs · drag to explore
            </p>
          </div>

          {/* Grid view inside same container */}
          {view === 'grid' && (
            <div className="p-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  variants={staggerContainer(0.04)}
                  initial="hidden" animate="show" exit={{ opacity: 0 }}
                  className="grid grid-cols-3 lg:grid-cols-4 gap-3"
                >
                  {filtered.map((skill) => <SkillCard key={skill.name} skill={skill} />)}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>

      {/* Grid view — mobile always */}
      <div className="md:hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            variants={staggerContainer(0.04)}
            initial="hidden" animate="show" exit={{ opacity: 0 }}
            className="grid grid-cols-2 gap-3"
          >
            {filtered.map((skill) => <SkillCard key={skill.name} skill={skill} />)}
          </motion.div>
        </AnimatePresence>
      </div>
    </SectionWrapper>
  );
}

function SkillCard({ skill }: { skill: Skill }) {
  const lvl  = LEVEL_STYLE[skill.level as SkillLevel] ?? LEVEL_STYLE.Familiar;
  const icon = SKILL_ICONS[skill.name.toLowerCase()];

  return (
    <motion.div
      variants={scalePop}
      className="bg-[var(--card)] border border-[var(--card-border)] rounded-lg
                 p-4 flex items-center gap-3 hover:border-[var(--border-accent)]
                 transition-colors duration-200 group"
    >
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
          <span className={`mono ${lvl.text}`} style={{ fontSize: '0.65rem' }}>{lvl.label}</span>
        </div>
      </div>
    </motion.div>
  );
}
