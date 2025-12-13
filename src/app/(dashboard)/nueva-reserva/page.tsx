'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Home } from "lucide-react";
import { useReservations } from "@/contexts/ReservationsContext";
import { ReservationFormData } from "@/components/reservas/types";
import { DatosPrincipales } from "@/components/reservas/DatosPrincipales";
import { FechasHuesped } from "@/components/reservas/FechasHuesped";
import { ValoresPagos } from "@/components/reservas/ValoresPagos";
import { ResumenFinal } from "@/components/reservas/ResumenFinal";
import { useEffect } from "react";

export default function NuevaReservaPage() {
  const router = useRouter();
  const { addReservation, reservations } = useReservations();
  const [activeTab, setActiveTab] = useState("datos-principales");
  
  const [formData, setFormData] = useState<ReservationFormData>({
    fechaCarga: new Date().toISOString().split('T')[0],
    responsableCarga: "",
    politicaCancelacion: "",
    tipoUnidad: "",
    observaciones: "",
    checkIn: "",
    checkOut: "",
    estadoReserva: "confirmada",
    responsableCheckIn: "",
    nombreHuesped: "",
    telefono: "",
    email: "",
    plataforma: "",
    cantidadPax: "2",
    patenteVehiculo: "",
    traeMascota: false,
    valorNocheUSD: "",
    valorNocheARS: "",
    conceptoPago: "",
    formaPago: "",
    moneda: "USD",
    cuentaDestino: "",
    montoPagado: "0",
    cotizacionDolar: 0
  });

  // Fetch Dolar
  useEffect(() => {
    fetch('https://dolarapi.com/v1/dolares/oficial')
      .then(res => res.json())
      .then(data => {
        if (data && data.venta) {
            setFormData(prev => ({ ...prev, cotizacionDolar: data.venta }));
        }
      })
      .catch(err => console.error(err));
  }, []);

  const updateFormData = (updates: Partial<ReservationFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const goToNext = (nextTab: string) => {
    setActiveTab(nextTab);
  };

  const goToPrevious = (prevTab: string) => {
    setActiveTab(prevTab);
  };

  const handleSubmit = () => {
    // Validaciones finales
    if (!formData.tipoUnidad || !formData.checkIn || !formData.checkOut || !formData.nombreHuesped) {
      alert("⚠️ Faltan datos obligatorios. Por favor revise el formulario.");
      return;
    }

    // Fix: Parse manually to avoid timezone issues with new Date(string)
    const [checkInYear, checkInMonth, checkInDay] = formData.checkIn.split('-').map(Number);
    const [checkOutYear, checkOutMonth, checkOutDay] = formData.checkOut.split('-').map(Number);

    const checkInDate = new Date(checkInYear, checkInMonth - 1, checkInDay);
    const checkOutDate = new Date(checkOutYear, checkOutMonth - 1, checkOutDay);
    
    // Normalizar horas
    checkInDate.setHours(12, 0, 0, 0);
    checkOutDate.setHours(12, 0, 0, 0);

    if (checkOutDate <= checkInDate) {
      alert("⚠️ La fecha de check-out debe ser posterior al check-in");
      return;
    }

    // Verificar conflictos
    const hasConflict = reservations.some(res => {
      // Ignorar conflictos con la misma reserva (si fuera edición)
      // TipoUnidad ahora guarda el Nombre Real (ej: LG-1), no el ID
      if (res.unit === formData.tipoUnidad) {
          const resStart = new Date(res.checkIn);
          const resEnd = new Date(res.checkOut);
          resStart.setHours(12, 0, 0, 0);
          resEnd.setHours(12, 0, 0, 0);
          
          return (checkInDate < resEnd && checkOutDate > resStart);
      }
      return false;
    });

    if (hasConflict) {
      alert("⚠️ Conflicto: Ya existe una reserva en esas fechas para esta unidad");
      return;
    }

    // Crear objeto reserva compatible con el contexto
    const totalUSD = parseFloat(formData.valorNocheUSD) * Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)) || 0;
    const paidAmount = parseFloat(formData.montoPagado) || 0;
    
    // Calculate paid in USD if currency is ARS
    let paidAmountUSD = 0;
    if (formData.moneda === 'USD') {
        paidAmountUSD = paidAmount;
    } else if (formData.moneda === 'ARS' && formData.cotizacionDolar) {
        paidAmountUSD = paidAmount / formData.cotizacionDolar;
    }

    const newReservation = {
      id: `res-${Date.now()}`,
      unit: formData.tipoUnidad, // Now directly the name
      guestName: formData.nombreHuesped,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      status: "active" as const,
      phone: formData.telefono,
      email: formData.email,
      pax: parseInt(formData.cantidadPax) || 2,
      observations: formData.observaciones,
      total: totalUSD * (formData.cotizacionDolar || 1), // Legacy ARS rough estimate if needed, or just 0
      totalUSD: totalUSD,
      amountPaid: paidAmount, // Nominal sum
      amountPaidUSD: paidAmountUSD,
      payments: paidAmount > 0 ? [{
          id: Date.now().toString(),
          date: new Date(),
          amount: paidAmount,
          currency: formData.moneda as 'ARS'|'USD',
          method: formData.formaPago as any,
          exchangeRate: formData.moneda === 'ARS' ? formData.cotizacionDolar : undefined
      }] : []
    };

    addReservation(newReservation);
    
    // Redirigir al calendario para ver la reserva
    router.push('/calendario');
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-3 rounded-2xl shadow-lg">
            <Home className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-emerald-900 text-2xl font-bold">Nueva Reserva</h1>
            <p className="text-slate-500">Sistema de Gestión - Las Gaviotas & Fontana</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-slate-600 text-sm">Usuario actual</p>
            <p className="text-emerald-700 font-semibold">Admin Principal</p>
          </div>
          <Avatar className="border-2 border-emerald-200">
            <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold">AP</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Main Card with Tabs */}
      <Card className="shadow-xl rounded-2xl bg-white/80 backdrop-blur-sm border-slate-200">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-slate-200 bg-slate-50/50 rounded-t-2xl px-2 md:px-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-transparent h-auto gap-2 py-4">
              <TabsTrigger 
                value="datos-principales"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl px-2 py-3 transition-all text-xs md:text-sm"
              >
                1. Datos principales
              </TabsTrigger>
              <TabsTrigger 
                value="fechas-huesped"
                disabled={!formData.tipoUnidad} // Deshabilitar si no hay unidad seleccionada
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl px-2 py-3 transition-all text-xs md:text-sm"
              >
                2. Fechas y huésped
              </TabsTrigger>
              <TabsTrigger 
                value="valores-pagos"
                disabled={!formData.checkIn || !formData.nombreHuesped}
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl px-2 py-3 transition-all text-xs md:text-sm"
              >
                3. Valores y pagos
              </TabsTrigger>
              <TabsTrigger 
                value="resumen"
                disabled={!formData.montoPagado}
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl px-2 py-3 transition-all text-xs md:text-sm"
              >
                4. Resumen
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-4 md:p-8 min-h-[500px]">
            <TabsContent value="datos-principales" className="mt-0 focus-visible:outline-none ring-0">
              <DatosPrincipales 
                formData={formData} 
                updateFormData={updateFormData}
                onNext={() => goToNext("fechas-huesped")}
              />
            </TabsContent>

            <TabsContent value="fechas-huesped" className="mt-0 focus-visible:outline-none ring-0">
              <FechasHuesped 
                formData={formData} 
                updateFormData={updateFormData}
                onNext={() => goToNext("valores-pagos")}
                onPrevious={() => goToPrevious("datos-principales")}
              />
            </TabsContent>

            <TabsContent value="valores-pagos" className="mt-0 focus-visible:outline-none ring-0">
              <ValoresPagos 
                formData={formData} 
                updateFormData={updateFormData}
                onNext={() => goToNext("resumen")}
                onPrevious={() => goToPrevious("fechas-huesped")}
              />
            </TabsContent>

            <TabsContent value="resumen" className="mt-0 focus-visible:outline-none ring-0">
              <ResumenFinal 
                formData={formData}
                onPrevious={() => goToPrevious("valores-pagos")}
                onSubmit={handleSubmit}
              />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
}
