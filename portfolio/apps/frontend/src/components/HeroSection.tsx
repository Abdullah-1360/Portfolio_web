'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { Mail, ArrowDown, Zap, BookOpen, MapPin, ArrowUpRight } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { staggerContainer, fadeUp, fadeLeft, fadeRight } from '@/lib/motion';
import type { PersonalInfo, Currently } from '@/types';

interface Props { personalInfo: PersonalInfo; currently: Currently[]; }

const METRICS = [
  { v: '60%',  l: 'overhead cut',    color: 'text-[var(--accent)]' },
  { v: '10K+', l: 'servers managed', color: 'text-[var(--accent)]' },
  { v: '40%',  l: 'faster support',  color: 'text-[var(--accent)]' },
];

export default function HeroSection({ personalInfo, currently }: Props) {
  const { scrollY } = useScroll();
  const photoY    = useTransform(scrollY, [0, 500], [0, 60]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale   = useTransform(scrollY, [0, 400], [1, 0.96]);
  const heroY       = useTransform(scrollY, [0, 400], [0, -40]);

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <motion.section
      id="home"
      variants={staggerContainer(0.09, 0.1)}
      initial="hidden"
      animate="show"
      className="relative min-h-[100svh] flex items-center z-10 px-4 md:px-6 pt-28 pb-20"
    >
      {/* Subtle dot grid */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(rgba(var(--accent-rgb),0.12) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 10%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 10%, transparent 75%)',
        }}
      />

      <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-[1fr_340px] gap-12 lg:gap-20 items-center">

        {/* ── LEFT — fades out on scroll ── */}
        <motion.div style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}>
          {/* Status badge */}
          <motion.div variants={fadeLeft} className="mb-7">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full
                             border border-[var(--border-accent)] bg-[var(--accent-dim)]
                             text-xs font-semibold text-[var(--accent)] cursor-default shadow-sm"
                  style={{ fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.07em' }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]" />
              </span>
              OPEN TO OPPORTUNITIES
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1 variants={fadeUp}
            className="text-[clamp(2.8rem,8vw,6rem)] font-black leading-[0.93] tracking-[-0.04em] mb-5"
            style={{ fontFamily: 'Archivo, sans-serif' }}
          >
            <span className="block text-[var(--text)]">Abdullah</span>
            <span className="block gradient-text">Shahid</span>
          </motion.h1>

          {/* Typewriter */}
          <motion.div variants={fadeUp} className="flex items-center gap-2.5 mb-6 h-8">
            <span className="mono opacity-50">~/</span>
            <TypeAnimation
              sequence={['AI Automation Engineer', 2400, 'LLM / MCP Architect', 2400, 'Full-Stack Developer', 2400, 'n8n & UChat Expert', 2400]}
              wrapper="span" speed={55} repeat={Infinity}
              className="text-lg font-semibold text-[var(--text-muted)]"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            />
            <span className="w-0.5 h-5 bg-[var(--accent)] animate-blink" />
          </motion.div>

          {/* Bio */}
          <motion.p variants={fadeUp}
            className="text-[var(--text-muted)] text-base max-w-xl leading-relaxed mb-2"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {personalInfo.bio}
          </motion.p>
          <motion.p variants={fadeUp}
            className="text-[var(--text-faint)] text-sm max-w-xl leading-relaxed mb-8"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {personalInfo.bio2}
          </motion.p>

          {/* Metrics */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-8 mb-9">
            {METRICS.map((m) => (
              <div key={m.l} className="flex flex-col">
                <span className={`text-3xl font-black tracking-tight ${m.color}`}
                      style={{ fontFamily: 'Archivo, sans-serif' }}>{m.v}</span>
                <span className="text-xs text-[var(--text-faint)] mt-0.5"
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{m.l}</span>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-8">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => go('projects')} className="btn-primary">
              View My Work <ArrowUpRight size={15} strokeWidth={2.5} />
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => go('contact')} className="btn-outline">
              Get In Touch
            </motion.button>
          </motion.div>

          {/* Socials */}
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            {[
              { icon: <FaGithub size={15} />,               href: personalInfo.github,            label: 'GitHub' },
              { icon: <FaLinkedin size={15} />,             href: personalInfo.linkedin,          label: 'LinkedIn' },
              { icon: <Mail size={15} strokeWidth={1.8} />, href: `mailto:${personalInfo.email}`, label: 'Email' },
            ].map(({ icon, href, label }) => (
              <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer"
                aria-label={label} whileHover={{ y: -3, scale: 1.1 }} whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-xl border border-[var(--border)] flex items-center
                           justify-center text-[var(--text-faint)] hover:text-[var(--accent)]
                           hover:border-[var(--border-accent)] hover:bg-[var(--accent-dim)]
                           transition-colors cursor-pointer"
              >
                {icon}
              </motion.a>
            ))}
            <div className="w-px h-4 bg-[var(--border)] mx-1" />
            <span className="flex items-center gap-1.5 text-xs text-[var(--text-faint)]"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              <MapPin size={11} />{personalInfo.location}
            </span>
          </motion.div>
        </motion.div>

        {/* ── RIGHT ── */}
        <motion.div variants={fadeRight} className="hidden lg:flex flex-col gap-5">
          {/* Photo with liquid glass frame */}
          <motion.div style={{ y: photoY }} className="relative self-center">
            <div className="absolute -inset-4 rounded-3xl opacity-25"
                 style={{ background: 'linear-gradient(135deg, var(--accent), #EA580C)', filter: 'blur(24px)' }} />
            <div className="relative w-72 h-80 rounded-2xl overflow-hidden shadow-2xl border border-[var(--border-accent)]">
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/profile.jpg`}
                alt="Abdullah Shahid" fill className="object-cover object-top" priority unoptimized
              />
              <div className="absolute inset-0"
                   style={{ background: 'linear-gradient(to top, rgba(10,15,30,0.5) 0%, transparent 55%)' }} />
            </div>
          </motion.div>

          {/* Currently — liquid glass */}
          <div className="glass-card rounded-2xl p-5 space-y-3.5 shadow-xl">
            <p className="mono tracking-widest uppercase">Currently</p>
            {currently.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                {item.label === 'Building'
                  ? <Zap size={12} className="text-[var(--accent)] shrink-0 mt-0.5" />
                  : <BookOpen size={12} className="text-[var(--accent)] shrink-0 mt-0.5" />
                }
                <p className="text-xs text-[var(--text-muted)] leading-relaxed"
                   style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  <span className="font-semibold text-[var(--accent)]">
                    {item.label}:{' '}
                  </span>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Currently — mobile */}
        <motion.div variants={fadeUp} className="lg:hidden glass-card rounded-2xl p-5 space-y-3.5 shadow-xl">
          <p className="mono tracking-widest uppercase">Currently</p>
          {currently.map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              {item.label === 'Building'
                ? <Zap size={12} className="text-[var(--accent)] shrink-0 mt-0.5" />
                : <BookOpen size={12} className="text-[var(--accent)] shrink-0 mt-0.5" />
              }
              <p className="text-xs text-[var(--text-muted)] leading-relaxed"
                 style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                <span className="font-semibold text-[var(--accent)]">
                  {item.label}:{' '}
                </span>
                {item.value}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
        onClick={() => go('about')} aria-label="Scroll down"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center
                   gap-1.5 text-[var(--text-faint)] hover:text-[var(--accent)]
                   transition-colors cursor-pointer"
      >
        <span className="mono">scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <ArrowDown size={13} strokeWidth={1.5} />
        </motion.div>
      </motion.button>
    </motion.section>
  );
}
