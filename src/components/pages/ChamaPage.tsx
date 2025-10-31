import React from 'react';
import { Chama } from '../../types';
import { useTranslations } from '../../hooks/useTranslations';

interface ChamaPageProps {
    chamas: Chama[];
}

const ChamaCard: React.FC<{ chama: Chama }> = ({ chama }) => {
    const t = useTranslations();
    const progressPercentage = (chama.currentAmount / chama.goalAmount) * 100;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg dark:hover:shadow-gray-700/50 transition-shadow duration-300">
            <img className="h-40 w-full object-cover" src={chama.imageUrl} alt={chama.name} />
            <div className="p-4">
                <h3 className="text-lg font-bold text-uc-secondary dark:text-gray-100">{chama.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 h-10 overflow-hidden">{chama.description}</p>
                
                <div className="mt-4">
                    <div className="flex justify-between items-center text-sm font-semibold text-uc-secondary dark:text-gray-200">
                        <span>Progress</span>
                        <span>{progressPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-1">
                        <div className="bg-uc-primary h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                     <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>{chama.currentAmount.toLocaleString()} GRIO</span>
                        <span>{t.goal}: {chama.goalAmount.toLocaleString()} GRIO</span>
                    </div>
                </div>

                <div className="mt-4 flex justify-between items-center text-sm text-uc-text dark:text-gray-300">
                    <div className="flex items-center">
                        <UsersIcon className="w-4 h-4 mr-1.5" />
                        <span>{t.members}: {chama.members}/{chama.maxMembers}</span>
                    </div>
                    <span className="font-semibold">{chama.contributionFrequency}</span>
                </div>

                <button className="mt-4 w-full bg-uc-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors">
                    {t.joinChama}
                </button>
            </div>
        </div>
    );
};

const ChamaPage: React.FC<ChamaPageProps> = ({ chamas }) => {
    const t = useTranslations();

    return (
        <div className="p-4 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-uc-secondary dark:text-white">{t.chamasTitle}</h1>
                <p className="text-md text-gray-500 dark:text-gray-400 mt-1">{t.chamasSubtitle}</p>
            </div>

            <button className="w-full bg-uc-primary text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-opacity-90 transition-transform hover:scale-105 flex items-center justify-center">
                <PlusIcon className="w-5 h-5 mr-2" />
                {t.createNewChama}
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {chamas.map(chama => (
                    <ChamaCard key={chama.id} chama={chama} />
                ))}
            </div>
        </div>
    );
};

const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v-1h8v1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a4 4 0 00-4-4H8a4 4 0 00-4 4v1h12z" />
    </svg>
);

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);


export default ChamaPage;
