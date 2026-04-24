'use client';

import { motion } from 'motion/react';
import { fadeLeft } from '@/lib/motion';

interface Props {
  number: string;
  title: string;
}

export default function SectionHeader({ number, title }: Props) {
  return (
    <motion.div variants={fadeLeft} className="flex items-center gap-4 mb-16">
      <span className="section-num">{number}.</span>
      <h2 className="section-title">{title}</h2>
      <div className="section-line" />
    </motion.div>
  );
}
