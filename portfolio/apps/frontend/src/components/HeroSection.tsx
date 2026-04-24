'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { TypeAnimation } from 'react-type-animation';
import { Mail, ArrowDown, Zap, BookOpen, MapPin } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { fadeUp, fadeLeft, fadeRight, scalePop, staggerContainer } from '@/lib/motion';
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
      className="relative min-h-[100svh] flex items-center z-10 px-4 md:px-6 pt-20 pb-16"
    >
      <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-[1fr_380px] gap-10 lg:gap-16 items-center">

        {/* ── Left: text ── */}
        <div>
          {/* Status chip */}
          <motion.div variants={fadeLeft} className="mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md
                             border border-[var(--border-accent)] bg-[var(--accent-glow)]
                             text-xs font-medium text-[var(--accent)] mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
              Open to opportunities
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-[4.5rem] font-bold tracking-tight mb-4 leading-[1.05]"
          >
            <span className="text-[var(--text)]">Abdullah </span>
            <span className="gradient-text">Shahid</span>
          </motion.h1>

          {/* Typewriter */}
          <motion.div variants={fadeUp} className="flex items-center gap-2 mb-6 h-9">
            <span className="mono text-[var(--text-faint)] text-sm">~/</span>
            <TypeAnimation
              sequence={[
                'AI Automation Engineer',  2200,
                'Full-Stack Developer',    2200,
                'LLM / MCP Architect',     2200,
                'n8n & UChat Expert',      2200,
              ]}
              wrapper="span"
              speed={55}
              repeat={Infinity}
              className="text-lg md:text-xl font-semibold text-[var(--accent)]"
            />
          </motion.div>

          {/* Bio */}
          <motion.p
            variants={fadeUp}
            className="text-[var(--text-muted)] text-base max-w-lg leading-relaxed mb-2"
          >
            {personalInfo.bio}
          </motion.p>
          <motion.p
            variants={fadeUp}
            className="text-[var(--text-faint)] text-sm max-w-lg leading-relaxed mb-8"
          >
            {personalInfo.bio2}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-8">
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

          {/* Socials + location */}
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            {[
              { icon: <FaGithub size={16} />,             href: personalInfo.github,            label: 'GitHub' },
              { icon: <FaLinkedin size={16} />,           href: personalInfo.linkedin,          label: 'LinkedIn' },
              { icon: <Mail size={16} strokeWidth={1.6}/>, href: `mailto:${personalInfo.email}`, label: 'Email' },
            ].map(({ icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                whileHover={{ y: -2 }}
                className="w-9 h-9 rounded-md border border-[var(--border)] flex items-center
                           justify-center text-[var(--text-faint)] hover:text-[var(--accent)]
                           hover:border-[var(--border-accent)] transition-colors"
              >
                {icon}
              </motion.a>
            ))}
            <div className="w-px h-4 bg-[var(--border)] mx-1" />
            <span className="flex items-center gap-1.5 mono text-[var(--text-faint)]">
              <MapPin size={11} />
              {personalInfo.location}
            </span>
          </motion.div>
        </div>

        {/* ── Right: photo + currently card ── */}
        <motion.div variants={fadeRight} className="hidden lg:flex flex-col gap-5">

          {/* Profile photo */}
          <div className="photo-border p-[2px] rounded-xl self-center
                          shadow-[0_0_48px_rgba(168,32,32,0.2)]">
            <div className="relative w-72 h-80 rounded-[10px] overflow-hidden">
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

          {/* Currently card — prominent, right column */}
          <div className="border border-[var(--border-accent)] rounded-xl p-5
                          bg-[var(--card)] space-y-3">
            <p className="mono text-[var(--text-faint)] tracking-widest"
               style={{ fontSize: '0.6rem' }}>
              CURRENTLY
            </p>
            {currently.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                {item.label === 'Building'
                  ? <Zap size={12} className="text-[var(--accent)] shrink-0 mt-0.5" />
                  : <BookOpen size={12} className="text-[var(--accent)] shrink-0 mt-0.5" />
                }
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  <span className="text-[var(--accent)] font-semibold">{item.label}: </span>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Mobile: currently card below text */}
        <motion.div variants={fadeUp} className="lg:hidden border border-[var(--border-accent)]
                    rounded-xl p-5 bg-[var(--card)] space-y-3">
          <p className="mono text-[var(--text-faint)] tracking-widest"
             style={{ fontSize: '0.6rem' }}>
            CURRENTLY
          </p>
          {currently.map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              {item.label === 'Building'
                ? <Zap size={12} className="text-[var(--accent)] shrink-0 mt-0.5" />
                : <BookOpen size={12} className="text-[var(--accent)] shrink-0 mt-0.5" />
              }
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                <span className="text-[var(--accent)] font-semibold">{item.label}: </span>
                {item.value}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
        onClick={() => go('about')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center
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
