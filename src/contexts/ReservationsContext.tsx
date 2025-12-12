'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Reservation {
  id: string;
  unit: string;
  guestName: string;
  checkIn: Date;
  checkOut: Date;
  status: "active" | "checkout" | "cleaning";
  phone?: string;
  email?: string;
  pax?: number;
  observations?: string;
  total?: number;
}

interface ReservationsContextType {
  reservations: Reservation[];
  addReservation: (reservation: Reservation) => void;
  updateReservation: (updatedReservation: Reservation) => void;
  splitReservation: (originalId: string, splitDate: Date, newUnit: string) => void;
}

const ReservationsContext = createContext<ReservationsContextType | undefined>(undefined);

export function ReservationsProvider({ children }: { children: React.ReactNode }) {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // Initialize with some mock data
  useEffect(() => {
    const initialReservations: Reservation[] = [
      {
        id: "1",
        unit: "LG-1",
        guestName: "Juan Pérez",
        checkIn: new Date(2025, 11, 1),
        checkOut: new Date(2025, 11, 5),
        status: "active",
        total: 500,
        pax: 2
      },
      {
        id: "2",
        unit: "LF-3",
        guestName: "María García",
        checkIn: new Date(2025, 11, 3),
        checkOut: new Date(2025, 11, 7),
        status: "active",
        total: 800,
        pax: 4
      }
    ];
    setReservations(initialReservations);
  }, []);

  const addReservation = (reservation: Reservation) => {
    setReservations(prev => [...prev, reservation]);
    
    // Auto-generate cleaning reservations
    const cleanings = generateCleaningReservations(reservation);
    if (cleanings.length > 0) {
      setReservations(prev => [...prev, ...cleanings]);
    }
  };

  const updateReservation = (updatedReservation: Reservation) => {
    setReservations(prev => 
      prev.map(res => res.id === updatedReservation.id ? updatedReservation : res)
    );
  };

  const splitReservation = (originalId: string, splitDate: Date, newUnit: string) => {
    const original = reservations.find(r => r.id === originalId);
    if (!original) return;

    const reservation1: Reservation = {
      ...original,
      id: `${original.id}-1`,
      checkOut: splitDate,
    };

    const reservation2: Reservation = {
      ...original,
      id: `${original.id}-2`,
      unit: newUnit,
      checkIn: splitDate,
    };

    setReservations(prev => [
      ...prev.filter(res => res.id !== originalId),
      reservation1,
      reservation2,
    ]);
  };

  return (
    <ReservationsContext.Provider value={{ reservations, addReservation, updateReservation, splitReservation }}>
      {children}
    </ReservationsContext.Provider>
  );
}

export function useReservations() {
  const context = useContext(ReservationsContext);
  if (context === undefined) {
    throw new Error('useReservations must be used within a ReservationsProvider');
  }
  return context;
}

// Helper for cleaning generation (copied from calendar logic)
const generateCleaningReservations = (reservation: Reservation): Reservation[] => {
  if (reservation.status === 'cleaning') return [];

  const cleanings: Reservation[] = [];
  const start = new Date(reservation.checkIn);
  const end = new Date(reservation.checkOut);
  
  const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  for (let day = 3; day < duration; day += 3) {
    const cleaningDate = new Date(start);
    cleaningDate.setDate(start.getDate() + day);
    
    const cleaningEnd = new Date(cleaningDate);
    cleaningEnd.setHours(cleaningDate.getHours() + 2);
    
    cleanings.push({
      id: `${reservation.id}-cleaning-${day}`,
      unit: reservation.unit,
      guestName: "Limpieza",
      checkIn: cleaningDate,
      checkOut: cleaningEnd,
      status: "cleaning"
    });
  }
  
  return cleanings;
};
