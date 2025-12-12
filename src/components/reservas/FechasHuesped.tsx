import { ReservationFormData } from "./types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useMemo } from "react";

interface FechasHuespedProps {
  formData: ReservationFormData;
  updateFormData: (updates: Partial<ReservationFormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function FechasHuesped({ formData, updateFormData, onNext, onPrevious }: FechasHuespedProps) {
  // Calcular noches automáticamente
  const noches = useMemo(() => {
    if (formData.checkIn && formData.checkOut) {
      const inicio = new Date(formData.checkIn);
      const fin = new Date(formData.checkOut);
      const diff = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
      return diff > 0 ? diff : 0;
    }
    return 0;
  }, [formData.checkIn, formData.checkOut]);

  const getEstadoBadgeColor = () => {
    switch(formData.estadoReserva) {
      case 'confirmada': return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'cancelacion': return 'bg-red-100 text-red-700 border-red-300';
      case 'reembolso': return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'no-show': return 'bg-slate-100 text-slate-700 border-slate-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-emerald-900 mb-2 font-semibold text-lg">Fechas y datos del huésped</h2>
        <p className="text-slate-500 text-sm">Configure las fechas de estadía y la información del huésped</p>
      </div>

      {/* Fechas y Estado */}
      <div className="bg-slate-50 rounded-2xl p-6 space-y-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-emerald-600" />
          <h3 className="text-slate-800 font-medium">Información de estadía</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="checkIn" className="text-slate-700">Check-in (dd/mm/aaaa)</Label>
            <Input
              id="checkIn"
              type="text"
              placeholder="dd/mm/aaaa"
              maxLength={10}
              defaultValue={formData.checkIn ? formData.checkIn.split('T')[0].split('-').reverse().join('/') : ''}
              onBlur={(e) => {
                const val = e.target.value;
                const parts = val.split('/');
                if (parts.length === 3) {
                   const [d, m, y] = parts;
                   if (d.length===2 && m.length===2 && y.length===4) {
                     updateFormData({ checkIn: `${y}-${m}-${d}` });
                   }
                }
              }}
              className="rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="checkOut" className="text-slate-700">Check-out (dd/mm/aaaa)</Label>
            <Input
              id="checkOut"
              type="text"
              placeholder="dd/mm/aaaa"
              maxLength={10}
              defaultValue={formData.checkOut ? formData.checkOut.split('T')[0].split('-').reverse().join('/') : ''}
               onBlur={(e) => {
                const val = e.target.value;
                const parts = val.split('/');
                if (parts.length === 3) {
                   const [d, m, y] = parts;
                   if (d.length===2 && m.length===2 && y.length===4) {
                     updateFormData({ checkOut: `${y}-${m}-${d}` });
                   }
                }
              }}
              className="rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estadoReserva" className="text-slate-700">Estado de la reserva</Label>
            <Select value={formData.estadoReserva} onValueChange={(value) => updateFormData({ estadoReserva: value })}>
              <SelectTrigger id="estadoReserva" className="rounded-xl border-slate-300 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="confirmada">✓ Confirmada</SelectItem>
                <SelectItem value="cancelacion">✕ Cancelación</SelectItem>
                <SelectItem value="reembolso">↺ Reembolso</SelectItem>
                <SelectItem value="no-show">⊘ No show</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsableCheckIn" className="text-slate-700">Responsable de check-in</Label>
            <Select value={formData.responsableCheckIn} onValueChange={(value) => updateFormData({ responsableCheckIn: value })}>
              <SelectTrigger id="responsableCheckIn" className="rounded-xl border-slate-300 bg-white">
                <SelectValue placeholder="Seleccione responsable" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recepcion-matutino">Recepción - Turno Matutino</SelectItem>
                <SelectItem value="recepcion-vespertino">Recepción - Turno Vespertino</SelectItem>
                <SelectItem value="gerencia">Gerencia</SelectItem>
                <SelectItem value="admin">Administración</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {noches > 0 && (
            <div className="md:col-span-2">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${getEstadoBadgeColor()}`}>
                <span className="text-sm">Noches calculadas: <strong>{noches}</strong></span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Datos del huésped */}
      <div className="border-t border-slate-200 pt-6">
        <h3 className="text-slate-800 font-medium mb-4">Datos del huésped</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="nombreHuesped" className="text-slate-700">Nombre completo</Label>
            <Input
              id="nombreHuesped"
              type="text"
              value={formData.nombreHuesped}
              onChange={(e) => updateFormData({ nombreHuesped: e.target.value })}
              placeholder="Ej: María González Pérez"
              className="rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono" className="text-slate-700">Teléfono</Label>
            <Input
              id="telefono"
              type="tel"
              value={formData.telefono}
              onChange={(e) => updateFormData({ telefono: e.target.value })}
              placeholder="+54 9 11 1234-5678"
              className="rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData({ email: e.target.value })}
              placeholder="ejemplo@email.com"
              className="rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="plataforma" className="text-slate-700">Plataforma de reserva</Label>
            <Select value={formData.plataforma} onValueChange={(value) => updateFormData({ plataforma: value })}>
              <SelectTrigger id="plataforma" className="rounded-xl border-slate-300">
                <SelectValue placeholder="Seleccione plataforma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="directo">Directo / Web propia</SelectItem>
                <SelectItem value="booking">Booking.com</SelectItem>
                <SelectItem value="airbnb">Airbnb</SelectItem>
                <SelectItem value="despegar">Despegar</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cantidadPax" className="text-slate-700">Cantidad de pasajeros (PAX)</Label>
            <Input
              id="cantidadPax"
              type="number"
              min="1"
              value={formData.cantidadPax}
              onChange={(e) => updateFormData({ cantidadPax: e.target.value })}
              className="rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="patenteVehiculo" className="text-slate-700">Patente del vehículo</Label>
            <Input
              id="patenteVehiculo"
              type="text"
              value={formData.patenteVehiculo}
              onChange={(e) => updateFormData({ patenteVehiculo: e.target.value.toUpperCase() })}
              placeholder="ABC123"
              className="rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div className="md:col-span-2 flex items-center space-x-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <Checkbox
              id="traeMascota"
              checked={formData.traeMascota}
              onCheckedChange={(checked) => updateFormData({ traeMascota: checked as boolean })}
              className="border-amber-400 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
            />
            <Label htmlFor="traeMascota" className="text-amber-900 cursor-pointer font-medium">
              🐾 El huésped trae mascota
            </Label>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button 
          onClick={onPrevious}
          variant="outline"
          className="border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl px-6 py-2"
        >
          <ChevronLeft className="mr-2 w-4 h-4" />
          Anterior
        </Button>
        <Button 
          onClick={onNext}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 py-2 shadow-sm"
        >
          Siguiente
          <ChevronRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
