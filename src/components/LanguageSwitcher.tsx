import React, { useContext, useState, useRef, useEffect } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { useTranslations } from '../hooks/useTranslations';

const LanguageSwitcher: React.FC = () => {
  const context = useContext(LanguageContext);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const t = useTranslations();

  if (!context) {
    return null;
  }

  const { language, setLanguage } = context;

  const languages = {
    en: 'EN',
    es: 'ES',
    fr: 'FR',
    de: 'DE',
    ja: 'JA',
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleLanguageChange = (lang: 'en' | 'es' | 'fr' | 'de' | 'ja') => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 p-2 rounded-md text-uc-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        title={t.selectLanguage}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM2 10a8 8 0 1116 0 8 8 0 01-16 0z" />
            <path d="M10 18a7.952 7.952 0 004.9-1.707l-1.83-1.83A6 6 0 014.243 4.243L2.5 2.5A8.026 8.026 0 002 10c0 .341.022.678.064 1.007l1.764-1.764A6.02 6.02 0 0110 4v.054L8.243 2.293a8.001 8.001 0 001.758-.292zM17.5 17.5l-2.5-2.5A8.026 8.026 0 0018 10a8.002 8.002 0 00-2.293-5.757L17.707 2.24A7.952 7.952 0 0110 18a7.952 7.952 0 005.757-2.293z" />
        </svg>
        <span className="text-sm font-semibold">{languages[language]}</span>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-28 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 border dark:border-gray-700 animate-fade-in">
          <ul className="py-1">
            {Object.entries(languages).map(([langCode, langName]) => (
              <li key={langCode}>
                <button
                  onClick={() => handleLanguageChange(langCode as 'en' | 'es' | 'fr' | 'de' | 'ja')}
                  className="w-full text-left px-4 py-2 text-sm text-uc-text dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {langName}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;