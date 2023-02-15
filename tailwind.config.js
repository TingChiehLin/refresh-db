/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#53684D",
        secondary: "#758245",
        third: "#E1D286",
      },
      backgroundColor: ["active"],
    },
  },
  plugins: [],
};
