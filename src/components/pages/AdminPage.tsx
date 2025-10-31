import React, { useState } from 'react';
import { Product, AITrendingProductIdea } from '../../types';
import ProductFormModal from '../admin/ProductFormModal';
import AITrendSpotter from '../admin/AITrendSpotter';
import AIMarketingMaestro from '../admin/AIMarketingMaestro';
import PerformanceDashboard from '../admin/PerformanceDashboard';
import { useTranslations } from '../../hooks/useTranslations';
import AIVideoProducer from '../admin/AIVideoProducer';
import AIAnalyticsAdvisor from '../admin/AIAnalyticsAdvisor';
import AICampaignArchitect from '../admin/AICampaignArchitect';
import AIBusinessStrategist from '../admin/AIBusinessStrategist';
import AISeoOptimizer from '../admin/AISeoOptimizer';
import AIBrandKitGenerator from '../admin/AIBrandKitGenerator';
import AIAudioEngineer from '../admin/AIAudioEngineer';
import AIGlobalConnector from '../admin/AIGlobalConnector';
import AIKnowledgeVault from '../admin/AIKnowledgeVault';
import AIOpportunityScout from '../admin/AIOpportunityScout';
import AIBrandIdentityAgent from '../admin/AIBrandIdentityAgent';
import AIOmniglotTranslator from '../admin/AIOmniglotTranslator';
import AIKrazedKhaos from '../admin/AIKrazedKhaos';
import AIEgisCommander from '../admin/AIEgisCommander';
import AIDigitalBridgeBuilder from '../admin/AIDigitalBridgeBuilder';
import AISocialGateway from '../admin/AISocialGateway';


interface AdminPageProps {
    products: Product[];
    onAdd: (newProduct: Omit<Product, 'id'>) => void;
    onUpdate: (product: Product) => void;
    onDelete: (productId: string) => void;
    navigate: (path: string) => void;
    onLogout: () => void;
}

type AdminTab = 'governor' | 'agents' | 'products' | 'performance' | 'security';
type AITool = 'socialGateway' | 'bridgeBuilder' | 'omniglot' | 'opportunity' | 'brandIdentity' | 'strategy' | 'analytics' | 'trend' | 'seo' | 'brand' | 'campaign' | 'marketing' | 'video' | 'audio' | 'globalConnector' | 'knowledgeVault' ;

const AdminPage: React.FC<AdminPageProps> = ({ products, onAdd, onUpdate, onDelete, onLogout }) => {
    const t = useTranslations();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
    const [activeTab, setActiveTab] = useState<AdminTab>('governor');
    const [activeAiTool, setActiveAiTool] = useState<AITool>('socialGateway');

    const handleOpenAddModal = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleQuickAdd = (idea: AITrendingProductIdea) => {
        setEditingProduct({
            title: idea.title,
            description: idea.description,
        });
        setIsModalOpen(true);
    };
    
    const handleSave = (productData: Product | Omit<Product, 'id'>) => {
        if ('id' in productData && productData.id) {
            onUpdate(productData as Product);
        } else {
            onAdd(productData as Omit<Product, 'id'>);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (productId: string) => {
        if (window.confirm(t.deleteConfirmation)) {
            onDelete(productId);
        }
    }
    
    const aiTools: { id: AITool; name: string; component: React.ReactElement; icon: React.ReactElement }[] = [
        { id: 'socialGateway', name: 'Social Gateway', component: <AISocialGateway />, icon: <GatewayIcon /> },
        { id: 'bridgeBuilder', name: t.digitalBridgeBuilder, component: <AIDigitalBridgeBuilder />, icon: <BridgeIcon /> },
        { id: 'omniglot', name: 'Omniglot Translator', component: <AIOmniglotTranslator />, icon: <LanguageIcon /> },
        { id: 'opportunity', name: 'Opportunity Scout', component: <AIOpportunityScout />, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-1 1v1.618a4.5 4.5 0 00-3.58 2.22l-1.355.776a1 1 0 00.5 1.888l1.79-.398a4.488 4.488 0 007.29 0l1.79.398a1 1 0 00.5-1.888l-1.355-.776a4.5 4.5 0 00-3.58-2.22V3a1 1 0 00-1-1zm-4.5 6.094a6.002 6.002 0 0111 0v.01l.004.002l.002.001a1 1 0 01.585.996v4.805a1 1 0 01-1.64.768l-2.022-1.617a.996.996 0 00-1.276 0l-2.023 1.617a1 1 0 01-1.639-.768v-4.805a1 1 0 01.585-.996l.002-.001l.004-.002v-.01z" clipRule="evenodd" /></svg> },
        { id: 'brandIdentity', name: 'Brand Identity Agent', component: <AIBrandIdentityAgent />, icon: <IdentityIcon /> },
        { id: 'globalConnector', name: 'Global Connector', component: <AIGlobalConnector products={products} />, icon: <GlobalIcon/> },
        { id: 'knowledgeVault', name: 'Knowledge Vault', component: <AIKnowledgeVault />, icon: <VaultIcon/> },
        { id: 'strategy', name: 'Business Strategist', component: <AIBusinessStrategist />, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg> },
        { id: 'analytics', name: 'Analytics Advisor', component: <AIAnalyticsAdvisor products={products} />, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 11a1 1 0 011-1h2a1 1 0 110 2H3a1 1 0 01-1-1zm5-6a1 1 0 011-1h2a1 1 0 110 2H8a1 1 0 01-1-1zm5 5a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zM2 15a1 1 0 011-1h12a1 1 0 110 2H3a1 1 0 01-1-1z" /></svg> },
        { id: 'trend', name: 'Trend Spotter', component: <AITrendSpotter onQuickAdd={handleQuickAdd} />, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C3.732 4.943 9.522 3 10 3s6.268 1.943 9.542 7c-3.274 5.057-9.064 7-9.542 7S3.732 15.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg> },
        { id: 'seo', name: 'SEO Optimizer', component: <AISeoOptimizer products={products} />, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg> },
        { id: 'brand', name: 'Brand Kit Generator', component: <AIBrandKitGenerator />, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 011-1h.5a1.5 1.5 0 000-3H6a1 1 0 01-1 1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" /></svg> },
        { id: 'campaign', name: 'Campaign Architect', component: <AICampaignArchitect products={products} />, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM13 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" /></svg> },
        { id: 'marketing', name: 'Marketing Maestro', component: <AIMarketingMaestro products={products} />, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 16a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg> },
        { id: 'video', name: 'Video Producer', component: <AIVideoProducer products={products} />, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8H5v-2h10v2z" clipRule="evenodd" /></svg> },
        { id: 'audio', name: 'Audio Engineer', component: <AIAudioEngineer />, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M7 4a1 1 0 011 1v1H7a1 1 0 01-1-1V4a1 1 0 011-1zM6 7v7.5a2.5 2.5 0 005 0V7H6zM13 14.5A2.5 2.5 0 0010.5 12H13v2.5zM13 4a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z" /></svg> },
    ];

    const renderActiveAITool = () => {
        const tool = aiTools.find(t => t.id === activeAiTool);
        return tool ? tool.component : null;
    }

    const MainTabButton: React.FC<{tab: AdminTab, label: string, icon: React.ReactElement}> = ({tab, label, icon}) => {
        const isActive = activeTab === tab;
        return (
            <button
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-2 text-sm font-bold flex flex-col items-center justify-center space-y-1 transition-colors duration-300 border-b-4 ${isActive ? 'text-uc-primary border-uc-primary' : 'text-gray-500 border-transparent hover:text-uc-primary'}`}
            >
                {icon}
                <span className="text-xs sm:text-sm">{label}</span>
            </button>
        )
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-full">
            <header className="sticky top-0 bg-white dark:bg-uc-secondary shadow-md z-10">
                <div className="p-4 relative flex items-center justify-center">
                    <a href="#/" className="absolute left-4 text-uc-primary hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full" aria-label={t.backToShop}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </a>
                    <h1 className="text-2xl font-bold text-uc-secondary dark:text-white">{t.adminTitle}</h1>
                     <button onClick={onLogout} className="absolute right-4 text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 p-2 rounded-full" aria-label={t.logout}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
                <nav className="flex justify-around border-t border-gray-200 dark:border-gray-700">
                    <MainTabButton tab="governor" label="Governor" icon={<GovernorIcon/>} />
                    <MainTabButton tab="security" label="Security" icon={<SecurityIcon/>} />
                    <MainTabButton tab="agents" label="AI Agents" icon={<AgentsIcon/>} />
                    <MainTabButton tab="products" label={t.adminProducts} icon={<ProductsIcon/>} />
                    <MainTabButton tab="performance" label={t.adminPerformance} icon={<PerformanceIcon/>} />
                </nav>
            </header>

            <main className="p-4 space-y-6">
                 {activeTab === 'governor' && (
                    <div className="animate-fade-in">
                        <AIKrazedKhaos />
                    </div>
                 )}
                 {activeTab === 'security' && (
                    <div className="animate-fade-in">
                        <AIEgisCommander />
                    </div>
                )}
                {activeTab === 'products' && (
                    <div className="animate-fade-in">
                         <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-uc-secondary dark:text-white">{t.manageProducts}</h2>
                            <button
                                onClick={handleOpenAddModal}
                                className="bg-uc-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors flex items-center shadow"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                {t.addProduct}
                            </button>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                             <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                                {products.map(product => (
                                    <li key={product.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <div className="flex items-center space-x-4">
                                            <img className="h-16 w-16 rounded-lg object-cover flex-shrink-0" src={product.media[0]?.url || 'https://picsum.photos/seed/placeholder/200/200'} alt="" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-uc-secondary dark:text-gray-100 truncate">{product.title}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{product.category}</p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                 <button onClick={() => handleOpenEditModal(product)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                                      <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                                 <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                             </ul>
                        </div>
                    </div>
                )}
                {activeTab === 'agents' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-2">
                           <div className="flex overflow-x-auto space-x-1 pb-1 scrollbar-hide">
                                {aiTools.map(tool => (
                                    <button 
                                        key={tool.id} 
                                        onClick={() => setActiveAiTool(tool.id)}
                                        className={`px-3 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center space-x-2 ${activeAiTool === tool.id ? 'bg-uc-primary text-white shadow-sm' : 'bg-transparent text-uc-text dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                    >
                                        {tool.icon}
                                        <span>{tool.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="animate-fade-in">
                          {renderActiveAITool()}
                        </div>
                    </div>
                )}
                {activeTab === 'performance' && (
                    <div className="animate-fade-in space-y-6">
                        <PerformanceDashboard products={products} />
                    </div>
                )}
            </main>
            
             {isModalOpen && (
                <ProductFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    product={editingProduct}
                />
            )}
        </div>
    );
};

// Icons
const GatewayIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 011-1h.5a1.5 1.5 0 000-3H6a1 1 0 01-1 1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" /></svg>);
const BridgeIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M18.5 7c.28 0 .5.22.5.5v2a.5.5 0 01-1 0V8h-2.07a5.5 5.5 0 00-10.86 0H3v1.5a.5.5 0 01-1 0v-2a.5.5 0 01.5-.5H4a5.5 5.5 0 0011 0h1.5z" /><path d="M2.5 11a.5.5 0 01.5.5v3a.5.5 0 01-1 0v-3a.5.5 0 01.5-.5zM17.5 11a.5.5 0 01.5.5v3a.5.5 0 01-1 0v-3a.5.5 0 01.5-.5zM6.5 11a.5.5 0 01.5.5v3a.5.5 0 01-1 0v-3a.5.5 0 01.5-.5zM13.5 11a.5.5 0 01.5.5v3a.5.5 0 01-1 0v-3a.5.5 0 01.5-.5z" /></svg>);
const LanguageIcon: React.FC = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a6.5 6.5 0 01-2.928 2.555.5.5 0 00-.28.932l-1.334 1.334a.5.5 0 00.354.854l1.333-1.334a4.503 4.503 0 002.274-2.274l1.334 1.334a.5.5 0 00.854.353l1.334-1.333a.5.5 0 00.932-.281A6.5 6.5 0 0114.422 6H12V4a1 1 0 11-2 0V3a1 1 0 011-1z" /><path d="M12.586 10.586a2.5 2.5 0 10-3.536 3.536A2.5 2.5 0 0012.586 10.586zM5 4a1 1 0 100 2h.578A6.495 6.495 0 014 10.422V11a1 1 0 102 0v-.578A6.495 6.495 0 0110.422 4H11a1 1 0 100-2h-.578A6.495 6.495 0 014 8.422V9a1 1 0 102 0V8.422A6.495 6.495 0 0112.422 2H13a1 1 0 100-2h-1a8.5 8.5 0 00-7.5 4.015V4z" /></svg>);
const GlobalIcon: React.FC = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.72 6.526 6.338 7.234 7.234L10 10l.766-.766a.81.81 0 00-.222-.222l-2.073-2.073a.81.81 0 00-.222-.222L3.823 4.981a6.028 6.028 0 012.504-2.227.81.81 0 00.222.222l2.073 2.073a.81.81 0 00.222.222L10 10l2.766 2.766a.81.81 0 00.222.222l2.073 2.073a.81.81 0 00.222.222c.896.896.488.927-1.42 2.332a6.012 6.012 0 01-2.706 1.912 6.028 6.028 0 01-2.227-2.504.81.81 0 00.222-.222l2.073-2.073a.81.81 0 00.222-.222L10 10l-1.973-1.973a.81.81 0 00-.222-.222z" clipRule="evenodd" /></svg>);
const VaultIcon: React.FC = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" /><path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" /></svg>);
const IdentityIcon: React.FC = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>);
const ProductsIcon: React.FC = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" /></svg>);
const AgentsIcon: React.FC = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2l4.45.647a1 1 0 01.554 1.705l-3.22 3.138 1.17 4.628a1 1 0 01-1.451 1.054L12 15.58l-3.996 2.099a1 1 0 01-1.451-1.054l1.17-4.628L4.49 9.553a1 1 0 01.554-1.705l4.45-.647L11.033 2.744A1 1 0 0112 2z" clipRule="evenodd" /></svg>);
const PerformanceIcon: React.FC = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 11a1 1 0 011-1h2a1 1 0 110 2H3a1 1 0 01-1-1zm5-6a1 1 0 011-1h2a1 1 0 110 2H8a1 1 0 01-1-1zm5 5a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zM2 15a1 1 0 011-1h12a1 1 0 110 2H3a1 1 0 01-1-1z" /></svg>);
const GovernorIcon: React.FC = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C3.732 4.943 9.522 3 10 3s6.268 1.943 9.542 7c-3.274 5.057-9.064 7-9.542 7S3.732 15.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>);
const SecurityIcon: React.FC = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5.002 12.053 12.053 0 0010 18.455a12.053 12.053 0 007.834-13.453A11.954 11.954 0 0110 1.944zM8 9a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm1 4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" /></svg>);

export default AdminPage;