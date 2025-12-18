import { Reservation, UNIT_GROUPS, CleaningTask } from '@/contexts/ReservationsContext';

export interface CalendarUnit {
    id: string;
    name: string;
    type: string;
    complex: 'Las Gaviotas' | 'La Fontana';
}

// Extract number from unit name (e.g. "LG-12" -> 12, "MA 1" -> 1)
const extractUnitNumber = (name: string): number => {
    const match = name.match(/\d+/);
    return match ? parseInt(match[0], 10) : 9999;
};

// Sort units numerically
export const sortUnitsNumerically = (units: CalendarUnit[]): CalendarUnit[] => {
    return [...units].sort((a, b) => {
        const numA = extractUnitNumber(a.name);
        const numB = extractUnitNumber(b.name);
        return numA - numB;
    });
};

export const generateMonthDays = (baseDate: Date): Date[] => {
    const days = [];
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    // Always generate full month (or at least 30 days window from baseDate if that was the requirement, 
    // but plan said "30 days of the month"). 
    // Let's stick to "Month View" concept, listing all days of the selected month.
    // Spec: "Mostrar siempre los 30 días del mes". 
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(year, month, i));
    }
    return days;
};

export const generateDaysRange = (from: Date, to: Date): Date[] => {
    const days = [];
    const current = new Date(from);
    // Normalize start to midnight
    current.setHours(0, 0, 0, 0);

    const end = new Date(to);
    end.setHours(0, 0, 0, 0);

    while (current <= end) {
        days.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }
    return days;
};

// Generate Cleaning Tasks based on Reservation
export const getCleaningTasks = (reservation: Reservation): CleaningTask[] => {
    const cleanings: CleaningTask[] = [];
    const start = new Date(reservation.checkIn);
    const end = new Date(reservation.checkOut);

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Rule: Every 3 days.
    // If 3 days -> 0 cleanings (Leaves on 3rd day)
    // If 4 days -> 1 cleaning
    // If 6 days -> 1 cleaning (Last one would be checkout day, so we skip/redistribute to be even)
    // If 7 days -> 2 cleanings

    // Rule:
    // 1. Max gap between services (including check-in/out) <= 3 days.
    // 2. Min gap >= 2 days.
    // 3. Equitable distribution.
    // Algorithm: Segments = ceil(Duration / 3).
    // This ensures no segment > 3.
    // Mathematically ensures segment >= 2 for Duration >= 4.

    // Duration 3 -> ceil(1) = 1 segment (0 services). Gap 3.
    // Duration 4 -> ceil(1.33) = 2 segments (1 service). Gap 2.
    // Duration 7 -> ceil(2.33) = 3 segments (2 services). Gap 2.33. (Days 2, 5).

    const numSegments = Math.ceil(duration / 3);
    const numServices = numSegments - 1;

    if (numServices > 0) {
        const interval = duration / numSegments;

        for (let i = 1; i <= numServices; i++) {
            const dayOffset = Math.round(interval * i);

            // Safety check
            if (dayOffset <= 0 || dayOffset >= duration) continue;

            const date = new Date(start);
            date.setDate(start.getDate() + dayOffset);

            // Alternating logic: Toallas first, then Completo? or vice versa?
            // "Recambio de blanco cada 3 dias". Usually towels first.
            const type = i % 2 !== 0 ? 'toallas' : 'completo';

            cleanings.push({
                id: `${reservation.id}-clean-${dayOffset}`,
                date,
                type,
                unit: reservation.unit
            });
        }
    }
    return cleanings;
};

export const getAllUnits = (): CalendarUnit[] => {
    return Object.entries(UNIT_GROUPS).flatMap(([groupName, units]) =>
        units.map((unitName) => {
            let type = "Estándar";
            let complex: 'Las Gaviotas' | 'La Fontana' = "Las Gaviotas";

            if (groupName.includes("Tipo A")) type = "Cabaña";
            else if (groupName.includes("Tipo B")) type = "Cabaña";
            else if (groupName.includes("Tipo C")) type = "Cabaña";
            else if (groupName.includes("Fontana")) {
                complex = "La Fontana";
                type = "Apartamento";
            }

            type = groupName; // Override as per original logic to keep specific badges

            return {
                id: unitName,
                name: unitName,
                type: type,
                complex: complex
            };
        })
    );
};

// --- Availability Logic ---

import { Ticket } from '@/contexts/MaintenanceContext';

export const getOccupyingReservation = (unitId: string, date: Date, reservations: Reservation[]): Reservation | undefined => {
    const checkDate = new Date(date);
    checkDate.setHours(12, 0, 0, 0);

    return reservations.find(res => {
        if (res.status === 'cancelled' || res.status === 'no-show' || res.status === 'relocated') return false;

        const segments = (res.segments && res.segments.length > 0) ? res.segments : [{ unit: res.unit, checkIn: res.checkIn, checkOut: res.checkOut }];

        return segments.some(seg => {
            if (seg.unit !== unitId) return false;

            const start = new Date(seg.checkIn);
            const end = new Date(seg.checkOut);

            const s = new Date(start); s.setHours(12, 0, 0, 0);
            const e = new Date(end); e.setHours(12, 0, 0, 0);

            return checkDate.getTime() >= s.getTime() && checkDate.getTime() < e.getTime();
        });
    });
};

export const getOccupyingTicket = (unitId: string, date: Date, tickets: Ticket[]): Ticket | undefined => {
    const checkDate = new Date(date);
    checkDate.setHours(12, 0, 0, 0);

    return (tickets || []).find(t => {
        if (!t.blocksAvailability || t.estado === 'completado' || t.unidad !== unitId) return false;

        const parseLocal = (dStr: string | Date | undefined) => {
            if (!dStr) return new Date();
            const s = dStr.toString().split('T')[0];
            const [y, m, d] = s.split('-').map(Number);
            return new Date(y, m - 1, d, 12, 0, 0, 0);
        };

        const start = parseLocal(t.fechaInicio || t.fecha);
        const end = t.fechaFin ? parseLocal(t.fechaFin) : new Date(start);

        return checkDate.getTime() >= start.getTime() && checkDate.getTime() <= end.getTime();
    });
};

export const isUnitOccupied = (unitId: string, date: Date, reservations: Reservation[], tickets: Ticket[]): boolean => {
    return !!getOccupyingReservation(unitId, date, reservations) || !!getOccupyingTicket(unitId, date, tickets);
};

export const getAvailabilityStats = (units: CalendarUnit[], date: Date, reservations: Reservation[], tickets: Ticket[]) => {
    let total = 0;
    let occupied = 0;

    // We can filter units by type outside if needed, this functions calculates for the passed array.
    total = units.length;

    occupied = units.filter(u => isUnitOccupied(u.name, date, reservations, tickets)).length;

    return {
        total,
        occupied,
        available: total - occupied
    };
};
