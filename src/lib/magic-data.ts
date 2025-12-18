
export function getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

export function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const GUEST_NAMES = [
    "Juan Pérez", "María García", "Carlos López", "Ana Martínez", "Luis Rodríguez",
    "Elena Fernández", "José González", "Laura Sánchez", "Miguel Ángel", "Sofía Diaz",
    "John Smith", "Emma Johnson", "Michael Brown", "Olivia Davis", "William Miller"
];

export const CITIES = [
    "Buenos Aires", "Córdoba", "Rosario", "Mendoza", "Bariloche",
    "São Paulo", "Rio de Janeiro", "Santiago", "Montevideo", "New York", "London"
];

export const EMAILS = ["test@example.com", "guest@mail.com", "demo@user.com"];

export const UNITS = [
    "LG-1", "LG-2", "LG-3", "LG-4", "LG-5", "LG-6", "LG-7", "LG-8",
    "LG-9", "LG-10", "LG-11", "LG-12", "LG-13", "LG-14", "LG-15",
    "LG-16", "LG-17", "LG-18", "LG-19", "LG-20",
    "MA 1", "CM 2", "CC 3", "CF1 4", "CF2 5", "CF 6", "Torre 7"
];

export const SERVICE_TASKS = [
    "Limpieza profunda baño", "Reparar canilla", "Cambiar bombilla", "Revisar WiFi",
    "Limpieza vidrios", "Inventario vajilla", "Reparar cortina", "Pintar pared"
];

export const PASSENGER_COMMENTS = [
    "Late check-in", "Viene con mascota pequeña", "Requiere cuna", "Alergico al polvo",
    "Pide almohadas extra", "Sin sal", "Vehiculo grande"
];

export function generateRandomReservation() {
    const checkIn = new Date();
    // Random start date within next 30 days
    checkIn.setDate(checkIn.getDate() + getRandomInt(1, 30));

    const checkOut = new Date(checkIn);
    // Random duration 2-10 days
    checkOut.setDate(checkOut.getDate() + getRandomInt(2, 10));

    const isForeigner = Math.random() > 0.7; // 30% chance

    return {
        guestName: getRandomElement(GUEST_NAMES),
        checkIn: checkIn,
        checkOut: checkOut,
        unit: getRandomElement(UNITS),
        pax: getRandomInt(2, 6),
        email: getRandomElement(EMAILS),
        phone: `+54 9 11 ${getRandomInt(1000, 9999)}-${getRandomInt(1000, 9999)}`,
        city: getRandomElement(CITIES),
        nacionalidadTipo: isForeigner ? "EXTRANJERO" : "ARGENTINO",
        nacionalidad: isForeigner ? getRandomElement(["Brasil", "Chile", "Uruguay", "USA"]) : undefined,
        observations: Math.random() > 0.5 ? getRandomElement(PASSENGER_COMMENTS) : "",
        price: getRandomInt(300, 1500)
    };
}

export function generateRandomTask() {
    return {
        task: getRandomElement(SERVICE_TASKS),
        priority: getRandomElement(['baja', 'media', 'alta']),
        unit: getRandomElement(UNITS),
        notes: "Auto-generated task for testing."
    }
}
