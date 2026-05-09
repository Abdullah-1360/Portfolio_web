'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Download, ArrowLeft, ZoomIn, ZoomOut, FileText } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const PDF_URL = `${BASE}/resume.pdf`;
// Back link: if BASE is '/Portfolio_web', go to '/Portfolio_web/', else '/'
const HOME_URL = BASE ? `${BASE}/` : '/';

export default function ResumePage() {
  const [zoom, setZoom] = useState(100);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>

      {/* ── Top bar ── */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)]
                         bg-[var(--bg)]/95 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between gap-4">

          {/* Back */}
          <a
            href={HOME_URL}
            className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)]
                       hover:text-[var(--accent)] transition-colors"
          >
            <ArrowLeft size={15} strokeWidth={1.6} />
            <span className="hidden sm:inline">Back to Portfolio</span>
            <span className="sm:hidden">Back</span>
          </a>

          {/* Title */}
          <div className="flex items-center gap-2">
            <FileText size={14} className="text-[var(--accent)]" />
            <span className="mono text-[var(--text-muted)]" style={{ fontSize: '0.72rem' }}>
              Abdullah Shahid — Resume
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Zoom — desktop only */}
            <div className="hidden sm:flex items-center gap-1 border border-[var(--border)]
                            rounded-md px-2 py-1.5 bg-[var(--card)]">
              <button
                onClick={() => setZoom(z => Math.max(60, z - 10))}
                className="text-[var(--text-faint)] hover:text-[var(--accent)] transition-colors p-0.5"
                aria-label="Zoom out"
              >
                <ZoomOut size={13} />
              </button>
              <span className="mono text-[var(--text-faint)] w-9 text-center select-none"
                    style={{ fontSize: '0.65rem' }}>
                {zoom}%
              </span>
              <button
                onClick={() => setZoom(z => Math.min(150, z + 10))}
                className="text-[var(--text-faint)] hover:text-[var(--accent)] transition-colors p-0.5"
                aria-label="Zoom in"
              >
                <ZoomIn size={13} />
              </button>
            </div>

            {/* Download */}
            <motion.a
              href={PDF_URL}
              download="Abdullah_Shahid_Resume.pdf"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5"
            >
              <Download size={13} strokeWidth={1.8} />
              Download
            </motion.a>
          </div>
        </div>
      </header>

      {/* ── PDF viewer area ── */}
      <main className="flex-1 flex flex-col items-center py-8 px-4"
            style={{ background: 'var(--bg-2)' }}>

        {/* Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mono text-[var(--text-faint)] mb-4 text-center"
          style={{ fontSize: '0.65rem' }}
        >
          scroll to read · use zoom controls · click download to save
        </motion.p>

        {/* PDF frame */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full shadow-2xl rounded-xl overflow-hidden
                     border border-[var(--card-border)]"
          style={{
            maxWidth: `${Math.min(900, 900 * zoom / 100)}px`,
            transition: 'max-width 0.2s ease',
          }}
        >
          {/* Fake browser chrome — makes it look intentional */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)]"
               style={{ background: 'var(--bg-3)' }}>
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex-1 mx-3 px-3 py-1 rounded-md text-center mono
                            border border-[var(--border)]"
                 style={{ background: 'var(--bg-2)', fontSize: '0.65rem',
                          color: 'var(--text-faint)' }}>
              resume.pdf
            </div>
          </div>

          {/* The actual PDF */}
          <object
            data={PDF_URL}
            type="application/pdf"
            className="w-full block"
            style={{ height: '82vh', minHeight: '500px' }}
          >
            {/* Fallback */}
            <div className="flex flex-col items-center justify-center gap-5 py-20
                            bg-[var(--card)]">
              <FileText size={40} className="text-[var(--text-faint)]" />
              <p className="text-[var(--text-muted)] text-sm text-center max-w-xs">
                Your browser doesn&apos;t support inline PDF preview.
              </p>
              <a
                href={PDF_URL}
                download="Abdullah_Shahid_Resume.pdf"
                className="btn-primary"
              >
                <Download size={14} />
                Download Resume
              </a>
            </div>
          </object>
        </motion.div>

        {/* Bottom spacer */}
        <div className="h-12" />
      </main>
    </div>
  );
}
