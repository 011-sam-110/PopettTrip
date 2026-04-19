import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'earth-bg': '#f5f0eb',
        'earth-text': '#2c2c2c',
        moss: '#4a6741',
        gold: '#c9a84c',
        forest: '#2d5a27',
        fog: '#e8e2db',
        pebble: '#8a7968',
        terracotta: '#c47845',
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
