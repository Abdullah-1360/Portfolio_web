import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import Providers from '@/components/Providers';
import './globals.css';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const metadata: Metadata = {
  title: 'Abdullah Shahid — AI Automation Engineer',
  description:
    'AI Automation Engineer specializing in LLM integrations, n8n workflows, self-healing infrastructure, and full-stack development. Reduced operational overhead by 60% at HostBreak.',
  keywords: ['AI Engineer', 'Automation', 'n8n', 'LLM', 'MCP', 'Node.js', 'NestJS', 'Portfolio'],
  authors: [{ name: 'Abdullah Shahid' }],
  openGraph: {
    title: 'Abdullah Shahid — AI Automation Engineer',
    description: 'Building self-healing systems, LLM integrations, and intelligent automations.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href={`${BASE}/favicon.svg`} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ThemeProvider attribute="class" forcedTheme="dark" defaultTheme="dark" enableSystem={false}>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
