'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MaintenanceItem } from '@/types/stock';
import { AddMantenimientoModal } from '@/components/stock/modals/AddMantenimientoModal';
import { useStock } from '@/contexts/StockContext';
import { Pencil } from 'lucide-react';

export function MantenimientoTab() {
    const { mantenimiento, addMantenimiento, updateMantenimiento, deleteMantenimiento } = useStock();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleAdd = (item: any) => {
        addMantenimiento(item);
    };

    const handleUpdate = (id: string, updatedData: any) => {
        updateMantenimiento(id, updatedData);
    };

    const handleDelete = (id: string) => {
        deleteMantenimiento(id);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Insumos de Mantenimiento</CardTitle>
                <AddMantenimientoModal onSave={handleAdd} />
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Artículo</TableHead>
                            <TableHead>Categoría</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Observaciones</TableHead>
                            <TableHead className="w-[100px]">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mantenimiento.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell className="w-[200px]">
                                    <div className="flex items-center gap-2">
                                        <span>{item.stock}</span>
                                        <Progress value={(item.stock / (item.minStock * 2)) * 100} className="h-2" />
                                    </div>
                                </TableCell>
                                <TableCell>{item.observations || '-'}</TableCell>
                                <TableCell>
                                    <AddMantenimientoModal
                                        trigger={
                                            <Button variant="ghost" size="icon">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        }
                                        initialData={item}
                                        onSave={(data) => handleUpdate(item.id, data)}
                                        onDelete={() => handleDelete(item.id)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
