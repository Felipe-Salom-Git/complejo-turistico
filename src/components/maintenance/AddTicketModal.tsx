'use client';

import React, { useState } from 'react';
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
import { useMaintenance, Ticket } from '@/contexts/MaintenanceContext';
import { INVENTORY, useReservations, Reservation } from '@/contexts/ReservationsContext';

interface AddTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketToEdit?: Ticket | null;
  onSuccess?: (id: number) => void;
}

export function AddTicketModal({ isOpen, onClose, ticketToEdit, onSuccess }: AddTicketModalProps) {
  const { addTicket, updateTicket } = useMaintenance();
  const { addReservation } = useReservations();
  
  // Initial state or edit state
  const [unit, setUnit] = useState(ticketToEdit?.unidad || '');
  const [problem, setProblem] = useState(ticketToEdit?.problema || '');
  const [description, setDescription] = useState(ticketToEdit?.descripcion || '');
  const [type, setType] = useState<'correctivo' | 'preventivo'>(ticketToEdit?.tipo || 'correctivo');
  const [priority, setPriority] = useState<'urgente' | 'alta' | 'media' | 'baja'>(ticketToEdit?.prioridad || 'media');
  const [status, setStatus] = useState<'pendiente' | 'en-proceso' | 'completado'>(ticketToEdit?.estado || 'pendiente');
  const [assignee, setAssignee] = useState(ticketToEdit?.asignado || '');
  const [startDate, setStartDate] = useState(ticketToEdit?.fechaInicio || new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(ticketToEdit?.fechaFin || new Date().toISOString().split('T')[0]);

  // Reset form when opening for new ticket
  React.useEffect(() => {
    if (isOpen) {
      if (ticketToEdit) {
        setUnit(ticketToEdit.unidad);
        setProblem(ticketToEdit.problema);
        setDescription(ticketToEdit.descripcion || '');
        setType(ticketToEdit.tipo || 'correctivo');
        setPriority(ticketToEdit.prioridad);
        setStatus(ticketToEdit.estado);
        setAssignee(ticketToEdit.asignado);
        setStartDate(ticketToEdit.fechaInicio || ticketToEdit.fecha || '');
        setEndDate(ticketToEdit.fechaFin || '');
      } else {
        setUnit('');
        setProblem('');
        setDescription('');
        setType('correctivo');
        setPriority('media');
        setStatus('pendiente');
        setAssignee('');
        setStartDate(new Date().toISOString().split('T')[0]);
        setEndDate(new Date().toISOString().split('T')[0]);
      }
    }
  }, [isOpen, ticketToEdit]);

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
      fecha: startDate, // Usamos fecha de inicio como fecha principal
      fechaInicio: startDate,
      fechaFin: endDate,
      asignado: assignee || 'Sin asignar',
    };

    if (ticketToEdit) {
      updateTicket({ ...ticketToEdit, ...ticketData });
      
      // Trigger Cleaning if status changed to 'completado'
      if (status === 'completado' && ticketToEdit.estado !== 'completado' && unit !== 'General') {
          const cleanDate = new Date(endDate);
          cleanDate.setHours(12, 0, 0, 0); // Start at noon
          
          const cleanEnd = new Date(cleanDate);
          cleanEnd.setHours(cleanEnd.getHours() + 2); // 2 hours cleaning

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
      if (onSuccess) onSuccess(newId);
      
      // New ticket created as completed? Unlikely but possible
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
