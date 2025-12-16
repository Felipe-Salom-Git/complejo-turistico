'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BlancoItem, LaundryDay } from '@/types/stock';
import { AddLaundryModal } from '@/components/stock/modals/AddLaundryModal';
import { AdjustStockModal } from '@/components/stock/modals/AdjustStockModal';
import { LaundryDetailModal } from '@/components/stock/modals/LaundryDetailModal';
import { Eye, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStock } from '@/contexts/StockContext';

// Removed MOCK_BLANCOS as it is now in Context
// const MOCK_BLANCOS: BlancoItem[] = ...

// MOCK_LAUNDRY_DAYS removed, using context

export function BlancosTab() {
    const {
        blancos, addBlanco, updateBlanco, deleteBlanco,
        laundryDays, addLaundryDay, updateLaundryDay, deleteLaundryDay
    } = useStock();

    // Detail Modal State
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState<LaundryDay | null>(null);

    const handleDetailClick = (e: React.MouseEvent, day: LaundryDay) => {
        e.stopPropagation();
        handleViewDetail(day);
    };

    const handleUpdateLaundry = (id: string, updatedRecord: LaundryDay) => {
        updateLaundryDay(id, updatedRecord);
    };

    const handleDeleteLaundry = (id: string) => {
        deleteLaundryDay(id);
    };

    const handleViewDetail = (day: LaundryDay) => {
        setSelectedDay(day);
        setDetailOpen(true);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleAdjustStock = (item: any) => {
        // Logic similar to local state but using context
        // Check if exists logic could be here if we want to update instead of add duplicate names,
        // but for now we'll assume the user adds new items or edits existing ones via the pencil.
        // If it's a new item (via the top + button):
        addBlanco({
            ...item,
            laundryStock: 0,
            availableStock: item.totalStock,
            minStock: 0,
            lastUpdate: new Date().toISOString().split('T')[0]
        });
    };

    const handleUpdateBlanco = (id: string, data: any) => {
        updateBlanco(id, {
            ...data,
            availableStock: data.totalStock, // Simplified logic: resetting available to total on edit for now
            lastUpdate: new Date().toISOString().split('T')[0]
        });
    };

    const handleDeleteBlanco = (id: string) => {
        deleteBlanco(id);
    };

    const getStatusColor = (status: LaundryDay['status']) => {
        switch (status) {
            case 'Completo': return 'default'; // dark/black usually
            case 'Parcial': return 'secondary'; // gray
            case 'Pendiente': return 'destructive'; // red
            default: return 'outline';
        }
    };

    return (
        <div className="space-y-8">
            {/* Control de Lavandería Section */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Control de Lavandería (Diario)</CardTitle>
                        <CardDescription>Registro agrupado por día de envío</CardDescription>
                    </div>
                    <AddLaundryModal onSave={addLaundryDay} />
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Items Enviados (Total)</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Observaciones</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {laundryDays.map((day) => {
                                const totalItems = day.items.reduce((acc, curr) => acc + curr.sentQuantity, 0);
                                return (
                                    <TableRow key={day.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleViewDetail(day)}>
                                        <TableCell className="font-medium">{day.date}</TableCell>
                                        <TableCell>{totalItems} unidades</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusColor(day.status)}>{day.status}</Badge>
                                        </TableCell>
                                        <TableCell className="max-w-[200px] truncate">{day.notes || '-'}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={(e) => handleDetailClick(e, day)}>
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <div onClick={(e) => e.stopPropagation()}>
                                                    <AddLaundryModal
                                                        initialData={day}
                                                        onSave={(updated) => handleUpdateLaundry(day.id, updated)}
                                                        onDelete={() => handleDeleteLaundry(day.id)}
                                                        trigger={
                                                            <Button variant="ghost" size="icon">
                                                                <Pencil className="w-4 h-4" />
                                                            </Button>
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Stock General Section */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Stock General de Blancos</CardTitle>
                        <CardDescription>Inventario total del complejo</CardDescription>
                    </div>
                    <AdjustStockModal onSave={handleAdjustStock} />
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Artículo</TableHead>
                                <TableHead>Categoría</TableHead>
                                <TableHead>Total Disponible</TableHead>
                                <TableHead>Última Actualización</TableHead>
                                <TableHead className="w-[100px]">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {blancos.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell>{item.totalStock}</TableCell>
                                    <TableCell>{item.lastUpdate}</TableCell>
                                    <TableCell>
                                        <AdjustStockModal
                                            trigger={
                                                <Button variant="ghost" size="icon">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            }
                                            initialData={item}
                                            onSave={(data) => handleUpdateBlanco(item.id, data)}
                                            onDelete={() => handleDeleteBlanco(item.id)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <LaundryDetailModal
                day={selectedDay}
                open={detailOpen}
                onOpenChange={setDetailOpen}
            />
        </div>
    );
}
