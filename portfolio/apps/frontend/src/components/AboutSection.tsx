'use client';

import { motion } from 'motion/react';
import { Mail, MapPin, GraduationCap } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import SectionHeader from './SectionHeader';
import { fadeUp, fadeRight, staggerContainer } from '@/lib/motion';
import type { PersonalInfo, Education } from '@/types';

const TECHS = [
  'n8n / UChat',    'Node.js / Express',
  'Python',         'Flutter / Dart',
  'MCP / LLM Ops',  'Ansible / Linux',
  'MongoDB',        'Git / GitHub',
];

interface Props {
  personalInfo: PersonalInfo;
  education: Education;
}

export default function AboutSection({ personalInfo, education }: Props) {
  const eduStart = new Date(education.startDate)
    .toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const eduEnd = new Date(education.endDate)
    .toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return (
    <SectionWrapper id="about" className="bg-[var(--bg-2)]/40">
      <SectionHeader number="01" title="About Me" />

      <div className="grid lg:grid-cols-2 gap-14 items-start">

        {/* Left */}
        <motion.div variants={staggerContainer(0.08)} className="space-y-5 min-w-0">
          <motion.p variants={fadeUp}
            className="text-[var(--text-muted)] leading-relaxed text-sm md:text-base">
            {personalInfo.bio}
          </motion.p>
          <motion.p variants={fadeUp}
            className="text-[var(--text-muted)] leading-relaxed text-sm md:text-base">
            {personalInfo.bio2}
          </motion.p>
          <motion.div variants={fadeUp}>
            <p className="font-semibold text-[var(--text)] mb-3 text-sm">
              Technologies I work with:
            </p>
            <ul className="grid grid-cols-2 gap-y-2.5 gap-x-6">
              {TECHS.map((tech) => (
                <li key={tech} className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                  <span className="w-1 h-1 rounded-full bg-[var(--accent)] shrink-0" />
                  {tech}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Right */}
        <motion.div variants={fadeRight} className="space-y-4">
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5 space-y-3">
            <p className="mono text-[var(--text-faint)] tracking-widest mb-3"
               style={{ fontSize: '0.6rem' }}>CONTACT</p>
            <a href={`mailto:${personalInfo.email}`}
               className="flex items-center gap-3 text-sm text-[var(--text-muted)]
                          hover:text-[var(--accent)] transition-colors">
              <div className="w-8 h-8 rounded-md bg-[var(--bg-3)] flex items-center
                              justify-center text-[var(--accent)] shrink-0">
                <Mail size={14} strokeWidth={1.6} />
              </div>
              <span className="truncate">{personalInfo.email}</span>
            </a>
            <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
              <div className="w-8 h-8 rounded-md bg-[var(--bg-3)] flex items-center
                              justify-center text-[var(--accent)] shrink-0">
                <MapPin size={14} strokeWidth={1.6} />
              </div>
              {personalInfo.location}
            </div>
          </div>

          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
            <p className="mono text-[var(--text-faint)] tracking-widest mb-3"
               style={{ fontSize: '0.6rem' }}>EDUCATION</p>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-md bg-[var(--bg-3)] flex items-center
                              justify-center text-[var(--accent)] shrink-0 mt-0.5">
                <GraduationCap size={14} strokeWidth={1.6} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[var(--text)] text-sm">{education.degree}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{education.institution}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="mono">{eduStart} – {eduEnd}</span>
                  <span className="mono text-[var(--accent)]">CGPA {education.cgpa}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats */}
      <motion.div variants={fadeUp} className="mt-14 grid grid-cols-3 gap-4">
        {[
          { v: '15+',  l: 'Projects Shipped' },
          { v: '60%',  l: 'Overhead Reduced' },
          { v: '10K+', l: 'Assets Managed' },
        ].map((s) => (
          <div key={s.l}
               className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl
                          p-5 text-center hover:border-[var(--border-accent)] transition-colors">
            <div className="text-2xl font-bold text-[var(--accent)] mb-1 tracking-tight">
              {s.v}
            </div>
            <div className="mono">{s.l}</div>
          </div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
