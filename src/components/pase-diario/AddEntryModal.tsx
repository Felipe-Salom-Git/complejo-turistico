'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
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
import { useHandoff, EntryType } from '@/contexts/HandoffContext';
import { useAuth } from '@/contexts/AuthContext';
import { useMaintenance } from '@/contexts/MaintenanceContext';
import { Badge } from '@/components/ui/badge';
import { Wrench } from 'lucide-react';
import { INVENTORY } from '@/contexts/ReservationsContext';
import { Switch } from '@/components/ui/switch';

interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddEntryModal({ isOpen, onClose }: AddEntryModalProps) {
  const { addEntry } = useHandoff();
  const { user } = useAuth();
  const { addTicket } = useMaintenance();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<EntryType>('info');
  const [unit, setUnit] = useState<string>('none');

  // Maintenance Logic
  const [createTicket, setCreateTicket] = useState(false);
  const [priority, setPriority] = useState<'urgente' | 'alta' | 'media' | 'baja'>('media');

  const handleSubmit = () => {
    if (!title || !description) {
      alert('Por favor complete título y descripción.');
      return;
    }

    let ticketId: number | undefined = undefined;

    if (createTicket) {
      ticketId = addTicket({
        id: 0, // Auto-generated
        unidad: unit !== 'none' ? unit : 'Sin Unidad',
        problema: title,
        descripcion: description,
        tipo: 'correctivo',
        prioridad: priority,
        estado: 'pendiente',
        fecha: new Date().toISOString().split('T')[0],
        asignado: ''
      });
    }

    addEntry({
      title,
      description,
      type,
      unit: unit === 'none' ? undefined : unit,
      createdBy: user?.name || 'Desconocido',
      ticketId: ticketId
    });

    // Reset and close
    setTitle('');
    setDescription('');
    setType('info');
    setUnit('none');
    setCreateTicket(false);
    setPriority('media');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nuevo Evento - Libro de Novedades</DialogTitle>
          <DialogDescription>
            Registrar evento para el pase de guardia.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">

          {/* Read Only Auto-fields */}
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 bg-slate-50 p-2 rounded">
            <div>
              <span className="font-semibold">Usuario:</span> {user?.name}
            </div>
            <div className="text-right">
              <span className="font-semibold">Fecha:</span> {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Entrada</Label>
            <Select value={type} onValueChange={(v) => setType(v as EntryType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="info">ℹ️ Informativo</SelectItem>
                <SelectItem value="pending">⏳ Tarea Pendiente</SelectItem>
                <SelectItem value="admin_request" disabled={user?.role !== 'admin'}>
                  🛑 Solicitud Admin (Solo Admin)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Título / Resumen</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Llaves perdidas"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción Detallada</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalles del evento..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit">Unidad Relacionada (Opcional)</Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar unidad..." />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                <SelectItem value="none">-- Ninguna --</SelectItem>
                {INVENTORY.map((u) => (
                  <SelectItem key={u} value={u}>
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Maintenance Integration */}
          <div className="flex flex-col gap-4 border-t pt-4 mt-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="create-ticket"
                checked={createTicket}
                onCheckedChange={setCreateTicket}
              />
              <Label htmlFor="create-ticket" className="cursor-pointer font-medium text-slate-700">Generar Ticket de Mantenimiento</Label>
            </div>

            {createTicket && (
              <div className="pl-6 animate-in fade-in slide-in-from-top-1 space-y-3">
                <div className="space-y-2">
                  <Label>Prioridad del Ticket</Label>
                  <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baja">🟢 Baja</SelectItem>
                      <SelectItem value="media">🟡 Media</SelectItem>
                      <SelectItem value="alta">🟠 Alta</SelectItem>
                      <SelectItem value="urgente">🔴 Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 gap-2">
                  <Wrench className="w-3 h-3" />
                  Se creará un ticket automático con la info de arriba
                </Badge>
              </div>
            )}
          </div>

        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="bg-[var(--color-primary)]">
            Registrar Evento {createTicket ? '+ Ticket' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
