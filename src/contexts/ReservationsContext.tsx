'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Ticket } from '@/contexts/MaintenanceContext';
import { getCleaningTasks } from '@/lib/calendar-logic';

export interface Payment {
  id: string;
  date: Date;
  amount: number;
  currency: 'ARS' | 'USD';
  method: 'Efectivo' | 'Transferencia' | 'Tarjeta' | 'Debito';
  invoiceNumber?: string;
  exchangeRate?: number; // Exchange rate used if ARS
}

export interface ReservationSegment {
  unit: string;
  checkIn: Date;
  checkOut: Date;
}

export interface ReservationHistoryItem {
  date: Date;
  user: string;
  action: string;
  details?: string;
}

export interface CleaningTask {
  id: string;
  date: Date;
  type: 'toallas' | 'completo';
  unit: string;
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
  status: "active" | "checkout" | "cleaning" | "cancelled" | "no-show" | "reprogrammed" | "relocated" | "pending";
  phone?: string;
  email?: string;
  pax?: number;
  observations?: string;

  cleaningSchedule?: CleaningTask[];

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

  // Payment Status Flags
  esPrepaga?: boolean;
  tieneSeña?: boolean;
  fechaSeña?: Date;
  alertaPrecobroActiva?: boolean;

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

  // Nuevos campos de Nacionalidad y Moneda
  nacionalidadTipo?: 'ARGENTINO' | 'EXTRANJERO';
  nacionalidad?: string;
  tipoCambioFuente?: 'BNA_VENTA' | 'PAYWAY_TURISTA';
  montoARS?: number; // Monto total en ARS congelado al momento.
  montoUSD?: number; // Alias de totalUSD o stored explicitly.
  fechaTipoCambio?: Date;

  history?: ReservationHistoryItem[];
  segments?: ReservationSegment[];
}

interface ReservationsContextType {
  reservations: Reservation[];
  addReservation: (reservation: Reservation) => void;
  updateReservation: (updatedReservation: Reservation) => void;
  splitReservation: (originalId: string, splitDate: Date, newUnit: string) => void;
  checkIn: (id: string, arrivalTime?: string) => void;
  checkOut: (id: string) => void;
  finishCleaning: (id: string) => void;
  findAvailableUnit: (requestedType: string, checkIn: Date, checkOut: Date, maintenanceTickets?: Ticket[]) => string | null;
  deleteReservation: (id: string) => void;
  mergeReservations: (id1: string, id2: string) => void;
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

  // Initialize with localStorage or mock data
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize with localStorage or mock data
  useEffect(() => {
    const stored = localStorage.getItem('reservations');
    if (stored) {
      setReservations(JSON.parse(stored, (key, value) => {
        // Rehydrate dates
        if (key === 'checkIn' || key === 'checkOut' || key === 'date' || key === 'createdAt' || key === 'originalCheckIn' || key === 'originalCheckOut' || key === 'fechaTipoCambio') {
          return new Date(value);
        }
        // Handle segments array special case? 
        // The reviver walks deep. So when it hits 'checkIn' inside a segment object, it SHOULD match the key check above!
        // Wait, does reviver work deeply? Yes.
        // So `key === 'checkIn'` should catch segments[i].checkIn too.
        // Let's verify list of keys.
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
    // Generate Cleaning Schedule for the new reservation
    const cleaningSchedule = getCleaningTasks(reservation);
    const newReservation = { ...reservation, cleaningSchedule };

    setReservations(prev => {
      const newReservations = [...prev, newReservation];
      return newReservations;
    });
  };

  const updateReservation = (updatedReservation: Reservation) => {
    setReservations(prev =>
      prev.map(res => {
        if (res.id !== updatedReservation.id) return res;

        let finalRes = { ...updatedReservation };

        // 1. Handle Move / Segment Reset - REMOVED PER USER REQUEST
        // We now allow segments to be moved independently without resetting structure
        // unless explicitly handled. Strict segmentation.

        // 2. Handle Cleaning Schedule Update
        // If dates changed, regenerate schedule (Naive approach, ideally we move cleanings with segments?)
        // For now, if MAIN checkIn/Out changes, we regenerate.
        // But with segments, we should probably check if *segments* changed.
        // If we move a segment, we might want to shift its specific cleaning?
        // Let's keep it simple: Regenerate if bounds change.
        const datesChanged = finalRes.checkIn.getTime() !== res.checkIn.getTime() ||
          finalRes.checkOut.getTime() !== res.checkOut.getTime();

        if (datesChanged || !finalRes.cleaningSchedule) {
          // Ideally getCleaningTasks should respect segments, but for now it uses root dates.
          // Todo: Make cleaning aware of segments if strict matching needed.
          // user says: "Al dividir: dividir también las limpiezas".
          // Current getCleaningTasks logic likely uses root dates.
          // Future improvement: link cleaning to segments.
          finalRes.cleaningSchedule = getCleaningTasks(finalRes);
        }

        // 3. Payment Status Updates (Logic 7)
        // If payment is added (amountPaid increases or payments added), clear alert and set hasDownPayment
        // Note: amountPaid might be undefined on some old objects, handle carefully.
        const currentPaid = finalRes.amountPaid || 0;
        const previousPaid = res.amountPaid || 0;
        const justPaid = currentPaid > previousPaid || (finalRes.payments?.length || 0) > (res.payments?.length || 0);

        // If paying now (or previously paid), ensure flags are set
        if (justPaid || currentPaid > 0) {
          finalRes.tieneSeña = true;
          if (!res.fechaSeña && justPaid) {
            finalRes.fechaSeña = new Date();
          }
          finalRes.alertaPrecobroActiva = false; // "Sale del dashboard / Cambia color"
        }

        return finalRes;
      })
    );
  };

  const splitReservation = (originalId: string, splitDate: Date, newUnit: string) => {
    setReservations(prev => prev.map(res => {
      if (res.id !== originalId) return res;

      let segments = res.segments || [{ unit: res.unit, checkIn: res.checkIn, checkOut: res.checkOut }];

      const splitTime = splitDate.getTime();

      const targetSegmentIndex = segments.findIndex(seg => {
        const start = new Date(seg.checkIn).getTime();
        const end = new Date(seg.checkOut).getTime();
        return splitTime > start && splitTime < end;
      });

      if (targetSegmentIndex === -1) return res;

      const targetSegment = segments[targetSegmentIndex];

      const firstPart: ReservationSegment = {
        ...targetSegment,
        checkOut: splitDate
      };
      const secondPart: ReservationSegment = {
        unit: newUnit,
        checkIn: splitDate,
        checkOut: targetSegment.checkOut
      };

      const newSegments = [...segments];
      newSegments.splice(targetSegmentIndex, 1, firstPart, secondPart);

      // Recalculate root bounds?
      // Usually good to keep root checkIn = min(segments), checkOut = max(segments)
      // We rely on caller or updateReservation?
      // Let's just update segments.

      return {
        ...res,
        segments: newSegments,
        cleaningSchedule: getCleaningTasks({ ...res, segments: newSegments }) // Recalc cleaning
      };
    }));
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
      const updatedReservations = prev.map(r => r.id === id ? { ...r, status: 'cleaning' as const } : r);
      return updatedReservations;
    });
  };

  const finishCleaning = (id: string) => {
    setReservations(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, status: 'checkout' };
      }
      return r;
    }));
  };

  const findAvailableUnit = (requestedType: string, checkIn: Date, checkOut: Date, maintenanceTickets?: Ticket[]): string | null => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const maintenanceBlockedUnits = maintenanceTickets
      ? maintenanceTickets
        .filter((t) => {
          if (t.estado === 'completado') return false;
          const tStart = new Date(t.fechaInicio || t.fecha);
          const tEnd = t.fechaFin ? new Date(t.fechaFin) : new Date(tStart);
          return (start < tEnd && end > tStart);
        })
        .map((t) => t.unidad)
      : [];

    const occupiedUnits = reservations
      .filter(r => {
        if (r.status === 'cancelled' || r.status === 'no-show' || r.status === 'relocated') return false;

        // Check ALL segments if segmented
        const resSegments = r.segments || [{ checkIn: r.checkIn, checkOut: r.checkOut, unit: r.unit }];
        return resSegments.some(seg => {
          const sStart = new Date(seg.checkIn);
          const sEnd = new Date(seg.checkOut);
          return (start < sEnd && end > sStart);
        });
      })
      .map(r => {
        // Return the UNIT of the conflicting segment? 
        // Strategy above was returning r.unit. But r.unit might only be the "Primary" unit.
        // If a reservation uses Unit A and Unit B, we should block BOTH.
        // Map reduces to string[].
        // We should flatten logic:
        return r.segments ? r.segments.map(s => s.unit) : [r.unit];
      })
      .flat();

    const allBlockedUnits = [...new Set([...occupiedUnits, ...maintenanceBlockedUnits])];
    const isAvailable = (u: string) => !allBlockedUnits.includes(u);

    if (INVENTORY.includes(requestedType) && isAvailable(requestedType)) {
      return requestedType;
    }

    const matchedGroupKey = Object.keys(UNIT_GROUPS).find(key => key.toLowerCase().includes(requestedType.toLowerCase()));

    if (matchedGroupKey) {
      const groupUnits = UNIT_GROUPS[matchedGroupKey];
      const availableUnit = groupUnits.find(isAvailable);
      if (availableUnit) return availableUnit;
    }

    const candidates = INVENTORY.filter(u => u.toLowerCase().startsWith(requestedType.toLowerCase()));
    const availableCandidate = candidates.find(isAvailable);

    if (availableCandidate) return availableCandidate;

    return null;
  };

  const deleteReservation = (id: string) => {
    setReservations(prev => prev.filter(r => r.id !== id));
  };

  const mergeReservations = (id1: string, id2: string) => {
    setReservations(prev => {
      const r1 = prev.find(r => r.id === id1);
      const r2 = prev.find(r => r.id === id2);

      if (!r1 || !r2) return prev;

      // Merge Strategy: Keep R1 as base. Merge R2 into R1.

      // 1. Segments
      const seg1 = r1.segments || [{ unit: r1.unit, checkIn: r1.checkIn, checkOut: r1.checkOut }];
      const seg2 = r2.segments || [{ unit: r2.unit, checkIn: r2.checkIn, checkOut: r2.checkOut }];
      // Sort segments by date
      const allSegments = [...seg1, ...seg2].sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());

      // 2. Payments
      const pay1 = r1.payments || [];
      const pay2 = r2.payments || [];
      const allPayments = [...pay1, ...pay2];

      // 3. Totals
      const newTotal = (r1.total || 0) + (r2.total || 0);
      const newPaid = (r1.amountPaid || 0) + (r2.amountPaid || 0);

      // 4. Update R1
      const mergedR1: Reservation = {
        ...r1,
        segments: allSegments,
        checkIn: new Date(Math.min(r1.checkIn.getTime(), r2.checkIn.getTime())),
        checkOut: new Date(Math.max(r1.checkOut.getTime(), r2.checkOut.getTime())),
        payments: allPayments,
        total: newTotal,
        amountPaid: newPaid,
        history: [...(r1.history || []), ...(r2.history || [])],
        observations: (r1.observations || '') + (r2.observations ? `\n[Merged]: ${r2.observations}` : ''),
        cleaningSchedule: getCleaningTasks({ ...r1, segments: allSegments }) // Recalc
      };

      // Remove R2
      return prev.filter(r => r.id !== id2).map(r => r.id === id1 ? mergedR1 : r);
    });
  };

  // Helper to merge adjacent segments within a reservation
  const mergeSegments = (reservationId: string, segmentIndices: number[]) => {
    setReservations(prev => prev.map(res => {
      if (res.id !== reservationId || !res.segments) return res;

      // Implementation: fuse segments if they match unit and are adjacent
      // For now, simplify logic: Re-evaluate segments.
      // This function might be called by UI.
      // Simple flattening: 2 segments -> 1 segment if contiguous and same unit.
      const sorted = [...res.segments].sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());
      const merged: ReservationSegment[] = [];

      let current = sorted[0];
      for (let i = 1; i < sorted.length; i++) {
        const next = sorted[i];
        // Check contiguous: current.out == next.in AND same unit
        // Use slight tolerance or exact match? Exact match preferred.
        if (current.unit === next.unit && new Date(current.checkOut).getTime() === new Date(next.checkIn).getTime()) {
          // Merge
          current = {
            ...current,
            checkOut: next.checkOut
          };
        } else {
          merged.push(current);
          current = next;
        }
      }
      merged.push(current);

      return {
        ...res,
        segments: merged,
        cleaningSchedule: getCleaningTasks({ ...res, segments: merged })
      };
    }));
  };

  const clearAllReservations = () => {
    setReservations([]);
  };

  return (
    <ReservationsContext.Provider value={{
      reservations,
      addReservation,
      updateReservation,
      splitReservation,
      checkIn,
      checkOut,
      finishCleaning,
      findAvailableUnit,
      deleteReservation,
      mergeReservations,
      clearAllReservations,
    }}>
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
