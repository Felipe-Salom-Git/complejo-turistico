'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useMaintenance, Ticket } from '@/contexts/MaintenanceContext';
import { INVENTORY, useReservations, Reservation } from '@/contexts/ReservationsContext';
import { useHandoff } from '@/contexts/HandoffContext';
import { useAuth } from '@/contexts/AuthContext';

interface AddTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketToEdit?: Ticket | null;
  onSuccess?: (id: number) => void;
  defaultUnit?: string;
}

export function AddTicketModal({ isOpen, onClose, ticketToEdit, onSuccess, defaultUnit }: AddTicketModalProps) {
  const { addTicket, updateTicket } = useMaintenance();
  const { addReservation } = useReservations();
  const { entries, updateEntry } = useHandoff();
  const { user } = useAuth();

  // Initial state or edit state
  const [unit, setUnit] = useState(ticketToEdit?.unidad || defaultUnit || '');
  const [problem, setProblem] = useState(ticketToEdit?.problema || '');
  const [description, setDescription] = useState(ticketToEdit?.descripcion || '');
  const [type, setType] = useState<'correctivo' | 'preventivo'>(ticketToEdit?.tipo || 'correctivo');
  const [priority, setPriority] = useState<'urgente' | 'alta' | 'media' | 'baja'>(ticketToEdit?.prioridad || 'media');
  const [status, setStatus] = useState<'pendiente' | 'en-proceso' | 'completado'>(ticketToEdit?.estado || 'pendiente');
  const [assignee, setAssignee] = useState(ticketToEdit?.asignado || '');
  const [startDate, setStartDate] = useState(ticketToEdit?.fechaInicio || new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(ticketToEdit?.fechaFin || new Date().toISOString().split('T')[0]);
  const [blocksAvailability, setBlocksAvailability] = useState(ticketToEdit?.blocksAvailability || false);

  // Link to Novedad
  const [linkedNovedadId, setLinkedNovedadId] = useState<string>(ticketToEdit?.novedadId || 'none');

  // Filter available Novedades (only those without a ticket, or the currently linked one)
  const availableNovedades = entries.filter(e => !e.ticketId || e.id === ticketToEdit?.novedadId);

  // Reset form when opening for new ticket
  useEffect(() => {
    if (isOpen) {
      if (ticketToEdit) {
        setUnit(ticketToEdit.unidad);
        setProblem(ticketToEdit.problema);
        setDescription(ticketToEdit.descripcion || '');
        setType(ticketToEdit.tipo);
        setPriority(ticketToEdit.prioridad);
        setStatus(ticketToEdit.estado);
        setAssignee(ticketToEdit.asignado);
        setStartDate(ticketToEdit.fechaInicio || new Date().toISOString().split('T')[0]);
        setEndDate(ticketToEdit.fechaFin || new Date().toISOString().split('T')[0]);
        setBlocksAvailability(ticketToEdit.blocksAvailability || false);
        setLinkedNovedadId(ticketToEdit.novedadId || 'none');
      } else {
        // Reset or Default
        setUnit(defaultUnit || '');
        setProblem('');
        setDescription('');
        setType('correctivo');
        setPriority('media');
        setStatus('pendiente');
        setAssignee('');
        setStartDate(new Date().toISOString().split('T')[0]);
        setEndDate(new Date().toISOString().split('T')[0]);
        setBlocksAvailability(false);
        setLinkedNovedadId('none');
      }
    }
  }, [isOpen, ticketToEdit, defaultUnit]);

  // If a Novedad is selected, auto-fill fields if they are empty
  const handleNovedadChange = (novedadId: string) => {
    setLinkedNovedadId(novedadId);
    if (novedadId !== 'none') {
      const novedad = entries.find(e => e.id === novedadId);
      if (novedad) {
        if (!problem) setProblem(novedad.title);
        if (!description) setDescription(novedad.description);
        if (!unit && novedad.unit) setUnit(novedad.unit);
      }
    }
  };

  const handleSubmit = () => {
    if (!unit || !problem || !startDate || !endDate) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      alert('La fecha de fin no puede ser anterior a la fecha de inicio');
      return;
    }

    const ticketData: any = {
      unidad: unit,
      problema: problem,
      descripcion: description,
      tipo: type,
      prioridad: priority,
      estado: status,
      fecha: startDate,
      fechaInicio: startDate,
      fechaFin: endDate,
      asignado: assignee || 'Sin asignar',
      blocksAvailability: blocksAvailability,
      novedadId: linkedNovedadId !== 'none' ? linkedNovedadId : undefined
    };

    let finalTicketId = 0;

    if (ticketToEdit) {
      updateTicket({ ...ticketToEdit, ...ticketData });
      finalTicketId = ticketToEdit.id;

      // Check if Novedad link changed or needs update
      if (linkedNovedadId !== 'none' && linkedNovedadId !== ticketToEdit.novedadId) {
        updateEntry(linkedNovedadId, { ticketId: finalTicketId });
      }

      // Trigger Cleaning if status changed to 'completado'
      if (status === 'completado' && ticketToEdit.estado !== 'completado' && unit !== 'General') {
        const cleanDate = new Date(endDate);
        cleanDate.setHours(12, 0, 0, 0);

        const cleanEnd = new Date(cleanDate);
        cleanEnd.setHours(cleanEnd.getHours() + 2);

        const cleaningEvent: Reservation = {
          id: `CLEANING-MANT-${Date.now()}`,
          unit: unit,
          guestName: 'Limpieza (Mantenimiento)',
          checkIn: cleanDate,
          checkOut: cleanEnd,
          status: 'cleaning',
          source: 'Mantenimiento',
          createdAt: new Date(),
          createdBy: 'Sistema'
        };
        addReservation(cleaningEvent);
        alert('🛠️ Mantenimiento completado. Se ha generado un evento de limpieza.');
      }
    } else {
      const newId = addTicket(ticketData);
      finalTicketId = newId;
      if (onSuccess) onSuccess(newId);

      // If linked to Novedad, update Novedad
      if (linkedNovedadId !== 'none') {
        updateEntry(linkedNovedadId, { ticketId: newId });
      }

      // New ticket created as completed?
      if (status === 'completado' && unit !== 'General') {
        const cleanDate = new Date(endDate);
        cleanDate.setHours(12, 0, 0, 0);

        const cleanEnd = new Date(cleanDate);
        cleanEnd.setHours(cleanEnd.getHours() + 2);

        const cleaningEvent: Reservation = {
          id: `CLEANING-MANT-${Date.now()}`,
          unit: unit,
          guestName: 'Limpieza (Mantenimiento)',
          checkIn: cleanDate,
          checkOut: cleanEnd,
          status: 'cleaning',
          source: 'Mantenimiento',
          createdAt: new Date(),
          createdBy: 'Sistema'
        };
        addReservation(cleaningEvent);
      }
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{ticketToEdit ? 'Editar Ticket' : 'Nuevo Ticket de Mantenimiento'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">

          <div className="space-y-2">
            <Label htmlFor="linkNovedad">Vincular a Novedad (Opcional)</Label>
            <Select value={linkedNovedadId} onValueChange={handleNovedadChange} disabled={!!ticketToEdit && ticketToEdit.estado === 'completado' && user?.role !== 'admin'}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar novedad..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">-- Sin Vinculación --</SelectItem>
                {availableNovedades.map(n => (
                  <SelectItem key={n.id} value={n.id}>
                    {n.title} ({new Date(n.createdAt).toLocaleDateString()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit">Unidad</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar unidad" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {INVENTORY.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                  <SelectItem value="General">General / Área Común</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select value={type} onValueChange={(v: any) => setType(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="correctivo">Correctivo</SelectItem>
                  <SelectItem value="preventivo">Preventivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="problem">Problema (Título corto)</Label>
            <Input
              id="problem"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Ej. Fuga de agua"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción Detallada</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalles adicionales..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Fecha Inicio</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Fecha Fin (Estimada)</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridad</Label>
              <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgente">Urgente</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="en-proceso">En Proceso</SelectItem>
                  <SelectItem value="completado">Completado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignee">Asignado a</Label>
            <Input
              id="assignee"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              placeholder="Nombre del técnico"
            />
          </div>

          <div className="flex items-center space-x-2 border p-3 rounded-md bg-slate-50">
            <Switch
              id="blocking"
              checked={blocksAvailability}
              onCheckedChange={setBlocksAvailability}
            />
            <Label htmlFor="blocking" className="cursor-pointer">Bloquear Disponibilidad (Ocupar Unidad)</Label>
          </div>

        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="bg-[var(--color-primary)]">
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
