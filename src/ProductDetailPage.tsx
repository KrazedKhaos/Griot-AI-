
import React, { useMemo, useState } from 'react';
import { Product } from '../../types';
import ProductCard from '../ProductCard';
import SectionHeader from '../common/SectionHeader';

interface ProductDetailPageProps {
    product: Product;
    onBack: () => void;
    allProducts: Product[];
    onProductClick: (product: Product) => void;
    wishlistedProductIds: string[];
    onWishlistToggle: (productId: string) => void;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                </svg>
            ))}
        </div>
    );
};

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, onBack, allProducts, onProductClick, wishlistedProductIds, onWishlistToggle }) => {
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

    const similarProducts = useMemo(() => {
        return allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 8);
    }, [allProducts, product]);

    const recommendedProducts = useMemo(() => {
        return allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(8, 16);
    }, [allProducts, product]);

    const handleDealClick = () => {
        console.log(`'Get This Deal' clicked for product: ${product.title} (ID: ${product.id})`);
        // In a real application, you would send this event to an analytics service.
    };

    const nextMedia = () => {
        setCurrentMediaIndex(prev => (prev + 1) % product.media.length);
    };

    const prevMedia = () => {
        setCurrentMediaIndex(prev => (prev - 1 + product.media.length) % product.media.length);
    };

    const isShareSupported = useMemo(() => typeof navigator !== 'undefined' && !!navigator.share, []);
    const isWishlisted = useMemo(() => wishlistedProductIds.includes(product.id), [wishlistedProductIds, product.id]);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.title,
                    text: `Check out this great deal: ${product.title}`,
                    url: window.location.href,
                });
            } catch (error) {
                console.error('Error sharing product:', error);
            }
        }
    };

    const ratingDistribution = useMemo(() => {
        if (product.reviewCount === 0) return [0, 0, 0, 0, 0];
        
        // This is a dummy distribution generator for visual purposes.
        const distribution = [0, 0, 0, 0, 0];
        distribution[4] = Math.round((product.rating / 5) * 80);
        distribution[3] = Math.round(((5 - Math.abs(product.rating - 4)) / 5) * 15);
        distribution[2] = Math.round(((5 - Math.abs(product.rating - 3)) / 5) * 10);
        distribution[1] = Math.round(((5 - Math.abs(product.rating - 2)) / 5) * 5);
        
        const sum = distribution.reduce((a, b) => a + b, 0);
        distribution[0] = Math.max(0, 100 - sum);

        const finalSum = distribution.reduce((a, b) => a + b, 0);
        if (finalSum === 0) return [0, 0, 0, 0, 0];
        // Normalize
        return distribution.map(d => Math.round((d/finalSum) * 100));
    }, [product.rating, product.reviewCount]);

    const currentMedia = product.media[currentMediaIndex];

    return (
        <div className="dark:bg-gray-800">
            <div className="relative bg-black">
                {currentMedia.type === 'image' ? (
                    <img src={currentMedia.url} alt={`${product.title} image ${currentMediaIndex + 1}`} className="w-full h-64 object-contain" />
                ) : (
                    <video src={currentMedia.url} className="w-full h-64" controls playsInline />
                )}

                <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                    <button onClick={onBack} className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition" aria-label="Go back">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                    </button>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => onWishlistToggle(product.id)}
                            className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition"
                            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} className="w-6 h-6 text-uc-primary" stroke="currentColor" strokeWidth={isWishlisted ? 0 : 2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                            </svg>
                        </button>
                        
                        {isShareSupported && (
                            <button onClick={handleShare} className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition" aria-label="Share product">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {product.media.length > 1 && (
                    <>
                        <button onClick={prevMedia} className="absolute top-1/2 left-2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition z-10" aria-label="Previous media">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                        <button onClick={nextMedia} className="absolute top-1/2 right-2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition z-10" aria-label="Next media">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                            {product.media.map((_, index) => (
                                <button key={index} onClick={() => setCurrentMediaIndex(index)} className={`w-2.5 h-2.5 rounded-full ${currentMediaIndex === index ? 'bg-white' : 'bg-white/50'}`} aria-label={`Go to media ${index + 1}`}></button>
                            ))}
                        </div>
                    </>
                )}
            </div>
            <div className="p-4 space-y-6">
                <div>
                    <span className="text-sm font-semibold text-uc-primary uppercase">{product.category}</span>
                    <h1 className="text-3xl font-bold text-uc-secondary dark:text-gray-100 mt-1">{product.title}</h1>
                    <div className="flex items-center space-x-2 mt-2">
                        <StarRating rating={product.rating} />
                        <span className="text-gray-600 dark:text-gray-400">{product.rating.toFixed(1)} ({product.reviewCount} reviews)</span>
                    </div>
                </div>

                <div className="bg-uc-light-gray dark:bg-gray-900 p-4 rounded-lg">
                    <SectionHeader title="Why We Recommend It" isSubheading/>
                    <p className="text-uc-text dark:text-gray-300 leading-relaxed mt-2">{product.description}</p>
                </div>
                
                <div>
                    <SectionHeader title="Key Features & Benefits" isSubheading/>
                    <div className="space-y-3 mt-4">
                        {product.benefits.map((benefit, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center space-x-3">
                                <div className="flex-shrink-0 bg-uc-success/10 p-2 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-uc-success" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <p className="text-uc-text dark:text-gray-200 text-sm font-medium">{benefit}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <SectionHeader title="Community Reviews" isSubheading/>
                    {product.reviewCount > 0 ? (
                        <div className="mt-4 bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                                <div className="text-center shrink-0 mb-4 sm:mb-0">
                                    <p className="text-4xl font-bold text-uc-secondary dark:text-gray-100">{product.rating.toFixed(1)}</p>
                                    <StarRating rating={product.rating} />
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{product.reviewCount} reviews</p>
                                </div>
                                <div className="flex-1 w-full">
                                    { [5, 4, 3, 2, 1].map((star, index) => {
                                        const percentage = ratingDistribution[4 - index];
                                        return (
                                            <div key={star} className="flex items-center space-x-2 text-sm my-1">
                                                <span className="text-gray-600 dark:text-gray-300 w-12">{star} star</span>
                                                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                                                    <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                                                </div>
                                                <span className="text-gray-600 dark:text-gray-300 w-8 text-right">{percentage}%</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <button className="w-full mt-4 bg-uc-secondary/10 text-uc-secondary dark:bg-gray-700 dark:text-gray-200 font-bold py-2 px-4 rounded-lg hover:bg-uc-secondary/20 dark:hover:bg-gray-600 transition-colors">
                                Write a Review
                            </button>
                        </div>
                    ) : (
                        <div className="mt-4 bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700 text-center">
                            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 0 1-2.53-2.22A5.997 5.997 0 0 1 12 15a5.997 5.997 0 0 1-5.47-3.22A9.76 9.76 0 0 1 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-uc-secondary dark:text-gray-100">No reviews yet</h3>
                            <p className="mt-1 text-base text-gray-500 dark:text-gray-400">Be the first to share your thoughts on this product!</p>
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                    <span className="text-3xl font-bold text-uc-secondary dark:text-gray-100">{product.price}</span>
                     <span className="text-gray-500 dark:text-gray-400">One-time purchase</span>
                </div>
            </div>

            {(similarProducts.length > 0 || recommendedProducts.length > 0) && (
                <div className="bg-uc-light-gray dark:bg-gray-900 py-6 space-y-6">
                    {similarProducts.length > 0 && (
                        <section>
                            <SectionHeader title="Similar Products" />
                            <div className="flex overflow-x-auto space-x-4 pb-4 px-4 scrollbar-hide mt-3">
                                {similarProducts.map(p => (
                                    <div key={p.id} className="flex-shrink-0 w-80">
                                        <ProductCard 
                                            product={p} 
                                            onProductClick={onProductClick} 
                                            isWishlisted={wishlistedProductIds.includes(p.id)} 
                                            onWishlistToggle={onWishlistToggle} 
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                    
                    {recommendedProducts.length > 0 && (
                        <section>
                            <SectionHeader title="You might also like" />
                            <div className="flex overflow-x-auto space-x-4 pb-4 px-4 scrollbar-hide mt-3">
                                {recommendedProducts.map(p => (
                                    <div key={p.id} className="flex-shrink-0 w-80">
                                        <ProductCard 
                                            product={p} 
                                            onProductClick={onProductClick} 
                                            isWishlisted={wishlistedProductIds.includes(p.id)} 
                                            onWishlistToggle={onWishlistToggle} 
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}
            
            <div className="sticky bottom-0 bg-white dark:bg-gray-800 p-4 border-t dark:border-gray-700 shadow-inner">
                <a 
                    href={product.affiliateLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    onClick={handleDealClick}
                    className="block w-full text-center bg-uc-primary text-white text-lg font-bold uppercase py-4 px-4 rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-200">
                    Get This Deal
                </a>
            </div>
        </div>
    );
};

export default ProductDetailPage;