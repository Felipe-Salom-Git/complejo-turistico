export interface Unit {
    id: string;
    name: string;
    type: string;
    complex: "Las Gaviotas" | "La Fontana";
}

export const UNITS: Unit[] = (() => {
    const units: Unit[] = [];

    // Las Gaviotas: 1-20
    for (let i = 1; i <= 20; i++) {
        units.push({
            id: `gaviotas-${i}`,
            name: `LG-${i}`,
            type: i <= 10 ? "Cabaña" : "Apartamento",
            complex: "Las Gaviotas"
        });
    }

    // La Fontana: 1-7
    for (let i = 1; i <= 7; i++) {
        units.push({
            id: `fontana-${i}`,
            name: `LF-${i}`,
            type: i <= 4 ? "Suite" : "Cabaña",
            complex: "La Fontana"
        });
    }

    return units;
})();
