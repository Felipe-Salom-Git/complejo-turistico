'use client';

import React, { useState } from 'react';
import { Plus, Search, Ticket, DollarSign } from 'lucide-react';
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
import { MetricCard } from '../MetricCard';
import { Users, TrendingUp } from 'lucide-react';
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

export function PaseDiario() {
  const [searchTerm, setSearchTerm] = useState('');

  const pases = [
    {
      id: 1,
      nombre: 'González, Roberto',
      cantidad: 3,
      tipo: 'Adulto',
      fecha: '2025-10-17',
      hora: '10:30',
      servicios: ['Pileta', 'Parrilla'],
      total: 4500,
      estado: 'activo',
    },
    {
      id: 2,
      nombre: 'Fernández, Laura',
      cantidad: 2,
      tipo: 'Adulto',
      fecha: '2025-10-17',
      hora: '11:00',
      servicios: ['Pileta'],
      total: 3000,
      estado: 'activo',
    },
    {
      id: 3,
      nombre: 'Sánchez, Pablo',
      cantidad: 4,
      tipo: 'Familiar',
      fecha: '2025-10-17',
      hora: '09:15',
      servicios: ['Pileta', 'Parrilla', 'Deportes'],
      total: 6000,
      estado: 'completado',
    },
    {
      id: 4,
      nombre: 'Ramírez, Ana',
      cantidad: 1,
      tipo: 'Adulto',
      fecha: '2025-10-17',
      hora: '14:00',
      servicios: ['Spa', 'Pileta'],
      total: 2500,
      estado: 'activo',
    },
  ];

  const pasesActivos = pases.filter((p) => p.estado === 'activo').length;
  const totalPersonas = pases.filter((p) => p.estado === 'activo').reduce((acc, p) => acc + p.cantidad, 0);
  const ingresosDia = pases.reduce((acc, p) => acc + p.total, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Pase Diario</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gestión de pases de día y visitantes
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Pase
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nuevo Pase Diario</DialogTitle>
              <DialogDescription>
                Complete los datos del pase de día
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nombre completo</Label>
                  <Input placeholder="Nombre del visitante" />
                </div>
                <div>
                  <Label>Teléfono</Label>
                  <Input placeholder="+54 9 11 1234-5678" />
                </div>
                <div>
                  <Label>Cantidad de personas</Label>
                  <Input type="number" placeholder="0" />
                </div>
                <div>
                  <Label>Tipo de pase</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="adulto">Adulto - $1,500</SelectItem>
                      <SelectItem value="menor">Menor - $1,000</SelectItem>
                      <SelectItem value="familiar">
                        Familiar (4 pax) - $6,000
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Fecha</Label>
                  <Input type="date" />
                </div>
                <div>
                  <Label>Hora de ingreso</Label>
                  <Input type="time" />
                </div>
                <div className="col-span-2">
                  <Label>Servicios incluidos</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="cursor-pointer">
                      Pileta
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer">
                      Parrilla
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer">
                      Spa
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer">
                      Deportes
                    </Badge>
                  </div>
                </div>
                <div className="col-span-2">
                  <Label>Total a cobrar</Label>
                  <Input type="number" placeholder="$0" />
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline">Cancelar</Button>
                <Button className="bg-[var(--color-primary)]">
                  Generar Pase
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Pases Activos"
          value={pasesActivos}
          icon={Ticket}
          description="En el complejo"
          color="#2A7B79"
        />
        <MetricCard
          title="Total Personas"
          value={totalPersonas}
          icon={Users}
          description="Visitantes hoy"
          color="#3B82F6"
        />
        <MetricCard
          title="Ingresos Día"
          value={`$${ingresosDia.toLocaleString()}`}
          icon={DollarSign}
          description="Total del día"
          trend={{ value: 15, isPositive: true }}
          color="#10B981"
        />
        <MetricCard
          title="Promedio"
          value={`$${Math.round(ingresosDia / pases.length).toLocaleString()}`}
          icon={TrendingUp}
          description="Por pase"
          color="#F5B841"
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pases del Día</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar pase..."
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
                <TableHead>Nombre</TableHead>
                <TableHead>Personas</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Servicios</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pases.map((pase) => (
                <TableRow key={pase.id}>
                  <TableCell>#{pase.id}</TableCell>
                  <TableCell>{pase.nombre}</TableCell>
                  <TableCell>{pase.cantidad}</TableCell>
                  <TableCell>{pase.tipo}</TableCell>
                  <TableCell>{pase.hora}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {pase.servicios.map((servicio) => (
                        <Badge key={servicio} variant="secondary" className="text-xs">
                          {servicio}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>${pase.total.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        pase.estado === 'activo' ? 'default' : 'secondary'
                      }
                    >
                      {pase.estado}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline">
                        Ver
                      </Button>
                      {pase.estado === 'activo' && (
                        <Button size="sm" variant="outline">
                          Finalizar
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
