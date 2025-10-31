import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { AIOpportunityReport } from '../../types';

const AIOpportunityScout: React.FC = () => {
    const [skills, setSkills] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [report, setReport] = useState<AIOpportunityReport | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleScout = async () => {
        if (!skills) {
            setError('Please enter your skills or interests.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setReport(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `
                Act as an AI Opportunity Scout. Your mission is to find monetization opportunities on the web based on a user's skills and interests.
                User's skills/interests: "${skills}"

                Search the web to find relevant and actionable opportunities. This could include:
                - Niche affiliate programs
                - Bug bounties
                - Content creation grants
                - Emerging digital product niches
                - Freelance platforms with high demand for these skills

                Structure your findings into the following sections, using the exact headings:
                **Identified Programs:** (List 3-5 specific programs, platforms, or niches with a brief description)
                **Potential Bounties:** (Describe the typical earning potential, e.g., "Commissions from 20-50%", "Bounties range from $100-$1000", etc.)
                **Required Skills:** (List the key skills needed to succeed, based on your findings)
                **First Steps:** (Provide 3 concrete, actionable first steps the user should take to start pursuing these opportunities)
            `;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-pro",
                contents: prompt,
                config: {
                    tools: [{ googleSearch: {} }],
                }
            });

            const text = response.text;
            
            const parseSection = (regex: RegExp) => {
                const match = text.match(regex);
                return match?.[1].trim().split('\n').map(item => item.replace(/^- |^\* |^\d+\. /, '').trim()).filter(Boolean) || [];
            };

            const parseSingleLineSection = (regex: RegExp) => {
                 const match = text.match(regex);
                 return match?.[1].trim() || 'No specific information found.';
            }

            const parsedReport: AIOpportunityReport = {
                identified_programs: parseSection(/\*\*Identified Programs:\*\*([\s\S]*?)\*\*Potential Bounties:\*\*/im),
                potential_bounties: parseSingleLineSection(/\*\*Potential Bounties:\*\*([\s\S]*?)\*\*Required Skills:\*\*/im),
                required_skills: parseSection(/\*\*Required Skills:\*\*([\s\S]*?)\*\*First Steps:\*\*/im),
                first_steps: parseSection(/\*\*First Steps:\*\*([\s\S]*)/im)
            };
            
            if (parsedReport.identified_programs.length === 0 && parsedReport.first_steps.length === 0) {
                throw new Error("Failed to parse report from model response.");
            }

            setReport(parsedReport);

        } catch (e) {
            console.error("AI Opportunity Scout Error:", e);
            setError("Failed to scout opportunities. The model may have had trouble with the web search. Please try a different query.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 text-3xl">🧭</div>
                <div>
                    <h2 className="text-xl font-bold text-uc-secondary dark:text-white">AI Opportunity Scout</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Discover your next venture. This agent scours the web for affiliate programs, bounties, and new niches based on your unique skills.</p>
                </div>
            </div>

            <div className="mt-4">
                <textarea
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    rows={2}
                    className="mt-1 block w-full input-style"
                    placeholder="Enter your skills or interests, e.g., 'copywriting, SEO, health & wellness', 'Python, data analysis', 'video editing'"
                />
                 <button
                    onClick={handleScout}
                    disabled={isLoading}
                    className="mt-2 w-full flex justify-center py-3 px-4 bg-uc-secondary text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-opacity-50 disabled:cursor-not-allowed"
                >
                     {isLoading ? 'Scouting...' : 'Scout Opportunities'}
                </button>
            </div>
            
            {error && <p className="mt-4 text-sm text-red-500 text-center">{error}</p>}

            {report && (
                <div className="mt-6 space-y-4 animate-fade-in">
                    <ReportSection title="Identified Programs & Niches" items={report.identified_programs} />
                    <ReportSection title="Potential Bounties & Earnings" content={report.potential_bounties} />
                    <ReportSection title="Required Skills" items={report.required_skills} />
                    <ReportSection title="Actionable First Steps" items={report.first_steps} isOpportunity />
                </div>
            )}
             <style>{`.input-style { padding: 0.5rem 0.75rem; border-width: 1px; border-color: #D1D5DB; border-radius: 0.5rem; outline: none; transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1); background-color: white; width: 100%; } .dark .input-style { border-color: #4B5563; background-color: #374151; color: #F3F4F6; } .input-style:focus { --tw-ring-color: #FF7A00; border-color: #FF7A00; box-shadow: 0 0 0 2px var(--tw-ring-color); }`}</style>
        </div>
    );
};

const ReportSection: React.FC<{title: string, content?: string, items?: string[], isOpportunity?: boolean}> = ({ title, content, items, isOpportunity }) => (
    <div className={`p-4 rounded-lg ${isOpportunity ? 'bg-green-50 dark:bg-gray-700/50 border-l-4 border-green-500' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
        <h3 className={`font-bold ${isOpportunity ? 'text-green-800 dark:text-green-300' : 'text-uc-secondary dark:text-gray-100'}`}>{title}</h3>
        {content && <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{content}</p>}
        {items && (
            <ul className="mt-2 space-y-2">
                {items.map((item, index) => (
                    <li key={index} className="flex items-start">
                        <span className={`mr-3 mt-1.5 flex-shrink-0 h-2 w-2 rounded-full ${isOpportunity ? 'bg-green-500' : 'bg-uc-primary'}`}></span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                ))}
            </ul>
        )}
    </div>
);

export default AIOpportunityScout;