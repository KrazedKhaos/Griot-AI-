import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Product, AISeoPackage } from '../../types';

interface AISeoOptimizerProps {
    products: Product[];
}

const AISeoOptimizer: React.FC<AISeoOptimizerProps> = ({ products }) => {
    const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
    const [isLoading, setIsLoading] = useState(false);
    const [seoPackage, setSeoPackage] = useState<AISeoPackage | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        const selectedProduct = products.find(p => p.id === selectedProductId);
        if (!selectedProduct) {
            setError('Please select a valid product.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setSeoPackage(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `
                Product Info:
                - Title: "${selectedProduct.title}"
                - Description: "${selectedProduct.description}"
                - Category: "${selectedProduct.category}"

                Act as an SEO expert. Analyze the product information and use your knowledge of current search trends to generate an optimal SEO package. The package should include:
                1.  A list of 10-15 high-intent keywords and long-tail phrases.
                2.  A compelling, keyword-rich meta title under 60 characters.
                3.  A persuasive meta description under 160 characters that encourages clicks.
            `;
            
            const responseSchema = {
                type: Type.OBJECT,
                properties: {
                    keywords: {
                        type: Type.ARRAY,
                        description: 'A list of 10-15 high-intent keywords and long-tail phrases.',
                        items: { type: Type.STRING }
                    },
                    metaTitle: {
                        type: Type.STRING,
                        description: 'A compelling, keyword-rich meta title under 60 characters.'
                    },
                    metaDescription: {
                        type: Type.STRING,
                        description: 'A persuasive meta description under 160 characters that encourages clicks.'
                    }
                },
                required: ['keywords', 'metaTitle', 'metaDescription']
            };

            const response = await ai.models.generateContent({
                model: "gemini-2.5-pro",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                    tools: [{ googleSearch: {} }],
                }
            });
            
            const generatedPackage = JSON.parse(response.text);
            setSeoPackage(generatedPackage);

        } catch (e) {
            console.error("AI SEO Optimizer Error:", e);
            setError("Failed to generate SEO package. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 text-3xl">📈</div>
                <div>
                    <h2 className="text-xl font-bold text-uc-secondary dark:text-white">AI SEO Optimizer</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Boost your organic traffic. Select a product to generate keywords and meta tags based on real-time search trends.</p>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4">
                 <div>
                    <label htmlFor="seo-product-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product</label>
                    <select id="seo-product-select" value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} className="mt-1 block w-full input-style">
                        {products.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                    </select>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isLoading || !selectedProductId}
                    className="w-full flex justify-center py-3 px-4 bg-uc-secondary text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-opacity-50 disabled:cursor-not-allowed"
                >
                     {isLoading ? 'Optimizing...' : 'Generate SEO Package'}
                </button>
            </div>
            
            {error && <p className="mt-4 text-sm text-red-500 text-center">{error}</p>}
            
            {seoPackage && (
                <div className="mt-6 space-y-4 animate-fade-in">
                    <SeoSection title="Meta Title" content={seoPackage.metaTitle} isCopyable />
                    <SeoSection title="Meta Description" content={seoPackage.metaDescription} isCopyable />
                    <div>
                        <h3 className="font-bold text-uc-secondary dark:text-gray-100">Keywords</h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {seoPackage.keywords.map((keyword, i) => (
                                <span key={i} className="px-2 py-1 bg-uc-primary/10 text-uc-primary text-xs font-semibold rounded-full">{keyword}</span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
             <style>{`.input-style { padding: 0.5rem 0.75rem; border-width: 1px; border-color: #D1D5DB; border-radius: 0.5rem; outline: none; transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1); background-color: white; width: 100%; } .dark .input-style { border-color: #4B5563; background-color: #374151; color: #F3F4F6; } .input-style:focus { --tw-ring-color: #FF7A00; border-color: #FF7A00; box-shadow: 0 0 0 2px var(--tw-ring-color); }`}</style>
        </div>
    );
};

const SeoSection: React.FC<{title: string, content: string, isCopyable?: boolean}> = ({ title, content, isCopyable }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg relative">
        <h3 className="font-bold text-uc-secondary dark:text-gray-100 text-sm">{title}</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 pr-8">{content}</p>
        {isCopyable && (
            <button onClick={handleCopy} className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-md">
                {copied ? 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> :
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" /><path d="M4 3a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H4z" /></svg>}
            </button>
        )}
    </div>
    )
};

export default AISeoOptimizer;