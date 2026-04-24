'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import SectionWrapper from './SectionWrapper';
import SectionHeader from './SectionHeader';
import { fadeUp, fadeUp as cardAnim, staggerContainer } from '@/lib/motion';
import type { Project } from '@/types';

const CATEGORY_COLOR: Record<string, string> = {
  'AI / Automation': 'text-[var(--accent)] bg-[var(--accent-glow)] border-[var(--border-accent)]',
  'AI / ML':         'text-[var(--accent)] bg-[var(--accent-glow)] border-[var(--border-accent)]',
  'AI / LLM Ops':    'text-[var(--accent)] bg-[var(--accent-glow)] border-[var(--border-accent)]',
  'Mobile':          'text-[var(--text-muted)] bg-[var(--bg-3)] border-[var(--border)]',
};

export default function ProjectsSection({ projects }: { projects: Project[] }) {
  const cats = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];
  const [active, setActive] = useState('All');
  const list = active === 'All' ? projects : projects.filter((p) => p.category === active);

  return (
    <SectionWrapper id="projects">
      <SectionHeader number="03" title="Projects" />

      {/* Filters */}
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
          variants={staggerContainer(0.07)}
          initial="hidden" animate="show" exit={{ opacity: 0 }}
          className="grid md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {list.map((p) => (
            <motion.article
              key={p.id}
              variants={cardAnim}
              className="group bg-[var(--card)] border border-[var(--card-border)] rounded-xl
                         flex flex-col overflow-hidden hover:border-[var(--border-accent)]
                         transition-colors duration-200"
            >
              <div className="p-5 flex flex-col flex-1">

                {/* Top row: category tag + links */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs
                                    font-medium mono border
                                    ${CATEGORY_COLOR[p.category] ?? CATEGORY_COLOR['Mobile']}`}>
                    {p.category}
                  </span>
                  <div className="flex items-center gap-2">
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noopener noreferrer"
                         aria-label="Source code"
                         className="text-[var(--text-faint)] hover:text-[var(--accent)]
                                    transition-colors">
                        <FaGithub size={15} />
                      </a>
                    )}
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                         aria-label="Live demo"
                         className="text-[var(--text-faint)] hover:text-[var(--accent)]
                                    transition-colors">
                        <ExternalLink size={15} strokeWidth={1.6} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-bold text-[var(--text)] mb-2 leading-snug
                               group-hover:text-[var(--accent)] transition-colors duration-200
                               flex items-start justify-between gap-2">
                  {p.title}
                  <ArrowUpRight size={16} strokeWidth={1.6}
                    className="text-[var(--text-faint)] group-hover:text-[var(--accent)]
                               transition-colors shrink-0 mt-0.5" />
                </h3>

                {/* Description */}
                <p className="text-xs text-[var(--text-muted)] leading-relaxed flex-1 mb-4">
                  {p.description}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[var(--card-border)]">
                  {p.technologies.slice(0, 5).map((t) => (
                    <span key={t} className="px-2 py-0.5 text-xs mono rounded-sm
                                             text-[var(--text-faint)] bg-[var(--bg-3)]
                                             border border-[var(--border)]">
                      {t}
                    </span>
                  ))}
                  {p.technologies.length > 5 && (
                    <span className="px-2 py-0.5 text-xs mono rounded-sm
                                     text-[var(--text-faint)] bg-[var(--bg-3)]
                                     border border-[var(--border)]">
                      +{p.technologies.length - 5}
                    </span>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </AnimatePresence>
    </SectionWrapper>
  );
}
