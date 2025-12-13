import React from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Package,
  Wrench,
  Ticket,
  ClipboardList,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Palette,
  Shield,
  PlusCircle,
} from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  currentPage: string;
  onNavigate: (path: string) => void;
}

export function Sidebar({ collapsed, setCollapsed, currentPage, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: '/', label: 'Dashboard', icon: LayoutDashboard },
    { id: '/nueva-reserva', label: 'Nueva Reserva', icon: PlusCircle },
    { id: 'separator1', type: 'separator', label: 'Base de Datos' },
    // Removed Huespedes based on new design
    { id: '/reservas', label: 'Reservas', icon: CalendarCheck },
    { id: 'separator2', type: 'separator', label: 'Operaciones' },
    { id: '/stock', label: 'Stock', icon: Package },
    { id: '/mantenimiento', label: 'Mantenimiento', icon: Wrench },
    { id: '/pase-diario', label: 'Pase Diario', icon: Ticket },
    { id: '/servicio', label: 'Servicio', icon: ClipboardList },
    { id: 'separator3', type: 'separator', label: 'Gestión' },
    { id: '/calendario', label: 'Calendario', icon: Calendar },
    { id: '/cotizaciones', label: 'Cotizaciones', icon: FileText },
    { id: '/metricas', label: 'Métricas', icon: BarChart3 },
    { id: '/operaciones', label: 'Operaciones', icon: Settings },
    { id: 'separator4', type: 'separator', label: 'Configuración' },
    { id: '/editor-mensajes', label: 'Mensajes', icon: MessageSquare },
    { id: '/editor-paleta', label: 'Paleta de Colores', icon: Palette },
    { id: '/panel-administrativo', label: 'Panel Admin', icon: Shield },
  ];

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
      style={{ backgroundColor: 'var(--sidebar-bg, white)' }}
    >
      <div className="h-full flex flex-col">
        <div className="p-2 flex justify-end border-b border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>

        <ScrollArea className="flex-1 px-2"  style={{ height: 'calc(100vh - 8rem)' }}>
          <div className="space-y-1">
            {menuItems.map((item) => {
              if (item.type === 'separator') {
                return (
                  <div key={item.id} className="py-2">
                    <Separator />
                    {!collapsed && (
                      <p className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400">
                        {item.label}
                      </p>
                    )}
                  </div>
                );
              }

              const Icon = item.icon!;
              const isActive = currentPage === item.id;

              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'default' : 'ghost'}
                  className={`w-full justify-start ${
                    collapsed ? 'px-2' : 'px-3'
                  } ${
                    isActive
                      ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90'
                      : ''
                  }`}
                  onClick={() => onNavigate(item.id)}
                >
                  <Icon className={`w-5 h-5 ${collapsed ? '' : 'mr-3'}`} />
                  {!collapsed && <span>{item.label}</span>}
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
}
