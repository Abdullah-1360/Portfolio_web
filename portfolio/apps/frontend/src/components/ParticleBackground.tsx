'use client';

import { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; o: number; hue: number }[] = [];
    const N = 50;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    for (let i = 0; i < N; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.2 + 0.4,
        o: Math.random() * 0.3 + 0.07,
        hue: Math.random() * 30 + 15, // warm sunset orange range
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},90%,55%,${p.o})`;
        ctx.fill();
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(240,136,62,${0.04 * (1 - d / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <>
      {/* Dark aurora gradient */}
      <div aria-hidden="true" className="fixed inset-0 -z-20 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 100% 60% at 10% 0%,   rgba(240,136,62,0.08) 0%, transparent 55%),
            radial-gradient(ellipse 70%  55% at 90% 90%,  rgba(234,88,12,0.06)  0%, transparent 50%),
            radial-gradient(ellipse 55%  45% at 50% 50%,  rgba(251,146,60,0.04) 0%, transparent 60%),
            #090D16
          `,
        }}
      />
      <canvas ref={canvasRef} aria-hidden="true"
        className="fixed inset-0 -z-10 pointer-events-none opacity-60" />
    </>
  );
}
