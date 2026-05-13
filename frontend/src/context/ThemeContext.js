import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Get previous preference or default to "system"
    return localStorage.getItem("theme") || "system";
  });

  // Helper to determine if we are effectively in dark mode
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const isSystemDark = mediaQuery.matches;
      const effectiveDark = theme === "dark" || (theme === "system" && isSystemDark);

      root.classList.remove("light", "dark");
      root.classList.add(effectiveDark ? "dark" : "light");
      setIsDark(effectiveDark);
    };

    applyTheme();
    localStorage.setItem("theme", theme);

    // Listen for system theme changes
    const listener = () => {
      if (theme === "system") applyTheme();
    };

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, [theme]);

  const toggleTheme = () => {
    const modes = ["light", "dark", "system"];
    setTheme((prev) => {
      const nextIndex = (modes.indexOf(prev) + 1) % modes.length;
      return modes[nextIndex];
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
  return ctx;
};