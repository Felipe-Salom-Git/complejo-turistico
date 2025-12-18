import React from 'react';
import { Bell, Moon, Sun, Palette, User } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

import { useAuth } from '@/contexts/AuthContext';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  onNavigate: (path: string) => void;
}

export function Navbar({ darkMode, setDarkMode, onNavigate }: NavbarProps) {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 border-b border-gray-200 dark:border-gray-700 z-50 shadow-sm" style={{ backgroundColor: 'var(--navbar-bg, white)' }}>
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl text-[var(--color-primary)] dark:text-[var(--color-secondary)]">
            Las Gaviotas & Fontana
          </h1>
          <span className="text-sm text-gray-500 dark:text-gray-400 hidden md:block">
            {today}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            <span className="text-sm text-gray-700 dark:text-gray-200">
              {user?.name || 'Invitado'}
            </span>
            <Badge variant="secondary" className="ml-1 capitalize">
              {user?.role || 'Visitante'}
            </Badge>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-2">
                <p className="px-2 py-1.5 text-sm">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Check-out pendiente: Unidad 12
                </p>
                <p className="px-2 py-1.5 text-sm">
                  <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  Mantenimiento urgente: Cabaña 5
                </p>
                <p className="px-2 py-1.5 text-sm">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Nueva reserva confirmada
                </p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('/editor-paleta')}
          >
            <Palette className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
}
