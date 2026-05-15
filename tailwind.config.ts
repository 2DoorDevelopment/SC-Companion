import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-void': 'var(--bg-void)',
        'bg-panel': 'var(--bg-panel)',
        'bg-elevated': 'var(--bg-elevated)',
        'border-subtle': 'var(--border-subtle)',
        'border-active': 'var(--border-active)',
        'accent-cyan': 'var(--accent-cyan)',
        'accent-cyan-dim': 'var(--accent-cyan-dim)',
        'accent-glow': 'var(--accent-glow)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-disabled': 'var(--text-disabled)',
        'status-ready': 'var(--status-ready)',
        'status-delivery': 'var(--status-delivery)',
        'status-destroyed': 'var(--status-destroyed)',
        'status-stored': 'var(--status-stored)',
      },
      fontFamily: {
        aldrich: ['Aldrich', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config
