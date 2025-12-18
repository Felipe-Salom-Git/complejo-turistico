'use client';

import React, { useState } from 'react';
import { generateRandomTask, getRandomElement } from '@/lib/magic-data';
import { Wand2 } from 'lucide-react';
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
import { Wrench, Link as LinkIcon } from 'lucide-react';
import { INVENTORY } from '@/contexts/ReservationsContext';
import { Switch } from '@/components/ui/switch';

interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultUnit?: string;
}

export function AddEntryModal({ isOpen, onClose, defaultUnit }: AddEntryModalProps) {
  const { addEntry } = useHandoff();
  const { user } = useAuth();
  const { tickets, updateTicket } = useMaintenance();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<EntryType>('info');
  const [unit, setUnit] = useState<string>(defaultUnit || 'none');
  const [linkedTicketId, setLinkedTicketId] = useState<string>('none');

  // React to prop change if modal opens
  React.useEffect(() => {
    if (isOpen && defaultUnit) setUnit(defaultUnit);
  }, [isOpen, defaultUnit]);

  // Filter available tickets (e.g., active ones or all)
  // Showing all for flexibility, or maybe filter out completed ones if desired.
  // Letting the user decide which ticket to link.
  const availableTickets = tickets.filter(t => !t.novedadId); // Only unlinked tickets

  const handleSubmit = () => {
    if (!title || !description) {
      alert('Por favor complete título y descripción.');
      return;
    }

    const ticketIdToLink = linkedTicketId !== 'none' ? parseInt(linkedTicketId) : undefined;

    // 1. Create Entry first
    const entryId = addEntry({
      title,
      description,
      type,
      unit: unit === 'none' ? undefined : unit,
      createdBy: user?.name || 'Desconocido',
      ticketId: ticketIdToLink
    });

    // 2. If Ticket selected, update it to link back to Novedad
    if (ticketIdToLink) {
      const ticket = tickets.find(t => t.id === ticketIdToLink);
      if (ticket) {
        updateTicket({ ...ticket, novedadId: entryId });
      }
    }

    // Reset and close
    setTitle('');
    setDescription('');
    setType('info');
    setUnit('none');
    setLinkedTicketId('none');
    onClose();
  };

  const handleMagicFill = () => {
    const random = generateRandomTask();
    setTitle(random.task);
    setDescription(random.notes + " (Auto-generated)");
    setUnit(random.unit);
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

          {/* Maintenance Linking */}
          <div className="space-y-2 border-t pt-4 mt-2">
            <div className="flex items-center gap-2 mb-1">
              <Wrench className="w-4 h-4 text-slate-500" />
              <Label htmlFor="linkTicket">Asociar Ticket Mantenimiento (Opcional)</Label>
            </div>
            <Select value={linkedTicketId} onValueChange={setLinkedTicketId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar ticket..." />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                <SelectItem value="none">-- Sin Ticket --</SelectItem>
                {availableTickets.map(t => (
                  <SelectItem key={t.id} value={t.id.toString()}>
                    #{t.id} - {t.problema} ({t.unidad})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Solo se muestran tickets que no tienen una novedad asociada.
            </p>
          </div>

        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="bg-[var(--color-primary)]">
            Registrar Evento
          </Button>
        </DialogFooter>
        <div className="absolute left-6 bottom-6">
          <Button type="button" variant="ghost" size="sm" onClick={handleMagicFill} className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-2 h-8">
            <Wand2 className="w-3 h-3 mr-1" /> Magic
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
