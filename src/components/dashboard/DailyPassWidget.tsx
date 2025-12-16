'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useHandoff } from '@/contexts/HandoffContext';
import { BookOpen, AlertCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DailyPassWidget() {
  const { entries, toggleComplete } = useHandoff();
  
  // Logic: 
  // - "Turno Anterior": Incomplete tasks from previous shifts? 
  //   For simplicity, let's show ALL pending tasks here that are NOT current shift? 
  //   Or just show logical buckets as requested: "Turno Anterior", "Pendientes", "Tareas Admin"
  
  // Let's interpret user requirements strictly:
  // "Turno Anterior" -> Events not completed from previous shift.
  // "Pendientes" -> Pending tasks of current shift.
  // "Tareas Admin" -> 'admin_request' types.

  const now = new Date();
  const currentHour = now.getHours();
  // Simple shift logic again to match context
  // Mañana 6-14, Tarde 14-22, Noche 22-06
  let currentShift = 'Noche';
  if (currentHour >= 6 && currentHour < 14) currentShift = 'Mañana';
  else if (currentHour >= 14 && currentHour < 22) currentShift = 'Tarde';

  const adminTasks = entries.filter(e => e.type === 'admin_request' && !e.completed);
  
  const pendingCurrentShift = entries.filter(e => 
      e.type === 'pending' && 
      !e.completed && 
      e.shift === currentShift
  );

  const pendingPreviousShifts = entries.filter(e => 
      e.type === 'pending' && 
      !e.completed && 
      e.shift !== currentShift
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          Libro de Novedades
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Tareas Admin */}
        {adminTasks.length > 0 && (
            <div className="bg-red-50 dark:bg-red-950/30 p-2 rounded-md border border-red-100 dark:border-red-900">
                <h4 className="text-xs font-bold text-red-700 flex items-center gap-1 mb-2">
                    <AlertCircle className="w-3 h-3" /> Solicitudes de Admin
                </h4>
                <div className="space-y-2">
                    {adminTasks.map(task => (
                        <div key={task.id} className="flex items-start gap-2 text-xs">
                             <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 mt-0.5"
                                onClick={() => toggleComplete(task.id)}
                            >
                                <Square className="w-3 h-3 text-red-400" />
                            </Button>
                            <div>
                                <span className="font-medium block">{task.title}</span>
                                <span className="text-slate-500">{task.createdBy}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Turno Anterior / Pendientes Viejos */}
        {pendingPreviousShifts.length > 0 && (
            <div>
                <h4 className="text-xs font-semibold text-slate-500 mb-2 uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Turnos Anteriores
                </h4>
                <div className="space-y-2">
                    {pendingPreviousShifts.map(task => (
                        <div key={task.id} className="flex items-center justify-between text-sm py-1 border-b last:border-0 border-slate-100 dark:border-slate-800">
                            <span className="truncate flex-1 pr-2">{task.title}</span>
                            <Badge variant="outline" className="text-[10px] h-5">{task.shift}</Badge>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 ml-1"
                                onClick={() => toggleComplete(task.id)}
                            >
                                <Square className="w-4 h-4 text-slate-400 hover:text-green-600" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Pendientes Turno Actual */}
         <div>
            <h4 className="text-xs font-semibold text-slate-500 mb-2 uppercase flex items-center gap-1">
                <Clock className="w-3 h-3 text-green-600" /> Turno Actual ({currentShift})
            </h4>
            {pendingCurrentShift.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No hay tareas pendientes.</p>
            ) : (
                <div className="space-y-2">
                    {pendingCurrentShift.map(task => (
                        <div key={task.id} className="flex items-center justify-between text-sm py-1 border-b last:border-0 border-slate-100 dark:border-slate-800">
                             <span className="truncate flex-1 pr-2">{task.title}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 ml-1"
                                onClick={() => toggleComplete(task.id)}
                            >
                                <Square className="w-4 h-4 text-slate-400 hover:text-green-600" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>

      </CardContent>
    </Card>
  );
}

