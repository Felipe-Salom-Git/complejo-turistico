import React from 'react';
import { CalendarUnit, getCleaningTasks } from '@/lib/calendar-logic';
import { Reservation } from '@/contexts/ReservationsContext';
import { Ticket } from '@/contexts/MaintenanceContext';
import { Badge } from '@/components/ui/badge';
import { Wrench, Droplets, SprayCan } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CalendarUnitRowProps {
    unit: CalendarUnit;
    days: Date[];
    reservations: Reservation[];
    tickets: Ticket[];
    onDragStart: (e: React.DragEvent, res: Reservation) => void;
    onDrop: (e: React.DragEvent, unit: string, date: Date) => void;
    onContextMenu: (e: React.MouseEvent, res: Reservation) => void;
}

export function CalendarUnitRow({ unit, days, reservations, tickets, onDragStart, onDrop, onContextMenu }: CalendarUnitRowProps) {

    const getReservation = (date: Date) => {
        return reservations.find((res) => {
            if (res.unit !== unit.name) return false;
            const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            const checkIn = new Date(res.checkIn.getFullYear(), res.checkIn.getMonth(), res.checkIn.getDate());
            const checkOut = new Date(res.checkOut.getFullYear(), res.checkOut.getMonth(), res.checkOut.getDate());
            return dateOnly >= checkIn && dateOnly < checkOut;
        });
    };

    const getMaintenance = (date: Date) => {
        return tickets.find((ticket) => {
            if (ticket.unidad !== unit.name) return false;
            if (ticket.estado === 'completado') return false;
            const ticketStart = new Date(ticket.fechaInicio || ticket.fecha);
            const ticketEnd = ticket.fechaFin ? new Date(ticket.fechaFin) : new Date(ticketStart);
            const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            const checkIn = new Date(ticketStart.getFullYear(), ticketStart.getMonth(), ticketStart.getDate());
            const checkOut = new Date(ticketEnd.getFullYear(), ticketEnd.getMonth(), ticketEnd.getDate());
            return dateOnly >= checkIn && dateOnly <= checkOut;
        });
    };

    return (
        <div className="flex border-b last:border-b-0 h-[60px]">
            {/* Sticky Unit Column */}
            <div className="w-32 flex-shrink-0 p-3 border-r bg-background sticky left-0 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                <div className="font-bold text-lg">{unit.name}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{unit.type}</div>
            </div>

            {days.map((day, index) => {
                const reservation = getReservation(day);
                const maintenance = getMaintenance(day);

                // Check for Cleaning Tasks overlaid on this day
                let cleaningTask = null;
                if (reservation) {
                    // If there is a reservation, check if THIS day corresponds to a cleaning
                    // Optimization: calling getCleaningTasks for every cell is inefficient. 
                    // Better: Iterate cleanings for the active reservation.
                    const cleanings = getCleaningTasks(reservation);
                    cleaningTask = cleanings.find(c =>
                        c.date.getDate() === day.getDate() &&
                        c.date.getMonth() === day.getMonth()
                    );
                }

                const isCheckout = reservation && (
                    reservation.checkOut.getDate() === day.getDate() &&
                    reservation.checkOut.getMonth() === day.getMonth()
                    // Wait, logic for reservation occupying cell is < checkOut.
                    // So if today is checkout day, it technically IS NOT displayed by getReservation logic above ( < checkOut ).
                    // BUT, often we want to show the 'checkout' slice or visually indicate it.
                    // Current logic: `dateOnly >= checkIn && dateOnly < checkOut`.
                    // So on checkout day, `getReservation` returns undefined.
                );

                // We need to handle 'Checkout Day' specially if we want to show it. 
                // Usually checkout day is free for next checkin (afternoon).
                // But visually user wants "Unidad | 1 | 2 ...".
                // If day 5 is checkout, it's half filled?
                // The prompt says "Formato esperado: Unidad | 1 | 2 ...".
                // If we use simple blocks, checkout day is effectively empty/available for next.
                // Let's stick to standard block logic. If it returns res, show it.

                // Handle Drag Over
                const handleDragOver = (e: React.DragEvent) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                };

                return (
                    <div
                        key={index}
                        className="w-20 flex-shrink-0 p-1 border-r last:border-r-0 relative group bg-background"
                        onDragOver={handleDragOver}
                        onDrop={(e) => onDrop(e, unit.name, day)}
                    >
                        {reservation ? (
                            <div
                                draggable
                                onDragStart={(e) => onDragStart(e, reservation)}
                                onContextMenu={(e) => onContextMenu(e, reservation)}
                                className={`h-full p-1 rounded-md border text-[10px] relative overflow-hidden transition-all shadow-sm hover:shadow-md
                                ${reservation.status === 'active' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' :
                                        reservation.status === 'checkout' ? 'bg-rose-50 border-rose-200 text-rose-700' :
                                            'bg-gray-100 border-gray-200'}
                            `}
                            >
                                <div className="font-semibold truncate leading-tight">{reservation.guestName}</div>
                                {reservation.pax && <div className="scale-90 origin-left opacity-80">{reservation.pax} pax</div>}

                                {/* Cleaning Icon Overlay - Bottom Bar */}
                                {cleaningTask && (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className={`
                                                    absolute bottom-0 left-0 right-0 h-4 flex items-center justify-center gap-1 text-[8px] font-bold text-white
                                                    ${cleaningTask.type === 'toallas' ? 'bg-cyan-500' : 'bg-purple-500'}
                                                `}>
                                                    {cleaningTask.type === 'toallas' ? (
                                                        <><Droplets className="w-2 h-2" /> Toallas</>
                                                    ) : (
                                                        <><SprayCan className="w-2 h-2" /> General</>
                                                    )}
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent side="bottom">
                                                <p className="font-semibold">Requiere Limpieza: {cleaningTask.type === 'toallas' ? 'Toallas' : 'Completa'}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                            </div>
                        ) : maintenance ? (
                            <div className="h-full p-2 rounded-lg border bg-red-50 border-red-200 text-red-800 flex flex-col justify-center items-center gap-1">
                                <Wrench className="w-4 h-4" />
                                <span className="text-[10px] text-center leading-none">{maintenance.problema}</span>
                            </div>
                        ) : (
                            <div className="h-full rounded-md border-dashed border border-transparent hover:border-gray-200 transition-all"></div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
