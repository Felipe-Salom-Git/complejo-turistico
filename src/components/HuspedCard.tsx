import React from "react";
import { Huesped } from " @/types/huesped";

interface HuespedCardProps {
    huesped: Huesped;
    onEditar: (id: string) => void;
    onEliminar: (id: string) => void;
}

const HuespedCard: React.FC<HuespedCardProps> = ({
    huesped,
    onEditar,
    onEliminar
}) => {
    return(
        <div className="border rounded-lg p-4 mb-3 bg-white shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-semibold text-lg">{huesped.nombre}</h3>
                    <p className="text-gray-600">📧 {huesped.email}</p>
                    <p className="text-gray-600">📞 {huesped.telefono}</p>
                    <p className="text-gray-600">🆔 {huesped.documento}</p>
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-2">
                        {huesped.nacionalidad}
                    </span>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={()=> onEditar(huesped.id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
                            Editar
                    </button>
                    <button 
                        onClick={() => onEliminar(huesped.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm">
                            Eliminar
                    </button>
                </div>
            </div>
        </div>
    ); 
};

export default HuespedCard;