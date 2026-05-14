/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sdsu: {
          red: '#CC0033',
          dark: '#8B0022',
          light: '#ff1a4d',
        },
      },
    },
  },
  plugins: [],
};
