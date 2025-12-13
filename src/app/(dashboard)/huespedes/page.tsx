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
import { useGuests } from '@/contexts/GuestsContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function Huespedes() {
  const [searchTerm, setSearchTerm] = useState('');

  const { guests, addGuest, deleteGuest } = useGuests();
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    document: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.firstName || !formData.lastName || !formData.document) {
      alert('Por favor complete los campos obligatorios');
      return;
    }

    addGuest({
      id: Date.now().toString(),
      ...formData,
      reservationsCount: 0,
      lastVisit: null,
      notes: ''
    });

    setIsNewOpen(false);
    setFormData({
      firstName: '',
      lastName: '',
      document: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: ''
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
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
        <Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
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
                  <Label>Nombre</Label>
                  <Input name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Nombre" />
                </div>
                <div>
                  <Label>Apellido</Label>
                  <Input name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Apellido" />
                </div>
                <div>
                  <Label>DNI / Pasaporte</Label>
                  <Input name="document" value={formData.document} onChange={handleInputChange} placeholder="Número de documento" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="correo@ejemplo.com" />
                </div>
                <div>
                  <Label>Teléfono</Label>
                  <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+54 9 11 1234-5678" />
                </div>
                <div className="col-span-2">
                  <Label>Dirección</Label>
                  <Input name="address" value={formData.address} onChange={handleInputChange} placeholder="Dirección completa" />
                </div>
                <div>
                  <Label>Ciudad</Label>
                  <Input name="city" value={formData.city} onChange={handleInputChange} placeholder="Ciudad" />
                </div>
                <div>
                  <Label>País</Label>
                  <Input name="country" value={formData.country} onChange={handleInputChange} placeholder="País" />
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={() => setIsNewOpen(false)}>Cancelar</Button>
                <Button className="bg-[var(--color-primary)]" onClick={handleSubmit}>Guardar</Button>
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
              {guests
                .filter(g =>
                  g.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  g.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  g.document.includes(searchTerm)
                )
                .map((huesped) => (
                  <TableRow key={huesped.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-[var(--color-primary)] text-white">
                            {getInitials(huesped.firstName, huesped.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{huesped.lastName}, {huesped.firstName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{huesped.document}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span>{huesped.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span>{huesped.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      {huesped.address}, {huesped.city}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-secondary)] text-white text-sm">
                        {huesped.reservationsCount}
                      </span>
                    </TableCell>
                    <TableCell>{huesped.lastVisit || '-'}</TableCell>
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
                          onClick={() => {
                            if (confirm('¿Eliminar huésped?')) deleteGuest(huesped.id);
                          }}
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
