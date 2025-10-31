import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { AIDigitalBridgeStrategy } from '../../types';
import { useTranslations } from '../../hooks/useTranslations';

const AIDigitalBridgeBuilder: React.FC = () => {
    const t = useTranslations();
    const [idea, setIdea] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [strategy, setStrategy] = useState<AIDigitalBridgeStrategy | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!idea) {
            setError('Please enter a business or product idea.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setStrategy(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Based on the following business/product idea, generate a "Connectivity Strategy Package" for an entrepreneur in an emerging market, particularly in Africa. Business Idea: "${idea}"`;
            
            const responseSchema = {
                type: Type.OBJECT,
                properties: {
                    lowBandwidthMarketing: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING, description: "Title for Low-Bandwidth Marketing section." },
                            strategies: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of 3 marketing strategies for low-connectivity areas." }
                        }
                    },
                    offlineFirstStrategies: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING, description: "Title for Offline-First Strategies section." },
                            strategies: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of 3 strategies for offline engagement and sales." }
                        }
                    },
                    communityGrowthPlan: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING, description: "Title for Community Growth Plan section." },
                            strategies: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of 3 strategies for building a local community." }
                        }
                    },
                    microFranchiseModel: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING, description: "Title for Micro-Franchise Model section." },
                            plan: { type: Type.STRING, description: "A simple, one-paragraph micro-franchise or reseller model." }
                        }
                    }
                }
            };

            const response = await ai.models.generateContent({
                model: "gemini-2.5-pro",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                    systemInstruction: "You are 'Anansi', an AI strategist specializing in digital empowerment for emerging markets, particularly in Africa. You understand the challenges of low connectivity, limited access to traditional banking, and the power of community. Your advice is always practical, culturally aware, and focused on creating real-world opportunities with digital tools. You provide actionable strategies that can be implemented with minimal resources.",
                }
            });
            
            const generatedStrategy = JSON.parse(response.text);
            setStrategy(generatedStrategy);

        } catch (e) {
            console.error("AI Digital Bridge Builder Error:", e);
            setError(t.bridgeBuilderError);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 text-3xl">🌉</div>
                <div>
                    <h2 className="text-xl font-bold text-uc-secondary dark:text-white">{t.digitalBridgeBuilder}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t.digitalBridgeBuilderDescription}</p>
                </div>
            </div>

            <div className="mt-4">
                <textarea
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full input-style"
                    placeholder={t.enterBusinessIdea}
                />
                 <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="mt-2 w-full flex justify-center py-3 px-4 bg-uc-secondary text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-opacity-50 disabled:cursor-not-allowed"
                >
                     {isLoading ? t.generatingPackage : t.generateStrategyPackage}
                </button>
            </div>
            
            {error && <p className="mt-4 text-sm text-red-500 text-center">{error}</p>}

            {strategy && (
                <div className="mt-6 space-y-4 animate-fade-in">
                    <StrategySection title={t.lowBandwidthMarketing} items={strategy.lowBandwidthMarketing.strategies} icon={<MarketingIcon />} />
                    <StrategySection title={t.offlineFirstStrategies} items={strategy.offlineFirstStrategies.strategies} icon={<OfflineIcon />} />
                    <StrategySection title={t.communityGrowthPlan} items={strategy.communityGrowthPlan.strategies} icon={<CommunityIcon />} />
                    <StrategySection title={t.microFranchiseModel} content={strategy.microFranchiseModel.plan} icon={<FranchiseIcon />} />
                </div>
            )}
             <style>{`.input-style { padding: 0.5rem 0.75rem; border-width: 1px; border-color: #D1D5DB; border-radius: 0.5rem; outline: none; transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1); background-color: white; width: 100%; } .dark .input-style { border-color: #4B5563; background-color: #374151; color: #F3F4F6; } .input-style:focus { --tw-ring-color: #FF7A00; border-color: #FF7A00; box-shadow: 0 0 0 2px var(--tw-ring-color); }`}</style>
        </div>
    );
};

const StrategySection: React.FC<{title: string; icon: React.ReactElement; content?: string; items?: string[]}> = ({ title, icon, content, items }) => (
    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
        <h3 className="font-bold text-uc-secondary dark:text-gray-100 flex items-center"><span className="mr-2">{icon}</span> {title}</h3>
        {content && <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{content}</p>}
        {items && (
             <ul className="mt-2 space-y-2">
                {items.map((item, index) => (
                    <li key={index} className="flex items-start">
                        <span className="mr-3 mt-1.5 flex-shrink-0 h-2 w-2 rounded-full bg-uc-primary"></span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                ))}
            </ul>
        )}
    </div>
);

const MarketingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 16a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>;
const OfflineIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 102 0V3a1 1 0 00-1-1zM4 4h3a1 1 0 100-2H4a1 1 0 000 2zM13 2h3a1 1 0 100 2h-3a1 1 0 100-2zM4 9a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM3 14a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>;
const CommunityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v-1h8v1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a4 4 0 00-4-4H8a4 4 0 00-4 4v1h12z" /></svg>;
const FranchiseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" /></svg>;

export default AIDigitalBridgeBuilder;