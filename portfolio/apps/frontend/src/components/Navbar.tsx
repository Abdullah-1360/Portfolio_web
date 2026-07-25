'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X } from 'lucide-react';
import type { PersonalInfo } from '@/types';

const NAV = [
  { label: 'Home',       id: 'home' },
  { label: 'About',      id: 'about' },
  { label: 'Skills',     id: 'skills' },
  { label: 'Projects',   id: 'projects' },
  { label: 'Experience', id: 'experience' },
  { label: 'Contact',    id: 'contact' },
];

export default function Navbar({ personalInfo }: { personalInfo: PersonalInfo }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const [mounted, setMounted]   = useState(false);
  const [activeId, setActiveId] = useState('home');

  useEffect(() => {
    setMounted(true);
    const sectionIds = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];

    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      const scrollPos = window.scrollY + 200;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveId(sectionIds[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const go = (id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
    setActiveId(id.toLowerCase());
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
        <nav className={`pointer-events-auto flex items-center gap-1.5 px-3 py-2 rounded-2xl
          border transition-all duration-300 shadow-xl
          ${scrolled
            ? 'bg-[var(--glass)] backdrop-blur-2xl border-[var(--border-accent)] shadow-[0_8px_32px_rgba(0,0,0,0.15)]'
            : 'bg-[var(--bg-2)]/80 backdrop-blur-xl border-[var(--border)]'
          }`}
        >
          {/* Logo */}
          <button onClick={() => go('home')} aria-label="Home"
            className="w-8 h-8 rounded-xl flex items-center justify-center font-black
                       text-xs text-white bg-[var(--accent)] hover:opacity-90
                       transition-all cursor-pointer mr-1 shrink-0 shadow-md"
            style={{ fontFamily: 'Archivo, sans-serif' }}
          >
            AS
          </button>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV.map((item) => {
              const isActive = activeId === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => go(item.id)}
                    className={`relative px-3.5 py-1.5 text-xs font-semibold rounded-xl
                      transition-colors duration-200 cursor-pointer
                      ${isActive ? 'text-[var(--accent)] font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`}
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {isActive && (
                      <motion.span layoutId="nav-pill"
                        className="absolute inset-0 rounded-xl bg-[var(--accent-glow)] border border-[var(--border-accent)] shadow-sm"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
              className="ml-2 w-8 h-8 rounded-xl flex items-center justify-center
                         text-[var(--text-muted)] hover:text-[var(--accent)]
                         hover:bg-[var(--accent-dim)] border border-[var(--border)] transition-all cursor-pointer"
            >
              {resolvedTheme === 'dark' ? <Sun size={14} strokeWidth={2} /> : <Moon size={14} strokeWidth={2} />}
            </button>
          )}

          {/* Mobile hamburger */}
          <button onClick={() => setOpen(!open)} aria-label="Toggle menu"
            className="md:hidden ml-1 w-8 h-8 rounded-xl flex items-center justify-center
                       text-[var(--text-muted)] hover:text-[var(--text)]
                       hover:bg-[var(--bg-3)] border border-[var(--border)] transition-colors cursor-pointer"
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
            className="fixed top-[4.5rem] inset-x-4 z-40 rounded-2xl border border-[var(--border-accent)]
                       bg-[var(--bg-2)]/95 backdrop-blur-2xl shadow-2xl p-3 md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {NAV.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <li key={item.id}>
                    <button onClick={() => go(item.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium
                        transition-colors cursor-pointer flex items-center justify-between
                        ${isActive
                          ? 'text-[var(--accent)] bg-[var(--accent-glow)] font-semibold border border-[var(--border-accent)]'
                          : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-3)]'}`}
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      <span>{item.label}</span>
                      {isActive && <span className="w-2 h-2 rounded-full bg-[var(--accent)] shrink-0" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
