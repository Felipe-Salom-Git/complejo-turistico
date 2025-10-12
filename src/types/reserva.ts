import { MontosReserva } from "./montosReserva";
import { Pago } from "./pago";
import { Unidades, SiNo } from "./shared";

export type EstadoReserva  = "Pendiente" | "Activa" | "Completada" | "Cancelada" | "No-Show" | "Rembolsada" | "Reprogramada"
export type PoliticaCancelacion = "2 Días 100%" | "14 Días 50%" | "14 Días 100%" | "21 Días 100%" | "No Ref" | "Prepaga";
export type Plataforma = "Directa" | "Airbnb" | "Booking" | "Expedia" | "Pasante";

export interface Reserva {
  id: string;
  huespedId: string;
  huespedNombre: string;
  fechaEntrada: Date;
  fechaSalida: Date;
  cantidadNoches: number;
  observaciones: string;
  responsable: string;
  politicaCancelacion: PoliticaCancelacion;
  estado: EstadoReserva 
  mascota: SiNo;
  plataforma: Plataforma;
  pax: number;
  unidad: Unidades;
  checkInPor: string;
  montos: MontosReserva;
  pagos: Pago[];
  estadoPago: "Destino" | "Cobrada" | "Prepaga";
  fechaCreacion: Date;
  fechaModificacion: Date;
  creadoPor: string;
}