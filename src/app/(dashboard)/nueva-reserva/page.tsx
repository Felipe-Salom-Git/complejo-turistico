'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, User, Home, CreditCard, Save, Search, Check } from "lucide-react";
import { useReservations, UNIT_GROUPS, INVENTORY, Reservation } from "@/contexts/ReservationsContext";
import { useGuests, Guest } from "@/contexts/GuestsContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar"; // Assuming standard shadcn calendar
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/components/ui/utils";
import { Badge } from "@/components/ui/badge";

export default function NuevaReservaPage() {
  const router = useRouter();
  const { addReservation, reservations, findAvailableUnit } = useReservations();
  const { guests, addGuest } = useGuests();

  // Form State
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  const [checkIn, setCheckIn] = useState<Date | undefined>(new Date());
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);

  const [selectedUnit, setSelectedUnit] = useState("");
  const [pax, setPax] = useState("2");
  const [licensePlate, setLicensePlate] = useState("");
  const [channel, setChannel] = useState("Directo");
  const [cancellationPolicy, setCancellationPolicy] = useState("");
  const [hasPet, setHasPet] = useState(false);
  const [petCharged, setPetCharged] = useState(false);

  const [manualBasePrice, setManualBasePrice] = useState<string>(""); 
  // Removed explicit pricePerNightUSD state as detailed breakdown logic is now simpler (manual base + pet fee)

  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Efectivo");
  const [paymentCurrency, setPaymentCurrency] = useState<'USD' | 'ARS'>("USD");
  const [exchangeRate, setExchangeRate] = useState(0);

  // Fetch BNA rate on mount
  useEffect(() => {
    fetch('https://dolarapi.com/v1/dolares/oficial')
      .then(res => res.json())
      .then(data => {
        if (data && data.venta) {
          setExchangeRate(data.venta);
        }
      })
      .catch(err => console.error("Error fetching BNA rate:", err));
  }, []);

  // Guest search state removed as requested
  // Keeping clean state for render


  // Calculations
  const nights = checkIn && checkOut
    ? Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  // Manual Base + Pet Fee
  const petFeeTotal = (hasPet && petCharged) ? (nights * 10) : 0;
  const baseValue = parseFloat(manualBasePrice || "0");
  const finalTotalUSD = baseValue + petFeeTotal;
  
  // Effective daily rate for info
  const effectiveDailyRate = nights > 0 ? (baseValue / nights) : 0;

  const totalPaidUSD = paymentCurrency === 'USD'
    ? parseFloat(paymentAmount || "0")
    : (parseFloat(paymentAmount || "0") / (exchangeRate || 1));

  const balanceUSD = finalTotalUSD - totalPaidUSD;

  // Auto-update payment for Prepaga policy
  useEffect(() => {
    if (cancellationPolicy === 'Prepaga') {
      setPaymentAmount(finalTotalUSD.toString());
    }
  }, [cancellationPolicy, finalTotalUSD]);

  // Submit Handler
  const handleSubmit = () => {
    if (!guestName || !checkIn || !checkOut || !selectedUnit) {
      alert("Por favor complete los campos obligatorios: Huésped, Fechas, Unidad.");
      return;
    }

    if (checkOut <= checkIn) {
      alert("La fecha de salida debe ser posterior a la de entrada.");
      return;
    }

    const finalUnit = findAvailableUnit(selectedUnit, checkIn, checkOut);

    if (!finalUnit) {
      alert("⚠️ No hay disponibilidad para el tipo de unidad seleccionado en estas fechas.");
      return;
    }

    // Always create new guest for this flow as requested (no search)
    const newGuestId = `G-${Date.now()}`;
    addGuest({
      id: newGuestId,
      firstName: guestName.split(',')[1]?.trim() || guestName.split(' ')[0] || guestName,
      lastName: guestName.split(',')[0]?.trim() || "",
      document: "",
      email: email,
      phone: phone,
      address: "",
      city: "",
      country: "",
      reservationsCount: 1,
      lastVisit: new Date().toISOString().split('T')[0],
      notes: "Creado desde Nueva Reserva Simple"
    });

    const newReservation: Reservation = {
      id: `RES-${Date.now()}`,
      unit: finalUnit, // Use the assigned unit
      guestName: guestName,
      checkIn: checkIn,
      checkOut: checkOut,
      status: "active",
      email: email,
      phone: phone,
      pax: parseInt(pax),
      totalUSD: finalTotalUSD,
      amountPaidUSD: totalPaidUSD,
      amountPaid: parseFloat(paymentAmount || "0"), // Legacy
      payments: parseFloat(paymentAmount) > 0 ? [{
        id: Date.now().toString(),
        date: new Date(),
        amount: parseFloat(paymentAmount),
        currency: paymentCurrency,
        method: paymentMethod as any,
        invoiceNumber: undefined,
        exchangeRate: paymentCurrency === 'ARS' ? exchangeRate : undefined,
      }] : [],
      observations: "Reserva creada desde el nuevo panel.",
      source: channel,
      cancellationPolicy: cancellationPolicy,
      licensePlate: licensePlate,
      hasPet: hasPet,
      petCharged: petCharged,
      createdAt: new Date(),
      createdBy: "Admin Principal",

      // Snake case fields as requested
      // Note: payments is conditionally populated above, or [] if empty.
      balance_usd: balanceUSD,
      balance_ars: balanceUSD * (exchangeRate || 0),
      exchangeRate: exchangeRate
    };

    addReservation(newReservation);
    router.push('/calendario'); // Or /reservas
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Nueva Reserva</h1>
          <p className="text-muted-foreground">Complete los datos para registrar una nueva estadía.</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>Cancelar</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Form Inputs */}
        <div className="lg:col-span-2 space-y-6">

          {/* 1. Guest Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5 text-emerald-600" /> Datos del Huésped
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Label className="text-base font-semibold text-emerald-800">Datos Personales</Label>
                <p className="text-xs text-muted-foreground mb-4">Complete los datos del huésped titular.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nombre Completo</Label>
                    <Input 
                      placeholder="Nombre y Apellido"
                      value={guestName} 
                      onChange={e => setGuestName(e.target.value)} 
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input 
                      placeholder="estela@ejemplo.com"
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                    />
                  </div>
                  <div>
                    <Label>Teléfono</Label>
                    <Input 
                      placeholder="+54 9 ..."
                      value={phone} 
                      onChange={e => setPhone(e.target.value)} 
                    />
                  </div>
                  <div>
                    <Label>Pasajeros (Pax)</Label>
                    <Input type="number" value={pax} onChange={e => setPax(e.target.value)} min={1} />
                  </div>
                  <div>
                    <Label>Patente Vehículo</Label>
                    <Input value={licensePlate} onChange={e => setLicensePlate(e.target.value)} placeholder="AAA 123" />
                  </div>
              </div>


            </CardContent>
          </Card>

          {/* 2. Stay Details (Date & Unit) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Home className="w-5 h-5 text-emerald-600" /> Detalles de Alojamiento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Fecha de Entrada</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkIn && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkIn ? format(checkIn, "dd/MM/yyyy", { locale: es }) : <span>Seleccionar fecha</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkIn}
                        onSelect={setCheckIn}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Fecha de Salida</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkOut && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkOut ? format(checkOut, "dd/MM/yyyy", { locale: es }) : <span>Seleccionar fecha</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkOut}
                        onSelect={setCheckOut}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Seleccionar Tipo de Unidad</Label>
                  <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Seleccione un tipo..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {Object.keys(UNIT_GROUPS).map((group) => (
                        <SelectItem key={group} value={group}>
                           {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Canal de Reserva</Label>
                  <Select value={channel} onValueChange={setChannel}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Canal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Directo">Directo (Mostrador/Tel/Wsp)</SelectItem>
                      <SelectItem value="Booking">Booking.com</SelectItem>
                      <SelectItem value="Airbnb">Airbnb</SelectItem>
                      <SelectItem value="Expedia">Expedia</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Financials */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="w-5 h-5 text-emerald-600" /> Valores y Pago Inicial
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <Label className="font-bold">Valor Estadía (Base USD)</Label>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Manual</span>
                  </div>

                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400">$</span>
                    <Input
                      type="number"
                      className="pl-7 font-bold text-lg border-emerald-500 bg-emerald-50/10"
                      placeholder="0.00"
                      value={manualBasePrice}
                      onChange={e => setManualBasePrice(e.target.value)}
                    />
                  </div>
                  
                  {hasPet && (
                    <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg flex justify-between items-center text-sm">
                       <span className="text-orange-800 flex items-center gap-2">
                         🐾 Recargo Mascota ({nights} noches)
                       </span>
                       <span className="font-bold text-orange-700">
                         {petCharged ? `+ USD ${petFeeTotal}` : 'Bonificado'}
                       </span>
                    </div>
                  )}

                  <div className="mt-2 flex items-center justify-between bg-slate-100 p-2 rounded">
                      <Label className="text-xs text-muted-foreground">Total Final:</Label>
                      <span className="text-lg font-bold text-slate-800">USD {finalTotalUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>

                  <div className="space-y-1 pt-2">
                    <Label className="text-xs">Política de Cancelación</Label>
                    <Select 
                      value={cancellationPolicy} 
                      onValueChange={(v) => {
                        setCancellationPolicy(v);
                        if (v === 'Prepaga') {
                          setPaymentAmount(finalTotalUSD.toString());
                          setPaymentCurrency('USD'); // Default to USD for full prepay
                        }
                      }}
                    >
                      <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Seleccionar política..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Non Ref">Non Ref</SelectItem>
                        <SelectItem value="100% 21 Dias">100% 21 Días</SelectItem>
                        <SelectItem value="100% 14 Dias">100% 14 Días</SelectItem>
                        <SelectItem value="50% 14 Dias">50% 14 Días</SelectItem>
                        <SelectItem value="100% 2 Dias">100% 2 Días</SelectItem>
                        <SelectItem value="Prepaga">Prepaga</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Cotización Dólar (BNA Venta)</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-2.5 text-gray-400">ARS</span>
                    <Input
                      type="number"
                      className="pl-10 text-sm"
                      value={exchangeRate || ''}
                      onChange={e => setExchangeRate(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">Cotización Oficial referencial.</p>
                </div>
              </div>

              <Separator />

              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg space-y-4">
                <h4 className="font-medium text-sm">Registrar Pago Inicial (Seña)</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs">Monto</Label>
                    <Input
                      placeholder="0.00"
                      value={paymentAmount}
                      onChange={e => setPaymentAmount(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Moneda</Label>
                    <Select value={paymentCurrency} onValueChange={(v: any) => setPaymentCurrency(v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="ARS">ARS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Método</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Efectivo">Efectivo</SelectItem>
                        <SelectItem value="Transferencia">Transferencia</SelectItem>
                        <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4. Extras & Policies (Moved to Bottom) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Check className="w-5 h-5 text-emerald-600" /> Extras y Políticas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-8">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="hasPet" 
                    checked={hasPet} 
                    onCheckedChange={(c: boolean) => {
                      setHasPet(c);
                      if (c) setPetCharged(true); // Default to charged when selected
                    }} 
                  />
                  <Label htmlFor="hasPet">Tiene Mascota</Label>
                </div>
                {hasPet && (
                  <div className="flex items-center space-x-2 animate-in fade-in">
                    <Checkbox id="petCharged" checked={petCharged} onCheckedChange={(c: boolean) => setPetCharged(c)} />
                    <Label htmlFor="petCharged">Mascota Cobrada (+USD 10/noche)</Label>
                  </div>
                )}
              </div>

            </CardContent>
          </Card>

        </div>

        {/* Right Column: Sticky Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Card className="bg-slate-900 text-white border-none shadow-2xl overflow-hidden">
              <CardHeader className="bg-emerald-600 pb-8">
                <CardTitle className="text-white">Resumen de Reserva</CardTitle>
              </CardHeader>
              <CardContent className="-mt-4">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 space-y-4 border border-white/20">
                  {/* Dates */}
                  <div className="flex justify-between items-center text-sm">
                    <div className="text-emerald-100">Entrada</div>
                    <div className="font-bold">{checkIn ? format(checkIn, 'dd MMM yyyy', { locale: es }) : '-'}</div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="text-emerald-100">Salida</div>
                    <div className="font-bold">{checkOut ? format(checkOut, 'dd MMM yyyy', { locale: es }) : '-'}</div>
                  </div>
                  <Separator className="bg-white/20" />

                  {/* Unit */}
                  <div className="flex justify-between items-center">
                    <div className="text-emerald-100 text-sm">Unidad</div>
                    <Badge variant="outline" className="text-white border-white/40 bg-white/10">
                      {selectedUnit || 'Sin selección'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm text-emerald-100">
                    <div>Noches</div>
                    <div>{nights}</div>
                  </div>

                  <Separator className="bg-white/20" />
                  {/* Totals */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-end">
                      <div className="text-sm opacity-80">Total USD</div>
                      <div className="text-2xl font-bold tracking-tight">
                        USD {finalTotalUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs text-emerald-300">
                      <span>Pagado</span>
                      <span>USD {totalPaidUSD.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-semibold pt-2 border-t border-white/10 mt-2">
                      <span>Saldo Pendiente</span>
                      <span>USD {balanceUSD.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full mt-6 bg-white text-emerald-900 hover:bg-emerald-100 font-bold h-12 text-lg shadow-lg transition-all hover:scale-[1.02]"
                  onClick={handleSubmit}
                >
                  <Save className="w-5 h-5 mr-2" />
                  Confirmar Reserva
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}
