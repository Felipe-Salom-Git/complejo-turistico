'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarUnit, sortUnitsNumerically } from '@/lib/calendar-logic';
import { Reservation } from '@/contexts/ReservationsContext';
import { Ticket } from '@/contexts/MaintenanceContext';
import { CalendarGrid } from './CalendarGrid';
import { AvailabilitySummary } from './AvailabilitySummary';
import { Input } from '@/components/ui/input';
import { Search, MapPin } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CalendarTabsProps {
    units: CalendarUnit[];
    days: Date[];
    reservations: Reservation[];
    tickets: Ticket[];
    onDragStart: (e: React.DragEvent, res: Reservation) => void;
    onDrop: (e: React.DragEvent, unit: string, date: Date) => void;
    onContextMenu: (e: React.MouseEvent, res: Reservation) => void;
}

export function CalendarTabs({ units, days, reservations, tickets, onDragStart, onDrop, onContextMenu }: CalendarTabsProps) {
    const [search, setSearch] = useState('');
    const [unitFilter, setUnitFilter] = useState('all');

    // 1. Separate Units by Complex
    const gaviotasUnits = sortUnitsNumerically(units.filter(u => u.complex === 'Las Gaviotas'));
    const fontanaUnits = sortUnitsNumerically(units.filter(u => u.complex === 'La Fontana'));

    // 2. Filter Logic (Las Gaviotas only per specs)
    const filterUnits = (list: CalendarUnit[]) => {
        return list.filter(u => {
            // Unit Filter
            if (unitFilter !== 'all' && u.name !== unitFilter) return false;

            // Search Filter (Occupant Name) - Checks if unit has ANY reservation matching search in current view
            // Actually, prompt says: "Filtra reservas visibles... no afecta limpiezas... el buscador no cambia datos, solo visibilidad" -> "Filtra reservas visibles en el calendario"?
            // Or filters UNITS that match? Usually search filters ROWS. 
            // "Buscar por nombre del pasajero... Filtra reservas visibles" implies: Only show units that have a reservation with that guest? Or filter the reservation blocks themselves?
            // "El buscador no cambia datos, solo visibilidad".
            // Let's assume it filters ROWS (Units) that contain matching reservations.

            if (search) {
                // Check if this unit has matching reservation in current visible days
                const hasMatch = reservations.some(r =>
                    r.unit === u.name &&
                    r.guestName.toLowerCase().includes(search.toLowerCase())
                    // Need to check overlap with days? Maybe overkill, just global match for unit is safer UX.
                );
                if (!hasMatch) return false;
            }

            return true;
        });
    };

    const filteredGaviotas = filterUnits(gaviotasUnits);
    // Fontana doesn't have filters per specs ("Filtros y buscador (solo Las Gaviotas)")
    // But good UX might imply keeping it consistent. Prompt strict: "Filtro y buscador (solo Las Gaviotas)". I will abide.

    return (
        <Tabs defaultValue="gaviotas" className="w-full">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                <TabsList className="grid w-full max-w-[400px] grid-cols-2">
                    <TabsTrigger value="gaviotas">Las Gaviotas</TabsTrigger>
                    <TabsTrigger value="fontana">La Fontana</TabsTrigger>
                </TabsList>

                {/* Controls - Only visible for active tab effectively, or swap content */}
                {/* We render controls here. We can hide/show based on active tab state if we lift state, 
                    but Tabs component manages state internally. We can put controls INSIDE TabsContent. */}
            </div>

            <TabsContent value="gaviotas" className="space-y-4">
                {/* Filters Board (Gaviotas Only) */}
                <div className="flex gap-4 p-4 bg-white rounded-lg border shadow-sm items-center flex-wrap">
                    <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                        <Search className="w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar pasajero..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-8"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-[180px]">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <Select value={unitFilter} onValueChange={setUnitFilter}>
                            <SelectTrigger className="h-8">
                                <SelectValue placeholder="Todas las unidades" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas las unidades</SelectItem>
                                {gaviotasUnits.map(u => (
                                    <SelectItem key={u.id} value={u.name}>{u.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <CalendarGrid
                    units={filteredGaviotas}
                    days={days}
                    reservations={reservations}
                    tickets={tickets}
                    onDragStart={onDragStart}
                    onDrop={onDrop}
                    onContextMenu={onContextMenu}
                />

                <AvailabilitySummary days={days} units={filteredGaviotas} reservations={reservations} />
            </TabsContent>

            <TabsContent value="fontana" className="space-y-4">
                {/* No filters for Fontana */}
                <CalendarGrid
                    units={fontanaUnits}
                    days={days}
                    reservations={reservations}
                    tickets={tickets}
                    onDragStart={onDragStart}
                    onDrop={onDrop}
                    onContextMenu={onContextMenu}
                />

                <AvailabilitySummary days={days} units={fontanaUnits} reservations={reservations} />
            </TabsContent>
        </Tabs>
    );
}
