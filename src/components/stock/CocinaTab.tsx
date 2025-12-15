'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UNITS } from '@/lib/constants';
import { AddUnitKitchenItemModal } from '@/components/stock/modals/AddUnitKitchenItemModal';
import { AddSpareKitchenItemModal } from '@/components/stock/modals/AddSpareKitchenItemModal';
import { useStock } from '@/contexts/StockContext';
import { Pencil } from 'lucide-react';

export function CocinaTab() {
    const {
        cocinaUnidades, addCocinaUnidad, updateCocinaUnidad, deleteCocinaUnidad,
        cocinaRepuestos, addCocinaRepuesto, updateCocinaRepuesto, deleteCocinaRepuesto
    } = useStock();

    const [selectedUnit, setSelectedUnit] = useState<string>(UNITS[0].name);

    // Filter items for the selected unit
    const currentUnitItems = cocinaUnidades.filter(item => item.unitId === selectedUnit);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleAddUnitItem = (item: any) => {
        addCocinaUnidad({
            ...item,
            // id generation handled in context
        });
    };

    const handleUpdateUnitItem = (id: string, data: any) => {
        updateCocinaUnidad(id, data);
    };

    const handleDeleteUnitItem = (id: string) => {
        deleteCocinaUnidad(id);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleAddSpareItem = (item: any) => {
        addCocinaRepuesto({
            ...item,
            status: 'Bueno' // default if not provided
        });
    };

    const handleUpdateSpareItem = (id: string, data: any) => {
        updateCocinaRepuesto(id, data);
    };

    const handleDeleteSpareItem = (id: string) => {
        deleteCocinaRepuesto(id);
    };

    return (
        <div className="space-y-8">
            {/* Section 1: Inventario por Unidad */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Inventario por Unidad</CardTitle>
                            <CardDescription>Materiales asignados a cada unidad</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Seleccionar unidad" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px]">
                                    {UNITS.map((unit) => (
                                        <SelectItem key={unit.id} value={unit.name}>
                                            {unit.name} ({unit.type})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <AddUnitKitchenItemModal onSave={handleAddUnitItem} />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Artículo</TableHead>
                                    <TableHead>Cantidad</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="w-[100px]">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentUnitItems.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                                            No hay ítems registrados en esta unidad
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    currentUnitItems.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.name}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>
                                                <Badge variant={item.status === 'Malo' ? 'destructive' : 'outline'}>
                                                    {item.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <AddUnitKitchenItemModal
                                                    trigger={
                                                        <Button variant="ghost" size="icon">
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    }
                                                    initialData={item}
                                                    onSave={(data) => handleUpdateUnitItem(item.id, data)}
                                                    onDelete={() => handleDeleteUnitItem(item.id)}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Section 2: Inventario de Repuesto */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Inventario de Repuesto</CardTitle>
                        <CardDescription>Stock central para reposición</CardDescription>
                    </div>
                    <AddSpareKitchenItemModal onSave={handleAddSpareItem} />
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Artículo</TableHead>
                                <TableHead>Cantidad Disponible</TableHead>
                                <TableHead>Observaciones</TableHead>
                                <TableHead className="w-[100px]">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cocinaRepuestos.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{(item as any).observations || '-'}</TableCell>
                                    <TableCell>
                                        <AddSpareKitchenItemModal
                                            trigger={
                                                <Button variant="ghost" size="icon">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            }
                                            initialData={item}
                                            onSave={(data) => handleUpdateSpareItem(item.id, data)}
                                            onDelete={() => handleDeleteSpareItem(item.id)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
