'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { KitchenItem } from '@/types/stock';

interface AddSpareKitchenItemModalProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSave: (item: any) => void;
    trigger?: React.ReactNode;
    initialData?: KitchenItem & { observations?: string };
    onDelete?: () => void;
}

export function AddSpareKitchenItemModal({ onSave, trigger, initialData, onDelete }: AddSpareKitchenItemModalProps) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        quantity: 1,
        observations: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                quantity: initialData.quantity,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                observations: (initialData as any).observations || ''
            });
        }
    }, [initialData, open]);

    const handleSubmit = () => {
        onSave({
            name: formData.name,
            quantity: Number(formData.quantity),
            observations: formData.observations
        });
        setOpen(false);
        if (!initialData) {
            setFormData({ name: '', quantity: 1, observations: '' });
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
                        Agregar Repuesto
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Editar Repuesto' : 'Agregar Repuesto de Cocina'}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Artículo</Label>
                        <Input
                            id="name"
                            placeholder="Ej: Vaso Vidrio"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="quantity">Cantidad Disponible</Label>
                        <Input
                            id="quantity"
                            type="number"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="observations">Observaciones</Label>
                        <Textarea
                            id="observations"
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
