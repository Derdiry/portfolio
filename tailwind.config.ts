import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg:             'var(--brand-bg)',
          surface:        'var(--brand-surface)',
          border:         'var(--brand-border)',
          accent:         'var(--brand-accent)',
          'accent-hover': 'var(--brand-accent-hover)',
          muted:          'var(--brand-muted)',
          subtle:         'var(--brand-subtle)',
          signal:         'var(--brand-signal)',
          'signal-hover': 'var(--brand-signal-hover)',
          emerald:        'var(--brand-emerald)',
          gold:           'var(--brand-gold)',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Syne', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'gradient-x':  'gradient-x 18s ease infinite',
        'fade-up':     'fade-up 0.6s ease forwards',
        'blink':       'blink 1s step-end infinite',
        'spin-slow':   'spin-ring 28s linear infinite',
        'float-a':     'float-a 9s ease-in-out infinite',
        'float-b':     'float-b 12s ease-in-out infinite',
        'float-c':     'float-c 7s ease-in-out infinite',
        'float-d':     'float-d 15s ease-in-out infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        'spin-ring': {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
        'float-a': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%':      { transform: 'translateY(-18px) rotate(6deg)' },
          '66%':      { transform: 'translateY(8px) rotate(-4deg)' },
        },
        'float-b': {
          '0%, 100%': { transform: 'translateY(0px) rotate(45deg)' },
          '50%':      { transform: 'translateY(-26px) rotate(52deg)' },
        },
        'float-c': {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%':      { transform: 'translateY(18px) scale(1.06)' },
        },
        'float-d': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg) scale(1)' },
          '25%':      { transform: 'translateY(-12px) rotate(-8deg) scale(1.04)' },
          '75%':      { transform: 'translateY(14px) rotate(5deg) scale(0.96)' },
        },
      },
      backgroundSize: {
        '300%': '300%',
      },
    },
  },
  plugins: [],
}

export default config
