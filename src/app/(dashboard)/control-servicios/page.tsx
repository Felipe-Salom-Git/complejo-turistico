'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ClipboardList, ShieldAlert } from 'lucide-react';
import { useServices } from '@/contexts/ServicesContext';
import { useStaff } from '@/contexts/StaffContext';
import { TaskItem } from '@/components/services/TaskItem';

export default function ControlServiciosPage() {
    const { tasks, completeTask, updateObservation } = useServices();
    const { maids } = useStaff();

    const getTasksByMaid = (maidId: string) => {
        return tasks.filter(t => t.mucamaId === maidId);
    };

    const handleObservationChange = (taskId: string, newValue: string) => {
        updateObservation(taskId, newValue);
    };

    // Use first maid as default
    const defaultTab = maids.length > 0 ? maids[0].id.toString() : '';

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-100 rounded-full text-purple-700">
                        <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Control de Servicios</h1>
                        <p className="text-gray-500">Vista de desarrollador / tester</p>
                    </div>
                </div>
            </div>

            {maids.length === 0 ? (
                <div className="text-center py-10 text-gray-400">No hay personal registrado.</div>
            ) : (
                <Tabs defaultValue={defaultTab} className="w-full">
                    <div className="relative">
                        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                            <TabsList className="w-full justify-start p-0 h-auto bg-transparent">
                                {maids.map(maid => (
                                    <TabsTrigger
                                        key={maid.id}
                                        value={maid.id.toString()}
                                        className="px-6 py-3 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:border-b-2 data-[state=active]:border-purple-600 rounded-none bg-white"
                                    >
                                        {maid.nombre}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </div>

                    {maids.map(maid => {
                        const maidTasks = getTasksByMaid(maid.id.toString());
                        const pendingCount = maidTasks.filter(t => t.estado === 'pendiente').length;

                        return (
                            <TabsContent key={maid.id} value={maid.id.toString()} className="space-y-4 pt-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold text-gray-700">
                                        Lista de Tareas ({pendingCount} pendientes)
                                    </h2>
                                </div>

                                {maidTasks.length === 0 && (
                                    <div className="text-center py-8 text-gray-400 bg-slate-50 border border-dashed rounded-lg">
                                        Sin tareas asignadas
                                    </div>
                                )}

                                {maidTasks.map(task => (
                                    <TaskItem
                                        key={task.id}
                                        task={task}
                                        onToggle={() => completeTask(task.id, task.estado !== 'completado')}
                                        onObservationChange={(val) => handleObservationChange(task.id, val)}
                                    />
                                ))}
                            </TabsContent>
                        );
                    })}
                </Tabs>
            )}
        </div>
    );
}
