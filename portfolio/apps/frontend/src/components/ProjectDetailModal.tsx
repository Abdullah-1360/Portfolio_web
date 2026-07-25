'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Terminal, Cpu, Layers, CheckCircle2, Copy, Check, GitBranch } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import type { Project } from '@/types';

interface Props {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectDetailModal({ project, onClose }: Props) {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const copyToClipboard = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#070913]/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.5, bounce: 0.1 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-[var(--bg-2)] border border-[var(--border-accent)] rounded-3xl shadow-2xl overflow-y-auto flex flex-col z-10 custom-scrollbar"
        >
          {/* Header */}
          <div className="sticky top-0 z-20 bg-[var(--bg-2)]/95 backdrop-blur-md border-b border-[var(--border)] px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                className="px-3 py-1 rounded-lg text-xs font-semibold border text-[var(--accent)] bg-[rgba(34,197,94,0.08)] border-[rgba(34,197,94,0.2)]"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                {project.category}
              </span>
              <h2
                className="text-lg sm:text-xl font-bold text-[var(--text)] truncate"
                style={{ fontFamily: 'Archivo, sans-serif' }}
              >
                {project.title}
              </h2>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl border border-[var(--border)] text-xs font-medium text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--border-accent)] transition-colors flex items-center gap-2"
                >
                  <FaGithub size={14} />
                  <span className="hidden sm:inline">GitHub</span>
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl border border-[var(--border)] text-xs font-medium text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--border-accent)] transition-colors flex items-center gap-2"
                >
                  <ExternalLink size={14} />
                  <span className="hidden sm:inline">Live Demo</span>
                </a>
              )}
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--text-faint)] hover:text-[var(--text)] hover:border-[var(--border-accent)] transition-colors"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 space-y-8 flex-1">
            {/* Overview / Executive Summary */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[var(--accent)]">
                <Layers size={18} />
                <h3 className="text-sm font-semibold uppercase tracking-wider mono">Executive Summary & Overview</h3>
              </div>
              <p
                className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed whitespace-pre-line"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {project.longDescription || project.description}
              </p>
            </div>

            {/* Architecture Diagram */}
            {project.architectureDiagram && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[var(--cyan)]">
                  <GitBranch size={18} />
                  <h3 className="text-sm font-semibold uppercase tracking-wider mono">System Architecture Topology</h3>
                </div>
                <div className="relative rounded-2xl bg-[#090D18] border border-[var(--border)] p-4 sm:p-6 overflow-x-auto">
                  <pre
                    className="text-xs sm:text-sm text-[var(--accent)] leading-snug"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    {project.architectureDiagram}
                  </pre>
                </div>
              </div>
            )}

            {/* Key Innovations */}
            {project.keyInnovations && project.keyInnovations.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[var(--purple)]">
                  <Cpu size={18} />
                  <h3 className="text-sm font-semibold uppercase tracking-wider mono">Key Technical Innovations</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {project.keyInnovations.map((item) => (
                    <div
                      key={item.title}
                      className="glass-card p-4 rounded-2xl border border-[var(--border)] hover:border-[var(--border-accent)] transition-colors space-y-2"
                    >
                      <h4
                        className="text-sm font-bold text-[var(--text)]"
                        style={{ fontFamily: 'Archivo, sans-serif' }}
                      >
                        {item.title}
                      </h4>
                      <p
                        className="text-xs text-[var(--text-muted)] leading-relaxed"
                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technologies */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)] mono">
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-[var(--bg-3)] border border-[var(--border)] text-[var(--text-muted)]"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Repository Structure */}
            {project.repoStructure && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[var(--text)]">
                  <Terminal size={18} />
                  <h3 className="text-sm font-semibold uppercase tracking-wider mono">Repository & Module Structure</h3>
                </div>
                <div className="rounded-2xl bg-[#090D18] border border-[var(--border)] p-4 sm:p-5 overflow-x-auto">
                  <pre
                    className="text-xs text-[var(--text-muted)] leading-relaxed"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    {project.repoStructure}
                  </pre>
                </div>
              </div>
            )}

            {/* Demo Commands */}
            {project.demoCommands && project.demoCommands.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)] mono">
                  Technical Execution & Commands
                </h3>
                <div className="space-y-2">
                  {project.demoCommands.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl bg-[#090D18] border border-[var(--border)] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="space-y-0.5">
                        <span className="text-xs text-[var(--text-faint)] block" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          {item.label}
                        </span>
                        <code
                          className="text-xs text-[var(--accent)] font-semibold"
                          style={{ fontFamily: 'JetBrains Mono, monospace' }}
                        >
                          {item.cmd}
                        </code>
                      </div>
                      <button
                        onClick={() => copyToClipboard(item.cmd)}
                        className="self-end sm:self-center px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--border-accent)] transition-colors flex items-center gap-1.5 shrink-0"
                      >
                        {copiedCmd === item.cmd ? <Check size={13} className="text-[var(--accent)]" /> : <Copy size={13} />}
                        <span>{copiedCmd === item.cmd ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Highlights for Hiring Managers */}
            {project.highlights && project.highlights.length > 0 && (
              <div className="space-y-3 p-5 rounded-2xl bg-[rgba(34,197,94,0.04)] border border-[rgba(34,197,94,0.15)]">
                <h3
                  className="text-sm font-bold text-[var(--accent)] uppercase tracking-wider mono"
                >
                  Portfolio Highlights for Hiring Managers
                </h3>
                <ul className="space-y-2">
                  {project.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                      <CheckCircle2 size={16} className="text-[var(--accent)] shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
