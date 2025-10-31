import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Product } from '../../types';

interface AIMarketingMaestroProps {
    products: Product[];
}

const marketingChannels = [
    { id: 'facebook', name: 'Facebook Ad' },
    { id: 'email', name: 'Email Newsletter' },
    { id: 'blog', name: 'Blog Post Intro' },
    { id: 'twitter', name: 'Tweet / X Post' },
];

const AIMarketingMaestro: React.FC<AIMarketingMaestroProps> = ({ products }) => {
    const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
    const [selectedChannel, setSelectedChannel] = useState<string>(marketingChannels[0].id);
    const [isLoading, setIsLoading] = useState(false);
    const [generatedCopy, setGeneratedCopy] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        const selectedProduct = products.find(p => p.id === selectedProductId);
        if (!selectedProduct) {
            setError('Please select a valid product.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedCopy('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const channelName = marketingChannels.find(c => c.id === selectedChannel)?.name;
            const prompt = `
                Product Title: "${selectedProduct.title}"
                Product Description: "${selectedProduct.description}"
                Key Benefits: ${selectedProduct.benefits.join(', ')}
                Target Audience: People interested in ${selectedProduct.category}.

                Based on the product information above, write a compelling marketing copy for a ${channelName}.
                The tone should be persuasive, urgent, and benefit-driven.
                - For Facebook Ad: Include a catchy headline, body text, and a strong call-to-action. Use emojis.
                - For Email Newsletter: Write a subject line and a short, engaging email body.
                - For Blog Post Intro: Write an attention-grabbing first paragraph for a blog post reviewing this product.
                - For Tweet / X Post: Write a short, punchy post under 280 characters with relevant hashtags.
            `;
            
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                 config: {
                    systemInstruction: "You are an expert direct-response copywriter. Your goal is to generate high-converting marketing copy.",
                    thinkingConfig: { thinkingBudget: 0 }
                }
            });

            setGeneratedCopy(response.text);

        } catch (e) {
            console.error("AI Marketing Maestro Error:", e);
            setError("Failed to generate marketing copy. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(generatedCopy);
        // Consider adding a small toast notification for feedback
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 text-3xl">🎯</div>
                <div>
                    <h2 className="text-xl font-bold text-uc-secondary dark:text-white">AI Marketing Maestro</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Automate your marketing. Select a product and channel, and let the AI write your promotional copy.</p>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="product-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product</label>
                    <select
                        id="product-select"
                        value={selectedProductId}
                        onChange={(e) => setSelectedProductId(e.target.value)}
                        className="mt-1 block w-full input-style"
                    >
                        {products.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="channel-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Channel</label>
                    <select
                        id="channel-select"
                        value={selectedChannel}
                        onChange={(e) => setSelectedChannel(e.target.value)}
                        className="mt-1 block w-full input-style"
                    >
                        {marketingChannels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
            </div>

             <div className="mt-4">
                 <button
                    onClick={handleGenerate}
                    disabled={isLoading || !selectedProductId}
                    className="w-full flex justify-center py-3 px-4 bg-uc-secondary text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-opacity-50 disabled:cursor-not-allowed"
                >
                     {isLoading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : 'Generate Copy'}
                </button>
            </div>
             {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            
            {generatedCopy && (
                <div className="mt-6">
                    <div className="relative">
                        <textarea
                            readOnly
                            value={generatedCopy}
                            className="w-full h-48 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700 text-uc-text dark:text-gray-300"
                        />
                         <button 
                            onClick={handleCopyToClipboard}
                            className="absolute top-2 right-2 bg-gray-200 dark:bg-gray-600 text-uc-text dark:text-gray-200 p-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500"
                            aria-label="Copy to clipboard"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                                <path d="M4 3a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H4z" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
            <style>{`
                .input-style {
                    padding: 0.5rem 0.75rem; border-width: 1px; border-color: #D1D5DB; border-radius: 0.5rem; outline: none; transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1); background-color: white; width: 100%;
                }
                .dark .input-style { border-color: #4B5563; background-color: #374151; color: #F3F4F6; }
                .input-style:focus { --tw-ring-color: #FF7A00; border-color: #FF7A00; box-shadow: 0 0 0 2px var(--tw-ring-color); }
            `}</style>
        </div>
    );
};

export default AIMarketingMaestro;