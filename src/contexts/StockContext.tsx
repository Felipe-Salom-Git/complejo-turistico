'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FireExtinguisher, GeneralStockItem, MaintenanceItem, BlancoItem, KitchenItem, LaundryDay } from '@/types/stock';
import { MOCK_MATAFUEGOS, MOCK_MINUTAS, MOCK_LIMPIEZA, MOCK_MANTENIMIENTO, MOCK_BLANCOS, MOCK_SPARE_ITEMS, MOCK_UNIT_ITEMS } from '@/lib/mock-stock';

interface StockContextType {
    matafuegos: FireExtinguisher[];
    addMatafuego: (item: Omit<FireExtinguisher, 'id'>) => void;
    updateMatafuego: (id: string, item: Partial<FireExtinguisher>) => void;
    deleteMatafuego: (id: string) => void;

    minutas: GeneralStockItem[];
    addMinuta: (item: Omit<GeneralStockItem, 'id'>) => void;
    updateMinuta: (id: string, item: Partial<GeneralStockItem>) => void;
    deleteMinuta: (id: string) => void;

    limpieza: GeneralStockItem[];
    addLimpieza: (item: Omit<GeneralStockItem, 'id'>) => void;
    updateLimpieza: (id: string, item: Partial<GeneralStockItem>) => void;
    deleteLimpieza: (id: string) => void;

    mantenimiento: MaintenanceItem[];
    addMantenimiento: (item: Omit<MaintenanceItem, 'id'>) => void;
    updateMantenimiento: (id: string, item: Partial<MaintenanceItem>) => void;
    deleteMantenimiento: (id: string) => void;

    blancos: BlancoItem[];
    addBlanco: (item: Omit<BlancoItem, 'id'>) => void;
    updateBlanco: (id: string, item: Partial<BlancoItem>) => void;
    deleteBlanco: (id: string) => void;

    cocinaRepuestos: KitchenItem[];
    addCocinaRepuesto: (item: Omit<KitchenItem, 'id'>) => void;
    updateCocinaRepuesto: (id: string, item: Partial<KitchenItem>) => void;
    deleteCocinaRepuesto: (id: string) => void;

    cocinaUnidades: KitchenItem[];
    addCocinaUnidad: (item: Omit<KitchenItem, 'id'>) => void;
    updateCocinaUnidad: (id: string, item: Partial<KitchenItem>) => void;
    deleteCocinaUnidad: (id: string) => void;

    laundryDays: LaundryDay[];
    addLaundryDay: (item: Omit<LaundryDay, 'id'>) => void;
    updateLaundryDay: (id: string, item: Partial<LaundryDay>) => void;
    deleteLaundryDay: (id: string) => void;
}

const StockContext = createContext<StockContextType | undefined>(undefined);

export function StockProvider({ children }: { children: ReactNode }) {
    // Helper to calculate status based on date
    const calculateStatus = (item: FireExtinguisher): FireExtinguisher['status'] => {
        if (item.status === 'Préstamo') return 'Préstamo';

        const today = new Date();
        const expiration = new Date(item.expirationDate);
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);

        if (expiration < today) {
            return 'Vencido';
        } else if (expiration <= thirtyDaysFromNow) {
            return 'Por Vencer';
        }
        return 'Vigente';
    };

    // Initialize with recalculated statuses
    const [matafuegos, setMatafuegos] = useState<FireExtinguisher[]>(() => {
        return MOCK_MATAFUEGOS.map(item => ({
            ...item,
            status: calculateStatus(item)
        }));
    });

    const [minutas, setMinutas] = useState<GeneralStockItem[]>(MOCK_MINUTAS);
    const [limpieza, setLimpieza] = useState<GeneralStockItem[]>(MOCK_LIMPIEZA);

    const [mantenimiento, setMantenimiento] = useState<MaintenanceItem[]>(MOCK_MANTENIMIENTO);

    // Using mock data from BlancosTab originally, but moving here
    const [laundryDays, setLaundryDays] = useState<LaundryDay[]>([
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
    ]);


    const addMatafuego = (item: Omit<FireExtinguisher, 'id'>) => {
        const newItem: FireExtinguisher = {
            ...item,
            id: Math.random().toString(36).substr(2, 9),
            // Ensure status is consistent with date unless explicitly set to Préstamo
            status: item.status === 'Préstamo' ? 'Préstamo' : calculateStatus(item as FireExtinguisher)
        };
        setMatafuegos((prev) => [...prev, newItem]);
    };

    const updateMatafuego = (id: string, updatedData: Partial<FireExtinguisher>) => {
        setMatafuegos((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const merged = { ...item, ...updatedData };
                    // Recalculate status if not Préstamo
                    const newStatus = merged.status === 'Préstamo' ? 'Préstamo' : calculateStatus(merged);
                    return { ...merged, status: newStatus };
                }
                return item;
            })
        );
    };

    const deleteMatafuego = (id: string) => {
        setMatafuegos((prev) => prev.filter((item) => item.id !== id));
    };

    // --- MINUTAS ---
    const addMinuta = (item: Omit<GeneralStockItem, 'id'>) => {
        const newItem: GeneralStockItem = {
            ...item,
            id: Math.random().toString(36).substr(2, 9),
        };
        setMinutas((prev) => [...prev, newItem]);
    }

    const updateMinuta = (id: string, updatedData: Partial<GeneralStockItem>) => {
        setMinutas((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item)));
    };

    const deleteMinuta = (id: string) => {
        setMinutas((prev) => prev.filter((item) => item.id !== id));
    };

    // --- LIMPIEZA ---
    const addLimpieza = (item: Omit<GeneralStockItem, 'id'>) => {
        const newItem: GeneralStockItem = {
            ...item,
            id: Math.random().toString(36).substr(2, 9),
        };
        setLimpieza((prev) => [...prev, newItem]);
    }

    const updateLimpieza = (id: string, updatedData: Partial<GeneralStockItem>) => {
        setLimpieza((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item)));
    };

    const deleteLimpieza = (id: string) => {
        setLimpieza((prev) => prev.filter((item) => item.id !== id));
    };

    // --- MANTENIMIENTO ---
    const addMantenimiento = (item: Omit<MaintenanceItem, 'id'>) => {
        const newItem: MaintenanceItem = {
            ...item,
            id: Math.random().toString(36).substr(2, 9),
        };
        setMantenimiento((prev) => [...prev, newItem]);
    }

    const updateMantenimiento = (id: string, updatedData: Partial<MaintenanceItem>) => {
        setMantenimiento((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item)));
    };

    const deleteMantenimiento = (id: string) => {
        setMantenimiento((prev) => prev.filter((item) => item.id !== id));
    };

    // --- BLANCOS ---
    const [blancos, setBlancos] = useState<BlancoItem[]>(MOCK_BLANCOS);

    const addBlanco = (item: Omit<BlancoItem, 'id'>) => {
        const newItem: BlancoItem = {
            ...item,
            id: Math.random().toString(36).substr(2, 9),
        };
        setBlancos((prev) => [...prev, newItem]);
    };

    const updateBlanco = (id: string, updatedData: Partial<BlancoItem>) => {
        setBlancos((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item)));
    };

    const deleteBlanco = (id: string) => {
        setBlancos((prev) => prev.filter((item) => item.id !== id));
    };

    // --- COCINA REPUESTOS ---
    const [cocinaRepuestos, setCocinaRepuestos] = useState<KitchenItem[]>(MOCK_SPARE_ITEMS);

    const addCocinaRepuesto = (item: Omit<KitchenItem, 'id'>) => {
        const newItem: KitchenItem = {
            ...item,
            id: Math.random().toString(36).substr(2, 9),
        };
        setCocinaRepuestos((prev) => [...prev, newItem]);
    };

    const updateCocinaRepuesto = (id: string, updatedData: Partial<KitchenItem>) => {
        setCocinaRepuestos((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item)));
    };

    const deleteCocinaRepuesto = (id: string) => {
        setCocinaRepuestos((prev) => prev.filter((item) => item.id !== id));
    };

    // --- COCINA UNIDADES ---
    const [cocinaUnidades, setCocinaUnidades] = useState<KitchenItem[]>(MOCK_UNIT_ITEMS);

    const addCocinaUnidad = (item: Omit<KitchenItem, 'id'>) => {
        const newItem: KitchenItem = {
            ...item,
            id: Math.random().toString(36).substr(2, 9),
        };
        setCocinaUnidades((prev) => [...prev, newItem]);
    };

    const updateCocinaUnidad = (id: string, updatedData: Partial<KitchenItem>) => {
        setCocinaUnidades((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item)));
    };

    const deleteCocinaUnidad = (id: string) => {
        setCocinaUnidades((prev) => prev.filter((item) => item.id !== id));
    };

    // --- LAUNDRY DAYS ---
    const addLaundryDay = (item: Omit<LaundryDay, 'id'>) => {
        const newItem: LaundryDay = {
            ...item,
            id: Math.random().toString(36).substr(2, 9),
        };
        setLaundryDays((prev) => [newItem, ...prev]);
    };

    const updateLaundryDay = (id: string, updatedData: Partial<LaundryDay>) => {
        setLaundryDays((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item)));
    };

    const deleteLaundryDay = (id: string) => {
        setLaundryDays((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <StockContext.Provider value={{
            matafuegos, addMatafuego, updateMatafuego, deleteMatafuego,
            minutas, addMinuta, updateMinuta, deleteMinuta,
            limpieza, addLimpieza, updateLimpieza, deleteLimpieza,
            mantenimiento, addMantenimiento, updateMantenimiento, deleteMantenimiento,
            blancos, addBlanco, updateBlanco, deleteBlanco,
            cocinaRepuestos, addCocinaRepuesto, updateCocinaRepuesto, deleteCocinaRepuesto,
            cocinaUnidades, addCocinaUnidad, updateCocinaUnidad, deleteCocinaUnidad,
            laundryDays, addLaundryDay, updateLaundryDay, deleteLaundryDay
        }}>
            {children}
        </StockContext.Provider>
    );
}

export function useStock() {
    const context = useContext(StockContext);
    if (context === undefined) {
        throw new Error('useStock must be used within a StockProvider');
    }
    return context;
}
