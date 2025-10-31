import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Product, AIGlobalListing } from '../../types';

const platforms = ['Amazon', 'Alibaba', 'Shopify'];

const loadingMessages = [
    "Analyzing platform requirements...",
    "Generating base copy...",
    "Translating for cultural nuance...",
    "Optimizing keywords for regional search...",
    "Finalizing listing packages...",
];

// FIX: Added missing interface definition for component props
interface AIGlobalConnectorProps {
    products: Product[];
}

const AIGlobalConnector: React.FC<AIGlobalConnectorProps> = ({ products }) => {
    const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Amazon']);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [listings, setListings] = useState<AIGlobalListing[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>('');

    const handlePlatformToggle = (platform: string) => {
        setSelectedPlatforms(prev =>
            prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
        );
    };

    const handleGenerate = async () => {
        const selectedProduct = products.find(p => p.id === selectedProductId);
        if (!selectedProduct) {
            setError('Please select a valid product.');
            return;
        }
        if (selectedPlatforms.length === 0) {
            setError('Please select at least one target platform.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setListings([]);
        
        let messageIndex = 0;
        const interval = setInterval(() => {
            messageIndex = (messageIndex + 1) % loadingMessages.length;
            setLoadingMessage(loadingMessages[messageIndex]);
        }, 3000);
        setLoadingMessage(loadingMessages[0]);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `
                Product Info:
                - Title: "${selectedProduct.title}"
                - Description: "${selectedProduct.description}"
                - Benefits: ${selectedProduct.benefits.join(', ')}
                - Category: ${selectedProduct.category}

                Target Platforms: ${selectedPlatforms.join(', ')}

                Act as an international e-commerce expert. For each target platform, generate a complete and optimized product listing.
                - For Amazon: Focus on benefit-driven bullet points and a keyword-rich title.
                - For Alibaba: Assume a B2B context. Emphasize bulk benefits, and specifications.
                - For Shopify: Use a more brand-focused, storytelling tone.
                
                For each listing, provide:
                1. A platform-optimized title.
                2. A detailed, persuasive description.
                3. A list of 5-7 relevant keywords.
                4. A "Cultural Notes" section with advice for marketing in a key target region for that platform (e.g., USA for Amazon, China for Alibaba, Global for Shopify).
            `;

            const responseSchema = {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        platform: { type: Type.STRING },
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                        cultural_notes: { type: Type.STRING },
                    }
                }
            };
            
            const response = await ai.models.generateContent({
                model: "gemini-2.5-pro",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                }
            });

            const generatedListings = JSON.parse(response.text);
            setListings(generatedListings);
            setActiveTab(generatedListings[0]?.platform || '');

        } catch (e) {
            console.error("AI Global Connector Error:", e);
            setError("Failed to generate listings. Please check the console.");
        } finally {
            clearInterval(interval);
            setIsLoading(false);
        }
    };

    const activeListing = listings.find(l => l.platform === activeTab);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 text-3xl">🌍</div>
                <div>
                    <h2 className="text-xl font-bold text-uc-secondary dark:text-white">AI Global Connector</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Unify your commerce. Generate culturally-aware, platform-optimized product listings for major marketplaces.</p>
                </div>
            </div>

            <div className="mt-4 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">1. Select Product</label>
                    <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} className="mt-1 block w-full input-style">
                        {products.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">2. Select Target Platforms</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {platforms.map(p => (
                            <button key={p} onClick={() => handlePlatformToggle(p)} className={`px-4 py-2 text-sm font-medium rounded-full transition-colors border ${selectedPlatforms.includes(p) ? 'bg-uc-primary text-white border-uc-primary' : 'bg-white text-uc-text border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600'}`}>
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
                <button onClick={handleGenerate} disabled={isLoading || !selectedProductId} className="w-full flex justify-center py-3 px-4 bg-uc-secondary text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-opacity-50 disabled:cursor-not-allowed">
                    {isLoading ? 'Generating...' : 'Generate Listings'}
                </button>
            </div>

            {isLoading && (
                 <div className="mt-6 text-center">
                    <div className="flex justify-center items-center">
                         <svg className="animate-spin h-6 w-6 text-uc-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                    <p className="mt-2 text-sm text-uc-secondary dark:text-gray-300 font-semibold">{loadingMessage}</p>
                </div>
            )}
            
            {error && <p className="mt-4 text-sm text-red-500 text-center">{error}</p>}

            {listings.length > 0 && !isLoading && (
                <div className="mt-6 animate-fade-in">
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                            {listings.map(l => (
                                <button key={l.platform} onClick={() => setActiveTab(l.platform)} className={`${activeTab === l.platform ? 'border-uc-primary text-uc-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-200'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}>
                                    {l.platform}
                                </button>
                            ))}
                        </nav>
                    </div>
                    {activeListing && (
                        <div className="mt-4 space-y-4">
                            <ListingSection title="Generated Title" content={activeListing.title} />
                            <ListingSection title="Generated Description" content={activeListing.description} />
                            <ListingSection title="Keywords" keywords={activeListing.keywords} />
                            <ListingSection title="Cultural & Marketing Notes" content={activeListing.cultural_notes} isNote />
                        </div>
                    )}
                </div>
            )}
            
             <p className="text-xs text-gray-400 dark:text-gray-500 mt-6 text-center">Disclaimer: All platform connections are simulated. In a live environment, API keys and authentication would be required.</p>
            <style>{`.input-style { padding: 0.5rem 0.75rem; border-width: 1px; border-color: #D1D5DB; border-radius: 0.5rem; outline: none; transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1); background-color: white; width: 100%; } .dark .input-style { border-color: #4B5563; background-color: #374151; color: #F3F4F6; } .input-style:focus { --tw-ring-color: #FF7A00; border-color: #FF7A00; box-shadow: 0 0 0 2px var(--tw-ring-color); }`}</style>
        </div>
    );
};

const ListingSection: React.FC<{title: string, content?: string, keywords?: string[], isNote?: boolean}> = ({ title, content, keywords, isNote }) => {
    return (
        <div className={isNote ? "bg-blue-50 dark:bg-gray-700/50 p-3 rounded-lg border-l-4 border-blue-400" : "bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg"}>
            <h3 className={`text-sm font-bold ${isNote ? 'text-blue-800 dark:text-blue-300' : 'text-uc-secondary dark:text-gray-100'}`}>{title}</h3>
            {content && <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{content}</p>}
            {keywords && (
                <div className="mt-2 flex flex-wrap gap-1">
                    {keywords.map(k => <span key={k} className="px-2 py-0.5 bg-uc-primary/10 text-uc-primary text-xs font-semibold rounded-full">{k}</span>)}
                </div>
            )}
        </div>
    )
};

export default AIGlobalConnector;