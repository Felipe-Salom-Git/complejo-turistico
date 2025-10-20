'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type ThemeColors = {
  primary: string;
  secondary: string;
  background: string;
  backgroundDark: string;
};

type ThemeContextType = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  themeColors: ThemeColors;
  setThemeColors: (colors: ThemeColors) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (value: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [themeColors, setThemeColors] = useState<ThemeColors>({
    primary: '#2A7B79',
    secondary: '#F5B841',
    background: '#F9FAFB',
    backgroundDark: '#111827',
  });

  // Apply theme changes to document
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', themeColors.primary);
    root.style.setProperty('--color-secondary', themeColors.secondary);
  }, [themeColors]);

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        setDarkMode,
        themeColors,
        setThemeColors,
        sidebarCollapsed,
        setSidebarCollapsed,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
