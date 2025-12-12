export interface ReservationFormData {
    // Datos principales
    fechaCarga: string;
    responsableCarga: string;
    politicaCancelacion: string;
    tipoUnidad: string; // ID de la unidad (ej: gaviotas-1)
    observaciones: string;

    // Fechas y huésped
    checkIn: string;
    checkOut: string;
    estadoReserva: string;
    responsableCheckIn: string;
    nombreHuesped: string;
    telefono: string;
    email: string;
    plataforma: string;
    cantidadPax: string;
    patenteVehiculo: string;
    traeMascota: boolean;

    // Valores y pagos
    valorNocheUSD: string;
    valorNocheARS: string;
    conceptoPago: string;
    formaPago: string;
    moneda: string;
    cuentaDestino: string;
    montoPagado: string;
}
