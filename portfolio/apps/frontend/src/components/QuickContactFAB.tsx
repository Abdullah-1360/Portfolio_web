'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MessageSquare, X, Copy, Check, MapPin, ExternalLink } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { useToast } from './Toast';
import type { PersonalInfo } from '@/types';

export default function QuickContactFAB({ personalInfo }: { personalInfo: PersonalInfo }) {
  const [open, setOpen] = useState(false);
  const { copyToClipboard } = useToast();

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        type="button"
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-2xl bg-[var(--accent)] text-white
                   flex items-center justify-center shadow-[0_8px_25px_rgba(240,136,62,0.4)]
                   border border-[var(--border-accent)] cursor-pointer"
        aria-label="Quick Contact"
        title="Quick Contact Abdullah"
      >
        {open ? <X size={20} /> : <MessageSquare size={20} />}
      </motion.button>

      {/* Floating Quick Contact Drawer Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-22 right-6 z-40 w-80 rounded-2xl border border-[var(--border-accent)]
                       bg-[var(--bg-2)]/95 backdrop-blur-2xl p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div>
                <h4 className="font-bold text-sm text-[var(--text)]" style={{ fontFamily: 'Archivo, sans-serif' }}>
                  Quick Contact
                </h4>
                <p className="text-[11px] text-[var(--text-muted)]">Reach out directly to Abdullah</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Available for opportunities" />
            </div>

            {/* Email Card with Copy */}
            <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-between gap-2">
              <div className="truncate">
                <span className="mono text-[10px] text-[var(--text-faint)] block">EMAIL</span>
                <span className="text-xs font-semibold text-[var(--text)] truncate block">{personalInfo.email}</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(personalInfo.email, 'email')}
                className="w-7 h-7 rounded-lg bg-[var(--accent-glow)] border border-[var(--border-accent)]
                           text-[var(--accent)] flex items-center justify-center hover:bg-[var(--accent)]
                           hover:text-white transition-all shrink-0 cursor-pointer"
                title="Copy Email"
              >
                <Copy size={12} />
              </button>
            </div>

            {/* Location & Status */}
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <MapPin size={13} className="text-[var(--accent)] shrink-0" />
              <span>{personalInfo.location}</span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--card)]
                           text-xs font-semibold text-[var(--text)] hover:border-[var(--border-accent)]
                           hover:text-[var(--accent)] transition-all flex items-center justify-center gap-1.5"
              >
                <FaGithub size={13} /> GitHub
              </a>
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--card)]
                           text-xs font-semibold text-[var(--text)] hover:border-[var(--border-accent)]
                           hover:text-[var(--accent)] transition-all flex items-center justify-center gap-1.5"
              >
                <FaLinkedin size={13} /> LinkedIn
              </a>
            </div>

            <a
              href={`mailto:${personalInfo.email}`}
              className="btn-primary w-full justify-center text-xs py-2.5 cursor-pointer"
            >
              <Mail size={14} /> Send Email
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
