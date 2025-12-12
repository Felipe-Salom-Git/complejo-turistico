'use client';

import React, { useState } from 'react';
import { ClipboardList, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MetricCard } from '@/components/MetricCard';
import { UserCheck, Users } from 'lucide-react';

export default function Servicio() {
  const [activeTab, setActiveTab] = useState('recepcion');

  const tareasLimpieza = [
    {
      id: 1,
      unidad: 'Cabaña 8',
      tipo: 'Limpieza completa',
      prioridad: 'alta',
      estado: 'pendiente',
      asignado: 'Personal María',
      tiempoEstimado: '45 min',
    },
    {
      id: 2,
      unidad: 'Suite 12',
      tipo: 'Cambio de ropa',
      prioridad: 'media',
      estado: 'en-proceso',
      asignado: 'Personal Laura',
      tiempoEstimado: '20 min',
    },
    {
      id: 3,
      unidad: 'Cabaña 3',
      tipo: 'Limpieza profunda',
      prioridad: 'alta',
      estado: 'completado',
      asignado: 'Personal Ana',
      tiempoEstimado: '60 min',
    },
    {
      id: 4,
      unidad: 'Suite 7',
      tipo: 'Reposición amenities',
      prioridad: 'baja',
      estado: 'pendiente',
      asignado: 'Sin asignar',
      tiempoEstimado: '15 min',
    },
  ];

  const tareasRecepcion = [
    {
      id: 1,
      tarea: 'Check-in: García, María',
      unidad: 'Cabaña 8',
      hora: '14:00',
      estado: 'pendiente',
    },
    {
      id: 2,
      tarea: 'Check-out: Rodríguez, Juan',
      unidad: 'Suite 12',
      hora: '11:00',
      estado: 'completado',
    },
    {
      id: 3,
      tarea: 'Atención consulta: López, Ana',
      unidad: 'Cabaña 3',
      hora: '10:30',
      estado: 'en-proceso',
    },
    {
      id: 4,
      tarea: 'Entrega llaves: Martínez, Carlos',
      unidad: 'Suite 7',
      hora: '15:30',
      estado: 'pendiente',
    },
  ];

  const getPriorityColor = (prioridad: string) => {
    switch (prioridad) {
      case 'alta':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'media':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'baja':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return '';
    }
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return <Badge variant="secondary">Pendiente</Badge>;
      case 'en-proceso':
        return <Badge className="bg-blue-500 text-white">En Proceso</Badge>;
      case 'completado':
        return <Badge className="bg-green-500 text-white">Completado</Badge>;
      default:
        return <Badge>{estado}</Badge>;
    }
  };

  const limpiezaPendiente = tareasLimpieza.filter((t) => t.estado === 'pendiente').length;
  const limpiezaEnProceso = tareasLimpieza.filter((t) => t.estado === 'en-proceso').length;
  const limpiezaCompletado = tareasLimpieza.filter((t) => t.estado === 'completado').length;

  const recepcionPendiente = tareasRecepcion.filter((t) => t.estado === 'pendiente').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Servicio</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gestión de recepción y limpieza
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="recepcion">Recepción</TabsTrigger>
          <TabsTrigger value="limpieza">Limpieza</TabsTrigger>
        </TabsList>

        <TabsContent value="recepcion" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Tareas Pendientes"
              value={recepcionPendiente}
              icon={Clock}
              description="Por completar"
              color="#F59E0B"
            />
            <MetricCard
              title="Check-ins Hoy"
              value="5"
              icon={UserCheck}
              description="Llegadas programadas"
              color="#2A7B79"
            />
            <MetricCard
              title="Check-outs Hoy"
              value="8"
              icon={Users}
              description="Salidas programadas"
              color="#3B82F6"
            />
            <MetricCard
              title="Ocupación"
              value="73%"
              icon={ClipboardList}
              description="Unidades ocupadas"
              color="#10B981"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tareas de Recepción</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tarea</TableHead>
                    <TableHead>Unidad</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tareasRecepcion.map((tarea) => (
                    <TableRow key={tarea.id}>
                      <TableCell>#{tarea.id}</TableCell>
                      <TableCell>{tarea.tarea}</TableCell>
                      <TableCell>{tarea.unidad}</TableCell>
                      <TableCell>{tarea.hora}</TableCell>
                      <TableCell>{getStatusBadge(tarea.estado)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {tarea.estado !== 'completado' && (
                            <Button
                              size="sm"
                              className="bg-[var(--color-primary)]"
                            >
                              Completar
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            Ver Detalles
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="limpieza" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Pendientes"
              value={limpiezaPendiente}
              icon={Clock}
              description="Sin iniciar"
              color="#F59E0B"
            />
            <MetricCard
              title="En Proceso"
              value={limpiezaEnProceso}
              icon={ClipboardList}
              description="En ejecución"
              color="#3B82F6"
            />
            <MetricCard
              title="Completadas"
              value={limpiezaCompletado}
              icon={CheckCircle}
              description="Hoy"
              color="#10B981"
            />
            <MetricCard
              title="Personal Activo"
              value="6"
              icon={Users}
              description="En turno"
              color="#8B5CF6"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tareas de Limpieza</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Unidad</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Prioridad</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Asignado</TableHead>
                    <TableHead>Tiempo</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tareasLimpieza.map((tarea) => (
                    <TableRow key={tarea.id}>
                      <TableCell>#{tarea.id}</TableCell>
                      <TableCell>{tarea.unidad}</TableCell>
                      <TableCell>{tarea.tipo}</TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(tarea.prioridad)}>
                          {tarea.prioridad}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(tarea.estado)}</TableCell>
                      <TableCell>{tarea.asignado}</TableCell>
                      <TableCell>{tarea.tiempoEstimado}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {tarea.estado === 'pendiente' && (
                            <Button size="sm" variant="outline">
                              Iniciar
                            </Button>
                          )}
                          {tarea.estado === 'en-proceso' && (
                            <Button
                              size="sm"
                              className="bg-green-500 text-white hover:bg-green-600"
                            >
                              Finalizar
                            </Button>
                          )}
                          {tarea.estado === 'completado' && (
                            <Button size="sm" variant="outline" disabled>
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
