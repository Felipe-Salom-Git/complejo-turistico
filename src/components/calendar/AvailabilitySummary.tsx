import React from 'react';
import { Card } from '@/components/ui/card';
import { CalendarUnit } from '@/lib/calendar-logic';
import { Reservation } from '@/contexts/ReservationsContext';

interface AvailabilitySummaryProps {
    days: Date[];
    units: CalendarUnit[];
    reservations: Reservation[];
}

export function AvailabilitySummary({ days, units, reservations }: AvailabilitySummaryProps) {
    // Group units by Type
    // Get unique types from the *filtered* units passed in props
    const types = Array.from(new Set(units.map(u => u.type)));

    const getAvailability = (date: Date, type: string) => {
        const unitsOfType = units.filter(u => u.type === type);
        const total = unitsOfType.length;

        const dateStr = date.toDateString();

        const occupied = unitsOfType.filter(u => {
            return reservations.some(r => {
                if (r.unit !== u.name || r.status !== 'active') return false;
                const rStart = new Date(r.checkIn);
                const rEnd = new Date(r.checkOut);

                // Check if date falls within reservation [start, end)
                // We typically count nights. So if date == checkIn -> occupied. If date == checkOut -> free (usually).
                // Let's align with grid logic: date >= checkIn && date < checkOut
                const d = new Date(date);
                d.setHours(0, 0, 0, 0);
                rStart.setHours(0, 0, 0, 0);
                rEnd.setHours(0, 0, 0, 0);

                return d >= rStart && d < rEnd;
            });
        }).length;

        return { total, occupied, available: total - occupied };
    };

    return (
        <Card className="mt-4 p-4 overflow-x-auto">
            <h3 className="text-sm font-semibold mb-2 ml-32">Disponibilidad Diaria</h3>
            <div className="inline-block min-w-full">
                {types.map(type => (
                    <div key={type} className="flex border-b last:border-b-0 text-xs">
                        <div className="w-32 flex-shrink-0 p-2 font-medium bg-muted/20 truncate" title={type}>
                            {type}
                        </div>
                        {days.map((day, i) => {
                            const { available, occupied } = getAvailability(day, type);
                            // Color code if full?
                            const isFull = available === 0;
                            const isHigh = available > 0 && available <= 1;

                            return (
                                <div key={i} className={`w-20 flex-shrink-0 p-2 text-center border-r last:border-r-0 ${isFull ? 'bg-red-50 text-red-800' : ''}`}>
                                    <span className="font-bold text-emerald-600">{available}</span>
                                    <span className="text-gray-300 mx-1">/</span>
                                    <span className="text-gray-400">{occupied}</span>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
            <div className="flex gap-4 mt-2 text-xs text-muted-foreground ml-32">
                <span>Verde: Disponibles</span>
                <span>Gris: Ocupadas</span>
            </div>
        </Card>
    );
}
