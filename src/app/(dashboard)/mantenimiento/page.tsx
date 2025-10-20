'use client';

import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { MetricCard } from '../MetricCard';
import { Wrench, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export function Mantenimiento() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');

  const tickets = [
    {
      id: 1,
      unidad: 'Cabaña 5',
      problema: 'Fuga de agua en baño',
      prioridad: 'urgente',
      estado: 'pendiente',
      fecha: '2025-10-17',
      asignado: 'Técnico Mario',
    },
    {
      id: 2,
      unidad: 'Suite 12',
      problema: 'Aire acondicionado no enfría',
      prioridad: 'alta',
      estado: 'en-proceso',
      fecha: '2025-10-16',
      asignado: 'Técnico Juan',
    },
    {
      id: 3,
      unidad: 'Cabaña 8',
      problema: 'Puerta de entrada no cierra bien',
      prioridad: 'media',
      estado: 'pendiente',
      fecha: '2025-10-15',
      asignado: 'Sin asignar',
    },
    {
      id: 4,
      unidad: 'Suite 7',
      problema: 'Reemplazo de bombillas',
      prioridad: 'baja',
      estado: 'completado',
      fecha: '2025-10-14',
      asignado: 'Técnico Pedro',
    },
    {
      id: 5,
      unidad: 'Cabaña 3',
      problema: 'Calefacción no funciona',
      prioridad: 'urgente',
      estado: 'en-proceso',
      fecha: '2025-10-17',
      asignado: 'Técnico Mario',
    },
  ];

  const getPriorityBadge = (prioridad: string) => {
    switch (prioridad) {
      case 'urgente':
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="w-3 h-3" />
            Urgente
          </Badge>
        );
      case 'alta':
        return (
          <Badge className="bg-orange-500 text-white">
            Alta
          </Badge>
        );
      case 'media':
        return (
          <Badge className="bg-yellow-500 text-white">
            Media
          </Badge>
        );
      case 'baja':
        return (
          <Badge variant="secondary">
            Baja
          </Badge>
        );
      default:
        return <Badge>{prioridad}</Badge>;
    }
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return <Badge variant="secondary">Pendiente</Badge>;
      case 'en-proceso':
        return (
          <Badge className="bg-blue-500 text-white">
            En Proceso
          </Badge>
        );
      case 'completado':
        return (
          <Badge className="bg-green-500 text-white">
            Completado
          </Badge>
        );
      default:
        return <Badge>{estado}</Badge>;
    }
  };

  const ticketsUrgentes = tickets.filter((t) => t.prioridad === 'urgente' && t.estado !== 'completado').length;
  const ticketsEnProceso = tickets.filter((t) => t.estado === 'en-proceso').length;
  const ticketsPendientes = tickets.filter((t) => t.estado === 'pendiente').length;
  const ticketsCompletados = tickets.filter((t) => t.estado === 'completado').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Mantenimiento</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gestión de tickets y tareas de mantenimiento
          </p>
        </div>
        <Button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Ticket
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Urgentes"
          value={ticketsUrgentes}
          icon={AlertTriangle}
          description="Requiere atención inmediata"
          color="#EF4444"
        />
        <MetricCard
          title="En Proceso"
          value={ticketsEnProceso}
          icon={Clock}
          description="Siendo atendidos"
          color="#3B82F6"
        />
        <MetricCard
          title="Pendientes"
          value={ticketsPendientes}
          icon={Wrench}
          description="Sin asignar"
          color="#F59E0B"
        />
        <MetricCard
          title="Completados"
          value={ticketsCompletados}
          icon={CheckCircle}
          description="Esta semana"
          color="#10B981"
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tickets de Mantenimiento</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar ticket..."
                  className="pl-9 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Unidad</TableHead>
                <TableHead>Problema</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Asignado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>#{ticket.id}</TableCell>
                  <TableCell>{ticket.unidad}</TableCell>
                  <TableCell className="max-w-[250px]">
                    {ticket.problema}
                  </TableCell>
                  <TableCell>{getPriorityBadge(ticket.prioridad)}</TableCell>
                  <TableCell>{getStatusBadge(ticket.estado)}</TableCell>
                  <TableCell>{ticket.fecha}</TableCell>
                  <TableCell>{ticket.asignado}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline">
                        Ver
                      </Button>
                      {ticket.estado !== 'completado' && (
                        <Button
                          size="sm"
                          className="bg-[var(--color-primary)]"
                        >
                          Actualizar
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

      {ticketsUrgentes > 0 && (
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-5 h-5" />
              Tickets Urgentes - Atención Inmediata
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tickets
                .filter((t) => t.prioridad === 'urgente' && t.estado !== 'completado')
                .map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950 rounded-lg"
                  >
                    <div>
                      <p className="text-sm">
                        <span className="font-semibold">{ticket.unidad}</span> - {ticket.problema}
                      </p>
                      <p className="text-xs text-gray-500">
                        {ticket.asignado} • {ticket.fecha}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Atender Ahora
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
