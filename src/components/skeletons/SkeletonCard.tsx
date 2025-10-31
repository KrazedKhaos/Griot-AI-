import React from 'react';

const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
    return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden ${className}`}>
            <div className="animate-pulse-fast">
                <div className="h-48 w-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-1/4"></div>
                    </div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                     <div className="flex items-center space-x-2">
                         <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                         <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="space-y-2 pt-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                    <div className="pt-2">
                        <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded-lg w-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;