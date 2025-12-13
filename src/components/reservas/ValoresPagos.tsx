import { ReservationFormData } from "./types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, DollarSign, Wallet } from "lucide-react";
import { useEffect } from "react";

interface ValoresPagosProps {
  formData: ReservationFormData;
  updateFormData: (updates: Partial<ReservationFormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function ValoresPagos({ formData, updateFormData, onNext, onPrevious }: ValoresPagosProps) {
  
  // Calcular total automáticamente basado en noches y valor USD
  useEffect(() => {
    if (formData.checkIn && formData.checkOut && formData.valorNocheUSD) {
      const inicio = new Date(formData.checkIn);
      const fin = new Date(formData.checkOut);
      const diff = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
      const noches = diff > 0 ? diff : 0;
      
      // Aquí podrías calcular un total si quisieras guardarlo
      // const total = noches * parseFloat(formData.valorNocheUSD || "0");
    }
  }, [formData.checkIn, formData.checkOut, formData.valorNocheUSD]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-emerald-900 mb-2 font-semibold text-lg">Valores y pagos</h2>
        <p className="text-slate-500 text-sm">Configure los montos, moneda y detalles del pago</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sección de Valores */}
        <div className="bg-slate-50 rounded-2xl p-6 space-y-6 border border-slate-200 shadow-sm md:col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <h3 className="text-slate-800 font-medium">Valores de la estadía</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="moneda" className="text-slate-700">Moneda principal</Label>
              <Select value={formData.moneda} onValueChange={(value) => updateFormData({ moneda: value })}>
                <SelectTrigger id="moneda" className="rounded-xl border-slate-300 bg-white">
                  <SelectValue placeholder="Seleccione moneda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">Dólar Estadounidense (USD)</SelectItem>
                  <SelectItem value="ARS">Peso Argentino (ARS)</SelectItem>
                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  <SelectItem value="BRL">Real Brasileño (BRL)</SelectItem>
                  <SelectItem value="UYU">Peso Uruguayo (UYU)</SelectItem>
                  <SelectItem value="CLP">Peso Chileno (CLP)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="valorNocheUSD" className="text-slate-700">Valor por noche (USD)</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                <Input
                  id="valorNocheUSD"
                  type="number"
                  min="0"
                  value={formData.valorNocheUSD}
                  onChange={(e) => updateFormData({ valorNocheUSD: e.target.value })}
                  className="pl-8 rounded-xl border-slate-300 bg-white focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="valorNocheARS" className="text-slate-700">Valor por noche (ARS - Opcional)</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                <Input
                  id="valorNocheARS"
                  type="number"
                  min="0"
                  value={formData.valorNocheARS}
                  onChange={(e) => updateFormData({ valorNocheARS: e.target.value })}
                  className="pl-8 rounded-xl border-slate-300 bg-white focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
               <Label htmlFor="cotizacionDolar" className="text-slate-700">Cotización Dólar</Label>
               <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                  <Input
                    id="cotizacionDolar"
                    type="number"
                    value={formData.cotizacionDolar || ''}
                    onChange={(e) => updateFormData({ cotizacionDolar: parseFloat(e.target.value) || 0 })}
                    className="pl-8 rounded-xl border-slate-300 bg-white"
                  />
               </div>
               <div className="text-[10px] text-blue-600 mt-1 flex items-center gap-1">
                  <span className="font-bold">BNA:</span> Obtenido automáticamente
               </div>
            </div>
          </div>
        </div>

        {/* Sección de Pagos */}
        <div className="bg-slate-50 rounded-2xl p-6 space-y-6 border border-slate-200 shadow-sm md:col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5 text-emerald-600" />
            <h3 className="text-slate-800 font-medium">Detalles del pago inicial</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="conceptoPago" className="text-slate-700">Concepto</Label>
              <Select value={formData.conceptoPago} onValueChange={(value) => updateFormData({ conceptoPago: value })}>
                <SelectTrigger id="conceptoPago" className="rounded-xl border-slate-300 bg-white">
                  <SelectValue placeholder="Seleccione concepto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seña">Seña / Reserva</SelectItem>
                  <SelectItem value="total">Pago Total</SelectItem>
                  <SelectItem value="extra">Servicio Extra</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="formaPago" className="text-slate-700">Forma de pago</Label>
              <Select value={formData.formaPago} onValueChange={(value) => updateFormData({ formaPago: value })}>
                <SelectTrigger id="formaPago" className="rounded-xl border-slate-300 bg-white">
                  <SelectValue placeholder="Seleccione forma de pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="efectivo">Efectivo</SelectItem>
                  <SelectItem value="transferencia">Transferencia Bancaria</SelectItem>
                  <SelectItem value="tarjeta_credito">Tarjeta de Crédito</SelectItem>
                  <SelectItem value="tarjeta_debito">Tarjeta de Débito</SelectItem>
                  <SelectItem value="mercado_pago">Mercado Pago</SelectItem>
                  <SelectItem value="crypto">Criptomonedas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cuentaDestino" className="text-slate-700">Cuenta de destino</Label>
              <Select value={formData.cuentaDestino} onValueChange={(value) => updateFormData({ cuentaDestino: value })}>
                <SelectTrigger id="cuentaDestino" className="rounded-xl border-slate-300 bg-white">
                  <SelectValue placeholder="Seleccione cuenta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="banco_galicia">Banco Galicia</SelectItem>
                  <SelectItem value="banco_santander">Banco Santander</SelectItem>
                  <SelectItem value="mercado_pago_cvu">Mercado Pago CVU</SelectItem>
                  <SelectItem value="caja_chica">Caja Chica (Efectivo)</SelectItem>
                  <SelectItem value="usd_cash">Caja USD (Efectivo)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="montoPagado" className="text-slate-700">Monto abonado</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                <Input
                  id="montoPagado"
                  type="number"
                  min="0"
                  value={formData.montoPagado}
                  onChange={(e) => updateFormData({ montoPagado: e.target.value })}
                  className="pl-8 rounded-xl border-slate-300 bg-white focus:border-emerald-500 focus:ring-emerald-500 font-semibold text-emerald-700"
                  placeholder="0.00"
                />
              </div>
            </div>
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
