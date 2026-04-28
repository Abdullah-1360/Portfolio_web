import type { ReactNode } from 'react';

type DeviceCardProps = {
  title: string;
  subtitle: string;
  metric: string;
  icon: ReactNode;
};

export function DeviceCard({ title, subtitle, metric, icon }: DeviceCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/6 p-6 shadow-cyan backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:border-medical-500/45">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(0,212,255,0.18),_transparent_42%)] opacity-0 transition duration-300 group-hover:opacity-100" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="mb-4 inline-flex rounded-2xl border border-white/12 bg-medical-500/10 p-3 text-medical-400">
            {icon}
          </div>
          <h3 className="font-display text-2xl font-bold text-white">{title}</h3>
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/70">{subtitle}</p>
        </div>
        <span className="rounded-full border border-medical-500/25 bg-ink/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-medical-300">
          {metric}
        </span>
      </div>
    </article>
  );
}
