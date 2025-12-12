import { ReservationFormData } from "./types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, Check, Calendar, User, CreditCard, Building } from "lucide-react";

interface ResumenFinalProps {
  formData: ReservationFormData;
  onPrevious: () => void;
  onSubmit: () => void;
}

export function ResumenFinal({ formData, onPrevious, onSubmit }: ResumenFinalProps) {
  return (
    <div className="space-y-6">
      <div className="text-center md:text-left">
        <h2 className="text-emerald-900 mb-2 font-semibold text-lg">Resumen de la reserva</h2>
        <p className="text-slate-500 text-sm">Verifique todos los datos antes de confirmar la creación</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Tarjeta de Estadía */}
        <Card className="p-6 border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-slate-800">Datos de Estadía</h3>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Unidad:</span>
              <span className="font-medium text-slate-900">{formData.tipoUnidad}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Check-in:</span>
              <span className="font-medium text-slate-900">
                {formData.checkIn ? new Date(formData.checkIn).toLocaleDateString() : '-'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Check-out:</span>
              <span className="font-medium text-slate-900">
                {formData.checkOut ? new Date(formData.checkOut).toLocaleDateString() : '-'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Política:</span>
              <span className="font-medium text-slate-900 capitalize">{formData.politicaCancelacion}</span>
            </div>
          </div>
        </Card>

        {/* Tarjeta de Huésped */}
        <Card className="p-6 border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-slate-800">Datos del Huésped</h3>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Nombre:</span>
              <span className="font-medium text-slate-900">{formData.nombreHuesped}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Email:</span>
              <span className="font-medium text-slate-900">{formData.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Teléfono:</span>
              <span className="font-medium text-slate-900">{formData.telefono}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Plataforma:</span>
              <span className="font-medium text-slate-900 capitalize">{formData.plataforma}</span>
            </div>
          </div>
        </Card>

        {/* Tarjeta de Pago */}
        <Card className="p-6 border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-slate-800">Información de Pago</h3>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Valor Noche:</span>
              <span className="font-medium text-slate-900">
               {formData.moneda} ${formData.valorNocheUSD}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Monto Abonado:</span>
              <span className="font-medium text-emerald-600 font-bold">
                $ {formData.montoPagado}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Forma de Pago:</span>
              <span className="font-medium text-slate-900 capitalize">
                {formData.formaPago.replace('_', ' ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Concepto:</span>
              <span className="font-medium text-slate-900 capitalize">{formData.conceptoPago}</span>
            </div>
          </div>
        </Card>

        {/* Tarjeta Interna */}
        <Card className="p-6 border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-slate-800">Datos Internos</h3>
          </div>
          
          <div className="space-y-3 text-sm">
             <div className="flex justify-between">
              <span className="text-slate-500">Cargado por:</span>
              <span className="font-medium text-slate-900 capitalize">{formData.responsableCarga}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Fecha Carga:</span>
              <span className="font-medium text-slate-900">{formData.fechaCarga}</span>
            </div>
             <div className="flex justify-between">
              <span className="text-slate-500">Responsable Check-in:</span>
              <span className="font-medium text-slate-900 capitalize">
                {formData.responsableCheckIn.replace('-', ' ')}
              </span>
            </div>
          </div>
        </Card>

        {formData.observaciones && (
          <Card className="p-6 border-slate-200 shadow-sm space-y-2 md:col-span-2 bg-amber-50">
            <h3 className="font-semibold text-slate-800 text-sm">Observaciones</h3>
            <p className="text-sm text-slate-700 italic">"{formData.observaciones}"</p>
          </Card>
        )}
      </div>

      <div className="flex justify-between pt-6 border-t border-slate-200 mt-6">
        <Button 
          onClick={onPrevious}
          variant="outline"
          className="border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl px-6 py-2"
        >
          <ChevronLeft className="mr-2 w-4 h-4" />
          Volver a editar
        </Button>
        <Button 
          onClick={onSubmit}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8 py-2 shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-1 font-semibold"
        >
          <Check className="mr-2 w-5 h-5" />
          Confirmar y Crear Reserva
        </Button>
      </div>
    </div>
  );
}
