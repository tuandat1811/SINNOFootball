/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        pitch: {
          DEFAULT: "#166534",
          light: "#22c55e",
          dark: "#14532d",
        },
      },
    },
  },
  plugins: [],
};
