import React from 'react';
import { CalendarUnit, getCleaningTasks, getOccupyingReservation, getOccupyingTicket } from '@/lib/calendar-logic';
import { Reservation, ReservationSegment } from '@/contexts/ReservationsContext';
import { Ticket } from '@/contexts/MaintenanceContext';
import { Badge } from '@/components/ui/badge';
import { Wrench, Droplets, SprayCan } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CalendarUnitRowProps {
    unit: CalendarUnit;
    days: Date[];
    reservations: Reservation[];
    tickets: Ticket[];
    onDragStart: (e: React.DragEvent, res: Reservation, segment?: ReservationSegment, anchorDate?: Date) => void;
    onDrop: (e: React.DragEvent, unit: string, date: Date) => void;
    onDragOver: (e: React.DragEvent, unit: string, date: Date) => void;
    ghostOverlay: { unit: string; checkIn: Date; checkOut: Date; isValid: boolean; } | null;
    onContextMenu: (e: React.MouseEvent, res: Reservation) => void;
    onCellClick: (unit: string, date: Date, res?: Reservation) => void;
}

export function CalendarUnitRow({ unit, days, reservations, tickets, onDragStart, onDrop, onDragOver, ghostOverlay, onContextMenu, onCellClick }: CalendarUnitRowProps) {



    const getReservation = (date: Date) => getOccupyingReservation(unit.name, date, reservations);
    const getMaintenance = (date: Date) => getOccupyingTicket(unit.name, date, tickets);

    return (
        <div className="flex border-b last:border-b-0 h-[35px]">
            {/* Sticky Unit Column */}
            <div className="w-24 flex-shrink-0 px-2 py-1 border-r bg-background sticky left-0 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] flex flex-col justify-center">
                <div className="font-bold text-sm leading-none">{unit.name}</div>
                <div className="text-[8px] uppercase tracking-wider text-muted-foreground leading-none mt-0.5">{unit.type}</div>
            </div>

            {days.map((day, index) => {
                const reservation = getReservation(day);
                const maintenance = getMaintenance(day);

                // Check for Cleaning Tasks overlaid on this day
                let cleaningTask = null;
                if (reservation) {
                    // Use persisted schedule or fallback to calculation (migration)
                    const cleanings = reservation.cleaningSchedule || getCleaningTasks(reservation);

                    cleaningTask = cleanings.find(c => {
                        // Ensure we are working with Date objects (hydration should handle it, but safe practice)
                        const cDate = new Date(c.date);
                        return cDate.getDate() === day.getDate() &&
                            cDate.getMonth() === day.getMonth();
                    });
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

                // Determine if this cell is the start or end of the reservation block in this row
                let isStart = false;
                let isEnd = false;
                let showLabel = false;

                if (reservation) {
                    const prevRes = index > 0 ? getReservation(days[index - 1]) : null;
                    const nextRes = index < days.length - 1 ? getReservation(days[index + 1]) : null;

                    isStart = !prevRes || prevRes.id !== reservation.id;
                    isEnd = !nextRes || nextRes.id !== reservation.id;
                    showLabel = isStart;
                }

                // Calculate Span for Centering Label
                let span = 1;
                if (isStart && reservation) {
                    let lookahead = index + 1;
                    while (lookahead < days.length) {
                        const next = getReservation(days[lookahead]);
                        if (next && next.id === reservation.id) {
                            span++;
                            lookahead++;
                        } else {
                            break;
                        }
                    }
                }

                return (
                    <div
                        key={index}
                        className={`w-20 flex-shrink-0 p-1 border-r last:border-r-0 relative group bg-background hover:bg-muted/20 cursor-pointer ${isStart ? 'z-10' : 'z-0'}`}
                        onDragOver={(e) => onDragOver(e, unit.name, day)}
                        onDrop={(e) => onDrop(e, unit.name, day)}
                        onContextMenu={(e) => {
                            e.preventDefault();
                            onCellClick(unit.name, day, reservation);
                        }}
                    >
                        {/* Ghost Overlay */}
                        {ghostOverlay && ghostOverlay.unit === unit.name &&
                            day.getTime() >= new Date(ghostOverlay.checkIn).setHours(0, 0, 0, 0) &&
                            day.getTime() < new Date(ghostOverlay.checkOut).setHours(0, 0, 0, 0) && (
                                <div className={`absolute inset-0 z-20 pointer-events-none opacity-60 border-2 border-dashed
                                ${ghostOverlay.isValid ? 'bg-indigo-200 border-indigo-600' : 'bg-red-200 border-red-600'}`}
                                />
                            )}
                        {reservation ? (
                            <TooltipProvider>
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        <div
                                            draggable
                                            onDragStart={(e) => {
                                                // Identify specific segment if exists
                                                let segment = undefined;
                                                if (reservation.segments) {
                                                    const dateTime = day.getTime();
                                                    segment = reservation.segments.find(s => {
                                                        const sIn = new Date(s.checkIn).getTime();
                                                        const sOut = new Date(s.checkOut).getTime();
                                                        return dateTime >= sIn && dateTime < sOut;
                                                    });
                                                }
                                                onDragStart(e, reservation, segment, day);
                                            }}
                                            className={`h-full relative overflow-hidden transition-all shadow-sm hover:brightness-105
                                                ${reservation.alertaPrecobroActiva ? 'bg-amber-100 text-amber-900 border-amber-300' :
                                                    reservation.status === 'active' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                                        reservation.status === 'checkout' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                                            reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                                                                reservation.status === 'cleaning' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' :
                                                                    'bg-gray-100 border-gray-200'}
                                                ${isStart ? 'rounded-l-md border-l border-t border-b pl-2' : 'border-t border-b -ml-1'} 
                                                ${isEnd ? 'rounded-r-md border-r' : '-mr-1'}
                                            `}
                                        >
                                            {/* CONTENT RENDER LOGIC */}
                                            {maintenance && reservation.status === 'cleaning' ? (
                                                /* SPLIT VIEW: Maintenance (Left) + Cleaning (Right) */
                                                <div className="absolute inset-0 flex flex-row">
                                                    <div className="flex-1 bg-red-100 flex items-center justify-center border-r border-red-200">
                                                        <Wrench className="w-3.5 h-3.5 text-red-600" />
                                                    </div>
                                                    <div className="flex-1 bg-cyan-100 flex items-center justify-center">
                                                        <SprayCan className="w-3.5 h-3.5 text-cyan-600" />
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    {/* STANDARD VIEW */}
                                                    {reservation.status === 'cleaning' && (
                                                        /* Cleaning Only: Center Icon */
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <SprayCan className="w-4 h-4 text-cyan-700 opacity-80" />
                                                        </div>
                                                    )}

                                                    {/* Maintenance Line (Replaces Badge) */}
                                                    {maintenance && (
                                                        <div className={`
                                                            absolute left-0 right-0 h-1 z-10 bg-red-500
                                                            ${cleaningTask ? 'bottom-1' : 'bottom-0'}
                                                        `}></div>
                                                    )}

                                                    {/* Scheduled Cleaning Icon Overlay - Bottom Bar */}
                                                    {cleaningTask && (
                                                        <div className={`
                                                            absolute bottom-0 left-0 right-0 h-1 z-10
                                                            ${cleaningTask.type === 'toallas' ? 'bg-cyan-500' : 'bg-purple-500'}
                                                        `}></div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className="text-xs">
                                            <p className="font-bold">{day.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric' })}</p>
                                            <p>{reservation.guestName}</p>
                                            {cleaningTask && (
                                                <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-muted-foreground">
                                                    {cleaningTask.type === 'toallas' ? <Droplets className="w-3 h-3 text-cyan-500" /> : <SprayCan className="w-3 h-3 text-purple-500" />}
                                                    <span>Limpieza: {cleaningTask.type === 'toallas' ? 'Toallas' : 'Completa'}</span>
                                                </div>
                                            )}
                                            {maintenance && (
                                                <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-red-600">
                                                    <Wrench className="w-3 h-3" />
                                                    <span>Mantenimiento: {maintenance.problema}</span>
                                                </div>
                                            )}
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ) : maintenance ? (
                            <TooltipProvider>
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        <div className="h-full p-2 rounded-lg border bg-red-50 border-red-200 text-red-800 flex items-center justify-center cursor-help">
                                            <Wrench className="w-4 h-4" />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className="text-xs">
                                            <p className="font-bold">{day.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric' })}</p>
                                            <div className="flex items-center gap-1 mt-1 font-semibold text-red-600">
                                                <Wrench className="w-3 h-3" />
                                                <span>{maintenance.problema}</span>
                                            </div>
                                            {maintenance.prioridad && <p className="opacity-80">Prioridad: {maintenance.prioridad}</p>}
                                            <p className="text-[10px] mt-1 text-white font-mono border-t border-white/20 pt-1">
                                                {(() => {
                                                    const parseLocal = (dStr: string | Date | undefined) => {
                                                        if (!dStr) return new Date();
                                                        const s = dStr.toString().split('T')[0];
                                                        const [y, m, d] = s.split('-').map(Number);
                                                        return new Date(y, m - 1, d);
                                                    };
                                                    const start = parseLocal(maintenance.fechaInicio || maintenance.fecha);
                                                    const end = maintenance.fechaFin ? parseLocal(maintenance.fechaFin) : new Date(start);
                                                    const checkout = new Date(end);
                                                    checkout.setDate(checkout.getDate() + 1);
                                                    return `${start.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })} - ${checkout.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })} (Salida)`;
                                                })()}
                                            </p>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ) : (
                            <div className="h-full rounded-md border-dashed border border-transparent hover:border-gray-200 transition-all"></div>
                        )}

                        {/* Spanning Label Overlay - Rendered only on Start Cell of Normal Reservations */}
                        {isStart && reservation && reservation.status !== 'cleaning' && (
                            <div
                                className="absolute top-0 bottom-0 left-0 flex items-center justify-center pointer-events-none"
                                style={{ width: `calc(100% * ${span})` }}
                            >
                                <div className={`px-2 py-1 text-[10px] font-bold flex whitespace-nowrap z-20 text-indigo-950`}>
                                    <span>{reservation.guestName}</span>
                                    {reservation.pax && <span className="ml-1 opacity-70">({reservation.pax})</span>}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
