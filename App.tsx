
import React, { useState, useEffect } from 'react';
import { Page, Product, ToastMessage } from './types';
import { MOCK_PRODUCTS } from './constants';
import BottomNav from './components/BottomNav';
import HomePage from './components/pages/HomePage';
import CategoriesPage from './components/pages/CategoriesPage';
import WishlistPage from './components/pages/SavedPage';
import SearchPage from './components/pages/SearchPage';
import ProductDetailPage from './components/pages/ProductDetailPage';
import Header from './components/Header';
import Toast from './components/common/Toast';
import InstallPrompt from './components/common/InstallPrompt';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [wishlistedProductIds, setWishlistedProductIds] = useState<string[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [toast, setToast] = useState<ToastMessage | null>(null);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [installPromptEvent, setInstallPromptEvent] = useState<any>(null);

    // PWA Install Prompt Handler
    useEffect(() => {
        const handleBeforeInstallPrompt = (event: Event) => {
            event.preventDefault();
            setInstallPromptEvent(event);
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    // Theme management effect
    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const handleThemeToggle = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    // Load wishlisted products from localStorage on initial render
    useEffect(() => {
        try {
            const storedWishlistedIds = localStorage.getItem('wishlistedProductIds');
            if (storedWishlistedIds) {
                setWishlistedProductIds(JSON.parse(storedWishlistedIds));
            }
        } catch (error) {
            console.error("Failed to parse wishlisted products from localStorage", error);
        }
    }, []);

    // Simulate fetching products on initial load
    useEffect(() => {
        const timer = setTimeout(() => {
            setProducts(MOCK_PRODUCTS);
            setIsLoading(false);
        }, 1500); // Simulate network delay
        return () => clearTimeout(timer);
    }, []);

    const showToast = (message: string, type: 'success' | 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleWishlistToggle = (productId: string) => {
        const isCurrentlyWishlisted = wishlistedProductIds.includes(productId);
        const newWishlistedIds = isCurrentlyWishlisted
            ? wishlistedProductIds.filter(id => id !== productId)
            : [...wishlistedProductIds, productId];
        
        setWishlistedProductIds(newWishlistedIds);
        localStorage.setItem('wishlistedProductIds', JSON.stringify(newWishlistedIds));
        
        if (isCurrentlyWishlisted) {
            showToast('Removed from wishlist', 'info');
        } else {
            showToast('Added to wishlist!', 'success');
        }
    };

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
    };

    const handleBack = () => {
        setSelectedProduct(null);
    };
    
    // Add a unique key to the main content wrapper to trigger animations on page change
    const pageKey = selectedProduct ? selectedProduct.id : currentPage;

    const renderPage = () => {
        if (selectedProduct) {
            return (
                <ProductDetailPage 
                    product={selectedProduct} 
                    onBack={handleBack} 
                    onProductClick={handleProductClick}
                    allProducts={products}
                    wishlistedProductIds={wishlistedProductIds}
                    onWishlistToggle={handleWishlistToggle}
                />
            );
        }
        switch (currentPage) {
            case Page.Home:
                return <HomePage products={products} onProductClick={handleProductClick} wishlistedProductIds={wishlistedProductIds} onWishlistToggle={handleWishlistToggle} isLoading={isLoading} />;
            case Page.Categories:
                return <CategoriesPage onProductClick={handleProductClick} products={products} wishlistedProductIds={wishlistedProductIds} onWishlistToggle={handleWishlistToggle} />;
            case Page.Wishlist:
                return <WishlistPage products={products.filter(p => wishlistedProductIds.includes(p.id))} onProductClick={handleProductClick} wishlistedProductIds={wishlistedProductIds} onWishlistToggle={handleWishlistToggle} />;
            case Page.Search:
                return <SearchPage products={products} onProductClick={handleProductClick} wishlistedProductIds={wishlistedProductIds} onWishlistToggle={handleWishlistToggle} />;
            default:
                return <HomePage products={products} onProductClick={handleProductClick} wishlistedProductIds={wishlistedProductIds} onWishlistToggle={handleWishlistToggle} isLoading={isLoading} />;
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-800 md:max-w-md md:mx-auto md:shadow-lg">
            <div className="flex flex-col h-screen">
                {!selectedProduct && <Header onThemeToggle={handleThemeToggle} theme={theme as 'light' | 'dark'} />}
                <main key={pageKey} className="flex-grow overflow-y-auto pb-20 animate-fade-in">
                    {renderPage()}
                </main>
                 {!selectedProduct && (
                    <BottomNav
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                 )}
                 <Toast toast={toast} />
                 <InstallPrompt event={installPromptEvent} onDismiss={() => setInstallPromptEvent(null)} />
            </div>
        </div>
    );
};

export default App;
