'use client';

import React, { useState } from 'react';
import { CheckSquare, Square } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ServiceTask } from '@/contexts/ServicesContext';

interface TaskItemProps {
    task: ServiceTask;
    onToggle: () => void;
    onObservationChange: (v: string) => void;
}

export function TaskItem({ task, onToggle, onObservationChange }: TaskItemProps) {
    const isCompleted = task.estado === 'completado';
    const [obs, setObs] = useState(task.observacionMucama || '');

    const handleBlur = () => {
        if (obs !== task.observacionMucama) {
            onObservationChange(obs);
        }
    };

    return (
        <Card className={`transition-all ${isCompleted ? 'bg-slate-50 border-slate-100 opacity-75' : 'bg-white shadow-sm border-l-4 border-l-indigo-500'}`}>
            <CardContent className="p-4 flex flex-col gap-3">
                <div className="flex items-start gap-3">
                    <button onClick={onToggle} className="mt-1 flex-shrink-0 text-gray-400 hover:text-indigo-600 transition-colors">
                        {isCompleted ? <CheckSquare className="w-6 h-6 text-green-600" /> : <Square className="w-6 h-6" />}
                    </button>

                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className={`font-semibold text-lg ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                    {task.tipoServicio}
                                </h3>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {task.unidadId && <Badge variant="secondary" className="bg-slate-200 text-slate-800">{task.unidadId}</Badge>}
                                    {task.espacioComun && <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">{task.espacioComun}</Badge>}
                                    {task.cantidadPasajeros && <Badge variant="outline">{task.cantidadPasajeros} Pax</Badge>}
                                </div>
                            </div>
                            <span className="text-xs text-gray-400">
                                {new Date(task.fechaCreacion).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>

                        {task.descripcionExtra && (
                            <p className="text-gray-600 text-sm mt-2 bg-yellow-50 p-2 rounded border border-yellow-100 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-300">
                                📝 {task.descripcionExtra}
                            </p>
                        )}
                    </div>
                </div>

                <div className="ml-9">
                    <Input
                        placeholder="Añadir observación (opcional)..."
                        className="text-sm bg-transparent border-t-0 border-x-0 border-b border-gray-200 rounded-none focus:ring-0 px-0 h-8 font-light italic text-gray-600"
                        value={obs}
                        onChange={(e) => setObs(e.target.value)}
                        onBlur={handleBlur}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
