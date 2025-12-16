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
import { AddTicketModal } from '@/components/maintenance/AddTicketModal';
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
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<EntryType>('info');
  const [unit, setUnit] = useState<string>('none');
  
  // Maintenance Ticket Logic
  const [createTicket, setCreateTicket] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [linkedTicketId, setLinkedTicketId] = useState<number | null>(null);

  // Effect: When toggle is checked, open the modal
  const handleToggleTicket = (checked: boolean) => {
      setCreateTicket(checked);
      if (checked) {
          setShowMaintenanceModal(true);
      } else {
          setLinkedTicketId(null);
      }
  };

  const handleMaintenanceSuccess = (id: number) => {
      setLinkedTicketId(id);
      // Keep "Create Ticket" checked to show visual confirmation
      setCreateTicket(true);
  };

  const handleMaintenanceClose = () => {
      setShowMaintenanceModal(false);
      // If no ticket was created, uncheck the box
      if (!linkedTicketId) {
          setCreateTicket(false);
      }
  };

  const handleSubmit = () => {
    if (!title || !description) {
      alert('Por favor complete título y descripción.');
      return;
    }

    addEntry({
      title,
      description,
      type,
      unit: unit === 'none' ? undefined : unit,
      createdBy: user?.name || 'Desconocido',
      ticketId: linkedTicketId || undefined
    });
    
    // Reset and close
    setTitle('');
    setDescription('');
    setType('info');
    setUnit('none');
    setCreateTicket(false);
    setLinkedTicketId(null);
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
                        onCheckedChange={handleToggleTicket} 
                    />
                    <Label htmlFor="create-ticket" className="cursor-pointer">Generar Ticket de Mantenimiento</Label>
                </div>
                
                {linkedTicketId && (
                     <div className="pl-6 animate-in fade-in slide-in-from-top-1">
                        <Badge variant="outline" className="flex items-center gap-2 w-fit bg-green-50 text-green-700 border-green-200">
                             <Wrench className="w-3 h-3" />
                             Ticket Linkeado: #{linkedTicketId}
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
            Registrar Evento
          </Button>
        </DialogFooter>
      </DialogContent>
      
      {/* Maintenance Modal (Parallel) */}
      <AddTicketModal 
          isOpen={showMaintenanceModal}
          onClose={handleMaintenanceClose}
          onSuccess={handleMaintenanceSuccess}
          // Pre-fill data if available
          ticketToEdit={{
              id: 0,
              unidad: unit !== 'none' ? unit : '',
              problema: title,
              descripcion: `Creado desde Pase Diario. ${description}`,
              tipo: 'correctivo',
              prioridad: 'media',
              estado: 'pendiente',
              fecha: new Date().toISOString().split('T')[0],
              asignado: ''
          } as any}
      />

    </Dialog>
  );
}
