'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { MaintenanceItem } from '@/types/stock';

interface AddMantenimientoModalProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (item: any) => void;
  trigger?: React.ReactNode;
  initialData?: MaintenanceItem;
  onDelete?: () => void;
}

export function AddMantenimientoModal({ onSave, trigger, initialData, onDelete }: AddMantenimientoModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    stock: 0,
    minStock: 0,
    observations: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        category: initialData.category,
        stock: initialData.stock,
        minStock: initialData.minStock,
        observations: initialData.observations || ''
      });
    }
  }, [initialData, open]);

  const handleSubmit = () => {
    onSave({
      name: formData.name,
      category: formData.category,
      stock: Number(formData.stock),
      minStock: Number(formData.minStock),
      observations: formData.observations
    });
    setOpen(false);
    if (!initialData) {
      setFormData({ name: '', category: '', stock: 0, minStock: 0, observations: '' });
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? trigger : (
          <Button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Insumo
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Insumo' : 'Nuevo Insumo Mantenimiento'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre Artículo</Label>
            <Input
              id="name"
              placeholder="Ej: Clavos 2 pulgadas"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Categoría</Label>
            <Input
              id="category"
              placeholder="Ej: Ferretería, Pintura..."
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="stock">Stock Actual</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="min">Stock Mínimo</Label>
              <Input
                id="min"
                type="number"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Observaciones</Label>
            <Textarea
              id="notes"
              value={formData.observations}
              onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          {initialData && onDelete ? (
            <Button variant="destructive" onClick={handleDelete} className="gap-2">
              <Trash2 className="h-4 w-4" /> Eliminar
            </Button>
          ) : <div></div>}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit}>{initialData ? 'Guardar Cambios' : 'Guardar'}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
