import React from 'react';
import { Product, Business } from '../../types';
import ProductCard from '../ProductCard';
import SectionHeader from '../common/SectionHeader';
import { useTranslations } from '../../hooks/useTranslations';
import BusinessCard from '../business/BusinessCard';

interface SavedPageProps {
    wishlistedProducts: Product[];
    connectedBusinesses: Business[];
    onProductClick: (product: Product) => void;
    onBusinessClick: (business: Business) => void;
    wishlistedProductIds: string[];
    onWishlistToggle: (productId: string) => void;
    connectedBusinessIds: string[];
    onBusinessConnectToggle: (businessId: string) => void;
}

const BusinessIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21v-4.5m0 4.5h16.5M3.75 16.5h16.5M3.75 12h16.5m-16.5 4.5v-4.5m16.5 4.5v-4.5m0-4.5v4.5m0-4.5h-4.5m-12 0h4.5m-4.5 0v-4.5m0 4.5h-1.5m1.5 0h4.5m10.5 0h-4.5m0 0v-4.5m4.5 4.5v-4.5m-12 9h1.5m-1.5 0v-4.5m1.5 4.5h4.5m0 0v-4.5m0 4.5h4.5m0 0v-4.5m-4.5 4.5H9m6-12v4.5m0-4.5h4.5m-4.5 0H9" />
    </svg>
);

const BookmarkIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
    </svg>
);


const SavedPage: React.FC<SavedPageProps> = ({ 
    wishlistedProducts,
    connectedBusinesses,
    onProductClick,
    onBusinessClick,
    wishlistedProductIds,
    onWishlistToggle,
    connectedBusinessIds,
    onBusinessConnectToggle
}) => {
    const t = useTranslations();
    const hasItems = wishlistedProducts.length > 0 || connectedBusinesses.length > 0;

    return (
        <div className="p-4">
            <SectionHeader title={t.myNetwork} />
            {hasItems ? (
                <div className="space-y-6 mt-4">
                    {connectedBusinesses.length > 0 && (
                        <section>
                            <h3 className="text-lg font-semibold text-uc-text dark:text-gray-300 mb-3 flex items-center">
                                <BusinessIcon className="w-5 h-5 mr-2" />
                                {t.connectedBusinesses}
                            </h3>
                            <div className="flex flex-col gap-4">
                                {connectedBusinesses.map(business => (
                                    <BusinessCard
                                        key={business.id}
                                        business={business}
                                        onBusinessClick={onBusinessClick}
                                        isConnected={connectedBusinessIds.includes(business.id)}
                                        onConnectToggle={onBusinessConnectToggle}
                                        view='list'
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                    {wishlistedProducts.length > 0 && (
                        <section>
                            <h3 className="text-lg font-semibold text-uc-text dark:text-gray-300 mb-3 flex items-center">
                                <BookmarkIcon className="w-5 h-5 mr-2" />
                                {t.savedProducts}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {wishlistedProducts.map(product => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onProductClick={onProductClick}
                                        isWishlisted={wishlistedProductIds.includes(product.id)}
                                        onWishlistToggle={onWishlistToggle}
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            ) : (
                <div className="text-center py-20">
                    <div className="mx-auto w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                        </svg>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-uc-secondary dark:text-gray-100">{t.networkEmptyTitle}</h3>
                    <p className="mt-1 text-base text-gray-500 dark:text-gray-400">{t.networkEmptyMessage}</p>
                </div>
            )}
        </div>
    );
};

export default SavedPage;