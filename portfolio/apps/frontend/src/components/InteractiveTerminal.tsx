'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal as TerminalIcon, Play, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

interface CommandOutput {
  command: string;
  output: string[];
  status?: 'success' | 'error' | 'info';
  timestamp: string;
}

const PRESET_COMMANDS = [
  { cmd: 'hr-ai --demo', label: 'Run HR AI Agent Demo' },
  { cmd: 'mcp-server status', label: 'MCP Server Status' },
  { cmd: 'n8n-workflow list', label: 'Self-Healing Workflows' },
  { cmd: 'metrics', label: 'HostBreak Impact Metrics' },
  { cmd: 'help', label: 'Help' },
];

export default function InteractiveTerminal() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      command: 'system --init',
      output: [
        '🚀 Abdullah Shahid Interactive CLI Sandbox v2.4',
        'Type "help" or click any shortcut button below to execute automated workflows.',
      ],
      status: 'info',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [isExecuting, setIsExecuting] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isExecuting]);

  const runCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed || isExecuting) return;

    if (trimmed.toLowerCase() === 'clear') {
      setHistory([]);
      setInput('');
      return;
    }

    setIsExecuting(true);
    setInput('');

    const newTime = new Date().toLocaleTimeString();

    let responseLines: string[] = [];
    let status: 'success' | 'error' | 'info' = 'success';

    switch (trimmed.toLowerCase()) {
      case 'hr-ai --demo':
        responseLines = [
          '⚡ Initiating HR AI Agent Multi-Agent LangGraph Pipeline...',
          '  └─ [AGENT 1] Screening Agent: Extracting candidate metrics & tech stack...',
          '  └─ [AGENT 2] Eval Agent: Checking project complexity (LangGraph, MCP, FastAPI)...',
          '  └─ [ROUTER] Primary Provider (OpenAI GPT-4o): OK (140ms, 412 tokens)',
          '  └─ [AGENT 3] Final Decision Engine: Candidate recommended for Lead AI Architect role.',
          'STATUS: ✅ Workflow completed in 0.42s | Match Score: 98.4%',
        ];
        break;

      case 'mcp-server status':
        responseLines = [
          '🖥️  Model Context Protocol (MCP) Server Health Dashboard:',
          '  ├── postgres-mcp-server   🟢 ONLINE  (Latency: 12ms | Active Conns: 14)',
          '  ├── github-ci-mcp-server   🟢 ONLINE  (Sync: Instant | Events: 1,420/day)',
          '  └── n8n-infra-mcp-bridge   🟢 ONLINE  (Self-Healing: Active)',
          'ALL SYSTEMS OPERATIONAL (3/3 Services Healthy)',
        ];
        break;

      case 'n8n-workflow list':
        responseLines = [
          '🔄 Active n8n Autonomous Infrastructure Workflows:',
          '  [WF-01] Auto-Remediation: Detect 5xx spikes -> Reboot pod -> Alert Slack (Execs: 4,120)',
          '  [WF-02] Backup Sync: Snapshot PG database to GCS bucket every 6h (Status: Pass)',
          '  [WF-03] Stealth DevOps: Auto-sync Git commit metrics to Portfolio DB (Status: Active)',
        ];
        break;

      case 'metrics':
        responseLines = [
          '📈 HostBreak Engineering Impact Metrics:',
          '  • Operational Overhead Cut: 60%',
          '  • Infrastructure Scale: 10,000+ Servers Self-Healed',
          '  • L1 Support Escalation Reduction: 40% Faster Support Resolution',
          '  • LLM Cost Efficiency: 34% Saved via Dynamic Provider Fallback Router',
        ];
        break;

      case 'help':
        responseLines = [
          'Available commands:',
          '  hr-ai --demo        Execute HR AI Agent LangGraph workflow simulation',
          '  mcp-server status   View real-time MCP server infrastructure health',
          '  n8n-workflow list   List automated self-healing workflows',
          '  metrics             View HostBreak engineering achievement metrics',
          '  contact             Display email, GitHub & LinkedIn links',
          '  clear               Clear terminal history',
        ];
        status = 'info';
        break;

      case 'contact':
        responseLines = [
          '📬 Contact Information:',
          '  • Email:    abdullah.shahid@example.com',
          '  • GitHub:   https://github.com/abdullah-shahid',
          '  • LinkedIn: https://linkedin.com/in/abdullah-shahid',
        ];
        break;

      default:
        responseLines = [
          `bash: command not found: "${trimmed}".`,
          'Type "help" to view available portfolio CLI commands.',
        ];
        status = 'error';
        break;
    }

    setTimeout(() => {
      setHistory((prev) => [
        ...prev,
        { command: trimmed, output: responseLines, status, timestamp: new Date().toLocaleTimeString() },
      ]);
      setIsExecuting(false);
    }, 350);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') runCommand(input);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border border-[var(--border-accent)] bg-[var(--bg-2)]/90 backdrop-blur-xl shadow-2xl">
      {/* Terminal Titlebar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--bg-3)]/80 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-2 text-xs font-semibold text-[var(--text-muted)] flex items-center gap-1.5"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            <TerminalIcon size={13} className="text-[var(--accent)]" />
            abdullah@portfolio-cli:~
          </span>
        </div>
        <button
          onClick={() => setHistory([])}
          className="text-xs text-[var(--text-faint)] hover:text-red-400 flex items-center gap-1 transition-colors"
          title="Clear terminal"
        >
          <Trash2 size={12} /> Clear
        </button>
      </div>

      {/* Shortcut Buttons */}
      <div className="px-4 py-2.5 bg-[var(--bg-2)] border-b border-[var(--border)] flex flex-wrap gap-2 items-center">
        <span className="text-[11px] font-semibold text-[var(--text-faint)] mr-1"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          Shortcuts:
        </span>
        {PRESET_COMMANDS.map((p) => (
          <button
            key={p.cmd}
            onClick={() => runCommand(p.cmd)}
            disabled={isExecuting}
            className="px-2.5 py-1 rounded-lg text-xs font-mono bg-[var(--accent-glow)] border border-[var(--border-accent)]
                       text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
          >
            <Play size={10} /> {p.cmd}
          </button>
        ))}
      </div>

      {/* Terminal Body */}
      <div className="p-4 md:p-6 h-[340px] overflow-y-auto font-mono text-xs md:text-sm space-y-4"
           style={{ fontFamily: 'JetBrains Mono, monospace' }}>
        {history.map((h, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex items-center gap-2 text-[var(--text-muted)]">
              <span className="text-[var(--accent)] font-bold">abdullah@portfolio:~$</span>
              <span className="text-[var(--text)] font-semibold">{h.command}</span>
              <span className="text-[10px] text-[var(--text-faint)] ml-auto">{h.timestamp}</span>
            </div>
            <div className={`pl-4 border-l-2 space-y-1 ${
              h.status === 'error' ? 'border-red-500/60 text-red-300' :
              h.status === 'info' ? 'border-blue-500/60 text-blue-300' :
              'border-[var(--border-accent)] text-[var(--text-muted)]'
            }`}>
              {h.output.map((line, idx) => (
                <p key={idx} className="leading-relaxed">{line}</p>
              ))}
            </div>
          </div>
        ))}

        {isExecuting && (
          <div className="flex items-center gap-2 text-[var(--accent)] animate-pulse">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
            <span>Executing command...</span>
          </div>
        )}

        {/* Command Line Prompt */}
        <div className="flex items-center gap-2 pt-2">
          <span className="text-[var(--accent)] font-bold shrink-0">abdullah@portfolio:~$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isExecuting}
            placeholder="Type 'help' or any command..."
            className="flex-1 bg-transparent text-[var(--text)] outline-none border-none font-mono text-xs md:text-sm focus:ring-0"
            autoFocus
          />
        </div>
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
}
