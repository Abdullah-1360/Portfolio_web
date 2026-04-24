import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy:   { DEFAULT: '#0B1628', 800: '#0F1E35', 700: '#132440' },
        amber:  { DEFAULT: '#E8820C', dim: '#C46A08' },
        crimson:{ DEFAULT: '#A82020' },
        ink:    { DEFAULT: '#F0EDE8', muted: '#9AA3B0', faint: '#4E5A6A' },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'JetBrains Mono', 'monospace'],
      },
      animation: { float: 'float 6s ease-in-out infinite' },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
