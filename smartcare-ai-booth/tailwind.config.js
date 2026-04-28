/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        medical: {
          950: '#06101d',
          900: '#0a1628',
          800: '#0f2137',
          700: '#1a365d',
          500: '#00d4ff',
          400: '#5ce1e6',
          300: '#a5f3fc',
        },
        ink: '#07111f',
        mist: '#edf6ff',
        pulse: '#7cf5d5',
        coral: '#ff8f70',
        glacier: '#87bdfd',
        cloud: '#f7fbff',
      },
      boxShadow: {
        halo: '0 30px 80px rgba(7, 17, 31, 0.24)',
        cyan: '0 30px 80px rgba(0, 212, 255, 0.14)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Manrope"', 'sans-serif'],
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'medical-glow': 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(10, 22, 40, 0) 100%)',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100vh)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.45', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.05)' },
        },
      },
      animation: {
        scan: 'scan 8s linear infinite',
        float: 'float 6s ease-in-out infinite',
        pulseGlow: 'pulseGlow 3.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
