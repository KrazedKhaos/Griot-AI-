import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { SocialCampaignIdea } from '../../types';

const platforms = ['TikTok', 'Instagram Reels', 'X (Twitter)', 'Facebook Post'];

const AISocialGateway: React.FC = () => {
    const [feature, setFeature] = useState('Our new "Connect" dating hub');
    const [isLoading, setIsLoading] = useState(false);
    const [ideas, setIdeas] = useState<SocialCampaignIdea[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!feature) {
            setError('Please enter a feature to promote.');
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
                        platform: { type: Type.STRING, enum: platforms },
                        post_idea: { type: Type.STRING, description: 'A creative and engaging post idea, including visual suggestions for video platforms.' },
                        hashtag_suggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of 3-5 relevant and trending hashtags.' },
                    }
                }
            };

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Generate a viral marketing campaign to promote this new app feature: "${feature}". Create one post idea for each of these platforms: ${platforms.join(', ')}.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                    systemInstruction: "You are a viral marketing expert specializing in Gen-Z and Millennial audiences. Your ideas are creative, authentic, and designed to generate buzz.",
                    thinkingConfig: { thinkingBudget: 0 }
                }
            });

            const generatedIdeas = JSON.parse(response.text);
            setIdeas(generatedIdeas);

        } catch (e) {
            console.error("AI Social Gateway Error:", e);
            setError("Failed to generate campaign ideas. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const PlatformIcon: React.FC<{platform: string}> = ({ platform }) => {
        let icon = '💬';
        if (platform.includes('TikTok')) icon = '🎵';
        if (platform.includes('Instagram')) icon = '📸';
        if (platform.includes('Twitter')) icon = '🐦';
        if (platform.includes('Facebook')) icon = '👍';
        return <span className="text-xl">{icon}</span>;
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 text-3xl">🚀</div>
                <div>
                    <h2 className="text-xl font-bold text-uc-secondary dark:text-white">AI Social Gateway</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Generate viral campaigns to drive traffic to your app. Describe a feature and get post ideas for major social platforms.</p>
                </div>
            </div>
            
            <div className="mt-4">
                <label htmlFor="feature-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Feature to Promote</label>
                <input
                    type="text"
                    id="feature-input"
                    value={feature}
                    onChange={(e) => setFeature(e.target.value)}
                    className="mt-1 block w-full input-style"
                />
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="mt-2 w-full flex justify-center py-3 px-4 bg-uc-secondary text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-opacity-50"
                >
                    {isLoading ? 'Generating Ideas...' : 'Generate Campaign Ideas'}
                </button>
            </div>
            
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            
            {ideas.length > 0 && (
                <div className="mt-6 space-y-4">
                    {ideas.map((idea, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                            <h3 className="font-bold text-uc-secondary dark:text-gray-100 flex items-center"><PlatformIcon platform={idea.platform} /><span className="ml-2">{idea.platform}</span></h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{idea.post_idea}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {idea.hashtag_suggestions.map(tag => (
                                    <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 text-xs font-medium rounded-full">#{tag}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <style>{`.input-style { padding: 0.5rem 0.75rem; border-width: 1px; border-color: #D1D5DB; border-radius: 0.5rem; outline: none; transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1); background-color: white; width: 100%; } .dark .input-style { border-color: #4B5563; background-color: #374151; color: #F3F4F6; } .input-style:focus { --tw-ring-color: #FF7A00; border-color: #FF7A00; box-shadow: 0 0 0 2px var(--tw-ring-color); }`}</style>
        </div>
    );
};

export default AISocialGateway;