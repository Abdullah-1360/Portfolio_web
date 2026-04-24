'use client';

import { motion } from 'motion/react';
import { staggerContainer } from '@/lib/motion';

interface Props {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export default function SectionWrapper({ id, children, className = '' }: Props) {
  return (
    <motion.section
      id={id}
      variants={staggerContainer(0.08)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.08 }}
      className={`relative z-10 py-16 md:py-24 px-4 md:px-6 ${className}`}
    >
      <div className="max-w-5xl mx-auto">{children}</div>
    </motion.section>
  );
}
