import React, { useState, useMemo } from 'react';
import { DatingProfile } from '../../types';
import { useTranslations } from '../../hooks/useTranslations';
import ProfileCard from '../connect/ProfileCard';

interface ConnectPageProps {
    profiles: DatingProfile[];
    matches: DatingProfile[];
    onMatch: (profile: DatingProfile) => void;
    navigate: (path: string) => void;
}

const ConnectPage: React.FC<ConnectPageProps> = ({ profiles, matches, onMatch, navigate }) => {
    const t = useTranslations();
    const [view, setView] = useState<'discover' | 'matches'>('discover');
    const [profileStack, setProfileStack] = useState(profiles);

    const handleSwipe = (profile: DatingProfile, action: 'like' | 'pass') => {
        // Remove profile from the top of the stack
        setProfileStack(prev => prev.slice(1));

        if (action === 'like') {
            onMatch(profile);
        }
    };
    
    const currentProfile = profileStack[0];

    return (
        <div className="flex flex-col h-full">
            {/* Header Tabs */}
            <div className="flex-shrink-0 p-2 bg-gray-100 dark:bg-gray-900/50">
                <div className="flex justify-center items-center space-x-1 p-1 bg-gray-200 dark:bg-gray-700 rounded-lg max-w-xs mx-auto">
                    <button
                        onClick={() => setView('discover')}
                        className={`w-full p-2 text-sm font-bold rounded-md transition-colors ${view === 'discover' ? 'bg-white dark:bg-gray-800 text-uc-primary shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                        {t.discover}
                    </button>
                    <button
                        onClick={() => setView('matches')}
                        className={`w-full p-2 text-sm font-bold rounded-md transition-colors relative ${view === 'matches' ? 'bg-white dark:bg-gray-800 text-uc-primary shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                        {t.matches}
                        {matches.length > 0 && (
                            <span className="absolute top-1 right-2 block h-2.5 w-2.5 rounded-full bg-uc-primary ring-2 ring-gray-200 dark:ring-gray-700" />
                        )}
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto">
                {view === 'discover' && (
                    <div className="p-4 h-full flex flex-col">
                        {currentProfile ? (
                            <div className="flex-grow flex flex-col justify-center items-center">
                               <ProfileCard 
                                 profile={currentProfile} 
                                 onSwipe={handleSwipe}
                               />
                            </div>
                        ) : (
                            <div className="text-center py-20 flex-grow flex flex-col justify-center">
                                <h3 className="text-xl font-semibold text-uc-secondary dark:text-gray-100">{t.discoverEndTitle}</h3>
                                <p className="mt-1 text-base text-gray-500 dark:text-gray-400">{t.discoverEndMessage}</p>
                            </div>
                        )}
                    </div>
                )}
                {view === 'matches' && (
                    <div className="p-4 space-y-3">
                        {matches.length > 0 ? (
                           matches.map(match => (
                               <div key={match.id} onClick={() => navigate(`#/chat/${match.id}`)} className="flex items-center space-x-3 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                   <img src={match.photos[0]} alt={match.name} className="w-14 h-14 rounded-full object-cover" />
                                   <div>
                                       <p className="font-bold text-uc-secondary dark:text-white">{match.name}</p>
                                       <p className="text-sm text-green-500">{t.newMatch}</p>
                                   </div>
                               </div>
                           ))
                        ) : (
                             <div className="text-center py-20">
                                <h3 className="text-xl font-semibold text-uc-secondary dark:text-gray-100">{t.noMatchesTitle}</h3>
                                <p className="mt-1 text-base text-gray-500 dark:text-gray-400">{t.noMatchesMessage}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConnectPage;