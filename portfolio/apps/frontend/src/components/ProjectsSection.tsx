'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Star } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import SectionWrapper from './SectionWrapper';
import SectionHeader from './SectionHeader';
import { fadeUp, scalePop, staggerContainer } from '@/lib/motion';
import type { Project } from '@/types';

const CATEGORY_ICONS: Record<string, string> = {
  'AI / Automation': '🤖',
  'AI / ML':         '🧠',
  'Mobile':          '📱',
};

export default function ProjectsSection({ projects }: { projects: Project[] }) {
  const cats = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];
  const [active, setActive] = useState('All');

  const list = active === 'All' ? projects : projects.filter((p) => p.category === active);

  return (
    <SectionWrapper id="projects">
      <SectionHeader number="03" title="Projects" />

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
            {CATEGORY_ICONS[c] ?? ''} {c}
          </button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          variants={staggerContainer(0.07)}
          initial="hidden" animate="show" exit={{ opacity: 0 }}
          className="grid md:grid-cols-2 xl:grid-cols-3 gap-5"
        >
          {list.map((p) => (
            <motion.article
              key={p.id}
              variants={scalePop}
              className="card flex flex-col overflow-hidden group"
            >
              {/* Header strip */}
              <div
                className="h-36 flex flex-col items-center justify-center gap-2 relative overflow-hidden px-4"
                style={{ background: 'linear-gradient(135deg, rgba(168,32,32,0.3) 0%, rgba(232,130,12,0.3) 100%)' }}
              >
                <span className="text-3xl">{CATEGORY_ICONS[p.category] ?? '💡'}</span>
                <span className="tag text-center">{p.category}</span>
                {p.featured && (
                  <span className="absolute top-3 right-3 tag flex items-center gap-1">
                    <Star size={9} className="fill-[var(--accent)]" /> Featured
                  </span>
                )}
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-[var(--text)] mb-2 group-hover:text-[var(--accent)]
                               transition-colors text-sm leading-snug">
                  {p.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed flex-1 mb-4">
                  {p.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.technologies.slice(0, 5).map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                  {p.technologies.length > 5 && (
                    <span className="tag">+{p.technologies.length - 5}</span>
                  )}
                </div>
                <div className="flex gap-4 pt-3 border-t border-[var(--card-border)]">
                  {p.githubUrl && (
                    <a href={p.githubUrl} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-1.5 text-xs text-[var(--text-faint)]
                                  hover:text-[var(--accent)] transition-colors">
                      <FaGithub size={13} /> Source
                    </a>
                  )}
                  {p.liveUrl && (
                    <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-1.5 text-xs text-[var(--text-faint)]
                                  hover:text-[var(--accent)] transition-colors">
                      <ExternalLink size={13} strokeWidth={1.6} /> Live
                    </a>
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
