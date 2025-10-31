import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { AIBrandKit } from '../../types';

const AIBrandKitGenerator: React.FC = () => {
    const [vibe, setVibe] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [brandKit, setBrandKit] = useState<AIBrandKit | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!vibe) {
            setError('Please describe your brand\'s vibe.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setBrandKit(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            
            const responseSchema = {
                type: Type.OBJECT,
                properties: {
                    colorPalette: {
                        type: Type.ARRAY,
                        description: 'A list of 5 colors. Each color should have a hex code and a descriptive name (e.g., "Deep Ocean Blue").',
                        items: {
                            type: Type.OBJECT, properties: { hex: { type: Type.STRING }, name: { type: Type.STRING } }
                        }
                    },
                    fontPairings: {
                        type: Type.OBJECT,
                        description: 'A pair of Google Fonts that work well together.',
                        properties: { headline: { type: Type.STRING }, body: { type: Type.STRING } }
                    },
                    logoConcept: {
                        type: Type.STRING,
                        description: 'A brief, creative concept for a logo that fits the brand vibe.'
                    }
                }
            };

            const response = await ai.models.generateContent({
                model: "gemini-2.5-pro",
                contents: `Generate a brand identity kit based on this vibe: "${vibe}". The kit should be modern, cohesive, and visually appealing.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                    systemInstruction: "You are a world-class brand designer with a keen eye for aesthetics and modern design trends.",
                }
            });
            
            const generatedKit = JSON.parse(response.text);
            setBrandKit(generatedKit);

        } catch (e) {
            console.error("AI Brand Kit Generator Error:", e);
            setError("Failed to generate brand kit. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 text-3xl">🎨</div>
                <div>
                    <h2 className="text-xl font-bold text-uc-secondary dark:text-white">AI Brand Kit Generator</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Define your brand's identity instantly. Describe the feeling you want to convey, and let the AI do the rest.</p>
                </div>
            </div>

            <div className="mt-4">
                <input
                    type="text"
                    value={vibe}
                    onChange={(e) => setVibe(e.target.value)}
                    className="mt-1 block w-full input-style"
                    placeholder="e.g., trustworthy and professional for finance"
                />
                 <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="mt-2 w-full flex justify-center py-3 px-4 bg-uc-secondary text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-opacity-50 disabled:cursor-not-allowed"
                >
                     {isLoading ? 'Designing...' : 'Generate Brand Kit'}
                </button>
            </div>
            
            {error && <p className="mt-4 text-sm text-red-500 text-center">{error}</p>}

            {brandKit && (
                <div className="mt-6 space-y-4 animate-fade-in">
                    <div>
                        <h3 className="font-bold text-uc-secondary dark:text-gray-100">Color Palette</h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {brandKit.colorPalette.map(color => (
                                <div key={color.hex} className="text-center">
                                    <div className="w-16 h-16 rounded-lg shadow-inner" style={{ backgroundColor: color.hex }}></div>
                                    <p className="text-xs mt-1 font-medium text-gray-600 dark:text-gray-300">{color.name}</p>
                                    <p className="text-xs text-gray-400">{color.hex}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                     <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                        <h3 className="font-bold text-uc-secondary dark:text-gray-100 text-sm">Font Pairing</h3>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300"><strong>Headline:</strong> {brandKit.fontPairings.headline}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Body:</strong> {brandKit.fontPairings.body}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                        <h3 className="font-bold text-uc-secondary dark:text-gray-100 text-sm">Logo Concept</h3>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{brandKit.logoConcept}</p>
                    </div>
                </div>
            )}
             <style>{`.input-style { padding: 0.5rem 0.75rem; border-width: 1px; border-color: #D1D5DB; border-radius: 0.5rem; outline: none; transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1); background-color: white; width: 100%; } .dark .input-style { border-color: #4B5563; background-color: #374151; color: #F3F4F6; } .input-style:focus { --tw-ring-color: #FF7A00; border-color: #FF7A00; box-shadow: 0 0 0 2px var(--tw-ring-color); }`}</style>
        </div>
    );
};

export default AIBrandKitGenerator;