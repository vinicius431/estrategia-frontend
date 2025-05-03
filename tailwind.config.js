/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#1D4ED8',     // Azul principal
        accent: '#22C55E',      // Verde sutil (para pequenos detalhes)
        darkbg: '#0d1b25',      // Cor do menu lateral
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}
