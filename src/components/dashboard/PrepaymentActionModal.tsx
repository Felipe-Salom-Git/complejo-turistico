'use client';

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Reservation, useReservations } from "@/contexts/ReservationsContext";
import { CreditCard, Send, CheckCircle2, Copy } from "lucide-react";
import { fetchExchangeRates, ExchangeRates } from "@/lib/currency";

interface PrepaymentActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    reservation: Reservation; // The reserved item
}

export function PrepaymentActionModal({
    isOpen,
    onClose,
    reservation,
}: PrepaymentActionModalProps) {
    const { updateReservation } = useReservations();
    const [activeTab, setActiveTab] = useState("payment");

    // Payment Form State
    const [amount, setAmount] = useState("");
    const [currency, setCurrency] = useState<"ARS" | "USD">("USD");
    const [method, setMethod] = useState("Transferencia");
    const [exchangeRate, setExchangeRate] = useState<number>(0);
    const [rates, setRates] = useState<ExchangeRates>({ BNA: 0, PAYWAY: 0 });

    // Message State
    const [messageText, setMessageText] = useState("");

    // Load Rates
    useEffect(() => {
        fetchExchangeRates().then((data) => {
            setRates(data);
            // Auto-set rate if ARS
            if (reservation.nacionalidadTipo === "ARGENTINO") {
                setExchangeRate(data.BNA);
            } else {
                setExchangeRate(data.PAYWAY); // or default
            }
        });
    }, [reservation]);

    // Generate Message Template
    useEffect(() => {
        if (isOpen && reservation) {
            // Simple template
            const text = `Hola ${reservation.guestName}, te contactamos de Complejo Turístico.\n\n` +
                `Recordamos que tu reserva para el ${new Date(reservation.checkIn).toLocaleDateString()} requiere una seña/pago previo según la política "${reservation.cancellationPolicy}".\n\n` +
                `Por favor, indícanos si necesitas los datos bancarios para realizar la transferencia.\n\n` +
                `¡Muchas gracias!`;
            setMessageText(text);
        }
    }, [isOpen, reservation]);

    const handleRegisterPayment = () => {
        const val = parseFloat(amount);
        if (!val || val <= 0) {
            alert("Ingrese un monto válido.");
            return;
        }

        // Prepare Updated Reservation
        const newPayment = {
            id: Date.now().toString(),
            date: new Date(),
            amount: val,
            currency: currency,
            method: method as any,
            exchangeRate: currency === 'ARS' ? exchangeRate : undefined,
        };

        const updatedRes = { ...reservation };
        updatedRes.payments = [...(reservation.payments || []), newPayment];

        // Recalculate Totals (Basic Logic)
        // Note: The context `updateReservation` hook we built earlier ALREADY sets `tieneSeña` and `alertaPrecobroActiva = false`
        // when it detects a new payment. So we just need to pass the updated payments list.
        // However, let's explicitely update local paid amount for correctness before sending.
        const currentPaid = updatedRes.amountPaid || 0;
        updatedRes.amountPaid = currentPaid + val;

        // Send Update
        updateReservation(updatedRes);

        alert("Pago registrado exitosamente. La alerta ha sido resuelta.");
        onClose();
    };

    const handleSendMessage = (channel: 'whatsapp' | 'email') => {
        if (channel === 'whatsapp') {
            // WhatsApp Link
            // Ensure phone number is clean
            // If no phone, prompt user? assuming reservation.phone exists or fallback
            const phone = reservation.phone?.replace(/\D/g, '') || '';
            if (!phone) {
                alert('No hay teléfono registrado para este huésped.');
                return;
            }

            const encoded = encodeURIComponent(messageText);
            const url = `https://wa.me/${phone}?text=${encoded}`;
            window.open(url, '_blank');
        } else {
            // Mailto
            const subject = encodeURIComponent(`Recordatorio de Pago - Reserva ${reservation.id.slice(-4)}`);
            const body = encodeURIComponent(messageText);
            const url = `mailto:${reservation.email || ''}?subject=${subject}&body=${body}`;
            window.open(url, '_blank');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Gestionar Cobro Pendiente</DialogTitle>
                    <DialogDescription>
                        Reserva de {reservation.guestName} - {reservation.unit}
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="payment">Registrar Pago</TabsTrigger>
                        <TabsTrigger value="message">Enviar Aviso</TabsTrigger>
                    </TabsList>

                    {/* TAB 1: REGISTER PAYMENT */}
                    <TabsContent value="payment" className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Monto</Label>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Moneda</Label>
                                <Select value={currency} onValueChange={(v: "USD" | "ARS") => setCurrency(v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USD">USD</SelectItem>
                                        <SelectItem value="ARS">ARS</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Método de Pago</Label>
                            <Select value={method} onValueChange={setMethod}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Transferencia">Transferencia</SelectItem>
                                    <SelectItem value="Efectivo">Efectivo</SelectItem>
                                    <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                                    <SelectItem value="Debito">Débito</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {currency === 'ARS' && (
                            <div className="text-xs text-muted-foreground bg-slate-100 p-2 rounded">
                                Cotización aplicada: ${exchangeRate}
                            </div>
                        )}

                        <Button onClick={handleRegisterPayment} className="w-full bg-emerald-600 hover:bg-emerald-700">
                            <CheckCircle2 className="w-4 h-4 mr-2" /> Confirmar Cobro & Resolver
                        </Button>
                    </TabsContent>

                    {/* TAB 2: SEND MESSAGE */}
                    <TabsContent value="message" className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Mensaje (Editable)</Label>
                            <Textarea
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                className="min-h-[150px] text-sm"
                            />
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1 bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                onClick={() => handleSendMessage('whatsapp')}
                            >
                                <Send className="w-4 h-4 mr-2" /> WhatsApp
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => handleSendMessage('email')}
                            >
                                Email
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
