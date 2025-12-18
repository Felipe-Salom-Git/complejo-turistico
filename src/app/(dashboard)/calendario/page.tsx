'use client';

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, MapPin, Users, Droplets, SprayCan, Wrench, MoreVertical, Edit, Trash2, Split, Merge } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { AvailabilitySummary } from '@/components/calendar/AvailabilitySummary';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComp } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useReservations, Reservation, ReservationSegment } from "@/contexts/ReservationsContext";
import { useMaintenance } from "@/contexts/MaintenanceContext";
import { useRouter } from "next/navigation";
import { DateRange } from "react-day-picker";
import { getAllUnits, generateDaysRange, getCleaningTasks } from "@/lib/calendar-logic";
import { CalendarTabs } from "@/components/calendar/CalendarTabs";
import { AddServiceTaskModal } from "@/components/services/AddServiceTaskModal";
import { AddEntryModal } from "@/components/pase-diario/AddEntryModal";
import { AddTicketModal } from "@/components/maintenance/AddTicketModal";
import { useServices } from "@/contexts/ServicesContext";
import { es } from "date-fns/locale";

type GhostOverlay = {
  unit: string;
  checkIn: Date;
  checkOut: Date;
  isValid: boolean;
};

export default function Calendario() {
  const router = useRouter();

  const { reservations, updateReservation, splitReservation, mergeReservations } = useReservations();
  const { tickets } = useMaintenance();
  const { tasks } = useServices();

  // Initialize with current month range
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: firstDay,
    to: lastDay,
  });

  const [draggedReservation, setDraggedReservation] = useState<Reservation | null>(null);
  const [draggedSegment, setDraggedSegment] = useState<ReservationSegment | undefined>(undefined);
  const [dragAnchorDate, setDragAnchorDate] = useState<Date | undefined>(undefined);
  const [splitDialogOpen, setSplitDialogOpen] = useState(false);
  const [ticketToEdit, setTicketToEdit] = useState<any>(null); // State for editing ticket from calendar
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [splitDate, setSplitDate] = useState<string>("");
  const [splitUnit, setSplitUnit] = useState<string>("");

  // Cell Action Modal State
  const [cellActionOpen, setCellActionOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ unit: string, date: Date, reservation?: Reservation } | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ unit: string, date: Date } | null>(null);

  // Modals for Actions
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [entryModalOpen, setEntryModalOpen] = useState(false);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);


  const UNITS = getAllUnits();

  // Integrated Reservations (Real + Service Tasks)
  const allReservations = useMemo(() => {
    const cleaningMocks = tasks
      .filter(t => t.estado === 'pendiente' && t.fechaProgramada && t.unidadId)
      .map(t => {
        const [y, m, d] = (t.fechaProgramada || '').split('-').map(Number);
        const start = new Date(y, m - 1, d);
        const end = new Date(y, m - 1, d + 1); // Covers full day

        // Mock Reservation Object
        return {
          id: `task-${t.id}`,
          unit: t.unidadId!,
          guestName: t.tipoServicio, // Title showed in tooltip
          checkIn: start,
          checkOut: end,
          status: 'cleaning', // Triggers Cyan/Purple styling
          pax: 0,
          hasPet: false,
          amount: 0,
          paid: 0,
          source: 'ServiceTask',
          createdAt: new Date(t.fechaCreacion),
          createdBy: t.creadaPor,
          segments: [],
          cleaningSchedule: []
        } as unknown as Reservation;
      });
    return [...reservations, ...cleaningMocks];
  }, [reservations, tasks]);

  // Robust days generation
  const days = useMemo(() => dateRange?.from && dateRange?.to
    ? generateDaysRange(dateRange.from, dateRange.to)
    : [], [dateRange]);

  const navigateMonth = (direction: "prev" | "next") => {
    if (!dateRange?.from) return;

    // Snap to the 1st of the next/prev month
    const currentMonth = dateRange.from.getMonth();
    const currentYear = dateRange.from.getFullYear();
    const targetDate = new Date(currentYear, currentMonth + (direction === "next" ? 1 : -1), 1);

    const firstDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    const lastDay = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);

    setDateRange({ from: firstDay, to: lastDay });
  };

  // Drag & Drop Handlers
  const handleDragStart = (e: React.DragEvent, reservation: Reservation, segment?: ReservationSegment, anchorDate?: Date) => {
    setDraggedReservation(reservation);
    setDraggedSegment(segment);
    setDragAnchorDate(anchorDate);
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

    // Normalizing Target Date to Noon
    const safeTarget = new Date(targetDate);
    safeTarget.setHours(12, 0, 0, 0);

    let updatedRes: Reservation;

    // A. Segment Move Logic
    if (draggedSegment && draggedReservation.segments) {

      let deltaMs = 0;

      if (dragAnchorDate) {
        const anchor = new Date(dragAnchorDate);
        anchor.setHours(12, 0, 0, 0);
        deltaMs = safeTarget.getTime() - anchor.getTime();
      } else {
        // Fallback to start
        const segStart = new Date(draggedSegment.checkIn);
        segStart.setHours(12, 0, 0, 0);
        deltaMs = safeTarget.getTime() - segStart.getTime();
      }

      // Update Segments
      const newSegments = draggedReservation.segments.map(seg => {
        if (seg.unit === draggedSegment.unit &&
          new Date(seg.checkIn).getTime() === new Date(draggedSegment.checkIn).getTime() &&
          new Date(seg.checkOut).getTime() === new Date(draggedSegment.checkOut).getTime()) {

          // Shift this segment
          const sIn = new Date(seg.checkIn);
          const sOut = new Date(seg.checkOut);

          return {
            ...seg,
            unit: targetUnit, // Move to new unit
            checkIn: new Date(sIn.getTime() + deltaMs),
            checkOut: new Date(sOut.getTime() + deltaMs)
          };
        }
        return seg;
      });

      // Recalculate Min/Max for root properties
      const allStarts = newSegments.map(s => new Date(s.checkIn).getTime());
      const allEnds = newSegments.map(s => new Date(s.checkOut).getTime());
      const minStart = new Date(Math.min(...allStarts));
      const maxEnd = new Date(Math.max(...allEnds));

      updatedRes = {
        ...draggedReservation,
        segments: newSegments,
        checkIn: minStart,
        checkOut: maxEnd,
      };

    } else {
      // B. Legacy / Whole Reservation Move (No segments)
      let newCheckIn: Date;

      if (dragAnchorDate) {
        const anchor = new Date(dragAnchorDate);
        anchor.setHours(12, 0, 0, 0);
        const deltaMs = safeTarget.getTime() - anchor.getTime();

        const oldCheckIn = new Date(draggedReservation.checkIn);
        oldCheckIn.setHours(12, 0, 0, 0);
        newCheckIn = new Date(oldCheckIn.getTime() + deltaMs);
      } else {
        newCheckIn = new Date(safeTarget);
      }

      const duration = Math.ceil((draggedReservation.checkOut.getTime() - draggedReservation.checkIn.getTime()) / (1000 * 60 * 60 * 24));
      const newCheckOut = new Date(newCheckIn);
      newCheckOut.setDate(newCheckIn.getDate() + duration);

      newCheckIn.setHours(12, 0, 0, 0);
      newCheckOut.setHours(12, 0, 0, 0);

      updatedRes = {
        ...draggedReservation,
        unit: targetUnit,
        checkIn: newCheckIn,
        checkOut: newCheckOut,
      };
    }

    // --- Conflict Check ---
    const segmentsToCheck = updatedRes.segments || [{ checkIn: updatedRes.checkIn, checkOut: updatedRes.checkOut, unit: updatedRes.unit }];

    // 1. Check Self-Overlap (Segments overlapping each other)
    // Only needed if we have multiple segments
    if (segmentsToCheck.length > 1) {
      for (let i = 0; i < segmentsToCheck.length; i++) {
        for (let j = i + 1; j < segmentsToCheck.length; j++) {
          const s1 = segmentsToCheck[i];
          const s2 = segmentsToCheck[j];

          // Only care if same unit
          if (s1.unit === s2.unit) {
            const start1 = new Date(s1.checkIn);
            const end1 = new Date(s1.checkOut);
            const start2 = new Date(s2.checkIn);
            const end2 = new Date(s2.checkOut);

            // Allow touching (end == start) but not overlap
            // Overlap: StartA < EndB && EndA > StartB
            if (start1 < end2 && end1 > start2) {
              alert("🚫 Error: Los segmentos de la misma reserva no pueden superponerse.");
              setDraggedReservation(null);
              setDraggedSegment(undefined);
              return;
            }
          }
        }
      }
    }

    // 2. Check Overlap with OTHER reservations
    const reservationConflict = reservations.some(res => {
      if (res.id === draggedReservation.id) return false;

      const resSegments = res.segments || [{ checkIn: res.checkIn, checkOut: res.checkOut, unit: res.unit }];

      return segmentsToCheck.some(mySeg => {
        const myStart = new Date(mySeg.checkIn);
        const myEnd = new Date(mySeg.checkOut);
        myStart.setHours(12, 0, 0, 0);
        myEnd.setHours(12, 0, 0, 0);

        return resSegments.some(otherSeg => {
          if (otherSeg.unit !== mySeg.unit) return false;
          const otherStart = new Date(otherSeg.checkIn);
          const otherEnd = new Date(otherSeg.checkOut);
          otherStart.setHours(12, 0, 0, 0);
          otherEnd.setHours(12, 0, 0, 0);

          return (myStart < otherEnd && myEnd > otherStart);
        });
      });
    });

    const maintenanceConflict = (tickets || []).some(ticket => {
      if (!ticket.blocksAvailability || ticket.estado === 'completado') return false;

      return segmentsToCheck.some(mySeg => {
        if (mySeg.unit !== ticket.unidad) return false;

        const parseLocalNoon = (dStr: string | Date | undefined) => {
          if (!dStr) return new Date();
          const s = dStr.toString().split('T')[0];
          const [y, m, d] = s.split('-').map(Number);
          return new Date(y, m - 1, d, 12, 0, 0, 0);
        };

        const tStart = parseLocalNoon(ticket.fechaInicio || ticket.fecha);
        const tEnd = ticket.fechaFin ? parseLocalNoon(ticket.fechaFin) : new Date(tStart);
        tEnd.setDate(tEnd.getDate() + 1); // Exclusive end for daily logic

        const myStart = new Date(mySeg.checkIn);
        const myEnd = new Date(mySeg.checkOut);
        myStart.setHours(12, 0, 0, 0);
        myEnd.setHours(12, 0, 0, 0);

        return (myStart < tEnd && myEnd > tStart);
      });
    });

    if (reservationConflict || maintenanceConflict) {
      alert("⚠️ Conflicto: La unidad está ocupada (Reserva o Mantenimiento).");
      setDraggedReservation(null);
      setDraggedSegment(undefined);
      return;
    }

    // Direct Update - No Confirm Step for seamless UX
    updateReservation(updatedRes);
    setDraggedReservation(null);
    setDraggedSegment(undefined);
    setHoveredCell(null);
  };

  const handleDragOver = (e: React.DragEvent, unit: string, date: Date) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = "move"; // Visual feedback

    // Optimization: avoid state update if same cell
    if (hoveredCell?.unit === unit && hoveredCell?.date.getTime() === date.getTime()) return;
    setHoveredCell({ unit, date });
  };

  const ghostOverlay = useMemo<GhostOverlay | null>(() => {
    if (!draggedReservation || !hoveredCell) return null;

    const targetDate = hoveredCell.date;
    const safeTarget = new Date(targetDate);
    safeTarget.setHours(12, 0, 0, 0);

    let checkIn: Date;
    let checkOut: Date;

    // Exact same logic as handleDrop to calculate target position
    if (draggedSegment) {
      let deltaMs = 0;
      if (dragAnchorDate) {
        const anchor = new Date(dragAnchorDate);
        anchor.setHours(12, 0, 0, 0);
        deltaMs = safeTarget.getTime() - anchor.getTime();
      } else {
        const segStart = new Date(draggedSegment.checkIn);
        segStart.setHours(12, 0, 0, 0);
        deltaMs = safeTarget.getTime() - segStart.getTime();
      }

      const sIn = new Date(draggedSegment.checkIn);
      const sOut = new Date(draggedSegment.checkOut);
      checkIn = new Date(sIn.getTime() + deltaMs);
      checkOut = new Date(sOut.getTime() + deltaMs);
    } else {
      // Whole reservation move
      let deltaMs = 0;
      if (dragAnchorDate) {
        const anchor = new Date(dragAnchorDate);
        anchor.setHours(12, 0, 0, 0);
        deltaMs = safeTarget.getTime() - anchor.getTime();
      } else {
        // If no anchor (shouldn't happen with new logic), use logic that snaps start to target
        const start = new Date(draggedReservation.checkIn);
        start.setHours(12, 0, 0, 0);
        deltaMs = safeTarget.getTime() - start.getTime();
      }

      const oldCheckIn = new Date(draggedReservation.checkIn);
      oldCheckIn.setHours(12, 0, 0, 0);
      checkIn = new Date(oldCheckIn.getTime() + deltaMs);

      const duration = Math.ceil((draggedReservation.checkOut.getTime() - draggedReservation.checkIn.getTime()) / (1000 * 60 * 60 * 24));
      checkOut = new Date(checkIn);
      checkOut.setDate(checkOut.getDate() + duration);
    }

    // Quick Conflict Probing for Ghost styling
    const reservationConflict = reservations.some(res => {
      if (res.id === draggedReservation.id) return false;

      const resSegments = res.segments || [{ checkIn: res.checkIn, checkOut: res.checkOut, unit: res.unit }];

      return resSegments.some(otherSeg => {
        if (otherSeg.unit !== hoveredCell.unit) return false;

        const otherStart = new Date(otherSeg.checkIn);
        const otherEnd = new Date(otherSeg.checkOut);
        otherStart.setHours(12, 0, 0, 0);
        otherEnd.setHours(12, 0, 0, 0);

        // Ghost Interval
        const gStart = new Date(checkIn);
        const gEnd = new Date(checkOut);
        gStart.setHours(12, 0, 0, 0);
        gEnd.setHours(12, 0, 0, 0);

        return (gStart < otherEnd && gEnd > otherStart);
      });
    });

    const maintenanceConflict = (tickets || []).some(ticket => {
      if (!ticket.blocksAvailability || ticket.estado === 'completado') return false;
      if (ticket.unidad !== hoveredCell.unit) return false;

      const parseLocalNoon = (dStr: string | Date | undefined) => {
        if (!dStr) return new Date();
        const s = dStr.toString().split('T')[0];
        const [y, m, d] = s.split('-').map(Number);
        return new Date(y, m - 1, d, 12, 0, 0, 0);
      };
      const tStart = parseLocalNoon(ticket.fechaInicio || ticket.fecha);
      const tEnd = ticket.fechaFin ? parseLocalNoon(ticket.fechaFin) : new Date(tStart);
      tEnd.setDate(tEnd.getDate() + 1);

      const gStart = new Date(checkIn);
      const gEnd = new Date(checkOut);
      gStart.setHours(12, 0, 0, 0);
      gEnd.setHours(12, 0, 0, 0);

      return (gStart < tEnd && gEnd > tStart);
    });

    return {
      unit: hoveredCell.unit,
      checkIn,
      checkOut,
      isValid: !(reservationConflict || maintenanceConflict)
    };

  }, [draggedReservation, draggedSegment, dragAnchorDate, hoveredCell, reservations]);

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

  const handleSplitReservation = () => {
    if (!selectedReservation || !splitDate || !splitUnit) return;
    // Set to NOON to match middle of stay
    // Set to NOON to match middle of stay
    const [y, m, d] = splitDate.split('-').map(Number);
    // Construct LOCAL date at 12:00:00 to match checkIn/checkOut assumptions and avoid UTC shift
    const splitDateTime = new Date(y, m - 1, d, 12, 0, 0);

    // Normalize comparison dates to avoid hour mismatches
    const resCheckIn = new Date(selectedReservation.checkIn);
    resCheckIn.setHours(12, 0, 0, 0); // Normalize to noon

    const resCheckOut = new Date(selectedReservation.checkOut);
    resCheckOut.setHours(12, 0, 0, 0); // Normalize to noon

    // Strict inside check: Must be AFTER checkIn and BEFORE checkOut
    if (splitDateTime.getTime() <= resCheckIn.getTime() || splitDateTime.getTime() >= resCheckOut.getTime()) {
      alert("⚠️ Fecha inválida: Debe ser una fecha intermedia de la estadía.");
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
  };

  const handleCellClick = (unit: string, date: Date, res?: Reservation) => {
    setSelectedCell({ unit, date, reservation: res });
    setCellActionOpen(true);
  };

  // Merge Logic
  const getMergeActions = (currentRes: Reservation | undefined, currentDate: Date) => {
    if (!currentRes) return { prev: null, next: null };

    // 1. Identify current segment
    const segments = (currentRes.segments || [{ unit: currentRes.unit, checkIn: currentRes.checkIn, checkOut: currentRes.checkOut }])
      .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());

    // Find index of segment covering currentDate
    const checkTime = currentDate.getTime();
    // Normalize checkTime to noon to match standard segment times?
    // Cell clicks usually come with a Date at 00:00.
    // Segments are at 12:00? Or stored as dates.
    // Let's rely on overlap logic.
    // However, for contiguous logic, we need precise boundaries.

    const currentIndex = segments.findIndex(s => {
      // Simple day overlap check
      const sStart = new Date(s.checkIn);
      const sEnd = new Date(s.checkOut);
      // Expand start/end to cover full days for click detection
      sStart.setHours(0, 0, 0, 0);
      // CheckOut usually means morning, so it covers previous night?
      // If click is on 15th (00:00) and segment is 14-16. It covers 15th.
      // If segment is 15-16. It covers 15th.
      return checkTime >= sStart.getTime() && checkTime < sEnd.getTime();
    });

    if (currentIndex === -1) return { prev: null, next: null };
    const currentSegment = segments[currentIndex];

    let prevAction = null;
    let nextAction = null;

    // --- CHECK PREVIOUS ---
    if (currentIndex > 0) {
      // Previous Segment in same reservation
      const prevSeg = segments[currentIndex - 1];
      // Check contiguity: prev.End == current.Start
      // Use tolerance of e.g. 12 hours? or exact?
      // If I strict moved, they should be exact.
      const pEnd = new Date(prevSeg.checkOut).getTime();
      const cStart = new Date(currentSegment.checkIn).getTime();

      if (Math.abs(pEnd - cStart) < 1000 * 60 * 60 * 24 && prevSeg.unit === currentSegment.unit) {
        prevAction = { type: 'segment' as const, index: currentIndex - 1 };
      }
    } else {
      // Check Previous Reservation
      const prevRes = reservations.find(r =>
        r.id !== currentRes.id &&
        r.unit === currentSegment.unit &&
        r.guestName === currentRes.guestName &&
        Math.abs(new Date(r.checkOut).getTime() - new Date(currentSegment.checkIn).getTime()) < 1000 * 60 * 60 * 24 // Approx match
      );
      if (prevRes) {
        prevAction = { type: 'reservation' as const, id: prevRes.id };
      }
    }

    // --- CHECK NEXT ---
    if (currentIndex < segments.length - 1) {
      // Next Segment in same reservation
      const nextSeg = segments[currentIndex + 1];
      if (Math.abs(new Date(currentSegment.checkOut).getTime() - new Date(nextSeg.checkIn).getTime()) < 1000 * 60 * 60 * 24 && nextSeg.unit === currentSegment.unit) {
        nextAction = { type: 'segment' as const, index: currentIndex }; // Merge current into next (or next into current)
      }
    } else {
      // Check Next Reservation
      const nextRes = reservations.find(r =>
        r.id !== currentRes.id &&
        r.unit === currentSegment.unit &&
        r.guestName === currentRes.guestName &&
        Math.abs(new Date(r.checkIn).getTime() - new Date(currentSegment.checkOut).getTime()) < 1000 * 60 * 60 * 24
      );
      if (nextRes) {
        nextAction = { type: 'reservation' as const, id: nextRes.id };
      }
    }

    return { prev: prevAction, next: nextAction };
  };

  const handleMergeAction = (action: { type: 'segment' | 'reservation', id?: string, index?: number }) => {
    if (!selectedCell?.reservation) return;

    if (confirm("¿Confirmar unión? Se combinarán los tramos y recalcularán las noches.")) {
      if (action.type === 'reservation' && action.id) {
        // Always merge ID2 into ID1? Or strictly based on order?
        // mergeReservations(id1, id2).
        // If Action is Previous, id=Prev. So Prev is ID1, Current is ID2.
        // If Action is Next, Current is ID1, Next is ID2.
        // We need to know if it was Prev or Next to order correctly?
        // Actually logic above sets action.id to the OTHER reservation.
        // If it's PREV, then OTHER is first.
        const otherRes = reservations.find(r => r.id === action.id);
        if (!otherRes) return;

        if (new Date(otherRes.checkIn) < new Date(selectedCell.reservation.checkIn)) {
          mergeReservations(otherRes.id, selectedCell.reservation.id);
        } else {
          mergeReservations(selectedCell.reservation.id, otherRes.id);
        }
      } else if (action.type === 'segment' && action.index !== undefined) {
        // Merge segment at index with index+1
        // For 'prev', we stored index-1. So we merge (index-1) and (index).
        // For 'next', we stored index. So we merge (index) and (index+1).
        // Wait, my logic for prev sets index to currentIndex - 1.
        // So I should merge index and index+1.
        // But I need access to updateReservation logic.
        // I'll assume ReservationsContext exposes `mergeSegments` or I do it here.
        // I didn't expose mergeSegments in the hook type explicitly?
        // Let's check Context type again. I added it to implementation but maybe not interface?
        // Assuming I updated interface. If not, I can do updateReservation here.

        const res = selectedCell.reservation;
        const segments = [...(res.segments || [{ checkIn: res.checkIn, checkOut: res.checkOut, unit: res.unit }])].sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());

        const i = action.index;
        const s1 = segments[i];
        const s2 = segments[i + 1];

        // Merge s2 into s1
        const newSeg = { ...s1, checkOut: s2.checkOut };
        segments.splice(i, 2, newSeg); // Remove 2, add 1.

        updateReservation({
          ...res,
          segments: segments,
          cleaningSchedule: getCleaningTasks({ ...res, segments })
        });
      }
      setCellActionOpen(false);
    }
  };

  const handleActionMaintenance = () => {
    setTicketToEdit(null); // Ensure creation mode
    setCellActionOpen(false);
    setTicketModalOpen(true);
  };

  const handleActionCleaning = () => {
    setCellActionOpen(false);
    setServiceModalOpen(true);
  };

  const handleActionSplit = () => {
    if (selectedCell?.reservation) {
      setSelectedReservation(selectedCell.reservation);
      setSplitDate(selectedCell.date.toISOString().split('T')[0]);
      setSplitDialogOpen(true);
    }
    setCellActionOpen(false);
  };

  return (
    <div className="space-y-6 h-full flex flex-col w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Calendario</h1>
          <p className="text-muted-foreground">{UNITS.length} unidades disponibles</p>
        </div>
        <div className="flex items-center gap-4">

          {/* Month Navigation */}
          <div className="flex items-center gap-2 bg-white p-1 rounded-md border shadow-sm">
            <Button variant="ghost" size="icon" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="min-w-[100px] text-center font-bold text-sm">
              {dateRange?.from ? dateRange.from.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }) : 'Seleccionar'}
            </span>
            <Button variant="ghost" size="icon" onClick={() => navigateMonth("next")}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Date Range Picker */}
          <div className="flex items-center gap-2 bg-white p-1 rounded-md border shadow-sm">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="min-w-[40px] px-2 font-normal text-muted-foreground hover:text-foreground">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {dateRange?.from && dateRange?.to ? (
                    <span className="text-xs text-black font-semibold">
                      {dateRange.from.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })}
                      {" - "}
                      {dateRange.to.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })}
                    </span>
                  ) : "Rango"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComp
                  locale={es}
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
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
        reservations={allReservations}
        tickets={tickets}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        ghostOverlay={ghostOverlay}
        onContextMenu={handleContextMenu}
        onCellClick={handleCellClick}
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
                  <SelectContent className="max-h-[400px]">
                    <SelectGroup>
                      <SelectLabel className="sticky top-0 bg-white z-10 font-bold text-indigo-700">Las Gaviotas</SelectLabel>
                      {UNITS.filter(u => u.complex === 'Las Gaviotas' && u.name !== (selectedCell?.unit || selectedReservation.unit))
                        .sort((a, b) => {
                          const numA = parseInt(a.name.replace(/\D/g, '')) || 999;
                          const numB = parseInt(b.name.replace(/\D/g, '')) || 999;
                          return numA - numB;
                        })
                        .map((u) => (
                          <SelectItem key={u.id} value={u.name}>{u.name} ({u.type})</SelectItem>
                        ))}
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel className="sticky top-0 bg-white z-10 font-bold text-emerald-700 border-t mt-1 pt-1">La Fontana</SelectLabel>
                      {UNITS.filter(u => u.complex === 'La Fontana' && u.name !== (selectedCell?.unit || selectedReservation.unit))
                        .sort((a, b) => {
                          const numA = parseInt(a.name.replace(/\D/g, '')) || 0;
                          const numB = parseInt(b.name.replace(/\D/g, '')) || 0;
                          if (numA && numB) return numA - numB;
                          return a.name.localeCompare(b.name);
                        })
                        .map((u) => (
                          <SelectItem key={u.id} value={u.name}>{u.name} ({u.type})</SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSplitReservation} className="w-full">Dividir</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* NEW: Cell Action Dialog */}
      <Dialog open={cellActionOpen} onOpenChange={setCellActionOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Acciones: {selectedCell?.unit}</DialogTitle>
            <div className="text-sm text-muted-foreground">
              {selectedCell?.date.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
            {selectedCell?.reservation && (
              <div className="mt-4 p-3 bg-muted/50 rounded-md text-sm">
                <p className="font-bold text-base mb-2">{selectedCell.reservation.guestName}</p>

                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <p className="text-muted-foreground text-xs uppercase font-bold">Pax</p>
                    <p>{selectedCell.reservation.pax || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase font-bold">Mascota</p>
                    <p>{selectedCell.reservation.hasPet ? 'Sí' : 'No'}</p>
                  </div>
                </div>

                {/* Merge Controls */}
                {(() => {
                  const mergeOps = selectedCell?.reservation ? getMergeActions(selectedCell.reservation, selectedCell.date) : { prev: null, next: null };
                  if (mergeOps.prev || mergeOps.next) {
                    return (
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {mergeOps.prev ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-xs font-bold text-indigo-700 bg-indigo-50 border-indigo-200 hover:bg-indigo-100"
                            onClick={() => handleMergeAction(mergeOps.prev!)}
                          >
                            <Merge className="w-3 h-3 mr-2 rotate-180" /> Unir Anterior
                          </Button>
                        ) : <div />}

                        {mergeOps.next ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-xs font-bold text-indigo-700 bg-indigo-50 border-indigo-200 hover:bg-indigo-100"
                            onClick={() => handleMergeAction(mergeOps.next!)}
                          >
                            <Merge className="w-3 h-3 mr-2" /> Unir Siguiente
                          </Button>
                        ) : <div />}
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Day Service Management */}
                <div className="bg-slate-50 p-3 rounded-md border border-slate-100 mb-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Servicios del Día ({new Date(selectedCell.date).getDate()}/{new Date(selectedCell.date).getMonth() + 1})</p>

                  {(() => {
                    const reservation = selectedCell?.reservation;
                    if (!reservation) return null;

                    // Fallback to empty array if no schedule, or import getCleaningTasks if needed. 
                    // Assuming getCleaningTasks is not imported, we'll default to [] for now or rely on what's available.
                    // If getCleaningTasks IS imported, we can use it. 
                    // Let's rely on reservation.cleaningSchedule primarily.
                    const currentSchedule = reservation.cleaningSchedule || [];

                    const dayTask = currentSchedule.find((t: any) => {
                      const tDate = new Date(t.date);
                      const cellDate = new Date(selectedCell.date);
                      return tDate.getDate() === cellDate.getDate() && tDate.getMonth() === cellDate.getMonth();
                    });

                    if (dayTask) {
                      return (
                        <div className="flex items-center justify-between bg-white p-2 rounded border shadow-sm">
                          <div className="flex items-center gap-2">
                            {dayTask.type === 'toallas' ? <Droplets className="w-4 h-4 text-cyan-500" /> : <SprayCan className="w-4 h-4 text-purple-500" />}
                            <span className="text-sm font-medium capitalize">{dayTask.type === 'toallas' ? 'Toallas' : 'Completo'}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-red-500 hover:bg-red-50"
                            onClick={() => {
                              const newSchedule = currentSchedule.filter((t: any) => t.id !== dayTask.id);
                              updateReservation({
                                ...reservation,
                                id: reservation.id || '', // Ensure ID is string
                                cleaningSchedule: newSchedule
                              });
                              setCellActionOpen(false);
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      );
                    } else {
                      return (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs h-7 border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-100"
                            onClick={() => {
                              const newTask = {
                                id: `${reservation.id}-manual-${Date.now()}`,
                                date: selectedCell.date,
                                type: 'toallas' as const,
                                unit: reservation.unit
                              };
                              updateReservation({
                                ...reservation,
                                id: reservation.id || '',
                                cleaningSchedule: [...currentSchedule, newTask]
                              });
                              setCellActionOpen(false);
                            }}
                          >
                            <Plus className="w-3 h-3 mr-1" /> Toallas
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs h-7 border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100"
                            onClick={() => {
                              const newTask = {
                                id: `${reservation.id}-manual-${Date.now()}`,
                                date: selectedCell.date,
                                type: 'completo' as const,
                                unit: reservation.unit
                              };
                              updateReservation({
                                ...reservation,
                                id: reservation.id || '',
                                cleaningSchedule: [...currentSchedule, newTask]
                              });
                              setCellActionOpen(false);
                            }}
                          >
                            <Plus className="w-3 h-3 mr-1" /> Completo
                          </Button>
                        </div>
                      );
                    }
                  })()}
                </div>

                {/* Segment Details */}
                {selectedCell.reservation.segments && selectedCell.reservation.segments.length > 0 ? (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Itinerario:</p>
                    {selectedCell.reservation.segments.map((seg, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs border-b border-gray-200 last:border-0 py-1">
                        <span className="font-medium">📍 {seg.unit}</span>
                        <span>
                          {new Date(seg.checkIn).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })} - {new Date(seg.checkOut).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs">
                    Del {new Date(selectedCell.reservation.checkIn).toLocaleDateString('es-AR')} al {new Date(selectedCell.reservation.checkOut).toLocaleDateString('es-AR')}
                  </p>
                )}
              </div>
            )}
          </DialogHeader>
          <div className="grid gap-3 py-4">
            {selectedCell?.reservation && (
              <>
                <Button variant="outline" className="justify-start h-12 border-indigo-200 bg-indigo-50 text-indigo-900 hover:bg-indigo-100" onClick={handleActionSplit}>
                  <Split className="mr-2 h-5 w-5" />
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">Dividir Reserva</span>
                    <span className="text-[10px] opacity-80">Dividir esta estadía a partir de esta fecha</span>
                  </div>
                </Button>


              </>
            )}

            <Button variant="outline" className="justify-start h-12" onClick={handleActionMaintenance}>
              <div className="bg-orange-100 p-1 rounded mr-3 text-orange-600"><Wrench className="h-4 w-4" /></div>
              <div className="flex flex-col items-start">
                <span className="font-semibold">Reportar Mantenimiento</span>
                <span className="text-[10px] text-muted-foreground">Crear ticket o nota para esta unidad</span>
              </div>
            </Button>

            {(() => {
              const activeTicket = tickets.find(t => {
                if (t.unidad !== selectedCell?.unit || t.estado === 'completado') return false;
                const start = new Date(t.fechaInicio || t.fecha);
                const end = t.fechaFin ? new Date(t.fechaFin) : new Date(start);
                // Check if date falls within ticket range
                // Simple Day comparison
                const d = new Date(selectedCell?.date);
                d.setHours(0, 0, 0, 0);
                const s = new Date(start); s.setHours(0, 0, 0, 0);
                const e = new Date(end); e.setHours(0, 0, 0, 0);
                return d >= s && d <= e;
              });

              if (activeTicket) {
                return (
                  <Button variant="outline" className="justify-start h-12 border-orange-200 bg-orange-50 text-orange-900 hover:bg-orange-100" onClick={() => {
                    setTicketToEdit(activeTicket);
                    setCellActionOpen(false);
                    setTicketModalOpen(true);
                  }}>
                    <div className="bg-orange-200 p-1 rounded mr-3 text-orange-700"><Edit className="h-4 w-4" /></div>
                    <div className="flex flex-col items-start">
                      <span className="font-semibold">Editar Mantenimiento</span>
                      <span className="text-[10px] opacity-80">{activeTicket.problema}</span>
                    </div>
                  </Button>
                );
              }
              return null;
            })()}

            <Button variant="outline" className="justify-start h-12" onClick={handleActionCleaning}>
              <div className="bg-cyan-100 p-1 rounded mr-3 text-cyan-600"><SprayCan className="h-4 w-4" /></div>
              <div className="flex flex-col items-start">
                <span className="font-semibold">Solicitar Limpieza</span>
                <span className="text-[10px] text-muted-foreground">Asignar tarea a mucama</span>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AddEntryModal isOpen={entryModalOpen} onClose={() => setEntryModalOpen(false)} defaultUnit={selectedCell?.unit} />
      <AddServiceTaskModal isOpen={serviceModalOpen} onClose={() => setServiceModalOpen(false)} defaultUnit={selectedCell?.unit} />
      <AddEntryModal isOpen={entryModalOpen} onClose={() => setEntryModalOpen(false)} defaultUnit={selectedCell?.unit} />
      <AddServiceTaskModal isOpen={serviceModalOpen} onClose={() => setServiceModalOpen(false)} defaultUnit={selectedCell?.unit} />
      <AddTicketModal isOpen={ticketModalOpen} onClose={() => setTicketModalOpen(false)} defaultUnit={selectedCell?.unit} ticketToEdit={ticketToEdit} onSuccess={() => { setTicketModalOpen(false); }} />
    </div>
  );
}
