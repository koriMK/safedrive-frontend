/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0E1F40',
        turquoise: '#2AD7A1',
      },
    },
  },
  plugins: [],
}