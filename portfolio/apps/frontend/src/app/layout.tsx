import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { ThemeProvider } from 'next-themes';
import Providers from '@/components/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Abdullah Shahid — Flutter Developer',
  description:
    'Portfolio of Abdullah Shahid, a passionate Flutter developer specialising in cross-platform mobile apps, Firebase, and clean UI.',
  keywords: ['Flutter', 'Dart', 'Mobile Developer', 'Portfolio', 'Pakistan'],
  authors: [{ name: 'Abdullah Shahid' }],
  openGraph: {
    title: 'Abdullah Shahid — Flutter Developer',
    description: 'Cross-platform mobile apps, beautiful UI, clean code.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={GeistSans.variable}
      style={
        {
          '--font-geist-sans': GeistSans.style.fontFamily,
          '--font-jetbrains': "'JetBrains Mono', 'Fira Code', monospace",
        } as React.CSSProperties
      }
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
