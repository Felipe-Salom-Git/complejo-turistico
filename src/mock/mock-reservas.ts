import { Reserva, EstadoReserva, PoliticaCancelacion, Plataforma } from '../types/reserva';
import { MontosReserva } from '../types/montosReserva';
import { Pago, FormaPago, ConceptoPago, DestinoPago } from '../types/pago';
import { mockHuespedes } from './mock-huespedes';

// Helper para crear fechas
const crearFecha = (diasSumar: number) => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + diasSumar);
  return fecha;
};

export const mockReservas: Reserva[] = [
  {
    id: 'R001',
    huespedId: mockHuespedes[0].id,
    huespedNombre: mockHuespedes[0].nombre, // María González
    fechaEntrada: crearFecha(5),
    fechaSalida: crearFecha(10),
    cantidadNoches: 5,
    observaciones: 'Llega tarde por vuelo. Prefiere piso alto.',
    responsable: 'Bianca',
    politicaCancelacion: "14 Días 100%" as PoliticaCancelacion,
    estado: "Pendiente" as EstadoReserva,
    mascota: "No",
    plataforma: "Airbnb" as Plataforma,
    pax: 2,
    unidad: "A",
    checkInPor: "",
    montos: {
      usd: {
        total: 500,
        precioDia: 100,
        cobrado: 150,
        saldo: 350
      },
      ars: {
        total: 450000,
        precioDia: 90000,
        cobrado: 135000,
        saldo: 315000
      }
    },
    pagos: [
      {
        id: 'P001',
        fecha: crearFecha(-7),
        formaPago: "Transferencia" as FormaPago,
        concepto: "Seña" as ConceptoPago,
        moneda: "USD",
        monto: 150,
        destino: "Bianca" as DestinoPago,
        comprobante: 'transferencia_001.pdf'
      }
    ],
    estadoPago: "Destino",
    fechaCreacion: crearFecha(-30),
    fechaModificacion: crearFecha(-1),
    creadoPor: "Bianca"
  },
  {
    id: 'R002',
        huespedId: mockHuespedes[1].id,
    huespedNombre: mockHuespedes[1].nombre, // Carlos Rodríguez
    fechaEntrada: crearFecha(2),
    fechaSalida: crearFecha(7),
    cantidadNoches: 5,
    observaciones: 'Celebra aniversario. Solicita cama matrimonial.',
    responsable: 'Bruno',
    politicaCancelacion: "2 Días 100%" as PoliticaCancelacion,
    estado: "Activa" as EstadoReserva,
    mascota: "No",
    plataforma: "Directa" as Plataforma,
    pax: 2,
    unidad: "B",
    checkInPor: "Bruno",
    montos: {
      usd: {
        total: 600,
        precioDia: 120,
        cobrado: 600,
        saldo: 0
      },
      ars: {
        total: 540000,
        precioDia: 108000,
        cobrado: 540000,
        saldo: 0
      }
    },
    pagos: [
      {
        id: 'P002',
        fecha: crearFecha(-15),
        formaPago: "MercadoPago" as FormaPago,
        concepto: "Seña" as ConceptoPago,
        moneda: "ARS",
        monto: 270000,
        destino: "Bruno" as DestinoPago
      },
      {
        id: 'P003',
        fecha: crearFecha(-1),
        formaPago: "Efectivo" as FormaPago,
        concepto: "Saldo" as ConceptoPago,
        moneda: "ARS",
        monto: 270000,
        destino: "Bruno" as DestinoPago
      }
    ],
    estadoPago: "Cobrada",
    fechaCreacion: crearFecha(-45),
    fechaModificacion: crearFecha(0),
    creadoPor: "Bruno"
  },
  {
    id: 'R003',
        huespedId: mockHuespedes[2].id,
    huespedNombre: mockHuespedes[2].nombre, // Ana Silva
    fechaEntrada: crearFecha(-10),
    fechaSalida: crearFecha(-5),
    cantidadNoches: 5,
    observaciones: 'Turista brasileña. Necesita información sobre tours.',
    responsable: 'Patricia',
    politicaCancelacion: "No Ref" as PoliticaCancelacion,
    estado: "Completada" as EstadoReserva,
    mascota: "Si",
    plataforma: "Booking" as Plataforma,
    pax: 3,
    unidad: "C+",
    checkInPor: "Patricia",
    montos: {
      usd: {
        total: 750,
        precioDia: 150,
        cobrado: 750,
        saldo: 0
      },
      ars: {
        total: 675000,
        precioDia: 135000,
        cobrado: 675000,
        saldo: 0
      }
    },
    pagos: [
      {
        id: 'P004',
        fecha: crearFecha(-20),
        formaPago: "Tarjeta" as FormaPago,
        concepto: "Check IN" as ConceptoPago,
        moneda: "USD",
        monto: 750,
        destino: "Patricia" as DestinoPago,
        comprobante: 'tarjeta_001.pdf'
      }
    ],
    estadoPago: "Cobrada",
    fechaCreacion: crearFecha(-60),
    fechaModificacion: crearFecha(-6),
    creadoPor: "Patricia"
  },
  {
    id: 'R004',
        huespedId: mockHuespedes[3].id,
    huespedNombre: mockHuespedes[3].nombre, // John Smith
    fechaEntrada: crearFecha(15),
    fechaSalida: crearFecha(25),
    cantidadNoches: 10,
    observaciones: 'Viaje de negocios. Necesita WiFi estable.',
    responsable: 'Robi',
    politicaCancelacion: "21 Días 100%" as PoliticaCancelacion,
    estado: "Pendiente" as EstadoReserva,
    mascota: "No",
    plataforma: "Expedia" as Plataforma,
    pax: 1,
    unidad: "D",
    checkInPor: "",
    montos: {
      usd: {
        total: 1200,
        precioDia: 120,
        cobrado: 0,
        saldo: 1200
      },
      ars: {
        total: 1080000,
        precioDia: 108000,
        cobrado: 0,
        saldo: 1080000
      }
    },
    pagos: [],
    estadoPago: "Destino",
    fechaCreacion: crearFecha(-10),
    fechaModificacion: crearFecha(-2),
    creadoPor: "Robi"
  },
  {
    id: 'R005',
       huespedId: mockHuespedes[4].id,
    huespedNombre: mockHuespedes[4].nombre, // Laura Martínez
    fechaEntrada: crearFecha(-3),
    fechaSalida: crearFecha(2),
    cantidadNoches: 5,
    observaciones: 'Reserva de última hora. Verificar disponibilidad.',
    responsable: 'Bianca',
    politicaCancelacion: "Prepaga" as PoliticaCancelacion,
    estado: "Activa" as EstadoReserva,
    mascota: "No",
    plataforma: "Directa" as Plataforma,
    pax: 4,
    unidad: "MA",
    checkInPor: "Bianca",
    montos: {
      usd: {
        total: 800,
        precioDia: 160,
        cobrado: 800,
        saldo: 0
      },
      ars: {
        total: 720000,
        precioDia: 144000,
        cobrado: 720000,
        saldo: 0
      }
    },
    pagos: [
      {
        id: 'P005',
        fecha: crearFecha(-4),
        formaPago: "Transferencia" as FormaPago,
        concepto: "Seña" as ConceptoPago,
        moneda: "ARS",
        monto: 720000,
        destino: "Bianca" as DestinoPago
      }
    ],
    estadoPago: "Prepaga",
    fechaCreacion: crearFecha(-5),
    fechaModificacion: crearFecha(-3),
    creadoPor: "Bianca"
  }
];