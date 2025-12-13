'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useReservations, Reservation } from '@/contexts/ReservationsContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, DollarSign, Clock, User, Home, Calendar } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export function CheckInWidget() {
  const { reservations, updateReservation, checkIn } = useReservations();
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");

  const today = new Date();
  
  const checkIns = reservations.filter(r => 
    new Date(r.checkIn).toDateString() === today.toDateString()
  );

  const handlePayment = () => {
    if (!selectedRes || !paymentAmount) return;
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount)) return;

    const updated = {
      ...selectedRes,
      amountPaid: (selectedRes.amountPaid || 0) + amount
    };
    
    updateReservation(updated);
    setSelectedRes(updated);
    setPaymentAmount("");
  };

  const getBalance = (res: Reservation) => {
    return (res.total || 0) - (res.amountPaid || 0);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogIn className="w-5 h-5 text-green-600" />
            Ingresos del Día
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {checkIns.length === 0 ? (
              <p className="text-sm text-gray-500">No hay ingresos hoy.</p>
            ) : (
              checkIns.map(res => {
                const balance = getBalance(res);
                return (
                  <div 
                    key={res.id} 
                    className="flex justify-between items-center border-b pb-2 last:border-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded transition-colors"
                    onClick={() => setSelectedRes(res)}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                         <span className="font-semibold text-sm">{res.guestName}</span>
                         <Badge variant="outline" className="text-[10px] h-5">{res.unit}</Badge>
                      </div>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {res.arrivalTime || "--:--"}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" /> 
                          {balance > 0 ? (
                            <span className="text-red-500 font-medium">Deb: ${balance}</span>
                          ) : (
                            <span className="text-green-500">Pagado</span>
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                       <span className="text-xs text-gray-400 block">Pagado</span>
                       <span className="text-sm font-medium text-green-600">${res.amountPaid || 0}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedRes} onOpenChange={(open) => !open && setSelectedRes(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalles de Reserva</DialogTitle>
          </DialogHeader>
          
          {selectedRes && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-xs text-gray-500 block mb-1">Huésped</span>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{selectedRes.guestName}</span>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                   <span className="text-xs text-gray-500 block mb-1">Unidad</span>
                   <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{selectedRes.unit}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center py-2">
                 <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    Llegada: {selectedRes.arrivalTime || "Sin definir"}
                 </div>
                 <div className="flex items-center gap-2">
                    <Badge className={
                      selectedRes.status === 'active' ? 'bg-green-500 hover:bg-green-600' : 
                      selectedRes.status === 'checkout' ? 'bg-blue-500' : 'bg-gray-500'
                    }>{selectedRes.status === 'active' ? 'Check-in Realizado' : 'Pendiente'}</Badge>
                    
                    {selectedRes.status !== 'active' && (
                        <Button size="sm" onClick={() => checkIn(selectedRes.id)} className="h-6 text-xs bg-emerald-600 hover:bg-emerald-700">
                            Registrar Ingreso
                        </Button>
                    )}
                 </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Estado de Cuenta
                </h4>
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                   <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                      <span className="block text-gray-500 text-xs">Total</span>
                      <span className="font-bold">${selectedRes.total || 0}</span>
                   </div>
                   <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded">
                      <span className="block text-gray-500 text-xs">Pagado</span>
                      <span className="font-bold text-green-600">${selectedRes.amountPaid || 0}</span>
                   </div>
                   <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded">
                      <span className="block text-gray-500 text-xs">Saldo</span>
                      <span className="font-bold text-red-600">${getBalance(selectedRes)}</span>
                   </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                 <Label>Agregar Pago</Label>
                 <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                      <Input 
                        type="number" 
                        placeholder="Monto" 
                        className="pl-7"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                      />
                    </div>
                    <Button onClick={handlePayment} className="bg-green-600 hover:bg-green-700">
                       Registrar
                    </Button>
                 </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="w-full flex gap-2" disabled>
                   <FileText className="w-4 h-4" /> Generar Factura
                </Button>
                <MessagePreviewButton 
                  reservation={selectedRes} 
                />
              </div>

            </div>
          )}

          <DialogFooter>
             <Button variant="outline" onClick={() => setSelectedRes(null)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

import { FileText, Send } from 'lucide-react';
import { useMessages } from '@/contexts/MessagesContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

function MessagePreviewButton({ reservation }: { reservation: Reservation }) {
  const { mensajes } = useMessages();
  const [isOpen, setIsOpen] = useState(false);

  const message = mensajes.bienvenida
    .replace('{nombre}', reservation.guestName)
    .replace('{unidad}', reservation.unit);

  const handleSend = () => {
    alert(`Mensaje enviado a ${reservation.guestName}!`);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button className="w-full flex gap-2 bg-blue-600 hover:bg-blue-700">
          <Send className="w-4 h-4" /> Bienvenida
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Vista Previa Mensaje</h4>
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded text-xs whitespace-pre-wrap max-h-60 overflow-y-auto">
            {message}
          </div>
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button size="sm" onClick={handleSend}>Enviar</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
