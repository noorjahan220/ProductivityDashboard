/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#667eea',
          dark: '#764ba2',
        },
        secondary: {
          light: '#3b82f6',
          dark: '#1d4ed8',
        },
        background: {
          light: '#ffffff',
          dark: '#1f2937',
        },
        card: {
          light: 'rgba(255,255,255,0.95)',
          dark: 'rgba(31, 41, 55, 0.95)',
        },
      },
      boxShadow: {
        card: '0 20px 40px rgba(0,0,0,0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}