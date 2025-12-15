'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, AlertCircle, PackageX } from 'lucide-react';
// import { MOCK_BLANCOS, MOCK_MANTENIMIENTO, MOCK_MINUTAS, MOCK_LIMPIEZA, MOCK_SPARE_ITEMS } from '@/lib/mock-stock';
import { FireExtinguisher } from '@/types/stock';
import { useStock } from '@/contexts/StockContext';

export function AlertsWidget() {
    // --- MATAFUEGOS LOGIC ---
    // Rules:
    // 1. "Préstamo" state overrides expiration logic.
    // 2. Otherwise calculate Vencido (< today) or Por Vencer (< 30 days).

    interface MatafuegoAlert extends FireExtinguisher {
        computedStatus: 'Vencido' | 'Por Vencer' | 'Préstamo';
    }

    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const { matafuegos, minutas, limpieza, mantenimiento } = useStock();

    const matafuegoAlerts: MatafuegoAlert[] = matafuegos.map(m => {
        // If manually set to Préstamo in stock, respect it
        if (m.status === 'Préstamo') {
            return { ...m, computedStatus: 'Préstamo' };
        }

        const expDate = new Date(m.expirationDate);

        if (expDate < today) {
            return { ...m, computedStatus: 'Vencido' };
        } else if (expDate <= thirtyDaysFromNow) {
            return { ...m, computedStatus: 'Por Vencer' };
        }

        return null;
    }).filter((m): m is MatafuegoAlert => m !== null)
        .sort((a, b) => {
            // Priority: Vencido > Por Vencer > Préstamo
            const priorities = { 'Vencido': 1, 'Por Vencer': 2, 'Préstamo': 3 };
            return priorities[a.computedStatus] - priorities[b.computedStatus];
        });

    // --- STOCK LOGIC ---
    const DEFAULT_THRESHOLD = 10;

    const lowStockItems = [
        // Blancos and Cocina omitted as per user request
        ...mantenimiento.map(i => ({ name: i.name, category: 'Mantenimiento', quantity: i.stock, min: i.minStock || DEFAULT_THRESHOLD })),
        ...minutas.map(i => ({ name: i.name, category: 'Minutas', quantity: i.quantity, min: DEFAULT_THRESHOLD })),
        ...limpieza.map(i => ({ name: i.name, category: 'Limpieza', quantity: i.quantity, min: DEFAULT_THRESHOLD }))
    ].filter(item => item.quantity <= item.min);


    // if (matafuegoAlerts.length === 0 && lowStockItems.length === 0) {
    //    return null; 
    // }

    const getBadgeVariant = (status: string) => {
        switch (status) {
            case 'Vencido': return 'destructive';
            case 'Por Vencer': return 'secondary'; // Orange-ish often custom, using secondary for now or default
            case 'Préstamo': return 'outline';
            default: return 'default';
        }
    };

    return (
        <Card className="col-span-1 md:col-span-3 border-l-4 border-l-amber-500 mt-6">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <CardTitle>Alertas Operativas</CardTitle>
                </div>
                <CardDescription>Atención requerida para matafuegos y reposición de stock</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* MATAFUEGOS SECTION */}
                <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2 text-red-600">
                        <AlertCircle className="h-4 w-4" /> Matafuegos
                    </h3>
                    {matafuegoAlerts.length === 0 ? (
                        <div className="text-sm text-gray-500 italic">Todo en orden</div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Ubicación</TableHead>
                                        <TableHead>Vencimiento</TableHead>
                                        <TableHead>Estado</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {matafuegoAlerts.map(m => (
                                        <TableRow key={m.id}>
                                            <TableCell className="font-medium">{m.location}</TableCell>
                                            <TableCell>{m.expirationDate}</TableCell>
                                            <TableCell>
                                                <Badge variant={getBadgeVariant(m.computedStatus as string)}>
                                                    {m.computedStatus}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>

                {/* STOCK SECTION */}
                <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2 text-orange-600">
                        <PackageX className="h-4 w-4" /> Stock Bajo / Crítico
                    </h3>
                    {lowStockItems.length === 0 ? (
                        <div className="text-sm text-gray-500 italic">Stock saludable</div>
                    ) : (
                        <div className="max-h-[300px] overflow-y-auto border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Artículo</TableHead>
                                        <TableHead>Origen</TableHead>
                                        <TableHead className="text-right">Cant.</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {lowStockItems.map((item, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell className="font-medium">{item.name}</TableCell>
                                            <TableCell className="text-muted-foreground text-xs">{item.category}</TableCell>
                                            <TableCell className="text-right font-bold text-red-600">{item.quantity}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>

            </CardContent>
        </Card>
    );
}
