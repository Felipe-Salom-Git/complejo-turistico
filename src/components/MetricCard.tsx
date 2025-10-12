// 📍 src/components/MetricCard.tsx
import React from 'react';

interface MetricCardProps {
  titulo: string;
  valor: number | string;
  icono?: React.ReactNode;
  tipo?: 'primary' | 'success' | 'warning' | 'danger';
  cambioPorcentaje?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({
  titulo,
  valor,
  icono,
  tipo = 'primary',
  cambioPorcentaje
}) => {
  const colores = {
    primary: 'border-l-blue-500',
    success: 'border-l-green-500',
    warning: 'border-l-yellow-500',
    danger: 'border-l-red-500'
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${colores[tipo]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{titulo}</p>
          <p className="text-2xl font-bold text-gray-900">{valor}</p>
          {cambioPorcentaje !== undefined && (
            <p className={`text-sm ${
              cambioPorcentaje >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {cambioPorcentaje >= 0 ? '↗' : '↘'} {Math.abs(cambioPorcentaje)}%
            </p>
          )}
        </div>
        {icono && <div className="text-gray-400 text-2xl">{icono}</div>}
      </div>
    </div>
  );
};

export default MetricCard;