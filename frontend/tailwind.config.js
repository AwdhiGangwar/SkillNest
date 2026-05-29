/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Clash Display'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        brand: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        accent: {
          DEFAULT: "#f97316",
          light: "#fed7aa",
          dark: "#c2410c",
        },
        // Light theme colors
        "light": {
          bg: "#ffffff",
          "bg-secondary": "#f8fafc",
          "bg-tertiary": "#f1f5f9",
          card: "#ffffff",
          border: "#e2e8f0",
          "border-light": "#f1f5f9",
          text: "#0f172a",
          "text-secondary": "#475569",
          "text-tertiary": "#64748b",
          hover: "#f1f5f9",
          "surface-hover": "#e2e8f0",
        },
        // Dark theme colors
        surface: {
          DEFAULT: "#0f1117",
          card: "#161b27",
          border: "#1e2738",
          hover: "#1a2030",
          text: "#e2e8f0",
          "text-secondary": "#a8aec9",
          "text-tertiary": "#788497",
        },
      },
      backgroundColor: {
        "light-theme": "hsl(0, 0%, 100%)",
        "dark-theme": "hsl(217, 19%, 7%)",
      },
      textColor: {
        "light-primary": "hsl(217, 33%, 6%)",
        "dark-primary": "hsl(220, 13%, 91%)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "mesh-gradient":
          "radial-gradient(at 40% 20%, hsla(210,100%,56%,0.08) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,0.05) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,0.02) 0px, transparent 50%)",
        "mesh-gradient-light":
          "radial-gradient(at 40% 20%, hsla(210,100%,56%,0.05) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,0.03) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,0.01) 0px, transparent 50%)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
        shimmer: "shimmer 2s infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: {
          from: { opacity: 0, transform: "translateY(16px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        slideIn: {
          from: { opacity: 0, transform: "translateX(-12px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [
    // Light mode utilities
    ({ addBase, addComponents, addUtilities, theme }) => {
      addBase({
        ":root": {
          "--color-bg": "#ffffff",
          "--color-bg-secondary": "#f8fafc",
          "--color-text": "#0f172a",
          "--color-text-secondary": "#475569",
        },
        "html.dark": {
          "--color-bg": "#0f1117",
          "--color-bg-secondary": "#161b27",
          "--color-text": "#e2e8f0",
          "--color-text-secondary": "#a8aec9",
        },
      });

      addComponents({
        ".btn-theme": {
          "@apply px-4 py-2 rounded-lg font-medium transition-colors duration-200": {},
        },
        ".btn-theme-primary": {
          "@apply btn-theme bg-brand-500 text-white hover:bg-brand-600 dark:hover:bg-brand-600": {},
        },
        ".btn-theme-secondary": {
          "@apply btn-theme bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-surface-card dark:text-surface-text dark:hover:bg-surface-hover": {},
        },
        ".card-theme": {
          "@apply bg-white dark:bg-surface-card border border-gray-200 dark:border-surface-border rounded-lg p-6 shadow-sm dark:shadow-lg": {},
        },
        ".text-theme": {
          "@apply text-gray-900 dark:text-surface-text": {},
        },
        ".text-theme-secondary": {
          "@apply text-gray-600 dark:text-surface-text-secondary": {},
        },
        ".bg-theme": {
          "@apply bg-white dark:bg-surface-card": {},
        },
        ".border-theme": {
          "@apply border-gray-200 dark:border-surface-border": {},
        },
        ".input-theme": {
          "@apply bg-white dark:bg-surface-card border border-gray-200 dark:border-surface-border text-gray-900 dark:text-surface-text placeholder-gray-500 dark:placeholder-surface-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-lg px-4 py-2": {},
        },
      });

      addUtilities({
        ".theme-transition": {
          "@apply transition-colors duration-200": {},
        },
        ".dark-bg": {
          "@apply dark:bg-surface-card": {},
        },
      });
    },
  ],
};

