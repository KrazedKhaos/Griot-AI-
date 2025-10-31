import React, { useRef } from 'react';
import { Product } from '../../types';
import ProductCard from '../ProductCard';
import SectionHeader from './SectionHeader';
import { useTranslations } from '../../hooks/useTranslations';

interface ProductCarouselProps {
    title: string;
    products: Product[];
    onProductClick: (product: Product) => void;
    wishlistedProductIds: string[];
    onWishlistToggle: (productId: string) => void;
}

const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
);

const ArrowRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
);

const ProductCarousel: React.FC<ProductCarouselProps> = ({ title, products, onProductClick, wishlistedProductIds, onWishlistToggle }) => {
    const t = useTranslations();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            // Scroll by 80% of the container's width for a smooth page-like effect
            const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    if (products.length === 0) {
        return null;
    }

    return (
        <section>
            <div className="flex justify-between items-center px-4">
                <SectionHeader title={title} />
                <div className="flex space-x-2">
                    <button 
                        onClick={() => scroll('left')} 
                        className="p-2 rounded-full bg-white dark:bg-gray-700 shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition disabled:opacity-50" 
                        aria-label={`Scroll left in ${title}`}
                        title={t.scrollLeft}
                    >
                        <ArrowLeftIcon className="w-5 h-5 text-uc-secondary dark:text-gray-200" />
                    </button>
                    <button 
                        onClick={() => scroll('right')} 
                        className="p-2 rounded-full bg-white dark:bg-gray-700 shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition disabled:opacity-50" 
                        aria-label={`Scroll right in ${title}`}
                        title={t.scrollRight}
                    >
                        <ArrowRightIcon className="w-5 h-5 text-uc-secondary dark:text-gray-200" />
                    </button>
                </div>
            </div>
            <div ref={scrollContainerRef} className="flex overflow-x-auto space-x-4 pb-4 px-4 scrollbar-hide mt-3">
                {products.map(p => (
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
    );
};

export default ProductCarousel;