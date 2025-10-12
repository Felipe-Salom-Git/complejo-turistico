import { Moneda } from "./shared";

export type FormaPago = "Efectivo" | "Transferencia" | "Tarjeta" | "MercadoPago";
export type ConceptoPago = "Seña" | "Check IN" | "Saldo" | "Reembolso";
export type DestinoPago = "Bianca" | "Bruno" | "Patricia" | "Robi" | "Tercero";

export interface Pago {
  id: string;
  fecha: Date;
  formaPago: FormaPago;
  concepto: ConceptoPago;
  moneda: Moneda;
  monto: number;
  destino: DestinoPago;
  comprobante?: string;
}