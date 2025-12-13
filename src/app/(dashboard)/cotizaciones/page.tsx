'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Send, FileText, CheckCircle, Calculator, User } from 'lucide-react';
import { useQuotations, Quotation } from '@/contexts/QuotationsContext';
import { useReservations } from '@/contexts/ReservationsContext';

export default function CotizacionesPage() {
  const { quotations, addQuotation, updateQuotation, deleteQuotation } = useQuotations();
  const { addReservation, findAvailableUnit } = useReservations();
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quotation | null>(null);
  
  // New Quotation Form State
  const [formData, setFormData] = useState({
    guestName: '',
    email: '',
    phone: '',
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    pax: 2,
    unit: '',
    amountUSD: 0,
    exchangeRate: 1460,
    depositPercentage: 30
  });

  // Fetch BNA Dollar Rate
  useEffect(() => {
    fetch('https://dolarapi.com/v1/dolares/oficial')
      .then(res => res.json())
      .then(data => {
        if (data && data.venta) {
          setFormData(prev => ({ ...prev, exchangeRate: data.venta }));
        }
      })
      .catch(err => console.error("Error fetching dollar rate:", err));
  }, []);

  // Calculated Values for Form
  const amountARS = formData.amountUSD * formData.exchangeRate;
  const depositAmount = amountARS * (formData.depositPercentage / 100);
  const balanceAmount = amountARS - depositAmount;

  const emailPreview = `
Estimado/a ${formData.guestName},

Gracias por su interés en nuestro complejo.
A continuación le enviamos la cotización solicitada:

Unidad: ${formData.unit}
Check-in: ${formData.checkIn}
Check-out: ${formData.checkOut}
Pasajeros: ${formData.pax}

Total Estadía: USD ${formData.amountUSD} (Cotización ARS ${formData.exchangeRate})
Total ARS: $${amountARS.toLocaleString('es-AR')}

Para confirmar su reserva requerimos una seña del ${formData.depositPercentage}% ($${depositAmount.toLocaleString('es-AR')}).
El saldo restante ($${balanceAmount.toLocaleString('es-AR')}) se abona al ingresar.

Quedamos a su disposición.
Saludos cordiales.
  `.trim();

  const handleCreate = () => {
    const newQuote: Quotation = {
        id: Date.now().toString(),
        ...formData,
        // Append T12:00:00 to ensure it parses as local noon effectively, avoiding midnight UTC shifts
        checkIn: new Date(formData.checkIn + 'T12:00:00'),
        checkOut: new Date(formData.checkOut + 'T12:00:00'),
        amountARS,
        depositAmount,
        balanceAmount,
        status: 'pending',
        createdAt: new Date()
    };
    addQuotation(newQuote);
    setIsNewOpen(false);
    // Mock Send Email
    alert("Cotización enviada por email exitosamente!");
  };

  // Confirm Reservation State
  const [confirmStep, setConfirmStep] = useState<'details' | 'success'>('details');
  const [paymentInput, setPaymentInput] = useState("");

  const handleConfirmReservation = () => {
    if(!selectedQuote) return;
    
    // 1. Find Available Unit based on Type/Name
    const assignedUnit = findAvailableUnit(selectedQuote.unit, selectedQuote.checkIn, selectedQuote.checkOut);

    if (!assignedUnit) {
        alert(`No hay disponibilidad para unidad tipo "${selectedQuote.unit}" en esas fechas.`);
        return;
    }

    // Add to Reservations
    addReservation({
        id: `RES-${Date.now()}`,
        unit: assignedUnit, // Use the found/assigned unit
        guestName: selectedQuote.guestName,
        checkIn: selectedQuote.checkIn,
        checkOut: selectedQuote.checkOut,
        status: 'active',
        pax: selectedQuote.pax,
        email: selectedQuote.email,
        phone: selectedQuote.phone,
        total: selectedQuote.amountARS, 
        totalUSD: selectedQuote.amountUSD,
        amountPaid: parseFloat(paymentInput) || 0,
        amountPaidUSD: parseFloat(paymentInput) ? (parseFloat(paymentInput) / selectedQuote.exchangeRate) : 0,
        observations: `Reserva creada desde cotización. Unidad asignada: ${assignedUnit} (Tipo solicitado: ${selectedQuote.unit}). Cotización USD: ${selectedQuote.amountUSD}`,
        payments: parseFloat(paymentInput) ? [{
            id: Date.now().toString(),
            date: new Date(),
            amount: parseFloat(paymentInput),
            currency: 'ARS', // Assuming initial payment is in ARS as it asks for "Monto transferido" and suggests ARS
            method: 'Transferencia', 
            invoiceNumber: '',
            exchangeRate: selectedQuote.exchangeRate
        }] : []
    });

    // Mark Quote as Confirmed (or delete it? User said "pasa a ser directamente a reservas")
    // Usually better to keep history or delete. Let's delete to move it.
    deleteQuotation(selectedQuote.id);
    setConfirmStep('success');
  };

  const confirmationMessage = selectedQuote ? `
¡Hola ${selectedQuote.guestName}!
Su reserva ha sido confirmada con éxito.

Unidad: ${selectedQuote.unit}
Fecha: ${new Date(selectedQuote.checkIn).toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })} al ${new Date(selectedQuote.checkOut).toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}

¡Los esperamos!
  `.trim() : '';

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Cotizaciones</h1>
            <Button onClick={() => setIsNewOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-5 h-5 mr-2" /> Nueva Cotización
            </Button>
       </div>

       {/* List of Quotations */}
       <Card>
        <CardContent className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Huésped</TableHead>
                        <TableHead>Estadía</TableHead>
                        <TableHead>Info Económica</TableHead>
                        <TableHead>Seña Sugerida</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {quotations.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No hay cotizaciones pendientes.</TableCell>
                        </TableRow>
                    ) : (
                        quotations.map(q => (
                            <TableRow key={q.id}>
                                <TableCell>
                                    <div className="font-medium">{q.guestName}</div>
                                    <div className="text-xs text-gray-500">{q.email}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm">{new Date(q.checkIn).toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })} - {new Date(q.checkOut).toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}</div>
                                    <div className="text-xs text-gray-500 font-bold">{q.unit}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm font-bold text-blue-600">USD {q.amountUSD}</div>
                                    <div className="text-xs text-gray-500">x {q.exchangeRate} = ${q.amountARS.toLocaleString()}</div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary">{q.depositPercentage}%</Badge>
                                    <span className="text-xs ml-2 font-medium">${q.depositAmount.toLocaleString()}</span>
                                </TableCell>
                                <TableCell>
                                    <Badge className="bg-orange-100 text-orange-700 border-orange-200">Pendiente</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" onClick={() => { setSelectedQuote(q); setConfirmStep('details'); setPaymentInput(q.depositAmount.toString()); }}>
                                        Ver / Confirmar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </CardContent>
       </Card>

       {/* New Quotation Dialog */}
       <Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
        <DialogContent className="sm:max-w-[50vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Generar Nueva Cotización</DialogTitle>
                <DialogDescription>Complete los datos para generar la cotización y el correo automático.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-4">
                <div className="space-y-4">
                    <h3 className="font-semibold text-sm uppercase text-gray-500 mb-2 flex items-center gap-2"><User className="w-4 h-4" /> Datos Pasajero</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                             <Label>Nombre Completo</Label>
                             <Input value={formData.guestName} onChange={e => setFormData({...formData, guestName: e.target.value})} />
                        </div>
                        <div>
                             <Label>Email</Label>
                             <Input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                        </div>
                        <div>
                             <Label>Teléfono</Label>
                             <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                        </div>
                    </div>

                    <h3 className="font-semibold text-sm uppercase text-gray-500 mb-2 mt-6 flex items-center gap-2"><Calculator className="w-4 h-4" /> Datos Económicos</h3>
                     <div className="grid grid-cols-2 gap-3">
                        <div>
                             <Label>Check-in</Label>
                             <Input type="date" value={formData.checkIn} onChange={e => setFormData({...formData, checkIn: e.target.value})} />
                        </div>
                        <div>
                             <Label>Check-out</Label>
                             <Input type="date" value={formData.checkOut} onChange={e => setFormData({...formData, checkOut: e.target.value})} />
                        </div>
                        <div>
                             <Label>Monto USD</Label>
                             <Input 
                                type="number" 
                                value={formData.amountUSD || ''} 
                                onChange={e => setFormData({...formData, amountUSD: parseFloat(e.target.value) || 0})} 
                             />
                        </div>
                        <div>
                             <Label>Cotización (1 USD = ARS)</Label>
                             <Input 
                                type="number" 
                                value={formData.exchangeRate || ''} 
                                onChange={e => setFormData({...formData, exchangeRate: parseFloat(e.target.value) || 0})} 
                             />
                             <div className="text-[10px] text-blue-600 mt-1 flex items-center gap-1">
                                <span className="font-bold">BNA:</span> Obtenido automáticamente
                             </div>
                        </div>
                        <div>
                             <Label>% Seña</Label>
                             <Input 
                                type="number" 
                                value={formData.depositPercentage || ''} 
                                onChange={e => setFormData({...formData, depositPercentage: parseFloat(e.target.value) || 0})} 
                             />
                        </div>
                        <div>
                             <Label>Unidad</Label>
                             <Input value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} placeholder="Ej: Cabaña 1" />
                        </div>
                     </div>
                </div>

                <div className="space-y-4 bg-slate-50 dark:bg-slate-800 p-6 rounded-xl">
                    <h3 className="font-bold text-lg mb-4">Resumen y Previsualización</h3>
                    
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Total ARS:</span>
                            <span className="font-bold">${amountARS.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-blue-600">
                            <span>Seña ({formData.depositPercentage}%):</span>
                            <span className="font-bold">${depositAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                            <span>Saldo a Pagar:</span>
                            <span className="font-bold">${balanceAmount.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Label className="mb-2 block">Cuerpo del Correo</Label>
                        <Textarea 
                            className="h-64 font-mono text-xs leading-relaxed" 
                            readOnly 
                            value={emailPreview} 
                        />
                    </div>
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewOpen(false)}>Cancelar</Button>
                <Button onClick={handleCreate} className="bg-emerald-600 hover:bg-emerald-700">
                    <Send className="w-4 h-4 mr-2" /> Generar y Enviar
                </Button>
            </DialogFooter>
        </DialogContent>
       </Dialog>

       {/* Confirm / Details Dialog */}
       <Dialog open={!!selectedQuote} onOpenChange={(open) => !open && setSelectedQuote(null)}>
         <DialogContent className="max-w-xl">
             {confirmStep === 'details' && selectedQuote && (
                 <>
                    <DialogHeader>
                        <DialogTitle>Confirmar Reserva</DialogTitle>
                        <DialogDescription>Transformar cotización en reserva activa.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                             <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Huésped:</span>
                                <span className="font-medium">{selectedQuote.guestName}</span>
                             </div>
                             <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Total pactado:</span>
                                <span className="font-medium">${selectedQuote.amountARS.toLocaleString()}</span>
                             </div>
                        </div>

                        <div className="space-y-2">
                             <Label>Pago de Seña (ARS)</Label>
                             <div className="grid grid-cols-2 gap-4 items-center">
                                <Input 
                                    type="number" 
                                    value={paymentInput} 
                                    onChange={e => setPaymentInput(e.target.value)} 
                                    placeholder="Monto transferido..."
                                />
                                <span className="text-xs text-gray-400">Sugerido: ${selectedQuote.depositAmount.toLocaleString()}</span>
                             </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedQuote(null)}>Cerrar</Button>
                        <Button onClick={handleConfirmReservation} className="bg-indigo-600 hover:bg-indigo-700">
                            <CheckCircle className="w-4 h-4 mr-2" /> Confirmar Reserva
                        </Button>
                    </DialogFooter>
                 </>
             )}

             {confirmStep === 'success' && (
                 <>
                    <DialogHeader>
                        <DialogTitle className="text-green-600 flex items-center gap-2">
                            <CheckCircle className="w-6 h-6" /> ¡Reserva Exitosa!
                        </DialogTitle>
                        <DialogDescription>La reserva ha sido creada. Envíe la confirmación.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                         <Label className="mb-2 block">Mensaje de Confirmación</Label>
                         <Textarea 
                            className="h-40 font-mono text-sm" 
                            readOnly 
                            value={confirmationMessage} 
                        />
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button variant="outline" className="w-full sm:w-auto" onClick={() => { alert('Enviado por WhatsApp'); setSelectedQuote(null); }}>
                             Enviar WhatsApp
                        </Button>
                        <Button className="w-full sm:w-auto bg-blue-600" onClick={() => { alert('Enviado por Email'); setSelectedQuote(null); }}>
                             Enviar Email
                        </Button>
                    </DialogFooter>
                 </>
             )}
         </DialogContent>
       </Dialog>
    </div>
  );
}
