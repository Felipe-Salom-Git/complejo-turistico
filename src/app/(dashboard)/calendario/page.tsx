'use client';

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Split, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useReservations, Reservation } from "@/contexts/ReservationsContext";
import { useMaintenance } from "@/contexts/MaintenanceContext";
import { useRouter } from "next/navigation";
import { getAllUnits, generateMonthDays } from "@/lib/calendar-logic";
import { CalendarTabs } from "@/components/calendar/CalendarTabs";

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export default function Calendario() {
  const router = useRouter();
  const { reservations, updateReservation, splitReservation } = useReservations();
  const { tickets } = useMaintenance();

  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 1)); // Dec 2025 default per mock
  const [draggedReservation, setDraggedReservation] = useState<Reservation | null>(null);
  const [splitDialogOpen, setSplitDialogOpen] = useState(false);

  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [splitDate, setSplitDate] = useState<string>("");
  const [splitUnit, setSplitUnit] = useState<string>("");

  const UNITS = getAllUnits();
  const days = generateMonthDays(currentDate);

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1));
    setCurrentDate(newDate);
  };

  // Drag & Drop Handlers
  const handleDragStart = (e: React.DragEvent, reservation: Reservation) => {
    setDraggedReservation(reservation);
    e.dataTransfer.effectAllowed = "move";
  };

  const [pendingMove, setPendingMove] = useState<{
    reservation: Reservation;
    newUnit: string;
    newCheckIn: Date;
    newCheckOut: Date;
  } | null>(null);

  const handleDrop = (e: React.DragEvent, targetUnit: string, targetDate: Date) => {
    e.preventDefault();
    if (!draggedReservation) return;

    const duration = Math.ceil((draggedReservation.checkOut.getTime() - draggedReservation.checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const newCheckIn = new Date(targetDate);
    const newCheckOut = new Date(targetDate);
    newCheckOut.setDate(newCheckOut.getDate() + duration);

    newCheckIn.setHours(12, 0, 0, 0);
    newCheckOut.setHours(12, 0, 0, 0);

    // Conflict Check
    const hasConflict = reservations.some(res => {
      if (res.id === draggedReservation.id || res.unit !== targetUnit) return false;
      const resStart = new Date(res.checkIn);
      const resEnd = new Date(res.checkOut);
      resStart.setHours(12, 0, 0, 0);
      resEnd.setHours(12, 0, 0, 0);
      return (newCheckIn < resEnd && newCheckOut > resStart && res.status !== 'cancelled' && res.status !== 'no-show');
    });

    if (hasConflict) {
      alert("⚠️ Conflicto: Ya existe una reserva en esas fechas");
      setDraggedReservation(null);
      return;
    }

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

  // Split Logic
  const handleSplitReservation = () => {
    if (!selectedReservation || !splitDate || !splitUnit) return;
    const splitDateTime = new Date(splitDate);
    if (splitDateTime <= selectedReservation.checkIn || splitDateTime >= selectedReservation.checkOut) {
      alert("⚠️ Fecha inválida");
      return;
    }
    splitReservation(selectedReservation.id, splitDateTime, splitUnit);
    setSplitDialogOpen(false);
    setSelectedReservation(null);
    setSplitDate("");
    setSplitUnit("");
  };

  const handleContextMenu = (e: React.MouseEvent, res: Reservation) => {
    e.preventDefault();
    setSelectedReservation(res);
    setSplitDialogOpen(true);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Calendario</h1>
          <p className="text-muted-foreground">{UNITS.length} unidades disponibles</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white p-1 rounded-md border shadow-sm">
            <Button variant="ghost" size="icon" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="min-w-[140px] text-center font-bold">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </div>
            <Button variant="ghost" size="icon" onClick={() => navigateMonth("next")}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Button className="bg-[var(--color-primary)] text-white" onClick={() => router.push('/nueva-reserva')}>
            <Plus className="w-4 h-4 mr-2" /> Nueva
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <CalendarTabs
        units={UNITS}
        days={days}
        reservations={reservations}
        tickets={tickets}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
        onContextMenu={handleContextMenu}
      />

      {/* Dialogs */}
      <Dialog open={!!pendingMove} onOpenChange={(open) => !open && setPendingMove(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Movimiento</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="bg-muted/50 p-3 rounded-md space-y-1">
              <p className="text-sm font-medium">Reserva: <span className="font-normal">{pendingMove?.reservation.guestName}</span></p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border rounded-md bg-white">
                <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Actual</p>
                <p className="font-medium text-sm">{pendingMove?.reservation.unit}</p>
                <p className="text-xs text-gray-500">
                  {pendingMove?.reservation.checkIn.toLocaleDateString('es-AR')} - {pendingMove?.reservation.checkOut.toLocaleDateString('es-AR')}
                </p>
              </div>

              <div className="p-3 border border-blue-200 rounded-md bg-blue-50">
                <p className="text-xs font-bold text-blue-600 uppercase mb-1">Nuevo Destino</p>
                <p className="font-medium text-sm text-blue-900">{pendingMove?.newUnit}</p>
                <p className="text-xs text-blue-700 font-bold">
                  {pendingMove?.newCheckIn.toLocaleDateString('es-AR')} - {pendingMove?.newCheckOut.toLocaleDateString('es-AR')}
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Verifique que las fechas y unidad sean correctas antes de confirmar.
            </p>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setPendingMove(null)}>Cancelar</Button>
            <Button onClick={confirmMove} className="bg-blue-600 hover:bg-blue-700">Confirmar</Button>
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
                <Label>Nueva unidad</Label>
                <Select value={splitUnit} onValueChange={setSplitUnit}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar unidad" /></SelectTrigger>
                  <SelectContent>
                    {UNITS.filter(u => u.name !== selectedReservation.unit).map((unit) => (
                      <SelectItem key={unit.id} value={unit.name}>{unit.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSplitReservation} className="w-full">Dividir</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

