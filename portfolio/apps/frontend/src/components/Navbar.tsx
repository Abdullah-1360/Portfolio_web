'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X } from 'lucide-react';
import type { PersonalInfo } from '@/types';

const NAV = ['Home', 'About', 'Skills', 'Projects', 'Experience', 'Contact'];

export default function Navbar({ personalInfo }: { personalInfo: PersonalInfo }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const [mounted, setMounted]   = useState(false);
  const [active, setActive]     = useState('Home');

  useEffect(() => {
    setMounted(true);
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const go = (id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
    setActive(id);
    setOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="fixed top-4 inset-x-0 z-50 flex justify-center pointer-events-none px-4"
      >
        <nav className={`pointer-events-auto flex items-center gap-1 px-2.5 py-2 rounded-2xl
          border transition-all duration-400
          ${scrolled
            ? 'bg-[var(--bg-2)]/85 backdrop-blur-2xl border-[var(--border)] shadow-[0_8px_40px_rgba(0,0,0,0.4)]'
            : 'bg-[var(--bg-3)]/50 backdrop-blur-xl border-[var(--border)]'
          }`}
        >
          {/* Logo */}
          <button onClick={() => go('home')} aria-label="Home" cursor-pointer
            className="w-8 h-8 rounded-xl flex items-center justify-center font-black
                       text-xs text-[#0A0F1E] bg-[var(--accent)] hover:bg-[#4ADE80]
                       transition-colors cursor-pointer mr-1.5 shrink-0"
            style={{ fontFamily: 'Archivo, sans-serif' }}
          >
            AS
          </button>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-0.5">
            {NAV.map((item) => (
              <li key={item}>
                <button
                  onClick={() => go(item)}
                  className={`relative px-3.5 py-1.5 text-sm font-medium rounded-xl
                    transition-colors duration-200 cursor-pointer
                    ${active === item ? 'text-[var(--text)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`}
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {active === item && (
                    <motion.span layoutId="nav-pill"
                      className="absolute inset-0 rounded-xl bg-[var(--bg-4)]"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{item}</span>
                </button>
              </li>
            ))}
          </ul>

          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
              className="ml-1.5 w-8 h-8 rounded-xl flex items-center justify-center
                         text-[var(--text-muted)] hover:text-[var(--accent)]
                         hover:bg-[var(--accent-dim)] transition-colors cursor-pointer"
            >
              {resolvedTheme === 'dark' ? <Sun size={14} strokeWidth={2} /> : <Moon size={14} strokeWidth={2} />}
            </button>
          )}

          {/* Mobile hamburger */}
          <button onClick={() => setOpen(!open)} aria-label="Toggle menu"
            className="md:hidden ml-1 w-8 h-8 rounded-xl flex items-center justify-center
                       text-[var(--text-muted)] hover:text-[var(--text)]
                       hover:bg-[var(--bg-4)] transition-colors cursor-pointer"
          >
            {open ? <X size={14} strokeWidth={2} /> : <Menu size={14} strokeWidth={2} />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-[4.5rem] inset-x-4 z-40 rounded-2xl border border-[var(--border)]
                       bg-[var(--bg-2)]/95 backdrop-blur-2xl shadow-2xl p-3 md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {NAV.map((item) => (
                <li key={item}>
                  <button onClick={() => go(item)}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium
                               text-[var(--text-muted)] hover:text-[var(--accent)]
                               hover:bg-[var(--accent-dim)] transition-colors cursor-pointer"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
