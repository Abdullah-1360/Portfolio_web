'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Workflow, MessageSquare, GitBranch, Cpu, Layers, PenTool,
  Terminal, Server, Database, Smartphone, Code2,
  BookOpen, Monitor, HardDrive, Wrench, Grid3X3, Boxes
} from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import SectionHeader from './SectionHeader';
import { fadeUp, scalePop, staggerContainer } from '@/lib/motion';
import type { Skill, SkillLevel } from '@/types';

const SkillsOrbs = dynamic(() => import('./three/SkillsOrbs'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[480px] flex items-center justify-center">
      <div className="w-7 h-7 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

const ICONS: Record<string, React.ReactNode> = {
  'langgraph':        <GitBranch size={15} strokeWidth={2} />,
  'langchain':        <Layers size={15} strokeWidth={2} />,
  'multi-llm router': <Cpu size={15} strokeWidth={2} />,
  'n8n':              <Workflow size={15} strokeWidth={2} />,
  'uchat':            <MessageSquare size={15} strokeWidth={2} />,
  'ai workflows':     <Layers size={15} strokeWidth={2} />,
  'ansible eda':      <Wrench size={15} strokeWidth={2} />,
  'mcp dev':          <Cpu size={15} strokeWidth={2} />,
  'llm quant.':       <BookOpen size={15} strokeWidth={2} />,
  'prompt eng.':      <PenTool size={15} strokeWidth={2} />,
  'ollama':           <Terminal size={15} strokeWidth={2} />,
  'fastapi':          <Server size={15} strokeWidth={2} />,
  'postgresql':       <Database size={15} strokeWidth={2} />,
  'redis':            <HardDrive size={15} strokeWidth={2} />,
  'node.js':          <Server size={15} strokeWidth={2} />,
  'express.js':       <Server size={15} strokeWidth={2} />,
  'mongodb':          <Database size={15} strokeWidth={2} />,
  'flutter/dart':     <Smartphone size={15} strokeWidth={2} />,
  'python':           <Code2 size={15} strokeWidth={2} />,
  'ansible':          <Wrench size={15} strokeWidth={2} />,
  'linux admin':      <Monitor size={15} strokeWidth={2} />,
  'git':              <GitBranch size={15} strokeWidth={2} />,
  'whm/cpanel':       <HardDrive size={15} strokeWidth={2} />,
};

const LEVEL_CFG: Record<SkillLevel, { pct: number; bar: string; text: string; label: string }> = {
  Proficient: { pct: 90, bar: 'bg-[var(--accent)]',  text: 'text-[var(--accent)]',  label: 'Proficient' },
  Familiar:   { pct: 60, bar: 'bg-[var(--cyan)]',    text: 'text-[var(--cyan)]',    label: 'Familiar'   },
  Learning:   { pct: 35, bar: 'bg-[var(--purple)]',  text: 'text-[var(--purple)]',  label: 'Learning'   },
};

function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  const cfg  = LEVEL_CFG[skill.level as SkillLevel];
  const icon = ICONS[skill.name.toLowerCase()];
  return (
    <motion.div variants={scalePop}
      className="glass-card rounded-2xl p-4 flex flex-col gap-3 group hover:border-[var(--border-accent)] transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[var(--bg-3)] flex items-center justify-center
                          text-[var(--text-faint)] group-hover:text-[var(--accent)] transition-colors">
            {icon ?? <Code2 size={15} strokeWidth={2} />}
          </div>
          <span className="text-sm font-semibold text-[var(--text)]"
                style={{ fontFamily: 'Archivo, sans-serif' }}>{skill.name}</span>
        </div>
        <span className={`text-xs font-medium ${cfg.text}`}
              style={{ fontFamily: 'JetBrains Mono, monospace' }}>{cfg.label}</span>
      </div>
      <div className="h-1 rounded-full bg-[var(--bg-4)] overflow-hidden">
        <motion.div className={`h-full rounded-full ${cfg.bar}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${cfg.pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </motion.div>
  );
}

export default function SkillsSection({ skills }: { skills: Skill[] }) {
  const cats = ['All', ...Array.from(new Set(skills.map((s) => s.category)))];
  const [active, setActive] = useState('All');
  const [view, setView]     = useState<'grid' | '3d'>('grid');
  const filtered = active === 'All' ? skills : skills.filter((s) => s.category === active);

  return (
    <SectionWrapper id="skills" className="bg-[var(--bg-2)]/40">
      <SectionHeader number="02" title="Skills & Technologies"
        subtitle="Tools and technologies I use to build intelligent systems." />

      <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <button key={c} onClick={() => setActive(c)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-xl border
                          transition-all duration-200 cursor-pointer
                          ${active === c
                            ? 'bg-[var(--accent)] text-[#0A0F1E] border-[var(--accent)]'
                            : 'border-[var(--border)] text-[var(--text-faint)] hover:border-[var(--border-accent)] hover:text-[var(--accent)]'
                          }`}
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{c}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 p-1 rounded-xl border border-[var(--border)] bg-[var(--bg-2)]">
          {([['grid', <Grid3X3 size={13} key="g" />], ['3d', <Boxes size={13} key="3" />]] as const).map(([v, icon]) => (
            <button key={v} onClick={() => setView(v as 'grid' | '3d')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                          transition-all duration-200 cursor-pointer
                          ${view === v ? 'bg-[var(--accent)] text-[#0A0F1E]' : 'text-[var(--text-faint)] hover:text-[var(--text)]'}`}
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {icon}<span className="hidden sm:inline capitalize">{v === '3d' ? '3D' : 'Grid'}</span>
            </button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {view === 'grid' ? (
          <motion.div key="grid" variants={staggerContainer(0.05)}
            initial="hidden" animate="show" exit={{ opacity: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((s, i) => <SkillCard key={s.name} skill={s} index={i} />)}
          </motion.div>
        ) : (
          <motion.div key="3d" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="glass-card rounded-2xl overflow-hidden">
            <Suspense fallback={null}><SkillsOrbs skills={filtered} /></Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={fadeUp} className="flex flex-wrap gap-5 mt-8">
        {Object.entries(LEVEL_CFG).map(([lvl, cfg]) => (
          <div key={lvl} className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${cfg.bar}`} />
            <span className="text-xs text-[var(--text-faint)]"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{cfg.label}</span>
          </div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
