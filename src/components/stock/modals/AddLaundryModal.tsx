'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { LaundryDay, LaundryItem } from '@/types/stock';

export interface AddLaundryModalProps {
    onSave: (record: LaundryDay) => void;
    initialData?: LaundryDay;
    onDelete?: () => void;
    trigger?: React.ReactNode;
}

const ITEMS_LIST = [
    "Sábanas Queen",
    "Sábanas Twin",
    "Toallas Grandes",
    "Toallas Mano",
    "Piso de Baño",
    "Repasadores"
];

export function AddLaundryModal({ onSave, initialData, onDelete, trigger }: AddLaundryModalProps) {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState(initialData?.notes || '');
    const [items, setItems] = useState<LaundryItem[]>(
        initialData?.items || [{ itemName: '', sentQuantity: 0, returnedQuantity: 0 }]
    );

    const handleAddItem = () => {
        setItems([...items, { itemName: '', sentQuantity: 0, returnedQuantity: 0 }]);
    };

    const handleRemoveItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const updateItem = (index: number, field: keyof LaundryItem, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const handleSubmit = () => {
        // Filter out empty rows
        const validItems = items.filter(i => i.itemName && i.sentQuantity > 0);

        if (validItems.length === 0) return;

        // Determine status based on returned vs sent
        const totalSent = validItems.reduce((acc, curr) => acc + curr.sentQuantity, 0);
        const totalReturned = validItems.reduce((acc, curr) => acc + curr.returnedQuantity, 0);

        let status: LaundryDay['status'] = 'Pendiente';
        if (totalReturned >= totalSent) status = 'Completo';
        else if (totalReturned > 0) status = 'Parcial';

        onSave({
            id: initialData?.id || Math.random().toString(36).substr(2, 9),
            date,
            items: validItems,
            notes,
            timestamp: initialData?.timestamp || new Date().toISOString(),
            user: initialData?.user || 'Admin',
            status
        });

        setOpen(false);
        if (!initialData) {
            // Reset form only if creating new
            setDate(new Date().toISOString().split('T')[0]);
            setNotes('');
            setItems([{ itemName: '', sentQuantity: 0, returnedQuantity: 0 }]);
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
                {trigger || (
                    <Button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90">
                        <Plus className="w-4 h-4 mr-2" />
                        Registrar Envío Diario
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Editar Envío a Lavandería' : 'Nuevo Envío a Lavandería'}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="date">Fecha</Label>
                        <Input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Artículos</Label>
                            <Button variant="outline" size="sm" onClick={handleAddItem}>
                                <Plus className="w-4 h-4 mr-2" />
                                Agregar Ítem
                            </Button>
                        </div>

                        {items.map((item, index) => (
                            <div key={index} className="flex gap-2 items-end border p-2 rounded-md bg-slate-50">
                                <div className="flex-1">
                                    <Label className="text-xs">Artículo</Label>
                                    <Select
                                        value={item.itemName}
                                        onValueChange={(v) => updateItem(index, 'itemName', v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ITEMS_LIST.map(i => (
                                                <SelectItem key={i} value={i}>{i}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="w-24">
                                    <Label className="text-xs">Enviado</Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={item.sentQuantity || ''}
                                        onChange={(e) => updateItem(index, 'sentQuantity', parseInt(e.target.value) || 0)}
                                    />
                                </div>
                                {/* Often returned quantity is 0 when sending out, but leaving option editable just in case */}
                                <div className="w-24">
                                    <Label className="text-xs">Devuelto</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={item.returnedQuantity || ''}
                                        onChange={(e) => updateItem(index, 'returnedQuantity', parseInt(e.target.value) || 0)}
                                    />
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleRemoveItem(index)}
                                    disabled={items.length === 1}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="notes">Observaciones Generales</Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Ej: Se llevaron sábanas con manchas..."
                        />
                    </div>
                </div>
                <DialogFooter className="flex justify-between sm:justify-between">
                    {initialData && onDelete ? (
                        <Button variant="destructive" onClick={handleDelete}>
                            Eliminar
                        </Button>
                    ) : <div></div>}
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSubmit}>Guardar Envío</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
