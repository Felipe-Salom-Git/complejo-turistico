'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMaintenance } from '@/contexts/MaintenanceContext';
import { Wrench } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function MaintenanceWidget() {
  const { tickets } = useMaintenance();
  
  const pending = tickets.filter(t => t.estado === 'pendiente' || t.estado === 'en-proceso');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-orange-600" />
          Mantenimiento Activo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pending.length === 0 ? (
            <p className="text-sm text-gray-500">No hay mantenimiento pendiente.</p>
          ) : (
            pending.map(t => (
              <div key={t.id} className="flex flex-col gap-1 border-b pb-2 last:border-0 border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-start">
                  <span className="font-medium text-sm">{t.unidad}</span>
                  <Badge variant={t.prioridad === 'urgente' ? 'destructive' : 'secondary'} className="text-[10px] px-1 py-0 h-5">
                    {t.prioridad}
                  </Badge>
                </div>
                <span className="text-xs text-gray-500 line-clamp-1">{t.problema}</span>
                <span className="text-[10px] text-gray-400 capitalize">{t.estado}</span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
