import React, { createContext, useState, useEffect, useMemo, ReactNode } from 'react';
import en from '../translations/en.json';
import es from '../translations/es.json';
import fr from '../translations/fr.json';
import de from '../translations/de.json';
import ja from '../translations/ja.json';

type Language = 'en' | 'es' | 'fr' | 'de' | 'ja';
type Translations = typeof en;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Translations;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translationsData: Record<Language, Translations> = {
  en,
  es,
  fr,
  de,
  ja,
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem('language');
    return (savedLang && Object.keys(translationsData).includes(savedLang) ? savedLang : 'en') as Language;
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    translations: translationsData[language],
  }), [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};