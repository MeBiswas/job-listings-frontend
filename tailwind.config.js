/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#F5F4EF',
          dark: '#14171C',
        },
        panel: {
          DEFAULT: '#FFFFFF',
          dark: '#1B1F27',
        },
        ink: {
          DEFAULT: '#1B2430',
          soft: '#5B6472',
          dark: '#E7E6E1',
          'dark-soft': '#9AA2AF',
        },
        line: {
          DEFAULT: '#DAD6CB',
          dark: '#2B303A',
        },
        navy: {
          DEFAULT: '#1F3A5F',
          light: '#3F6BA6',
        },
        amber: {
          DEFAULT: '#D98A2B',
          soft: '#F4E3C8',
          'soft-dark': '#3A2E17',
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '2px',
      },
    },
  },
  plugins: [],
}
