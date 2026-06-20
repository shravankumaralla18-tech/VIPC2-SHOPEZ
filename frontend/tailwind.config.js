/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#edd8ff',
          200: '#d9b6ff',
          300: '#c28eff',
          400: '#aa5eff',
          500: '#9333ea',
          600: '#7c22ce',
          700: '#6b21a8',
          800: '#581c87',
          900: '#431407',
        },
        dark: {
          50: '#f6f6f9',
          100: '#ececf3',
          200: '#d5d5e5',
          300: '#b1b1cc',
          400: '#8585ad',
          500: '#646492',
          600: '#4e4e78',
          700: '#3f3f62',
          800: '#343451',
          900: '#11111f',
          950: '#0a0a12',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
