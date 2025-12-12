'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useTheme } from '../app/providers/ThemeProvider';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarCollapsed, setSidebarCollapsed, darkMode, setDarkMode } = useTheme();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'dark' : ''}`} style={{ backgroundColor: 'var(--background, #F9FAFB)' }}>
      <Navbar 
        darkMode={darkMode} 
        setDarkMode={setDarkMode}
        onNavigate={handleNavigate}
      />
      <div className="flex">
        <Sidebar 
          currentPage={pathname || '/'} 
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          onNavigate={handleNavigate}
        />
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarCollapsed ? 'ml-16' : 'ml-64'
          } mt-16 p-6`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}