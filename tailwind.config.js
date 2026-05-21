/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f3f9',
          100: '#d9e0f0',
          200: '#b3c1e0',
          300: '#8da2d1',
          400: '#6683c1',
          500: '#4064b2',
          600: '#1a2e6b',
          700: '#152455',
          800: '#0f1b40',
          900: '#0a112a',
        },
        gold: {
          50: '#fdf8ed',
          100: '#f9edcc',
          200: '#f2db99',
          300: '#ebc966',
          400: '#e4b733',
          500: '#c9a227',
          600: '#a17e1f',
          700: '#785b17',
          800: '#503810',
          900: '#282508',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
