import React, { useMemo } from 'react';
import { CATEGORIES } from '../../constants';
import { Product } from '../../types';
import ProductCard from '../ProductCard';
import SectionHeader from '../common/SectionHeader';
import { useTranslations } from '../../hooks/useTranslations';

interface CategoriesPageProps {
    products: Product[];
    onProductClick: (product: Product) => void;
    wishlistedProductIds: string[];
    onWishlistToggle: (productId: string) => void;
    categoryName?: string;
    navigate: (path: string) => void;
}

const CategoriesPage: React.FC<CategoriesPageProps> = ({ products, onProductClick, wishlistedProductIds, onWishlistToggle, categoryName, navigate }) => {
    const t = useTranslations();
    const productsByCategory = useMemo(() => {
        return products.reduce((acc, product) => {
            (acc[product.category] = acc[product.category] || []).push(product);
            return acc;
        }, {} as Record<string, Product[]>);
    }, [products]);

    if (categoryName) {
        return (
            <div className="p-4">
                <button onClick={() => navigate('#/categories')} className="mb-4 flex items-center text-uc-primary font-semibold">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                    {t.backToCategories}
                </button>
                <SectionHeader title={categoryName} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                    {(productsByCategory[categoryName] || []).map(product => (
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
            <SectionHeader title={t.categories} />
            <div className="grid grid-cols-2 gap-4 mt-4">
                {CATEGORIES.map(category => {
                    const productCount = productsByCategory[category.name]?.length || 0;
                    return (
                        <div
                            key={category.name}
                            onClick={() => navigate(`#/category/${encodeURIComponent(category.name)}`)}
                            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-lg dark:hover:shadow-gray-700/50 transition-shadow"
                        >
                            <div className="bg-uc-primary text-white rounded-full p-3 mb-3">
                                <category.icon className="h-8 w-8" />
                            </div>
                            <h3 className="font-bold text-uc-secondary dark:text-gray-100">{category.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{productCount} {t.products}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoriesPage;