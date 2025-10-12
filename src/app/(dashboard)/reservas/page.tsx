// 📍 src/app/(dashboard)/reservas/page.tsx
// ESTE ES UN SERVER COMPONENT (no necesita 'use client')

import React from 'react';
import Link from 'next/link';
import { mockReservas } from ' @/mock/mock-reservas';
import { Huesped } from '../../../types/huesped';
import { Plataforma } from '../../../types/reserva';

// Simulamos datos del servidor
async function getReservas() {
  // En un caso real, aquí haríamos fetch a la base de datos
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    mockReservas
  ];
}

export default async function ReservasPage() {
  const reservas = mockReservas;
  
  const estadisticas = {
    total: reservas.length,
    
    confirmadas: reservas.filter(r => r.estado === 'Activa').length,
    pendientes: reservas.filter(r => r.estado === 'Pendiente').length,
  };
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📅 Gestión de Reservas</h1>
          <p className="text-gray-600">Administra todas las reservas del complejo</p>
        </div>
        <Link
          href="/reservas/nueva"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          + Nueva Reserva
        </Link>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-gray-600">Total Reservas</h3>
          <p className="text-2xl font-bold">{estadisticas.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-gray-600">Confirmadas</h3>
          {/* <p className="text-2xl font-bold text-green-600">{estadisticas.confirmadas}</p> */}
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-gray-600">Pendientes</h3>
          {/* <p className="text-2xl font-bold text-yellow-600">{estadisticas.pendientes}</p> */}
        </div>
      </div>

      {/* Lista de Reservas */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Lista de Reservas</h2>
        </div>
        <div className="divide-y">
          {reservas.map((reserva) => (
            <div key={reserva.huespedId} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{reserva.id} - {reserva.huespedNombre}</h3>
                  <p className="text-sm text-gray-600">
                    {reserva.fechaEntrada.toLocaleDateString()} → {reserva.fechaSalida.toLocaleDateString()} Cantidad de Noches {reserva.cantidadNoches}, Mascota: {reserva.mascota},
                     Plataforma: {reserva.plataforma}, Estado de Cuenta: Cobrado: AR$ {reserva.montos.ars.cobrado} Saldo: AR$ {reserva.montos.ars.saldo} Total: AR$ {reserva.montos.ars.total}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    reserva.estado === 'Activa' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {reserva.estado}
                  </span>
                  <Link
                    href={`/reservas/${reserva.id}`}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    Ver detalles
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}