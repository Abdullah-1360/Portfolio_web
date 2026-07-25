'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 80, damping: 20, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2.5px] origin-left z-[100] pointer-events-none"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, var(--accent), #FB923C 50%, #EA580C 100%)',
        boxShadow: '0 0 12px rgba(var(--accent-rgb),0.5), 0 0 4px rgba(var(--accent-rgb),0.3)',
      }}
    />
  );
}