'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useStaff } from '@/contexts/StaffContext';
import { INVENTORY } from '@/contexts/ReservationsContext';
import { useServices, ServiceType } from '@/contexts/ServicesContext';
import { useAuth } from '@/contexts/AuthContext';
import { generateRandomTask, getRandomElement } from '@/lib/magic-data';
import { Wand2 } from 'lucide-react';

interface AddServiceTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultUnit?: string;
}

export function AddServiceTaskModal({ isOpen, onClose, defaultUnit }: AddServiceTaskModalProps) {
    const { maids } = useStaff();
    const { addTask } = useServices();
    const { user } = useAuth();

    // Form State
    const [selectedMaid, setSelectedMaid] = useState('');
    const [selectedUnit, setSelectedUnit] = useState<string>(defaultUnit || 'none');
    const [selectedCommonSpace, setSelectedCommonSpace] = useState<string>('none');

    // Effect to update if prop changes
    React.useEffect(() => {
        if (isOpen && defaultUnit) {
            setSelectedUnit(defaultUnit);
            setSelectedCommonSpace('none');
        }
    }, [isOpen, defaultUnit]);
    const [serviceType, setServiceType] = useState<ServiceType>('Servicio completo' as ServiceType);
    const [passengers, setPassengers] = useState('');
    const [extraTask, setExtraTask] = useState('');
    const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);

    const COMMON_SPACES = ['Quincho', 'Escaleras', 'Pasillos', 'Estacionamiento'];

    const handleUnitChange = (val: string) => {
        setSelectedUnit(val);
        if (val !== 'none') {
            setSelectedCommonSpace('none');
        }
    };

    const handleMagicFill = () => {
        const random = generateRandomTask();
        // Pick random maid
        if (maids.length > 0) {
            setSelectedMaid(getRandomElement(maids).id.toString());
        }
        setSelectedUnit(random.unit);
        setExtraTask(random.task);
        if (random.priority === 'alta') setServiceType('Check-out'); // Just some variety
    };

    const handleCommonSpaceChange = (val: string) => {
        setSelectedCommonSpace(val);
        if (val !== 'none') {
            setSelectedUnit('none');
        }
    };

    const handleSubmit = () => {
        if (!selectedMaid) {
            alert('Debe asignar una mucama.');
            return;
        }

        if (selectedUnit === 'none' && selectedCommonSpace === 'none') {
            // It's allowed to have neither? Original code allowed implicit "none". 
            // But if specific task needs location, user should select.
            // Let's allow it as optional as per original req ("Unidad no obligatoria").
        }

        addTask({
            mucamaId: selectedMaid,
            unidadId: selectedUnit === 'none' ? undefined : selectedUnit,
            espacioComun: selectedCommonSpace === 'none' ? undefined : selectedCommonSpace,
            tipoServicio: serviceType,
            cantidadPasajeros: (serviceType === 'Check-in' || serviceType === 'Out + In') ? parseInt(passengers) || undefined : undefined,
            descripcionExtra: extraTask,
            fechaProgramada: scheduledDate,
            creadaPor: user?.name || 'Admin',
        });

        // Reset
        setSelectedMaid('');
        setSelectedUnit('none');
        setSelectedCommonSpace('none');
        setServiceType('Servicio completo' as ServiceType);
        setPassengers('');
        setExtraTask('');
        setScheduledDate(new Date().toISOString().split('T')[0]);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Nueva Tarea de Servicio</DialogTitle>
                    <DialogDescription>Asignar tarea a personal de limpieza</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Mucama Selector */}
                    <div className="space-y-2">
                        <Label>Mucama Asignada</Label>
                        <Select value={selectedMaid} onValueChange={setSelectedMaid}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar personal..." />
                            </SelectTrigger>
                            <SelectContent>
                                {maids.map(maid => (
                                    <SelectItem key={maid.id} value={maid.id.toString()}>
                                        {maid.nombre} {maid.estado !== 'trabajando' ? '(Ausente/Descanso)' : ''}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Unit Selector */}
                        <div className="space-y-2">
                            <Label>Unidad</Label>
                            <Select value={selectedUnit} onValueChange={handleUnitChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="-- Ninguna --" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[200px]">
                                    <SelectItem value="none">-- Ninguna --</SelectItem>
                                    {INVENTORY.map(unit => (
                                        <SelectItem key={unit} value={unit}>
                                            {unit}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Common Space Selector */}
                        <div className="space-y-2">
                            <Label>Espacios Comunes</Label>
                            <Select value={selectedCommonSpace} onValueChange={handleCommonSpaceChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="-- Ninguno --" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">-- Ninguno --</SelectItem>
                                    {COMMON_SPACES.map(space => (
                                        <SelectItem key={space} value={space}>
                                            {space}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Scheduled Date */}
                    <div className="space-y-2">
                        <Label>Fecha Programada</Label>
                        <Input
                            type="date"
                            value={scheduledDate}
                            onChange={(e) => setScheduledDate(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Tipo de Servicio</Label>
                        <Select value={serviceType} onValueChange={(v) => setServiceType(v as ServiceType)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Check-out">Check-out</SelectItem>
                                <SelectItem value="Check-in">Check-in</SelectItem>
                                <SelectItem value="Out + In">Out + In</SelectItem>
                                <SelectItem value="Servicio de toallas">Servicio de toallas</SelectItem>
                                <SelectItem value="Servicio completo">Servicio completo</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Passengers (Conditional) */}
                    {(serviceType === 'Check-in' || serviceType === 'Out + In') && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                            <Label>Cantidad de Pasajeros</Label>
                            <Input
                                type="number"
                                value={passengers}
                                onChange={(e) => setPassengers(e.target.value)}
                                placeholder="Ej. 4"
                            />
                        </div>
                    )}

                    {/* Extra Description */}
                    <div className="space-y-2">
                        <Label>Instrucciones Adicionales</Label>
                        <Textarea
                            value={extraTask}
                            onChange={(e) => setExtraTask(e.target.value)}
                            placeholder="Detalles específicos de la tarea..."
                        />
                    </div>

                </div>

                <DialogFooter>
                    <div className="flex-1 flex justify-start">
                        <Button type="button" variant="ghost" size="sm" onClick={handleMagicFill} className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                            <Wand2 className="w-3 h-3 mr-1" /> Autocompletar
                        </Button>
                    </div>
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSubmit}>Asignar Tarea</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
