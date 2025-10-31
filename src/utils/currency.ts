import { Currency } from '../types';

export const MOCK_RATES: Record<Currency, number> = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 157,
};

export const formatCurrency = (priceInUsd: number, currency: Currency): string => {
    const rate = MOCK_RATES[currency];
    const convertedPrice = priceInUsd * rate;

    const formatter = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: currency === 'JPY' ? 0 : 2,
        maximumFractionDigits: currency === 'JPY' ? 0 : 2,
    });

    return formatter.format(convertedPrice);
};
