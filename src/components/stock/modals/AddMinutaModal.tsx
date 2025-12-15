'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

export function AddMinutaModal({ onSave }: { onSave: (item: any) => void }) {
  const [open, setOpen] = useState(false);
  const [unitId, setUnitId] = useState('');

  const handleSubmit = () => {
    onSave({
      unitId,
      items: [] // Empty items initially
    });
    setOpen(false);
    setUnitId('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Minuta
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generar Minuta de Unidad</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="unit">Unidad</Label>
            <Select onValueChange={setUnitId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar unidad..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cabaña 1">Cabaña 1</SelectItem>
                <SelectItem value="Cabaña 2">Cabaña 2</SelectItem>
                <SelectItem value="Suite Sol">Suite Sol</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-gray-500">
            La creación detallada de items de minuta se gestionará en el detalle de la minuta una vez creada.
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>Crear</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
