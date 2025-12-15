'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

export function AddCocinaModal({ onSave }: { onSave: (item: any) => void }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    unitId: '',
    quantity: 1,
    status: 'Bueno'
  });

  const handleSubmit = () => {
    onSave({
      name: formData.name,
      unitId: formData.unitId,
      quantity: Number(formData.quantity),
      status: formData.status
    });
    setOpen(false);
    setFormData({ name: '', unitId: '', quantity: 1, status: 'Bueno' });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Ítem Cocina
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo Material de Cocina</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre Artículo</Label>
            <Input
              id="name"
              placeholder="Ej: Olla 5L"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="unit">Unidad Asociada</Label>
            <Select onValueChange={(v) => setFormData({ ...formData, unitId: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar cabaña..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cabaña 1">Cabaña 1</SelectItem>
                <SelectItem value="Cabaña 2">Cabaña 2</SelectItem>
                <SelectItem value="Suite Sol">Suite Sol</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="quantity">Cantidad</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Estado</Label>
              <Select onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bueno">Bueno</SelectItem>
                  <SelectItem value="Regular">Regular</SelectItem>
                  <SelectItem value="Malo">Malo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
