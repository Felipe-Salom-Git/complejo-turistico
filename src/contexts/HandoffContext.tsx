'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type EntryType = 'info' | 'pending' | 'admin_request';

export interface HandoffEntry {
  id: string;
  title: string;
  description: string;
  type: EntryType;
  unit?: string;
  createdBy: string;
  createdAt: string; // ISO String
  completed: boolean;
  shift: 'Mañana' | 'Tarde' | 'Noche'; // Derived at creation
  ticketId?: number;
}

interface HandoffContextType {
  entries: HandoffEntry[];
  addEntry: (entry: Omit<HandoffEntry, 'id' | 'createdAt' | 'completed' | 'shift'>) => void;
  toggleComplete: (id: string) => void;
  deleteEntry: (id: string) => void; // Not requested for UI but useful helper
}

const HandoffContext = createContext<HandoffContextType | undefined>(undefined);

export function HandoffProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<HandoffEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Helper to determine shift
  const getShift = (date: Date): 'Mañana' | 'Tarde' | 'Noche' => {
    const hour = date.getHours();
    if (hour >= 6 && hour < 14) return 'Mañana';
    if (hour >= 14 && hour < 22) return 'Tarde';
    return 'Noche';
  };

  useEffect(() => {
    const stored = localStorage.getItem('handoff_entries');
    if (stored) {
      setEntries(JSON.parse(stored));
    } else {
      // Mock data
      setEntries([
        {
          id: 'h1',
          title: 'Llaves perdidas Cabaña 4',
          description: 'El huésped reportó pérdida de llave. Se entregó copia. Pendiente de buscar la original.',
          type: 'pending',
          unit: 'Cabaña 4',
          createdBy: 'Recepcionista Noche',
          createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          completed: false,
          shift: 'Noche'
        },
        {
          id: 'h2',
          title: 'Compra de insumos',
          description: 'Falta papel higiénico en depósito general.',
          type: 'info',
          unit: undefined,
          createdBy: 'Recepcionista Mañana',
          createdAt: new Date().toISOString(),
          completed: true,
          shift: 'Mañana'
        }
      ]);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('handoff_entries', JSON.stringify(entries));
    }
  }, [entries, isLoaded]);

  const addEntry = (entryData: Omit<HandoffEntry, 'id' | 'createdAt' | 'completed' | 'shift'>) => {
    const now = new Date();
    const newEntry: HandoffEntry = {
      id: `he-${Date.now()}`,
      ...entryData,
      createdAt: now.toISOString(),
      completed: false,
      shift: getShift(now)
    };
    setEntries(prev => [newEntry, ...prev]);
  };

  const toggleComplete = (id: string) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, completed: !e.completed } : e));
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  return (
    <HandoffContext.Provider value={{ entries, addEntry, toggleComplete, deleteEntry }}>
      {children}
    </HandoffContext.Provider>
  );
}

export function useHandoff() {
  const context = useContext(HandoffContext);
  if (context === undefined) {
    throw new Error('useHandoff must be used within a HandoffProvider');
  }
  return context;
}
