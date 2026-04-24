export default function ParticleBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        background: `
          radial-gradient(ellipse 70% 45% at 15% 15%, rgba(168,32,32,0.08) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 85% 75%, rgba(232,130,12,0.07) 0%, transparent 55%),
          #0B1628
        `,
      }}
    />
  );
}
