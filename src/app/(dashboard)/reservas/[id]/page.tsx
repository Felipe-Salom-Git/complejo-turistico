'use client';

import React, { useState, useEffect } from 'react';
import { fetchExchangeRates, ExchangeRates } from "@/lib/currency";
import { useParams, useRouter } from 'next/navigation';
import { useReservations, Reservation, ReservationHistoryItem, Payment } from '@/contexts/ReservationsContext';
import { useMessages } from '@/contexts/MessagesContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { ArrowLeft, CalendarIcon, Edit, Trash2, XCircle, CreditCard, Banknote, Building, UserX, ChevronDown, CheckCircle2, AlertCircle, Droplets, SprayCan, Send, Plus, FileText } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getCleaningTasks } from '@/lib/calendar-logic';
import { cn } from '@/components/ui/utils';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

export default function ReservationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { reservations, updateReservation, deleteReservation } = useReservations();
  const { mensajes } = useMessages();

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load reservation
  useEffect(() => {
    if (params.id) {
      const found = reservations.find(r => r.id === params.id);
      if (found) {
        setReservation(found);
      }
      setIsLoading(false);
    }
  }, [params.id, reservations]);

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<Reservation | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Relocation State
  const [relocationOpen, setRelocationOpen] = useState(false);
  const [targetComplex, setTargetComplex] = useState<'Huella Andina' | 'Santa Rita'>('Huella Andina');

  // Rates State
  const [rates, setRates] = useState<ExchangeRates>({ BNA: 0, PAYWAY: 0 });

  useEffect(() => {
    fetchExchangeRates().then(setRates);
  }, []);

  // Update Exchange Rate in Edit Mode when Nationality Changes
  useEffect(() => {
    if (isEditing && editValues) {
      if (editValues.nacionalidadTipo === 'ARGENTINO') {
        // Apply BNA if not already set or if user wants auto-update (we assume auto-update on type change for now)
        // But we must be careful not to overwrite manual edits if we allow them. 
        // For now, valid logic: Type change -> Update Rate.
        if (editValues.tipoCambioFuente !== 'BNA_VENTA') {
          setEditValues(prev => prev ? ({
            ...prev,
            tipoCambioFuente: 'BNA_VENTA',
            exchangeRate: rates.BNA,
            montoARS: (prev.totalUSD || 0) * rates.BNA
          }) : null);
        }
      } else if (editValues.nacionalidadTipo === 'EXTRANJERO') {
        if (editValues.tipoCambioFuente !== 'PAYWAY_TURISTA') {
          setEditValues(prev => prev ? ({
            ...prev,
            tipoCambioFuente: 'PAYWAY_TURISTA',
            exchangeRate: rates.PAYWAY,
            montoARS: (prev.totalUSD || 0) * rates.PAYWAY
          }) : null);
        }
      }
    }
  }, [editValues?.nacionalidadTipo, isEditing, rates]);

  // Sync editValues with reservation
  useEffect(() => {
    if (reservation && !isEditing) {
      setEditValues(reservation);
    }
  }, [reservation, isEditing]);

  // Payment Form State
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<'ARS' | 'USD'>("USD");
  const [method, setMethod] = useState<'Efectivo' | 'Transferencia' | 'Tarjeta' | 'Debito'>("Efectivo");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentInvoice, setPaymentInvoice] = useState("");
  const [exchangeRate, setExchangeRate] = useState<number>(0);

  // Fetch rate for payment form
  useEffect(() => {
    if (currency === 'ARS') {
      if (reservation?.nacionalidadTipo === 'EXTRANJERO') {
        // Use stored Payway rate
        setExchangeRate(rates.PAYWAY);
      } else {
        // Use stored BNA rate
        setExchangeRate(rates.BNA);
      }
    } else {
      setExchangeRate(1); // 1:1 for USD
    }
  }, [currency, reservation?.nacionalidadTipo, rates]);

  if (isLoading) return <div className="p-8">Cargando reserva...</div>;
  if (!reservation || !editValues) return (
    <div className="p-8">
      <div className="mb-4">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Volver
        </Button>
      </div>
      <div className="text-center py-12 text-muted-foreground">Reserva no encontrada</div>
    </div>
  );

  const handleSave = () => {
    if (!editValues) return;

    // Generate audit log
    const changes: string[] = [];
    if (editValues.guestName !== reservation.guestName) changes.push(`Nombre: ${reservation.guestName} -> ${editValues.guestName}`);
    if (editValues.email !== reservation.email) changes.push(`Email modificado`);
    if (editValues.phone !== reservation.phone) changes.push(`Teléfono modificado`);
    if (editValues.unit !== reservation.unit) changes.push(`Unidad: ${reservation.unit} -> ${editValues.unit}`);
    if (new Date(editValues.checkIn).getTime() !== new Date(reservation.checkIn).getTime()) changes.push(`Check-in changed`);
    if (new Date(editValues.checkOut).getTime() !== new Date(reservation.checkOut).getTime()) changes.push(`Check-out changed`);
    if (editValues.pax !== reservation.pax) changes.push(`Pax: ${reservation.pax} -> ${editValues.pax}`);
    if (editValues.licensePlate !== reservation.licensePlate) changes.push(`Patente: ${reservation.licensePlate || '-'} -> ${editValues.licensePlate || '-'}`);
    if (editValues.hasPet !== reservation.hasPet) changes.push(`Mascota: ${reservation.hasPet ? 'Si' : 'No'} -> ${editValues.hasPet ? 'Si' : 'No'}`);
    if (editValues.petCharged !== reservation.petCharged) changes.push(`Tarifa Mascota: ${reservation.petCharged ? 'Cobrada' : 'No Cobrada'} -> ${editValues.petCharged ? 'Cobrada' : 'No Cobrada'}`);

    if (editValues.status !== reservation.status) changes.push(`Estado: ${reservation.status} -> ${editValues.status}`);

    // Check if status changed due to reprogram
    if (editValues.status === 'reprogrammed' && reservation.status !== 'reprogrammed') changes.push('Reserva Reprogramada');

    // Safe comparison for numbers
    if ((editValues.totalUSD || 0) !== (reservation.totalUSD || 0)) changes.push(`Total USD: ${reservation.totalUSD} -> ${editValues.totalUSD}`);

    if (editValues.observations !== reservation.observations) changes.push(`Observaciones actualizadas`);

    if (changes.length === 0) {
      setIsEditing(false);
      return;
    }

    const historyItem: ReservationHistoryItem = {
      date: new Date(),
      user: "Admin", // Placeholder for current user
      action: "Modificación",
      details: changes.join(", ")
    };

    const updatedReservation = {
      ...editValues,
      history: [...(reservation.history || []), historyItem]
    };

    updateReservation(updatedReservation);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValues(reservation);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('¿Estás seguro de eliminar esta reserva permanentemente?')) {
      deleteReservation(reservation.id);
      router.push('/reservas');
    }
  };

  const handleCancelReservation = () => {
    if (confirm('¿Cancelar reserva? Esto liberará el calendario.')) {
      updateReservation({ ...reservation, status: 'cancelled' });
      router.push('/reservas');
    }
  };

  const handleNoShow = () => {
    if (confirm('¿Marcar como No Show? Esto liberará el calendario.')) {
      updateReservation({ ...reservation, status: 'no-show' });
      router.push('/reservas');
    }
  };

  const handleReprogram = () => {
    // 1. Save original dates
    // 2. Set status to reprogrammed (or keep active?)
    // 3. Open edit mode
    setEditValues({
      ...reservation,
      status: 'reprogrammed',
      originalCheckIn: reservation.originalCheckIn || reservation.checkIn,
      originalCheckOut: reservation.originalCheckOut || reservation.checkOut
    });
    setIsEditing(true);
    alert('Modo Reprogramación: Se han guardado las fechas originales. Por favor seleccione las nuevas fechas y guarde los cambios.');
  };

  const handleRelocation = () => {
    updateReservation({
      ...reservation,
      status: 'relocated',
      relocationComplex: targetComplex
    });
    setRelocationOpen(false);
    router.push('/reservas');
  };

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

    updateReservation({
      ...reservation,
      payments: updatedPayments,
      amountPaid: updatedPayments.reduce((acc, p) => acc + p.amount, 0),
      amountPaidUSD: newTotalPaidUSD
    });

    setAmount("");
    setPaymentInvoice("");
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
    <div className="h-full flex flex-col p-6 space-y-6">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Volver
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Detalles de Reserva</h2>
            <p className="text-sm text-muted-foreground">
              ID: {reservation.id} • Por <span className="font-semibold text-emerald-600">{reservation.createdBy || 'Sistema'}</span> • {new Date(reservation.createdAt || new Date()).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              {reservation.originalCheckIn && reservation.originalCheckOut && (
                <span className="ml-2 text-orange-500 font-medium">
                  (Original: {format(new Date(reservation.originalCheckIn!), 'dd/MM/yyyy')} - {format(new Date(reservation.originalCheckOut!), 'dd/MM/yyyy')})
                </span>
              )}
            </p>
            <div className="mt-2">
              <Badge variant={
                reservation.status === 'active' ? 'default' :
                  reservation.status === 'checkout' ? 'secondary' :
                    reservation.status === 'cleaning' ? 'outline' :
                      reservation.status === 'cancelled' ? 'destructive' :
                        reservation.status === 'no-show' ? 'destructive' :
                          'outline'
              } className={cn(
                "text-sm px-3 py-1",
                reservation.status === 'active' && "bg-emerald-600 hover:bg-emerald-700",
                reservation.status === 'reprogrammed' && "bg-blue-600 hover:bg-blue-700",
                reservation.status === 'relocated' && "bg-purple-600 hover:bg-purple-700",
                reservation.status === 'cleaning' && "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200"
              )}>
                {reservation.status.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" /> Editar
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    Acciones <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleReprogram}>
                    <CalendarIcon className="w-4 h-4 mr-2" /> Reprogramar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRelocationOpen(true)}>
                    <Building className="w-4 h-4 mr-2" /> Reubicación
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleNoShow} className="text-orange-600">
                    <UserX className="w-4 h-4 mr-2" /> No Show
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleCancelReservation} className="text-red-600">
                    <XCircle className="w-4 h-4 mr-2" /> Cancelar Reserva
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="text-red-700 font-bold">
                    <Trash2 className="w-4 h-4 mr-2" /> Eliminar (Definitivo)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" onClick={handleCancel}>Cancelar</Button>
              <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">Guardar Cambios</Button>
            </div>
          )}
        </div>
      </div>

      <Tabs defaultValue="detalles" className="w-full flex-1 flex flex-col">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent space-x-6">
          <TabsTrigger value="detalles" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-2 bg-transparent">Detalles y Pagos</TabsTrigger>
          <TabsTrigger value="historial" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-2 bg-transparent">Historial y Cambios</TabsTrigger>
        </TabsList>

        <TabsContent value="detalles" className="flex-1 overflow-y-auto mt-6">
          <div className="grid grid-cols-12 gap-8 content-start pb-8">

            {/* LEFT COLUMN: Info */}
            <div className="col-span-12 md:col-span-5 space-y-6">

              {/* Guest Compact */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <h3 className="font-semibold mb-4 text-sm uppercase text-muted-foreground tracking-wider">Huésped</h3>
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label>Estado (Manual)</Label>
                      <Select
                        value={editValues.status}
                        onValueChange={(v) => setEditValues({ ...editValues, status: v as Reservation['status'] })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Activa</SelectItem>
                          <SelectItem value="checkout">Check-out</SelectItem>
                          <SelectItem value="cleaning">Limpieza</SelectItem>
                          <SelectItem value="cancelled">Cancelada</SelectItem>
                          <SelectItem value="no-show">No Show</SelectItem>
                          <SelectItem value="reprogrammed">Reprogramada</SelectItem>
                          <SelectItem value="relocated">Reubicada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Nombre Completo</Label>
                      <Input value={editValues.guestName} onChange={e => setEditValues({ ...editValues, guestName: e.target.value })} className="mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Email</Label>
                        <Input value={editValues.email || ''} onChange={e => setEditValues({ ...editValues, email: e.target.value })} className="mt-1" />
                      </div>
                      <div>
                        <Label>Teléfono</Label>
                        <Input value={editValues.phone || ''} onChange={e => setEditValues({ ...editValues, phone: e.target.value })} className="mt-1" />
                      </div>
                    </div>

                    {/* Nationality Edit Section */}
                    <div className="pt-4 border-t mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <Label>Nacionalidad</Label>
                        <Select
                          value={editValues.nacionalidadTipo || "ARGENTINO"}
                          onValueChange={(v: "ARGENTINO" | "EXTRANJERO") => setEditValues({ ...editValues, nacionalidadTipo: v })}
                        >
                          <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ARGENTINO">Argentino 🇦🇷</SelectItem>
                            <SelectItem value="EXTRANJERO">Extranjero 🌎</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {editValues.nacionalidadTipo === 'EXTRANJERO' && (
                        <div>
                          <Label>País</Label>
                          <Select
                            value={editValues.nacionalidad || ""}
                            onValueChange={(v) => setEditValues({ ...editValues, nacionalidad: v })}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Seleccionar..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Brasil">Brasil 🇧🇷</SelectItem>
                              <SelectItem value="Uruguay">Uruguay 🇺🇾</SelectItem>
                              <SelectItem value="Chile">Chile 🇨🇱</SelectItem>
                              <SelectItem value="Estados Unidos">Estados Unidos 🇺🇸</SelectItem>
                              <SelectItem value="España">España 🇪🇸</SelectItem>
                              <SelectItem value="Otro">Otro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg">
                        {reservation.guestName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-lg">{reservation.guestName}</p>
                        <div className="flex flex-col text-sm text-muted-foreground">
                          <span>{reservation.email || 'Sin email'}</span>
                          <span>{reservation.phone || 'Sin teléfono'}</span>
                        </div>
                      </div>
                    </div>
                    {/* View Mode Nationality */}
                    <div className="mt-2 pl-16">
                      <Badge variant="secondary" className="mr-2 text-xs">
                        {reservation.nacionalidadTipo === 'ARGENTINO' ? '🇦🇷 Argentino' : `🌎 ${reservation.nacionalidad || 'Extranjero'}`}
                      </Badge>
                    </div>
                  </>
                )}
              </div>

              {/* Stay Compact */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
                <h3 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider">Estadía</h3>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Unidad</Label>
                        <Input value={editValues.unit} onChange={e => setEditValues({ ...editValues, unit: e.target.value })} className="mt-1" />
                      </div>
                      <div>
                        <Label>Pax</Label>
                        <Input type="number" value={editValues.pax} onChange={e => setEditValues({ ...editValues, pax: parseInt(e.target.value) })} className="mt-1" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <Label>Check-in</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !editValues.checkIn && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {editValues.checkIn ? format(new Date(editValues.checkIn), "dd/MM/yyyy") : <span>Seleccionar fecha</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={new Date(editValues.checkIn)}
                              onSelect={(date) => date && setEditValues({ ...editValues, checkIn: date })}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label>Check-out</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !editValues.checkOut && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {editValues.checkOut ? format(new Date(editValues.checkOut), "dd/MM/yyyy") : <span>Seleccionar fecha</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={new Date(editValues.checkOut)}
                              onSelect={(date) => date && setEditValues({ ...editValues, checkOut: date })}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <Label>Mascota</Label>
                        <div className="flex flex-col gap-2 mt-2">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="has-pet"
                              checked={editValues.hasPet || false}
                              onCheckedChange={(checked) => setEditValues({ ...editValues, hasPet: checked })}
                            />
                            <Label htmlFor="has-pet" className="font-normal cursor-pointer">Trae Mascota</Label>
                          </div>
                          {editValues.hasPet && (
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="pet-charged"
                                checked={editValues.petCharged || false}
                                onCheckedChange={(checked) => setEditValues({ ...editValues, petCharged: checked })}
                              />
                              <Label htmlFor="pet-charged" className="font-normal cursor-pointer">Cobrar Tarifa</Label>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label>Patente</Label>
                        <Input value={editValues.licensePlate || ''} onChange={e => setEditValues({ ...editValues, licensePlate: e.target.value })} className="mt-1" placeholder="AAA 123" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {reservation.segments && reservation.segments.length > 0 ? (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-semibold text-indigo-700">Itinerario Completo</h4>
                          <span className="text-xs text-muted-foreground">{nights} noches total</span>
                        </div>
                        <div className="rounded-lg border overflow-hidden">
                          {reservation.segments.map((seg, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 border-b last:border-0 hover:bg-white transition-colors">
                              <div className="flex flex-col">
                                <Badge variant="outline" className="w-fit mb-1 border-indigo-200 bg-indigo-50 text-indigo-700">{seg.unit}</Badge>
                                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                                  {new Date(seg.checkIn).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })} - {new Date(seg.checkOut).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-sm font-bold text-gray-700">
                                  {Math.ceil((new Date(seg.checkOut).getTime() - new Date(seg.checkIn).getTime()) / (1000 * 60 * 60 * 24))} Noches
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm mt-3 pt-3 border-t">
                          <div>
                            <span className="text-xs text-gray-400 uppercase font-bold block">Mascota</span>
                            <span className="font-medium">{reservation.hasPet ? `Sí ${reservation.petCharged ? '($)' : '(Free)'}` : 'No'}</span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-400 uppercase font-bold block">Pax</span>
                            <span className="font-medium">{reservation.pax} Personas</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="text-lg font-bold border-emerald-200 bg-emerald-50 text-emerald-700 px-4 py-1">
                            {reservation.unit}
                          </Badge>
                          <span className="text-base text-muted-foreground font-medium">{reservation.pax} Personas • {nights} Noches</span>
                        </div>

                        <div className="flex gap-4">
                          <div className="flex-1 bg-gray-50 p-3 rounded-lg border text-center">
                            <span className="text-xs text-gray-400 uppercase font-bold block mb-1">Check-in</span>
                            <span className="font-bold text-lg">{new Date(reservation.checkIn).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}</span>
                          </div>
                          <div className="flex-1 bg-gray-50 p-3 rounded-lg border text-center">
                            <span className="text-xs text-gray-400 uppercase font-bold block mb-1">Check-out</span>
                            <span className="font-bold text-lg">{new Date(reservation.checkOut).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                          <div>
                            <span className="text-xs text-gray-400 uppercase font-bold block">Mascota</span>
                            <span className="font-medium">{reservation.hasPet ? `Sí ${reservation.petCharged ? '($)' : '(Free)'}` : 'No'}</span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-400 uppercase font-bold block">Patente Vehículo</span>
                            <span className="font-medium">{reservation.licensePlate || '-'}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Cleaning Schedule Toggle Section */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-sm uppercase text-emerald-600 tracking-wider flex items-center gap-2">
                    <SprayCan className="w-4 h-4" /> Cronograma de Servicios
                  </h3>
                </div>

                <div className="space-y-3">
                  {/* List of Scheduled Cleanings */}
                  {(() => {
                    // Use editValues if editing, otherwise direct reservation
                    const sourceSchedule = isEditing
                      ? (editValues.cleaningSchedule || [])
                      : (reservation.cleaningSchedule || getCleaningTasks(reservation));

                    // We need to ensure we work with a valid array
                    const safeSchedule = Array.isArray(sourceSchedule) ? sourceSchedule : [];

                    if (safeSchedule.length === 0) {
                      return <p className="text-sm text-muted-foreground italic">No hay servicios programados.</p>;
                    }

                    return safeSchedule
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .map((task, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-md bg-slate-50 border border-slate-100">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${task.type === 'toallas' ? 'bg-cyan-100 text-cyan-600' : 'bg-purple-100 text-purple-600'}`}>
                              {task.type === 'toallas' ? <Droplets className="w-4 h-4" /> : <SprayCan className="w-4 h-4" />}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{task.type === 'toallas' ? 'Recambio de Toallas' : 'Limpieza Completa'}</p>
                              <p className="text-xs text-muted-foreground capitalize">
                                {new Date(task.date).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
                              </p>
                            </div>
                          </div>
                          {isEditing && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => {
                                const newSchedule = safeSchedule.filter((_, i) => i !== idx);
                                setEditValues({ ...editValues, cleaningSchedule: newSchedule });
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ));
                  })()}

                  {/* Add New Service (Edit Mode Only) */}
                  {isEditing && (
                    <div className="border-t pt-3 mt-3">
                      <Label className="text-xs font-semibold uppercase text-muted-foreground mb-2 block">Agregar Nuevo Servicio</Label>
                      <div className="flex gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="flex-1 gap-1 border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-100">
                              <Plus className="w-3 h-3" /> Toallas
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              onSelect={(date) => {
                                if (date) {
                                  const newTask = { id: `manual-${Date.now()}`, date, type: 'toallas' as const, unit: editValues.unit };
                                  setEditValues({ ...editValues, cleaningSchedule: [...(editValues.cleaningSchedule || []), newTask] });
                                }
                              }}
                              fromDate={new Date(editValues.checkIn)}
                              toDate={new Date(editValues.checkOut)}
                            />
                          </PopoverContent>
                        </Popover>

                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="flex-1 gap-1 border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100">
                              <Plus className="w-3 h-3" /> Completo
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              onSelect={(date) => {
                                if (date) {
                                  const newTask = { id: `manual-${Date.now()}`, date, type: 'completo' as const, unit: editValues.unit };
                                  setEditValues({ ...editValues, cleaningSchedule: [...(editValues.cleaningSchedule || []), newTask] });
                                }
                              }}
                              fromDate={new Date(editValues.checkIn)}
                              toDate={new Date(editValues.checkOut)}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              {!isEditing && (
                <div className="bg-white p-4 rounded-xl border flex gap-3">
                  <Popover open={previewOpen} onOpenChange={setPreviewOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex-1 gap-2 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100">
                        <Send className="w-4 h-4" /> Whatsapp Bienvenida
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-3">
                      <div className="text-xs bg-muted p-2 rounded whitespace-pre-wrap max-h-40 overflow-y-auto mb-2">
                        {mensajes.bienvenida.replace('{nombre}', reservation.guestName).replace('{unidad}', reservation.unit)}
                      </div>
                      <Button size="sm" onClick={() => { alert("Enviado!"); setPreviewOpen(false); }} className="w-full h-8">Confirmar Envío</Button>
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {/* Observations */}
              <div className="space-y-2">
                <Label className="uppercase text-xs font-bold text-muted-foreground">Observaciones</Label>
                {isEditing ? (
                  <Textarea
                    value={editValues.observations || ''}
                    onChange={e => setEditValues({ ...editValues, observations: e.target.value })}
                    className="min-h-[100px]"
                  />
                ) : (
                  <div className="text-sm bg-yellow-50/50 border border-yellow-100 p-4 rounded-lg min-h-[80px] text-gray-700 italic">
                    {reservation.observations || "Sin observaciones registradas."}
                  </div>
                )}
              </div>

            </div>

            {/* RIGHT COLUMN: Finance & Payments */}
            <div className="col-span-12 md:col-span-7 space-y-6 flex flex-col">

              {/* Financial Summary Row */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl border shadow-sm text-center">
                  <span className="text-xs text-muted-foreground uppercase block font-bold mb-1">Total Reserva</span>
                  {isEditing ? (
                    <div className="flex items-center justify-center">
                      <span className="text-sm text-gray-500 mr-2">USD</span>
                      <Input
                        type="number"
                        className="h-9 w-28 text-center font-bold text-lg"
                        value={editValues.totalUSD || 0}
                        onChange={e => setEditValues({ ...editValues, totalUSD: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  ) : (
                    <span className="font-bold text-2xl text-slate-800 dark:text-slate-100">USD {(reservation.totalUSD || 0).toLocaleString()}</span>
                  )}
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 shadow-sm text-center">
                  <span className="text-xs text-emerald-600 uppercase block font-bold mb-1">Total Pagado</span>
                  <span className="font-bold text-2xl text-emerald-700">USD {(reservation.amountPaidUSD || getComputedPaidUSD(reservation)).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-xl border border-rose-100 shadow-sm text-center">
                  <span className="text-xs text-rose-600 uppercase block font-bold mb-1">Saldo Pendiente</span>
                  <span className="font-bold text-2xl text-rose-700">USD {getBalanceUSD(reservation).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>

              {/* Breakdown & ARS */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Detalle Financiero</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Valor Base ({nights} noches)</span>
                    <span className="font-medium">USD {baseStay.toLocaleString()}</span>
                  </div>
                  {petFee > 0 && (
                    <div className="flex justify-between text-sm text-orange-600 font-medium">
                      <span>+ Adicional Mascota</span>
                      <span>USD {petFee.toLocaleString()}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded border border-dashed border-gray-300">
                    <span className="text-xs uppercase font-bold text-gray-500">Saldo estimado en Pesos</span>
                    <div className="text-right">
                      <span className="font-mono text-xl text-gray-800 font-bold block">ARS $ {((reservation.balance_usd || getBalanceUSD(reservation)) * (reservation.exchangeRate || exchangeRate || 0)).toLocaleString()}</span>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-gray-400">
                          Cotización: ${reservation.exchangeRate || exchangeRate || 0}
                        </span>
                        <span className="text-[9px] text-emerald-600 font-bold uppercase">
                          {reservation.tipoCambioFuente === 'BNA_VENTA' ? 'Dólar BNA' : reservation.tipoCambioFuente === 'PAYWAY_TURISTA' ? 'Payway / MEP' : 'Manual'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Form & History */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Pagos Registrados</h3>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="text-xs font-bold uppercase text-gray-500 mb-2">Nuevo Pago</div>
                  <div className="flex gap-3">
                    <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="h-9 w-36 bg-white" />
                    <Select value={method} onValueChange={(v) => setMethod(v as 'Efectivo' | 'Transferencia' | 'Tarjeta' | 'Debito')}>
                      <SelectTrigger className="h-9 w-32 bg-white"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="Efectivo">Efectivo</SelectItem><SelectItem value="Transferencia">Transferencia</SelectItem><SelectItem value="Tarjeta">Tarjeta</SelectItem></SelectContent>
                    </Select>
                    <Select value={currency} onValueChange={(v) => setCurrency(v as 'USD' | 'ARS')}>
                      <SelectTrigger className="h-9 w-24 bg-white"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="USD">USD</SelectItem><SelectItem value="ARS">ARS</SelectItem></SelectContent>
                    </Select>
                    <div className="relative flex-1">
                      <Input
                        type="number"
                        placeholder="Monto"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        className="h-9 pl-3 bg-white font-medium"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end items-center">
                    {currency === 'ARS' && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Cotización ({reservation.nacionalidadTipo === 'EXTRANJERO' ? 'Turista' : 'BNA'}):</span>
                        <Input type="number" value={exchangeRate} onChange={e => setExchangeRate(parseFloat(e.target.value) || 0)} className="h-8 w-24 text-xs bg-white text-right" />
                      </div>
                    )}
                    <Button onClick={handleAddPayment} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                      <Plus className="w-4 h-4 mr-2" /> Registrar Pago
                    </Button>
                  </div>
                </div>

                <div className="rounded-xl border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow className="h-10 hover:bg-gray-50">
                        <TableHead className="w-32">Fecha</TableHead>
                        <TableHead>Método</TableHead>
                        <TableHead className="text-right">Monto</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(!reservation.payments || reservation.payments.length === 0) ? (
                        <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No hay pagos registrados.</TableCell></TableRow>
                      ) : (
                        reservation.payments.map((p) => (
                          <TableRow key={p.id} className="group">
                            <TableCell className="text-muted-foreground">{new Date(p.date).toLocaleDateString('es-AR')}</TableCell>
                            <TableCell>
                              <div className="font-medium">{p.method}</div>
                              <div className="text-[10px] text-gray-400">{p.currency} {p.currency === 'ARS' ? `($${p.exchangeRate})` : ''}</div>
                            </TableCell>
                            <TableCell className="text-right font-bold text-gray-900">
                              {p.currency === 'USD' ? 'USD ' : '$ '}
                              {p.amount.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-center">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-indigo-600" title="Imprimir Recibo">
                                <FileText className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

            </div>
          </div>
        </TabsContent>

        <TabsContent value="historial" className="flex-1 overflow-y-auto mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Historial de Modificaciones</CardTitle>
            </CardHeader>
            <CardContent>
              {!reservation.history || reservation.history.length === 0 ? (
                <p className="text-muted-foreground text-sm italic py-8 text-center">No hay modificaciones registradas en esta reserva.</p>
              ) : (
                <div className="relative border-l border-gray-200 ml-3 space-y-8 my-4">
                  {reservation.history.map((item, i) => (
                    <div key={i} className="ml-8 relative">
                      <span className="absolute -left-[41px] top-1 h-5 w-5 rounded-full bg-white border-4 border-emerald-500"></span>
                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-1">
                        <h4 className="text-sm font-bold text-gray-900">{item.action}</h4>
                        <span className="text-xs text-gray-500">{new Date(item.date).toLocaleString()} • {item.user}</span>
                      </div>
                      <div className="text-sm text-gray-600 bg-slate-50 p-3 rounded border">{item.details}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Dialog open={relocationOpen} onOpenChange={setRelocationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reubicar Reserva</DialogTitle>
            <DialogDescription>
              Seleccione el complejo al que desea reubicar esta reserva. Esto liberará la unidad actual.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>Complejo de Destino</Label>
            <Select value={targetComplex} onValueChange={(v: 'Huella Andina' | 'Santa Rita') => setTargetComplex(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Huella Andina">Huella Andina</SelectItem>
                <SelectItem value="Santa Rita">Santa Rita</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRelocationOpen(false)}>Cancelar</Button>
            <Button onClick={handleRelocation} className="bg-emerald-600 hover:bg-emerald-700">Confirmar Reubicación</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
