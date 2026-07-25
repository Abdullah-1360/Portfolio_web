'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Cpu, ArrowRight, Zap, RefreshCw, Layers } from 'lucide-react';

interface Provider {
  id: string;
  name: string;
  model: string;
  status: 'healthy' | 'outage' | 'ratelimit';
  costPer1k: string;
  avgLatency: string;
}

export default function LLMRouterSimulator() {
  const [providers, setProviders] = useState<Provider[]>([
    { id: 'openai',    name: 'OpenAI',          model: 'gpt-4o',          status: 'healthy', costPer1k: '$0.0050', avgLatency: '140ms' },
    { id: 'anthropic', name: 'Anthropic',       model: 'claude-3.5-sonnet', status: 'healthy', costPer1k: '$0.0030', avgLatency: '180ms' },
    { id: 'deepseek',  name: 'DeepSeek',        model: 'deepseek-r1',     status: 'healthy', costPer1k: '$0.00055', avgLatency: '210ms' },
    { id: 'ollama',    name: 'Local Ollama',    model: 'llama-3.2-8b',    status: 'healthy', costPer1k: '$0.0000', avgLatency: '85ms' },
  ]);

  const [simulating, setSimulating] = useState(false);
  const [logs, setLogs]             = useState<string[]>([]);
  const [selectedResult, setSelectedResult] = useState<{ provider: string; model: string; latency: string; cost: string } | null>(null);

  const toggleStatus = (id: string) => {
    setProviders((prev) =>
      prev.map((p) => {
        if (p.id === id && p.id !== 'ollama') {
          const nextStatus = p.status === 'healthy' ? 'outage' : p.status === 'outage' ? 'ratelimit' : 'healthy';
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  const runSimulation = () => {
    setSimulating(true);
    setLogs(['[ROUTER INITIATED] Receiving high-priority HR candidate evaluation payload...']);
    setSelectedResult(null);

    setTimeout(() => {
      let activeProvider: Provider | null = null;
      const newLogs: string[] = ['[ROUTER INITIATED] Receiving high-priority HR candidate evaluation payload...'];

      for (const p of providers) {
        if (p.status === 'healthy') {
          newLogs.push(`  ├─ Testing Primary Target [${p.name} / ${p.model}]... OK [OK]`);
          activeProvider = p;
          break;
        } else if (p.status === 'outage') {
          newLogs.push(`  ├─ Target [${p.name}] Returned HTTP 503 Service Unavailable [FAIL] -> Bypassing...`);
        } else if (p.status === 'ratelimit') {
          newLogs.push(`  ├─ Target [${p.name}] Returned HTTP 429 Rate Limit Exceeded [WARN] -> Bypassing...`);
        }
      }

      if (!activeProvider) {
        activeProvider = providers.find((p) => p.id === 'ollama')!;
        newLogs.push(`  └─ Shifting to Local Edge Backup [Ollama / Llama 3.2]... OK [OK]`);
      } else {
        newLogs.push(`  └─ [ROUTER SUCCESS] Request fulfilled by ${activeProvider.name} (${activeProvider.model})`);
      }

      setLogs(newLogs);
      setSelectedResult({
        provider: activeProvider.name,
        model: activeProvider.model,
        latency: activeProvider.avgLatency,
        cost: activeProvider.costPer1k,
      });
      setSimulating(false);
    }, 600);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-[var(--border-accent)] bg-[var(--card)] backdrop-blur-2xl p-6 md:p-8 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-glow)] border border-[var(--border-accent)] text-xs font-semibold text-[var(--accent)] mb-2"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            <Layers size={13} />
            MULTI-LLM OUTAGE & FALLBACK ROUTER SIMULATOR
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-[var(--text)]"
              style={{ fontFamily: 'Archivo, sans-serif' }}>
            Test Zero-Downtime Multi-Provider Fallback Logic
          </h3>
          <p className="text-xs md:text-sm text-[var(--text-muted)] mt-1"
             style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Click provider badges below to simulate real-world API outages (503 / 429) and watch the router re-route traffic dynamically.
          </p>
        </div>

        <button
          onClick={runSimulation}
          disabled={simulating}
          className="btn-primary shrink-0 self-start md:self-auto cursor-pointer"
        >
          {simulating ? <RefreshCw size={15} className="animate-spin" /> : <Zap size={15} />}
          {simulating ? 'Routing Request...' : 'Simulate API Request'}
        </button>
      </div>

      {/* Provider Status Toggles Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {providers.map((p) => {
          const isOllama = p.id === 'ollama';
          return (
            <div
              key={p.id}
              onClick={() => !isOllama && toggleStatus(p.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
                p.status === 'healthy'
                  ? 'bg-[var(--bg-2)] border-green-500/40 hover:border-green-500'
                  : p.status === 'outage'
                  ? 'bg-red-500/10 border-red-500/50 text-red-300'
                  : 'bg-yellow-500/10 border-yellow-500/50 text-yellow-300'
              } ${isOllama ? 'cursor-default opacity-90' : ''}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs text-[var(--text)]" style={{ fontFamily: 'Archivo, sans-serif' }}>
                  {p.name}
                </span>
                <span className={`w-2.5 h-2.5 rounded-full ${
                  p.status === 'healthy' ? 'bg-green-500 animate-pulse' :
                  p.status === 'outage' ? 'bg-red-500' : 'bg-yellow-500'
                }`} />
              </div>
              <p className="mono text-[10px] text-[var(--text-faint)] truncate mb-2">{p.model}</p>
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className={`px-1.5 py-0.5 rounded font-semibold ${
                  p.status === 'healthy' ? 'bg-green-500/10 text-green-400' :
                  p.status === 'outage' ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'
                }`}>
                  {isOllama ? 'FALLBACK' : p.status.toUpperCase()}
                </span>
                <span className="text-[var(--text-muted)]">{p.avgLatency}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Execution Trace & Result Display */}
      <div className="grid md:grid-cols-[1fr_260px] gap-4">
        {/* Terminal Trace */}
        <div className="p-4 rounded-2xl bg-[var(--bg-2)] border border-[var(--border)] font-mono text-xs space-y-1.5 h-[160px] overflow-y-auto"
             style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          <p className="text-[10px] text-[var(--text-faint)] uppercase tracking-wider mb-2">Live Routing Log Output:</p>
          {logs.length === 0 ? (
            <p className="text-[var(--text-faint)] italic">Click "Simulate API Request" above to test dynamic fallback routing...</p>
          ) : (
            logs.map((l, i) => (
              <p key={i} className={`leading-relaxed ${
                l.includes('503') || l.includes('429') ? 'text-red-400' :
                l.includes('OK') ? 'text-green-400 font-semibold' : 'text-[var(--text-muted)]'
              }`}>
                {l}
              </p>
            ))
          )}
        </div>

        {/* Selected Result Box */}
        <div className="p-4 rounded-2xl bg-[var(--accent-glow)] border border-[var(--border-accent)] flex flex-col justify-between">
          <div>
            <p className="mono text-[10px] text-[var(--accent)] uppercase font-semibold mb-2">Fulfilled Provider</p>
            {selectedResult ? (
              <div className="space-y-1">
                <p className="text-lg font-bold text-[var(--text)]">{selectedResult.provider}</p>
                <p className="mono text-xs text-[var(--accent)] font-semibold">{selectedResult.model}</p>
              </div>
            ) : (
              <p className="text-xs text-[var(--text-faint)]">Awaiting routing run...</p>
            )}
          </div>

          {selectedResult && (
            <div className="pt-3 border-t border-[var(--border-accent)] flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-[var(--text-faint)] block text-[10px]">LATENCY</span>
                <span className="text-[var(--text)] font-semibold">{selectedResult.latency}</span>
              </div>
              <div>
                <span className="text-[var(--text-faint)] block text-[10px]">EST. COST</span>
                <span className="text-[var(--accent)] font-semibold">{selectedResult.cost}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
