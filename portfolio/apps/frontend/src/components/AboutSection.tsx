'use client';

import { motion } from 'framer-motion';
import { Mail, MapPin, GraduationCap, ExternalLink } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import SectionHeader from './SectionHeader';
import { fadeUp, fadeRight, staggerContainer } from '@/lib/motion';
import type { PersonalInfo, Education } from '@/types';

const TECHS = [
  'n8n / UChat', 'Node.js / Express', 'Python', 'Flutter / Dart',
  'MCP / LLM Ops', 'Ansible / Linux', 'MongoDB', 'Git / GitHub',
];

const STATS = [
  { v: '15+',  l: 'Projects Shipped', color: 'text-[var(--accent)]' },
  { v: '60%',  l: 'Overhead Reduced', color: 'text-[var(--cyan)]' },
  { v: '10K+', l: 'Assets Managed',   color: 'text-[var(--purple)]' },
];

export default function AboutSection({ personalInfo, education }: { personalInfo: PersonalInfo; education: Education }) {
  const eduStart = new Date(education.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const eduEnd   = new Date(education.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return (
    <SectionWrapper id="about">
      <SectionHeader number="01" title="About Me" />

      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        {/* Left */}
        <motion.div variants={staggerContainer(0.08)} className="space-y-6">
          <motion.p variants={fadeUp} className="text-[var(--text-muted)] leading-relaxed text-base"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{personalInfo.bio}</motion.p>
          <motion.p variants={fadeUp} className="text-[var(--text-muted)] leading-relaxed text-base"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{personalInfo.bio2}</motion.p>

          <motion.div variants={fadeUp}>
            <p className="text-sm font-semibold text-[var(--text)] mb-4"
               style={{ fontFamily: 'Archivo, sans-serif' }}>Technologies I work with</p>
            <ul className="grid grid-cols-2 gap-y-2.5 gap-x-8">
              {TECHS.map((tech) => (
                <li key={tech} className="flex items-center gap-2.5 text-sm text-[var(--text-muted)]"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                  {tech}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4 pt-2">
            {STATS.map((s) => (
              <div key={s.l} className="glass-card rounded-2xl p-5 text-center
                                        hover:border-[var(--border-accent)] transition-colors duration-200">
                <div className={`text-3xl font-black tracking-tight mb-1 ${s.color}`}
                     style={{ fontFamily: 'Archivo, sans-serif' }}>{s.v}</div>
                <div className="text-xs text-[var(--text-faint)]"
                     style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{s.l}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right */}
        <motion.div variants={fadeRight} className="space-y-4">
          {/* Contact */}
          <div className="glass-card rounded-2xl p-5 space-y-3">
            <p className="mono tracking-widest uppercase mb-1">Contact</p>
            <a href={`mailto:${personalInfo.email}`}
               className="flex items-center gap-3 text-sm text-[var(--text-muted)]
                          hover:text-[var(--accent)] transition-colors group cursor-pointer"
               style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              <div className="w-8 h-8 rounded-xl bg-[var(--bg-3)] flex items-center justify-center text-[var(--accent)] shrink-0">
                <Mail size={13} strokeWidth={2} />
              </div>
              <span className="truncate">{personalInfo.email}</span>
              <ExternalLink size={11} className="ml-auto opacity-0 group-hover:opacity-50 transition-opacity shrink-0" />
            </a>
            <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]"
                 style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              <div className="w-8 h-8 rounded-xl bg-[var(--bg-3)] flex items-center justify-center text-[var(--accent)] shrink-0">
                <MapPin size={13} strokeWidth={2} />
              </div>
              {personalInfo.location}
            </div>
          </div>

          {/* Education */}
          <div className="glass-card rounded-2xl p-5">
            <p className="mono tracking-widest uppercase mb-3">Education</p>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[var(--bg-3)] flex items-center justify-center text-[var(--accent)] shrink-0 mt-0.5">
                <GraduationCap size={13} strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[var(--text)] text-sm"
                   style={{ fontFamily: 'Archivo, sans-serif' }}>{education.degree}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5"
                   style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{education.institution}</p>
                <div className="flex items-center justify-between mt-2.5">
                  <span className="mono">{eduStart} – {eduEnd}</span>
                  <span className="mono text-[var(--accent)]">CGPA {education.cgpa}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="rounded-2xl border border-[var(--border-accent)] bg-[var(--accent-dim)] p-4 flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-60" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--accent)]" />
            </span>
            <p className="text-sm text-[var(--text-muted)]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              <span className="font-semibold text-[var(--accent)]">Available</span> for new opportunities
            </p>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
