import { Reserva } from " @/types/reserva";
import { Card } from "./ui/card";
import { DollarSign, Calendar, XCircle, CheckCircle } from "lucide-react";

interface Reservation {
  estado: string;
  valorTotalUSD: number;
  valorTotalARS: number;
}

interface ReservationStatsProps {
  reservations: Reserva[];
}

export function ReservationStats({ reservations }: ReservationStatsProps) {
  const today = new Date().toDateString();
  
  const totalIngresoUSD = reservations
    .filter(r => r.estado === "Confirmada")
    .reduce((sum, r) => sum + r.montos.usd.total, 0);
    
  const totalIngresoARS = reservations
    .filter(r => r.estado === "Confirmada")
    .reduce((sum, r) => sum + r.montos.ars.total, 0);
    
  const reservasActivas = reservations.filter(r => r.estado === "Confirmada").length;
  
  const cancelacionesHoy = reservations.filter(r => 
    r.estado === "Cancelada" || r.estado === "Rembolsada"
  ).length;

  const stats = [
    {
      title: "Total Ingresos",
      value: `$${totalIngresoUSD.toLocaleString()} USD`,
      subtitle: `$${totalIngresoARS.toLocaleString()} ARS`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Reservas Activas",
      value: reservasActivas.toString(),
      subtitle: "Confirmadas",
      icon: CheckCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Cancelaciones",
      value: cancelacionesHoy.toString(),
      subtitle: "Hoy",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Total Reservas",
      value: reservations.length.toString(),
      subtitle: "En base de datos",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground mb-1">{stat.title}</p>
              <h3 className="mb-1">{stat.value}</h3>
              <p className="text-muted-foreground text-sm">{stat.subtitle}</p>
            </div>
            <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
              <stat.icon className="h-5 w-5" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
