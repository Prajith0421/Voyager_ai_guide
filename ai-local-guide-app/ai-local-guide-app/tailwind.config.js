/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: {
          950: '#0a0f1e',
          900: '#0f1729',
          800: '#152238',
          700: '#1c2d4a',
        },
        accent: {
          violet: '#8b5cf6',
          blue: '#3b82f6',
          teal: '#2dd4bf',
          sunset: '#fb923c',
        },
      },
      boxShadow: {
        glass: '0 8px 32px rgba(15, 23, 42, 0.45), inset 0 1px 0 rgba(255,255,255,0.08)',
        'glass-lg': '0 24px 64px rgba(15, 23, 42, 0.55), inset 0 1px 0 rgba(255,255,255,0.1)',
        float: '0 20px 50px -12px rgba(15, 23, 42, 0.65)',
        glow: '0 0 48px rgba(99, 102, 241, 0.2)',
        'glow-teal': '0 0 40px rgba(45, 212, 191, 0.15)',
        'glow-sunset': '0 0 36px rgba(251, 146, 60, 0.12)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'app-mesh': 'linear-gradient(135deg, #0f1729 0%, #152238 40%, #1a1040 100%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out',
        'pulse-soft': 'pulseSoft 2.5s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
