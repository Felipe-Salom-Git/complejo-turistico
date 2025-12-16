'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

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

export interface Feedback {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

interface DailyPassContextType {
  pases: Pase[];
  feedbacks: Feedback[];
  addPase: (pase: Omit<Pase, 'id'>) => void;
  updatePase: (id: number, data: Partial<Pase>) => void;
  addFeedback: (feedback: Omit<Feedback, 'id' | 'date'>) => void;
}

const DailyPassContext = createContext<DailyPassContextType | undefined>(undefined);

export function DailyPassProvider({ children }: { children: React.ReactNode }) {
  const [pases, setPases] = useState<Pase[]>([
    {
      id: 1,
      nombre: 'Juan Pérez',
      cantidad: 4,
      tipo: 'Familiar',
      fecha: '2024-03-20',
      hora: '10:30',
      servicios: ['Pileta', 'Parrilla'],
      total: 6000,
      estado: 'activo',
    },
    {
      id: 2,
      nombre: 'María García',
      cantidad: 2,
      tipo: 'Adulto',
      fecha: '2024-03-20',
      hora: '11:15',
      servicios: ['Pileta', 'Spa'],
      total: 3000,
      estado: 'activo',
    },
  ]);

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([
      { id: 1, name: 'Carlos Gomez', rating: 5, comment: 'Excelente atención y muy limpio todo.', date: new Date().toISOString() },
      { id: 2, name: 'Ana Diaz', rating: 3, comment: 'La pileta estaba un poco fría.', date: new Date().toISOString() }
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('dailyPasses');
    if (saved) {
      setPases(JSON.parse(saved));
    }
    const savedFeedbacks = localStorage.getItem('feedbacks');
    if (savedFeedbacks) {
        setFeedbacks(JSON.parse(savedFeedbacks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dailyPasses', JSON.stringify(pases));
  }, [pases]);

  useEffect(() => {
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
  }, [feedbacks]);

  const addPase = (pase: Omit<Pase, 'id'>) => {
    const newPase = { ...pase, id: Date.now() };
    setPases((prev) => [...prev, newPase]);
  };

  const updatePase = (id: number, data: Partial<Pase>) => {
    setPases((prev) =>
      prev.map((pase) => (pase.id === id ? { ...pase, ...data } : pase))
    );
  };

  const addFeedback = (data: Omit<Feedback, 'id' | 'date'>) => {
      const newFeedback = { ...data, id: Date.now(), date: new Date().toISOString() };
      setFeedbacks(prev => [newFeedback, ...prev]);
  };

  return (
    <DailyPassContext.Provider value={{ pases, feedbacks, addPase, updatePase, addFeedback }}>
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
