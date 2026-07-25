'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Info } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import SectionWrapper from './SectionWrapper';
import SectionHeader from './SectionHeader';
import ProjectDetailModal from './ProjectDetailModal';
import { fadeUp, scalePop, staggerContainer } from '@/lib/motion';
import type { Project } from '@/types';

const CAT_COLOR: Record<string, string> = {
  'AI / Automation': 'text-[var(--accent)]   bg-[rgba(240,136,62,0.08)]   border-[rgba(240,136,62,0.25)]',
  'AI / ML':         'text-[var(--accent)]   bg-[rgba(240,136,62,0.08)]   border-[rgba(240,136,62,0.25)]',
  'AI / LLM Ops':    'text-[var(--accent)]   bg-[rgba(240,136,62,0.08)]   border-[rgba(240,136,62,0.25)]',
  'Mobile':          'text-[var(--text-muted)] bg-[var(--bg-3)] border-[var(--border)]',
  'Learning Project':'text-[var(--text-faint)] bg-[var(--bg-3)] border-[var(--border)]',
};

function ProjectCard({
  project,
  featured,
  onOpenDetail,
}: {
  project: Project;
  featured: boolean;
  onOpenDetail: (p: Project) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    ref.current?.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
    ref.current?.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
  };

  const catStyle = CAT_COLOR[project.category] ?? 'text-[var(--text-faint)] bg-[var(--bg-3)] border-[var(--border)]';
  const hasDetail = Boolean(project.longDescription || project.architectureDiagram);

  return (
    <motion.div
      variants={scalePop}
      ref={ref}
      onMouseMove={onMouseMove}
      onClick={() => hasDetail && onOpenDetail(project)}
      className={`glow-card rounded-2xl p-5 flex flex-col gap-4 h-full group ${
        hasDetail ? 'cursor-pointer hover:border-[var(--border-accent)]' : 'cursor-default'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${catStyle}`}
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          {project.category}
        </span>
        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          {hasDetail && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetail(project);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="View architecture deep dive"
              className="px-2.5 py-1 rounded-xl border border-[var(--border-accent)] bg-[var(--accent-dim)] text-[var(--accent)] text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Info size={12} />
              <span className="hidden sm:inline">Deep Dive</span>
            </motion.button>
          )}
          {project.githubUrl && (
            <motion.a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--text-faint)] hover:text-[var(--accent)] hover:border-[var(--border-accent)] transition-colors cursor-pointer"
            >
              <FaGithub size={13} />
            </motion.a>
          )}
          {project.liveUrl && (
            <motion.a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Live demo"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--text-faint)] hover:text-[var(--accent)] hover:border-[var(--border-accent)] transition-colors cursor-pointer"
            >
              <ArrowUpRight size={13} strokeWidth={2.5} />
            </motion.a>
          )}
        </div>
      </div>

      <h3
        className="font-bold text-[var(--text)] leading-snug group-hover:text-[var(--accent)] transition-colors duration-200"
        style={{ fontFamily: 'Archivo, sans-serif', fontSize: featured ? '1.05rem' : '0.95rem' }}
      >
        {project.title}
      </h3>

      <p
        className="text-sm text-[var(--text-muted)] leading-relaxed flex-1 line-clamp-3"
        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
      >
        {project.description}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[var(--border)]/50">
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 5).map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
          {project.technologies.length > 5 && <span className="tag">+{project.technologies.length - 5}</span>}
        </div>
        {hasDetail && (
          <span className="text-xs text-[var(--accent)] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            Read Architecture →
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default function ProjectsSection({ projects }: { projects: Project[] }) {
  const cats = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];
  const [active, setActive] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const list     = active === 'All' ? projects : projects.filter((p) => p.category === active);
  const featured = list.filter((p) => p.featured);
  const rest     = list.filter((p) => !p.featured);

  return (
    <SectionWrapper id="projects">
      <SectionHeader
        number="03"
        title="Projects"
        subtitle="Things I've built — from multi-agent AI systems to self-healing infrastructure."
      />

      <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-10">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-xl border transition-all duration-200 cursor-pointer ${
              active === c
                ? 'bg-[var(--accent)] text-[#0A0F1E] border-[var(--accent)]'
                : 'border-[var(--border)] text-[var(--text-faint)] hover:border-[var(--border-accent)] hover:text-[var(--accent)]'
            }`}
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {c}
          </button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          variants={staggerContainer(0.07)}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
        >
          {featured.length > 0 && (
            <div
              className={`grid gap-4 mb-4 ${
                featured.length === 1
                  ? 'grid-cols-1'
                  : featured.length === 2
                  ? 'grid-cols-1 md:grid-cols-2'
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }`}
            >
              {featured.map((p) => (
                <ProjectCard key={p.id + p.title} project={p} featured onOpenDetail={setSelectedProject} />
              ))}
            </div>
          )}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rest.map((p) => (
                <ProjectCard key={p.id + p.title} project={p} featured={false} onOpenDetail={setSelectedProject} />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </SectionWrapper>
  );
}
