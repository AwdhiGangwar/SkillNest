// src/components/ThemeToggle.jsx
import React from "react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-12 h-6 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 flex items-center p-1 transition-all hover:scale-105"
      title="Toggle Theme"
    >
      <div
        className={`w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center transition-transform duration-300 ${isDark ? "translate-x-0" : "translate-x-6"
          }`}
      >
        {isDark ? "🌙" : "☀️"}
      </div>
    </button>
  );
}