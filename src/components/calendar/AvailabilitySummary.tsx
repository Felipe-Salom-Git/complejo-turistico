import React from 'react';
import { Card } from '@/components/ui/card';
import { CalendarUnit } from '@/lib/calendar-logic';
import { Reservation } from '@/contexts/ReservationsContext';

interface AvailabilitySummaryProps {
    days: Date[];
    units: CalendarUnit[];
    reservations: Reservation[];
}

import { useDraggableScroll } from '@/hooks/useDraggableScroll';

export function AvailabilitySummary({ units, days, reservations }: AvailabilitySummaryProps) {
    const types = Array.from(new Set(units.map(u => u.type))).sort((a, b) => {
        const order = ['Unidad Tipo A', 'Unidad Tipo B', 'Unidad Tipo C', 'Unidad Tipo C+', 'Unidad Tipo D', 'Fontana'];
        return order.indexOf(a) - order.indexOf(b);
    });

    const getAvailability = (date: Date, type: string) => {
        const unitsOfType = units.filter(u => u.type === type);
        const total = unitsOfType.length;
        
        const occupied = unitsOfType.filter(unit => {
            return reservations.some(res => {
                if (res.unit !== unit.name || res.status === 'cancelled' || res.status === 'no-show') return false;
                const start = new Date(res.checkIn);
                const end = new Date(res.checkOut);
                
                // If checking out today, it's available for check-in today (usually).
                // But for "occupancy count" often implies staying over night?
                // Standard logic: Occupied if date >= checkIn AND date < checkOut.
                // CheckIn = 20th. Occupied on 20th night.
                // CheckOut = 25th. Free on 25th day (for new checkin).
                
                const d = new Date(date);
                d.setHours(12, 0, 0, 0);
                start.setHours(12, 0, 0, 0);
                end.setHours(12, 0, 0, 0);
                
                return d >= start && d < end;
            });
        }).length;

        return { total, occupied, available: total - occupied };
    };

    const scrollRef = React.useRef<HTMLDivElement>(null);
    const { onMouseDown, onMouseUp, onMouseMove, onMouseLeave, isDragging } = useDraggableScroll(scrollRef);

    React.useEffect(() => {
        if (scrollRef.current) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const todayIndex = days.findIndex(d => {
                const dDate = new Date(d);
                dDate.setHours(0, 0, 0, 0);
                return dDate.getTime() === today.getTime();
            });

            if (todayIndex !== -1) {
                // Unit column w-32 (128px), Days w-20 (80px)
                const scrollPos = todayIndex * 80;
                scrollRef.current.scrollLeft = scrollPos;
            }
        }
    }, [days]);

    return (
        <Card className="mt-4 overflow-hidden border shadow-sm">
            <div className="p-4 border-b bg-white relative z-10">
                <h3 className="text-sm font-semibold">Disponibilidad Diaria</h3>
            </div>
            
            <div 
                className={`overflow-x-auto relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`} 
                ref={scrollRef}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
            >
                <div className="inline-block min-w-full">
                    {/* Sticky Header with Dates */}
                    <div className="flex border-b bg-muted/50 sticky top-0 z-30">
                        <div className="w-32 flex-shrink-0 p-3 border-r bg-background sticky left-0 z-40 font-bold text-sm text-muted-foreground shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                            Tipo
                        </div>
                        {days.map((day, index) => {
                            const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                            const DAYS_OF_WEEK = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
                            const showMonthString = index === 0 || day.getDate() === 1;
                            return (
                                <div key={index} className={`w-20 flex-shrink-0 p-2 text-center border-r last:border-r-0 relative ${isWeekend ? 'bg-muted/30' : ''}`}>
                                    {showMonthString && (
                                        <div className="absolute -top-6 left-0 bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-r-md whitespace-nowrap z-10 border border-primary/20">
                                            {day.toLocaleString('es-AR', { month: 'long', year: 'numeric' })}
                                        </div>
                                    )}
                                    <div className="text-[10px] font-bold uppercase text-muted-foreground">{DAYS_OF_WEEK[day.getDay()]}</div>
                                    <div className="text-xs font-medium">{day.getDate()}</div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="inline-block min-w-full bg-white">
                        {types.sort((a, b) => {
                            // Custom sort order
                            const order = [
                                'Unidad Tipo A',
                                'Unidad Tipo B',
                                'Unidad Tipo C',
                                'Unidad Tipo C+',
                                'Unidad Tipo D',
                                'Fontana'
                            ];
                            return order.indexOf(a) - order.indexOf(b);
                        }).map(type => (
                            <div key={type} className="flex border-b last:border-b-0 text-xs">
                                <div className="w-32 flex-shrink-0 p-2 font-medium bg-background border-r sticky left-0 z-20 truncate shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] flex items-center" title={type}>
                                    {type}
                                </div>
                                {days.map((day, i) => {
                                    const { available, occupied } = getAvailability(day, type); // Fixed arg order
                                    const isFull = available === 0;
                                    
                                    return (
                                        <div key={i} className={`w-20 flex-shrink-0 p-2 text-center border-r last:border-r-0 flex flex-col justify-center ${isFull ? 'bg-red-50 text-red-800' : ''}`}>
                                            <div>
                                                <span className="font-bold text-emerald-600">{available}</span>
                                                <span className="text-gray-300 mx-1">/</span>
                                                <span className="text-gray-400">{occupied}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="p-4 border-t text-xs text-muted-foreground bg-white">
                <div className="flex gap-4">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-600"></span> Verde: Disponibles</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-400"></span> Gris: Ocupadas</span>
                </div>
            </div>
        </Card>
    );
}
