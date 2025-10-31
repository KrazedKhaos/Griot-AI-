import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { AIBrandIdentity } from '../../types';

const AIBrandIdentityAgent: React.FC = () => {
    const [brandInfo, setBrandInfo] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [identity, setIdentity] = useState<AIBrandIdentity | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!brandInfo) {
            setError('Please describe your brand or product.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setIdentity(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const responseSchema = {
                type: Type.OBJECT,
                properties: {
                    archetype: { type: Type.STRING, description: "The primary brand archetype (e.g., The Hero, The Sage, The Creator) that best fits the brand." },
                    manifesto: { type: Type.STRING, description: "A short, powerful brand manifesto (2-3 sentences) that declares the brand's purpose and beliefs." },
                    voiceAndTone: { type: Type.STRING, description: "A description of the brand's voice and tone (e.g., 'Authoritative and wise, but accessible and encouraging')." },
                    masterPrompt: { type: Type.STRING, description: "A detailed system prompt that can be used with other AI models to generate on-brand content. It should encapsulate the archetype, voice, tone, and core mission." },
                },
                required: ['archetype', 'manifesto', 'voiceAndTone', 'masterPrompt']
            };

            const response = await ai.models.generateContent({
                model: "gemini-2.5-pro",
                contents: `Generate a complete brand identity for a brand described as: "${brandInfo}"`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                    systemInstruction: "You are a master brand strategist and storyteller named 'Aether'. Your task is to distill the essence of a brand into a powerful, cohesive identity based on the user's input. You create identities that are deep, meaningful, and actionable.",
                }
            });

            const generatedIdentity = JSON.parse(response.text);
            setIdentity(generatedIdentity);

        } catch (e) {
            console.error("AI Brand Identity Agent Error:", e);
            setError("Failed to generate the brand identity. The model may be unable to produce the required structured output for this input. Please try again with a more detailed description.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 text-3xl">💠</div>
                <div>
                    <h2 className="text-xl font-bold text-uc-secondary dark:text-white">AI Brand Identity Agent</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Define your brand's soul. This agent will forge your brand's archetype, manifesto, and a master prompt to ensure all future AI content is perfectly on-brand.</p>
                </div>
            </div>

            <div className="mt-4">
                <textarea
                    value={brandInfo}
                    onChange={(e) => setBrandInfo(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full input-style"
                    placeholder="Describe your brand's mission, values, and target audience..."
                />
                 <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="mt-2 w-full flex justify-center py-3 px-4 bg-uc-secondary text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-opacity-50 disabled:cursor-not-allowed"
                >
                     {isLoading ? 'Forging Identity...' : 'Generate Brand Identity'}
                </button>
            </div>
            
            {error && <p className="mt-4 text-sm text-red-500 text-center">{error}</p>}

            {identity && (
                <div className="mt-6 space-y-4 animate-fade-in">
                    <IdentitySection title="Brand Archetype" content={identity.archetype} />
                    <IdentitySection title="Brand Manifesto" content={identity.manifesto} />
                    <IdentitySection title="Voice & Tone" content={identity.voiceAndTone} />
                    <IdentitySection title="Master Prompt (for other AIs)" content={identity.masterPrompt} isCode />
                </div>
            )}
            <style>{`.input-style { padding: 0.5rem 0.75rem; border-width: 1px; border-color: #D1D5DB; border-radius: 0.5rem; outline: none; transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1); background-color: white; width: 100%; } .dark .input-style { border-color: #4B5563; background-color: #374151; color: #F3F4F6; } .input-style:focus { --tw-ring-color: #FF7A00; border-color: #FF7A00; box-shadow: 0 0 0 2px var(--tw-ring-color); }`}</style>
        </div>
    );
};

const IdentitySection: React.FC<{title: string, content: string, isCode?: boolean}> = ({ title, content, isCode }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
    <div className={`bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg relative ${isCode ? 'border-l-4 border-uc-primary' : ''}`}>
        <h3 className="font-bold text-uc-secondary dark:text-gray-100">{title}</h3>
        <p className={`mt-1 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap ${isCode ? 'font-mono text-xs' : ''}`}>{content}</p>
        {isCode && (
            <button onClick={handleCopy} className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-md">
                {copied ? 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> :
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" /><path d="M4 3a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H4z" /></svg>}
            </button>
        )}
    </div>
    )
};

export default AIBrandIdentityAgent;