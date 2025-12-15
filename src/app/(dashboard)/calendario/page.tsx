'use client';

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Filter, Split, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useReservations, Reservation, UNIT_GROUPS } from "@/contexts/ReservationsContext";
import { useRouter } from "next/navigation";

// Generate UNITS from UNIT_GROUPS shared with Context
const UNITS = Object.entries(UNIT_GROUPS).flatMap(([groupName, units]) =>
  units.map((unitName) => {
    let type = "Estándar";
    let complex = "Las Gaviotas";

    if (groupName.includes("Tipo A")) type = "Cabaña"; // Mapping approximation
    else if (groupName.includes("Tipo B")) type = "Cabaña";
    else if (groupName.includes("Tipo C")) type = "Cabaña";
    else if (groupName.includes("Fontana")) {
      complex = "La Fontana";
      type = "Apartamento";
    }

    // Preserve the group name as type for detailed view or filter?
    // The previous implementation used "Cabaña", "Apartamento".
    // Let's use the group name as the "Detailed Type" but map to broad types for filters if needed.
    // For now, let's just use the Group Name as Type to be precise as user requested.
    type = groupName;

    return {
      id: unitName, // use name as ID to be safe or unique string
      name: unitName,
      type: type,
      complex: complex
    };
  })
);

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export default function Calendario() {
  const router = useRouter();
  const { reservations, updateReservation, splitReservation } = useReservations();
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 1)); // December 2025
  const [filterType, setFilterType] = useState<string>("all");
  const [filterComplex, setFilterComplex] = useState<string>("all");
  const [draggedReservation, setDraggedReservation] = useState<Reservation | null>(null);
  const [splitDialogOpen, setSplitDialogOpen] = useState(false);

  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [splitDate, setSplitDate] = useState<string>("");
  const [splitUnit, setSplitUnit] = useState<string>("");

  const generateDays = () => {
    const days = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);

    for (let i = 0; i < 14; i++) {
      const day = new Date(firstDay);
      day.setDate(firstDay.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const days = generateDays();

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1));
    setCurrentDate(newDate);
  };

  const getReservationForUnitAndDate = (unitName: string, date: Date) => {
    return reservations.find((res) => {
      if (res.unit !== unitName) return false;
      const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const checkIn = new Date(res.checkIn.getFullYear(), res.checkIn.getMonth(), res.checkIn.getDate());
      const checkOut = new Date(res.checkOut.getFullYear(), res.checkOut.getMonth(), res.checkOut.getDate());
      return dateOnly >= checkIn && dateOnly < checkOut;
    });
  };

  const isCheckoutDay = (reservation: Reservation, date: Date): boolean => {
    const checkOutDate = new Date(reservation.checkOut);
    const compareDate = new Date(date);
    return checkOutDate.getFullYear() === compareDate.getFullYear() &&
      checkOutDate.getMonth() === compareDate.getMonth() &&
      checkOutDate.getDate() === compareDate.getDate();
  };

  const getStatusColor = (status: string | undefined, isDragging = false) => {
    const baseColors = {
      active: "bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-700 dark:text-emerald-300",
      checkout: "bg-rose-100 border-rose-300 text-rose-800 dark:bg-rose-900/30 dark:border-rose-700 dark:text-rose-300",
      cleaning: "bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-300",
      default: "bg-gray-50 border-gray-200 text-gray-400 dark:bg-gray-800 dark:border-gray-700"
    };

    const color = baseColors[status as keyof typeof baseColors] || baseColors.default;
    return isDragging ? `${color} opacity-50 cursor-grabbing` : `${color} cursor-grab`;
  };

  const getStatusLabel = (status: string | undefined) => {
    const labels = {
      active: "Ocupado",
      checkout: "Check-out",
      cleaning: "Limpieza",
      default: "Libre"
    };
    return labels[status as keyof typeof labels] || labels.default;
  };

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, reservation: Reservation) => {
    setDraggedReservation(reservation);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  // Move Confirmation State
  const [pendingMove, setPendingMove] = useState<{
    reservation: Reservation;
    newUnit: string;
    newCheckIn: Date;
    newCheckOut: Date;
  } | null>(null);

  // ... (existing helper functions)

  const handleDrop = (e: React.DragEvent, targetUnit: string, targetDate: Date) => {
    e.preventDefault();

    if (!draggedReservation) return;

    const duration = Math.ceil((draggedReservation.checkOut.getTime() - draggedReservation.checkIn.getTime()) / (1000 * 60 * 60 * 24));

    const newCheckIn = new Date(targetDate);
    const newCheckOut = new Date(targetDate);
    newCheckOut.setDate(newCheckOut.getDate() + duration);

    // Normalize times to noon
    newCheckIn.setHours(12, 0, 0, 0);
    newCheckOut.setHours(12, 0, 0, 0);

    const hasConflict = reservations.some(res => {
      if (res.id === draggedReservation.id || res.unit !== targetUnit) return false;
      const resStart = new Date(res.checkIn);
      const resEnd = new Date(res.checkOut);
      resStart.setHours(12, 0, 0, 0);
      resEnd.setHours(12, 0, 0, 0);

      return (newCheckIn < resEnd && newCheckOut > resStart);
    });

    if (hasConflict) {
      alert("⚠️ Conflicto: Ya existe una reserva en esas fechas para esta unidad");
      setDraggedReservation(null);
      return;
    }

    // Set Pending Move for Confirmation
    setPendingMove({
      reservation: draggedReservation,
      newUnit: targetUnit,
      newCheckIn,
      newCheckOut
    });

    setDraggedReservation(null);
  };

  const confirmMove = () => {
    if (!pendingMove) return;

    updateReservation({
      ...pendingMove.reservation,
      unit: pendingMove.newUnit,
      checkIn: pendingMove.newCheckIn,
      checkOut: pendingMove.newCheckOut
    });

    setPendingMove(null);
  };

  // ... (existing handlers)



  // Split reservation
  const handleSplitReservation = () => {
    if (!selectedReservation || !splitDate || !splitUnit) return;

    const splitDateTime = new Date(splitDate);

    if (splitDateTime <= selectedReservation.checkIn || splitDateTime >= selectedReservation.checkOut) {
      alert("⚠️ La fecha de división debe estar dentro del rango de la reserva");
      return;
    }

    splitReservation(selectedReservation.id, splitDateTime, splitUnit);

    setSplitDialogOpen(false);
    setSelectedReservation(null);
    setSplitDate("");
    setSplitUnit("");
  };

  const filteredUnits = UNITS.filter((unit) => {
    if (filterType !== "all" && unit.type !== filterType) return false;
    if (filterComplex !== "all" && unit.complex !== filterComplex) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendario de Reservas</h1>
          <p className="text-muted-foreground mt-1">
            {UNITS.length} unidades • Arrastra para mover • Click derecho para dividir
          </p>
        </div>

        <Button
          className="bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90"
          onClick={() => router.push('/nueva-reserva')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Reserva
        </Button>
      </div>

      {/* Confirmation Dialog for Move */}
      <Dialog open={!!pendingMove} onOpenChange={(open) => !open && setPendingMove(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Movimiento</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p>Estás moviendo la reserva de <strong>{pendingMove?.reservation.guestName}</strong>.</p>
            <div className="grid grid-cols-2 gap-4 text-sm bg-muted p-3 rounded">
              <div>
                <span className="block text-gray-500 text-xs">Desde:</span>
                <div className="font-medium">{pendingMove?.reservation.unit}</div>
                <div>{pendingMove?.reservation.checkIn.toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}</div>
              </div>
              <div>
                <span className="block text-blue-600 text-xs font-bold">Hacia:</span>
                <div className="font-medium text-blue-700">{pendingMove?.newUnit}</div>
                <div className="text-blue-700 font-bold">{pendingMove?.newCheckIn.toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}</div>
              </div>
            </div>
            <p className="text-sm text-gray-500">¿Desea guardar estos cambios?</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setPendingMove(null)}>Cancelar</Button>
            <Button onClick={confirmMove} className="bg-blue-600 hover:bg-blue-700">Confirmar Cambios</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Split Dialog */}
      <Dialog open={splitDialogOpen} onOpenChange={setSplitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dividir Reserva</DialogTitle>
          </DialogHeader>
          {selectedReservation && (
            <div className="space-y-4 pt-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm"><strong>Huésped:</strong> {selectedReservation.guestName}</p>
                <p className="text-sm"><strong>Unidad actual:</strong> {selectedReservation.unit}</p>
                <p className="text-sm">
                  <strong>Fechas:</strong> {selectedReservation.checkIn.toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })} - {selectedReservation.checkOut.toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Fecha de división</Label>
                <Input
                  type="date"
                  value={splitDate}
                  onChange={(e) => setSplitDate(e.target.value)}
                  min={selectedReservation.checkIn.toISOString().split('T')[0]}
                  max={selectedReservation.checkOut.toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label>Nueva unidad (segunda parte)</Label>
                <Select value={splitUnit} onValueChange={setSplitUnit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar unidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITS.filter(u => u.name !== selectedReservation.unit).map((unit) => (
                      <SelectItem key={unit.id} value={unit.name}>
                        {unit.name} - {unit.type} ({unit.complex})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90"
                  onClick={handleSplitReservation}
                  disabled={!splitDate || !splitUnit}
                >
                  <Split className="w-4 h-4 mr-2" />
                  Dividir Reserva
                </Button>
                <Button variant="outline" onClick={() => setSplitDialogOpen(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="min-w-[200px] text-center">
              <span className="font-semibold">
                {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
            </div>
            <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-muted-foreground" />

            <Select value={filterComplex} onValueChange={setFilterComplex}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Complejo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los complejos</SelectItem>
                <SelectItem value="Las Gaviotas">Las Gaviotas</SelectItem>
                <SelectItem value="La Fontana">La Fontana</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo de unidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="Cabaña">Cabañas</SelectItem>
                <SelectItem value="Apartamento">Apartamentos</SelectItem>
                <SelectItem value="Suite">Suites</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Legend */}
      <div className="flex items-center gap-6 px-4 flex-wrap">
        <span className="text-sm font-medium">Leyenda:</span>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-100 border border-emerald-300 dark:bg-emerald-900/30 dark:border-emerald-700"></div>
          <span className="text-sm">Ocupado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-rose-100 border border-rose-300 dark:bg-rose-900/30 dark:border-rose-700"></div>
          <span className="text-sm">Check-out</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-100 border border-amber-300 dark:bg-amber-900/30 dark:border-amber-700"></div>
          <span className="text-sm">Limpieza (cada 3 días)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-50 border border-gray-200 dark:bg-gray-800 dark:border-gray-700"></div>
          <span className="text-sm">Libre</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Header Row */}
            <div className="flex border-b bg-muted/50 sticky top-0 z-10">
              <div className="w-32 flex-shrink-0 p-3 border-r bg-muted/50">
                <span className="font-medium text-sm">Unidad</span>
              </div>
              {days.map((day, index) => (
                <div key={index} className="w-28 flex-shrink-0 p-3 border-r last:border-r-0 text-center">
                  <div className="text-sm font-medium">{DAYS[day.getDay()]}</div>
                  <div className="text-sm mt-1">{day.getDate()}/{day.getMonth() + 1}</div>
                </div>
              ))}
            </div>

            {/* Unit Rows */}
            {filteredUnits.map((unit) => (
              <div key={unit.id} className="flex border-b last:border-b-0">
                <div className="w-32 flex-shrink-0 p-3 border-r bg-muted/30">
                  <div className="font-medium text-sm">{unit.name}</div>
                  <div className="text-xs text-muted-foreground">{unit.type}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{unit.complex}</div>
                </div>
                {days.map((day, index) => {
                  const reservation = getReservationForUnitAndDate(unit.name, day);
                  const isCheckout = reservation && isCheckoutDay(reservation, day);

                  return (
                    <div
                      key={index}
                      className="w-28 flex-shrink-0 p-2 border-r last:border-r-0"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, unit.name, day)}
                    >
                      {reservation ? (
                        <div
                          draggable={reservation.status !== "cleaning"}
                          onDragStart={(e) => reservation.status !== "cleaning" && handleDragStart(e, reservation)}
                          onContextMenu={(e) => {
                            if (reservation.status !== "cleaning") {
                              e.preventDefault();
                              setSelectedReservation(reservation);
                              setSplitDialogOpen(true);
                            }
                          }}
                          className={`h-full min-h-[60px] p-2 rounded-lg border ${getStatusColor(
                            isCheckout ? "checkout" : reservation.status,
                            draggedReservation?.id === reservation.id
                          )} transition-all hover:shadow-md ${reservation.status !== "cleaning" ? "active:cursor-grabbing" : ""}`}
                          title={reservation.status !== "cleaning" ? "Arrastra para mover • Click derecho para dividir" : "Limpieza automática"}
                        >
                          <div className="text-xs font-medium truncate">
                            {reservation.guestName}
                          </div>
                          <Badge variant="secondary" className="mt-1 text-xs bg-white/60 dark:bg-black/20 border-0">
                            {getStatusLabel(isCheckout ? "checkout" : reservation.status)}
                          </Badge>
                        </div>
                      ) : (
                        <div className="h-full min-h-[60px] rounded-lg border border-dashed border-gray-200 dark:border-gray-700 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Unidades</div>
          <div className="text-2xl font-bold mt-1">{filteredUnits.length}</div>
        </Card>
        <Card className="p-4 bg-emerald-50 dark:bg-emerald-950/30">
          <div className="text-sm text-emerald-700 dark:text-emerald-400">Ocupadas</div>
          <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-300 mt-1">
            {reservations.filter((r) => r.status === "active").length}
          </div>
        </Card>
        <Card className="p-4 bg-rose-50 dark:bg-rose-950/30">
          <div className="text-sm text-rose-700 dark:text-rose-400">Check-outs Hoy</div>
          <div className="text-2xl font-bold text-rose-900 dark:text-rose-300 mt-1">
            {reservations.filter((r) => {
              const today = new Date();
              return isCheckoutDay(r, today);
            }).length}
          </div>
        </Card>
        <Card className="p-4 bg-amber-50 dark:bg-amber-950/30">
          <div className="text-sm text-amber-700 dark:text-amber-400">Limpiezas Hoy</div>
          <div className="text-2xl font-bold text-amber-900 dark:text-amber-300 mt-1">
            {reservations.filter((r) => {
              const today = new Date();
              return r.status === "cleaning" && isCheckoutDay(r, today);
            }).length}
          </div>
        </Card>
        <Card className="p-4 bg-gray-50 dark:bg-gray-900/50">
          <div className="text-sm text-muted-foreground">Disponibles</div>
          <div className="text-2xl font-bold mt-1">
            {UNITS.length - reservations.filter((r) => r.status === "active").length}
          </div>
        </Card>
      </div>
    </div>
  );
}
