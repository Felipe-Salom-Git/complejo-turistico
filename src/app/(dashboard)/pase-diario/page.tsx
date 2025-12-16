'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Clock, AlertCircle, Wrench, CheckSquare, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useHandoff, HandoffEntry } from '@/contexts/HandoffContext';
import { useAuth } from '@/contexts/AuthContext';
import { AddEntryModal } from '@/components/pase-diario/AddEntryModal';
import { AddTicketModal } from '@/components/maintenance/AddTicketModal';

export default function PaseDiario() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Contexts
  const { entries, toggleComplete } = useHandoff(); // Operational Log
  const { user } = useAuth(); // Auth

  // State
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  
  // Maintenance Modal State (for quick creation from entry)
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [maintenanceFromEntry, setMaintenanceFromEntry] = useState<HandoffEntry | null>(null);

  // --- LOGIC FOR HANDOFF ENTRIES (New) ---
  const pendingCount = entries.filter(e => e.type === 'pending' && !e.completed).length;
  const adminRequestCount = entries.filter(e => e.type === 'admin_request' && !e.completed).length;

  const getEntryBadge = (type: string) => {
    switch (type) {
      case 'info': return <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">ℹ️ Info</Badge>;
      case 'pending': return <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-200">⏳ Pendiente</Badge>;
      case 'admin_request': return <Badge variant="destructive">🛑 Admin</Badge>;
      default: return <Badge>{type}</Badge>;
    }
  };

  const handleCreateMaintenance = (entry: HandoffEntry) => {
      setMaintenanceFromEntry(entry);
      setIsMaintenanceModalOpen(true);
  };

  // Prepare ticket data for modal if creating from entry
  const ticketFromEntry = maintenanceFromEntry ? {
      id: 0, // Mock ID, modal handles new
      unidad: maintenanceFromEntry.unit || '',
      problema: maintenanceFromEntry.title,
      descripcion: `Generado desde Pase Diario: ${maintenanceFromEntry.description}`,
      tipo: 'correctivo' as const,
      prioridad: 'media' as const,
      estado: 'pendiente' as const,
      fecha: new Date().toISOString().split('T')[0],
      asignado: ''
  } : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Libro de Novedades</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Registro operativo de turnos y tareas pendientes
          </p>
        </div>
        <div className="flex items-center gap-2">
             <div className="text-sm text-right mr-4 hidden md:block">
                 <p className="font-semibold">{user?.name}</p>
                 <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
             </div>
             <Button onClick={() => setIsEntryModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Entrada
            </Button>
        </div>
      </div>

       {/* Shift Buckets */}
       <div className="space-y-6">
            {['Mañana', 'Tarde', 'Noche'].map(shift => {
                const shiftEntries = entries.filter(e => e.shift === shift);
                if (shiftEntries.length === 0) return null;

                return (
                    <Card key={shift}>
                        <CardHeader className="py-3 bg-slate-50 dark:bg-slate-900 border-b">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                <Clock className="w-4 h-4" /> Turno {shift}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">Hecho</TableHead>
                                        <TableHead className="w-[120px]">Tipo</TableHead>
                                        <TableHead>Evento</TableHead>
                                        <TableHead className="w-[150px]">Unidad</TableHead>
                                        <TableHead className="w-[150px]">Autor</TableHead>
                                        <TableHead className="w-[150px]">Hora</TableHead>
                                        <TableHead className="w-[100px] text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {shiftEntries.map(entry => (
                                        <TableRow key={entry.id} className={entry.completed ? 'bg-slate-50/50 opacity-60' : ''}>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => toggleComplete(entry.id)}
                                                >
                                                    {entry.completed ?
                                                        <CheckSquare className="w-5 h-5 text-green-600" /> :
                                                        <Square className="w-5 h-5 text-gray-400" />
                                                    }
                                                </Button>
                                            </TableCell>
                                            <TableCell>{getEntryBadge(entry.type)}</TableCell>
                                            <TableCell>
                                                <div className="font-medium">{entry.title}</div>
                                                <div className="text-xs text-muted-foreground line-clamp-1">{entry.description}</div>
                                            </TableCell>
                                            <TableCell>
                                                {entry.unit && <Badge variant="outline">{entry.unit}</Badge>}
                                            </TableCell>
                                            <TableCell className="text-xs">{entry.createdBy}</TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {new Date(entry.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {entry.ticketId ? (
                                                    <Link href="/mantenimiento">
                                                        <Badge variant="outline" className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 gap-1">
                                                            <Wrench className="w-3 h-3 text-orange-500" />
                                                            #{entry.ticketId}
                                                        </Badge>
                                                    </Link>
                                                ) : (
                                                    <Button 
                                                        size="sm" 
                                                        variant="ghost" 
                                                        title="Crear Ticket Mantenimiento"
                                                        onClick={() => handleCreateMaintenance(entry)}
                                                    >
                                                        <Wrench className="w-4 h-4 text-gray-400 hover:text-orange-500 transition-colors" />
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                );
            })}
             {entries.length === 0 && <div className="text-center py-10 text-gray-400">No hay novedades registradas hoy.</div>}
       </div>

      {/* Modals */}
      <AddEntryModal 
        isOpen={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
      />

      <AddTicketModal
        isOpen={isMaintenanceModalOpen}
        onClose={() => setIsMaintenanceModalOpen(false)}
        ticketToEdit={ticketFromEntry} 
      />
    </div>
  );
}
