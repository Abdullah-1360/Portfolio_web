import { Html } from '@react-three/drei';

export function LoadingScreen() {
  return (
    <Html center>
      <div className="rounded-[28px] border border-white/10 bg-ink/80 px-8 py-6 text-center shadow-halo backdrop-blur-xl">
        <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-white/15 border-t-medical-500" />
        <p className="mt-4 font-display text-base text-white/75">Rendering SmartCare scene...</p>
      </div>
    </Html>
  );
}
