'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Server, Clock, DollarSign, Zap, RefreshCw } from 'lucide-react';

export default function ROICalculator() {
  const [servers, setServers]               = useState(10000);
  const [ticketsPerServer, setTicketsPerServer] = useState(1.5);
  const [hourlyRate, setHourlyRate]         = useState(45);

  const totalTickets     = Math.round(servers * ticketsPerServer);
  const automatedTickets = Math.round(totalTickets * 0.60); // 60% reduction rate from HostBreak benchmark
  const hoursSaved       = Math.round(automatedTickets * 0.35); // ~21 mins saved per level-1 ticket
  const monthlySavings   = Math.round(hoursSaved * hourlyRate);
  const annualSavings    = monthlySavings * 12;

  const setPreset = (s: number, t: number) => {
    setServers(s);
    setTicketsPerServer(t);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-[var(--border-accent)] bg-[var(--card)] backdrop-blur-2xl p-6 md:p-8 shadow-2xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[var(--border)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-glow)] border border-[var(--border-accent)] text-xs font-semibold text-[var(--accent)] mb-2"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            <Calculator size={13} />
            INTERACTIVE ROI & AUTOMATION SAVINGS CALCULATOR
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-[var(--text)]"
              style={{ fontFamily: 'Archivo, sans-serif' }}>
            Quantify Server Automation Impact
          </h3>
          <p className="text-xs md:text-sm text-[var(--text-muted)] mt-1"
             style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Based on Abdullah's verified 60% operational overhead reduction benchmark at HostBreak.
          </p>
        </div>

        {/* Preset selector */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setPreset(1000, 1.2)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[var(--bg-3)] hover:bg-[var(--accent-glow)] text-[var(--text-muted)] hover:text-[var(--accent)] border border-[var(--border)] transition-all cursor-pointer"
          >
            Startup (1K)
          </button>
          <button
            onClick={() => setPreset(10000, 1.5)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[var(--accent-glow)] text-[var(--accent)] border border-[var(--border-accent)] shadow-sm cursor-pointer"
          >
            HostBreak Fleet (10K)
          </button>
          <button
            onClick={() => setPreset(35000, 2.0)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[var(--bg-3)] hover:bg-[var(--accent-glow)] text-[var(--text-muted)] hover:text-[var(--accent)] border border-[var(--border)] transition-all cursor-pointer"
          >
            Enterprise (35K)
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Sliders Controls */}
        <div className="space-y-6">
          {/* Slider 1: Managed Servers */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs md:text-sm">
              <span className="font-semibold text-[var(--text)] flex items-center gap-1.5"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                <Server size={15} className="text-[var(--accent)]" /> Managed Infrastructure Fleet
              </span>
              <span className="font-mono font-bold text-[var(--accent)] text-sm">
                {servers.toLocaleString()} Servers
              </span>
            </div>
            <input
              type="range" min="500" max="50000" step="500"
              value={servers}
              onChange={(e) => setServers(Number(e.target.value))}
              className="w-full h-2 bg-[var(--bg-3)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
            />
          </div>

          {/* Slider 2: Monthly Support Tickets Per Server */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs md:text-sm">
              <span className="font-semibold text-[var(--text)] flex items-center gap-1.5"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                <Zap size={15} className="text-[var(--accent)]" /> Tickets Per Server / Month
              </span>
              <span className="font-mono font-bold text-[var(--accent)] text-sm">
                {ticketsPerServer} tickets/srv
              </span>
            </div>
            <input
              type="range" min="0.5" max="4.0" step="0.1"
              value={ticketsPerServer}
              onChange={(e) => setTicketsPerServer(Number(e.target.value))}
              className="w-full h-2 bg-[var(--bg-3)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
            />
          </div>

          {/* Slider 3: Engineer Hourly Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs md:text-sm">
              <span className="font-semibold text-[var(--text)] flex items-center gap-1.5"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                <DollarSign size={15} className="text-[var(--accent)]" /> Avg Engineer Hourly Rate
              </span>
              <span className="font-mono font-bold text-[var(--accent)] text-sm">
                ${hourlyRate}/hr
              </span>
            </div>
            <input
              type="range" min="25" max="120" step="5"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className="w-full h-2 bg-[var(--bg-3)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
            />
          </div>
        </div>

        {/* Calculated Output Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[var(--bg-2)] border border-[var(--border)] space-y-1">
            <p className="mono text-[10px] text-[var(--text-faint)] uppercase">Automated Tickets / Mo</p>
            <p className="text-2xl md:text-3xl font-black text-[var(--accent)]"
               style={{ fontFamily: 'Archivo, sans-serif' }}>
              {automatedTickets.toLocaleString()}
            </p>
            <p className="text-[11px] text-[var(--text-muted)]">60% L1 Support Reduction</p>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-2)] border border-[var(--border)] space-y-1">
            <p className="mono text-[10px] text-[var(--text-faint)] uppercase">Engineering Hours Saved</p>
            <p className="text-2xl md:text-3xl font-black text-[var(--text)]"
               style={{ fontFamily: 'Archivo, sans-serif' }}>
              {hoursSaved.toLocaleString()} hrs
            </p>
            <p className="text-[11px] text-[var(--text-muted)]">Per month saved</p>
          </div>

          <div className="col-span-2 p-5 rounded-2xl bg-[var(--accent-glow)] border border-[var(--border-accent)] space-y-1 text-center">
            <p className="mono text-[11px] text-[var(--accent)] uppercase font-semibold">Estimated Annual Overhead Savings</p>
            <p className="text-3xl md:text-4xl font-black text-[var(--accent)]"
               style={{ fontFamily: 'Archivo, sans-serif' }}>
              ${annualSavings.toLocaleString()} <span className="text-sm font-normal text-[var(--text-muted)]">/ year</span>
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              Based on self-healing LLM & n8n workflow automation benchmarks
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
