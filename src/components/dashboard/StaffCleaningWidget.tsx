'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStaff } from '@/contexts/StaffContext';
import { useReservations } from '@/contexts/ReservationsContext';
import { Sparkles, UserCircle } from 'lucide-react';

export function StaffCleaningWidget() {
  const { maids } = useStaff();
  const { reservations, finishCleaning } = useReservations();
  
  const workingMaids = maids.filter(m => m.estado === 'trabajando');
  const cleaningTasks = reservations.filter(r => r.status === 'cleaning');

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCircle className="w-5 h-5 text-purple-600" />
          Personal y Limpieza
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Mucamas Activas
            </h4>
            <div className="space-y-3">
              {workingMaids.map(maid => (
                <div key={maid.id} className="flex justify-between items-start text-sm border p-2 rounded-lg">
                  <div>
                    <span className="font-medium block">{maid.nombre}</span>
                    <span className="text-xs text-gray-500 bg-green-100 dark:bg-green-900 px-1.5 py-0.5 rounded text-[10px]">
                      {maid.estado}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400 block">Asignaciones</span>
                    <span className="text-xs">
                      {maid.asignaciones.join(', ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-3">Tareas de Limpieza</h4>
            <div className="space-y-2 mb-4">
                {cleaningTasks.length === 0 ? (
                    <p className="text-xs text-gray-500 italic">No hay unidades en limpieza actualmente.</p>
                ) : (
                    cleaningTasks.map(task => (
                        <div key={task.id} className="flex items-center justify-between text-sm bg-yellow-50 dark:bg-yellow-900/10 p-2 rounded border border-yellow-100 dark:border-yellow-900">
                             <span className="font-semibold text-yellow-800 dark:text-yellow-600">{task.unit}</span>
                             <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400">Limpieza Profunda</span>
                                <Button 
                                    size="sm" 
                                    onClick={() => finishCleaning(task.id)}
                                    className="h-6 text-[10px] bg-purple-600 hover:bg-purple-700"
                                >
                                    Terminar
                                </Button>
                             </div>
                        </div>
                    ))
                )}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
               {/* Resumen de unidades con checkout que requieren limpieza */}
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
                <span className="block text-2xl font-bold text-purple-600">{cleaningTasks.length}</span>
                <span className="text-xs text-gray-500">Pendientes</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
                <span className="block text-2xl font-bold text-blue-500">5</span>
                <span className="text-xs text-gray-500">Repasos Diarios</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
