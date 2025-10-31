
import React, { useState, useMemo } from 'react';
import { CATEGORIES } from '../../constants';
import { Product } from '../../types';
import ProductCard from '../ProductCard';
import SectionHeader from '../common/SectionHeader';

interface CategoriesPageProps {
    products: Product[];
    onProductClick: (product: Product) => void;
    wishlistedProductIds: string[];
    onWishlistToggle: (productId: string) => void;
}

const CategoriesPage: React.FC<CategoriesPageProps> = ({ products, onProductClick, wishlistedProductIds, onWishlistToggle }) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const productsByCategory = useMemo(() => {
        return products.reduce((acc, product) => {
            (acc[product.category] = acc[product.category] || []).push(product);
            return acc;
        }, {} as Record<string, Product[]>);
    }, [products]);

    if (selectedCategory) {
        return (
            <div className="p-4">
                <button onClick={() => setSelectedCategory(null)} className="mb-4 flex items-center text-uc-primary font-semibold">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                    Back to Categories
                </button>
                <SectionHeader title={selectedCategory} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                    {(productsByCategory[selectedCategory] || []).map(product => (
                         <ProductCard
                            key={product.id}
                            product={product}
                            onProductClick={onProductClick}
                            isWishlisted={wishlistedProductIds.includes(product.id)}
                            onWishlistToggle={onWishlistToggle}
                        />
                    ))}
                </div>
            </div>
        );
    }
    
    return (
        <div className="p-4">
            <SectionHeader title="Categories" />
            <div className="grid grid-cols-2 gap-4 mt-4">
                {CATEGORIES.map(category => {
                    const productCount = productsByCategory[category.name]?.length || 0;
                    return (
                        <div
                            key={category.name}
                            onClick={() => setSelectedCategory(category.name)}
                            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-lg dark:hover:shadow-gray-700/50 transition-shadow"
                        >
                            <div className="bg-uc-primary text-white rounded-full p-3 mb-3">
                                <category.icon className="h-8 w-8" />
                            </div>
                            <h3 className="font-bold text-uc-secondary dark:text-gray-100">{category.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{productCount} products</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoriesPage;