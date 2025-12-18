export type CancellationPolicy =
    | 'NO_REF'
    | '14D_100'        // 14 days 100%
    | '14D_50'         // 14 days 50%
    | '21D_100'        // 21 days 100%
    | '2D_100'         // 2 days 100%
    | 'Pre-paga';      // Default prepaga

export const POLICIES: { value: CancellationPolicy; label: string }[] = [
    { value: 'NO_REF', label: 'No Reembolsable (Seña Obligatoria)' },
    { value: '14D_100', label: '100% 14 Días' },
    { value: '14D_50', label: '50% 14 Días' },
    { value: '21D_100', label: '100% 21 Días' },
    { value: '2D_100', label: '100% 2 Días' },
    { value: 'Pre-paga', label: 'Pre-paga (Abonada 100%)' }
];

export function getAlertDate(policy: string, checkInDate: Date | string): Date | null {
    const checkIn = new Date(checkInDate);

    // Safety check for invalid dates
    if (isNaN(checkIn.getTime())) return null;

    const alertDate = new Date(checkIn);

    switch (policy) {
        case 'NO_REF':
            // 30 days before Check-In
            alertDate.setDate(checkIn.getDate() - 30);
            return alertDate;
        case '14D_100':
        case '14D_50':
            // 14 days before Check-In
            alertDate.setDate(checkIn.getDate() - 14);
            return alertDate;
        case '21D_100':
            // 21 days before Check-In
            alertDate.setDate(checkIn.getDate() - 21);
            return alertDate;
        case '2D_100':
            // 2 days before Check-In
            alertDate.setDate(checkIn.getDate() - 2);
            return alertDate;
        case 'Pre-paga':
            // No alert needed for pre-paid
            return null;
        default:
            // Default behavior for unknown/legacy policies?
            // Conservative: Alert 7 days before? Or Null?
            // Let's return null to avoid noise on legacy data unless specified.
            return null;
    }
}

export function shouldShowPaymentAlert(
    policy: string | undefined,
    checkIn: Date | string,
    hasDownPayment: boolean,
    isPrepaid: boolean,
    currentDate: Date = new Date()
): boolean {
    // 1. If Prepaid or Has Down Payment (Seña) -> NO ALERT
    if (isPrepaid || hasDownPayment) return false;

    // 2. If no policy, we cannot calculate -> NO ALERT (or user preference?)
    if (!policy) return false;

    // 3. Calculate Alert Date
    const alertDate = getAlertDate(policy, checkIn);

    // 4. If no alert date (e.g. unknown policy) -> NO ALERT
    if (!alertDate) return false;

    // 5. Normalization for Date Comparison (Ignore Time)
    const today = new Date(currentDate);
    today.setHours(0, 0, 0, 0);

    const alertThreshold = new Date(alertDate);
    alertThreshold.setHours(0, 0, 0, 0);

    // 6. Check: Is Today >= AlertDate?
    // Example: Alert Date = Jan 1. Today = Jan 2. ALERT ACTIVE.
    return today >= alertThreshold;
}
