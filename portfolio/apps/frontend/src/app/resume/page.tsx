'use client';

import { motion } from 'motion/react';
import { Download, ArrowLeft, ExternalLink } from 'lucide-react';

const BASE     = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const PDF_URL  = `${BASE}/resume.pdf`;
const HOME_URL = BASE ? `${BASE}/` : '/';

export default function ResumePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>

      {/* ── Minimal top bar ── */}
      <header
        className="sticky top-0 z-50 border-b border-[var(--border)]"
        style={{ background: 'var(--bg)', backdropFilter: 'blur(12px)' }}
      >
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-14
                        flex items-center justify-between">

          <a
            href={HOME_URL}
            className="flex items-center gap-2 text-sm font-medium
                       text-[var(--text-muted)] hover:text-[var(--accent)]
                       transition-colors"
          >
            <ArrowLeft size={15} strokeWidth={1.6} />
            Back to Portfolio
          </a>

          <div className="flex items-center gap-2">
            {/* Open in new tab */}
            <a
              href={PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md
                         text-xs font-medium mono border border-[var(--border)]
                         text-[var(--text-muted)] hover:text-[var(--accent)]
                         hover:border-[var(--border-accent)] transition-colors"
            >
              <ExternalLink size={12} strokeWidth={1.6} />
              Open in tab
            </a>

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

      {/* ── Viewer ── */}
      <main
        className="flex-1 flex flex-col items-center justify-start
                   py-8 px-4"
        style={{ background: 'var(--bg-2)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-4xl rounded-xl overflow-hidden
                     border border-[var(--card-border)]
                     shadow-[0_8px_40px_rgba(0,0,0,0.35)]"
        >
          <iframe
            src={`${PDF_URL}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
            className="w-full block"
            style={{ height: '88vh', minHeight: '600px', border: 'none' }}
            title="Abdullah Shahid Resume"
          />
        </motion.div>

        {/* Fallback message for browsers that block iframes for PDFs */}
        <p className="mono text-[var(--text-faint)] mt-4 text-center"
           style={{ fontSize: '0.65rem' }}>
          If the preview doesn&apos;t load,&nbsp;
          <a href={PDF_URL} download className="text-[var(--accent)] hover:underline">
            download the PDF
          </a>
          &nbsp;or&nbsp;
          <a href={PDF_URL} target="_blank" rel="noopener noreferrer"
             className="text-[var(--accent)] hover:underline">
            open in a new tab
          </a>.
        </p>
      </main>
    </div>
  );
}
