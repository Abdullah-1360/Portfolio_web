'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Copy,
  MapPin,
  Mail,
  Loader2,
  Cpu,
  CornerDownLeft,
} from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { useToast } from './Toast';
import type { PersonalInfo } from '@/types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  provider?: string;
  model?: string;
  latencyMs?: number;
  tier?: string;
}

const INITIAL_PROMPTS = [
  'What systems did you build at HostBreak?',
  'Explain the HR_AI router architecture',
  'What is your experience with Ansible EDA?',
  'Are you available for new opportunities?',
];

export default function QuickContactFAB({ personalInfo }: { personalInfo: PersonalInfo }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'chat' | 'contact'>('chat');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hi there! I am Abdullah's personal AI representative, powered by our multi-provider LLM router. Ask me anything about my production work at HostBreak, LangGraph multi-agent architectures, or backend microservices!`,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { copyToClipboard } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (open && tab === 'chat') {
      scrollToBottom();
    }
  }, [messages, open, tab]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content }));

      const apiBase =
        process.env.NEXT_PUBLIC_API_URL ||
        (typeof window !== 'undefined' && window.location.hostname === 'localhost'
          ? 'http://localhost:4000/api'
          : 'https://portfolio-web-tau-ten-80.vercel.app/api');

      const res = await fetch(`${apiBase}/agent/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, history }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        provider: data.provider,
        model: data.model,
        tier: data.tier,
        latencyMs: data.latencyMs,
      };

      setMessages((prev) => [...prev, botMsg]);

      // Fire-and-forget: generate AI follow-up suggestions
      setSuggestLoading(true);
      setSuggestedQuestions([]);
      fetch(`${apiBase}/agent/suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lastUserMessage: query.slice(0, 500),
          lastAssistantReply: data.response.slice(0, 1000),
        }),
      })
        .then((r) => r.json())
        .then((d) => {
          if (Array.isArray(d.suggestions)) setSuggestedQuestions(d.suggestions.slice(0, 3));
        })
        .catch(() => {})
        .finally(() => setSuggestLoading(false));
    } catch {
      // Graceful offline fallback grounded strictly in resume data
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I'm Abdullah Shahid, AI Automation Engineer at HostBreak. I specialize in building autonomous self-healing platforms (managing 10,000+ servers), Model Context Protocol (MCP) servers, LangGraph multi-agent routing engines, and high-throughput Node.js/NestJS microservices. Feel free to reach me directly at ${personalInfo.email}!`,
        provider: 'offline-ground-truth',
        model: 'resume-engine',
        latencyMs: 12,
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        type="button"
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[var(--accent)] text-white
                   flex items-center gap-2.5 shadow-[0_8px_30px_rgba(240,136,62,0.45)]
                   border border-[var(--border-accent)] cursor-pointer font-medium text-sm group"
        aria-label="Chat with Abdullah's AI"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
        </span>
        {open ? (
          <>
            <X size={18} />
            <span>Close</span>
          </>
        ) : (
          <>
            <Bot size={18} />
            <span>Chat with AI</span>
          </>
        )}
      </motion.button>

      {/* Floating AI Agent & Contact Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[410px] h-[580px] max-h-[80vh]
                       rounded-2xl border border-[var(--border-accent)] bg-[var(--bg-2)]/95 backdrop-blur-2xl
                       shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-[var(--border)] bg-[var(--bg-3)]/60 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[var(--accent)]/15 border border-[var(--border-accent)] flex items-center justify-center text-[var(--accent)]">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[var(--text)] flex items-center gap-2" style={{ fontFamily: 'Archivo, sans-serif' }}>
                    Abdullah Shahid
                    <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      AI Agent
                    </span>
                  </h4>
                  <p className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
                    <Cpu size={11} className="text-[var(--accent)]" /> Multi-Provider Fallback Router
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-[var(--card)] text-[var(--text-muted)] hover:text-[var(--text)] flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="grid grid-cols-2 p-1.5 bg-[var(--card)] border-b border-[var(--border)] shrink-0 gap-1 text-xs font-medium">
              <button
                type="button"
                onClick={() => setTab('chat')}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  tab === 'chat'
                    ? 'bg-[var(--accent)] text-white shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                <Bot size={13} /> AI Digital Twin
              </button>
              <button
                type="button"
                onClick={() => setTab('contact')}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  tab === 'contact'
                    ? 'bg-[var(--accent)] text-white shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                <Mail size={13} /> Direct Contact
              </button>
            </div>

            {/* Body */}
            {tab === 'chat' ? (
              <div className="flex-1 flex flex-col min-h-0">
                {/* Message Stream */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {m.role === 'assistant' && (
                        <div className="w-6 h-6 rounded-lg bg-[var(--accent)]/15 border border-[var(--border-accent)] text-[var(--accent)] flex items-center justify-center shrink-0 mt-0.5">
                          <Bot size={13} />
                        </div>
                      )}
                      <div
                        className={`max-w-[82%] rounded-2xl p-3 leading-relaxed ${
                          m.role === 'user'
                            ? 'bg-[var(--accent)] text-white rounded-tr-none'
                            : 'bg-[var(--card)] border border-[var(--border)] text-[var(--text)] rounded-tl-none'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{m.content}</div>

                        {/* Telemetry Footer */}
                        {m.provider && (
                          <div className="mt-2 pt-1.5 border-t border-[var(--border)]/40 flex items-center justify-between text-[10px] text-[var(--text-faint)]">
                            <span className="mono">
                              {m.provider} / {m.model}
                            </span>
                            {m.latencyMs && <span>{m.latencyMs}ms</span>}
                          </div>
                        )}
                      </div>
                      {m.role === 'user' && (
                        <div className="w-6 h-6 rounded-lg bg-[var(--border)] text-[var(--text-muted)] flex items-center justify-center shrink-0 mt-0.5">
                          <User size={13} />
                        </div>
                      )}
                    </div>
                  ))}

                  {loading && (
                    <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] p-2 rounded-xl bg-[var(--card)] border border-[var(--border)] w-fit">
                      <Loader2 size={13} className="animate-spin text-[var(--accent)]" />
                      <span>Routing across provider graph...</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Question Chips: initial static → AI-generated after first reply */}
                {!loading && (suggestedQuestions.length > 0 || messages.length < 3) && (
                  <div className="p-2 border-t border-[var(--border)] flex gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
                    {suggestLoading ? (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-[var(--text-faint)]">
                        <Loader2 size={11} className="animate-spin text-[var(--accent)]" />
                        Thinking of follow-ups…
                      </div>
                    ) : suggestedQuestions.length > 0 ? (
                      suggestedQuestions.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => { setSuggestedQuestions([]); handleSend(prompt); }}
                          className="px-2.5 py-1 rounded-lg border border-[var(--border-accent)]/50 bg-[var(--accent)]/5 hover:bg-[var(--accent)]/15 hover:border-[var(--border-accent)] hover:text-[var(--accent)] text-[11px] whitespace-nowrap text-[var(--text-muted)] transition-all shrink-0 flex items-center gap-1"
                        >
                          <Sparkles size={9} className="text-[var(--accent)] shrink-0" />
                          {prompt}
                        </button>
                      ))
                    ) : (
                      INITIAL_PROMPTS.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => handleSend(prompt)}
                          className="px-2.5 py-1 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:border-[var(--border-accent)] hover:text-[var(--accent)] text-[11px] whitespace-nowrap text-[var(--text-muted)] transition-colors shrink-0"
                        >
                          {prompt}
                        </button>
                      ))
                    )}
                  </div>
                )}

                {/* Input Area */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="p-3 border-t border-[var(--border)] bg-[var(--bg-3)]/60 flex items-center gap-2 shrink-0"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask Abdullah's AI about projects or skills..."
                    className="flex-1 px-3 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] text-xs text-[var(--text)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--border-accent)] transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="w-8 h-8 rounded-xl bg-[var(--accent)] text-white flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-all shrink-0 cursor-pointer"
                  >
                    <Send size={13} />
                  </button>
                </form>
              </div>
            ) : (
              /* Contact Tab */
              <div className="p-5 space-y-4 flex-1 overflow-y-auto">
                <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-between gap-2">
                  <div className="truncate">
                    <span className="mono text-[10px] text-[var(--text-faint)] block">EMAIL</span>
                    <span className="text-xs font-semibold text-[var(--text)] truncate block">
                      {personalInfo.email}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(personalInfo.email, 'email')}
                    className="w-7 h-7 rounded-lg bg-[var(--accent-glow)] border border-[var(--border-accent)] text-[var(--accent)] flex items-center justify-center hover:bg-[var(--accent)] hover:text-white transition-all shrink-0"
                    title="Copy Email"
                  >
                    <Copy size={12} />
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-between gap-2">
                  <div className="truncate">
                    <span className="mono text-[10px] text-[var(--text-faint)] block">PHONE</span>
                    <span className="text-xs font-semibold text-[var(--text)] truncate block">
                      {personalInfo.phone}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(personalInfo.phone, 'phone')}
                    className="w-7 h-7 rounded-lg bg-[var(--accent-glow)] border border-[var(--border-accent)] text-[var(--accent)] flex items-center justify-center hover:bg-[var(--accent)] hover:text-white transition-all shrink-0"
                    title="Copy Phone"
                  >
                    <Copy size={12} />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                  <MapPin size={13} className="text-[var(--accent)] shrink-0" />
                  <span>{personalInfo.location}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <a
                    href={personalInfo.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs font-semibold text-[var(--text)] hover:border-[var(--border-accent)] hover:text-[var(--accent)] transition-all flex items-center justify-center gap-1.5"
                  >
                    <FaGithub size={13} /> GitHub
                  </a>
                  <a
                    href={personalInfo.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs font-semibold text-[var(--text)] hover:border-[var(--border-accent)] hover:text-[var(--accent)] transition-all flex items-center justify-center gap-1.5"
                  >
                    <FaLinkedin size={13} /> LinkedIn
                  </a>
                </div>

                <a
                  href={`mailto:${personalInfo.email}`}
                  className="btn-primary w-full justify-center text-xs py-2.5 cursor-pointer mt-4"
                >
                  <Mail size={14} /> Send Email Directly
                </a>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
