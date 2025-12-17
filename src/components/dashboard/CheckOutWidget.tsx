'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useReservations } from '@/contexts/ReservationsContext';
import { LogOut } from 'lucide-react';

import { useMaintenance } from '@/contexts/MaintenanceContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wrench } from 'lucide-react';

export function CheckOutWidget() {
  const { reservations, checkOut } = useReservations();
  const { tickets } = useMaintenance();
  
  // Mock today as end of range for consistency with context mock if needed, or real today
  const today = new Date();
  const todayStr = today.toLocaleDateString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-');
  
  // 1. Filter Reservations checking out Today AND not already in cleaning (or done)
  // "Salidas" usually means "Pending Checkout" or "Just processed". 
  // User request: Don't show "limpieza" here.
  const reservationCheckOuts = reservations.filter(r => {
    const d = new Date(r.checkOut);
    const isToday = d.toISOString().split('T')[0] === todayStr;
    // Hide if already 'cleaning' (moved to Cleaning Widget) or 'checkout' (Fully done?)
    // User specifically mentioned "limpieza".
    return isToday && r.status !== 'cleaning' && r.status !== 'checkout'; 
  });

  // 2. Filter Maintenance ending Today
  const maintenanceEnds = tickets.filter(t => {
     if (!t.fechaFin) return false;
     // Allow string comparison if format matches YYYY-MM-DD
     return t.fechaFin === todayStr;
  });

  // 3. Combine
  const combinedItems = [
      ...reservationCheckOuts.map(r => ({
          id: r.id,
          unit: r.unit,
          label: r.guestName,
          type: 'reservation' as const,
          status: r.status,
          raw: r
      })),
      ...maintenanceEnds.map(t => ({
          id: `m-${t.id}`,
          unit: t.unidad,
          label: t.problema,
          type: 'maintenance' as const,
          status: t.estado,
          raw: t
      }))
  ];

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LogOut className="w-5 h-5 text-red-600" />
          Salidas del Día
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-center mb-4">
            <span className="text-3xl font-bold">{combinedItems.length}</span>
            <span className="text-sm text-gray-500 ml-2">Unidades</span>
          </div>
          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
            {combinedItems.length === 0 ? (
                <p className="text-xs text-center text-gray-500 italic">No hay salidas programadas.</p>
            ) : (
                combinedItems.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-lg group">
                    <div className="flex flex-col max-w-[65%]">
                        <span className="font-medium truncate">{item.unit}</span>
                        <div className="flex items-center gap-1 text-gray-500 text-xs truncate">
                            {item.type === 'maintenance' && <Wrench className="w-3 h-3 text-orange-500" />}
                            <span className="truncate">{item.label}</span>
                        </div>
                    </div>
                    
                    {item.type === 'reservation' ? (
                        item.status === 'cleaning' ? (
                            <Badge variant="secondary" className="text-[10px] bg-yellow-100 text-yellow-800">En Limpieza</Badge>
                        ) : item.status === 'checkout' ? (
                            <Badge variant="outline" className="text-[10px]">Finalizado</Badge>
                        ) : (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                    variant="destructive" 
                                    size="sm" 
                                    className="h-7 text-xs"
                                    onClick={() => checkOut(item.id)}
                                >
                                    Salida
                                </Button>
                            </div>
                        )
                    ) : (
                         <Badge variant="outline" className="text-[10px] border-orange-200 text-orange-600 bg-orange-50">
                             Mantenimiento
                         </Badge>
                    )}
                </div>
                ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
