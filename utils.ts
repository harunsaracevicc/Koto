
export const formatPrice = (price: number, language: string): string => {
    // Base price is in USD
    if (language === 'bs') {
        // Convert USD to BAM (approx 1 USD = 1.85 BAM)
        const converted = price * 1.85;
        // Format with comma as decimal separator for Bosnian? Or dot?
        // Bosnian usually uses comma, but let's stick to standard toFixed for now or use Intl.NumberFormat
        return `${converted.toFixed(2)} KM`;
    } else {
        // Convert USD to Euro (approx 1 USD = 0.95 EUR)
        const converted = price * 0.95;
        return `€${converted.toFixed(2)}`;
    }
};
