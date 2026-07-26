'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Workflow, MessageSquare, GitBranch, Cpu, Layers, PenTool,
  Terminal, Server, Database, Smartphone, Code2,
  BookOpen, Monitor, HardDrive, Wrench, Grid3X3, Boxes,
  ArrowUpRight, Zap
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
  'langgraph':        <GitBranch size={16} strokeWidth={2} />,
  'langchain':        <Layers size={16} strokeWidth={2} />,
  'multi-llm router': <Cpu size={16} strokeWidth={2} />,
  'n8n':              <Workflow size={16} strokeWidth={2} />,
  'uchat':            <MessageSquare size={16} strokeWidth={2} />,
  'ai workflows':     <Layers size={16} strokeWidth={2} />,
  'ansible eda':      <Wrench size={16} strokeWidth={2} />,
  'mcp dev':          <Cpu size={16} strokeWidth={2} />,
  'llm quant.':       <BookOpen size={16} strokeWidth={2} />,
  'prompt eng.':      <PenTool size={16} strokeWidth={2} />,
  'ollama':           <Terminal size={16} strokeWidth={2} />,
  'fastapi':          <Server size={16} strokeWidth={2} />,
  'postgresql':       <Database size={16} strokeWidth={2} />,
  'redis':            <HardDrive size={16} strokeWidth={2} />,
  'node.js':          <Server size={16} strokeWidth={2} />,
  'express.js':       <Server size={16} strokeWidth={2} />,
  'mongodb':          <Database size={16} strokeWidth={2} />,
  'flutter/dart':     <Smartphone size={16} strokeWidth={2} />,
  'python':           <Code2 size={16} strokeWidth={2} />,
  'ansible':          <Wrench size={16} strokeWidth={2} />,
  'linux admin':      <Monitor size={16} strokeWidth={2} />,
  'git':              <GitBranch size={16} strokeWidth={2} />,
  'whm/cpanel':       <HardDrive size={16} strokeWidth={2} />,
};

const LEVEL_CFG: Record<SkillLevel, { pct: number; bar: string; text: string; label: string }> = {
  Proficient: { pct: 95, bar: 'bg-[var(--accent)] shadow-[0_0_10px_rgba(var(--accent-rgb),0.6)]', text: 'text-[var(--accent)]', label: 'Proficient' },
  Familiar:   { pct: 75, bar: 'bg-[var(--accent)] shadow-[0_0_8px_rgba(var(--accent-rgb),0.45)]',  text: 'text-[var(--accent)]', label: 'Familiar'   },
  Learning:   { pct: 55, bar: 'bg-[var(--accent)] shadow-[0_0_6px_rgba(var(--accent-rgb),0.3)]',   text: 'text-[var(--accent)]', label: 'Learning'   },
};

function ProjectLinkedSkillCard({ skill, index }: { skill: Skill; index: number }) {
  const cfg  = LEVEL_CFG[skill.level as SkillLevel];
  const icon = ICONS[skill.name.toLowerCase()];

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div
      variants={scalePop}
      className="glow-card rounded-2xl p-5 flex flex-col justify-between gap-4 h-full group hover:border-[var(--border-accent)] transition-all duration-300 shadow-lg"
    >
      {/* Header Info */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--accent-dim)] border border-[var(--border-accent)] flex items-center justify-center text-[var(--accent)] group-hover:scale-110 transition-transform shrink-0">
              {icon ?? <Code2 size={16} strokeWidth={2} />}
            </div>
            <div>
              <h4 className="text-base font-bold text-[var(--text)] leading-tight"
                  style={{ fontFamily: 'Archivo, sans-serif' }}>
                {skill.name}
              </h4>
              <span className="mono text-[10px] text-[var(--text-faint)] block mt-0.5">
                {skill.category}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className={`text-xs font-mono font-bold ${cfg.text} block`}>
              {cfg.label}
            </span>
            <span className="mono text-[10px] text-[var(--text-faint)] font-semibold">
              {cfg.pct}%
            </span>
          </div>
        </div>

        {/* Progress Bar Track & Glow Fill */}
        <div className="h-2.5 rounded-full bg-[var(--bg-3)] border border-[var(--border)] overflow-hidden p-0.5 relative">
          <motion.div
            className="h-full rounded-full shadow-[0_0_8px_rgba(240,136,62,0.6)]"
            style={{ backgroundColor: '#F0883E' }}
            initial={{ width: '0%' }}
            animate={{ width: `${cfg.pct}%` }}
            transition={{ duration: 0.8, delay: index * 0.03, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Linked Project / Architectural Impact Box */}
      {skill.useCase && (
        <div
          onClick={scrollToProjects}
          className="p-3 rounded-xl bg-[var(--bg-2)]/90 border border-[var(--border)] group-hover:border-[var(--border-accent)] transition-colors cursor-pointer space-y-1.5"
        >
          <p className="text-xs text-[var(--text-muted)] leading-relaxed"
             style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {skill.useCase}
          </p>

          {skill.linkedProject && (
            <div className="flex items-center justify-between pt-1 border-t border-[var(--border)]/60 text-[11px] font-mono font-semibold text-[var(--accent)]">
              <span className="flex items-center gap-1">
                <Zap size={11} className="shrink-0" />
                <span className="truncate max-w-[170px]">{skill.linkedProject}</span>
              </span>
              <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          )}
        </div>
      )}
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
      <SectionHeader number="03" title="Skills & Capability Matrix"
        subtitle="Technical stack linked directly to verified real-world architecture implementations." />

      {/* Category Filters & View Controls */}
      <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-xl border
                          transition-all duration-200 cursor-pointer
                          ${active === c
                            ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-md'
                            : 'border-[var(--border)] text-[var(--text-faint)] hover:border-[var(--border-accent)] hover:text-[var(--accent)]'
                          }`}
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl border border-[var(--border)] bg-[var(--bg-2)]">
          {([['grid', <Grid3X3 size={13} key="g" />], ['3d', <Boxes size={13} key="3" />]] as const).map(([v, icon]) => (
            <button
              key={v}
              onClick={() => setView(v as 'grid' | '3d')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                          transition-all duration-200 cursor-pointer
                          ${view === v ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-faint)] hover:text-[var(--text)]'}`}
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {icon}<span className="hidden sm:inline capitalize">{v === '3d' ? '3D Cloud' : 'Grid View'}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Content Display */}
      <AnimatePresence mode="wait">
        {view === 'grid' ? (
          <motion.div
            key="grid"
            variants={staggerContainer(0.05)}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filtered.map((s, i) => (
              <ProjectLinkedSkillCard key={s.name} skill={s} index={i} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="3d"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-card rounded-2xl overflow-hidden shadow-2xl"
          >
            <Suspense fallback={null}>
              <SkillsOrbs skills={filtered} />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend Footer */}
      <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-[var(--border)]">
        <div className="flex flex-wrap gap-5">
          {Object.entries(LEVEL_CFG).map(([lvl, cfg]) => (
            <div key={lvl} className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${cfg.bar}`} />
              <span className="text-xs text-[var(--text-faint)]"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{cfg.label}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-[var(--text-faint)] font-mono">
          Click any skill card use-case box to view associated project architecture
        </p>
      </motion.div>
    </SectionWrapper>
  );
}
