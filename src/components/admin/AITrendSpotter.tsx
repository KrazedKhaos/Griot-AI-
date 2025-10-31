import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { AITrendingProductIdea } from '../../types';

interface AITrendSpotterProps {
    onQuickAdd: (idea: AITrendingProductIdea) => void;
}

const AITrendSpotter: React.FC<AITrendSpotterProps> = ({ onQuickAdd }) => {
    const [topic, setTopic] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [ideas, setIdeas] = useState<AITrendingProductIdea[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!topic) {
            setError('Please enter a topic to search for trends.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setIdeas([]);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const responseSchema = {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: 'A catchy, marketable title for the product idea.' },
                        description: { type: Type.STRING, description: 'A short, one-sentence description of the product idea.' },
                        marketingAngle: { type: Type.STRING, description: 'A concise marketing angle or description of the ideal target audience for this idea.' },
                    }
                }
            };

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Based on the topic "${topic}", generate a list of 5 innovative and commercially viable digital product or online course ideas that are likely to be trending in 2025-2026. For each idea, also provide a concise marketing angle or identify the primary target audience.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                    systemInstruction: "You are a market research analyst specializing in future trends for digital products and online courses. Provide creative and plausible product ideas.",
                    thinkingConfig: { thinkingBudget: 0 }
                }
            });

            const generatedIdeas = JSON.parse(response.text);
            setIdeas(generatedIdeas);

        } catch (e) {
            console.error("AI Trend Spotter Error:", e);
            setError("Failed to fetch trending ideas. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 text-3xl">🤖</div>
                <div>
                    <h2 className="text-xl font-bold text-uc-secondary dark:text-white">AI Trend Spotter</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Discover the next bestselling products. Enter a niche or topic to find trending product ideas for 2025-2026.</p>
                </div>
            </div>
            
            <div className="mt-4 flex items-center space-x-2">
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., AI productivity, home fitness, sustainable living"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-uc-primary focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-uc-text dark:text-gray-200"
                />
                <button
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="px-4 py-2 bg-uc-secondary text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                    {isLoading ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : 'Search Trends'}
                </button>
            </div>
            
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            
            {ideas.length > 0 && (
                <div className="mt-6 space-y-3">
                    <h3 className="font-semibold text-uc-text dark:text-gray-200">Generated Ideas:</h3>
                    {ideas.map((idea, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg flex justify-between items-center">
                            <div className="flex-1 min-w-0 pr-4">
                                <p className="font-semibold text-uc-secondary dark:text-gray-100">{idea.title}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{idea.description}</p>
                                <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 font-medium"><strong>Angle:</strong> {idea.marketingAngle}</p>
                            </div>
                            <button 
                                onClick={() => onQuickAdd(idea)}
                                className="text-sm bg-uc-primary text-white font-semibold py-1 px-3 rounded-md hover:bg-opacity-80 transition-colors whitespace-nowrap"
                            >
                                Quick Add
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AITrendSpotter;