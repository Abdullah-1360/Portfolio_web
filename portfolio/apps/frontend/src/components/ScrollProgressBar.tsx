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
        background: 'linear-gradient(90deg, #22C55E, #22D3EE 40%, #A78BFA 70%, #F472B6 100%)',
        boxShadow: '0 0 12px rgba(34,197,94,0.5), 0 0 4px rgba(34,211,238,0.3)',
      }}
    />
  );
}