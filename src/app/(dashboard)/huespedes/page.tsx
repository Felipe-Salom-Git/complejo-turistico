'use client';

import React, { useState } from 'react';
import { Plus, Search, Eye, Edit, Trash2, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function Huespedes() {
  const [searchTerm, setSearchTerm] = useState('');

  const huespedes = [
    {
      id: 1,
      nombre: 'García, María',
      documento: '12345678',
      email: 'maria.garcia@email.com',
      telefono: '+54 9 11 1234-5678',
      direccion: 'Av. Corrientes 1234, CABA',
      reservasTotal: 3,
      ultimaVisita: '2025-10-15',
    },
    {
      id: 2,
      nombre: 'Rodríguez, Juan',
      documento: '23456789',
      email: 'juan.rodriguez@email.com',
      telefono: '+54 9 11 2345-6789',
      direccion: 'Calle Falsa 123, Buenos Aires',
      reservasTotal: 1,
      ultimaVisita: '2025-10-18',
    },
    {
      id: 3,
      nombre: 'López, Ana',
      documento: '34567890',
      email: 'ana.lopez@email.com',
      telefono: '+54 9 11 3456-7890',
      direccion: 'San Martín 456, Rosario',
      reservasTotal: 5,
      ultimaVisita: '2025-09-22',
    },
    {
      id: 4,
      nombre: 'Martínez, Carlos',
      documento: '45678901',
      email: 'carlos.martinez@email.com',
      telefono: '+54 9 11 4567-8901',
      direccion: 'Belgrano 789, Córdoba',
      reservasTotal: 2,
      ultimaVisita: '2025-08-10',
    },
  ];

  const getInitials = (nombre: string) => {
    return nombre
      .split(',')
      .reverse()
      .map((n) => n.trim()[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Huéspedes</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Base de datos de huéspedes registrados
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Huésped
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nuevo Huésped</DialogTitle>
              <DialogDescription>
                Complete los datos del huésped
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nombre completo</Label>
                  <Input placeholder="Apellido, Nombre" />
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
                <div>
                  <Label>Ciudad</Label>
                  <Input placeholder="Ciudad" />
                </div>
                <div>
                  <Label>País</Label>
                  <Input placeholder="País" />
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline">Cancelar</Button>
                <Button className="bg-[var(--color-primary)]">Guardar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Huéspedes</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar huésped..."
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
                <TableHead>Huésped</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Reservas</TableHead>
                <TableHead>Última Visita</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {huespedes.map((huesped) => (
                <TableRow key={huesped.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-[var(--color-primary)] text-white">
                          {getInitials(huesped.nombre)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{huesped.nombre}</span>
                    </div>
                  </TableCell>
                  <TableCell>{huesped.documento}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span>{huesped.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span>{huesped.telefono}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    {huesped.direccion}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-secondary)] text-white text-sm">
                      {huesped.reservasTotal}
                    </span>
                  </TableCell>
                  <TableCell>{huesped.ultimaVisita}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <Edit className="w-4 h-4" />
                      </Button>
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
