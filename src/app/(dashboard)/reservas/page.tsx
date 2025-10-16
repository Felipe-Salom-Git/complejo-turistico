// 📍 src/app/(dashboard)/reservas/page.tsx
// ESTE ES UN SERVER COMPONENT (no necesita 'use client')
'use client'

import React from 'react';
import Link from 'next/link';
import { mockReservas } from ' @/mock/mock-reservas';
import { Huesped } from '../../../types/huesped';
import { Plataforma } from '../../../types/reserva';
import { useState } from 'react';
import { ReservationFilters } from " @/components/ReservationFilters";
import { ReservationStats } from " @/components/ReservationStats";
import { ReservationTable } from " @/components/ReservationTable";
import { Toaster } from " @/components/ui/sonner";
import { toast } from 'sonner';
import { Reserva } from '../../../types/reserva';

// Simulamos datos del servidor
async function getReservas() {
  // En un caso real, aquí haríamos fetch a la base de datos
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    mockReservas
  ];
}
 
export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [unitTypeFilter, setUnitTypeFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");

  // Filter reservations
  const filteredReservations = mockReservas.filter((reservation) => {
    const matchesSearch =
      searchTerm === "" ||
      reservation.huespedNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.responsable.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.observaciones.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || reservation.estado === statusFilter;
    const matchesUnitType = unitTypeFilter === "all" || reservation.unidad === unitTypeFilter;
    const matchesPlatform = platformFilter === "all" || reservation.plataforma === platformFilter;

    return matchesSearch && matchesStatus && matchesUnitType && matchesPlatform;
  });

  const handleEdit = (id: string) => {
    toast.success(`Editar reserva ${id}`);
  };

  const handleCancel = (id: string) => {
    toast.error(`Cancelar reserva ${id}`);
  };

  const handleSendMessage = (id: string) => {
    toast.success(`Mensaje de bienvenida enviado para reserva ${id}`);
  }; 

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 max-w-[1800px]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2">Base de Datos de Reservas</h1>
          <p className="text-muted-foreground">
            Gestión completa de reservas del complejo turístico
          </p>
        </div>

        {/* Stats */}
        <ReservationStats reservations={filteredReservations} />

        {/* Filters */}
        <ReservationFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          unitTypeFilter={unitTypeFilter}
          onUnitTypeFilterChange={setUnitTypeFilter}
          platformFilter={platformFilter}
          onPlatformFilterChange={setPlatformFilter}
        />

        {/* Results count */}
        <div className="mb-4">
          <p className="text-muted-foreground">
            Mostrando {filteredReservations.length} de {mockReservas.length} reservas
          </p>
        </div>

        {/* Table */}
        <ReservationTable
          reservations={filteredReservations}
          onEdit={handleEdit}
          onCancel={handleCancel}
          onSendMessage={handleSendMessage}
        />
      </div>

      <Toaster />
    </div>
  );
}