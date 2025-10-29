/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#0066CC',
        'secondary-blue': '#004C99',
        'light-blue': '#E6F2FF',
      },
    },
  },
  plugins: [],
}
