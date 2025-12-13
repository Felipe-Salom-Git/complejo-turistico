'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useReservations } from '@/contexts/ReservationsContext';
import { LogOut } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function CheckOutWidget() {
  const { reservations, checkOut } = useReservations();
  
  // Mock today as end of range for consistency with context mock
  const today = new Date();
  
  const checkOuts = reservations.filter(r => 
    new Date(r.checkOut).toDateString() === today.toDateString()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LogOut className="w-5 h-5 text-red-600" />
          Salidas del Día
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-center mb-4">
            <span className="text-3xl font-bold">{checkOuts.length}</span>
            <span className="text-sm text-gray-500 ml-2">Unidades</span>
          </div>
          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
            {checkOuts.map(res => (
              <div key={res.id} className="flex justify-between items-center text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-lg group">
                <div className="flex flex-col">
                    <span className="font-medium">{res.unit}</span>
                    <span className="text-gray-500 text-xs">{res.guestName}</span>
                </div>
                {res.status === 'cleaning' ? (
                     <Badge variant="secondary" className="text-[10px] bg-yellow-100 text-yellow-800">En Limpieza</Badge>
                ) : res.status === 'checkout' ? (
                     <Badge variant="outline" className="text-[10px]">Finalizado</Badge>
                ) : (
                     <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                            variant="destructive" 
                            size="sm" 
                            className="h-7 text-xs"
                            onClick={() => checkOut(res.id)}
                        >
                            Salida
                        </Button>
                     </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
