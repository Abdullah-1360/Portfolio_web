'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Download, ArrowLeft, ZoomIn, ZoomOut } from 'lucide-react';
import Link from 'next/link';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const PDF_URL = `${BASE}/resume.pdf`;

export default function ResumePage() {
  const [zoom, setZoom] = useState(100);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>

      {/* ── Toolbar ── */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)]
                         bg-[var(--bg)]/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

          {/* Back */}
          <Link
            href={`${BASE}/`}
            className="flex items-center gap-2 text-sm text-[var(--text-muted)]
                       hover:text-[var(--accent)] transition-colors"
          >
            <ArrowLeft size={15} strokeWidth={1.6} />
            Back to Portfolio
          </Link>

          {/* Title */}
          <p className="mono text-[var(--text-faint)] hidden sm:block"
             style={{ fontSize: '0.7rem' }}>
            Abdullah Shahid — Resume
          </p>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Zoom */}
            <div className="hidden sm:flex items-center gap-1 border border-[var(--border)]
                            rounded-md px-2 py-1">
              <button
                onClick={() => setZoom(z => Math.max(50, z - 10))}
                className="text-[var(--text-faint)] hover:text-[var(--accent)] transition-colors"
                aria-label="Zoom out"
              >
                <ZoomOut size={14} />
              </button>
              <span className="mono text-[var(--text-faint)] w-10 text-center"
                    style={{ fontSize: '0.65rem' }}>
                {zoom}%
              </span>
              <button
                onClick={() => setZoom(z => Math.min(200, z + 10))}
                className="text-[var(--text-faint)] hover:text-[var(--accent)] transition-colors"
                aria-label="Zoom in"
              >
                <ZoomIn size={14} />
              </button>
            </div>

            {/* Download */}
            <motion.a
              href={PDF_URL}
              download="Abdullah_Shahid_Resume.pdf"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary flex items-center gap-2 text-sm py-2 px-4"
            >
              <Download size={14} strokeWidth={1.8} />
              Download
            </motion.a>
          </div>
        </div>
      </header>

      {/* ── PDF Viewer ── */}
      <main className="flex-1 flex flex-col items-center py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-4xl"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
        >
          {/* Native browser PDF embed — works in all modern browsers */}
          <object
            data={PDF_URL}
            type="application/pdf"
            className="w-full rounded-xl border border-[var(--card-border)] shadow-xl"
            style={{ height: '85vh', minHeight: '600px' }}
          >
            {/* Fallback for browsers that don't support object/embed */}
            <div className="flex flex-col items-center justify-center h-96 gap-4
                            bg-[var(--card)] rounded-xl border border-[var(--card-border)]">
              <p className="text-[var(--text-muted)] text-sm">
                Your browser can&apos;t preview PDFs inline.
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
      </main>
    </div>
  );
}
