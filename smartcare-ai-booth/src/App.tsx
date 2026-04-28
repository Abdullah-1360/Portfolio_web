import { useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Scene } from './components/three/Scene';
import { Navigation } from './components/ui/Navigation';
import { Hero } from './components/sections/Hero';
import { DeviceShowcase } from './components/sections/DeviceShowcase';
import { PatientJourney } from './components/sections/PatientJourney';
import { SpecialtyTriage } from './components/sections/SpecialtyTriage';
import { Features } from './components/sections/Features';
import { TrustSection } from './components/sections/TrustSection';
import { FinalCTA } from './components/sections/FinalCTA';
import { useMediaQuery } from './hooks/useMediaQuery';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const isMobile = useMediaQuery('(max-width: 767px)');

  useLayoutEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'max',
      onUpdate: (self: ScrollTrigger) => {
        setScrollProgress(self.progress);
      },
    });

    ScrollTrigger.refresh();

    return () => trigger.kill();
  }, []);

  return (
    <div id="top" className="relative min-h-screen overflow-x-hidden bg-slate-950 text-white">
      {!isMobile ? (
        <Scene scrollProgress={scrollProgress} />
      ) : (
        <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.05)_1px,transparent_1px)] bg-[size:56px_56px] opacity-25" />
        </div>
      )}

      <Navigation />

      <main className="relative z-10">
        <Hero />
        <DeviceShowcase />
        <PatientJourney />
        <SpecialtyTriage />
        <Features />
        <TrustSection />
        <FinalCTA />
      </main>
    </div>
  );
}

export default App;
