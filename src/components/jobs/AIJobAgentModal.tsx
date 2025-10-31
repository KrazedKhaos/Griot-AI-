import React, { useState } from 'react';
import { Job } from '../../types';
import { GoogleGenAI, Type } from "@google/genai";
import { useTranslations } from '../../hooks/useTranslations';

interface AIJobAgentModalProps {
    isOpen: boolean;
    onClose: () => void;
    job: Job;
}

interface ApplicationMaterials {
    coverLetter: string;
    profileSummary: string;
}

const AIJobAgentModal: React.FC<AIJobAgentModalProps> = ({ isOpen, onClose, job }) => {
    const t = useTranslations();
    const [userInfo, setUserInfo] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [materials, setMaterials] = useState<ApplicationMaterials | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!userInfo) {
            setError('Please provide some information about your skills and experience.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setMaterials(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `
                Job Description:
                - Title: ${job.title}
                - Company: ${job.company}
                - Description: ${job.description}
                - Required Skills: ${job.skills.join(', ')}

                User's Information:
                - ${userInfo}

                Based on the job description and user's information, please generate:
                1. A professional and compelling cover letter, tailored specifically for this role.
                2. A concise profile summary (like a LinkedIn 'About' section) that highlights the user's suitability for this position.
            `;

            const responseSchema = {
                type: Type.OBJECT,
                properties: {
                    coverLetter: { type: Type.STRING, description: "The full text of the generated cover letter." },
                    profileSummary: { type: Type.STRING, description: "The full text of the generated profile summary." }
                }
            };

            const response = await ai.models.generateContent({
                model: "gemini-2.5-pro",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                    systemInstruction: "You are an expert career coach and professional resume writer. Your task is to help a user apply for a job by generating high-quality, personalized application materials.",
                }
            });
            
            const generatedMaterials = JSON.parse(response.text);
            setMaterials(generatedMaterials);

        } catch (e) {
            console.error("AI Job Agent Error:", e);
            setError(t.applicationFailed);
        } finally {
            setIsLoading(false);
        }
    };
    
    const CopyButton = ({ text }: { text: string }) => {
        const [copied, setCopied] = useState(false);
        const handleCopy = () => {
            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        };
        return (
            <button onClick={handleCopy} className="absolute top-2 right-2 p-1.5 bg-gray-200 dark:bg-gray-600 text-uc-text dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">
                {copied ? 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> :
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" /><path d="M4 3a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H4z" /></svg>
                }
            </button>
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center animate-fade-in" onClick={onClose}>
            <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-xl m-4" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b dark:border-gray-700">
                    <h2 className="text-xl font-bold text-uc-secondary dark:text-gray-100">{t.aiJobAgent}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">for {job.title}</p>
                </div>

                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    {!materials && (
                        <>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{t.aiJobAgentDescription}</p>
                            <div>
                                <label htmlFor="user-info" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.yourSkills}</label>
                                <textarea
                                    id="user-info"
                                    value={userInfo}
                                    onChange={(e) => setUserInfo(e.target.value)}
                                    rows={4}
                                    className="mt-1 block w-full input-style"
                                    placeholder={t.yourSkillsPlaceholder}
                                />
                            </div>
                        </>
                    )}

                    {isLoading && (
                        <div className="text-center p-8">
                            <svg className="animate-spin h-8 w-8 text-uc-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="mt-2 text-sm text-uc-secondary dark:text-gray-300 font-semibold">{t.generating}</p>
                        </div>
                    )}

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    {materials && (
                        <div className="space-y-4 animate-fade-in">
                            <div>
                                <h3 className="font-semibold text-uc-secondary dark:text-gray-200">{t.generatedCoverLetter}</h3>
                                <div className="relative mt-1">
                                    <textarea readOnly value={materials.coverLetter} rows={8} className="w-full input-style" />
                                    <CopyButton text={materials.coverLetter} />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-uc-secondary dark:text-gray-200">{t.generatedProfileSummary}</h3>
                                 <div className="relative mt-1">
                                    <textarea readOnly value={materials.profileSummary} rows={5} className="w-full input-style" />
                                    <CopyButton text={materials.profileSummary} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {!materials && (
                    <div className="flex justify-end p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
                        <button onClick={handleGenerate} disabled={isLoading || !userInfo} className="px-6 py-2 bg-uc-primary text-white font-bold rounded-lg hover:bg-opacity-90 disabled:bg-opacity-50">
                            {isLoading ? t.generating : t.generateApplication}
                        </button>
                    </div>
                )}
                 <style>{`.input-style { padding: 0.5rem 0.75rem; border-width: 1px; border-color: #D1D5DB; border-radius: 0.5rem; outline: none; transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1); background-color: #F9FAFB; width: 100%; } .dark .input-style { border-color: #4B5563; background-color: #374151; color: #F3F4F6; }`}</style>
            </div>
        </div>
    );
};

export default AIJobAgentModal;