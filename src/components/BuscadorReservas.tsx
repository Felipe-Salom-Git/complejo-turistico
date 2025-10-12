// 📍 src/components/BuscadorReservas.tsx
'use client'; // 👈 ESTO LO HACE CLIENT COMPONENT

import React, { useState } from 'react';

interface Reserva {
  id: string;
  numeroReserva: string;
  huesped: string;
  estado: string;
}

interface BuscadorReservasProps {
  reservas: Reserva[];
}

export const BuscadorReservas: React.FC<BuscadorReservasProps> = ({ reservas }) => {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');

  // Filtrado en el cliente
  const reservasFiltradas = reservas.filter((reserva) => {
    const coincideBusqueda = 
      reserva.numeroReserva.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      reserva.huesped.toLowerCase().includes(terminoBusqueda.toLowerCase());
    
    const coincideEstado = 
      filtroEstado === 'todos' || reserva.estado === filtroEstado;
    
    return coincideBusqueda && coincideEstado;
  });

  return (
    <div className="space-y-4">
      {/* Controles de filtro */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Buscar por número o huésped..."
          value={terminoBusqueda}
          onChange={(e) => setTerminoBusqueda(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="todos">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="confirmada">Confirmada</option>
          <option value="activa">Activa</option>
          <option value="completada">Completada</option>
          <option value="cancelada">Cancelada</option>
        </select>
      </div>

      {/* Resultados */}
      <div className="bg-white rounded-lg shadow-sm divide-y">
        {reservasFiltradas.map((reserva) => (
          <div key={reserva.id} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{reserva.numeroReserva}</h3>
                <p className="text-gray-600">{reserva.huesped}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                reserva.estado === 'confirmada' ? 'bg-green-100 text-green-800' :
                reserva.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                reserva.estado === 'activa' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {reserva.estado}
              </span>
            </div>
          </div>
        ))}
        
        {reservasFiltradas.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No se encontraron reservas que coincidan con los filtros
          </div>
        )}
      </div>
    </div>
  );
};