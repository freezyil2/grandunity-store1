/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#a855f7',
          dark: '#7e22ce',
          light: '#c084fc',
          glow: '#d946ef',
        },
        bg: {
          base: '#0a0612',
          panel: '#140a1f',
          card: '#1a1029',
          border: '#2a1a3f',
        },
      },
      fontFamily: {
        display: ['Rubik', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 30px rgba(168, 85, 247, 0.45)',
        glowLg: '0 0 60px rgba(168, 85, 247, 0.55)',
      },
    },
  },
  plugins: [],
}
