'use client';

import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, Check, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';

export function Reservas() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const reservas = [
    {
      id: 1,
      nombre: 'García, María',
      unidad: 'Cabaña 8',
      checkin: '2025-10-20',
      checkout: '2025-10-25',
      pax: 4,
      total: 35000,
      estado: 'confirmada',
      observaciones: 'Solicita cama adicional',
    },
    {
      id: 2,
      nombre: 'Rodríguez, Juan',
      unidad: 'Suite 12',
      checkin: '2025-10-18',
      checkout: '2025-10-22',
      pax: 2,
      total: 28000,
      estado: 'activa',
      observaciones: '',
    },
    {
      id: 3,
      nombre: 'López, Ana',
      unidad: 'Cabaña 3',
      checkin: '2025-10-22',
      checkout: '2025-10-28',
      pax: 5,
      total: 42000,
      estado: 'pendiente',
      observaciones: 'Consulta por mascotas',
    },
    {
      id: 4,
      nombre: 'Martínez, Carlos',
      unidad: 'Suite 7',
      checkin: '2025-10-15',
      checkout: '2025-10-20',
      pax: 3,
      total: 31500,
      estado: 'completada',
      observaciones: '',
    },
  ];

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'confirmada':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'activa':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'completada':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Reservas</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gestión de reservas del complejo
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Reserva
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nueva Reserva</DialogTitle>
              <DialogDescription>
                Complete los datos de la reserva en pasos
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="huesped" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="huesped">Huésped</TabsTrigger>
                <TabsTrigger value="reserva">Reserva</TabsTrigger>
                <TabsTrigger value="pago">Pago</TabsTrigger>
                <TabsTrigger value="confirmacion">Confirmación</TabsTrigger>
              </TabsList>

              <TabsContent value="huesped" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nombre completo</Label>
                    <Input placeholder="Ingrese nombre" />
                  </div>
                  <div>
                    <Label>DNI / Pasaporte</Label>
                    <Input placeholder="Número de documento" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input type="email" placeholder="correo@ejemplo.com" />
                  </div>
                  <div>
                    <Label>Teléfono</Label>
                    <Input placeholder="+54 9 11 1234-5678" />
                  </div>
                  <div className="col-span-2">
                    <Label>Dirección</Label>
                    <Input placeholder="Dirección completa" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reserva" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Unidad</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione unidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cabana-1">Cabaña 1</SelectItem>
                        <SelectItem value="cabana-2">Cabaña 2</SelectItem>
                        <SelectItem value="suite-1">Suite 1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Cantidad de personas</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div>
                    <Label>Check-in</Label>
                    <Input type="date" />
                  </div>
                  <div>
                    <Label>Check-out</Label>
                    <Input type="date" />
                  </div>
                  <div className="col-span-2">
                    <Label>Observaciones</Label>
                    <Textarea placeholder="Solicitudes especiales, alergias, etc." />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="pago" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Monto total</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div>
                    <Label>Seña / Adelanto</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div>
                    <Label>Método de pago</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione método" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="efectivo">Efectivo</SelectItem>
                        <SelectItem value="transferencia">
                          Transferencia
                        </SelectItem>
                        <SelectItem value="tarjeta">Tarjeta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Estado de pago</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendiente">Pendiente</SelectItem>
                        <SelectItem value="parcial">Parcial</SelectItem>
                        <SelectItem value="completo">Completo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="confirmacion" className="space-y-4">
                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="text-lg mb-4">Resumen de la reserva</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-500">Huésped:</span> [Nombre
                      completo]
                    </p>
                    <p>
                      <span className="text-gray-500">Unidad:</span> [Unidad
                      seleccionada]
                    </p>
                    <p>
                      <span className="text-gray-500">Fechas:</span> [Check-in]
                      - [Check-out]
                    </p>
                    <p>
                      <span className="text-gray-500">Personas:</span> [Pax]
                    </p>
                    <p>
                      <span className="text-gray-500">Total:</span> $[Monto]
                    </p>
                  </div>
                  <div className="mt-6 flex gap-2">
                    <Button className="flex-1 bg-[var(--color-primary)]">
                      Confirmar Reserva
                    </Button>
                    <Button variant="outline">Enviar por Email</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Reservas</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar reserva..."
                  className="pl-9 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="confirmada">Confirmadas</SelectItem>
                  <SelectItem value="activa">Activas</SelectItem>
                  <SelectItem value="pendiente">Pendientes</SelectItem>
                  <SelectItem value="completada">Completadas</SelectItem>
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
                <TableHead>Huésped</TableHead>
                <TableHead>Unidad</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Pax</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Observaciones</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservas.map((reserva) => (
                <TableRow key={reserva.id}>
                  <TableCell>#{reserva.id}</TableCell>
                  <TableCell>{reserva.nombre}</TableCell>
                  <TableCell>{reserva.unidad}</TableCell>
                  <TableCell>{reserva.checkin}</TableCell>
                  <TableCell>{reserva.checkout}</TableCell>
                  <TableCell>{reserva.pax}</TableCell>
                  <TableCell>${reserva.total.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(reserva.estado)}>
                      {reserva.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {reserva.observaciones || '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <Edit className="w-4 h-4" />
                      </Button>
                      {reserva.estado === 'confirmada' && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-green-600"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
