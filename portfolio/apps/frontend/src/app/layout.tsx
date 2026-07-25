import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import Providers from '@/components/Providers';
import './globals.css';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const metadata: Metadata = {
  title: 'Abdullah Shahid — AI Automation Engineer & LLM Architect',
  description:
    'AI Automation Engineer specializing in LangGraph, Multi-Agent LLMs, MCP servers, self-healing infrastructure, and full-stack development. Cut operational overhead by 60% at HostBreak.',
  keywords: ['AI Automation Engineer', 'LLM Architect', 'LangGraph', 'LangChain', 'MCP Server', 'n8n', 'FastAPI', 'Node.js', 'Abdullah Shahid'],
  authors: [{ name: 'Abdullah Shahid' }],
  themeColor: '#090D16',
  openGraph: {
    title: 'Abdullah Shahid — AI Automation Engineer & LLM Architect',
    description: 'Building self-healing systems, multi-agent AI workflows, and resilient cloud automations.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Abdullah Shahid Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abdullah Shahid — AI Automation Engineer & LLM Architect',
    description: 'Building self-healing systems, multi-agent AI workflows, and resilient cloud automations.',
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
