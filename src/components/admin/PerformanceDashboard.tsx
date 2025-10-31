import React, { useMemo } from 'react';
import { Product } from '../../types';

interface PerformanceDashboardProps {
    products: Product[];
}

const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ products }) => {
    
    const performanceStats = useMemo(() => {
        const totalClicks = products.reduce((acc, p) => acc + p.performance.clicks, 0);
        const totalSales = products.reduce((acc, p) => acc + p.performance.sales, 0);
        
        const totalRevenue = products.reduce((acc, p) => {
            // FIX: Product price is a number, not a string. Removed string manipulation that was causing a crash.
            const price = p.price;
            return acc + (p.performance.sales * price);
        }, 0);
        
        const avgConversionRate = totalClicks > 0 ? (totalSales / totalClicks) * 100 : 0;
        
        return {
            totalClicks,
            totalSales,
            totalRevenue,
            avgConversionRate
        };
    }, [products]);

    const topProducts = useMemo(() => {
        return [...products]
            .sort((a, b) => b.performance.sales - a.performance.sales)
            .slice(0, 5);
    }, [products]);

    const StatCard: React.FC<{title: string, value: string, icon: React.ReactElement}> = ({title, value, icon}) => (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex items-center space-x-4">
            <div className="bg-uc-primary/10 text-uc-primary p-3 rounded-full">
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
                <p className="text-2xl font-bold text-uc-secondary dark:text-gray-100">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <StatCard title="Total Clicks" value={performanceStats.totalClicks.toLocaleString()} icon={<ClicksIcon/>} />
                <StatCard title="Total Sales" value={performanceStats.totalSales.toLocaleString()} icon={<SalesIcon/>} />
                <StatCard title="Total Revenue" value={`$${performanceStats.totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} icon={<RevenueIcon/>} />
                <StatCard title="Conv. Rate" value={`${performanceStats.avgConversionRate.toFixed(2)}%`} icon={<ConversionIcon/>} />
            </div>

            <div>
                <h3 className="text-xl font-bold text-uc-secondary dark:text-white mb-3">Top Performing Products</h3>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                    <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                        {topProducts.map(product => (
                            <li key={product.id} className="p-3">
                                <div className="flex items-center space-x-3">
                                    <img className="h-12 w-12 rounded-lg object-cover flex-shrink-0" src={product.media[0]?.url} alt={product.title} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-uc-secondary dark:text-gray-100 truncate">{product.title}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{product.performance.clicks.toLocaleString()} clicks</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-uc-success">{product.performance.sales.toLocaleString()}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Sales</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

const ClicksIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
    </svg>
);
const SalesIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);
const RevenueIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1h4v1m-4 0a3 3 0 00-3 3v1a3 3 0 003 3h1a3 3 0 003-3v-1a3 3 0 00-3-3h-1m-4-3h8a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V5a2 2 0 012-2z" />
    </svg>
);
const ConversionIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

export default PerformanceDashboard;