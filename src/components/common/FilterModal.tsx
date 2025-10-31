import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../../constants';
import { useTranslations } from '../../hooks/useTranslations';

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: { categories: string[], rating: number }) => void;
    onClear: () => void;
    initialFilters: { categories: string[], rating: number };
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApply, onClear, initialFilters }) => {
    const t = useTranslations();
    
    const ratingOptions = [
        { label: t.rating4stars, value: 4 },
        { label: t.rating3stars, value: 3 },
        { label: t.rating2stars, value: 2 },
        { label: t.rating1star, value: 1 },
    ];
    
    const [selectedCategories, setSelectedCategories] = useState<string[]>(initialFilters.categories);
    const [selectedRating, setSelectedRating] = useState<number>(initialFilters.rating);

    useEffect(() => {
        setSelectedCategories(initialFilters.categories);
        setSelectedRating(initialFilters.rating);
    }, [isOpen, initialFilters]);
    
    if (!isOpen) return null;

    const handleCategoryToggle = (categoryName: string) => {
        setSelectedCategories(prev =>
            prev.includes(categoryName)
                ? prev.filter(c => c !== categoryName)
                : [...prev, categoryName]
        );
    };

    const handleApply = () => {
        onApply({ categories: selectedCategories, rating: selectedRating });
        onClose();
    };

    const handleClearAndClose = () => {
        onClear();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex items-end" onClick={onClose}>
            <div
                className="w-full bg-white dark:bg-gray-800 rounded-t-2xl shadow-xl animate-slide-in-up md:max-w-md md:mx-auto"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <h2 className="text-xl font-bold text-uc-secondary dark:text-gray-100">{t.filters}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-6 max-h-[60vh] overflow-y-auto">
                    {/* Categories */}
                    <div>
                        <h3 className="text-lg font-semibold text-uc-text dark:text-gray-200 mb-3">{t.category}</h3>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map(category => {
                                const isSelected = selectedCategories.includes(category.name);
                                return (
                                    <button
                                        key={category.name}
                                        onClick={() => handleCategoryToggle(category.name)}
                                        className={`px-4 py-2 text-sm font-medium rounded-full transition-colors border ${
                                            isSelected
                                                ? 'bg-uc-primary text-white border-uc-primary'
                                                : 'bg-white text-uc-text border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        {category.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Rating */}
                    <div>
                        <h3 className="text-lg font-semibold text-uc-text dark:text-gray-200 mb-3">{t.rating}</h3>
                        <div className="space-y-2">
                            {ratingOptions.map(option => {
                                const isSelected = selectedRating === option.value;
                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => setSelectedRating(isSelected ? 0 : option.value)}
                                        className={`w-full text-left p-3 rounded-lg transition-colors flex items-center justify-between ${
                                            isSelected ? 'bg-uc-primary/10 text-uc-primary' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-uc-text dark:text-gray-200'
                                        }`}
                                    >
                                        <span>{option.label}</span>
                                        {isSelected && (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
                    <button
                        onClick={handleClearAndClose}
                        className="px-6 py-3 text-sm font-bold text-uc-text dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        {t.clearAll}
                    </button>
                    <button
                        onClick={handleApply}
                        className="px-8 py-3 bg-uc-secondary text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                        {t.applyFilters}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterModal;