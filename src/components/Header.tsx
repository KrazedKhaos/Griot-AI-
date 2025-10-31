import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslations } from '../hooks/useTranslations';
import CurrencySwitcher from './CurrencySwitcher';

const SunIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.95-4.243-1.591 1.591M5.25 12H3m4.243-4.95L6.343 5.636m1.591-1.591L12 6.75 13.657 5.06Z" />
    </svg>
);

const MoonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </svg>
);

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);


interface HeaderProps {
    onThemeToggle: () => void;
    theme: 'light' | 'dark';
}

const Header: React.FC<HeaderProps> = ({ onThemeToggle, theme }) => {
    const t = useTranslations();
    return (
        <header className="sticky top-0 bg-white dark:bg-uc-secondary shadow-md z-10 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-uc-secondary dark:text-white">Griot AI</h1>
                <div className="flex items-center space-x-1">
                    <a href="#/search" className="p-2 rounded-full text-uc-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label={t.search} title={t.search}>
                        <SearchIcon className="w-6 h-6" />
                    </a>
                    <CurrencySwitcher />
                    <LanguageSwitcher />
                    <button
                        onClick={onThemeToggle}
                        className="p-2 rounded-full text-uc-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label={t.toggleTheme}
                        title={t.toggleTheme}
                    >
                        {theme === 'light' ? (
                            <MoonIcon className="w-6 h-6" />
                        ) : (
                            <SunIcon className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;