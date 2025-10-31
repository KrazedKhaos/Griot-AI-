
import React, { useState, useMemo } from 'react';
import { Product } from '../../types';
import ProductCard from '../ProductCard';
import SectionHeader from '../common/SectionHeader';
import FilterModal from '../common/FilterModal';
import { CATEGORIES } from '../../constants';

interface SearchPageProps {
    products: Product[];
    onProductClick: (product: Product) => void;
    wishlistedProductIds: string[];
    onWishlistToggle: (productId: string) => void;
}

const GridIcon: React.FC = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);

const ListIcon: React.FC = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
);


const SearchPage: React.FC<SearchPageProps> = ({ products, onProductClick, wishlistedProductIds, onWishlistToggle }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [appliedFilters, setAppliedFilters] = useState({
        categories: [] as string[],
        rating: 0,
    });

    const hasActiveFilters = appliedFilters.categories.length > 0 || appliedFilters.rating > 0;

    const filteredProducts = useMemo(() => {
        if (!searchTerm && !hasActiveFilters) {
            return [];
        }

        let results = products;

        // 1. Filter by search term
        if (searchTerm) {
            const lowercasedTerm = searchTerm.toLowerCase();
            results = results.filter(product =>
                product.title.toLowerCase().includes(lowercasedTerm) ||
                product.category.toLowerCase().includes(lowercasedTerm) ||
                product.description.toLowerCase().includes(lowercasedTerm)
            );
        }

        // 2. Filter by category
        if (appliedFilters.categories.length > 0) {
            results = results.filter(product =>
                appliedFilters.categories.includes(product.category)
            );
        }

        // 3. Filter by rating
        if (appliedFilters.rating > 0) {
            results = results.filter(product => product.rating >= appliedFilters.rating);
        }

        return results;
    }, [searchTerm, products, appliedFilters, hasActiveFilters]);

    const handleApplyFilters = (filters: { categories: string[], rating: number }) => {
        setAppliedFilters(filters);
    };

    const handleClearFilters = () => {
        setAppliedFilters({ categories: [], rating: 0 });
    };

    const handleCategoryToggle = (categoryName: string) => {
      setAppliedFilters(prev => {
        const newCategories = prev.categories.includes(categoryName)
          ? prev.categories.filter(c => c !== categoryName)
          : [...prev.categories, categoryName];
        return { ...prev, categories: newCategories };
      });
    };

    const EmptyState: React.FC<{ title: string; message: string }> = ({ title, message }) => (
        <div className="text-center py-20">
             <div className="mx-auto w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-uc-secondary dark:text-gray-100">{title}</h3>
            <p className="mt-1 text-base text-gray-500 dark:text-gray-400">{message}</p>
        </div>
    );
    
    const showResults = searchTerm || hasActiveFilters;

    return (
        <>
            <div className="p-4">
                <SectionHeader title="Search" />
                <div className="flex items-center space-x-2 mt-4">
                    <div className="relative flex-grow">
                         <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by product name or keyword"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-uc-primary focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-uc-text dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-400"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                    <button 
                        onClick={() => setShowFilters(true)}
                        className="relative flex-shrink-0 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                        aria-label="Open filters"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-uc-text dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 12h10m-7 8h4" />
                        </svg>
                        {hasActiveFilters && <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-uc-primary ring-2 ring-white" />}
                    </button>
                </div>

                <div className="mt-4">
                    <div className="flex overflow-x-auto space-x-3 pb-2 scrollbar-hide">
                        <button
                            onClick={() => setAppliedFilters(prev => ({...prev, categories: []}))}
                            className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-colors ${appliedFilters.categories.length === 0 ? 'bg-uc-primary text-white' : 'bg-gray-200 text-uc-text dark:bg-gray-700 dark:text-gray-200'}`}
                        >
                            All
                        </button>
                        {CATEGORIES.map(cat => {
                            const isSelected = appliedFilters.categories.includes(cat.name);
                            return (
                                <button
                                    key={cat.name}
                                    onClick={() => handleCategoryToggle(cat.name)}
                                    className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-colors ${isSelected ? 'bg-uc-primary text-white' : 'bg-gray-200 text-uc-text dark:bg-gray-700 dark:text-gray-200'}`}
                                >
                                    {cat.name}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {showResults && (
                    <div className="flex justify-between items-center mt-6">
                        <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                            {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'} found
                        </p>
                        <div className="flex items-center space-x-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <button
                                onClick={() => setView('grid')}
                                className={`p-2 rounded-md transition-colors ${view === 'grid' ? 'bg-white dark:bg-gray-800 text-uc-primary shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                                aria-label="Grid view"
                            >
                                <GridIcon />
                            </button>
                            <button
                                onClick={() => setView('list')}
                                className={`p-2 rounded-md transition-colors ${view === 'list' ? 'bg-white dark:bg-gray-800 text-uc-primary shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                                aria-label="List view"
                            >
                                <ListIcon />
                            </button>
                        </div>
                    </div>
                )}

                <div className={showResults ? "mt-4" : "mt-6"}>
                    {showResults && filteredProducts.length > 0 && (
                         <div className={view === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 gap-6" : "flex flex-col gap-4"}>
                            {filteredProducts.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onProductClick={onProductClick}
                                    isWishlisted={wishlistedProductIds.includes(product.id)}
                                    onWishlistToggle={onWishlistToggle}
                                    view={view}
                                />
                            ))}
                        </div>
                    )}
                    {showResults && filteredProducts.length === 0 && (
                         <EmptyState title="No results found" message="Try adjusting your search or filters." />
                    )}
                    {!showResults && (
                        <EmptyState title="Find your next great deal" message="Use the search bar or filters to start." />
                    )}
                </div>
            </div>
            <FilterModal 
                isOpen={showFilters}
                onClose={() => setShowFilters(false)}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
                initialFilters={appliedFilters}
            />
        </>
    );
};

export default SearchPage;