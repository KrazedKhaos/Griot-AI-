import React, { useState, useMemo } from 'react';
import { Product } from '../../types';
import { CATEGORIES } from '../../constants';
import ProductCard from '../ProductCard';
import SectionHeader from '../common/SectionHeader';
import HomePageSkeleton from '../skeletons/HomePageSkeleton';
import { useTranslations } from '../../hooks/useTranslations';

interface HomePageProps {
    products: Product[];
    onProductClick: (product: Product) => void;
    wishlistedProductIds: string[];
    onWishlistToggle: (productId: string) => void;
    isLoading: boolean;
    navigate: (path: string) => void;
}

const AllIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25A2.25 2.25 0 0 1 13.5 8.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>
);

const FireIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 3.75 3.75 0 0 0-1.993-2.298A3.75 3.75 0 0 0 9 18c0 1.06.403 2.034 1.07 2.75.974 1.002 2.37 1.25 3.42 1.25a3.75 3.75 0 0 0 3.118-1.582 3.75 3.75 0 0 0-1.582-3.118Z" />
    </svg>
);

const HomePage: React.FC<HomePageProps> = ({ products, onProductClick, wishlistedProductIds, onWishlistToggle, isLoading }) => {
    const t = useTranslations();
    const [activeCategory, setActiveCategory] = useState<string>('All');
    const dealOfTheDay = useMemo(() => products.find(p => p.featured), [products]);
    const trendingProducts = useMemo(() => products.filter(p => p.trending), [products]);

    const filteredProducts = useMemo(() => {
        if (activeCategory === 'Trending') {
            return products.filter(p => p.trending);
        }
        if (activeCategory === 'All') {
            return products.filter(p => !p.featured && !p.trending);
        }
        return products.filter(p => p.category === activeCategory && !p.featured);
    }, [activeCategory, products]);
    
    if (isLoading) {
        return <HomePageSkeleton />;
    }

    return (
        <div className="space-y-6">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-uc-secondary to-gray-800 text-white text-center py-10 px-4">
                <h1 className="text-3xl font-bold">{t.homeHeroTitle}</h1>
                <p className="text-xl font-light mt-2">{t.homeHeroSubtitle}</p>
            </div>
            
            {/* Deal of the Day */}
            {dealOfTheDay && (
                <section className="px-4">
                    <SectionHeader title={t.dealOfTheDay} />
                     <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer mt-3" onClick={() => onProductClick(dealOfTheDay)}>
                        {dealOfTheDay.media[0] && <img src={dealOfTheDay.media[0].url} alt={dealOfTheDay.title} className="w-full h-56 object-cover" />}
                        <div className="absolute top-0 left-0 bg-uc-primary text-white font-bold py-1 px-3 rounded-br-lg">
                            {t.featured}
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
                    <SectionHeader title={t.trendingNow} />
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
                 <SectionHeader title={t.explore} />
                <div className="px-4 mt-3">
                    <div className="flex overflow-x-auto space-x-3 pb-2 scrollbar-hide">
                        <button 
                            onClick={() => setActiveCategory('All')} 
                            className={`flex items-center px-4 py-2 text-sm font-semibold rounded-full transition-colors ${activeCategory === 'All' ? 'bg-uc-primary text-white' : 'bg-gray-200 text-uc-text dark:bg-gray-700 dark:text-gray-200'}`}
                        >
                            <AllIcon className="w-4 h-4 mr-2" />
                            {t.all}
                        </button>
                        <button 
                            onClick={() => setActiveCategory('Trending')}
                            className={`flex items-center px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-colors ${activeCategory === 'Trending' ? 'bg-uc-primary text-white' : 'bg-gray-200 text-uc-text dark:bg-gray-700 dark:text-gray-200'}`}
                        >
                           <FireIcon className="w-4 h-4 mr-2" /> {t.trending}
                        </button>
                        {CATEGORIES.map(cat => (
                            <button 
                                key={cat.name} 
                                onClick={() => setActiveCategory(cat.name)}
                                className={`flex items-center px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-colors ${activeCategory === cat.name ? 'bg-uc-primary text-white' : 'bg-gray-200 text-uc-text dark:bg-gray-700 dark:text-gray-200'}`}
                            >
                                <cat.icon className="w-4 h-4 mr-2" />
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
                            ? t.noTrendingProducts
                            : `${t.noProductsFound} "${activeCategory}"`
                        }
                    </p>
                </div>
            )}
            
            <footer className="text-center text-xs text-gray-400 dark:text-gray-600 p-4 space-y-2">
                <p>{t.ftcDisclosure}</p>
                <a href="#/admin" className="text-blue-500 hover:underline">{t.adminPanel}</a>
            </footer>
        </div>
    );
};

export default HomePage;