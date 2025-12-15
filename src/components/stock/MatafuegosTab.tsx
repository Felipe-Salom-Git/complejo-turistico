'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FireExtinguisher } from '@/types/stock';
import { AddMatafuegoModal } from '@/components/stock/modals/AddMatafuegoModal';
import { useStock } from '@/contexts/StockContext';

import { Pencil, Trash2 } from 'lucide-react';

export function MatafuegosTab() {
    const { matafuegos, addMatafuego, updateMatafuego, deleteMatafuego } = useStock();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleAdd = (item: any) => {
        // Simple logic to determine status
        const expiration = new Date(item.expirationDate);
        const today = new Date();
        let status: FireExtinguisher['status'] = item.status || 'Vigente';

        // Only override with date logic if not manually set to Préstamo
        if (status !== 'Préstamo') {
            if (expiration < today) {
                status = 'Vencido';
            }
        }

        addMatafuego({ ...item, status });
    };

    const handleUpdate = (id: string, updatedData: any) => {
        updateMatafuego(id, updatedData);
    };

    const handleDelete = (id: string) => {
        deleteMatafuego(id);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Control de Matafuegos</CardTitle>
                <AddMatafuegoModal onSave={handleAdd} />
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Ubicación</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Vencimiento</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {matafuegos.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.location}</TableCell>
                                <TableCell>{item.type}</TableCell>
                                <TableCell>{item.expirationDate}</TableCell>
                                <TableCell>
                                    <Badge variant={item.status === 'Vencido' ? 'destructive' : item.status === 'Por Vencer' ? 'secondary' : item.status === 'Préstamo' ? 'outline' : 'default'}>
                                        {item.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <AddMatafuegoModal
                                        initialData={item}
                                        onSave={(data) => handleUpdate(item.id, data)}
                                        onDelete={() => handleDelete(item.id)}
                                        trigger={
                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100">
                                                <Pencil className="h-4 w-4 text-slate-500" />
                                            </Button>
                                        }
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
