// src/components/ThemeToggle.jsx
import React from "react";
import { useTheme } from "../context/ThemeContext";
import { SunMedium, MoonStarIcon } from "lucide-react";
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center gap-0.5 bg-white dark:bg-surface-card rounded-lg p-1 border border-gray-200 dark:border-surface-border shadow-sm">
      {/* Light Theme Button */}
      <button
        onClick={toggleTheme}
        title="Light theme"
        className={`
          flex items-center justify-center p-1.5 rounded-md transition-all duration-200
          ${theme === "light"
            ? "bg-brand-500 text-white shadow-md"
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-hover"
          }
        `}
      >
        <span className="text-base"><SunMedium /></span>
      </button>

      {/* Dark Theme Button */}
      <button
        onClick={toggleTheme}
        title="Dark theme"
        className={`
          flex items-center justify-center p-1.5 rounded-md transition-all duration-200
          ${theme === "dark"
            ? "bg-brand-500 text-white shadow-md"
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-hover"
          }
        `}
      >
        <span className="text-base"><MoonStarIcon /></span>
      </button>
    </div>
  );
}

