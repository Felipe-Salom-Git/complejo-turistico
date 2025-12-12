'use client';

import React, { createContext, useContext, useState } from 'react';

interface ThemeContextType {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (value: boolean) => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ 
      sidebarCollapsed,
      setSidebarCollapsed,
      darkMode,
      setDarkMode,
      toggleSidebar, 
      toggleDarkMode 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}