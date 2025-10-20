import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/pages/Dashboard';
import { Reservas } from './components/pages/Reservas';
import { Huespedes } from './components/pages/Huespedes';
import { Stock } from './components/pages/Stock';
import { Mantenimiento } from './components/pages/Mantenimiento';
import { PaseDiario } from './components/pages/PaseDiario';
import { Servicio } from './components/pages/Servicio';
import { Calendario } from './components/pages/Calendario';
import { Cotizaciones } from './components/pages/Cotizaciones';
import { Metricas } from './components/pages/Metricas';
import { Operaciones } from './components/pages/Operaciones';
import { EditorMensajes } from './components/pages/EditorMensajes';
import { EditorPaleta } from './components/pages/EditorPaleta';
import { PanelAdministrativo } from './components/pages/PanelAdministrativo';

export type ThemeColors = {
  primary: string;
  secondary: string;
  background: string;
  backgroundDark: string;
};

function App() {
  const [currentPage, setCurrentPage] = useState('/');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [themeColors, setThemeColors] = useState<ThemeColors>({
    primary: '#2A7B79',
    secondary: '#F5B841',
    background: '#F9FAFB',
    backgroundDark: '#111827',
  });

  // Update dark mode class on document
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Update CSS variables
  React.useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', themeColors.primary);
    document.documentElement.style.setProperty('--color-secondary', themeColors.secondary);
  }, [themeColors]);

  const renderPage = () => {
    switch (currentPage) {
      case '/':
        return <Dashboard />;
      case '/reservas':
        return <Reservas />;
      case '/huespedes':
        return <Huespedes />;
      case '/stock':
        return <Stock />;
      case '/mantenimiento':
        return <Mantenimiento />;
      case '/pase-diario':
        return <PaseDiario />;
      case '/servicio':
        return <Servicio />;
      case '/calendario':
        return <Calendario />;
      case '/cotizaciones':
        return <Cotizaciones />;
      case '/metricas':
        return <Metricas />;
      case '/operaciones':
        return <Operaciones />;
      case '/editor-mensajes':
        return <EditorMensajes />;
      case '/editor-paleta':
        return <EditorPaleta themeColors={themeColors} setThemeColors={setThemeColors} />;
      case '/panel-administrativo':
        return <PanelAdministrativo />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onNavigate={setCurrentPage}
      />
      <div className="flex">
        <Sidebar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          currentPage={currentPage}
          onNavigate={setCurrentPage}
        />
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarCollapsed ? 'ml-16' : 'ml-64'
          } mt-16 p-6`}
        >
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
