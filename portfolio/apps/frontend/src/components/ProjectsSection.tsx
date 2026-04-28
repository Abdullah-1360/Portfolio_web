'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import SectionWrapper from './SectionWrapper';
import SectionHeader from './SectionHeader';
import { fadeUp, staggerContainer } from '@/lib/motion';
import type { Project } from '@/types';

const CATEGORY_STYLE: Record<string, { text: string; bg: string; border: string }> = {
  'AI / Automation':  { text: 'text-[#f0883e]',            bg: 'bg-[rgba(240,136,62,0.08)]', border: 'border-[rgba(240,136,62,0.25)]' },
  'AI / ML':          { text: 'text-[#f0883e]',            bg: 'bg-[rgba(240,136,62,0.08)]', border: 'border-[rgba(240,136,62,0.25)]' },
  'AI / LLM Ops':     { text: 'text-[#f0883e]',            bg: 'bg-[rgba(240,136,62,0.08)]', border: 'border-[rgba(240,136,62,0.25)]' },
  'Mobile':           { text: 'text-[var(--text-muted)]',  bg: 'bg-[var(--bg-3)]',           border: 'border-[var(--border)]' },
  'Learning Project': { text: 'text-[var(--text-faint)]',  bg: 'bg-[var(--bg-3)]',           border: 'border-[var(--border)]' },
};

export default function ProjectsSection({ projects }: { projects: Project[] }) {
  const cats = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];
  const [active, setActive] = useState('All');
  const list = active === 'All' ? projects : projects.filter((p) => p.category === active);

  // Split: first 3 featured go in spotlight row, rest in grid
  const spotlight = list.filter((p) => p.featured).slice(0, 3);
  const grid      = list.filter((p) => !spotlight.includes(p));

  return (
    <SectionWrapper id="projects">
      <SectionHeader number="03" title="Projects" />

      {/* Filters */}
      <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-10">
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
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          variants={staggerContainer(0.06)}
          initial="hidden" animate="show" exit={{ opacity: 0 }}
        >
          {/* ── Spotlight row: up to 3 featured ── */}
          {spotlight.length > 0 && (
            <div className={`grid gap-4 mb-4 ${
              spotlight.length === 1 ? 'grid-cols-1' :
              spotlight.length === 2 ? 'md:grid-cols-2' :
              'md:grid-cols-3'
            }`}>
              {spotlight.map((p) => <ProjectCard key={p.id} project={p} size="featured" />)}
            </div>
          )}

          {/* ── Regular grid ── */}
          {grid.length > 0 && (
            <>
              {spotlight.length > 0 && (
                <p className="mono text-[var(--text-faint)] mb-3 mt-6" style={{ fontSize: '0.62rem' }}>
                  MORE PROJECTS
                </p>
              )}
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {grid.map((p) => <ProjectCard key={p.id} project={p} size="compact" />)}
              </div>
            </>
          )}

          {list.length === 0 && (
            <p className="text-center text-[var(--text-faint)] mono py-16">
              No projects in this category.
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </SectionWrapper>
  );
}

// ── Unified card component ────────────────────────────────────────
function ProjectCard({ project: p, size }: { project: Project; size: 'featured' | 'compact' }) {
  const primaryUrl = p.githubUrl || p.liveUrl;
  const cat = CATEGORY_STYLE[p.category] ?? CATEGORY_STYLE['Mobile'];
  const maxTech = size === 'featured' ? 5 : 4;

  return (
    <motion.article variants={fadeUp} className="group relative">
      <a
        href={primaryUrl || '#'}
        target={primaryUrl ? '_blank' : undefined}
        rel={primaryUrl ? 'noopener noreferrer' : undefined}
        className="flex flex-col h-full bg-[var(--card)] border border-[var(--card-border)]
                   rounded-xl overflow-hidden hover:border-[var(--border-accent)]
                   transition-colors duration-200 cursor-pointer"
      >
        {/* Top accent bar — slides in on hover */}
        <span className="block h-0.5 w-0 bg-gradient-to-r from-[var(--accent)] to-transparent
                         group-hover:w-full transition-all duration-500" />

        <div className={`flex flex-col flex-1 ${size === 'featured' ? 'p-6' : 'p-5'}`}>

          {/* Header row */}
          <div className="flex items-start justify-between gap-3 mb-4">
            {/* Category + GitHub icon */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs
                                font-medium mono border ${cat.text} ${cat.bg} ${cat.border}`}>
                {p.category}
              </span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-2 shrink-0">
              {p.githubUrl && (
                <span className="text-[var(--text-faint)] group-hover:text-[var(--accent)]
                                 transition-colors">
                  <FaGithub size={14} />
                </span>
              )}
              {p.liveUrl && (
                <span className="text-[var(--text-faint)] group-hover:text-[var(--accent)]
                                 transition-colors">
                  <ExternalLink size={13} strokeWidth={1.6} />
                </span>
              )}
              <ArrowUpRight
                size={15} strokeWidth={1.6}
                className="text-[var(--text-faint)] group-hover:text-[var(--accent)]
                           transition-colors -translate-y-0.5 group-hover:translate-y-0
                           group-hover:translate-x-0.5 duration-200"
              />
            </div>
          </div>

          {/* Title */}
          <h3 className={`font-bold text-[var(--text)] leading-snug mb-2
                          group-hover:text-[var(--accent)] transition-colors duration-200
                          ${size === 'featured' ? 'text-base' : 'text-sm'}`}>
            {p.title}
          </h3>

          {/* Description */}
          <p className={`text-[var(--text-muted)] leading-relaxed flex-1 mb-5
                         ${size === 'featured' ? 'text-sm' : 'text-xs'}`}>
            {p.description}
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[var(--card-border)]">
            {p.technologies.slice(0, maxTech).map((t) => (
              <span key={t}
                    className="px-2 py-0.5 text-xs mono rounded-sm text-[var(--text-faint)]
                               bg-[var(--bg-3)] border border-[var(--border)]">
                {t}
              </span>
            ))}
            {p.technologies.length > maxTech && (
              <span className="px-2 py-0.5 text-xs mono rounded-sm text-[var(--text-faint)]
                               bg-[var(--bg-3)] border border-[var(--border)]">
                +{p.technologies.length - maxTech}
              </span>
            )}
          </div>
        </div>
      </a>
    </motion.article>
  );
}
