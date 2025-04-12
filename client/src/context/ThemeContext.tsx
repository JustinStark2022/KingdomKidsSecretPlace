import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Create context with default values to avoid undefined checks
const defaultThemeContext: ThemeContextType = {
  theme: "light",
  toggleTheme: () => {}
};

const ThemeContext = createContext<ThemeContextType>(defaultThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize with default theme
  const [theme, setTheme] = useState<Theme>("light");
  
  // Only run on client-side
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("theme") as Theme | null;
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(savedTheme || (prefersDark ? "dark" : "light"));
    } catch (e) {
      console.log("Error accessing localStorage or window media:", e);
    }
  }, []);

  // Apply theme changes
  useEffect(() => {
    try {
      const root = document.documentElement;
      
      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
      
      localStorage.setItem("theme", theme);
    } catch (e) {
      console.log("Error setting theme:", e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
