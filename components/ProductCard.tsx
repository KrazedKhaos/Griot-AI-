
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
    product: Product;
    onProductClick: (product: Product) => void;
    onWishlistToggle: (productId: string) => void;
    isWishlisted: boolean;
    view?: 'grid' | 'list';
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
        <div className="flex items-center">
            {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} filled />)}
            {halfStar && <Star key="half" half />}
            {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} />)}
        </div>
    );
};

const Star: React.FC<{ filled?: boolean; half?: boolean }> = ({ filled, half }) => {
    const color = "text-yellow-400";
    if (half) {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 ${color}`}>
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
            </svg>
        );
    }
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} className={`w-4 h-4 ${filled ? color : 'text-gray-300 dark:text-gray-600'}`} stroke="currentColor" strokeWidth={filled ? 0 : 1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.613.049.868.85.42 1.285l-4.086 3.465a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.087-3.465c-.447-.435-.192-1.236.42-1.285l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
        </svg>
    );
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick, onWishlistToggle, isWishlisted, view = 'grid' }) => {
    const firstMedia = product.media[0];

    const handleWishlistClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onWishlistToggle(product.id);
    };

    if (view === 'list') {
        return (
            <div
                onClick={() => onProductClick(product)}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg dark:hover:shadow-gray-700/50 transition-shadow duration-300 flex cursor-pointer"
            >
                <div className="relative w-32 h-32 flex-shrink-0">
                    {firstMedia && firstMedia.type === 'image' && (
                        <img className="absolute inset-0 w-full h-full object-cover" src={firstMedia.url} alt={product.title} />
                    )}
                    {firstMedia && firstMedia.type === 'video' && (
                        <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white opacity-70" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                        </div>
                    )}
                    <button
                        onClick={handleWishlistClick}
                        className="absolute top-2 right-2 bg-black bg-opacity-40 rounded-full p-1.5 text-white hover:bg-opacity-60 transition-colors"
                        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} className="w-5 h-5 text-uc-primary" stroke="currentColor" strokeWidth={isWishlisted ? 0 : 2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                        </svg>
                    </button>
                </div>
                <div className="p-3 flex flex-col justify-center flex-grow">
                    <p className="text-xs font-semibold text-uc-primary uppercase tracking-wide">{product.category}</p>
                    <h3 className="mt-1 text-base leading-tight font-semibold text-uc-secondary dark:text-gray-100 hover:underline" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {product.title}
                    </h3>
                    <div className="mt-1 flex items-center space-x-2">
                        <StarRating rating={product.rating} />
                        <p className="text-xs text-gray-500 dark:text-gray-400">({product.reviewCount})</p>
                    </div>
                    <p className="mt-2 text-sm text-uc-text dark:text-gray-300" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {product.benefitStatement}
                    </p>
                </div>
            </div>
        );
    }
    
    // Grid View (default)
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg dark:hover:shadow-gray-700/50 transition-shadow duration-300">
            <div className="relative">
                <div className="cursor-pointer" onClick={() => onProductClick(product)}>
                    {firstMedia && firstMedia.type === 'image' && (
                        <img className="h-48 w-full object-cover" src={firstMedia.url} alt={product.title} />
                    )}
                    {firstMedia && firstMedia.type === 'video' && (
                        <div className="h-48 w-full bg-black flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white opacity-70" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                        </div>
                    )}
                </div>
                <button
                    onClick={handleWishlistClick}
                    className="absolute top-2 right-2 bg-black bg-opacity-40 rounded-full p-2 text-white hover:bg-opacity-60 transition-colors"
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} className="w-6 h-6 text-uc-primary" stroke="currentColor" strokeWidth={isWishlisted ? 0 : 2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                    </svg>
                </button>
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <p className="text-sm font-semibold text-uc-primary uppercase tracking-wide">{product.category}</p>
                    <div className="bg-uc-success text-white text-xs font-bold px-2 py-1 rounded-full">
                        Up to {product.commissionRate}
                    </div>
                </div>

                <h3 onClick={() => onProductClick(product)} className="block mt-1 text-lg leading-tight font-semibold text-uc-secondary dark:text-gray-100 hover:underline cursor-pointer h-14 overflow-hidden">
                    {product.title}
                </h3>
                <div className="mt-2 flex items-center space-x-2">
                    <StarRating rating={product.rating} />
                    <p className="text-sm text-gray-500 dark:text-gray-400">{product.rating} ({product.reviewCount} reviews)</p>
                </div>
                <p className="mt-2 text-uc-text dark:text-gray-300 h-12 overflow-hidden">{product.benefitStatement}</p>
                <div className="mt-4">
                    <button onClick={() => onProductClick(product)} className="w-full bg-uc-secondary dark:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 dark:hover:bg-opacity-80 transition-colors">
                        Learn More
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;