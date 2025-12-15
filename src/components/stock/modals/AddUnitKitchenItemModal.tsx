'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { UNITS } from '@/lib/constants';
import { KitchenItem } from '@/types/stock';

interface AddUnitKitchenItemModalProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSave: (item: any) => void;
    trigger?: React.ReactNode;
    initialData?: KitchenItem;
    onDelete?: () => void;
}

export function AddUnitKitchenItemModal({ onSave, trigger, initialData, onDelete }: AddUnitKitchenItemModalProps) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        unitId: '',
        quantity: 1,
        status: 'Bueno'
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                unitId: initialData.unitId || '',
                quantity: initialData.quantity,
                status: initialData.status || 'Bueno'
            });
        }
    }, [initialData, open]);

    const handleSubmit = () => {
        onSave({
            name: formData.name,
            unitId: formData.unitId,
            quantity: Number(formData.quantity),
            status: formData.status
        });
        setOpen(false);
        if (!initialData) {
            setFormData({ name: '', unitId: '', quantity: 1, status: 'Bueno' });
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
                        Agregar a Unidad
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Editar Ítem de Unidad' : 'Agregar ítem a unidad'}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="unit">Unidad</Label>
                        <Select
                            value={formData.unitId}
                            onValueChange={(v) => setFormData({ ...formData, unitId: v })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar unidad..." />
                            </SelectTrigger>
                            <SelectContent className="max-h-[200px]">
                                {UNITS.map((unit) => (
                                    <SelectItem key={unit.id} value={unit.name}>
                                        {unit.name} ({unit.type})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Artículo</Label>
                        <Input
                            id="name"
                            placeholder="Ej: Plato Playo"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="quantity">Cantidad</Label>
                            <Input
                                id="quantity"
                                type="number"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="status">Estado</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(v) => setFormData({ ...formData, status: v })}
                            >
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
                <DialogFooter className="flex justify-between sm:justify-between">
                    {initialData && onDelete ? (
                        <Button variant="destructive" onClick={handleDelete} className="gap-2">
                            <Trash2 className="h-4 w-4" /> Eliminar
                        </Button>
                    ) : <div></div>}
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSubmit} disabled={!formData.unitId || !formData.name}>Guardar</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
