const links = [
  { label: 'Experience', href: '#experience' },
  { label: 'Devices', href: '#devices' },
  { label: 'Journey', href: '#journey' },
  { label: 'Specialties', href: '#triage' },
  { label: 'Features', href: '#features' },
  { label: 'Trust', href: '#trust' },
];

export function Navigation() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/8 bg-ink/55 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#top" className="font-display text-lg font-bold uppercase tracking-[0.24em] text-white">
          SmartCare<span className="text-medical-500">AI</span>
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-white/72 transition hover:text-medical-500"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#final-cta"
          className="rounded-full border border-medical-500/45 bg-medical-500/10 px-4 py-2 text-sm font-bold text-medical-300 transition hover:bg-medical-500 hover:text-ink"
        >
          Get Demo
        </a>
      </div>
    </header>
  );
}
