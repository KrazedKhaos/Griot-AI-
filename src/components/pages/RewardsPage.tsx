import React, { useState, useEffect } from 'react';
import { RewardTransaction } from '../../types';
import { useTranslations } from '../../hooks/useTranslations';

interface GriotVaultPageProps {
    balance: number;
    transactions: RewardTransaction[];
    onClaimSaturday: () => void;
    onClaimDaily: () => void;
    lastSaturdayClaim: number;
    lastDailyClaim: number;
    showToast: (message: string, type: 'info') => void;
}

const getNextSaturday = () => {
    const now = new Date();
    const nextSaturday = new Date();
    nextSaturday.setDate(now.getDate() + (6 - now.getDay() + 7) % 7);
    nextSaturday.setHours(9, 0, 0, 0); // Set to 9 AM on Saturday
    if (now.getDay() === 6 && now.getTime() > nextSaturday.getTime()) {
        nextSaturday.setDate(nextSaturday.getDate() + 7);
    }
    return nextSaturday;
};

const GriotVaultPage: React.FC<GriotVaultPageProps> = ({ balance, transactions, onClaimSaturday, onClaimDaily, lastSaturdayClaim, lastDailyClaim, showToast }) => {
    const t = useTranslations();
    const [countdown, setCountdown] = useState('');

    const isSaturday = new Date().getDay() === 6;
    const today = new Date().setHours(0, 0, 0, 0);
    const lastClaimDate = new Date(lastSaturdayClaim).setHours(0, 0, 0, 0);
    const lastDailyClaimDate = new Date(lastDailyClaim).setHours(0, 0, 0, 0);

    const isSaturdayClaimed = new Date(lastSaturdayClaim).getTime() > getNextSaturday().getTime() - 7 * 24 * 60 * 60 * 1000;
    const isDailyClaimed = lastDailyClaimDate === today;

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = getNextSaturday().getTime() - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleSaturdayClaimClick = () => {
        if (!isSaturday) {
            showToast(t.notSaturday, 'info');
            return;
        }
        if (isSaturdayClaimed) {
            showToast(t.alreadyClaimed, 'info');
            return;
        }
        onClaimSaturday();
    };
    
    const handleDailyClaimClick = () => {
        if (isDailyClaimed) {
            showToast(t.alreadyClaimed, 'info');
            return;
        }
        onClaimDaily();
    };

    return (
        <div className="p-4 space-y-6">
            <SectionHeader title={t.navVault} />

            {/* Wallet Balance Card */}
            <div className="bg-gradient-to-br from-uc-secondary to-gray-800 text-white p-6 rounded-2xl shadow-lg">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm opacity-80">{t.yourBalance}</p>
                        <p className="text-4xl font-bold tracking-tight">{balance.toLocaleString()}</p>
                    </div>
                    <WalletIcon className="w-12 h-12 opacity-50" />
                </div>
                <p className="text-xs font-semibold opacity-90 mt-2">{t.griocoin}</p>
            </div>

            {/* Saturday Airdrop */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md">
                <div className="flex items-center space-x-4">
                    <GiftIcon className="w-10 h-10 text-uc-primary" />
                    <div>
                        <h3 className="text-lg font-bold text-uc-secondary dark:text-gray-100">{t.saturdayAirdrop}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {isSaturday && !isSaturdayClaimed ? t.claimYourWeeklyGift : `${t.nextGiftIn} ${countdown}`}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleSaturdayClaimClick}
                    disabled={!isSaturday || isSaturdayClaimed}
                    className={`mt-4 w-full font-bold py-3 px-4 rounded-lg transition-colors text-white ${isSaturday && !isSaturdayClaimed ? 'bg-uc-primary hover:bg-opacity-90' : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'}`}
                >
                    {isSaturdayClaimed ? t.claimed : t.claimNow} (+500 GRIO)
                </button>
            </div>
            
            {/* Community Bonuses */}
             <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md">
                <h3 className="text-lg font-bold text-uc-secondary dark:text-gray-100 mb-3">{t.communityBonuses}</h3>
                <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <div>
                        <p className="font-semibold text-uc-text dark:text-gray-200">{t.dailyLoginBonus}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">+50 GRIO</p>
                    </div>
                    <button
                        onClick={handleDailyClaimClick}
                        disabled={isDailyClaimed}
                         className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${!isDailyClaimed ? 'bg-uc-secondary text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-500'}`}
                    >
                        {isDailyClaimed ? t.claimed : t.claim}
                    </button>
                </div>
            </div>

            {/* Transaction History */}
            <div>
                <h3 className="text-xl font-bold text-uc-secondary dark:text-gray-100 px-4 md:px-0 mb-3">{t.transactionHistory}</h3>
                <div className="space-y-2">
                    {transactions.length > 0 ? transactions.slice(0, 10).map(tx => (
                        <div key={tx.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-sm text-uc-text dark:text-gray-200">{tx.description}</p>
                                <p className="text-xs text-gray-400">{new Date(tx.timestamp).toLocaleString()}</p>
                            </div>
                            <p className="font-bold text-green-500">+ {tx.amount.toLocaleString()} GRIO</p>
                        </div>
                    )) : (
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">{t.noTransactionsYet}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

// Sub-components and Icons
const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <h2 className="text-2xl font-bold text-uc-secondary dark:text-gray-100">{title}</h2>
);

const WalletIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 3a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 12m18 0h-7.5M3 12h7.5" /></svg>);
const GiftIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0H9.375m3.375 0a2.625 2.625 0 0 1 2.625-2.625m0 0A2.625 2.625 0 1 0 12 4.875" /><path d="M3.75 7.5h16.5v1.5H3.75V7.5Z" /></svg>);

export default GriotVaultPage;