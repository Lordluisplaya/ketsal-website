/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}','./components/**/*.{js,ts,jsx,tsx,mdx}','./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ketsal: {
          black: '#03030F',
          navy: '#0A0A3E',
          cobalt: '#1A1AE0',
          'cobalt-light': '#6B6BFF',
          gold: '#D4AF6A',
          surface: '#F5F5FC',
          muted: '#9090B8',
        },
      },
      fontFamily: {
        brand: ['Montserrat', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        brand: '0.12em',
        wide2: '0.08em',
      },
    },
  },
  plugins: [],
}