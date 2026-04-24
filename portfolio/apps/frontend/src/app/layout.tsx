import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { ThemeProvider } from 'next-themes';
import Providers from '@/components/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Abdullah Shahid — AI Automation Engineer',
  description:
    'AI Automation Engineer specializing in LLM integrations, n8n workflows, self-healing infrastructure, and full-stack development. Reduced operational overhead by 60% at HostBreak.',
  keywords: ['AI Engineer', 'Automation', 'n8n', 'LLM', 'MCP', 'Node.js', 'NestJS', 'Portfolio'],
  authors: [{ name: 'Abdullah Shahid' }],
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'Abdullah Shahid — AI Automation Engineer',
    description: 'Building self-healing systems, LLM integrations, and intelligent automations.',
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
