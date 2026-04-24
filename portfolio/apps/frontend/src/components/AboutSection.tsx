'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { Mail, MapPin, GraduationCap } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import SectionHeader from './SectionHeader';
import { fadeUp, fadeLeft, scalePop, staggerContainer } from '@/lib/motion';
import type { PersonalInfo, Education } from '@/types';

const TECHS = [
  'n8n / UChat',       'Node.js / Express',
  'Python',            'Flutter / Dart',
  'MCP / LLM Ops',     'Ansible / Linux',
  'MongoDB',           'Git / GitHub',
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
    <SectionWrapper id="about">
      <SectionHeader number="01" title="About Me" />

      <div className="grid lg:grid-cols-2 gap-12 items-start">

        {/* Left — text */}
        <motion.div variants={staggerContainer(0.08)} className="space-y-4 min-w-0">
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
            <ul className="grid grid-cols-2 gap-y-2 gap-x-6">
              {TECHS.map((tech) => (
                <li key={tech} className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                  <span className="text-[var(--accent)] text-xs shrink-0">▹</span>
                  {tech}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={fadeUp} className="card p-5 space-y-3">
            <p className="font-semibold text-[var(--text)] text-sm">Let&apos;s Connect</p>
            <a href={`mailto:${personalInfo.email}`}
               className="flex items-center gap-3 text-sm text-[var(--text-muted)]
                          hover:text-[var(--accent)] transition-colors">
              <Mail size={14} className="text-[var(--accent)] shrink-0" />
              {personalInfo.email}
            </a>
            <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
              <MapPin size={14} className="text-[var(--accent)] shrink-0" />
              {personalInfo.location}
            </div>
          </motion.div>
        </motion.div>

        {/* Right — image */}
        <motion.div variants={scalePop} className="flex justify-center lg:justify-end">
          <div className="photo-border p-[2px] rounded-xl
                          shadow-[0_0_40px_rgba(168,32,32,0.25)]">
            <div className="relative w-64 h-80 rounded-[10px] overflow-hidden">
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/profile.jpg`}
                alt="Abdullah Shahid"
                fill
                className="object-cover object-top"
                priority
                unoptimized
              />
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
          <div key={s.l} className="card p-5 text-center">
            <div className="text-2xl font-bold text-[var(--accent)] mb-1">{s.v}</div>
            <div className="mono">{s.l}</div>
          </div>
        ))}
      </motion.div>

      {/* Education */}
      <motion.div variants={fadeUp} className="mt-10">
        <div className="flex items-center gap-3 mb-4">
          <GraduationCap size={17} className="text-[var(--accent)]" />
          <h3 className="font-semibold text-[var(--text)]">Education</h3>
        </div>
        <div className="card p-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div>
              <p className="font-semibold text-[var(--text)]">{education.degree}</p>
              <p className="text-sm text-[var(--text-muted)] mt-0.5">
                {education.institution} — {education.location}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="tag">{eduStart} – {eduEnd}</span>
              <p className="mono mt-1.5">CGPA {education.cgpa}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
