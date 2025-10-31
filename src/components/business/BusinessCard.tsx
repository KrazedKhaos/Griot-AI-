import React from 'react';
import { Business } from '../../types';
import { useTranslations } from '../../hooks/useTranslations';

interface BusinessCardProps {
    business: Business;
    onBusinessClick: (business: Business) => void;
    isConnected: boolean;
    onConnectToggle: (businessId: string) => void;
    view?: 'grid' | 'list';
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business, onBusinessClick, isConnected, onConnectToggle, view = 'grid' }) => {
    const t = useTranslations();
    const handleConnectClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onConnectToggle(business.id);
    };

    if (view === 'list') {
        return (
            <div
                onClick={() => onBusinessClick(business)}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg dark:hover:shadow-gray-700/50 transition-shadow duration-300 flex cursor-pointer"
            >
                <div className="relative w-24 h-24 flex-shrink-0">
                    <img loading="lazy" className="absolute inset-0 w-full h-full object-cover" src={business.logoUrl} alt={`${business.name} logo`} />
                </div>
                <div className="p-3 flex flex-col justify-center flex-grow">
                    <p className="text-xs font-semibold text-uc-primary uppercase tracking-wide">{business.category}</p>
                    <h3 className="mt-1 text-base leading-tight font-semibold text-uc-secondary dark:text-gray-100 hover:underline">
                        {business.name}
                    </h3>
                    <p className="mt-1 text-sm text-uc-text dark:text-gray-300" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {business.tagline}
                    </p>
                </div>
                <div className="p-3 flex items-center">
                    <button
                        onClick={handleConnectClick}
                        className={`px-3 py-1.5 text-xs font-bold rounded-full transition-colors ${isConnected ? 'bg-uc-primary/10 text-uc-primary' : 'bg-gray-200 dark:bg-gray-700 text-uc-text dark:text-gray-200'}`}
                    >
                        {isConnected ? t.connected : t.connect}
                    </button>
                </div>
            </div>
        );
    }
    
    // Grid View (default)
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg dark:hover:shadow-gray-700/50 transition-shadow duration-300 flex flex-col">
            <div className="cursor-pointer p-4 flex-grow" onClick={() => onBusinessClick(business)}>
                <div className="flex items-center space-x-4">
                    <img loading="lazy" className="h-16 w-16 rounded-full object-cover" src={business.logoUrl} alt={`${business.name} logo`} />
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-uc-primary uppercase tracking-wide">{business.category}</p>
                        <h3 className="text-lg leading-tight font-bold text-uc-secondary dark:text-gray-100">
                            {business.name}
                        </h3>
                    </div>
                </div>
                <p className="mt-3 text-uc-text dark:text-gray-300 h-20 overflow-hidden">{business.description}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-700">
                <button
                    onClick={handleConnectClick}
                    className={`w-full font-bold py-2 px-4 rounded-lg transition-colors ${isConnected ? 'bg-uc-primary/10 text-uc-primary' : 'bg-uc-secondary text-white hover:bg-opacity-90'}`}
                >
                    {isConnected ? `✓ ${t.connected}` : `+ ${t.connect}`}
                </button>
            </div>
        </div>
    );
};

export default React.memo(BusinessCard);