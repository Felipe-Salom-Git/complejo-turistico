'use client';

import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, Check, Users, FileText, Send, X } from 'lucide-react';
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
  const { reservations, updateReservation, deleteReservation } = useReservations();
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
        <SheetContent className="sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Detalles de Reserva</SheetTitle>
            {selectedRes && (
              <SheetDescription>
                ID: {selectedRes.id} | Creada el {new Date().toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}
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

    // Recalculate global amounts
    // amountPaid (legacy mix) could still be sum of raw numbers, 
    // OR we can just focus on amountPaidUSD
    const newTotalPaidUSD = updatedPayments.reduce((acc, p) => {
      if (p.currency === 'USD') return acc + p.amount;
      if (p.currency === 'ARS' && p.exchangeRate) return acc + (p.amount / p.exchangeRate);
      return acc; // Fallback if no rate? Should ideally not happen or assume 0
    }, 0);

    onUpdate({
      ...reservation,
      payments: updatedPayments,
      amountPaid: updatedPayments.reduce((acc, p) => acc + p.amount, 0), // Keeping "nominal" sum if needed, but less useful now
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

  // Helper to compute paid USD on the fly if not stored
  const getComputedPaidUSD = (res: Reservation) => {
    if (!res.payments) return 0;
    return res.payments.reduce((acc, p) => {
      if (p.currency === 'USD') return acc + p.amount;
      if (p.currency === 'ARS' && p.exchangeRate) return acc + (p.amount / p.exchangeRate);
      return acc;
    }, 0);
  };

  return (
    <div className="space-y-8 py-6 px-2">
      {/* Header info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <Label className="text-muted-foreground text-xs uppercase tracking-wide font-bold">Información del Huésped</Label>
          <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-xl space-y-3 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                {reservation.guestName.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-lg">{reservation.guestName}</p>
                <p className="text-xs text-muted-foreground">ID: {reservation.id}</p>
              </div>
            </div>
            <Separator />
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
              <p className="flex items-center gap-3">
                <span className="w-5 text-center text-lg">✉️</span> {reservation.email || 'Sin email'}
              </p>
              <p className="flex items-center gap-3">
                <span className="w-5 text-center text-lg">📞</span> {reservation.phone || 'Sin teléfono'}
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <Label className="text-muted-foreground text-xs uppercase tracking-wide font-bold">Detalles de Estadía</Label>
          <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-xl space-y-3 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-xl text-emerald-700">{reservation.unit}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Unidad Reservada</p>
              </div>
              <Badge variant="secondary" className="px-3 py-1">{reservation.pax} Pasajeros</Badge>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4 text-sm mt-2">
              <div className="bg-white dark:bg-black/20 p-2 rounded border border-gray-100 dark:border-gray-700">
                <p className="font-semibold text-gray-800 dark:text-gray-200">{new Date(reservation.checkIn).toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}</p>
                <p className="text-[10px] uppercase text-gray-400 font-bold">Check-in</p>
              </div>
              <div className="bg-white dark:bg-black/20 p-2 rounded border border-gray-100 dark:border-gray-700">
                <p className="font-semibold text-gray-800 dark:text-gray-200">{new Date(reservation.checkOut).toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}</p>
                <p className="text-[10px] uppercase text-gray-400 font-bold">Check-out</p>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Additional Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="py-3"><CardTitle className="text-sm">Mascotas</CardTitle></CardHeader>
          <CardContent className="py-2 text-sm">
            {reservation.hasPet ? (
              <div className="text-emerald-700 font-medium flex flex-col">
                <span>✅ Viaja con Mascota</span>
                <span className="text-xs text-muted-foreground">
                  {reservation.petCharged ? "Costo Adicional Cobrado" : "Sin Cargo Adicional"}
                </span>
              </div>
            ) : <span className="text-muted-foreground">No aplica</span>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3"><CardTitle className="text-sm">Vehículo</CardTitle></CardHeader>
          <CardContent className="py-2 text-sm font-mono">
            {reservation.licensePlate || "No registrado"}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3"><CardTitle className="text-sm">Origen & Políticas</CardTitle></CardHeader>
          <CardContent className="py-2 text-sm space-y-1">
            <div><span className="font-semibold">Canal:</span> {reservation.source || "Directo"}</div>
            <div><span className="font-semibold">Cancelación:</span> {reservation.cancellationPolicy || "Estándar"}</div>
          </CardContent>
        </Card>
      </div>

      {/* Cleaning Services */}
      <div className="space-y-2 mb-6">
        <h3 className="font-bold text-sm flex items-center gap-2 text-slate-700">
          🧹 Servicios de Limpieza Programados
        </h3>
        {cleaningTasks.length > 0 ? (
          <div className="flex gap-2 flex-wrap">
            {cleaningTasks.map(task => (
              <Badge key={task.id} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {new Date(task.checkIn).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">No hay servicios de limpieza automáticos generados.</p>
        )}
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-3 gap-6 text-center">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <p className="text-xs text-muted-foreground uppercase font-bold mb-2">Total Reserva (USD)</p>
          <p className="font-extrabold text-3xl text-slate-800 dark:text-slate-100">
            USD {(reservation.totalUSD || 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-800">
          <p className="text-xs text-emerald-600 dark:text-emerald-400 uppercase font-bold mb-2">Total Pagado (USD)</p>
          <p className="font-extrabold text-3xl text-emerald-600 dark:text-emerald-400">
            USD {(reservation.amountPaidUSD || getComputedPaidUSD(reservation)).toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-rose-50 dark:bg-rose-900/20 p-5 rounded-2xl border border-rose-100 dark:border-rose-800">
          <p className="text-xs text-rose-600 dark:text-rose-400 uppercase font-bold mb-2">Saldo Pendiente (USD)</p>
          <p className="font-extrabold text-3xl text-rose-600 dark:text-rose-400">
            USD {getBalanceUSD(reservation).toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Balances Detail */}
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
          <p className="text-[10px] uppercase font-bold text-slate-500">Saldo en Pesos (Estimado)</p>
          <p className="text-xl font-bold text-slate-700">
            ARS $ {((reservation.balance_usd || getBalanceUSD(reservation)) * (reservation.exchangeRate || exchangeRate || 0)).toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-400">Cotización guardada: ${reservation.exchangeRate || "-"}</p>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
          <p className="text-[10px] uppercase font-bold text-slate-500">Noches / Precio Promedio</p>
          <p className="text-sm font-medium text-slate-700 mt-1">
            {Math.ceil((new Date(reservation.checkOut).getTime() - new Date(reservation.checkIn).getTime()) / (1000 * 60 * 60 * 24))} noches
            {' @ '}
            USD {((reservation.totalUSD || 0) / Math.max(1, Math.ceil((new Date(reservation.checkOut).getTime() - new Date(reservation.checkIn).getTime()) / (1000 * 60 * 60 * 24)))).toFixed(2)} / noche
          </p>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Facturación Global */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" /> Facturación
          </h3>
          <Badge variant="outline" className="font-normal">Opcional</Badge>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800 flex items-center gap-4">
          <div className="flex-1">
            <Label className="text-xs uppercase text-indigo-600 font-bold mb-1 block">Factura Única (Total)</Label>
            <Input
              value={reservation.invoiceNumber || ''}
              onChange={handleGlobalInvoiceChange}
              placeholder="Ingrese N° de Factura Global..."
              className="bg-white border-indigo-200 focus-visible:ring-indigo-500"
            />
            <p className="text-[10px] text-gray-500 mt-1">Si completa esto, se asume una factura única por el total.</p>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Payments Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" /> Historial de Pagos
          </h3>
        </div>

        {/* Add Payment Form */}
        <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-xl space-y-4 border border-slate-200 dark:border-slate-700">
          <Label className="text-xs font-bold uppercase text-slate-500">Registrar Nuevo Pago</Label>
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-3">
              <Label className="text-[10px] mb-1 block text-gray-400">Fecha</Label>
              <Input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="bg-white h-9"
              />
            </div>
            <div className="col-span-3">
              <Label className="text-[10px] mb-1 block text-gray-400">Método</Label>
              <Select value={method} onValueChange={(v: any) => setMethod(v)}>
                <SelectTrigger className="bg-white h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Efectivo">Efectivo</SelectItem>
                  <SelectItem value="Transferencia">Transferencia</SelectItem>
                  <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                  <SelectItem value="Debito">Débito</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label className="text-[10px] mb-1 block text-gray-400">Moneda</Label>
              <Select value={currency} onValueChange={(v: any) => setCurrency(v)}>
                <SelectTrigger className="bg-white h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="ARS">ARS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-4">
              <Label className="text-[10px] mb-1 block text-gray-400">Monto</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="bg-white h-9 font-mono"
                />
              </div>
            </div>
          </div>
          {currency === 'ARS' && (
            <div className="col-span-12 mt-2 bg-blue-50 p-2 rounded text-xs text-blue-800 flex items-center justify-between">
              <span>Cotización Referencia (BNA): <strong>${exchangeRate}</strong></span>
              <div className="flex items-center gap-2">
                <Label className="whitespace-nowrap">Cotización Aplicada:</Label>
                <Input
                  type="number"
                  className="h-6 w-24 bg-white"
                  value={exchangeRate}
                  onChange={e => setExchangeRate(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-12 gap-3 items-end">
            <div className="col-span-9">
              <Label className="text-[10px] mb-1 block text-gray-400">N° Factura (Opcional por pago)</Label>
              <Input
                placeholder="Ej: A-000123"
                value={paymentInvoice}
                onChange={e => setPaymentInvoice(e.target.value)}
                className="bg-white h-9"
              />
            </div>
            <div className="col-span-3">
              <Button onClick={handleAddPayment} className="w-full bg-emerald-600 hover:bg-emerald-700 h-9">
                <Plus className="w-4 h-4 mr-1" /> Registrar
              </Button>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="border rounded-xl overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-900">
              <TableRow>
                <TableHead className="w-[120px]">Fecha</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Moneda</TableHead>
                <TableHead>Cotización</TableHead>
                <TableHead>Factura #</TableHead>
                <TableHead className="text-right">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(!reservation.payments || reservation.payments.length === 0) ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground text-sm py-8">
                    No hay pagos registrados aún.
                  </TableCell>
                </TableRow>
              ) : (
                reservation.payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium text-gray-600">{new Date(payment.date).toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}</TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell>{payment.currency}</TableCell>
                    <TableCell>
                      {payment.exchangeRate ? (
                        <span className="text-xs text-gray-500">${payment.exchangeRate}</span>
                      ) : (
                        <span className="text-xs text-gray-300">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {payment.invoiceNumber ? (
                        <Badge variant="outline" className="font-mono text-[10px]">{payment.invoiceNumber}</Badge>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-bold text-emerald-600">
                      {payment.currency === 'USD' ? 'USD ' : '$'}
                      {payment.amount.toLocaleString()}
                      {payment.currency === 'ARS' && payment.exchangeRate && (
                        <div className="text-[10px] text-gray-400">
                          (USD {(payment.amount / payment.exchangeRate).toFixed(2)})
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="space-y-4">
        <h3 className="font-semibold text-sm uppercase text-muted-foreground">Acciones & Comunicaciones</h3>
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="justify-start gap-2 h-auto py-3" disabled>
            <FileText className="w-5 h-5 text-gray-500" />
            <div className="flex flex-col items-start">
              <span>Generar Factura</span>
              <span className="text-xs text-gray-400 font-normal">No disponible aún</span>
            </div>
          </Button>

          <Popover open={previewOpen} onOpenChange={setPreviewOpen}>
            <PopoverTrigger asChild>
              <Button className="justify-start gap-2 h-auto py-3 bg-blue-600 hover:bg-blue-700">
                <Send className="w-5 h-5" />
                <div className="flex flex-col items-start">
                  <span>Enviar Bienvenida</span>
                  <span className="text-xs text-blue-200 font-normal">WhatsApp / Email</span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Previsualización</h4>
                <div className="text-xs bg-muted p-3 rounded-md whitespace-pre-wrap max-h-60 overflow-y-auto border">
                  {mensajes.bienvenida
                    .replace('{nombre}', reservation.guestName)
                    .replace('{unidad}', reservation.unit)}
                </div>
                <Button size="sm" onClick={() => { alert("Enviado!"); setPreviewOpen(false); }} className="w-full">
                  Confirmar Envío
                </Button>
              </div>
            </PopoverContent>
          </Popover>


        </div>
      </div>

      <div className="space-y-2">
        <Label>Observaciones</Label>
        <div className="text-sm bg-muted p-3 rounded min-h-[60px] text-gray-600 italic">
          {reservation.observations || "Sin observaciones registradas."}
        </div>
      </div>

      <Separator className="my-6" />

      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900 rounded-xl p-4">
        <h4 className="text-red-800 dark:text-red-300 font-bold text-sm mb-2 flex items-center gap-2">
          <Trash2 className="w-4 h-4" /> Zona de Peligro
        </h4>
        <p className="text-xs text-red-600 dark:text-red-400 mb-4">
          Eliminar la reserva es una acción irreversible. Se perderá todo el historial de pagos y datos asociados.
        </p>
        <Button
          variant="destructive"
          className="w-full sm:w-auto"
          onClick={() => onDelete(reservation.id)}
        >
          Eliminar Reserva Permanentemente
        </Button>
      </div>

      <Separator />

      {/* Audit Info */}
      <div className="text-xs text-slate-400 flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-100">
        <div>
          Creado por: <span className="font-medium text-slate-600">{reservation.createdBy || "Desconocido"}</span>
        </div>
        <div>
          Fecha de creacion: <span className="font-medium text-slate-600">
            {reservation.createdAt ? new Date(reservation.createdAt).toLocaleString('es-AR') : "Desconocida"}
          </span>
        </div>
      </div>
    </div >
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
