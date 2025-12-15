'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LaundryDay } from '@/types/stock';

interface LaundryDetailModalProps {
    day: LaundryDay | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function LaundryDetailModal({ day, open, onOpenChange }: LaundryDetailModalProps) {
    if (!day) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Detalle de Lavandería - {day.date}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-semibold">Usuario:</span> {day.user}
                        </div>
                        <div>
                            <span className="font-semibold">Registrado:</span> {new Date(day.timestamp).toLocaleString()}
                        </div>
                        {day.notes && (
                            <div className="col-span-2">
                                <span className="font-semibold">Observaciones:</span> {day.notes}
                            </div>
                        )}
                    </div>

                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Artículo</TableHead>
                                    <TableHead className="text-right">Enviado</TableHead>
                                    <TableHead className="text-right">Devuelto</TableHead>
                                    <TableHead className="text-right">Pendiente</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {day.items.map((item, index) => {
                                    const pending = item.sentQuantity - item.returnedQuantity;
                                    return (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{item.itemName}</TableCell>
                                            <TableCell className="text-right">{item.sentQuantity}</TableCell>
                                            <TableCell className="text-right">{item.returnedQuantity}</TableCell>
                                            <TableCell className={`text-right ${pending > 0 ? 'text-red-500 font-bold' : 'text-green-600'}`}>
                                                {pending}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
