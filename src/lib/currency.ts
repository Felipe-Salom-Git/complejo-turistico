export interface ExchangeRates {
    BNA: number;
    PAYWAY: number;
}

export type CurrencySource = 'BNA_VENTA' | 'PAYWAY_TURISTA';

export async function fetchExchangeRates(): Promise<ExchangeRates> {
    try {
        const response = await fetch('https://dolarapi.com/v1/dolares');
        const data = await response.json();

        // Find Oficial (BNA) and Bolsa (MEP) for Payway Inbound
        // DolarAPI returns an array: [{casa: "oficial", ...}, {casa: "tarjeta", ...}, {casa: "bolsa", ...}]
        const oficial = data.find((d: any) => d.casa === 'oficial');
        // User requested "Turista" (not Tarjeta). For Inbound Tourism (Foreigners), Payway uses MEP (Bolsa).
        const turista = data.find((d: any) => d.casa === 'bolsa');

        return {
            BNA: oficial ? oficial.venta : 0,
            PAYWAY: turista ? turista.venta : 0
        };
    } catch (error) {
        console.error("Error fetching rates:", error);
        return { BNA: 0, PAYWAY: 0 };
    }
}
