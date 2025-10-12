// 📍 src/components/ui/Sidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MenuItem } from ' @/types/navigation';

// Datos del menú - centralizado para fácil mantenimiento
const menuItems: MenuItem[] = [
  { 
    href: '/', 
    label: 'Dashboard', 
    icon: '📊',
    roles: ['recepcion', 'admin', 'limpieza']
  },
  { 
    href: '/reservas', 
    label: 'Reservas', 
    icon: '📅',
    badge: 3, // Ejemplo: reservas pendientes
    roles: ['recepcion', 'admin']
  },
  { 
    href: '/huespedes', 
    label: 'Huéspedes', 
    icon: '👥',
    roles: ['recepcion', 'admin']
  },
  { 
    href: '/unidades', 
    label: 'Unidades', 
    icon: '🏘️',
    roles: ['recepcion', 'admin', 'limpieza']
  },
  { 
    href: '/tickets', 
    label: 'Tickets', 
    icon: '🎫',
    badge: 5, // Ejemplo: tickets pendientes
    roles: ['recepcion', 'admin', 'limpieza']
  },
  { 
    href: '/reportes', 
    label: 'Reportes', 
    icon: '📈',
    roles: ['admin'] // Solo admin puede ver reportes
  },
];

interface SidebarProps {
  userRol: string;
  isCollapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  userRol = 'recepcion', 
  isCollapsed = false 
}) => {
  const pathname = usePathname();

  // Filtrar items según el rol del usuario
  const filteredMenuItems = menuItems.filter(item => 
    !item.roles || item.roles.includes(userRol)
  );

  return (
    <div className={`
      bg-gray-900 text-white transition-all duration-300
      ${isCollapsed ? 'w-16' : 'w-64'}
    `}>
      {/* Logo y título */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-500 rounded-lg p-2">
            <span className="text-white text-lg">🏨</span>
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold">Complejo Turístico</h1>
              <p className="text-xs text-gray-400">Panel de control</p>
            </div>
          )}
        </div>
      </div>

      {/* Menú de navegación */}
      <nav className="p-4 space-y-1">
        {filteredMenuItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center rounded-lg transition-all duration-200 group
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }
                ${isCollapsed ? 'justify-center p-3' : 'p-3 space-x-3'}
              `}
              title={isCollapsed ? item.label : ''}
            >
              {/* Icono */}
              <span className="text-lg flex-shrink-0">
                {item.icon}
              </span>
              
              {/* Texto y badge - solo se muestran si no está colapsado */}
              {!isCollapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-5 text-center">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              
              {/* Tooltip para cuando está colapsado */}
              {isCollapsed && item.badge && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-2 h-2"></span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Información del usuario (solo cuando no está colapsado) */}
      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4 p-3 bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">U</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Usuario Actual</p>
              <p className="text-xs text-gray-400 capitalize">{userRol}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};