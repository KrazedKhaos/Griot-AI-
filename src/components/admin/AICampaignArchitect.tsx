import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Product, AICampaign } from '../../types';

interface AICampaignArchitectProps {
    products: Product[];
}

const campaignGoals = [
    { id: 'launch', name: 'Product Launch' },
    { id: 'sale', name: 'Flash Sale (48 hours)' },
    { id: 'evergreen', name: 'Evergreen Promotion' },
    { id: 'webinar', name: 'Webinar Follow-up' },
];

const AICampaignArchitect: React.FC<AICampaignArchitectProps> = ({ products }) => {
    const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
    const [selectedGoal, setSelectedGoal] = useState<string>(campaignGoals[0].id);
    const [isLoading, setIsLoading] = useState(false);
    const [campaign, setCampaign] = useState<AICampaign | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        const selectedProduct = products.find(p => p.id === selectedProductId);
        if (!selectedProduct) {
            setError('Please select a valid product.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setCampaign(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const goalName = campaignGoals.find(c => c.id === selectedGoal)?.name;
            const prompt = `
                Product Info:
                - Title: "${selectedProduct.title}"
                - Description: "${selectedProduct.description}"
                - Benefits: ${selectedProduct.benefits.join(', ')}

                Marketing Goal: ${goalName}

                Based on the product and goal, generate a complete, multi-channel marketing campaign. The campaign should consist of:
                1.  An email sequence with 3 emails. Each email needs a compelling subject line and body copy.
                2.  A set of 3 social media posts, one each for Facebook, Twitter (X), and LinkedIn. Tailor the tone for each platform.
                3.  A list of 3 distinct blog post ideas that could be used to promote the product.
            `;
            
            const responseSchema = {
                type: Type.OBJECT,
                properties: {
                    emailSequence: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT, properties: { subject: { type: Type.STRING }, body: { type: Type.STRING } }
                        }
                    },
                    socialMediaPosts: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT, properties: { platform: { type: Type.STRING }, content: { type: Type.STRING } }
                        }
                    },
                    blogPostIdeas: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
            };
            
            const response = await ai.models.generateContent({
                model: "gemini-2.5-pro",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                    systemInstruction: "You are a world-class marketing strategist, known for creating high-impact, automated campaigns.",
                }
            });
            
            const generatedCampaign = JSON.parse(response.text);
            setCampaign(generatedCampaign);

        } catch (e) {
            console.error("AI Campaign Architect Error:", e);
            setError("Failed to generate campaign. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 text-3xl">🏰</div>
                <div>
                    <h2 className="text-xl font-bold text-uc-secondary dark:text-white">AI Campaign Architect</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Design a full marketing campaign in seconds. Select a product and a goal to generate all the assets you need.</p>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="campaign-product-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product</label>
                    <select id="campaign-product-select" value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} className="mt-1 block w-full input-style">
                        {products.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="goal-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Goal</label>
                    <select id="goal-select" value={selectedGoal} onChange={(e) => setSelectedGoal(e.target.value)} className="mt-1 block w-full input-style">
                        {campaignGoals.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
            </div>
            
            <div className="mt-4">
                 <button
                    onClick={handleGenerate}
                    disabled={isLoading || !selectedProductId}
                    className="w-full flex justify-center py-3 px-4 bg-uc-secondary text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-opacity-50 disabled:cursor-not-allowed"
                >
                     {isLoading ? 'Architecting Campaign...' : 'Generate Campaign'}
                </button>
            </div>
            
            {error && <p className="mt-4 text-sm text-red-500 text-center">{error}</p>}
            
            {campaign && (
                <div className="mt-6 space-y-6 animate-fade-in">
                    <CampaignSection title="Email Sequence">
                        {campaign.emailSequence.map((email, i) => (
                             <div key={i} className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-md">
                                <p className="font-semibold text-sm text-uc-secondary dark:text-gray-200">Subject: {email.subject}</p>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{email.body}</p>
                            </div>
                        ))}
                    </CampaignSection>
                    <CampaignSection title="Social Media Posts">
                         {campaign.socialMediaPosts.map((post, i) => (
                             <div key={i} className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-md">
                                <p className="font-semibold text-sm text-uc-secondary dark:text-gray-200">{post.platform}</p>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{post.content}</p>
                            </div>
                        ))}
                    </CampaignSection>
                     <CampaignSection title="Blog Post Ideas">
                        <ul className="list-disc list-inside space-y-1">
                             {campaign.blogPostIdeas.map((idea, i) => (
                                <li key={i} className="text-sm text-gray-600 dark:text-gray-300">{idea}</li>
                            ))}
                        </ul>
                    </CampaignSection>
                </div>
            )}
            <style>{`.input-style { padding: 0.5rem 0.75rem; border-width: 1px; border-color: #D1D5DB; border-radius: 0.5rem; outline: none; transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1); background-color: white; width: 100%; } .dark .input-style { border-color: #4B5563; background-color: #374151; color: #F3F4F6; } .input-style:focus { --tw-ring-color: #FF7A00; border-color: #FF7A00; box-shadow: 0 0 0 2px var(--tw-ring-color); }`}</style>
        </div>
    );
};

const CampaignSection: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
    <div>
        <h3 className="text-lg font-bold text-uc-secondary dark:text-white mb-2">{title}</h3>
        <div className="space-y-3">{children}</div>
    </div>
);


export default AICampaignArchitect;