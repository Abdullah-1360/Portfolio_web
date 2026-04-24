'use client';

import { motion } from 'motion/react';
import { TypeAnimation } from 'react-type-animation';
import { Mail, ArrowDown, Zap, BookOpen } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { fadeUp, fadeLeft, staggerContainer } from '@/lib/motion';
import type { PersonalInfo, Currently } from '@/types';

interface Props {
  personalInfo: PersonalInfo;
  currently: Currently[];
}

export default function HeroSection({ personalInfo, currently }: Props) {
  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <motion.section
      id="home"
      variants={staggerContainer(0.1, 0.15)}
      initial="hidden"
      animate="show"
      className="relative min-h-screen flex items-center z-10 px-6 pt-16"
    >
      <div className="max-w-5xl mx-auto w-full">

        {/* Open to opportunities chip */}
        <motion.div variants={fadeLeft} className="mb-5">
          <span className="tag">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mr-2 inline-block
                             animate-pulse" />
            Open to opportunities
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          variants={fadeUp}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-4 leading-[1.05]"
        >
          <span className="text-[var(--text)]">Abdullah </span>
          <span className="gradient-text">Shahid</span>
        </motion.h1>

        {/* Typewriter */}
        <motion.div variants={fadeUp} className="flex items-center gap-2 mb-6 h-10">
          <span className="mono text-[var(--text-faint)]">~/</span>
          <TypeAnimation
            sequence={[
              'AI Automation Engineer',  2000,
              'Full-Stack Developer',    2000,
              'LLM / MCP Architect',     2000,
              'n8n & UChat Expert',      2000,
            ]}
            wrapper="span"
            speed={55}
            repeat={Infinity}
            className="text-xl md:text-2xl font-semibold text-[var(--accent)]"
          />
        </motion.div>

        {/* Bio — human voice */}
        <motion.p
          variants={fadeUp}
          className="text-[var(--text-muted)] text-base md:text-lg max-w-xl leading-relaxed mb-3"
        >
          {personalInfo.bio}
        </motion.p>
        <motion.p
          variants={fadeUp}
          className="text-[var(--text-muted)] text-sm max-w-xl leading-relaxed mb-10"
        >
          {personalInfo.bio2}
        </motion.p>

        {/* CTAs */}
        <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-10">
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => go('projects')} className="btn-primary"
          >
            View My Work
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => go('contact')} className="btn-outline"
          >
            Get In Touch
          </motion.button>
        </motion.div>

        {/* Currently section */}
        <motion.div variants={fadeUp} className="mb-10 max-w-xl">
          <div className="card p-4 space-y-2.5">
            <p className="mono text-[var(--text-faint)] mb-1" style={{ fontSize: '0.65rem' }}>
              CURRENTLY
            </p>
            {currently.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                {item.label === 'Building'
                  ? <Zap size={13} className="text-[var(--accent)] shrink-0 mt-0.5" />
                  : <BookOpen size={13} className="text-[var(--accent)] shrink-0 mt-0.5" />
                }
                <span className="text-xs text-[var(--text-muted)] leading-relaxed">
                  <span className="text-[var(--accent)] font-semibold">{item.label}: </span>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Socials */}
        <motion.div variants={fadeUp} className="flex items-center gap-3">
          {[
            { icon: <FaGithub size={17} />,                          href: personalInfo.github,   label: 'GitHub' },
            { icon: <FaLinkedin size={17} />,                        href: personalInfo.linkedin, label: 'LinkedIn' },
            { icon: <Mail size={17} strokeWidth={1.6} />,            href: `mailto:${personalInfo.email}`, label: 'Email' },
          ].map(({ icon, href, label }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              whileHover={{ y: -2 }}
              className="w-10 h-10 rounded-md border border-[var(--border)] flex items-center
                         justify-center text-[var(--text-faint)] hover:text-[var(--accent)]
                         hover:border-[var(--border-accent)] transition-colors"
            >
              {icon}
            </motion.a>
          ))}
          <div className="w-px h-5 bg-[var(--border)] mx-1" />
          <span className="mono">{personalInfo.location}</span>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
        onClick={() => go('about')}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center
                   gap-1.5 text-[var(--text-faint)] hover:text-[var(--accent)] transition-colors"
        aria-label="Scroll down"
      >
        <span className="mono text-xs">scroll</span>
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ArrowDown size={13} strokeWidth={1.5} />
        </motion.div>
      </motion.button>
    </motion.section>
  );
}
