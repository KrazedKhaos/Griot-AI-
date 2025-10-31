import React, { useState, useRef, useEffect } from 'react';
import { useCurrency } from '../hooks/useCurrency';
import { Currency } from '../types';
import { useTranslations } from '../hooks/useTranslations';

const CurrencySwitcher: React.FC = () => {
  const t = useTranslations();
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const currencies: { id: Currency, symbol: string }[] = [
    { id: 'USD', symbol: '$' },
    { id: 'EUR', symbol: '€' },
    { id: 'GBP', symbol: '£' },
    { id: 'JPY', symbol: '¥' },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    setIsOpen(false);
  };

  const currentSymbol = currencies.find(c => c.id === currency)?.symbol || '$';

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 p-2 rounded-md text-uc-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label={t.selectCurrency}
        title={t.selectCurrency}
      >
        <span className="text-sm font-semibold">{currentSymbol}</span>
        <span className="text-sm font-semibold">{currency}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-28 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 border dark:border-gray-700 animate-fade-in">
          <ul className="py-1">
            {currencies.map(({ id, symbol }) => (
              <li key={id}>
                <button
                  onClick={() => handleCurrencyChange(id)}
                  className="w-full text-left px-4 py-2 text-sm text-uc-text dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-between"
                >
                  <span>{id}</span>
                  <span>{symbol}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CurrencySwitcher;