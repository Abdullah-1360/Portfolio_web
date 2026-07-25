'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { staggerContainer } from '@/lib/motion';

interface Props {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export default function SectionWrapper({ id, children, className = '' }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  // Subtle parallax on the section content
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <motion.section
      ref={ref}
      id={id}
      variants={staggerContainer(0.09)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.07 }}
      className={`relative z-10 py-20 md:py-28 px-4 md:px-6 ${className}`}
    >
      <motion.div style={{ y }} className="max-w-6xl mx-auto">
        {children}
      </motion.div>
    </motion.section>
  );
}
