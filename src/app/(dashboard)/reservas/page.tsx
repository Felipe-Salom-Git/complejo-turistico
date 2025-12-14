'use client';

import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, Check, Users, FileText, Send, X, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useReservations, Reservation } from '@/contexts/ReservationsContext';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useMessages } from '@/contexts/MessagesContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function Reservas() {
  const router = useRouter();
  const { reservations, updateReservation, deleteReservation, clearAllReservations } = useReservations();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);
  const [isClientDbOpen, setIsClientDbOpen] = useState(false);

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'confirmada':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'checkout':
      case 'completada':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (estado: string) => {
    switch (estado) {
      case 'active': return 'Activa';
      case 'checkout': return 'Check-out';
      case 'cleaning': return 'Limpieza';
      default: return estado;
    }
  };

  const filteredReservations = reservations
    .filter(r => r.status !== 'cleaning')
    .filter(reserva => {
      const matchesSearch =
        reserva.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reserva.unit.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === 'all' || reserva.status === filterStatus;

      return matchesSearch && matchesStatus;
    });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reservas</h2>
          <p className="text-muted-foreground">
            Gestiona y visualiza todas las reservas del complejo
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setIsClientDbOpen(true)}
          >
            <Users className="h-4 w-4" /> Base de Clientes
          </Button>
          <Button
            variant="destructive"
            className="gap-2 bg-red-100 text-red-700 hover:bg-red-200 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
            onClick={() => {
              if (confirm('⚠️ ¿Estás SEGURO de eliminar TODAS las reservas? Esto borrará el calendario y la ocupación por completo. No se puede deshacer.')) {
                clearAllReservations();
              }
            }}
          >
            <Trash2 className="h-4 w-4" /> Vaciar Todo
          </Button>
          <Button
            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90"
            onClick={() => router.push('/nueva-reserva')}
          >
            <Plus className="mr-2 h-4 w-4" /> Nueva Reserva
          </Button>
        </div>
      </div>

      {/* NewReservationModal removed */}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Activas</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reservations.filter((r) => r.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              +2 desde ayer
            </p>
          </CardContent>
        </Card>
        {/* ... other summary cards could be dynamically updated too ... */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Reservas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por huésped o unidad..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activas</SelectItem>
                <SelectItem value="checkout">Check-out</SelectItem>
                <SelectItem value="confirmada">Confirmadas</SelectItem>
                <SelectItem value="pendiente">Pendientes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Huésped</TableHead>
                  <TableHead>Unidad</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Pax</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No se encontraron reservas
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReservations.map((reserva) => (
                    <TableRow
                      key={reserva.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedRes(reserva)}
                    >
                      <TableCell className="font-medium truncate max-w-[80px]">
                        {reserva.id}
                      </TableCell>
                      <TableCell>{reserva.guestName}</TableCell>
                      <TableCell>{reserva.unit}</TableCell>
                      <TableCell>
                        {new Date(reserva.checkIn).toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}
                      </TableCell>
                      <TableCell>{reserva.pax || '-'}</TableCell>
                      <TableCell>
                        ${(reserva.totalUSD || 0).toLocaleString('en-US')} USD
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(reserva.status)}>
                          {getStatusLabel(reserva.status)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Reservation Details Sheet */}
      <Sheet open={!!selectedRes} onOpenChange={(open) => !open && setSelectedRes(null)}>
        <SheetContent className="min-w-[50vw] sm:max-w-[50vw] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Detalles de Reserva</SheetTitle>
            {selectedRes && (
              <SheetDescription>
                ID: {selectedRes.id} • Por <span className="font-semibold text-emerald-600">{selectedRes.createdBy || 'Sistema'}</span> • {new Date(selectedRes.createdAt || new Date()).toLocaleDateString('es-AR')}
              </SheetDescription>
            )}
          </SheetHeader>

          {selectedRes && <ReservationDetailsView
            reservation={selectedRes}
            onUpdate={(u) => { updateReservation(u); setSelectedRes(u); }}
            onDelete={(id) => {
              if (confirm('¿Estás seguro de eliminar esta reserva permanentemente?')) {
                deleteReservation(id);
                setSelectedRes(null);
              }
            }}
          />}

        </SheetContent>
      </Sheet>

      {/* Client Database Dialog */}
      <Dialog open={isClientDbOpen} onOpenChange={setIsClientDbOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Base de Datos de Clientes</DialogTitle>
          </DialogHeader>
          <ClientDatabaseView />
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { Payment } from '@/contexts/ReservationsContext';

function ReservationDetailsView({ reservation, onUpdate, onDelete }: { reservation: Reservation, onUpdate: (r: Reservation) => void, onDelete: (id: string) => void }) {
  const { mensajes } = useMessages();
  const { reservations } = useReservations();
  const [previewOpen, setPreviewOpen] = useState(false);

  // Find related cleaning tasks
  const cleaningTasks = reservations.filter(r => r.id.startsWith(`${reservation.id}-cleaning`));

  // Payment Form State
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<'ARS' | 'USD'>("USD");
  const [method, setMethod] = useState<'Efectivo' | 'Transferencia' | 'Tarjeta' | 'Debito'>("Efectivo");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentInvoice, setPaymentInvoice] = useState("");
  const [exchangeRate, setExchangeRate] = useState<number>(0);

  // Fetch rate for payment form
  React.useEffect(() => {
    if (currency === 'ARS') {
      fetch('https://dolarapi.com/v1/dolares/oficial')
        .then(res => res.json())
        .then(data => { if (data && data.venta) setExchangeRate(data.venta); })
        .catch(err => console.error(err));
    } else {
      setExchangeRate(1); // 1:1 for USD
    }
  }, [currency]);

  const handleAddPayment = () => {
    const val = parseFloat(amount);
    if (!val) return;

    const newPayment: Payment = {
      id: Date.now().toString(),
      date: new Date(date),
      amount: val,
      currency,
      method,
      invoiceNumber: paymentInvoice,
      exchangeRate: currency === 'ARS' ? exchangeRate : undefined
    };

    const updatedPayments = [...(reservation.payments || []), newPayment];

    const newTotalPaidUSD = updatedPayments.reduce((acc, p) => {
      if (p.currency === 'USD') return acc + p.amount;
      if (p.currency === 'ARS' && p.exchangeRate) return acc + (p.amount / p.exchangeRate);
      return acc; 
    }, 0);

    onUpdate({
      ...reservation,
      payments: updatedPayments,
      amountPaid: updatedPayments.reduce((acc, p) => acc + p.amount, 0), 
      amountPaidUSD: newTotalPaidUSD
    });

    setAmount("");
    setPaymentInvoice("");
  };

  const handleGlobalInvoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...reservation, invoiceNumber: e.target.value });
  };

  const getBalanceUSD = (res: Reservation) => {
    const total = res.totalUSD || 0;
    const paid = res.amountPaidUSD || getComputedPaidUSD(res) || 0;
    return total - paid;
  };

  const getComputedPaidUSD = (res: Reservation) => {
    if (!res.payments) return 0;
    return res.payments.reduce((acc, p) => {
      if (p.currency === 'USD') return acc + p.amount;
      if (p.currency === 'ARS' && p.exchangeRate) return acc + (p.amount / p.exchangeRate);
      return acc;
    }, 0);
  };

  const nights = Math.ceil((new Date(reservation.checkOut).getTime() - new Date(reservation.checkIn).getTime()) / (1000 * 60 * 60 * 24));
  const petFee = (reservation.hasPet && reservation.petCharged) ? (nights * 10) : 0;
  const baseStay = (reservation.totalUSD || 0) - petFee;

  return (
    <div className="grid grid-cols-12 gap-6 py-4 px-2 h-full content-start">
      
      {/* LEFT COLUMN: Info & Actions (Span 5) */}
      <div className="col-span-12 md:col-span-5 space-y-4">
        
        {/* Guest Compact */}
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-4 mb-3">
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
              {reservation.guestName.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-base truncate">{reservation.guestName}</p>
              <div className="flex flex-col text-xs text-muted-foreground truncate">
                 <span>{reservation.email || 'Sin email'}</span>
                 <span>{reservation.phone || 'Sin teléfono'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stay Compact */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3">
           <div className="flex justify-between items-center">
             <Badge variant="outline" className="text-base font-bold border-emerald-200 bg-emerald-50 text-emerald-700 px-3 py-1">
               {reservation.unit}
             </Badge>
             <span className="text-sm text-muted-foreground font-medium">{reservation.pax} Pax • {nights} Noches</span>
           </div>
           <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 p-2 rounded border">
                 <span className="text-xs text-gray-500 block uppercase font-bold">In</span>
                 <span className="font-semibold">{new Date(reservation.checkIn).toLocaleDateString('es-AR', {day:'numeric', month:'short'})}</span>
              </div>
              <div className="bg-gray-50 p-2 rounded border">
                 <span className="text-xs text-gray-500 block uppercase font-bold">Out</span>
                 <span className="font-semibold">{new Date(reservation.checkOut).toLocaleDateString('es-AR', {day:'numeric', month:'short'})}</span>
              </div>
           </div>
        </div>

        {/* Attributes Grid */}
        <div className="grid grid-cols-2 gap-3">
           <div className="bg-gray-50 p-3 rounded border text-sm">
              <span className="text-xs text-gray-500 block uppercase font-bold">Mascota</span>
              {reservation.hasPet ? (
                 <span className="text-emerald-600 font-medium">Sí {reservation.petCharged ? '($)' : '(Free)'}</span>
              ) : <span>No</span>}
           </div>
           <div className="bg-gray-50 p-3 rounded border text-sm truncate">
              <span className="text-xs text-gray-500 block uppercase font-bold">Patente</span>
              {reservation.licensePlate || '-'}
           </div>
           <div className="bg-gray-50 p-3 rounded border text-sm truncate col-span-2">
              <span className="text-xs text-gray-500 block uppercase font-bold">Canal / Política</span>
              {reservation.source || 'Directo'} • {reservation.cancellationPolicy || 'Std'}
           </div>
        </div>

        {/* Observations */}
        <div className="space-y-1">
          <Label className="text-sm">Observaciones</Label>
          <div className="text-sm bg-muted p-3 rounded min-h-[60px] max-h-[100px] overflow-y-auto text-gray-600 italic">
            {reservation.observations || "Sin observaciones."}
          </div>
        </div>

        {/* Actions Button Group */}
        <div className="flex flex-wrap gap-2 pt-2">
           <Popover open={previewOpen} onOpenChange={setPreviewOpen}>
            <PopoverTrigger asChild>
              <Button size="sm" variant="outline" className="h-9 text-xs flex-1 gap-1 text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100">
                <Send className="w-4 h-4" /> Enviar Bienvenida
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-3">
               <div className="text-xs bg-muted p-2 rounded whitespace-pre-wrap max-h-40 overflow-y-auto mb-2">
                  {mensajes.bienvenida.replace('{nombre}', reservation.guestName).replace('{unidad}', reservation.unit)}
               </div>
               <Button size="sm" onClick={() => { alert("Enviado!"); setPreviewOpen(false); }} className="w-full h-8">Confirmar Envío</Button>
            </PopoverContent>
           </Popover>
           
           <Button size="sm" variant="ghost" className="h-9 text-xs w-full text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => onDelete(reservation.id)}>
              <Trash2 className="w-4 h-4 mr-2" /> Eliminar Reserva
           </Button>
        </div>

      </div>

      {/* RIGHT COLUMN: Finance & Payments (Span 7) */}
      <div className="col-span-12 md:col-span-7 space-y-4 flex flex-col h-full">
        
        {/* Financial Summary Row */}
        <div className="grid grid-cols-3 gap-3">
           <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded border text-center">
             <span className="text-xs text-muted-foreground uppercase block font-bold">Total</span>
             <span className="font-bold text-lg">USD {(reservation.totalUSD || 0).toLocaleString()}</span>
           </div>
           <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded border border-emerald-100 text-center">
             <span className="text-xs text-emerald-600 uppercase block font-bold">Pagado</span>
             <span className="font-bold text-lg text-emerald-700">USD {(reservation.amountPaidUSD || getComputedPaidUSD(reservation)).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
           </div>
           <div className="bg-rose-50 dark:bg-rose-900/20 p-3 rounded border border-rose-100 text-center">
             <span className="text-xs text-rose-600 uppercase block font-bold">Saldo</span>
             <span className="font-bold text-lg text-rose-700">USD {getBalanceUSD(reservation).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
           </div>
        </div>

        {/* Breakdown & ARS */}
        <div className="bg-white p-3 rounded border text-sm space-y-2">
           <div className="flex justify-between">
              <span className="text-gray-500">Valor Estadía ({nights} noches)</span>
              <span className="font-medium">USD {baseStay.toLocaleString()}</span>
           </div>
           {petFee > 0 && (
             <div className="flex justify-between text-orange-600 font-medium">
                <span>+ Adicional Mascota</span>
                <span>USD {petFee.toLocaleString()}</span>
             </div>
           )}
           <Separator />
           <div className="flex justify-between items-center">
              <span className="text-xs uppercase font-bold text-gray-400">Saldo estimado en Pesos</span>
              <span className="font-mono text-base text-gray-700 font-bold">~ ARS $ {((reservation.balance_usd || getBalanceUSD(reservation)) * (reservation.exchangeRate || exchangeRate || 0)).toLocaleString()}</span>
           </div>
        </div>

        {/* Payment Form Compact */}
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
           <div className="flex gap-2 mb-2">
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="h-8 text-xs w-32 bg-white" />
              <Select value={method} onValueChange={(v: any) => setMethod(v)}>
                <SelectTrigger className="h-8 text-xs bg-white"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Efectivo">Efectivo</SelectItem><SelectItem value="Transferencia">Transferencia</SelectItem><SelectItem value="Tarjeta">Tarjeta</SelectItem></SelectContent>
              </Select>
              <Select value={currency} onValueChange={(v: any) => setCurrency(v)}>
                <SelectTrigger className="h-8 text-xs w-24 bg-white"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="USD">USD</SelectItem><SelectItem value="ARS">ARS</SelectItem></SelectContent>
              </Select>
           </div>
           <div className="flex gap-2">
              <div className="relative flex-1">
                 <Input 
                   type="number" 
                   placeholder="Monto" 
                   value={amount} 
                   onChange={e => setAmount(e.target.value)} 
                   className="h-8 text-sm pl-3 bg-white" 
                 />
              </div>
              <Button onClick={handleAddPayment} size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-700 text-xs px-4">
                 <Plus className="w-4 h-4 mr-1" /> Registrar Pago
              </Button>
           </div>
           {currency === 'ARS' && (
             <div className="flex items-center gap-2 mt-2 px-1">
                <span className="text-xs text-gray-500">Cotización:</span>
                <Input type="number" value={exchangeRate} onChange={e => setExchangeRate(parseFloat(e.target.value) || 0)} className="h-6 w-20 text-xs p-1 bg-white text-right" />
             </div>
           )}
        </div>

        {/* Payments History Table */}
        <div className="flex-1 overflow-auto border rounded-lg bg-white min-h-[150px]">
           <Table>
             <TableHeader className="sticky top-0 bg-gray-50 z-10">
               <TableRow className="h-9">
                 <TableHead className="py-2 text-xs w-24">Fecha</TableHead>
                 <TableHead className="py-2 text-xs">Método</TableHead>
                 <TableHead className="py-2 text-xs text-right">Monto</TableHead>
                 <TableHead className="py-2 text-xs w-10"></TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {(!reservation.payments || reservation.payments.length === 0) ? (
                 <TableRow><TableCell colSpan={4} className="text-center py-6 text-sm text-muted-foreground">Sin pagos registrados.</TableCell></TableRow>
               ) : (
                 reservation.payments.map((p) => (
                   <TableRow key={p.id} className="h-10 hover:bg-slate-50 group">
                     <TableCell className="py-2 text-xs text-gray-600">{new Date(p.date).toLocaleDateString('es-AR', {day:'2-digit', month:'2-digit'})}</TableCell>
                     <TableCell className="py-2 text-xs">
                        <div className="font-medium">{p.method}</div>
                        <div className="text-[10px] text-gray-400">{p.currency} {p.currency === 'ARS' ? `($${p.exchangeRate})` : ''}</div>
                     </TableCell>
                     <TableCell className="py-2 text-sm font-bold text-right text-emerald-600">
                        {p.currency === 'USD' ? 'USD ' : '$ '}
                        {p.amount.toLocaleString()}
                     </TableCell>
                     <TableCell className="py-1 px-1 text-center">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50" title="Generar Factura de este pago">
                           <FileText className="w-3.5 h-3.5" />
                        </Button>
                     </TableCell>
                   </TableRow>
                 ))
               )}
             </TableBody>
           </Table>
        </div>

        {/* Invoicing Totals */}
        <div className="border-t pt-3">
           <Button variant="outline" className="w-full gap-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50">
              <FileText className="w-4 h-4" /> Facturar Total Estadía (USD {(reservation.totalUSD || 0).toLocaleString()})
           </Button>
        </div>

      </div>
    </div>
  );
}

import { useGuests } from '@/contexts/GuestsContext';

function ClientDatabaseView() {
  const { guests, incrementVisits } = useGuests();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGuests = guests.filter(g =>
    g.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.document.includes(searchTerm)
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Buscar cliente por nombre o DNI..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>DNI</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Reservas</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredGuests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">No se encontraron clientes.</TableCell>
            </TableRow>
          ) : (
            filteredGuests.map(h => (
              <TableRow key={h.id}>
                <TableCell className="font-medium">{h.lastName}, {h.firstName}</TableCell>
                <TableCell>{h.document}</TableCell>
                <TableCell>
                  <div className="text-xs">
                    <div>{h.email}</div>
                    <div>{h.phone}</div>
                  </div>
                </TableCell>
                <TableCell>{h.reservationsCount}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">Ver Historial</Button>
                </TableCell>
              </TableRow>
            )))}
        </TableBody>
      </Table>
    </div>
  );
}
