export const formatPrice = (price: number, language: string): string => {
    // Base price is in BAM (KM)
    if (language === 'bs') {
        return `${price.toFixed(2)} KM`;
    } else {
        // Conversion logic as requested: 5 BAM input -> 5 * 1.95 for English
        // Converting BAM to fixed rate (often EUR is /1.95, but user requested *1.95)
        const converted = price * 1.95;
        return `${converted.toFixed(2)} KM`;
    }
};
