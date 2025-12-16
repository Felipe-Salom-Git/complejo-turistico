import { Reservation, UNIT_GROUPS } from '@/contexts/ReservationsContext';

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
    // So distinct from "next 14 days". Let's generate days for the *entire* current month.
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(year, month, i));
    }
    return days;
};

// Generate Cleaning Tasks based on Reservation
export interface CleaningTask {
    id: string;
    date: Date;
    type: 'toallas' | 'completo';
    unit: string;
}

export const getCleaningTasks = (reservation: Reservation): CleaningTask[] => {
    const cleanings: CleaningTask[] = [];
    const start = new Date(reservation.checkIn);
    const end = new Date(reservation.checkOut);

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Rule: Every 3 days.
    // 3rd day -> Towels
    // 6th day -> Complete
    // 9th day -> Towels
    // 12th day -> Complete ...

    let cleaningCount = 0;
    for (let dayOffset = 3; dayOffset < duration; dayOffset += 3) {
        cleaningCount++;
        const date = new Date(start);
        date.setDate(start.getDate() + dayOffset);

        // Alternating logic
        const type = cleaningCount % 2 === 0 ? 'completo' : 'toallas'; // 1=Towels, 2=Complete, 3=Towels...

        cleanings.push({
            id: `${reservation.id}-clean-${dayOffset}`,
            date,
            type,
            unit: reservation.unit
        });
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
