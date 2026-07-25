import type { Variants } from 'framer-motion';

export const ease = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(5px)' },
  show:   { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.6, ease } },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -20, filter: 'blur(4px)' },
  show:   { opacity: 1, y: 0,   filter: 'blur(0px)', transition: { duration: 0.5, ease } },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -28, filter: 'blur(5px)' },
  show:   { opacity: 1, x: 0,   filter: 'blur(0px)', transition: { duration: 0.6, ease } },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 28, filter: 'blur(5px)' },
  show:   { opacity: 1, x: 0,  filter: 'blur(0px)', transition: { duration: 0.6, ease } },
};

export const scalePop: Variants = {
  hidden: { opacity: 0, scale: 0.88, filter: 'blur(5px)' },
  show:   { opacity: 1, scale: 1,    filter: 'blur(0px)', transition: { duration: 0.5, ease } },
};

export const staggerContainer = (stagger = 0.1, delay = 0): Variants => ({
  hidden: {},
  show:   { transition: { staggerChildren: stagger, delayChildren: delay } },
});
