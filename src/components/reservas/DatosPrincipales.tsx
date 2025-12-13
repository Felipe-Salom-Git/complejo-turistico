import { ReservationFormData } from "./types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { UNIT_GROUPS } from "@/contexts/ReservationsContext";

interface DatosPrincipalesProps {
  formData: ReservationFormData;
  updateFormData: (updates: Partial<ReservationFormData>) => void;
  onNext: () => void;
}

export function DatosPrincipales({ formData, updateFormData, onNext }: DatosPrincipalesProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-emerald-900 mb-2 font-semibold text-lg">Información general de la reserva</h2>
        <p className="text-slate-500 text-sm">Complete los datos principales para crear una nueva reserva</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fechaCarga" className="text-slate-700">Fecha de carga</Label>
          <Input
            id="fechaCarga"
            type="date" 
            value={formData.fechaCarga}
            onChange={(e) => updateFormData({ fechaCarga: e.target.value })}
            className="rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
            tabIndex={1}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="responsableCarga" className="text-slate-700">Responsable de carga</Label>
          <Select value={formData.responsableCarga} onValueChange={(value) => updateFormData({ responsableCarga: value })}>
            <SelectTrigger id="responsableCarga" className="rounded-xl border-slate-300 bg-white">
              <SelectValue placeholder="Seleccione responsable" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin Principal</SelectItem>
              <SelectItem value="recepcion">Recepción</SelectItem>
              <SelectItem value="gerencia">Gerencia</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="politicaCancelacion" className="text-slate-700">Política de cancelación</Label>
          <Select value={formData.politicaCancelacion} onValueChange={(value) => updateFormData({ politicaCancelacion: value })}>
            <SelectTrigger id="politicaCancelacion" className="rounded-xl border-slate-300 bg-white">
              <SelectValue placeholder="Seleccione política" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flexible">Flexible (48hs antes)</SelectItem>
              <SelectItem value="moderada">Moderada (7 días antes)</SelectItem>
              <SelectItem value="estricta">Estricta (15 días antes)</SelectItem>
              <SelectItem value="no-reembolsable">No reembolsable</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipoUnidad" className="text-slate-700">Unidad</Label>
          <Select value={formData.tipoUnidad} onValueChange={(value) => updateFormData({ tipoUnidad: value })}>
            <SelectTrigger id="tipoUnidad" className="rounded-xl border-slate-300 bg-white">
              <SelectValue placeholder="Seleccione unidad" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-slate-50">Las Gaviotas</div>
              {Object.entries(UNIT_GROUPS)
                .filter(([key]) => key.startsWith('Unidad Tipo'))
                .flatMap(([type, units]) => units.map(u => ({ unit: u, type })))
                .map(({ unit, type }) => (
                  <SelectItem key={unit} value={unit}>
                    {unit} - {type}
                  </SelectItem>
              ))}
              
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-slate-50 mt-1">La Fontana</div>
              {UNIT_GROUPS['Fontana']?.map((unit) => (
                <SelectItem key={unit} value={unit}>
                   {unit} - Suite/Cabaña
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="observaciones" className="text-slate-700">Observaciones</Label>
          <Textarea
            id="observaciones"
            value={formData.observaciones}
            onChange={(e) => updateFormData({ observaciones: e.target.value })}
            placeholder="Ingrese notas adicionales, requisitos especiales o comentarios sobre la reserva..."
            className="rounded-xl border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 min-h-[100px] bg-white"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          onClick={onNext}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 py-2 shadow-sm transition-all hover:shadow-md"
        >
          Siguiente
          <ChevronRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
