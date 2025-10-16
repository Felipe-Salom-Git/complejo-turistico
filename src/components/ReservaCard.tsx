import React from "react";
import { Reserva } from " @/types/reserva";

interface ReservaCardProps {
    reserva: Reserva;
    onCheckIn: (id: string) => void;
    onCheckOut: (id: string) => void;
    onCancelar: (id: string) => void;
}

const ReservaCard: React.FC<ReservaCardProps> = ({ 
    reserva,
    onCheckIn,
    onCheckOut,
    onCancelar
}) => {
    
    // Función para determinar el color según el estado
    const getEstadoColor = (estado: Reserva["estado"]) => {
        switch(estado) {
            case "Activa":
                return "bg-green-100 text-green-800";
            case "Pendiente":
                return "bg-yellow-100 text-yellow-800";
            case "Completada":
                return "bg-blue-100 text-blue-800";
            case "Cancelada":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="border rounded-lg p-4 mb-3 bg-white shadow-sm">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{reserva.huespedNombre}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${getEstadoColor(reserva.estado)}`}>
                            {reserva.estado.toUpperCase()}
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                            <p className="text-gray-500">Entrada:</p>
                            <p className="font-medium">{reserva.fechaEntrada.toLocaleDateString('es-ES')}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Salida:</p>
                            <p className="font-medium">{reserva.fechaSalida.toLocaleDateString('es-ES')}</p>
                        </div>
                    </div>
                    
                    <p className="text-lg font-bold text-gray-900 mt-2">
                        ${reserva.montos.ars.total.toLocaleString('es-ES')}
                    </p>
                                        <p className="text-lg font-bold text-gray-900 mt-2">
                        ${reserva.montos.usd.total.toLocaleString('es-ES')}
                    </p>
                </div>
                
                {/* Botones de acción - solo mostrar los relevantes según el estado */}
                <div className="flex flex-col space-y-2 ml-4">
                    {reserva.estado === "Pendiente" && (
                        <button
                            onClick={() => onCheckIn(reserva.id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                            Check-in
                        </button>
                    )}
                    
                    {reserva.estado === "Activa" && (
                        <button
                            onClick={() => onCheckOut(reserva.id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                            Check-out
                        </button>
                    )}
                    
                    {(reserva.estado === "Pendiente" || reserva.estado === "Activa") && (
                        <button
                            onClick={() => onCancelar(reserva.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReservaCard;