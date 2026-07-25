'use client';

import { useState, createContext, useContext, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Copy } from 'lucide-react';

interface ToastContextType {
  showToast: (message: string) => void;
  copyToClipboard: (text: string, label?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  const copyToClipboard = (text: string, label?: string) => {
    navigator.clipboard.writeText(text);
    showToast(label ? `Copied ${label} to clipboard!` : 'Copied to clipboard!');
  };

  return (
    <ToastContext.Provider value={{ showToast, copyToClipboard }}>
      {children}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 rounded-xl
                       bg-[var(--bg-2)] border border-[var(--border-accent)] shadow-2xl
                       flex items-center gap-2 text-xs font-semibold text-[var(--accent)]"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            <Check size={14} className="text-green-400" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
