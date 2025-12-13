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
  const [guestId, setGuestId] = useState<string>("");
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [viewNewGuest, setViewNewGuest] = useState(false); // Toggle manual entry if not found

  const [checkIn, setCheckIn] = useState<Date | undefined>(new Date());
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);

  const [selectedUnit, setSelectedUnit] = useState("");
  const [pax, setPax] = useState("2");
  const [licensePlate, setLicensePlate] = useState("");
  const [channel, setChannel] = useState("Directo");
  const [cancellationPolicy, setCancellationPolicy] = useState("");
  const [hasPet, setHasPet] = useState(false);
  const [petCharged, setPetCharged] = useState(false);

  const [pricePerNightUSD, setPricePerNightUSD] = useState(0);
  const [totalPriceUSD, setTotalPriceUSD] = useState<string>(""); // User entered total
  const [useManualTotal, setUseManualTotal] = useState(false);

  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Efectivo");
  const [paymentCurrency, setPaymentCurrency] = useState<'USD' | 'ARS'>("USD");
  const [exchangeRate, setExchangeRate] = useState(0);

  // Search State
  const [guestSearch, setGuestSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Load Dollar Rate
  useEffect(() => {
    fetch('https://dolarapi.com/v1/dolares/oficial')
      .then(res => res.json())
      .then(data => {
        if (data && data.venta) {
          setExchangeRate(data.venta);
        }
      })
      .catch(() => setExchangeRate(1200)); // Fallback
  }, []);

  // Filter Guests
  const filteredGuests = guests.filter(g =>
    g.lastName.toLowerCase().includes(guestSearch.toLowerCase()) ||
    g.firstName.toLowerCase().includes(guestSearch.toLowerCase()) ||
    g.document.includes(guestSearch)
  );

  const handleSelectGuest = (guest: Guest) => {
    setGuestId(guest.id);
    setGuestName(`${guest.lastName}, ${guest.firstName}`);
    setEmail(guest.email);
    setPhone(guest.phone);
    setGuestSearch(`${guest.lastName}, ${guest.firstName}`);
    setIsSearchOpen(false);
    setViewNewGuest(false);
  };

  const handleCreateGuest = () => {
    // Simple inline creation handled by main submit if no ID
    // Or clear selection to allow manual typing
    setGuestId("");
    setGuestName(guestSearch); // Use search term as name start
    setIsSearchOpen(false);
    setViewNewGuest(true);
  };

  // Calculations
  const nights = checkIn && checkOut
    ? Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const petFeePerNight = (hasPet && !petCharged) ? 10 : 0;

  // If manual total is used, use it. Otherwise calc: (BaseRate + PetFee) * Nights
  const calculatedTotalUSD = (pricePerNightUSD + petFeePerNight) * nights;
  const finalTotalUSD = useManualTotal ? parseFloat(totalPriceUSD || "0") : calculatedTotalUSD;

  // Per requirement: Price per night = total USD / nights
  // We use this for display or consistency.
  // If Manual, effective rate might differ from entered Base Rate.
  const effectiveDailyRate = nights > 0 ? (finalTotalUSD / nights) : 0;

  const totalPaidUSD = paymentCurrency === 'USD'
    ? parseFloat(paymentAmount || "0")
    : (parseFloat(paymentAmount || "0") / (exchangeRate || 1));

  const balanceUSD = finalTotalUSD - totalPaidUSD;

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
      alert("⚠️ No hay disponibilidad para la unidad o categoría seleccionada en estas fechas.");
      return;
    }

    // Create Guest if dynamic
    if (!guestId && viewNewGuest) {
      const newId = Date.now().toString();
      addGuest({
        id: newId,
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
        notes: "Creado desde Nueva Reserva"
      });
    }

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
                <Label>Buscar o Ingresar Huésped</Label>
                <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                  <PopoverTrigger asChild>
                    <div className="relative mt-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar por nombre o DNI..."
                        value={guestSearch}
                        onChange={(e) => {
                          setGuestSearch(e.target.value);
                          setIsSearchOpen(true);
                          if (!e.target.value) setGuestId("");
                        }}
                        className="pl-9"
                      />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-[400px] max-h-[300px] overflow-y-auto" align="start">
                    <div className="p-2 space-y-1">
                      {filteredGuests.length > 0 ? filteredGuests.map(g => (
                        <button
                          key={g.id}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded flex justify-between items-center"
                          onClick={() => handleSelectGuest(g)}
                        >
                          <span>{g.lastName}, {g.firstName}</span>
                          <Badge variant="secondary" className="text-[10px]">{g.document}</Badge>
                        </button>
                      )) : <div className="text-sm text-center py-4 text-muted-foreground">No se encontraron resultados.</div>}
                      <Separator />
                      <Button variant="ghost" className="w-full justify-start text-emerald-600" onClick={handleCreateGuest}>
                        + Crear nuevo: "{guestSearch}"
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {(guestId || viewNewGuest) && (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                  <div>
                    <Label>Nombre Completo</Label>
                    <Input value={guestName} onChange={e => setGuestName(e.target.value)} readOnly={!!guestId} className={guestId ? "bg-slate-100" : ""} />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input value={email} onChange={e => setEmail(e.target.value)} readOnly={!!guestId} className={guestId ? "bg-slate-100" : ""} />
                  </div>
                  <div>
                    <Label>Teléfono</Label>
                    <Input value={phone} onChange={e => setPhone(e.target.value)} readOnly={!!guestId} className={guestId ? "bg-slate-100" : ""} />
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
              )}
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
                  <Input
                    type="date"
                    value={checkIn ? format(checkIn, 'yyyy-MM-dd') : ''}
                    onChange={e => setCheckIn(e.target.value ? new Date(e.target.value) : undefined)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fecha de Salida</Label>
                  <Input
                    type="date"
                    value={checkOut ? format(checkOut, 'yyyy-MM-dd') : ''}
                    onChange={e => setCheckOut(e.target.value ? new Date(e.target.value) : undefined)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Seleccionar Unidad</Label>
                  <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Seleccione una unidad..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {Object.entries(UNIT_GROUPS).map(([group, units]) => (
                        <div key={group}>
                          <SelectItem value={group} className="font-bold bg-slate-100 dark:bg-slate-800 focus:bg-slate-200">
                            ★ Asignar automático: {group}
                          </SelectItem>
                          {units.map(unit => (
                            <SelectItem key={unit} value={unit} className="pl-6 cursor-pointer text-sm">
                              {unit}
                            </SelectItem>
                          ))}
                        </div>
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

          {/* 3. Extras & Policies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Check className="w-5 h-5 text-emerald-600" /> Extras y Políticas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-8">
                <div className="flex items-center space-x-2">
                  <Checkbox id="hasPet" checked={hasPet} onCheckedChange={(c: boolean) => setHasPet(c)} />
                  <Label htmlFor="hasPet">Tiene Mascota</Label>
                </div>
                {hasPet && (
                  <div className="flex items-center space-x-2 animate-in fade-in">
                    <Checkbox id="petCharged" checked={petCharged} onCheckedChange={(c: boolean) => setPetCharged(c)} />
                    <Label htmlFor="petCharged">Mascota Cobrada</Label>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Política de Cancelación</Label>
                <Input
                  value={cancellationPolicy}
                  onChange={e => setCancellationPolicy(e.target.value)}
                  placeholder="Ej: Flexible, No Reembolsable..."
                />
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
                <div className="col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <Label>Total Reserva (USD)</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="manualTotal" checked={useManualTotal} onCheckedChange={(c: boolean) => setUseManualTotal(c)} />
                      <Label htmlFor="manualTotal" className="text-xs text-muted-foreground">Manual</Label>
                    </div>
                  </div>

                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400">$</span>
                    <Input
                      type="number"
                      className={cn("pl-7 font-bold text-lg", useManualTotal ? "border-emerald-500" : "")}
                      placeholder="0.00"
                      value={useManualTotal ? totalPriceUSD : calculatedTotalUSD}
                      onChange={e => {
                        if (useManualTotal) setTotalPriceUSD(e.target.value);
                      }}
                      readOnly={!useManualTotal}
                    />
                  </div>
                  {!useManualTotal && (
                    <div className="mt-2 flex items-center gap-2">
                      <Label className="text-xs text-muted-foreground w-20">Base x Noche:</Label>
                      <div className="relative">
                        <Input
                          type="number"
                          className="h-8 w-24 text-sm"
                          placeholder="0.00"
                          value={pricePerNightUSD || ''}
                          onChange={e => setPricePerNightUSD(parseFloat(e.target.value) || 0)}
                        />
                        {petFeePerNight > 0 && (
                          <div className="text-[10px] text-emerald-600 font-medium absolute top-8 left-0 whitespace-nowrap">
                            + USD {petFeePerNight} (Mascota)
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {useManualTotal && (
                    <div className="mt-2 flex items-center gap-2">
                      <Label className="text-xs text-muted-foreground w-20">Promedio/Noche:</Label>
                      <span className="text-sm font-medium">USD {effectiveDailyRate.toFixed(2)}</span>
                    </div>
                  )}
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
                        USD {finalTotalUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
