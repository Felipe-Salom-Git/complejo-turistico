import React from 'react';
import { Card } from '@/components/ui/card';
import { CalendarUnit } from '@/lib/calendar-logic';
import { Reservation } from '@/contexts/ReservationsContext';
import { Ticket } from '@/contexts/MaintenanceContext';
import { CalendarUnitRow } from './CalendarUnitRow';

interface CalendarGridProps {
    units: CalendarUnit[];
    days: Date[];
    reservations: Reservation[];
    tickets: Ticket[];
    onDragStart: (e: React.DragEvent, res: Reservation) => void;
    onDrop: (e: React.DragEvent, unit: string, date: Date) => void;
    onContextMenu: (e: React.MouseEvent, res: Reservation) => void;
}

const DAYS_OF_WEEK = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

import { useDraggableScroll } from '@/hooks/useDraggableScroll';

export function CalendarGrid({ units, days, reservations, tickets, onDragStart, onDrop, onContextMenu }: CalendarGridProps) {
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const { onMouseDown, onMouseUp, onMouseMove, onMouseLeave, isDragging } = useDraggableScroll(scrollRef);

    React.useEffect(() => {
        if (scrollRef.current) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            // Find index of today in days array
            const todayIndex = days.findIndex(d => {
                const dDate = new Date(d);
                dDate.setHours(0, 0, 0, 0);
                return dDate.getTime() === today.getTime();
            });

            if (todayIndex !== -1) {
                // Calculation: Unit Column Width (128px/8rem) + (todayIndex * Day Column Width (80px/5rem))
                // Actually: Unit column is w-32 (128px). Days are w-20 (80px).
                // Sticky column doesn't affect scrollLeft position relative to content, but we want it visible?
                // scrollLeft = 0 shows Unit + Day 0.
                // We want Unit + Today.
                // So scroll to todayIndex * 80.
                const scrollPos = todayIndex * 80;
                scrollRef.current.scrollLeft = scrollPos;
            }
        }
    }, [days]);

    return (
        <Card className="overflow-hidden border shadow-sm">
            <div 
                className={`overflow-x-auto relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                ref={scrollRef}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
            >
                <div className="inline-block min-w-full">
                    {/* Header Row */}
                    <div className="flex border-b bg-muted/50 sticky top-0 z-30">
                        <div className="w-32 flex-shrink-0 p-3 border-r bg-background sticky left-0 z-40 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                            <span className="font-bold text-sm text-muted-foreground">Unidad</span>
                        </div>
                        {days.map((day, index) => {
                            const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                            // Show month name if it's the first day of the grid OR the first day of a month
                            const showMonthString = index === 0 || day.getDate() === 1;
                            
                            return (
                                <div key={index} className={`w-20 flex-shrink-0 p-2 border-r last:border-r-0 text-center relative ${isWeekend ? 'bg-muted/30' : ''}`}>
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

                    {/* Body */}
                    <div className="bg-white">
                        {units.map((unit) => (
                            <CalendarUnitRow
                                key={unit.id}
                                unit={unit}
                                days={days}
                                reservations={reservations}
                                tickets={tickets}
                                onDragStart={onDragStart}
                                onDrop={onDrop}
                                onContextMenu={onContextMenu}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
}
