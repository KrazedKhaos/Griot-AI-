import React, { useState, useEffect } from 'react';
import { Product, Business, ToastMessage, RewardTransaction, Job, DatingProfile, Chama } from './types';
import { MOCK_PRODUCTS, MOCK_BUSINESSES, MOCK_JOBS, MOCK_DATING_PROFILES, MOCK_CHAMAS } from './constants';
import BottomNav from './components/BottomNav';
import HomePage from './components/pages/HomePage';
import CategoriesPage from './components/pages/CategoriesPage';
import SavedPage from './components/pages/SavedPage';
import SearchPage from './components/pages/SearchPage';
import ProductDetailPage from './components/pages/ProductDetailPage';
import Header from './components/Header';
import Toast from './components/common/Toast';
import InstallPrompt from './components/common/InstallPrompt';
import AdminPage from './components/pages/AdminPage';
import AIPersonalShopper from './components/common/AIPersonalShopper';
import LoginPage from './components/pages/LoginPage';
import BusinessesPage from './components/pages/BusinessesPage';
import BusinessProfilePage from './components/pages/BusinessProfilePage';
import GriotVaultPage from './components/pages/GriotVaultPage';
import JobNexusPage from './components/pages/JobNexusPage';
import ConnectPage from './components/pages/ConnectPage';
import ChatPage from './components/pages/ChatPage';
import ChamaPage from './components/pages/ChamaPage';
import { useTranslations } from './hooks/useTranslations';


const ChatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.15l-2.11 2.11a.75.75 0 0 1-1.06 0l-2.11-2.11a.39.39 0 0 0-.297-.15 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z" clipRule="evenodd" />
    </svg>
);


const App: React.FC = () => {
    const t = useTranslations();
    const [location, setLocation] = useState(window.location.hash || '#/');
    
    // Data State
    const [products, setProducts] = useState<Product[]>([]);
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [datingProfiles, setDatingProfiles] = useState<DatingProfile[]>([]);
    const [chamas, setChamas] = useState<Chama[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    // User State
    const [wishlistedProductIds, setWishlistedProductIds] = useState<string[]>([]);
    const [connectedBusinessIds, setConnectedBusinessIds] = useState<string[]>([]);
    const [matches, setMatches] = useState<DatingProfile[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');
    const [rewardsBalance, setRewardsBalance] = useState(0);
    const [rewardTransactions, setRewardTransactions] = useState<RewardTransaction[]>([]);
    const [lastSaturdayClaim, setLastSaturdayClaim] = useState(0);
    const [lastDailyClaim, setLastDailyClaim] = useState(0);
    
    // UI State
    const [toast, setToast] = useState<ToastMessage | null>(null);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [installPromptEvent, setInstallPromptEvent] = useState<any>(null);
    const [isShopperOpen, setIsShopperOpen] = useState(false);

    // PWA Install Prompt Handler
    useEffect(() => {
        const handleBeforeInstallPrompt = (event: Event) => {
            event.preventDefault();
            setInstallPromptEvent(event);
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

    // Theme management
    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);
    
    // Router effect
    useEffect(() => {
        const handleHashChange = () => {
            setLocation(window.location.hash || '#/');
            window.scrollTo(0, 0);
        };
        window.addEventListener('hashchange', handleHashChange);
        handleHashChange();
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const navigate = (path: string) => {
        window.location.hash = path;
    };
    
    // Protected routes
    useEffect(() => {
        const path = location.substring(1);
        const view = path.split('/')[1] || '';

        if (view === 'admin' && !isAuthenticated) {
            navigate('#/login');
        }
        if (view === 'login' && isAuthenticated) {
            navigate('#/admin');
        }
    }, [location, isAuthenticated]);


    const handleThemeToggle = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    // Load user data from localStorage
    useEffect(() => {
        try {
            const storedWishlistedIds = localStorage.getItem('wishlistedProductIds');
            if (storedWishlistedIds) setWishlistedProductIds(JSON.parse(storedWishlistedIds));

            const storedConnectedIds = localStorage.getItem('connectedBusinessIds');
            if (storedConnectedIds) setConnectedBusinessIds(JSON.parse(storedConnectedIds));
            
            const storedMatches = localStorage.getItem('datingMatches');
            if (storedMatches) setMatches(JSON.parse(storedMatches));
            
            const storedBalance = localStorage.getItem('rewardsBalance');
            if(storedBalance) setRewardsBalance(JSON.parse(storedBalance));

            const storedTransactions = localStorage.getItem('rewardTransactions');
            if(storedTransactions) setRewardTransactions(JSON.parse(storedTransactions));

            const storedSaturdayClaim = localStorage.getItem('lastSaturdayClaim');
            if(storedSaturdayClaim) setLastSaturdayClaim(JSON.parse(storedSaturdayClaim));
            
            const storedDailyClaim = localStorage.getItem('lastDailyClaim');
            if(storedDailyClaim) setLastDailyClaim(JSON.parse(storedDailyClaim));

        } catch (error) {
            console.error("Failed to parse user data from localStorage", error);
        }
    }, []);

    // Load app data
    useEffect(() => {
        const timer = setTimeout(() => {
            try {
                // Products
                const storedProducts = localStorage.getItem('products');
                setProducts(storedProducts ? JSON.parse(storedProducts) : MOCK_PRODUCTS);
                if (!storedProducts) localStorage.setItem('products', JSON.stringify(MOCK_PRODUCTS));

                // Businesses
                const storedBusinesses = localStorage.getItem('businesses');
                setBusinesses(storedBusinesses ? JSON.parse(storedBusinesses) : MOCK_BUSINESSES);
                if (!storedBusinesses) localStorage.setItem('businesses', JSON.stringify(MOCK_BUSINESSES));
                
                // Jobs
                setJobs(MOCK_JOBS);
                
                // Dating Profiles
                setDatingProfiles(MOCK_DATING_PROFILES);
                
                // Chamas
                setChamas(MOCK_CHAMAS);

            } catch (error) {
                console.error("Failed to initialize app data", error);
                setProducts(MOCK_PRODUCTS);
                setBusinesses(MOCK_BUSINESSES);
                setJobs(MOCK_JOBS);
                setDatingProfiles(MOCK_DATING_PROFILES);
                setChamas(MOCK_CHAMAS);
            }
            setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const showToast = (message: string, type: 'success' | 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };
    
    // Auth Handlers
    const handleLogin = () => {
        localStorage.setItem('isAuthenticated', 'true');
        setIsAuthenticated(true);
        showToast(t.loggedInSuccess, 'success');
    };

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        setIsAuthenticated(false);
        navigate('#/');
        showToast(t.loggedOutSuccess, 'info');
    };

    // User Action Handlers
    const handleWishlistToggle = (productId: string) => {
        const newWishlistedIds = wishlistedProductIds.includes(productId)
            ? wishlistedProductIds.filter(id => id !== productId)
            : [...wishlistedProductIds, productId];
        setWishlistedProductIds(newWishlistedIds);
        localStorage.setItem('wishlistedProductIds', JSON.stringify(newWishlistedIds));
        showToast(wishlistedProductIds.includes(productId) ? t.removedFromWishlist : t.addedToWishlist, 'info');
    };

    const handleBusinessConnectToggle = (businessId: string) => {
        const newConnectedIds = connectedBusinessIds.includes(businessId)
            ? connectedBusinessIds.filter(id => id !== businessId)
            : [...connectedBusinessIds, businessId];
        setConnectedBusinessIds(newConnectedIds);
        localStorage.setItem('connectedBusinessIds', JSON.stringify(newConnectedIds));
        showToast(connectedBusinessIds.includes(businessId) ? t.removedFromNetwork : t.addedToNetwork, 'success');
    };
    
    const handleNewMatch = (profile: DatingProfile) => {
        const newMatches = [...matches, profile];
        setMatches(newMatches);
        localStorage.setItem('datingMatches', JSON.stringify(newMatches));
        showToast(`${t.newMatchWith} ${profile.name}!`, 'success');
    }
    
    const handleProductClick = (product: Product) => {
        navigate(`#/product/${product.id}`);
        setIsShopperOpen(false);
    };
    
    const handleBusinessClick = (business: Business) => {
        navigate(`#/business/${business.id}`);
    };

    // Rewards Handlers
    const handleClaimSaturdayGift = () => {
        const amount = 500;
        const newBalance = rewardsBalance + amount;
        const newTransaction: RewardTransaction = {
            id: `txn_${Date.now()}`,
            timestamp: Date.now(),
            description: t.saturdayAirdrop,
            amount: amount,
        };
        const newTransactions = [newTransaction, ...rewardTransactions];
        
        setRewardsBalance(newBalance);
        setRewardTransactions(newTransactions);
        setLastSaturdayClaim(Date.now());

        localStorage.setItem('rewardsBalance', JSON.stringify(newBalance));
        localStorage.setItem('rewardTransactions', JSON.stringify(newTransactions));
        localStorage.setItem('lastSaturdayClaim', JSON.stringify(Date.now()));
        showToast(`${t.giftClaimed} +${amount} GRIO`, 'success');
    };

    const handleClaimDailyBonus = () => {
        const amount = 50;
        const newBalance = rewardsBalance + amount;
        const newTransaction: RewardTransaction = {
            id: `txn_${Date.now()}`,
            timestamp: Date.now(),
            description: t.dailyLoginBonus,
            amount: amount,
        };
        const newTransactions = [newTransaction, ...rewardTransactions];
        
        setRewardsBalance(newBalance);
        setRewardTransactions(newTransactions);
        setLastDailyClaim(Date.now());

        localStorage.setItem('rewardsBalance', JSON.stringify(newBalance));
        localStorage.setItem('rewardTransactions', JSON.stringify(newTransactions));
        localStorage.setItem('lastDailyClaim', JSON.stringify(Date.now()));
        showToast(`${t.bonusClaimed} +${amount} GRIO`, 'success');
    };


    // Admin CRUD Functions
    const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
        const productWithId: Product = { ...newProduct, id: `prod_${new Date().getTime()}` };
        const updatedProducts = [...products, productWithId];
        setProducts(updatedProducts);
        localStorage.setItem('products', JSON.stringify(updatedProducts));
        showToast(t.productAdded, 'success');
    };

    const handleUpdateProduct = (updatedProduct: Product) => {
        const updatedProducts = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
        setProducts(updatedProducts);
        localStorage.setItem('products', JSON.stringify(updatedProducts));
        showToast(t.productUpdated, 'success');
    };

    const handleDeleteProduct = (productId: string) => {
        const updatedProducts = products.filter(p => p.id !== productId);
        setProducts(updatedProducts);
        localStorage.setItem('products', JSON.stringify(updatedProducts));
        showToast(t.productDeleted, 'info');
    };
    
    // Router
    const renderContent = () => {
        const path = location.substring(1);
        const parts = path.split('/');
        const view = parts[1] || '';
        const param = parts[2];
        
        switch (view) {
            case 'product': {
                const product = products.find(p => p.id === param);
                return product ? <ProductDetailPage product={product} navigate={navigate} allProducts={products} wishlistedProductIds={wishlistedProductIds} onWishlistToggle={handleWishlistToggle} /> : null;
            }
            case 'business': {
                const business = businesses.find(b => b.id === param);
                return business ? <BusinessProfilePage business={business} isConnected={connectedBusinessIds.includes(business.id)} onConnectToggle={handleBusinessConnectToggle} /> : null;
            }
            case 'category':
                 return <CategoriesPage categoryName={decodeURIComponent(param)} onProductClick={handleProductClick} products={products} wishlistedProductIds={wishlistedProductIds} onWishlistToggle={handleWishlistToggle} navigate={navigate} />;
            case 'categories':
                return <CategoriesPage onProductClick={handleProductClick} products={products} wishlistedProductIds={wishlistedProductIds} onWishlistToggle={handleWishlistToggle} navigate={navigate} />;
            case 'businesses':
                return <BusinessesPage businesses={businesses} onBusinessClick={handleBusinessClick} connectedBusinessIds={connectedBusinessIds} onBusinessConnectToggle={handleBusinessConnectToggle} />;
            case 'jobs':
                return <JobNexusPage jobs={jobs} />;
            case 'connect':
                return <ConnectPage profiles={datingProfiles.filter(p => !matches.find(m => m.id === p.id))} matches={matches} onMatch={handleNewMatch} navigate={navigate} />;
            case 'chamas':
                return <ChamaPage chamas={chamas} />;
            case 'chat': {
                const profile = datingProfiles.find(p => p.id === param);
                return profile ? <ChatPage profile={profile} navigate={navigate} /> : null;
            }
            case 'network':
                return <SavedPage 
                    wishlistedProducts={products.filter(p => wishlistedProductIds.includes(p.id))}
                    connectedBusinesses={businesses.filter(b => connectedBusinessIds.includes(b.id))}
                    onProductClick={handleProductClick}
                    onBusinessClick={handleBusinessClick}
                    wishlistedProductIds={wishlistedProductIds}
                    onWishlistToggle={handleWishlistToggle}
                    connectedBusinessIds={connectedBusinessIds}
                    onBusinessConnectToggle={handleBusinessConnectToggle}
                />;
            case 'vault':
                return <GriotVaultPage
                    balance={rewardsBalance}
                    transactions={rewardTransactions}
                    onClaimSaturday={handleClaimSaturdayGift}
                    onClaimDaily={handleClaimDailyBonus}
                    lastSaturdayClaim={lastSaturdayClaim}
                    lastDailyClaim={lastDailyClaim}
                    showToast={showToast}
                />;
            case 'search':
                return <SearchPage products={products} onProductClick={handleProductClick} wishlistedProductIds={wishlistedProductIds} onWishlistToggle={handleWishlistToggle} initialSearchTerm={param ? decodeURIComponent(param) : undefined} />;
            case 'login':
                 return <LoginPage onLogin={handleLogin} navigate={navigate} />;
            case 'admin':
                return isAuthenticated ? <AdminPage products={products} onAdd={handleAddProduct} onUpdate={handleUpdateProduct} onDelete={handleDeleteProduct} navigate={navigate} onLogout={handleLogout} /> : null;
            default:
                return <HomePage products={products} onProductClick={handleProductClick} wishlistedProductIds={wishlistedProductIds} onWishlistToggle={handleWishlistToggle} isLoading={isLoading} navigate={navigate} />;
        }
    };

    const isSpecialPage = ['#/product/', '#/business/', '#/admin', '#/login', '#/search', '#/chat/'].some(path => location.startsWith(path));
    const showHeader = !isSpecialPage;
    const showBottomNav = !isSpecialPage;
    
    return (
        <div className="min-h-screen bg-white dark:bg-gray-800 md:max-w-md md:mx-auto md:shadow-lg">
            <div className="flex flex-col h-screen">
                {showHeader && <Header onThemeToggle={handleThemeToggle} theme={theme as 'light' | 'dark'} />}
                <main key={location} className="flex-grow overflow-y-auto pb-20 animate-fade-in">
                    {renderContent()}
                </main>
                 {showBottomNav && <BottomNav currentPath={location} />}
                 
                {showBottomNav && (
                    <>
                        <button
                            onClick={() => setIsShopperOpen(true)}
                            className="fixed bottom-20 right-4 bg-uc-primary text-white rounded-full p-4 shadow-lg hover:bg-opacity-90 transition-transform hover:scale-110 z-30 animate-fade-in"
                            aria-label="Open AI Personal Shopper"
                            title={t.aiPersonalShopper}
                        >
                           <ChatIcon className="w-6 h-6" />
                        </button>
                        <AIPersonalShopper 
                            isOpen={isShopperOpen}
                            onClose={() => setIsShopperOpen(false)}
                            products={products}
                            onProductClick={handleProductClick}
                        />
                    </>
                 )}
                 <Toast toast={toast} />
                 <InstallPrompt event={installPromptEvent} onDismiss={() => setInstallPromptEvent(null)} />
            </div>
        </div>
    );
};

export default App;