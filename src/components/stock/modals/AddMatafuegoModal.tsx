import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { FireExtinguisher } from '@/types/stock';

interface AddMatafuegoModalProps {
  onSave: (data: Omit<FireExtinguisher, 'id'>) => void;
  initialData?: FireExtinguisher;
  onDelete?: () => void;
  trigger?: React.ReactNode;
}

export function AddMatafuegoModal({ onSave, initialData, onDelete, trigger }: AddMatafuegoModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    location: '',
    type: '',
    expirationDate: '',
    status: 'Vigente'
  });

  useEffect(() => {
    if (open && initialData) {
      setFormData({
        location: initialData.location,
        type: initialData.type,
        expirationDate: initialData.expirationDate,
        status: initialData.status
      });
    } else if (open && !initialData) {
      setFormData({ location: '', type: '', expirationDate: '', status: 'Vigente' });
    }
  }, [open, initialData]);

  const handleSubmit = () => {
    // Cast status to correct type or validate it
    onSave(formData as any);
    setOpen(false);
    if (!initialData) {
      setFormData({ location: '', type: '', expirationDate: '', status: 'Vigente' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? trigger : (
          <Button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Matafuego
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Matafuego' : 'Registrar Matafuego'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="location">Ubicación</Label>
            <Input
              id="location"
              placeholder="Ej: Recepción"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Tipo</Label>
            <Input
              id="type"
              placeholder="Ej: ABC 5kg"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="expiration">Vencimiento</Label>
            <Input
              id="expiration"
              type="date"
              value={formData.expirationDate}
              onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Estado Inicial</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Vigente">Vigente</SelectItem>
                <SelectItem value="Préstamo">En Préstamo</SelectItem>
                <SelectItem value="Vencido">Vencido</SelectItem>
                <SelectItem value="Por Vencer">Por Vencer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className={initialData ? "sm:justify-between" : ""}>
          {initialData && onDelete && (
            <Button variant="destructive" onClick={() => { onDelete(); setOpen(false); }}>
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit}>Guardar</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
