import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#5B5EFF',
        secondary: '#06D6A0',
        accent: '#FF6B6B',
        darkBg: '#0F172A',
        cardBg: '#1E293B',
      },
    },
  },
  plugins: [],
} satisfies Config
