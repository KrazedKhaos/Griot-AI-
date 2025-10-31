import React from 'react';
import { Business } from '../../types';
import SectionHeader from '../common/SectionHeader';
import { useTranslations } from '../../hooks/useTranslations';

interface BusinessProfilePageProps {
    business: Business;
    isConnected: boolean;
    onConnectToggle: (businessId: string) => void;
}

const ConnectIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);
const ConnectedIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
);
const WebsiteIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c1.356 0 2.673-.11 3.955-.329a9.036 9.036 0 0 0-7.91 0M12 3c-1.356 0-2.673.11-3.955.329a9.036 9.036 0 0 0 7.91 0M12 3a9.004 9.004 0 0 0-8.716 6.747M12 3a9.004 9.004 0 0 1 8.716 6.747m-17.432 0h17.432" />
    </svg>
);

const BusinessProfilePage: React.FC<BusinessProfilePageProps> = ({ business, isConnected, onConnectToggle }) => {
    const t = useTranslations();

    return (
        <div>
            {/* Header section */}
            <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-4 left-4">
                    <button onClick={() => window.history.back()} className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition" aria-label={t.goBack} title={t.goBack}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                </div>
                <div className="absolute bottom-4 left-4 flex items-end space-x-4">
                    <img src={business.logoUrl} alt={`${business.name} logo`} className="w-24 h-24 rounded-2xl object-cover border-4 border-white dark:border-gray-800 shadow-lg" />
                    <div>
                        <h1 className="text-2xl font-bold text-white shadow-md">{business.name}</h1>
                        <p className="text-sm text-gray-200 font-medium shadow-sm">{business.tagline}</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6">
                <div className="bg-uc-light-gray dark:bg-gray-900 p-4 rounded-lg">
                    <p className="text-uc-text dark:text-gray-300 leading-relaxed">{business.description}</p>
                </div>

                <div>
                    <SectionHeader title={t.ourServices} isSubheading />
                    <div className="space-y-3 mt-4">
                        {business.services.map((service, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center space-x-3">
                                <div className="flex-shrink-0 bg-uc-primary/10 p-2 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-uc-primary" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zM9 12a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <p className="text-uc-text dark:text-gray-200 text-sm font-medium">{service}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
             <div className="sticky bottom-0 bg-white dark:bg-gray-800 p-4 border-t dark:border-gray-700 shadow-inner grid grid-cols-2 gap-4">
                <button
                    onClick={() => onConnectToggle(business.id)}
                    className={`flex items-center justify-center w-full font-bold py-3 px-4 rounded-lg transition-colors ${isConnected ? 'bg-uc-primary/10 text-uc-primary' : 'bg-uc-secondary text-white hover:bg-opacity-90'}`}
                    title={isConnected ? t.connected : t.connect}
                >
                    {isConnected ? <ConnectedIcon className="w-5 h-5 mr-2" /> : <ConnectIcon className="w-5 h-5 mr-2" />}
                    {isConnected ? t.connected : t.connect}
                </button>
                 <a 
                    href={business.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center w-full text-center bg-uc-primary text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-200"
                    title={t.visitWebsite}>
                    <WebsiteIcon className="w-5 h-5 mr-2" />
                    {t.visitWebsite}
                </a>
            </div>
        </div>
    );
};

export default BusinessProfilePage;