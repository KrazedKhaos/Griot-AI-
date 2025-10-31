import React, { useState } from 'react';
import { Business } from '../../types';

interface MapViewProps {
    businesses: Business[];
    onBusinessClick: (business: Business) => void;
}

const MapView: React.FC<MapViewProps> = ({ businesses, onBusinessClick }) => {
    const [activeBusiness, setActiveBusiness] = useState<Business | null>(null);

    // Bounding box for a world map to convert lat/lng to percentages
    // These are simplified for a Mercator projection feel
    const latToY = (lat: number) => ((-lat + 90) / 180) * 100;
    const lngToX = (lng: number) => ((lng + 180) / 360) * 100;

    return (
        <div className="w-full h-[70vh] md:h-[calc(100vh-250px)] bg-gray-300 dark:bg-gray-700 rounded-xl overflow-hidden relative shadow-inner">
            {/* Using a static map image as a base layer */}
            <img 
                src="https://raw.githubusercontent.com/python-visualization/folium-example-data/main/world_countries.json" 
                alt="World Map"
                className="w-full h-full object-cover opacity-20 dark:opacity-10" 
            />
            {businesses.map(business => {
                const top = `${latToY(business.location.lat)}%`;
                const left = `${lngToX(business.location.lng)}%`;
                const isActive = activeBusiness?.id === business.id;

                return (
                    <div key={business.id} className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ top, left }}>
                        <button
                            onMouseEnter={() => setActiveBusiness(business)}
                            onMouseLeave={() => setActiveBusiness(null)}
                            onClick={() => onBusinessClick(business)}
                            className="w-4 h-4 rounded-full bg-uc-primary border-2 border-white dark:border-gray-800 shadow-lg cursor-pointer transition-transform duration-200 hover:scale-150"
                            aria-label={`View ${business.name}`}
                        />
                        {isActive && (
                            <div className="absolute bottom-full mb-2 w-48 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-xl left-1/2 -translate-x-1/2 animate-fade-in text-center border dark:border-gray-600">
                                <img src={business.logoUrl} alt={business.name} className="w-8 h-8 rounded-full mx-auto mb-1" />
                                <p className="text-sm font-bold text-uc-secondary dark:text-white truncate">{business.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{business.tagline}</p>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default MapView;