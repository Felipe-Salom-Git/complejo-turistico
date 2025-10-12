// 📍 src/app/(dashboard)/reservas/[id]/page.tsx
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Simulamos fetch de reserva individual
async function getReserva(id: string) {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const reservas = [
    {
      id: '1',
      numeroReserva: 'RES-001',
      huesped: 'Carlos Rodríguez',
      email: 'carlos@email.com',
      telefono: '+54 11 1234-5678',
      fechaEntrada: '2024-01-15',
      fechaSalida: '2024-01-20',
      noches: 5,
      estado: 'confirmada' as const,
      montoTotal: 750,
      seniaPagada: 150,
      saldoPendiente: 600,
      metodoPago: 'transferencia' as const,
      observaciones: 'Huésped solicita check-in temprano'
    }
  ];
  
  return reservas.find(r => r.id === id);
}

interface PageProps {
  params: {
    id: string;
  };
}

export default async function DetalleReservaPage({ params }: PageProps) {
  const reserva = await getReserva(params.id);
  
  if (!reserva) {
    notFound();
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Link 
              href="/reservas"
              className="text-blue-500 hover:text-blue-700"
            >
              ← Volver a reservas
            </Link>
          </div>
          <h1 className="text-2xl font-bold">{reserva.numeroReserva}</h1>
          <p className="text-gray-600">Detalles de la reserva</p>
        </div>
        
        <div className="flex space-x-2">
          <Link
            href={`/reservas/${reserva.id}/editar`}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Editar
          </Link>
          <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">
            Check-in
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tarjeta de Huésped */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="font-semibold text-lg mb-4">👤 Información del Huésped</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Nombre completo</label>
                <p className="font-medium">{reserva.huesped}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="font-medium">{reserva.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Teléfono</label>
                <p className="font-medium">{reserva.telefono}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Estado</label>
                <span className={`inline-block px-2 py-1 rounded text-xs ${
                  reserva.estado === 'confirmada' ? 'bg-green-100 text-green-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {reserva.estado}
                </span>
              </div>
            </div>
          </div>

          {/* Tarjeta de Fechas */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="font-semibold text-lg mb-4">📅 Detalles de la Estadía</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-500">Check-in</label>
                <p className="font-medium">{reserva.fechaEntrada}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Check-out</label>
                <p className="font-medium">{reserva.fechaSalida}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Noches</label>
                <p className="font-medium">{reserva.noches}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tarjeta de Pagos */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="font-semibold text-lg mb-4">💰 Pagos</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total reserva:</span>
                <span className="font-bold">${reserva.montoTotal}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Seña pagada:</span>
                <span>${reserva.seniaPagada}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Saldo pendiente:</span>
                <span>${reserva.saldoPendiente}</span>
              </div>
              <div className="pt-2 border-t">
                <span className="text-sm text-gray-500">
                  Método: {reserva.metodoPago}
                </span>
              </div>
            </div>
          </div>

          {/* Observaciones */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="font-semibold text-lg mb-4">📝 Observaciones</h2>
            <p className="text-gray-700">{reserva.observaciones}</p>
          </div>
        </div>
      </div>
    </div>
  );
}