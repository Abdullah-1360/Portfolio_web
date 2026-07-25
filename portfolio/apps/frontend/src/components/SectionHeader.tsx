'use client';

import { motion } from 'framer-motion';
import { fadeLeft } from '@/lib/motion';

interface Props { number: string; title: string; subtitle?: string; }

export default function SectionHeader({ number, title, subtitle }: Props) {
  return (
    <motion.div variants={fadeLeft} className="mb-12 md:mb-16">
      <div className="flex items-center gap-3 mb-3">
        <span className="section-num">{number}.</span>
        <div className="flex-1 h-px bg-gradient-to-r from-[var(--border-accent)] via-[var(--border)] to-transparent" />
      </div>
      <h2 className="section-title">{title}</h2>
      {subtitle && (
        <p className="mt-3 text-[var(--text-muted)] text-base max-w-xl leading-relaxed"
           style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{subtitle}</p>
      )}
    </motion.div>
  );
}
