/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Clash Display'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        surface: {
          DEFAULT: "#0f1117",
          card: "#161b27",
          border: "#1e2738",
          hover: "#1a2030",
          text: "#e2e8f0",
          muted: "#94a3b8",
        },
        light: {
          bg: "#fdfaf5",
          "bg-secondary": "#f8f1e3",
          card: "#ffffff",
          border: "#e8d9c0",
          hover: "#f4e9d8",
          text: "#2c2218",
          "text-secondary": "#5c4a3f",
        },
        brand: {
          50: "#fff7ed",
          100: "#ffedd5",
          300: "#fdba74",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
        },
      },
    },
  },
  plugins: [],
};