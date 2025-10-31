import React, { useState } from 'react';
import { Business } from '../../types';
import SectionHeader from '../common/SectionHeader';
import BusinessCard from '../business/BusinessCard';
import MapView from '../business/MapView';
import { useTranslations } from '../../hooks/useTranslations';

interface BusinessesPageProps {
    businesses: Business[];
    onBusinessClick: (business: Business) => void;
    connectedBusinessIds: string[];
    onBusinessConnectToggle: (businessId: string) => void;
}

const BusinessesPage: React.FC<BusinessesPageProps> = ({ businesses, onBusinessClick, connectedBusinessIds, onBusinessConnectToggle }) => {
    const t = useTranslations();
    const [view, setView] = useState<'map' | 'list'>('list');

    return (
        <div className="p-4">
            <div className="flex justify-between items-center">
                <SectionHeader title={t.businesses} />
                <div className="flex items-center space-x-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <button
                        onClick={() => setView('list')}
                        className={`p-2 rounded-md transition-colors ${view === 'list' ? 'bg-white dark:bg-gray-800 text-uc-primary shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                        aria-label={t.listView}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setView('map')}
                        className={`p-2 rounded-md transition-colors ${view === 'map' ? 'bg-white dark:bg-gray-800 text-uc-primary shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                        aria-label={t.mapView}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12 1.5a.5.5 0 01.5.5v2.5a.5.5 0 01-1 0V2a.5.5 0 01.5-.5zM10 18.5a.5.5 0 01.5-.5h2.5a.5.5 0 010 1H10.5a.5.5 0 01-.5-.5zM4.5 12.5a.5.5 0 01-.5.5H2a.5.5 0 010-1h2.5a.5.5 0 01.5.5zM18 10a.5.5 0 01-.5.5h-2.5a.5.5 0 010-1H17.5a.5.5 0 01.5.5z" />
                            <path fillRule="evenodd" d="M10 2C5.03 2 1 6.03 1 11s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zM3 11a7 7 0 1114 0 7 7 0 01-14 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="mt-4">
                {view === 'list' ? (
                    <div className="grid grid-cols-1 gap-6">
                        {businesses.map(business => (
                            <BusinessCard
                                key={business.id}
                                business={business}
                                onBusinessClick={onBusinessClick}
                                isConnected={connectedBusinessIds.includes(business.id)}
                                onConnectToggle={onBusinessConnectToggle}
                                view="list"
                            />
                        ))}
                    </div>
                ) : (
                    <MapView businesses={businesses} onBusinessClick={onBusinessClick} />
                )}
            </div>
        </div>
    );
};

export default BusinessesPage;