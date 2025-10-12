// 📍 src/app/(dashboard)/layout.tsx
'use client';

import React, { useState } from 'react';
import { Sidebar } from ' @/components/ui/Sidebar';
import { Header } from ' @/components/ui/Header';
import { usePathname } from 'next/navigation';

// Mapeo de títulos para cada página
const pageTitles: Record<string, { title: string; description?: string }> = {
  '/': {
    title: 'Dashboard Principal',
    description: 'Resumen operativo del complejo'
  },
  '/reservas': {
    title: 'Gestión de Reservas',
    description: 'Administra todas las reservas del sistema'
  },
  '/huespedes': {
    title: 'Gestión de Huéspedes',
    description: 'Administra la información de huéspedes'
  },
  '/unidades': {
    title: 'Unidades y Habitaciones',
    description: 'Control de disponibilidad y estados'
  },
  '/tickets': {
    title: 'Tickets de Pase',
    description: 'Sistema de comunicación entre turnos'
  },
  '/reportes': {
    title: 'Reportes y Estadísticas',
    description: 'Análisis y métricas del complejo'
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Obtener título y descripción según la página actual
  const currentPage = pageTitles[pathname] || {
    title: 'Sistema Turístico',
    description: 'Panel de administración'
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        userRol="recepcion" // En una app real, esto vendría de un context de auth
        isCollapsed={isSidebarCollapsed}
      />
      
      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header 
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          pageTitle={currentPage.title}
          pageDescription={currentPage.description}
        />
        
        {/* Contenido de la página */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}