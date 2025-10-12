// 📍 src/app/(dashboard)/huespedes/[id]/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Huesped } from ' @/types/huesped';

// Datos mock - en una app real esto vendría de una API
const huespedesMock: Huesped[] = [
  {
    id: '1',
    nombre: 'Carlos Rodríguez',
    email: 'carlos@email.com',
    telefono: '+54 11 1234-5678',
    nacionalidad: 'Argentino'
  },
  {
    id: '2',
    nombre: 'María González',
    email: 'maria@email.com',
    telefono: '+54 11 8765-4321', 
    nacionalidad: 'Uruguaya'
  }
];

// Simular fetch de huésped
function getHuesped(id: string): Huesped | undefined {
  return huespedesMock.find(h => h.id === id);
}

// Datos de reservas mock para este huésped
const reservasHuesped = [
  {
    id: 'RES-001',
    fechaEntrada: '2024-01-15',
    fechaSalida: '2024-01-20',
    unidad: 'A-101',
    estado: 'completada' as const,
    monto: 750
  },
  {
    id: 'RES-002', 
    fechaEntrada: '2024-02-10',
    fechaSalida: '2024-02-15',
    unidad: 'B-205',
    estado: 'confirmada' as const,
    monto: 600
  }
];

interface PageProps {
  params: {
    id: string;
  };
}

export default function DetalleHuespedPage({ params }: PageProps) {
  const huesped = getHuesped(params.id);
  
  if (!huesped) {
    notFound();
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Link 
              href="/huespedes"
              className="text-blue-500 hover:text-blue-700"
            >
              ← Volver a huéspedes
            </Link>
          </div>
          <h1 className="text-2xl font-bold">👤 {huesped.nombre}</h1>
          <p className="text-gray-600">Detalles completos del huésped</p>
        </div>
        
        <div className="flex space-x-2">
          <Link
            href={`/huespedes/${huesped.id}/editar`}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Editar
          </Link>
          <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
            Nueva Reserva
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tarjeta de Información Personal */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="font-semibold text-lg mb-4">📋 Información Personal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Nombre completo</label>
                <p className="font-medium">{huesped.nombre}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="font-medium">{huesped.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Teléfono</label>
                <p className="font-medium">{huesped.telefono}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Nacionalidad</label>
                <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  {huesped.nacionalidad}
                </span>
              </div>
              <div>
                <label className="text-sm text-gray-500">ID del Sistema</label>
                <p className="font-medium text-gray-600">{huesped.id}</p>
              </div>
            </div>
          </div>

          {/* Historial de Reservas */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="font-semibold text-lg mb-4">📅 Historial de Reservas</h2>
            {reservasHuesped.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay reservas registradas</p>
            ) : (
              <div className="space-y-3">
                {reservasHuesped.map((reserva) => (
                  <div key={reserva.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{reserva.id} - {reserva.unidad}</p>
                      <p className="text-sm text-gray-600">
                        {reserva.fechaEntrada} → {reserva.fechaSalida}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 rounded text-xs ${
                        reserva.estado === 'completada' ? 'bg-green-100 text-green-800' :
                        reserva.estado === 'confirmada' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {reserva.estado}
                      </span>
                      <p className="font-semibold mt-1">${reserva.monto}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Estadísticas Rápidas */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="font-semibold text-lg mb-4">📊 Estadísticas</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total reservas:</span>
                <span className="font-bold">{reservasHuesped.length}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Completadas:</span>
                <span>{reservasHuesped.filter(r => r.estado === 'completada').length}</span>
              </div>
              <div className="flex justify-between text-blue-600">
                <span>Futuras:</span>
                <span>{reservasHuesped.filter(r => r.estado === 'confirmada').length}</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between font-semibold">
                  <span>Total gastado:</span>
                  <span>${reservasHuesped.reduce((sum, r) => sum + r.monto, 0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="font-semibold text-lg mb-4">⚡ Acciones Rápidas</h2>
            <div className="space-y-2">
              <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-colors">
                📞 Llamar al huésped
              </button>
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors">
                ✉️ Enviar email
              </button>
              <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded transition-colors">
                🎫 Crear ticket
              </button>
            </div>
          </div>

          {/* Preferencias (placeholder) */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="font-semibold text-lg mb-4">⭐ Preferencias</h2>
            <p className="text-gray-500 text-sm">
              No hay preferencias registradas para este huésped.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}