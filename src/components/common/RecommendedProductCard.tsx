import React from 'react';
import { Product } from '../../types';

interface RecommendedProductCardProps {
    product: Product;
    onClick: (product: Product) => void;
}

const RecommendedProductCard: React.FC<RecommendedProductCardProps> = ({ product, onClick }) => {
    return (
        <button
            onClick={() => onClick(product)}
            className="w-full text-left bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden hover:shadow-md dark:hover:border-uc-primary transition-all duration-200 flex items-center space-x-3 p-2"
        >
            <img 
                src={product.media[0]?.url || 'https://picsum.photos/seed/placeholder/200/200'} 
                alt={product.title} 
                className="w-16 h-16 object-cover rounded-md flex-shrink-0" 
            />
            <div className="flex-grow min-w-0">
                <p className="text-sm font-bold text-uc-secondary dark:text-gray-100 truncate">{product.title}</p>
                <p className="text-xs text-uc-primary font-semibold">{product.category}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{product.benefitStatement}</p>
            </div>
        </button>
    );
};

export default RecommendedProductCard;