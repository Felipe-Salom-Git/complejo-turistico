export type TipoDocumento = 'dni' | 'pasaporte' | 'cedula';

export interface Documento {
        tipo: TipoDocumento;
        numero: string;
        dorso: string;
        reverso: string;
}

export interface Vehiculo {
        marca: string;
        modelo: string;
        color: string;
        patente: string;
    }

    export interface Huesped {
    id: string;
    nombre: string;
    email: string;
    telefono: string;
    nacionalidad: string;
    documento?: Documento;
    vehiculo?: Vehiculo;
}
