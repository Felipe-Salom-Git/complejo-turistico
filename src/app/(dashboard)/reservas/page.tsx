'use client';

import React, { useState } from 'react';
import { Plus, Search, Check, Users, Trash2, Car, Phone, Dog } from 'lucide-react';
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
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useReservations, Reservation } from '@/contexts/ReservationsContext';
import { useRouter } from 'next/navigation';
import { useGuests } from '@/contexts/GuestsContext';

export default function Reservas() {
  const router = useRouter();
  const { reservations, clearAllReservations } = useReservations();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isClientDbOpen, setIsClientDbOpen] = useState(false);

  const getEffectiveStatus = (reserva: Reservation) => {
    // If no payments made, force 'pendiente' visually
    if ((reserva.amountPaidUSD || 0) === 0 && (reserva.amountPaid || 0) === 0) {
      return 'pendiente';
    }
    return reserva.status;
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'confirmada':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'pendiente':
      case 'pending':
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
      case 'cleaning': return 'Limpieza';
      case 'pendiente':
      case 'pending': return 'Pendiente';
      default: return estado;
    }
  };

  const filteredReservations = reservations
    .filter(r => r.status !== 'cleaning')
    .filter(reserva => {
      const matchesSearch =
        reserva.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reserva.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (reserva.licensePlate && reserva.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = filterStatus === 'all' || getEffectiveStatus(reserva) === filterStatus;

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
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setIsClientDbOpen(true)}
          >
            <Users className="h-4 w-4" /> Base de Clientes
          </Button>
          <Button
            variant="destructive"
            className="gap-2 bg-red-100 text-red-700 hover:bg-red-200 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
            onClick={() => {
              if (confirm('⚠️ ¿Estás SEGURO de eliminar TODAS las reservas? Esto borrará el calendario y la ocupación por completo. No se puede deshacer.')) {
                clearAllReservations();
              }
            }}
          >
            <Trash2 className="h-4 w-4" /> Vaciar Todo
          </Button>
          <Button
            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90"
            onClick={() => router.push('/nueva-reserva')}
          >
            <Plus className="mr-2 h-4 w-4" /> Nueva Reserva
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Active Reservations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Activas</CardTitle>
            <Check className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reservations.filter((r) => r.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              En curso actualmente
            </p>
          </CardContent>
        </Card>

        {/* Pending Payments (Current Month) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes (Mes)</CardTitle>
            <div className="h-4 w-4 rounded-full bg-yellow-100 border border-yellow-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">
              {reservations.filter((r) => {
                const isCurrentMonth = new Date(r.checkIn).getMonth() === new Date().getMonth() && new Date(r.checkIn).getFullYear() === new Date().getFullYear();
                const isUnpaid = (r.amountPaidUSD || 0) === 0 && (r.amountPaid || 0) === 0;
                return isCurrentMonth && isUnpaid && r.status !== 'cancelled' && r.status !== 'cleaning';
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Sin pagos registrados este mes
            </p>
          </CardContent>
        </Card>

        {/* Cancelled (Current Month) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Canceladas (Mes)</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">
              {reservations.filter((r) => {
                const isCurrentMonth = new Date(r.checkIn).getMonth() === new Date().getMonth() && new Date(r.checkIn).getFullYear() === new Date().getFullYear();
                return r.status === 'cancelled' && isCurrentMonth;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Cancelaciones este mes
            </p>
          </CardContent>
        </Card>
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
                placeholder="Buscar por huésped, unidad o patente..."
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
                <SelectItem value="confirmada">Confirmadas</SelectItem>
                <SelectItem value="pendiente">Pendientes</SelectItem>
                <SelectItem value="pending">Pendientes (Manual)</SelectItem>
                <SelectItem value="cancelled">Canceladas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Huésped</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Unidad</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Mascota</TableHead>
                  <TableHead>Patente</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No se encontraron reservas
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReservations.map((reserva) => (
                    <TableRow
                      key={reserva.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => router.push(`/reservas/${reserva.id}`)}
                    >
                      <TableCell className="font-medium">
                        {reserva.guestName}
                      </TableCell>
                      <TableCell>
                        {reserva.phone ? (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone className="w-3 h-3" /> {reserva.phone}
                          </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell>{reserva.unit}</TableCell>
                      <TableCell>
                        {new Date(reserva.checkIn).toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}
                      </TableCell>
                      <TableCell>
                        {reserva.hasPet ? <Dog className="w-4 h-4 text-emerald-600" /> : <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell>
                        {reserva.licensePlate ? (
                          <div className="flex items-center gap-1 text-xs uppercase font-mono">
                            <Car className="w-3 h-3 text-muted-foreground" /> {reserva.licensePlate}
                          </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        ${(reserva.totalUSD || 0).toLocaleString('en-US')} USD
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(getEffectiveStatus(reserva))}>
                          {getStatusLabel(getEffectiveStatus(reserva))}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Client Database Dialog */}
      <Dialog open={isClientDbOpen} onOpenChange={setIsClientDbOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Base de Datos de Clientes</DialogTitle>
          </DialogHeader>
          <ClientDatabaseView />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ClientDatabaseView() {
  const { guests } = useGuests();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGuests = guests.filter(g =>
    g.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.document.includes(searchTerm)
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Buscar cliente por nombre o DNI..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>DNI</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Reservas</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredGuests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">No se encontraron clientes.</TableCell>
            </TableRow>
          ) : (
            filteredGuests.map(h => (
              <TableRow key={h.id}>
                <TableCell className="font-medium">{h.lastName}, {h.firstName}</TableCell>
                <TableCell>{h.document}</TableCell>
                <TableCell>
                  <div className="text-xs">
                    <div>{h.email}</div>
                    <div>{h.phone}</div>
                  </div>
                </TableCell>
                <TableCell>{h.reservationsCount}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">Ver Historial</Button>
                </TableCell>
              </TableRow>
            )))}
        </TableBody>
      </Table>
    </div>
  );
}
