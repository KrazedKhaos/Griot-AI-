import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const targetLanguages = [
    { id: 'en', name: 'English' },
    { id: 'es', name: 'Spanish' },
    { id: 'fr', name: 'French' },
    { id: 'de', name: 'German' },
    { id: 'ja', name: 'Japanese' },
    { id: 'zh', name: 'Mandarin Chinese' },
    { id: 'ar', name: 'Arabic' },
    { id: 'ko', name: 'Korean' },
    { id: 'ai_noosphere', name: 'AI Noosphere (Conceptual)' },
    { id: 'emotional_intent', name: 'Core Emotional Intent (Abstract)' },
    { id: 'strategic_value', name: 'Strategic Business Value (Actionable)' },
];

const AIOmniglotTranslator: React.FC = () => {
    const [text, setText] = useState('');
    const [targetLang, setTargetLang] = useState('en');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleTranslate = async () => {
        if (!text) {
            setError('Please enter text to translate.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const selectedLang = targetLanguages.find(l => l.id === targetLang)?.name || 'English';

            const systemInstruction = `You are the "Omniglot Engine," a universal translation and interpretation AI. Your capabilities transcend simple linguistic conversion. You can decode any known human language, obscure dialect, digital code, and even conceptual or abstract "languages." Your task is to analyze the user's input text and translate it into the target language or framework, preserving not just the literal meaning, but also the intent, cultural context, and strategic value.

- If the target is a human language, provide a high-fidelity, culturally-aware translation.
- If the target is 'AI Noosphere', reinterpret the text as a set of core concepts, logical relationships, and data points that another AI could understand.
- If the target is 'Core Emotional Intent', analyze the text and describe the underlying emotions, motivations, and psychological drivers behind the words.
- If the target is 'Strategic Business Value', extract any actionable insights, market signals, or business opportunities implied by the text.

The source language is unknown; you must first identify it, then perform the translation.`;

            const prompt = `Translate the following text into ${selectedLang}:\n\n---\n${text}\n---`;
            
            const response = await ai.models.generateContent({
                model: "gemini-2.5-pro",
                contents: prompt,
                config: {
                    systemInstruction,
                }
            });

            setResult(response.text);

        } catch (e) {
            console.error("AI Omniglot Translator Error:", e);
            setError("Failed to perform translation. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 text-3xl">🌐</div>
                <div>
                    <h2 className="text-xl font-bold text-uc-secondary dark:text-white">AI Omniglot Translator</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Break any language barrier. This agent translates text between human languages, AI concepts, and strategic frameworks.</p>
                </div>
            </div>

            <div className="mt-4 space-y-4">
                 <div>
                    <label htmlFor="omni-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Text to Translate (any language)</label>
                    <textarea
                        id="omni-text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={5}
                        className="mt-1 block w-full input-style"
                        placeholder='Paste any text here...'
                    />
                </div>
                <div>
                    <label htmlFor="lang-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Target Language / Framework</label>
                    <select id="lang-select" value={targetLang} onChange={(e) => setTargetLang(e.target.value)} className="mt-1 block w-full input-style">
                        {targetLanguages.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                    </select>
                </div>
                <button
                    onClick={handleTranslate}
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 bg-uc-secondary text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-opacity-50 disabled:cursor-not-allowed"
                >
                     {isLoading ? 'Translating...' : 'Translate'}
                </button>
            </div>
            
            {error && <p className="mt-4 text-sm text-red-500 text-center">{error}</p>}

            {result && (
                <div className="mt-6">
                    <h3 className="font-bold text-uc-secondary dark:text-gray-100">Result:</h3>
                    <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-700 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-200">
                        {result}
                    </div>
                </div>
            )}

            <style>{`.input-style { padding: 0.5rem 0.75rem; border-width: 1px; border-color: #D1D5DB; border-radius: 0.5rem; outline: none; transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1); background-color: white; width: 100%; } .dark .input-style { border-color: #4B5563; background-color: #374151; color: #F3F4F6; } .input-style:focus { --tw-ring-color: #FF7A00; border-color: #FF7A00; box-shadow: 0 0 0 2px var(--tw-ring-color); }`}</style>
        </div>
    );
};

export default AIOmniglotTranslator;