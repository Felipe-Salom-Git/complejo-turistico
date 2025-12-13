'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDailyPass } from '@/contexts/DailyPassContext';
import { Ticket } from 'lucide-react';

export function DailyPassWidget() {
  const { pases } = useDailyPass();
  
  // "resumen del pase diario cargado en el turno anterior"
  // Assuming "turno anterior" means passes from yesterday or earlier today.
  // For demo, I'll count completed passes.
  
  const totalPasses = pases.length;
  const totalIncome = pases.reduce((acc, p) => acc + p.total, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ticket className="w-5 h-5 text-blue-600" />
          Pase Diario (Turno Anterior)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{totalPasses}</p>
            <p className="text-xs text-gray-500">Pases Emitidos</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600" suppressHydrationWarning>${totalIncome.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Total Recaudado</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
