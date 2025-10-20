'use client';

import React, { useState } from 'react';
import { Plus, Search, FileText, Send } from 'lucide-react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';
import { MetricCard } from '../MetricCard';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

export function Cotizaciones() {
  const [searchTerm, setSearchTerm] = useState('');

  const cotizaciones = [
    {
      id: 1,
      cliente: 'Empresa ABC S.A.',
      contacto: 'contacto@abc.com',
      unidad: 'Cabaña Deluxe x3',
      checkin: '2025-11-15',
      checkout: '2025-11-20',
      pax: 12,
      total: 150000,
      estado: 'pendiente',
      fecha: '2025-10-15',
    },
    {
      id: 2,
      cliente: 'González, Roberto',
      contacto: 'roberto@email.com',
      unidad: 'Suite Premium x2',
      checkin: '2025-12-01',
      checkout: '2025-12-05',
      pax: 6,
      total: 80000,
      estado: 'enviada',
      fecha: '2025-10-14',
    },
    {
      id: 3,
      cliente: 'Eventos XYZ',
      contacto: 'ventas@xyz.com',
      unidad: 'Complejo completo',
      checkin: '2025-11-25',
      checkout: '2025-11-28',
      pax: 50,
      total: 350000,
      estado: 'aceptada',
      fecha: '2025-10-10',
    },
    {
      id: 4,
      cliente: 'Fernández, Laura',
      contacto: 'laura@email.com',
      unidad: 'Cabaña Standard',
      checkin: '2025-10-30',
      checkout: '2025-11-02',
      pax: 4,
      total: 35000,
      estado: 'rechazada',
      fecha: '2025-10-12',
    },
  ];

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return (
          <Badge className="bg-yellow-500 text-white gap-1">
            <Clock className="w-3 h-3" />
            Pendiente
          </Badge>
        );
      case 'enviada':
        return (
          <Badge className="bg-blue-500 text-white gap-1">
            <Send className="w-3 h-3" />
            Enviada
          </Badge>
        );
      case 'aceptada':
        return (
          <Badge className="bg-green-500 text-white gap-1">
            <CheckCircle className="w-3 h-3" />
            Aceptada
          </Badge>
        );
      case 'rechazada':
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="w-3 h-3" />
            Rechazada
          </Badge>
        );
      default:
        return <Badge>{estado}</Badge>;
    }
  };

  const pendientes = cotizaciones.filter((c) => c.estado === 'pendiente').length;
  const enviadas = cotizaciones.filter((c) => c.estado === 'enviada').length;
  const aceptadas = cotizaciones.filter((c) => c.estado === 'aceptada').length;
  const totalMonto = cotizaciones
    .filter((c) => c.estado === 'aceptada')
    .reduce((acc, c) => acc + c.total, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Cotizaciones</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gestión de presupuestos y cotizaciones
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Cotización
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nueva Cotización</DialogTitle>
              <DialogDescription>
                Complete los datos para generar la cotización
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Cliente / Empresa</Label>
                  <Input placeholder="Nombre del cliente" />
                </div>
                <div>
                  <Label>Email de contacto</Label>
                  <Input type="email" placeholder="correo@ejemplo.com" />
                </div>
                <div>
                  <Label>Teléfono</Label>
                  <Input placeholder="+54 9 11 1234-5678" />
                </div>
                <div>
                  <Label>Tipo de servicio</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alojamiento">Alojamiento</SelectItem>
                      <SelectItem value="evento">Evento</SelectItem>
                      <SelectItem value="corporativo">Corporativo</SelectItem>
                      <SelectItem value="completo">
                        Complejo completo
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Check-in</Label>
                  <Input type="date" />
                </div>
                <div>
                  <Label>Check-out</Label>
                  <Input type="date" />
                </div>
                <div>
                  <Label>Cantidad de personas</Label>
                  <Input type="number" placeholder="0" />
                </div>
                <div>
                  <Label>Unidades requeridas</Label>
                  <Input placeholder="Ej: 3 Cabañas, 2 Suites" />
                </div>
                <div className="col-span-2">
                  <Label>Servicios adicionales</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="cursor-pointer">
                      Catering
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer">
                      Transporte
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer">
                      Actividades
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer">
                      Decoración
                    </Badge>
                  </div>
                </div>
                <div className="col-span-2">
                  <Label>Observaciones</Label>
                  <Textarea placeholder="Detalles adicionales o solicitudes especiales" />
                </div>
                <div>
                  <Label>Monto total cotizado</Label>
                  <Input type="number" placeholder="$0" />
                </div>
                <div>
                  <Label>Validez de la cotización</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 días</SelectItem>
                      <SelectItem value="15">15 días</SelectItem>
                      <SelectItem value="30">30 días</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline">Guardar Borrador</Button>
                <Button className="bg-[var(--color-primary)]">
                  <Send className="w-4 h-4 mr-2" />
                  Generar y Enviar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Pendientes"
          value={pendientes}
          icon={Clock}
          description="Por enviar"
          color="#F59E0B"
        />
        <MetricCard
          title="Enviadas"
          value={enviadas}
          icon={Send}
          description="Esperando respuesta"
          color="#3B82F6"
        />
        <MetricCard
          title="Aceptadas"
          value={aceptadas}
          icon={CheckCircle}
          description="Este mes"
          color="#10B981"
        />
        <MetricCard
          title="Monto Aceptado"
          value={`$${totalMonto.toLocaleString()}`}
          icon={FileText}
          description="Total este mes"
          color="#2A7B79"
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Cotizaciones</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar cotización..."
                className="pl-9 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Unidades</TableHead>
                <TableHead>Fechas</TableHead>
                <TableHead>Pax</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cotizaciones.map((cotizacion) => (
                <TableRow key={cotizacion.id}>
                  <TableCell>#{cotizacion.id}</TableCell>
                  <TableCell>{cotizacion.cliente}</TableCell>
                  <TableCell>{cotizacion.contacto}</TableCell>
                  <TableCell>{cotizacion.unidad}</TableCell>
                  <TableCell>
                    {cotizacion.checkin} / {cotizacion.checkout}
                  </TableCell>
                  <TableCell>{cotizacion.pax}</TableCell>
                  <TableCell>${cotizacion.total.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(cotizacion.estado)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline">
                        Ver
                      </Button>
                      {cotizacion.estado === 'pendiente' && (
                        <Button size="sm" className="bg-[var(--color-primary)]">
                          <Send className="w-3 h-3 mr-1" />
                          Enviar
                        </Button>
                      )}
                      {cotizacion.estado === 'aceptada' && (
                        <Button size="sm" className="bg-green-500 text-white">
                          Convertir
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
    </div>
  );
}
