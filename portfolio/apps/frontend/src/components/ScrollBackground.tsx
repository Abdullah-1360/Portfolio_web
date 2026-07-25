'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useAnimationFrame,
} from 'framer-motion';

// ─── Spotlight Cursor (follows mouse, reveals content) ───────────
function Spotlight() {
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const background = useTransform(
    () => `radial-gradient(600px circle at ${mouseX.get()}px ${mouseY.get()}px, rgba(var(--accent-rgb), 0.07), transparent 40%)`
  );

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[3] hidden md:block"
      style={{ background }}
    />
  );
}

// ─── Floating Geometric Shapes (bouncing around) ─────────────────
function FloatingShapes() {
  const shapes = [
    { w: 80,  h: 80,  x: '10%', y: '20%',  dur: 14, delay: 0,   border: 'border-[var(--border-accent)]', rotate: 0,   radius: 'rounded-2xl' },
    { w: 60,  h: 60,  x: '85%', y: '15%',  dur: 12, delay: 2,   border: 'border-[var(--border)]',        rotate: 45,  radius: 'rounded-full' },
    { w: 100, h: 100, x: '75%', y: '70%',  dur: 16, delay: 1,   border: 'border-[var(--border-accent)]', rotate: 15,  radius: 'rounded-3xl' },
    { w: 50,  h: 50,  x: '20%', y: '75%',  dur: 11, delay: 3,   border: 'border-[var(--border)]',        rotate: 30,  radius: 'rounded-xl' },
    { w: 70,  h: 70,  x: '5%',  y: '55%',  dur: 13, delay: 0.5, border: 'border-[var(--border)]',        rotate: 60,  radius: 'rounded-2xl' },
    { w: 40,  h: 40,  x: '90%', y: '45%',  dur: 10, delay: 4,   border: 'border-[var(--border-accent)]', rotate: 20,  radius: 'rounded-full' },
  ];

  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {shapes.map((s, i) => (
        <motion.div
          key={i}
          className={`absolute ${s.border} border bg-[var(--bg-2)]/30 ${s.radius}`}
          style={{ width: s.w, height: s.h, left: s.x, top: s.y }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            rotate: [s.rotate, s.rotate + 20, s.rotate],
          }}
          transition={{
            duration: s.dur,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// ─── Animated Gradient Border (using CSS + Framer) ───────────────
function GradientBorderFrame() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[-2]"
      style={{
        background: `
          linear-gradient(0deg, rgba(var(--accent-rgb), 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(var(--accent-rgb), 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }}
    />
  );
}

// ─── Moving Gradient Orb with Turbulence ─────────────────────────
function AnimatedGradientOrb() {
  const { scrollYProgress } = useScroll();
  const x1 = useTransform(scrollYProgress, [0, 1], ['-15%', '70%']);
  const y1 = useTransform(scrollYProgress, [0, 1], ['10%', '60%']);
  const x2 = useTransform(scrollYProgress, [0, 1], ['65%', '10%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['50%', '20%']);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.4, 0.9]);

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed pointer-events-none z-[-3]"
        style={{
          left: x1, top: y1, width: 700, height: 700,
          background: 'radial-gradient(circle, rgba(var(--accent-rgb), 0.12) 0%, transparent 70%)',
          filter: 'blur(100px)',
          scale,
        }}
      />
      <motion.div
        aria-hidden="true"
        className="fixed pointer-events-none z-[-3]"
        style={{
          left: x2, top: y2, width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(234,88,12,0.1) 0%, transparent 70%)',
          filter: 'blur(90px)',
        }}
      />
      <motion.div
        aria-hidden="true"
        className="fixed pointer-events-none z-[-3]"
        style={{
          left: useTransform(scrollYProgress, [0, 1], ['40%', '55%']),
          top: useTransform(scrollYProgress, [0, 1], ['70%', '30%']),
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(251,146,60,0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
    </>
  );
}

// ─── Pulsing Grid Dots ───────────────────────────────────────────
function PulsingGrid() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[-4]"
      style={{
        backgroundImage: 'radial-gradient(rgba(var(--accent-rgb), 0.08) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 0%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 0%, transparent 70%)',
      }}
    />
  );
}

// ─── Hero Words Floating ─────────────────────────────────────────
function FloatingHeroText() {
  const words = ['AI', 'LLM', 'MCP', 'n8n', 'Node.js', 'NestJS', 'Automate', 'Scale'];

  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden hidden lg:block">
      {words.map((word, i) => (
        <motion.span
          key={word}
          className="absolute text-4xl font-black opacity-[0.03] select-none"
          style={{
            left: `${10 + (i * 12)}%`,
            top: `${15 + (i % 3) * 25}%`,
            fontFamily: 'Archivo, sans-serif',
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.02, 0.05, 0.02],
          }}
          transition={{
            duration: 8 + i,
            delay: i * 0.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

// ─── Base Dark Background ────────────────────────────────────────
function BaseBackground() {
  const { scrollYProgress } = useScroll();
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    ['#0A0F1E', '#0A0F1E', '#0A1224', '#0A0F1E', '#0A1224', '#0A0F1E']
  );

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-0 -z-10"
      style={{ backgroundColor: bgColor }}
    />
  );
}

// ─── Main Export ─────────────────────────────────────────────────
export default function ScrollBackground() {
  return (
    <>
      <BaseBackground />
      <AnimatedGradientOrb />
      <PulsingGrid />
      <GradientBorderFrame />
      <FloatingShapes />
      <FloatingHeroText />
      <Spotlight />
    </>
  );
}