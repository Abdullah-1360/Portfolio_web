export default function ParticleBackground() {
  return (
    <>
      {/* Dark mode background */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 pointer-events-none dark:block hidden"
        style={{
          background: `
            radial-gradient(ellipse 70% 45% at 15% 15%, rgba(218,54,51,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 85% 75%, rgba(240,136,62,0.06) 0%, transparent 55%),
            #0d1117
          `,
        }}
      />
      {/* Light mode background */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 pointer-events-none dark:hidden block"
        style={{
          background: `
            radial-gradient(ellipse 70% 45% at 15% 15%, rgba(188,76,0,0.04) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 85% 75%, rgba(188,76,0,0.03) 0%, transparent 55%),
            #ffffff
          `,
        }}
      />
    </>
  );
}
