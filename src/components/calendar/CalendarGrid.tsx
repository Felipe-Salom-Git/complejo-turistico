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

export function CalendarGrid({ units, days, reservations, tickets, onDragStart, onDrop, onContextMenu }: CalendarGridProps) {
    return (
        <Card className="overflow-hidden border shadow-sm">
            <div className="overflow-x-auto relative">
                <div className="inline-block min-w-full">
                    {/* Header Row */}
                    <div className="flex border-b bg-muted/50 sticky top-0 z-30">
                        <div className="w-32 flex-shrink-0 p-3 border-r bg-background sticky left-0 z-40 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                            <span className="font-bold text-sm text-muted-foreground">Unidad</span>
                        </div>
                        {days.map((day, index) => {
                            const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                            return (
                                <div key={index} className={`w-20 flex-shrink-0 p-2 border-r last:border-r-0 text-center ${isWeekend ? 'bg-muted/30' : ''}`}>
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
