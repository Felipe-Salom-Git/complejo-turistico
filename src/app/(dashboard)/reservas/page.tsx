'use client';

import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useReservations } from '@/contexts/ReservationsContext';
import { useRouter } from 'next/navigation';

export default function Reservas() {
  const router = useRouter();
  const { reservations } = useReservations();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'confirmada':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'checkout':
      case 'completada':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (estado: string) => {
    switch (estado) {
      case 'active': return 'Activa';
      case 'checkout': return 'Check-out';
      case 'cleaning': return 'Limpieza';
      default: return estado;
    }
  };

  const filteredReservations = reservations
    .filter(r => r.status !== 'cleaning')
    .filter(reserva => {
      const matchesSearch = 
        reserva.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reserva.unit.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || reserva.status === filterStatus;

      return matchesSearch && matchesStatus;
    });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reservas</h2>
          <p className="text-muted-foreground">
            Gestiona y visualiza todas las reservas del complejo
          </p>
        </div>
        <Button 
          className="bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90"
          onClick={() => router.push('/nueva-reserva')}
        >
          <Plus className="mr-2 h-4 w-4" /> Nueva Reserva
        </Button>
      </div>

      {/* NewReservationModal removed */}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Activas</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reservations.filter((r) => r.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              +2 desde ayer
            </p>
          </CardContent>
        </Card>
        {/* ... other summary cards could be dynamically updated too ... */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Reservas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por huésped o unidad..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activas</SelectItem>
                <SelectItem value="checkout">Check-out</SelectItem>
                <SelectItem value="confirmada">Confirmadas</SelectItem>
                <SelectItem value="pendiente">Pendientes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Huésped</TableHead>
                  <TableHead>Unidad</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Pax</TableHead>
                  <TableHead>Total Estimado</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No se encontraron reservas
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReservations.map((reserva) => (
                    <TableRow key={reserva.id}>
                      <TableCell className="font-medium truncate max-w-[80px]">
                        {reserva.id}
                      </TableCell>
                      <TableCell>{reserva.guestName}</TableCell>
                      <TableCell>{reserva.unit}</TableCell>
                      <TableCell>
                        {new Date(reserva.checkIn).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(reserva.checkOut).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{reserva.pax || '-'}</TableCell>
                      <TableCell>
                        ${(reserva.total || 0).toLocaleString('es-AR')}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(reserva.status)}>
                          {getStatusLabel(reserva.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
