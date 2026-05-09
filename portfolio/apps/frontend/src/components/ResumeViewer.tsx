'use client';

import { useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { motion, AnimatePresence } from 'motion/react';
import {
  Download, ArrowLeft, ExternalLink,
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut,
} from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc =
  `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const BASE     = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const PDF_URL  = `${BASE}/resume.pdf`;
const HOME_URL = BASE ? `${BASE}/` : '/';

export default function ResumeViewer() {
  const [numPages, setNumPages] = useState(0);
  const [pageNum, setPageNum]   = useState(1);
  const [scale, setScale]       = useState(1.2);
  const [loading, setLoading]   = useState(true);

  const onLoad = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
  }, []);

  const prev    = () => setPageNum(p => Math.max(1, p - 1));
  const next    = () => setPageNum(p => Math.min(numPages, p + 1));
  const zoomIn  = () => setScale(s => Math.min(2.0, +(s + 0.15).toFixed(2)));
  const zoomOut = () => setScale(s => Math.max(0.6, +(s - 0.15).toFixed(2)));

  const iconBtn = `w-7 h-7 rounded-md border border-[var(--border)] flex items-center
    justify-center text-[var(--text-faint)] hover:text-[var(--accent)]
    hover:border-[var(--border-accent)] disabled:opacity-30 transition-colors`;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)]
                         bg-[var(--bg)]/95 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-14
                        flex items-center justify-between gap-3">

          {/* Back */}
          <a href={HOME_URL}
             className="flex items-center gap-2 text-sm font-medium shrink-0
                        text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
            <ArrowLeft size={15} strokeWidth={1.6} />
            <span className="hidden sm:inline">Back to Portfolio</span>
          </a>

          {/* Page + zoom controls */}
          {numPages > 0 && (
            <div className="flex items-center gap-1.5">
              <button onClick={prev} disabled={pageNum <= 1} className={iconBtn}>
                <ChevronLeft size={13} />
              </button>
              <span className="mono text-[var(--text-muted)] w-14 text-center"
                    style={{ fontSize: '0.68rem' }}>
                {pageNum} / {numPages}
              </span>
              <button onClick={next} disabled={pageNum >= numPages} className={iconBtn}>
                <ChevronRight size={13} />
              </button>

              <div className="w-px h-4 bg-[var(--border)] mx-1" />

              <button onClick={zoomOut} className={iconBtn}><ZoomOut size={13} /></button>
              <span className="mono text-[var(--text-faint)] w-9 text-center"
                    style={{ fontSize: '0.65rem' }}>
                {Math.round(scale * 100)}%
              </span>
              <button onClick={zoomIn} className={iconBtn}><ZoomIn size={13} /></button>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <a href={PDF_URL} target="_blank" rel="noopener noreferrer"
               className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md
                          text-xs font-medium mono border border-[var(--border)]
                          text-[var(--text-muted)] hover:text-[var(--accent)]
                          hover:border-[var(--border-accent)] transition-colors">
              <ExternalLink size={12} strokeWidth={1.6} />
              Open in tab
            </a>
            <motion.a href={PDF_URL} download="Abdullah_Shahid_Resume.pdf"
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5">
              <Download size={13} strokeWidth={1.8} />
              Download
            </motion.a>
          </div>
        </div>
      </header>

      {/* ── Canvas viewer ── */}
      <main className="flex-1 flex flex-col items-center py-10 px-4"
            style={{ background: 'var(--bg-2)' }}>

        {/* Loading skeleton */}
        {loading && (
          <div className="w-full max-w-2xl rounded-xl border border-[var(--card-border)]
                          bg-[var(--card)] animate-pulse" style={{ height: '80vh' }} />
        )}

        <Document
          file={PDF_URL}
          onLoadSuccess={onLoad}
          onLoadError={() => setLoading(false)}
          loading={null}
          className="flex flex-col items-center"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={pageNum}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl overflow-hidden
                         shadow-[0_8px_48px_rgba(0,0,0,0.35)]
                         border border-[var(--card-border)]"
            >
              <Page
                pageNumber={pageNum}
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={false}
              />
            </motion.div>
          </AnimatePresence>
        </Document>

        {/* Mobile page nav */}
        {numPages > 1 && (
          <div className="flex items-center gap-4 mt-8">
            <button onClick={prev} disabled={pageNum <= 1}
                    className="btn-outline py-2 px-5 text-sm disabled:opacity-30">
              ← Prev
            </button>
            <span className="mono text-[var(--text-faint)]" style={{ fontSize: '0.7rem' }}>
              {pageNum} of {numPages}
            </span>
            <button onClick={next} disabled={pageNum >= numPages}
                    className="btn-outline py-2 px-5 text-sm disabled:opacity-30">
              Next →
            </button>
          </div>
        )}

        <div className="h-10" />
      </main>
    </div>
  );
}
