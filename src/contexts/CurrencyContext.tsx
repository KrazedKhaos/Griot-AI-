import React, { createContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Currency } from '../types';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

export const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const supportedCurrencies: Currency[] = ['USD', 'EUR', 'GBP', 'JPY'];

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>(() => {
    const savedCurrency = localStorage.getItem('currency');
    return (savedCurrency && supportedCurrencies.includes(savedCurrency as Currency) ? savedCurrency : 'USD') as Currency;
  });

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  const value = useMemo(() => ({
    currency,
    setCurrency,
  }), [currency]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};
