'use client';

import React, { createContext, useContext, useState } from 'react';

export interface Pase {
  id: number;
  nombre: string;
  cantidad: number;
  tipo: 'Adulto' | 'Menor' | 'Familiar';
  fecha: string;
  hora: string;
  servicios: string[];
  total: number;
  estado: 'activo' | 'completado';
}

interface DailyPassContextType {
  pases: Pase[];
  addPase: (pase: Pase) => void;
  updatePase: (pase: Pase) => void;
}

const DailyPassContext = createContext<DailyPassContextType | undefined>(undefined);

export function DailyPassProvider({ children }: { children: React.ReactNode }) {
  const [pases, setPases] = useState<Pase[]>([
    {
      id: 1,
      nombre: 'González, Roberto',
      cantidad: 3,
      tipo: 'Adulto',
      fecha: '2025-10-17',
      hora: '10:30',
      servicios: ['Pileta', 'Parrilla'],
      total: 4500,
      estado: 'activo',
    },
    {
      id: 2,
      nombre: 'Fernández, Laura',
      cantidad: 2,
      tipo: 'Adulto',
      fecha: '2025-10-17',
      hora: '11:00',
      servicios: ['Pileta'],
      total: 3000,
      estado: 'activo',
    },
    {
      id: 3,
      nombre: 'Sánchez, Pablo',
      cantidad: 4,
      tipo: 'Familiar',
      fecha: '2025-10-17',
      hora: '09:15',
      servicios: ['Pileta', 'Parrilla', 'Deportes'],
      total: 6000,
      estado: 'completado',
    },
    {
      id: 4,
      nombre: 'Ramírez, Ana',
      cantidad: 1,
      tipo: 'Adulto',
      fecha: '2025-10-17',
      hora: '14:00',
      servicios: ['Spa', 'Pileta'],
      total: 2500,
      estado: 'activo',
    },
  ]);

  const addPase = (pase: Pase) => {
    setPases((prev) => [...prev, pase]);
  };

  const updatePase = (updatedPase: Pase) => {
    setPases((prev) =>
      prev.map((p) => (p.id === updatedPase.id ? updatedPase : p))
    );
  };

  return (
    <DailyPassContext.Provider value={{ pases, addPase, updatePase }}>
      {children}
    </DailyPassContext.Provider>
  );
}

export function useDailyPass() {
  const context = useContext(DailyPassContext);
  if (context === undefined) {
    throw new Error('useDailyPass must be used within a DailyPassProvider');
  }
  return context;
}
