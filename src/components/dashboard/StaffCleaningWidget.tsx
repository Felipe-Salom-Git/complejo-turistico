'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStaff } from '@/contexts/StaffContext';
import { useReservations } from '@/contexts/ReservationsContext';
import { Sparkles, UserCircle } from 'lucide-react';

import { getCleaningTasks } from '@/lib/calendar-logic';
import { Badge } from '@/components/ui/badge'; 

// ... imports

export function StaffCleaningWidget() {
  const { maids } = useStaff();
  const { reservations, finishCleaning } = useReservations();
  
  const workingMaids = maids.filter(m => m.estado === 'trabajando');
  
  // 1. Get explicit cleaning blocks (usually form Check-out or manual) -> "Limpieza Profunda"
  const checkoutCleanings = reservations.filter(r => r.status === 'cleaning');

  // 2. Calculate periodic services for Active reservations -> "Toallas" or "Completo"
  const today = new Date();
  today.setHours(0,0,0,0);
  
  const activeReservations = reservations.filter(r => r.status === 'active');
  const periodicCleanings = activeReservations.flatMap(res => {
      const tasks = getCleaningTasks(res);
      // Filter for today
      return tasks.filter(t => {
          const tDate = new Date(t.date);
          tDate.setHours(0,0,0,0);
          return tDate.getTime() === today.getTime();
      }).map(t => ({
          ...t,
          reservationId: res.id, // Keep ref to parent if needed
          isPeriodic: true
      }));
  });

  // Combine lists? 
  // We can display them together. 
  // Explicit "cleaning" status usually means the room is empty/blocked for cleaning.
  // "Periodic" means the guest is inside, but maid needs to enter.
  
  const allTasks = [
      ...checkoutCleanings.map(r => ({
          id: r.id,
          unit: r.unit,
          type: 'profunda' as const,
          isPeriodic: false
      })),
      ...periodicCleanings.map(t => ({
          id: t.id,
          unit: t.unit,
          type: t.type,
          isPeriodic: true,
          reservationId: t.reservationId
      }))
  ];

  return (
    <Card className="col-span-1 md:col-span-2">
      {/* ... Header ... */}
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ... Maids column ... */}
          
          <div>
            <h4 className="text-sm font-medium mb-3">Tareas de Limpieza</h4>
            <div className="space-y-2 mb-4">
                {allTasks.length === 0 ? (
                    <p className="text-xs text-gray-500 italic">No hay tareas de limpieza para hoy.</p>
                ) : (
                    allTasks.map(task => (
                        <div key={task.id} className="flex items-center justify-between text-sm bg-yellow-50 dark:bg-yellow-900/10 p-2 rounded border border-yellow-100 dark:border-yellow-900">
                             <span className="font-semibold text-yellow-800 dark:text-yellow-600">{task.unit}</span>
                             <div className="flex items-center gap-2">
                                <Badge variant="outline" className={`text-[10px] capitalize ${
                                    task.type === 'toallas' ? 'border-blue-200 bg-blue-50 text-blue-700' :
                                    task.type === 'completo' ? 'border-purple-200 bg-purple-50 text-purple-700' :
                                    'border-orange-200 bg-orange-50 text-orange-700'
                                }`}>
                                    {task.type}
                                </Badge>
                                
                                {task.type === 'profunda' && (
                                    <Button 
                                        size="sm" 
                                        onClick={() => finishCleaning(task.id)}
                                        className="h-6 text-[10px] bg-purple-600 hover:bg-purple-700"
                                    >
                                        Terminar
                                    </Button>
                                )}
                                {/* For periodic tasks, maybe a 'Done' button that just hides it locally? 
                                    Or ideally updates a 'completedTasks' state. 
                                    For now, let's just show them as requested. */}
                             </div>
                        </div>
                    ))
                )}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
               {/* Resumen */}
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
                <span className="block text-2xl font-bold text-purple-600">{checkoutCleanings.length}</span>
                <span className="text-xs text-gray-500">Salidas / Profundas</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
                <span className="block text-2xl font-bold text-blue-500">{periodicCleanings.length}</span>
                <span className="text-xs text-gray-500">Servicios Diarios</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
