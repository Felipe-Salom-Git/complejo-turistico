'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ServiceType = 'Check-out' | 'Check-in' | 'Out + In' | 'Servicio de toallas' | 'Servicio completo';

export interface ServiceTask {
    id: string;
    mucamaId: string; // Links to StaffContext Maid ID
    unidadId?: string;
    espacioComun?: string;
    tipoServicio: ServiceType;
    cantidadPasajeros?: number;
    descripcionExtra?: string;
    estado: 'pendiente' | 'completado';
    esUrgente?: boolean;
    fechaCompletado?: string;
    fechaProgramada?: string; // YYYY-MM-DD
    observacionMucama?: string;
    fechaCreacion: string;
    creadaPor: string;
}

interface ServicesContextType {
    tasks: ServiceTask[];
    addTask: (task: Omit<ServiceTask, 'id' | 'fechaCreacion' | 'estado' | 'fechaCompletado'>) => void;
    completeTask: (id: string, completed: boolean) => void;
    updateObservation: (id: string, observation: string) => void;
    clearAllTasks: () => void;
}

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

import { useNotifications } from '@/contexts/NotificationsContext';

export function ServicesProvider({ children }: { children: React.ReactNode }) {
    const [tasks, setTasks] = useState<ServiceTask[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const { notify } = useNotifications();

    // ... (rest of useEffects)

    const addTask = (taskData: Omit<ServiceTask, 'id' | 'fechaCreacion' | 'estado' | 'fechaCompletado'>) => {
        const newTask: ServiceTask = {
            ...taskData,
            id: `task-${Date.now()}`,
            fechaCreacion: new Date().toISOString(),
            estado: 'pendiente'
        };
        setTasks(prev => [newTask, ...prev]);

        // Notify Mucama (In-App)
        notify(
            newTask.mucamaId,
            newTask.esUrgente ? '🔴 ¡TAREA URGENTE!' : 'Nueva Tarea Asignada',
            `${newTask.esUrgente ? 'URGENTE: ' : ''}${newTask.tipoServicio} ${newTask.unidadId ? 'en ' + newTask.unidadId : ''}`,
            'servicios'
        );

        // Notify Mucama (Push)
        fetch('/api/push/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: newTask.mucamaId,
                title: newTask.esUrgente ? '🔴 ¡TAREA URGENTE!' : 'Nueva Tarea Asignada',
                body: `${newTask.tipoServicio} - ${newTask.unidadId || newTask.espacioComun || 'Ubicación pendiente'}`,
                urgent: newTask.esUrgente
            })
        }).catch(err => console.error('Push trigger error:', err));
    };

    const completeTask = (id: string, completed: boolean) => {
        setTasks(prev => prev.map(t =>
            t.id === id
                ? {
                    ...t,
                    estado: completed ? 'completado' : 'pendiente',
                    fechaCompletado: completed ? new Date().toISOString() : undefined
                }
                : t
        ));
    };

    const updateObservation = (id: string, observation: string) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, observacionMucama: observation } : t));
    };

    const clearAllTasks = () => {
        setTasks([]);
    };

    return (
        <ServicesContext.Provider value={{ tasks, addTask, completeTask, updateObservation, clearAllTasks }}>
            {children}
        </ServicesContext.Provider>
    );
}

export function useServices() {
    const context = useContext(ServicesContext);
    if (context === undefined) {
        throw new Error('useServices must be used within a ServicesProvider');
    }
    return context;
}
