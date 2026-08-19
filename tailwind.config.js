/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#f20606',
          'red-dark': '#d40505',
          green: '#3fef09',
          lime: '#C8FF55',
          black: '#000000',
          dark: '#111111',
          gray: {
            light: '#f4f4f4',
            bg: '#ecf0f1',
            text: '#666666',
            border: '#e2e8f0',
          }
        },
        primary: {
          DEFAULT: '#f20606',
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#3fef09',
          label: '#C8FF55',
        }
      },
      fontFamily: {
        sans: ['"Public Sans"', 'sans-serif', 'system-ui'],
      },
      borderRadius: {
        'brand': '4px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        'modal': '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
        'dropdown': '0 4px 12px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
