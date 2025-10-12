import { Huesped, TipoDocumento } from '../types/huesped';

export const mockHuespedes: Huesped[] = [
  {
    id: 'H001',
    nombre: 'María González',
    email: 'maria.gonzalez@email.com',
    telefono: '+5491155667788',
    nacionalidad: 'Argentina',
    documento: {
      tipo: 'dni' as TipoDocumento,
      numero: '35123456',
      dorso: 'dni_maria_dorso.jpg',
      reverso: 'dni_maria_reverso.jpg'
    },
    vehiculo: {
      marca: 'Toyota',
      modelo: 'Corolla',
      color: 'Blanco',
      patente: 'AB123CD'
    }
  },
  {
    id: 'H002',
    nombre: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@email.com',
    telefono: '+5491166778899',
    nacionalidad: 'Uruguay',
    documento: {
      tipo: 'cedula' as TipoDocumento,
      numero: '51234567',
      dorso: 'cedula_carlos_dorso.jpg',
      reverso: 'cedula_carlos_reverso.jpg'
    }
  },
  {
    id: 'H003',
    nombre: 'Ana Silva',
    email: 'ana.silva@email.com',
    telefono: '+5491188990011',
    nacionalidad: 'Brasil',
    documento: {
      tipo: 'pasaporte' as TipoDocumento,
      numero: 'BR123456789',
      dorso: 'pasaporte_ana_dorso.jpg',
      reverso: 'pasaporte_ana_reverso.jpg'
    },
    vehiculo: {
      marca: 'Volkswagen',
      modelo: 'Golf',
      color: 'Rojo',
      patente: 'EF456GH'
    }
  },
  {
    id: 'H004',
    nombre: 'John Smith',
    email: 'john.smith@email.com',
    telefono: '+15551234567',
    nacionalidad: 'Estados Unidos',
    documento: {
      tipo: 'pasaporte' as TipoDocumento,
      numero: 'US987654321',
      dorso: 'pasaporte_john_dorso.jpg',
      reverso: 'pasaporte_john_reverso.jpg'
    }
  },
  {
    id: 'H005',
    nombre: 'Laura Martínez',
    email: 'laura.martinez@email.com',
    telefono: '+5491133445566',
    nacionalidad: 'Argentina',
    documento: {
      tipo: 'dni' as TipoDocumento,
      numero: '38987654',
      dorso: 'dni_laura_dorso.jpg',
      reverso: 'dni_laura_reverso.jpg'
    },
    vehiculo: {
      marca: 'Ford',
      modelo: 'Focus',
      color: 'Azul',
      patente: 'IJ789KL'
    }
  }
];