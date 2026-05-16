/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF4FA',
          100: '#DCEAF5',
          200: '#B9D5EB',
          300: '#96C0E1',
          400: '#73ABD7',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        }
      }
    },
  },
  plugins: [],
}
