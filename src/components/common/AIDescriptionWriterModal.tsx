import React, { useState } from 'react';
import { Product } from '../../types';
import { GoogleGenAI } from "@google/genai";
import { useTranslations } from '../../hooks/useTranslations';

interface AIDescriptionWriterModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
}

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2l4.45.647a1 1 0 01.554 1.705l-3.22 3.138 1.17 4.628a1 1 0 01-1.451 1.054L12 15.58l-3.996 2.099a1 1 0 01-1.451-1.054l1.17-4.628L4.49 9.553a1 1 0 01.554-1.705l4.45-.647L11.033 2.744A1 1 0 0112 2z" clipRule="evenodd" />
    </svg>
);

const AIDescriptionWriterModal: React.FC<AIDescriptionWriterModalProps> = ({ isOpen, onClose, product }) => {
    const t = useTranslations();
    const [tone, setTone] = useState('Persuasive');
    const [audience, setAudience] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedContent, setGeneratedContent] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState(false);

    const tones = [t.persuasive, t.professional, t.playful, t.urgent, t.empathetic];

    const handleGenerate = async () => {
        setIsLoading(true);
        setGeneratedContent('');
        setError(null);
        setCopySuccess(false);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `
                You are an expert marketing copywriter. Your task is to rewrite a product description.

                **Product Information:**
                - Title: "${product.title}"
                - Category: "${product.category}"
                - Current Description: "${product.description}"
                - Key Benefits: ${product.benefits.join(', ')}

                **Instructions:**
                - Rewrite the description to be more compelling.
                - Adopt a **${tone}** tone.
                - Target the content towards: **${audience || 'a general audience'}**.
                - The new description should be 2-3 paragraphs long and focus on the value and transformation the user will get.
                - Do NOT just rephrase the old description. Create something fresh and exciting.
            `;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
            });
            setGeneratedContent(response.text.trim());
        } catch (e) {
            console.error("AI Description Writer Error:", e);
            setError("Failed to generate content. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(generatedContent);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center animate-fade-in" onClick={onClose}>
            <div
                className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-xl m-4 animate-slide-in-up"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <h2 className="text-xl font-bold text-uc-secondary dark:text-gray-100">{t.aiDescriptionWriter}</h2>
                    <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" title={t.close}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t.writerDescription}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="tone-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.selectTone}</label>
                            <select id="tone-select" value={tone} onChange={e => setTone(e.target.value)} className="mt-1 block w-full input-style">
                                {tones.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                             <label htmlFor="audience-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.targetAudience}</label>
                            <input type="text" id="audience-input" value={audience} onChange={e => setAudience(e.target.value)} className="mt-1 block w-full input-style" placeholder={t.audiencePlaceholder} />
                        </div>
                    </div>
                    
                    <div className="relative">
                        <textarea
                            readOnly
                            value={isLoading ? t.generatingDescription : generatedContent}
                            rows={8}
                            className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700 text-uc-text dark:text-gray-300 resize-none"
                            placeholder="Generated content will appear here..."
                        />
                        {generatedContent && !isLoading && (
                            <button onClick={handleCopyToClipboard} className="absolute top-2 right-2 p-1.5 bg-gray-200 dark:bg-gray-600 text-uc-text dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500" title={copySuccess ? t.copied : t.copyToClipboard}>
                                {copySuccess ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" /><path d="M4 3a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H4z" /></svg>
                                )}
                            </button>
                        )}
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                </div>

                <div className="flex justify-end items-center p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="px-6 py-2 bg-uc-secondary text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {isLoading ? (
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                           <SparklesIcon className="w-5 h-5 mr-2" />
                        )}
                        {isLoading ? t.rewriting : t.rewrite}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIDescriptionWriterModal;
