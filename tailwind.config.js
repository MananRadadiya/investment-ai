/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0b0f14',
        surface: 'rgba(255, 255, 255, 0.04)',
        'surface-hover': 'rgba(255, 255, 255, 0.065)',
        'surface-active': 'rgba(255, 255, 255, 0.08)',
        accent: '#4f8cff',
        'accent-soft': 'rgba(79, 140, 255, 0.12)',
        green: '#22c55e',
        'green-soft': 'rgba(34, 197, 94, 0.12)',
        red: '#ef4444',
        'red-soft': 'rgba(239, 68, 68, 0.12)',
        amber: '#f59e0b',
        'text-primary': '#e6edf3',
        'text-secondary': '#b1bac4',
        'text-muted': '#8b949e',
        'text-dim': '#484f58',
        border: 'rgba(255, 255, 255, 0.06)',
        'border-hover': 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      animation: {
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.8s ease-in-out infinite',
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
    },
  },
  plugins: [],
}
