import React, { useState } from 'react';
import { DatingProfile } from '../../types';
import { GoogleGenAI } from "@google/genai";
import { useTranslations } from '../../hooks/useTranslations';

interface AIIcebreakerModalProps {
    isOpen: boolean;
    onClose: () => void;
    profile: DatingProfile;
    onSelectIcebreaker: (text: string) => void;
}

const AIIcebreakerModal: React.FC<AIIcebreakerModalProps> = ({ isOpen, onClose, profile, onSelectIcebreaker }) => {
    const t = useTranslations();
    const [isLoading, setIsLoading] = useState(false);
    const [icebreakers, setIcebreakers] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        setIcebreakers([]);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `
                You are an AI Wingman. Your goal is to help a user start a conversation with someone they matched with on a dating app.

                **Their Match's Profile:**
                - Name: ${profile.name}
                - Bio: "${profile.bio}"
                - Interests: ${profile.interests.join(', ')}

                Generate a list of 3 unique, creative, and respectful icebreakers. The icebreakers should:
                - Be based on their bio or interests.
                - Be open-ended questions to encourage a response.
                - Avoid generic compliments about appearance.
                - Be fun, a little witty, but not cheesy.
            `;

            const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
            const generatedText = response.text;
            // Simple parsing assuming each icebreaker is on a new line starting with a number or bullet
            const parsed = generatedText.split('\n').map(line => line.replace(/^\s*[\d*.-]+\s*/, '')).filter(line => line.trim().length > 0);
            setIcebreakers(parsed.slice(0, 3));

        } catch (e) {
            console.error("AI Icebreaker Error:", e);
            setError(t.icebreakerError);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSelect = (text: string) => {
        onSelectIcebreaker(text);
        onClose();
    }
    
    if(!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center animate-fade-in" onClick={onClose}>
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl m-4" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b dark:border-gray-700">
                    <h2 className="text-xl font-bold text-uc-secondary dark:text-gray-100">{t.aiIcebreaker}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.aiIcebreakerSubtext}</p>
                </div>

                <div className="p-6 space-y-4">
                    {isLoading && (
                         <div className="text-center p-4">
                            <svg className="animate-spin h-6 w-6 text-uc-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            <p className="mt-2 text-sm text-uc-secondary dark:text-gray-300 font-semibold">{t.generating}</p>
                        </div>
                    )}

                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                    
                    {icebreakers.length > 0 && !isLoading && (
                        <div className="space-y-3">
                            {icebreakers.map((text, index) => (
                                <button key={index} onClick={() => handleSelect(text)} className="w-full text-left p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                    <p className="text-sm text-uc-text dark:text-gray-200">"{text}"</p>
                                </button>
                            ))}
                        </div>
                    )}
                    
                    {icebreakers.length === 0 && !isLoading && (
                         <button onClick={handleGenerate} className="w-full py-3 bg-uc-primary text-white font-bold rounded-lg hover:bg-opacity-90">
                            {t.generateIcebreakers}
                        </button>
                    )}
                </div>
                 <div className="flex justify-end p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-uc-text dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
                        {t.close}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIIcebreakerModal;