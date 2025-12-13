'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Maid {
  id: number;
  nombre: string;
  estado: 'trabajando' | 'descanso' | 'fuera';
  asignaciones: string[]; // Unidades
}

interface StaffContextType {
  maids: Maid[];
}

const StaffContext = createContext<StaffContextType | undefined>(undefined);

export function StaffProvider({ children }: { children: React.ReactNode }) {
  const [maids, setMaids] = useState<Maid[]>([]);

  useEffect(() => {
      const stored = localStorage.getItem('staffMaids');
      if (stored) {
          setMaids(JSON.parse(stored));
      } else {
          setMaids([
            { id: 1, nombre: 'Marta Díaz', estado: 'trabajando', asignaciones: ['Cabaña 1', 'Cabaña 2'] },
            { id: 2, nombre: 'Juana Pérez', estado: 'trabajando', asignaciones: ['Suite 5', 'Suite 6'] },
            { id: 3, nombre: 'Lucía Gomez', estado: 'descanso', asignaciones: [] },
          ]);
      }
  }, []);

  useEffect(() => {
      if (maids.length > 0) {
        localStorage.setItem('staffMaids', JSON.stringify(maids));
      }
  }, [maids]);

  // Placeholder for update function if needed in future
  const updateMaid = (id: number, updates: Partial<Maid>) => {
      setMaids(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  return (
    <StaffContext.Provider value={{ maids }}>
      {children}
    </StaffContext.Provider>
  );
}

export function useStaff() {
  const context = useContext(StaffContext);
  if (context === undefined) {
    throw new Error('useStaff must be used within a StaffProvider');
  }
  return context;
}
