// 📍 src/app/(dashboard)/huespedes/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Huesped } from ' @/types/huesped';

// Datos mock de huéspedes
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
  },
  {
    id: '3', 
    nombre: 'Juan Pérez',
    email: 'juan@email.com',
    telefono: '+54 11 5555-4444',
    nacionalidad: 'Chileno'
  },
  {
    id: '4',
    nombre: 'Ana López',
    email: 'ana@email.com',
    telefono: '+54 11 3333-2222',
    nacionalidad: 'Argentino'
  }
];

export default function HuespedesPage() {
  const [huespedes, setHuespedes] = useState<Huesped[]>(huespedesMock);
  const [busqueda, setBusqueda] = useState('');
  const [filtroNacionalidad, setFiltroNacionalidad] = useState('todos');

  // Filtrar huéspedes
  const huespedesFiltrados = huespedes.filter(huesped => {
    const coincideBusqueda = 
      huesped.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      huesped.email.toLowerCase().includes(busqueda.toLowerCase())
    
    const coincideNacionalidad = 
      filtroNacionalidad === 'todos' || huesped.nacionalidad === filtroNacionalidad;
    
    return coincideBusqueda && coincideNacionalidad;
  });

  // Obtener nacionalidades únicas para el filtro
  const nacionalidades = Array.from(new Set(huespedes.map(h => h.nacionalidad)));

  const eliminarHuesped = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este huésped?')) {
      setHuespedes(huespedes.filter(h => h.id !== id));
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">👥 Gestión de Huéspedes</h1>
          <p className="text-gray-600">Administra la información de todos los huéspedes</p>
        </div>
        <Link
          href="/huespedes/nuevo"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          + Nuevo Huésped
        </Link>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-gray-600">Total Huéspedes</h3>
          <p className="text-2xl font-bold">{huespedes.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-gray-600">Argentinos</h3>
          <p className="text-2xl font-bold text-blue-600">
            {huespedes.filter(h => h.nacionalidad === 'Argentino').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-gray-600">Extranjeros</h3>
          <p className="text-2xl font-bold text-green-600">
            {huespedes.filter(h => h.nacionalidad !== 'Argentino').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-gray-600">Activos</h3>
          <p className="text-2xl font-bold text-purple-600">{huespedes.length}</p>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por nombre, email o documento..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filtroNacionalidad}
            onChange={(e) => setFiltroNacionalidad(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todas las nacionalidades</option>
            {nacionalidades.map(nacionalidad => (
              <option key={nacionalidad} value={nacionalidad}>
                {nacionalidad}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Huéspedes */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <h2 className="font-semibold">
            Lista de Huéspedes ({huespedesFiltrados.length})
          </h2>
        </div>
        
        {huespedesFiltrados.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No se encontraron huéspedes que coincidan con los filtros</p>
          </div>
        ) : (
          <div className="divide-y">
            {huespedesFiltrados.map((huesped) => (
              <div key={huesped.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {huesped.nombre.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{huesped.nombre}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <span>📧 {huesped.email}</span>
                          <span>📞 {huesped.telefono}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {huesped.nacionalidad}
                    </span>
                    <Link
                      href={`/huespedes/${huesped.id}`}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Ver
                    </Link>
                    <button
                      onClick={() => eliminarHuesped(huesped.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}