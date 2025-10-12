// 📍 src/app/(dashboard)/page.tsx
import React from 'react';
import MetricCard from ' @/components/MetricCard';

// Datos mock para las métricas
const metricsData = [
  {
    titulo: 'Huéspedes Activos',
    valor: 24,
    cambioPorcentaje: 8,
    tipo: 'success' as const,
    icono: '👥'
  },
  {
    titulo: 'Ocupación Actual',
    valor: '85%',
    cambioPorcentaje: 5,
    tipo: 'primary' as const,
    icono: '🏨'
  },
  {
    titulo: 'Check-ins Hoy',
    valor: 8,
    cambioPorcentaje: -2,
    tipo: 'warning' as const,
    icono: '✅'
  },
  {
    titulo: 'Ingresos del Día',
    valor: '$45,600',
    cambioPorcentaje: 15,
    tipo: 'success' as const,
    icono: '💰'
  },
];

export default function DashboardPage() {
  return (
    <div>
      {/* Bienvenida */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          ¡Bienvenido de vuelta! 👋
        </h1>
        <p className="text-gray-600">
          Aquí tienes un resumen de la operación de hoy
        </p>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metricsData.map((metric, index) => (
          <MetricCard
            key={index}
            titulo={metric.titulo}
            valor={metric.valor}
            cambioPorcentaje={metric.cambioPorcentaje}
            tipo={metric.tipo}
            icono={<span className="text-2xl">{metric.icono}</span>}
          />
        ))}
      </div>

      {/* Contenido adicional del dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reservas Recientes */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">📅 Reservas Recientes</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">RES-001 - Carlos Rodríguez</p>
                <p className="text-sm text-gray-600">Hoy - 3 noches</p>
              </div>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                Confirmada
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">RES-002 - María González</p>
                <p className="text-sm text-gray-600">Mañana - 2 noches</p>
              </div>
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                Pendiente
              </span>
            </div>
          </div>
        </div>

        {/* Tickets Pendientes */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">🎫 Tickets Pendientes</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-red-50 rounded">
              <div>
                <p className="font-medium">Limpieza urgente - Unidad A101</p>
                <p className="text-sm text-gray-600">Alta prioridad</p>
              </div>
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                Urgente
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
              <div>
                <p className="font-medium">Mantenimiento AC - Unidad B205</p>
                <p className="text-sm text-gray-600">Media prioridad</p>
              </div>
              <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                Pendiente
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}