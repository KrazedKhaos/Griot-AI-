import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { AIBusinessPlan } from '../../types';

const AIBusinessStrategist: React.FC = () => {
    const [idea, setIdea] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [plan, setPlan] = useState<AIBusinessPlan | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!idea) {
            setError('Please enter a business or product idea.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setPlan(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Analyze the following business idea and generate a concise, actionable mini-business plan. Business Idea: "${idea}"`;
            
            const responseSchema = {
                type: Type.OBJECT,
                properties: {
                    targetAudience: { 
                        type: Type.STRING, 
                        description: "Describe the primary customer persona for this idea in detail. Who are they, what are their pain points, and what motivates them?" 
                    },
                    uniqueSellingProposition: { 
                        type: Type.STRING, 
                        description: "What makes this idea stand out from potential competitors? What is its single most compelling benefit?" 
                    },
                    competitorAnalysis: { 
                        type: Type.STRING, 
                        description: "Briefly identify 2-3 potential types of competitors or existing alternatives and how this idea is different." 
                    },
                    pricingStrategy: { 
                        type: Type.STRING, 
                        description: "Suggest a plausible pricing model and specific price point for this product (e.g., one-time fee, subscription). Justify your suggestion." 
                    }
                },
                required: ['targetAudience', 'uniqueSellingProposition', 'competitorAnalysis', 'pricingStrategy']
            };

            const response = await ai.models.generateContent({
                model: "gemini-2.5-pro",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                    systemInstruction: "You are a seasoned business strategist and startup consultant. Your advice is sharp, insightful, and focused on practical application. You will respond only with the JSON object defined in the schema.",
                }
            });
            
            const generatedPlan = JSON.parse(response.text);
            setPlan(generatedPlan);

        } catch (e) {
            console.error("AI Business Strategist Error:", e);
            setError("Failed to generate the business plan. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 text-3xl">🚀</div>
                <div>
                    <h2 className="text-xl font-bold text-uc-secondary dark:text-white">AI Business Strategist</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Turn your idea into a plan. Describe your concept, and the AI will generate a strategic outline.</p>
                </div>
            </div>

            <div className="mt-4">
                <textarea
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full input-style"
                    placeholder="e.g., An AI-powered meal planning app for busy professionals..."
                />
                 <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="mt-2 w-full flex justify-center py-3 px-4 bg-uc-secondary text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-opacity-50 disabled:cursor-not-allowed"
                >
                     {isLoading ? 'Generating Plan...' : 'Generate Business Plan'}
                </button>
            </div>
            
            {error && <p className="mt-4 text-sm text-red-500 text-center">{error}</p>}

            {plan && (
                <div className="mt-6 space-y-4 animate-fade-in">
                    <PlanSection title="Target Audience" content={plan.targetAudience} />
                    <PlanSection title="Unique Selling Proposition" content={plan.uniqueSellingProposition} />
                    <PlanSection title="Competitor Analysis" content={plan.competitorAnalysis} />
                    <PlanSection title="Pricing Strategy" content={plan.pricingStrategy} />
                </div>
            )}
             <style>{`.input-style { padding: 0.5rem 0.75rem; border-width: 1px; border-color: #D1D5DB; border-radius: 0.5rem; outline: none; transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1); background-color: white; width: 100%; } .dark .input-style { border-color: #4B5563; background-color: #374151; color: #F3F4F6; } .input-style:focus { --tw-ring-color: #FF7A00; border-color: #FF7A00; box-shadow: 0 0 0 2px var(--tw-ring-color); }`}</style>
        </div>
    );
};

const PlanSection: React.FC<{title: string, content: string}> = ({ title, content }) => (
    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
        <h3 className="font-bold text-uc-secondary dark:text-gray-100">{title}</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{content}</p>
    </div>
);

export default AIBusinessStrategist;