'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMaintenance } from '@/contexts/MaintenanceContext';
import { Wrench } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function MaintenanceWidget() {
  const { tickets } = useMaintenance();

  const pending = tickets.filter(t => t.estado === 'pendiente');
  const inProcess = tickets.filter(t => t.estado === 'en-proceso');
  const activeCount = pending.length + inProcess.length;

  // Alerts
  const now = new Date();
  const overdueStart = pending.filter(t => new Date(t.fechaInicio || t.fecha) <= now);
  const overdueEnd = tickets.filter(t => t.estado !== 'completado' && t.fechaFin && new Date(t.fechaFin) < now);

  const alerts = [
    ...overdueStart.map(t => ({ ...t, alertType: 'Not Started' })),
    ...overdueEnd.map(t => ({ ...t, alertType: 'Overdue' }))
  ].filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i); // Deduplicate

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-orange-600" />
            <span className="text-base">Mantenimiento</span>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">{pending.length} Pend</Badge>
            <Badge variant="outline" className="text-xs border-blue-200 bg-blue-50 text-blue-700">{inProcess.length} Curso</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">

          {/* Alerts Section */}
          {alerts.length > 0 && (
            <div className="bg-red-50 border border-red-100 rounded-md p-2 mb-3">
              <h4 className="text-xs font-bold text-red-800 mb-1 flex items-center gap-1">
                ⚠️ Alertas ({alerts.length})
              </h4>
              <div className="space-y-1">
                {alerts.slice(0, 3).map(t => (
                  <div key={t.id} className="text-[10px] text-red-700 flex justify-between">
                    <span>{t.unidad}: {t.problema}</span>
                    <span className="font-semibold">{t.alertType === 'Overdue' ? 'Vencido' : 'Retrasado'}</span>
                  </div>
                ))}
                {alerts.length > 3 && <div className="text-[10px] text-red-500 text-center">... y {alerts.length - 3} más</div>}
              </div>
            </div>
          )}

          {activeCount === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Todo en orden ✅</p>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-semibold">Últimos Activos</p>
              {[...inProcess, ...pending].slice(0, 4).map(t => (
                <div key={t.id} className="flex flex-col gap-1 border-b pb-2 last:border-0 border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-sm flex items-center gap-1">
                      {t.unidad}
                      {t.blocksAvailability && <span title="Bloquea disponibilidad" className="text-[10px]">⛔</span>}
                    </span>
                    <Badge variant={t.prioridad === 'urgente' ? 'destructive' : 'secondary'} className="text-[10px] px-1 py-0 h-4 min-h-0">
                      {t.prioridad}
                    </Badge>
                  </div>
                  <span className="text-xs text-gray-500 line-clamp-1">{t.problema}</span>
                  <div className="flex justify-between items-center mt-1">
                    <span className={`text-[10px] uppercase font-bold ${t.estado === 'en-proceso' ? 'text-blue-600' : 'text-orange-600'}`}>
                      {t.estado}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {(() => {
                        const parseLocal = (dStr: string | Date | undefined) => {
                          if (!dStr) return new Date();
                          const s = dStr.toString().split('T')[0];
                          const [y, m, d] = s.split('-').map(Number);
                          return new Date(y, m - 1, d);
                        };
                        const start = parseLocal(t.fechaInicio || t.fecha);
                        const end = t.fechaFin ? parseLocal(t.fechaFin) : new Date(start);
                        const checkout = new Date(end);
                        checkout.setDate(checkout.getDate() + 1);

                        return `${start.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })} - ${checkout.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })}`;
                      })()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
