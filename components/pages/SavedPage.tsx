
import React from 'react';
import { Product } from '../../types';
import ProductCard from '../ProductCard';
import SectionHeader from '../common/SectionHeader';

interface WishlistPageProps {
    products: Product[];
    onProductClick: (product: Product) => void;
    wishlistedProductIds: string[];
    onWishlistToggle: (productId: string) => void;
}

const WishlistPage: React.FC<WishlistPageProps> = ({ products, onProductClick, wishlistedProductIds, onWishlistToggle }) => {
    return (
        <div className="p-4">
            <SectionHeader title="My Wishlist" />
            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                    {products.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onProductClick={onProductClick}
                            isWishlisted={wishlistedProductIds.includes(product.id)}
                            onWishlistToggle={onWishlistToggle}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <div className="mx-auto w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                        </svg>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-uc-secondary dark:text-gray-100">Your wishlist is empty</h3>
                    <p className="mt-1 text-base text-gray-500 dark:text-gray-400">Tap the bookmark icon on any product to add it to your wishlist.</p>
                </div>
            )}
        </div>
    );
};

export default WishlistPage;