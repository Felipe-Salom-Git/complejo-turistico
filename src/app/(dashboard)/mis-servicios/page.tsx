'use client';

import React, { useState } from 'react';
import { ClipboardList, AlertCircle, Bell } from 'lucide-react';
import { useServices } from '@/contexts/ServicesContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationsContext';
import { TaskItem } from '@/components/services/TaskItem';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { PushManager } from '@/components/notifications/PushManager';
import { InstallPWA } from '@/components/InstallPWA';

export default function MisServiciosPage() {
    const { tasks, completeTask, updateObservation } = useServices();
    const { user } = useAuth();
    const { unreadCount, notifications, markAllAsRead } = useNotifications();

    // Filter tasks for logged in maid
    // For demo purposes, we will fallback to a default ID if user.staffId is missing (or use '1' for Marta)
    // In production, user.staffId MUST be present.
    const myTasks = tasks.filter(t => t.mucamaId === (user?.staffId || '1'));

    const pendingTasks = myTasks.filter(t => t.estado === 'pendiente');
    // const completedTasks = myTasks.filter(t => t.estado === 'completado'); // This variable is no longer used

    const handleObservationChange = (taskId: string, newValue: string) => {
        updateObservation(taskId, newValue);
    };

    const myNotifications = notifications.filter(n => n.userId === (user?.staffId || '1'));
    const badgeCount = unreadCount(user?.staffId || '1');

    // DEV MODE: Allow access to everyone and treat as 'Marta' (ID 1)
    /*
    if (user?.role !== 'mucama' && user?.role !== 'admin') {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center p-4">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-xl font-bold">Acceso Restringido</h2>
                <p className="text-gray-500">Esta sección es exclusiva para personal de limpieza.</p>
            </div>
        );
    }
    
    // Warn if no staffId
    if (!user?.staffId && user?.role !== 'admin') {
         return (
             <div className="p-4 bg-yellow-50 text-yellow-800 rounded">
                 ⚠️ Tu usuario no está vinculado a un perfil de personal (staffId). Mostrando tareas de demostración (ID: 1).
             </div>
         );
    }
    */

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-100 rounded-full text-indigo-700">
                        <ClipboardList className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Mis Servicios</h1>
                        <p className="text-gray-500">Hola {user?.name}, tienes {pendingTasks.length} tareas pendientes.</p>
                        <div className="mt-2 flex gap-2">
                            <PushManager />
                            <InstallPWA />
                        </div>
                    </div>
                </div>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="w-6 h-6 text-gray-600" />
                            {badgeCount > 0 && (
                                <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0" align="end">
                        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                            <h4 className="font-semibold text-sm">Notificaciones</h4>
                            {badgeCount > 0 && (
                                <button onClick={() => markAllAsRead(user?.staffId || '1')} className="text-xs text-indigo-600 hover:underline">
                                    Marcar leídas
                                </button>
                            )}
                        </div>
                        <ScrollArea className="h-[300px]">
                            {myNotifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-400 text-sm">
                                    No tienes notificaciones
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {myNotifications.map(notif => (
                                        <div key={notif.id} className={`p-4 hover:bg-slate-50 ${!notif.read ? 'bg-blue-50/50' : ''}`}>
                                            <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                                            <p className="text-xs text-gray-500 mt-1">{notif.message}</p>
                                            <p className="text-[10px] text-gray-400 mt-2 text-right">
                                                {new Date(notif.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Empty State */}
            {myTasks.length === 0 && (
                <div className="text-center py-10 text-gray-400 bg-slate-50 rounded-lg border border-dashed">
                    No tienes tareas asignadas por el momento.
                </div>
            )}

            <div className="space-y-4">
                {myTasks.map(task => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={() => completeTask(task.id, task.estado !== 'completado')}
                        onObservationChange={(val) => handleObservationChange(task.id, val)}
                    />
                ))}
            </div>
        </div>
    );
}
