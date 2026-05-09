'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Menu, X } from 'lucide-react';
import type { PersonalInfo } from '@/types';

const NAV = ['Home', 'About', 'Skills', 'Projects', 'Experience', 'Contact'];

export default function Navbar({ personalInfo }: { personalInfo: PersonalInfo }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const [mounted, setMounted]   = useState(false);

  useEffect(() => {
    setMounted(true);
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const go = (id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[var(--bg)]/95 backdrop-blur-md border-b border-[var(--border-accent)]'
          : ''
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo — square, sharp, on-theme */}
        <button
          onClick={() => go('home')}
          className="w-9 h-9 rounded-md flex items-center justify-center font-mono font-bold
                     text-sm text-white bg-[var(--accent)] hover:opacity-90 transition-opacity"
        >
          AS
        </button>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center">
          {NAV.map((item, i) => (
            <li key={item}>
              <button
                onClick={() => go(item)}
                className="px-4 py-2 text-sm font-medium text-[var(--text-muted)]
                           hover:text-[var(--text)] transition-colors duration-150 relative group"
              >
                <span className="mono text-[var(--accent)] mr-1 text-xs">
                  0{i + 1}.
                </span>
                {item}
                <span className="absolute bottom-0 left-4 right-4 h-px bg-[var(--accent)]
                                 scale-x-0 group-hover:scale-x-100 transition-transform
                                 duration-200 origin-left" />
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {/* Hire Me + Resume */}
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="hidden md:inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold
                       mono border border-[var(--border-accent)] bg-[var(--accent-glow)]
                       text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white
                       transition-all duration-200"
          >
            Hire Me
          </a>
          <a
            href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/resume/`}
            className="hidden md:inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold
                       mono border border-[var(--border)] text-[var(--text-muted)]
                       hover:border-[var(--border-accent)] hover:text-[var(--accent)]
                       transition-all duration-200"
          >
            Resume
          </a>
          {mounted && (
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="w-9 h-9 rounded-md border border-[var(--border)] flex items-center
                         justify-center text-[var(--text-muted)] hover:text-[var(--accent)]
                         hover:border-[var(--border-accent)] transition-colors"
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          )}
          <button
            className="md:hidden w-9 h-9 rounded-md border border-[var(--border)] flex items-center
                       justify-center text-[var(--text-muted)] hover:text-[var(--accent)]
                       transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-[var(--bg)]/98 border-b border-[var(--border)]"
          >
            <ul className="px-6 py-3 flex flex-col gap-1">
              {NAV.map((item, i) => (
                <li key={item}>
                  <button
                    onClick={() => go(item)}
                    className="w-full text-left px-4 py-3 rounded-md text-sm font-medium
                               text-[var(--text-muted)] hover:text-[var(--text)]
                               hover:bg-[var(--bg-2)] transition-colors"
                  >
                    <span className="mono text-[var(--accent)] mr-2">0{i + 1}.</span>
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
