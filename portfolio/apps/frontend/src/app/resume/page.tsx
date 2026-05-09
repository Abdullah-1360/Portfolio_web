import dynamic from 'next/dynamic';

// react-pdf uses canvas — must be client-only, no SSR
const ResumeViewer = dynamic(() => import('@/components/ResumeViewer'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center"
         style={{ background: 'var(--bg)' }}>
      <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent
                      rounded-full animate-spin" />
    </div>
  ),
});

export default function ResumePage() {
  return <ResumeViewer />;
}
