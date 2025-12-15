import { BlancoItem, FireExtinguisher, KitchenItem, LaundryDay, LimpiezaItem, MaintenanceItem, MinutaItem } from '@/types/stock';

export const MOCK_BLANCOS: BlancoItem[] = [
    { id: '1', name: 'Toallas Blancas', category: 'Toallas', totalStock: 50, laundryStock: 0, availableStock: 50, minStock: 20, lastUpdate: '2023-10-01' },
    { id: '2', name: 'Sábanas Queen', category: 'Sábanas', totalStock: 30, laundryStock: 0, availableStock: 30, minStock: 10, lastUpdate: '2023-10-02' },
];

export const MOCK_LAUNDRY_DAYS: LaundryDay[] = [
    {
        id: '1',
        date: '2023-10-15',
        items: [
            { itemName: 'Sábanas Queen', sentQuantity: 10, returnedQuantity: 10 },
            { itemName: 'Toallas Blancas', sentQuantity: 15, returnedQuantity: 10 }
        ],
        timestamp: '2023-10-15T10:00:00Z',
        user: 'Admin',
        status: 'Parcial',
        notes: 'Faltan 5 toallas por devolver'
    },
];

export const MOCK_MATAFUEGOS: FireExtinguisher[] = [
    { id: '1', location: 'Recepción', type: 'ABC 5kg', expirationDate: '2024-05-15', status: 'Vigente' },
    { id: '2', location: 'Cocina', type: 'K', expirationDate: '2023-12-01', status: 'Por Vencer' },
    { id: '3', location: 'Quincho', type: 'ABC 5kg', expirationDate: '2023-01-01', status: 'Vencido' },
];

export const MOCK_UNIT_ITEMS: KitchenItem[] = [
    { id: '1', name: 'Olla Grande', unitId: 'LG-1', quantity: 1, status: 'Bueno' },
    { id: '2', name: 'Juego Cubiertos', unitId: 'LG-1', quantity: 6, status: 'Regular' },
    { id: '3', name: 'Sartén', unitId: 'LF-1', quantity: 1, status: 'Bueno' },
];

export const MOCK_SPARE_ITEMS: KitchenItem[] = [
    { id: '101', name: 'Vaso Vidrio', quantity: 12, status: 'Bueno' },
    { id: '102', name: 'Plato Playo', quantity: 4, status: 'Bueno' }, // Low stock check (default threshold 5)
];

export const MOCK_MANTENIMIENTO: MaintenanceItem[] = [
    { id: '1', name: 'Veneno Hormigas', category: 'Jardín', stock: 5, minStock: 2, observations: 'Usar con precaución' },
    { id: '2', name: 'Focos LED', category: 'Electricidad', stock: 12, minStock: 10 },
    { id: '3', name: 'Tornillos', category: 'Ferretería', stock: 0, minStock: 50 },
];

export const MOCK_MINUTAS: MinutaItem[] = [
    { id: '1', name: 'Papel Higiénico', category: 'Baño', quantity: 150, lastUpdate: '2023-10-15' },
    { id: '2', name: 'Jabón de Tocador', category: 'Baño', quantity: 80, lastUpdate: '2023-10-14' },
    { id: '3', name: 'Café (Sobres)', category: 'Desayuno', quantity: 3, observations: 'Marca Dolca', lastUpdate: '2023-10-15' }, // Should trigger alert (default 5)
];

export const MOCK_LIMPIEZA: LimpiezaItem[] = [
    { id: '1', name: 'Lavandina', category: 'Químicos', quantity: 20, observations: 'Bidones 5L', lastUpdate: '2023-10-15' },
    { id: '2', name: 'Detergente', category: 'Químicos', quantity: 3, observations: 'Bidones 5L', lastUpdate: '2023-10-14' }, // Low stock
    { id: '3', name: 'Trapos de Piso', category: 'Textil', quantity: 50, lastUpdate: '2023-10-15' },
];
