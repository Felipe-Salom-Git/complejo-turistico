export interface BlancoItem {
    id: string;
    name: string;
    category: 'Sábanas' | 'Toallas' | 'Otros';
    totalStock: number;
    laundryStock: number;
    availableStock: number;
    minStock: number;
    lastUpdate: string;
}

export interface LaundryItem {
    itemName: string;
    sentQuantity: number;
    returnedQuantity: number;
}

export interface LaundryDay {
    id: string;
    date: string;
    items: LaundryItem[];
    notes?: string;
    timestamp: string;
    user: string;
    status: 'Pendiente' | 'Parcial' | 'Completo';
}

export interface FireExtinguisher {
    id: string;
    location: string; // e.g., "Unit 101" or "Reception"
    type: string; // e.g., "ABC", "CO2"
    expirationDate: string;
    status: 'Vigente' | 'Vencido' | 'Por Vencer' | 'Préstamo';
}

export interface KitchenItem {
    id: string;
    name: string;
    unitId?: string; // If associated with a specific unit
    quantity: number;
    status: 'Bueno' | 'Regular' | 'Malo';
}

export interface MaintenanceItem {
    id: string;
    name: string;
    category: string;
    stock: number;
    minStock: number;
    observations?: string;
}


export interface GeneralStockItem {
    id: string;
    name: string;
    category?: string;
    quantity: number;
    observations?: string;
    lastUpdate: string;
}

// Re-export as specific aliases for clarity in components
export type MinutaItem = GeneralStockItem;
export type LimpiezaItem = GeneralStockItem;

