import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MinutaItem } from '@/types/stock';
import { AddGeneralStockModal } from '@/components/stock/modals/AddGeneralStockModal';
import { useStock } from '@/contexts/StockContext';
import { Pencil } from 'lucide-react';

export function MinutasTab() {
    const { minutas, addMinuta, updateMinuta, deleteMinuta } = useStock();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleAdd = (item: any) => {
        addMinuta({
            ...item,
            lastUpdate: new Date().toISOString().split('T')[0]
        });
    };

    const handleUpdate = (id: string, updatedData: any) => {
        updateMinuta(id, {
            ...updatedData,
            lastUpdate: new Date().toISOString().split('T')[0]
        });
    };

    const handleDelete = (id: string) => {
        deleteMinuta(id);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Minutas de Unidades (Stock General)</CardTitle>
                    <CardDescription>Consumibles entregados a huéspedes</CardDescription>
                </div>
                <AddGeneralStockModal
                    title="Agregar Minuta"
                    triggerLabel="Nueva Minuta"
                    onSave={handleAdd}
                />
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Artículo</TableHead>
                            <TableHead>Categoría</TableHead>
                            <TableHead>Cantidad Disponible</TableHead>
                            <TableHead>Observaciones</TableHead>
                            <TableHead>Última Actualización</TableHead>
                            <TableHead className="w-[100px]">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {minutas.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.category || '-'}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{item.observations || '-'}</TableCell>
                                <TableCell>{item.lastUpdate}</TableCell>
                                <TableCell>
                                    <AddGeneralStockModal
                                        title="Editar Minuta"
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
