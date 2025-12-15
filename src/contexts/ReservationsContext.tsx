'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Payment {
  id: string;
  date: Date;
  amount: number;
  currency: 'ARS' | 'USD';
  method: 'Efectivo' | 'Transferencia' | 'Tarjeta' | 'Debito';
  invoiceNumber?: string;
  exchangeRate?: number; // Exchange rate used if ARS
}

export interface ReservationHistoryItem {
  date: Date;
  user: string;
  action: string;
  details?: string;
}

/**
 * Interfaz principal para una Reserva.
 * Contiene tanto los datos básicos (fechas, huesped) como los financieros y de estado.
 */
export interface Reservation {
  id: string;
  unit: string;
  guestName: string;
  checkIn: Date;
  checkOut: Date;
  /** Estado actual de la reserva en el ciclo de vida */
  status: "active" | "checkout" | "cleaning" | "cancelled" | "no-show" | "reprogrammed" | "relocated";
  phone?: string;
  email?: string;
  pax?: number;
  observations?: string;

  /** Total calculado históricamente o en ARS (legado) */
  total?: number;
  /** Total calculado en USD (moneda base del sistema) */
  totalUSD?: number;
  /** Suma de pagos realizados (puede mezclar monedas, usar para cache) */
  amountPaid?: number;
  /** Total pagado normalizado a USD */
  amountPaidUSD?: number;

  payments?: Payment[];
  invoiceNumber?: string;
  arrivalTime?: string;
  source?: string;
  cancellationPolicy?: string;

  hasPet?: boolean;
  petCharged?: boolean;
  licensePlate?: string;

  createdAt?: Date;
  createdBy?: string;

  // Campos para control de Estado Avanzado
  originalCheckIn?: Date;
  originalCheckOut?: Date;
  /** Si fue reubicado, indica a qué complejo se movió */
  relocationComplex?: 'Huella Andina' | 'Santa Rita';

  // Campos financieros calculados/denormalizados para acceso rápido
  balance_usd?: number;
  balance_ars?: number;
  exchangeRate?: number; // Tipo de cambio al momento de la reserva
  history?: ReservationHistoryItem[];
}

interface ReservationsContextType {
  reservations: Reservation[];
  addReservation: (reservation: Reservation) => void;
  updateReservation: (updatedReservation: Reservation) => void;
  splitReservation: (originalId: string, splitDate: Date, newUnit: string) => void;
  checkIn: (id: string, arrivalTime?: string) => void;
  checkOut: (id: string) => void;
  finishCleaning: (id: string) => void;
  findAvailableUnit: (requestedType: string, checkIn: Date, checkOut: Date) => string | null;
  deleteReservation: (id: string) => void;
  clearAllReservations: () => void;
}

const ReservationsContext = createContext<ReservationsContextType | undefined>(undefined);

// Export constant logic for shared use
export const UNIT_GROUPS: Record<string, string[]> = {
  'Unidad Tipo A': ['LG-2', 'LG-4', 'LG-5', 'LG-7', 'LG-9', 'LG-11', 'LG-12', 'LG-20'],
  'Unidad Tipo B': ['LG-15', 'LG-17', 'LG-18'],
  'Unidad Tipo C': ['LG-3', 'LG-8', 'LG-10', 'LG-13'],
  'Unidad Tipo C+': ['LG-1', 'LG-6'],
  'Unidad Tipo D': ['LG-14', 'LG-16', 'LG-19'],
  'Fontana': ['MA 1', 'CM 2', 'CC 3', 'CF1 4', 'CF2 5', 'CF 6', 'Torre 7']
};

export const INVENTORY = Object.values(UNIT_GROUPS).flat();

export function ReservationsProvider({ children }: { children: React.ReactNode }) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  // ...

  // Initialize with localStorage or mock data
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize with localStorage or mock data
  useEffect(() => {
    const stored = localStorage.getItem('reservations');
    if (stored) {
      setReservations(JSON.parse(stored, (key, value) => {
        // Rehydrate dates
        if (key === 'checkIn' || key === 'checkOut' || key === 'date' || key === 'createdAt' || key === 'originalCheckIn' || key === 'originalCheckOut') return new Date(value);
        return value;
      }));
    } else {
      // Mock data fallback
      const initialReservations: Reservation[] = [
        {
          id: "1",
          unit: "LG-1",
          guestName: "Juan Pérez",
          checkIn: new Date(2025, 11, 1),
          checkOut: new Date(2025, 11, 5),
          status: "active",
          total: 500,
          amountPaid: 200,
          payments: [
            { id: 'p1', date: new Date(2025, 10, 15), amount: 200, currency: 'USD', method: 'Transferencia' }
          ],
          arrivalTime: "14:00",
          pax: 2,
          createdAt: new Date(2025, 10, 15),
          createdBy: "Admin Principal"
        },
        {
          id: "2",
          unit: "LF-3",
          guestName: "María García",
          checkIn: new Date(2025, 11, 3),
          checkOut: new Date(2025, 11, 7),
          status: "active",
          total: 800,
          amountPaid: 800,
          payments: [
            { id: 'p2', date: new Date(2025, 10, 20), amount: 400, currency: 'USD', method: 'Efectivo' },
            { id: 'p3', date: new Date(2025, 11, 3), amount: 400, currency: 'USD', method: 'Tarjeta' }
          ],
          arrivalTime: "15:30",
          pax: 4,
          createdAt: new Date(2025, 10, 20),
          createdBy: "Admin Principal"
        }
      ];
      setReservations(initialReservations);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever reservations change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('reservations', JSON.stringify(reservations));
    }
  }, [reservations, isLoaded]);

  const addReservation = (reservation: Reservation) => {
    setReservations(prev => {
      const newReservations = [...prev, reservation];
      // Auto-generate cleaning reservations
      const cleanings = generateCleaningReservations(reservation);
      if (cleanings.length > 0) {
        newReservations.push(...cleanings);
      }
      return newReservations;
    });
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

  const checkIn = (id: string, arrivalTime?: string) => {
    setReservations(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, status: 'active', arrivalTime: arrivalTime || r.arrivalTime };
      }
      return r;
    }));
  };

  const checkOut = (id: string) => {
    setReservations(prev => {
      const reservation = prev.find(r => r.id === id);
      if (!reservation) return prev;

      // 1. Mark as completed/checksum
      const updatedReservations = prev.map(r => r.id === id ? { ...r, status: 'cleaning' as const } : r);

      // 2. Add cleaning task if not already existent (simple logic)
      // Actually, 'cleaning' status IS the cleaning task effectively in this system.
      // But we could also add a dedicated 'cleaning' reservation block if we want to block the calendar.
      // For now, setting status to 'cleaning' is enough for the Cleaning Widget to pick it up.

      return updatedReservations;
    });
  };

  const finishCleaning = (id: string) => {
    setReservations(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, status: 'checkout' }; // Mark as fully done/available? Or maybe remove?
        // "checkout" usually means "Checked out, room might be dirty". 
        // "cleaning" means "Being cleaned".
        // After cleaning, it should perhaps go to a history status or valid/available.
        // Let's assume 'checkout' is the final 'historical' state for this app for now, 
        // or we might need a 'completed' status. Let's use 'checkout' as "Done" for simplicity or add 'completed'.
        // Actually, the type says: "active" | "checkout" | "cleaning".
        // So flow is: active -> checkout (Dirty) -> cleaning -> ??
        // Let's assume standard flow: Active -> (Checkout action) -> Cleaning -> (Cleaned action) -> Archived/Available.
        // But we don't have 'archived'. Let's stick to 'checkout' as the final state.
      }
      return r;
    }));
  };



  /**
   * Busca una unidad disponible basada en el tipo solicitado y las fechas.
   * Estrategia de búsqueda:
   * 1. Identificar unidades ocupadas en el rango.
   * 2. Verificar disponibilidad exacta.
   * 3. Verificar grupo de unidades (e.g. "Tipo A").
   * 4. Fallback por prefijo.
   */
  const findAvailableUnit = (requestedType: string, checkIn: Date, checkOut: Date): string | null => {
    // 1. Identificar unidades ocupadas en el rango asignado
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const occupiedUnits = reservations
      .filter(r => {
        // Ignorar estados que no bloquean calendario
        if (r.status === 'cancelled' || r.status === 'no-show' || r.status === 'relocated') return false;

        const rStart = new Date(r.checkIn);
        const rEnd = new Date(r.checkOut);

        // Chequeo de solapamiento de fechas
        // Y verificar estados bloqueantes (active, cleaning, reprogrammed, checkout)
        return (start < rEnd && end > rStart) && (r.status === 'active' || r.status === 'cleaning' || r.status === 'reprogrammed' || r.status === 'checkout');
      })
      .map(r => r.unit);

    // 2. Helper para chequear disponibilidad
    const isAvailable = (u: string) => !occupiedUnits.includes(u);

    // 3. Estrategia de Coincidencia Exacta
    // Si requestedType es una unidad específica (ej. "LG-2")
    if (INVENTORY.includes(requestedType) && isAvailable(requestedType)) {
      return requestedType;
    }

    // 4. Estrategia de Grupo (ej. "Unidad Tipo A")
    // Buscamos si el tipo solicitado corresponde a una clave de grupo
    const matchedGroupKey = Object.keys(UNIT_GROUPS).find(key => key.toLowerCase().includes(requestedType.toLowerCase()));

    if (matchedGroupKey) {
      const groupUnits = UNIT_GROUPS[matchedGroupKey];
      const availableUnit = groupUnits.find(isAvailable);
      if (availableUnit) return availableUnit;
    }

    // 5. Fallback: Estrategia de Prefijo
    // Búsqueda aproximada si el usuario tipeó manualmente o faltó casing
    const candidates = INVENTORY.filter(u => u.toLowerCase().startsWith(requestedType.toLowerCase()));
    const availableCandidate = candidates.find(isAvailable);

    if (availableCandidate) return availableCandidate;

    return null;
  };

  const deleteReservation = (id: string) => {
    setReservations(prev => prev.filter(r => r.id !== id));
  };

  const clearAllReservations = () => {
    setReservations([]);
  };

  return (
    <ReservationsContext.Provider value={{ reservations, addReservation, updateReservation, deleteReservation, splitReservation, checkIn, checkOut, finishCleaning, findAvailableUnit, clearAllReservations }}>
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
