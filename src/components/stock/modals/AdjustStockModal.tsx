'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { BlancoItem } from '@/types/stock';

interface AdjustStockModalProps {
    onSave: (item: any) => void;
    trigger?: React.ReactNode;
    initialData?: BlancoItem;
    onDelete?: () => void;
}

export function AdjustStockModal({ onSave, trigger, initialData, onDelete }: AdjustStockModalProps) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        totalStock: 0
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                category: initialData.category,
                totalStock: initialData.totalStock
            });
        }
    }, [initialData, open]);

    const handleSubmit = () => {
        onSave({
            ...formData,
            items: [], // mock for now as backend/mocks expect full object logic structure? Actually BlancoItem structure is simpler.
            // Wait, looking at BlancoItem type: id, name, category, totalStock, laundryStock, availableStock, minStock, lastUpdate.
            // The modal collects name, category, totalStock.
            // onSave wrapper in Tab handles the rest logic (calculating availableStock etc).
            totalStock: Number(formData.totalStock)
        });
        setOpen(false);
        if (!initialData) {
            setFormData({ name: '', category: '', totalStock: 0 });
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
                        Ajustar Stock
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Editar Stock' : 'Ajustar Stock General'}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="category">Categoría</Label>
                        <Select
                            value={formData.category}
                            onValueChange={(v) => setFormData({ ...formData, category: v })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Sábanas">Sábanas</SelectItem>
                                <SelectItem value="Toallas">Toallas</SelectItem>
                                <SelectItem value="Otros">Otros</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Artículo</Label>
                        <Input
                            id="name"
                            placeholder="Ej: Sábanas Queen"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="total">Cantidad Total Disponible</Label>
                        <Input
                            id="total"
                            type="number"
                            value={formData.totalStock}
                            onChange={(e) => setFormData({ ...formData, totalStock: parseInt(e.target.value) || 0 })}
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
