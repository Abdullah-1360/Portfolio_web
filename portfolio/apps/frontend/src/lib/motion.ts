import type { Variants } from 'motion/react';

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  show:   { opacity: 1, x: 0,  transition: { duration: 0.45, ease: 'easeOut' } },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  show:   { opacity: 1, x: 0,  transition: { duration: 0.45, ease: 'easeOut' } },
};

export const scalePop: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.35, ease: 'easeOut' } },
};

export const staggerContainer = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  show:   { transition: { staggerChildren: stagger, delayChildren: delay } },
});
