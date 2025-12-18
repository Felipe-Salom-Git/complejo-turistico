'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, DollarSign } from 'lucide-react';
import { useState } from 'react';
import { useReservations, Reservation } from '@/contexts/ReservationsContext'; // Ensure Reservation type is imported
import { shouldShowPaymentAlert } from '@/lib/policies';
import { PrepaymentActionModal } from './PrepaymentActionModal';

export function PrepaymentAlertsWidget() {
    const { reservations } = useReservations();
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const pendingReservations = reservations.filter(res => {
        // If flag is explicitly active based on backend/creation logic
        if (res.alertaPrecobroActiva) return true;

        // Or re-calculate for safety (e.g. date passed since creation)
        const hasDownPayment = !!res.tieneSeña || (res.amountPaid || 0) > 0;
        const isPrepaid = res.esPrepaga || res.cancellationPolicy === 'Pre-paga';

        return shouldShowPaymentAlert(
            res.cancellationPolicy,
            res.checkIn,
            hasDownPayment,
            !!isPrepaid
        );
    }).sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());

    if (pendingReservations.length === 0) return null;

    return (
        <Card className="col-span-1 md:col-span-3 border-l-4 border-l-yellow-500 mt-6 animate-in fade-in">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-yellow-600" />
                    <CardTitle>Cobros Pendientes</CardTitle>
                </div>
                <CardDescription>Reservas que requieren seña o pago total según su política</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="border rounded-md overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Huésped</TableHead>
                                <TableHead>Unidad</TableHead>
                                <TableHead>Llegada</TableHead>
                                <TableHead>Política</TableHead>
                                <TableHead className="text-right">Días Restantes</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pendingReservations.map(res => {
                                const daysLeft = Math.ceil((new Date(res.checkIn).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

                                return (
                                    <TableRow
                                        key={res.id}
                                        className="cursor-pointer hover:bg-yellow-50/50 transition-colors"
                                        onClick={() => {
                                            setSelectedReservation(res);
                                            setIsModalOpen(true);
                                        }}
                                    >
                                        <TableCell className="font-medium">{res.guestName}</TableCell>
                                        <TableCell>{res.unit}</TableCell>
                                        <TableCell>{new Date(res.checkIn).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="border-yellow-500 text-yellow-700 bg-yellow-50">
                                                {res.cancellationPolicy}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className={`text-right font-bold ${daysLeft < 5 ? 'text-red-500' : 'text-gray-700'}`}>
                                            {daysLeft} días
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>

            {selectedReservation && (
                <PrepaymentActionModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedReservation(null);
                    }}
                    reservation={selectedReservation}
                />
            )
            }
        </Card >
    );
}
