
import React, { useState, useMemo } from 'react';
import { Product } from '../../types';
import { CATEGORIES } from '../../constants';
import ProductCard from '../ProductCard';
import SectionHeader from '../common/SectionHeader';
import HomePageSkeleton from '../skeletons/HomePageSkeleton';

interface HomePageProps {
    products: Product[];
    onProductClick: (product: Product) => void;
    wishlistedProductIds: string[];
    onWishlistToggle: (productId: string) => void;
    isLoading: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ products, onProductClick, wishlistedProductIds, onWishlistToggle, isLoading }) => {
    const [activeCategory, setActiveCategory] = useState<string>('All');
    const dealOfTheDay = useMemo(() => products.find(p => p.featured), [products]);
    const trendingProducts = useMemo(() => products.filter(p => p.trending), [products]);

    const filteredProducts = useMemo(() => {
        // If 'Trending' filter is active, show all trending products.
        if (activeCategory === 'Trending') {
            return products.filter(p => p.trending);
        }
    
        // For 'All' view, show products not already showcased in dedicated sections.
        if (activeCategory === 'All') {
            return products.filter(p => !p.featured && !p.trending);
        }
        
        // For a specific category, show all products in that category except the main featured one.
        return products.filter(p => p.category === activeCategory && !p.featured);
    }, [activeCategory, products]);
    
    if (isLoading) {
        return <HomePageSkeleton />;
    }

    return (
        <div className="space-y-6">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-uc-secondary to-gray-800 text-white text-center py-10 px-4">
                <h1 className="text-3xl font-bold">Discover Products</h1>
                <p className="text-xl font-light mt-2">That Actually Deliver</p>
            </div>
            
            {/* Deal of the Day */}
            {dealOfTheDay && (
                <section className="px-4">
                    <SectionHeader title="Deal of the Day" />
                     <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer mt-3" onClick={() => onProductClick(dealOfTheDay)}>
                        {dealOfTheDay.media[0] && <img src={dealOfTheDay.media[0].url} alt={dealOfTheDay.title} className="w-full h-56 object-cover" />}
                        <div className="absolute top-0 left-0 bg-uc-primary text-white font-bold py-1 px-3 rounded-br-lg">
                            FEATURED
                        </div>
                        <div className="p-4">
                             <h3 className="text-xl font-bold text-uc-secondary dark:text-gray-100">{dealOfTheDay.title}</h3>
                             <p className="mt-2 text-uc-text dark:text-gray-300">{dealOfTheDay.benefitStatement}</p>
                        </div>
                    </div>
                </section>
            )}

            {/* Trending Products */}
            {trendingProducts.length > 0 && (
                <section>
                    <SectionHeader title="Trending Now" />
                    <div className="flex overflow-x-auto space-x-4 pb-4 px-4 scrollbar-hide mt-3">
                        {trendingProducts.map(product => (
                            <div key={product.id} className="flex-shrink-0 w-80">
                                <ProductCard 
                                    product={product} 
                                    onProductClick={onProductClick} 
                                    isWishlisted={wishlistedProductIds.includes(product.id)} 
                                    onWishlistToggle={onWishlistToggle} 
                                />
                            </div>
                        ))}
                    </div>
                </section>
            )}
            
            {/* Category Filter */}
            <section>
                 <SectionHeader title="Explore" />
                <div className="px-4 mt-3">
                    <div className="flex overflow-x-auto space-x-3 pb-2 scrollbar-hide">
                        <button 
                            onClick={() => setActiveCategory('All')} 
                            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${activeCategory === 'All' ? 'bg-uc-primary text-white' : 'bg-gray-200 text-uc-text dark:bg-gray-700 dark:text-gray-200'}`}
                        >
                            All
                        </button>
                        <button 
                            onClick={() => setActiveCategory('Trending')}
                            className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-colors ${activeCategory === 'Trending' ? 'bg-uc-primary text-white' : 'bg-gray-200 text-uc-text dark:bg-gray-700 dark:text-gray-200'}`}
                        >
                           🔥 Trending
                        </button>
                        {CATEGORIES.map(cat => (
                            <button 
                                key={cat.name} 
                                onClick={() => setActiveCategory(cat.name)}
                                className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-colors ${activeCategory === cat.name ? 'bg-uc-primary text-white' : 'bg-gray-200 text-uc-text dark:bg-gray-700 dark:text-gray-200'}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Product Grid */}
            <div className="px-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredProducts.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onProductClick={onProductClick}
                        isWishlisted={wishlistedProductIds.includes(product.id)}
                        onWishlistToggle={onWishlistToggle}
                    />
                ))}
            </div>
            {filteredProducts.length === 0 && activeCategory !== 'All' && (
                <div className="px-4 text-center py-10">
                    <p className="text-uc-text dark:text-gray-400">
                        {activeCategory === 'Trending'
                            ? 'No trending products at the moment.'
                            : `No products found in the "${activeCategory}" category.`
                        }
                    </p>
                </div>
            )}
            
            <footer className="text-center text-xs text-gray-400 dark:text-gray-600 p-4">
                <p>FTC Disclosure: This app contains affiliate links. We may earn a commission when you make a purchase.</p>
            </footer>
        </div>
    );
};

export default HomePage;