import React from 'react';
import SkeletonCard from './SkeletonCard';
import SectionHeader from '../common/SectionHeader';

const HomePageSkeleton: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Hero Section Skeleton */}
            <div className="bg-gray-700 dark:bg-gray-800 text-center py-10 px-4">
                 <div className="h-9 bg-gray-600 dark:bg-gray-700 rounded w-3/5 mx-auto"></div>
                 <div className="h-7 bg-gray-600 dark:bg-gray-700 rounded w-2/5 mx-auto mt-3"></div>
            </div>

            {/* Deal of the Day Skeleton */}
            <section className="px-4">
                <SectionHeader title="Deal of the Day" />
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mt-3 animate-pulse-fast">
                    <div className="w-full h-56 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="p-4 space-y-3">
                         <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                         <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    </div>
                </div>
            </section>
            
            {/* Trending Products Skeleton */}
            <section>
                <SectionHeader title="Trending Now" />
                <div className="flex overflow-x-auto space-x-4 pb-4 px-4 mt-3">
                    {[...Array(2)].map((_, i) => (
                         <div key={i} className="flex-shrink-0 w-80">
                            <SkeletonCard />
                        </div>
                    ))}
                </div>
            </section>
            
            {/* Category Filter Skeleton */}
             <section>
                 <SectionHeader title="Explore" />
                <div className="px-4 mt-3">
                    <div className="flex space-x-3 pb-2">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-9 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse-fast" style={{ width: `${Math.random() * 40 + 80}px`}}></div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Product Grid Skeleton */}
            <div className="px-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                    <SkeletonCard key={i}/>
                ))}
            </div>
        </div>
    );
};

export default HomePageSkeleton;