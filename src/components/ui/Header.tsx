// 📍 src/components/ui/Header.tsx
'use client';

import React, { useState } from 'react';

interface HeaderProps {
  onToggleSidebar: () => void;
  pageTitle: string;
  pageDescription?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  pageTitle,
  pageDescription
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Lado izquierdo: Botón menú y título */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
            aria-label="Toggle menu"
          >
            <span className="text-xl">☰</span>
          </button>
          
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{pageTitle}</h1>
            {pageDescription && (
              <p className="text-sm text-gray-600">{pageDescription}</p>
            )}
          </div>
        </div>

        {/* Lado derecho: Búsqueda y usuario */}
        <div className="flex items-center space-x-4">
          {/* Barra de búsqueda (opcional) */}
          <div className="hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar..."
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>
          </div>

          {/* Menú de usuario */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">U</span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">Usuario Actual</p>
                <p className="text-xs text-gray-500">Recepcionista</p>
              </div>
              <span className="text-gray-400">▼</span>
            </button>

            {/* Dropdown menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  👤 Mi perfil
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  ⚙️ Configuración
                </button>
                <div className="border-t border-gray-200 my-1"></div>
                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                  🚪 Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};