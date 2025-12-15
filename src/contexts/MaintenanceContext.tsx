'use client';

import React, { createContext, useContext, useState } from 'react';

export interface Ticket {
  id: number;
  unidad: string;
  problema: string;
  prioridad: 'urgente' | 'alta' | 'media' | 'baja';
  estado: 'pendiente' | 'en-proceso' | 'completado';
  fecha: string;
  asignado: string;
}

interface MaintenanceContextType {
  tickets: Ticket[];
  addTicket: (ticket: Ticket) => void;
  updateTicket: (ticket: Ticket) => void;
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export function MaintenanceProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 1,
      unidad: 'Cabaña 5',
      problema: 'Fuga de agua en baño',
      prioridad: 'urgente',
      estado: 'pendiente',
      fecha: '2025-10-17',
      asignado: 'Técnico Mario',
    },
    {
      id: 2,
      unidad: 'Suite 12',
      problema: 'Aire acondicionado no enfría',
      prioridad: 'alta',
      estado: 'en-proceso',
      fecha: '2025-10-16',
      asignado: 'Técnico Juan',
    },
    {
      id: 3,
      unidad: 'Cabaña 8',
      problema: 'Puerta de entrada no cierra bien',
      prioridad: 'media',
      estado: 'pendiente',
      fecha: '2025-10-15',
      asignado: 'Sin asignar',
    },
    {
      id: 4,
      unidad: 'Suite 7',
      problema: 'Reemplazo de bombillas',
      prioridad: 'baja',
      estado: 'completado',
      fecha: '2025-10-14',
      asignado: 'Técnico Pedro',
    },
    {
      id: 5,
      unidad: 'Cabaña 3',
      problema: 'Calefacción no funciona',
      prioridad: 'urgente',
      estado: 'en-proceso',
      fecha: '2025-10-17',
      asignado: 'Técnico Mario',
    },
    {
      id: 6,
      unidad: 'Quincho',
      problema: 'Revisión Tablero Eléctrico',
      prioridad: 'alta',
      estado: 'pendiente',
      fecha: '2025-10-18',
      asignado: 'Julián Electricista',
    },
  ]);

  const addTicket = (ticket: Ticket) => {
    setTickets((prev) => [...prev, ticket]);
  };

  const updateTicket = (updatedTicket: Ticket) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === updatedTicket.id ? updatedTicket : t))
    );
  };

  return (
    <MaintenanceContext.Provider value={{ tickets, addTicket, updateTicket }}>
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
