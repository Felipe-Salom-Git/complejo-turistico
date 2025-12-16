'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Ticket {
  id: number;
  unidad: string;
  problema: string;
  descripcion?: string; // Nuevo campo
  tipo: 'correctivo' | 'preventivo'; // Nuevo campo
  prioridad: 'urgente' | 'alta' | 'media' | 'baja';
  estado: 'pendiente' | 'en-proceso' | 'completado';
  fecha: string; // Fecha de creación o reporte
  fechaInicio?: string; // Para agendamiento
  fechaFin?: string; // Para agendamiento
  asignado: string;
}

interface MaintenanceContextType {
  tickets: Ticket[];
  addTicket: (ticket: Ticket) => number;
  updateTicket: (ticket: Ticket) => void;
  deleteTicket: (id: number) => void;
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export function MaintenanceProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('maintenance_tickets');
    if (stored) {
      setTickets(JSON.parse(stored));
    } else {
      // Mock Data inicial si no hay nada guardado
      setTickets([
        {
          id: 1,
          unidad: 'Cabaña 5',
          problema: 'Fuga de agua en baño',
          descripcion: 'Gotea constantemente la canilla del lavabo.',
          tipo: 'correctivo',
          prioridad: 'urgente',
          estado: 'pendiente',
          fecha: '2025-10-17',
          fechaInicio: '2025-10-17',
          fechaFin: '2025-10-18',
          asignado: 'Técnico Mario',
        },
        {
          id: 2,
          unidad: 'Suite 12',
          problema: 'Aire acondicionado no enfría',
          descripcion: 'El equipo enciende pero no tira aire frío.',
          tipo: 'correctivo',
          prioridad: 'alta',
          estado: 'en-proceso',
          fecha: '2025-10-16',
          fechaInicio: '2025-10-16',
          fechaFin: '2025-10-19',
          asignado: 'Técnico Juan',
        },
      ]);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('maintenance_tickets', JSON.stringify(tickets));
    }
  }, [tickets, isLoaded]);

  const addTicket = (ticket: Ticket): number => {
    // Auto-increment ID simple logic
    const newId = tickets.length > 0 ? Math.max(...tickets.map(t => t.id)) + 1 : 1;
    const newTicket = { ...ticket, id: newId };
    setTickets((prev) => [...prev, newTicket]);
    return newId;
  };

  const updateTicket = (updatedTicket: Ticket) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === updatedTicket.id ? updatedTicket : t))
    );
  };

  const deleteTicket = (id: number) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <MaintenanceContext.Provider value={{ tickets, addTicket, updateTicket, deleteTicket }}>
      {children}
    </MaintenanceContext.Provider>
  );
}

export function useMaintenance() {
  const context = useContext(MaintenanceContext);
  if (context === undefined) {
    throw new Error('useMaintenance must be used within a MaintenanceProvider');
  }
  return context;
}
