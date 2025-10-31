import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { AIKnowledgeReport } from '../../types';

const loadingMessages = [
    "Scanning public archives...",
    "Consulting ancient texts...",
    "Synthesizing historical data...",
    "Cross-referencing mythological parallels...",
    "Analyzing niche market forums...",
    "Uncovering hidden opportunities...",
    "Compiling your knowledge report...",
];

const AIKnowledgeVault: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [report, setReport] = useState<AIKnowledgeReport | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSynthesize = async () => {
        if (!topic) {
            setError('Please enter a topic to research.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setReport(null);

        let messageIndex = 0;
        const interval = setInterval(() => {
            messageIndex = (messageIndex + 1) % loadingMessages.length;
            setLoadingMessage(loadingMessages[messageIndex]);
        }, 3000);
        setLoadingMessage(loadingMessages[0]);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `
                Act as a world-class research assistant with expertise in history, mythology, and business strategy.
                The user wants to understand the topic: "${topic}".

                Your task is to synthesize information from public web sources to create a comprehensive knowledge report. The report must include the following sections using the exact headings:
                **Summary:** (A concise overview of the topic)
                **Historical Context:** (Key historical events, figures, or origins related to the topic)
                **Key Concepts:** (A list of 3-5 core ideas or principles associated with the topic)
                **Mythological Parallels:** (Connections to myths, legends, or archetypal stories that resonate with the topic's themes)
                **Untapped Market Opportunities:** (Creative and "hidden" business or product ideas inspired by this topic that are not obvious)
            `;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-pro",
                contents: prompt,
                config: {
                    tools: [{ googleSearch: {} }],
                }
            });

            const text = response.text;
            const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
            const cited_sources = groundingChunks
                .filter(chunk => chunk.web && chunk.web.uri)
                .map(chunk => ({ uri: chunk.web!.uri, title: chunk.web!.title || '' }))
                .filter((source, index, self) => index === self.findIndex(s => s.uri === source.uri));

            const parseSection = (regex: RegExp) => {
                const match = text.match(regex);
                return match?.[1].trim().split('\n').map(item => item.replace(/^- |^\* |^\d+\. /, '').trim()).filter(Boolean) || [];
            };

            const parseSingleLineSection = (regex: RegExp) => {
                 const match = text.match(regex);
                 return match?.[1].trim() || 'No information found for this section.';
            }

            const parsedReport: AIKnowledgeReport = {
                summary: parseSingleLineSection(/\*\*Summary:\*\*([\s\S]*?)\*\*Historical Context:\*\*/im),
                historical_context: parseSingleLineSection(/\*\*Historical Context:\*\*([\s\S]*?)\*\*Key Concepts:\*\*/im),
                key_concepts: parseSection(/\*\*Key Concepts:\*\*([\s\S]*?)\*\*Mythological Parallels:\*\*/im),
                mythological_parallels: parseSingleLineSection(/\*\*Mythological Parallels:\*\*([\s\S]*?)\*\*Untapped Market Opportunities:\*\*/im),
                market_opportunities: parseSection(/\*\*Untapped Market Opportunities:\*\*([\s\S]*)/im),
                cited_sources: cited_sources,
            };

            if (!parsedReport.summary || parsedReport.summary.startsWith('No information')) {
                 throw new Error("Failed to parse the report from the model's response.");
            }
            
            setReport(parsedReport);

        } catch (e) {
            console.error("AI Knowledge Vault Error:", e);
            setError("Failed to synthesize knowledge. The model may have had trouble with the web search. Please try a different query.");
        } finally {
            clearInterval(interval);
            setIsLoading(false);
        }
    };
    
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 text-3xl">📚</div>
                <div>
                    <h2 className="text-xl font-bold text-uc-secondary dark:text-white">AI Knowledge Vault</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Unlock deep insights on any topic. This agent synthesizes web data into a comprehensive report covering history, mythology, and market opportunities.</p>
                </div>
            </div>

            <div className="mt-4">
                <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    rows={2}
                    className="mt-1 block w-full input-style"
                    placeholder="Enter a topic, concept, or historical figure... (e.g., 'Anansi the Spider')"
                />
                 <button
                    onClick={handleSynthesize}
                    disabled={isLoading}
                    className="mt-2 w-full flex justify-center py-3 px-4 bg-uc-secondary text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-opacity-50 disabled:cursor-not-allowed"
                >
                     {isLoading ? 'Synthesizing...' : 'Synthesize Knowledge'}
                </button>
            </div>
            
            {isLoading && (
                 <div className="mt-6 text-center">
                    <div className="flex justify-center items-center">
                         <svg className="animate-spin h-6 w-6 text-uc-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                    <p className="mt-2 text-sm text-uc-secondary dark:text-gray-300 font-semibold">{loadingMessage}</p>
                </div>
            )}
            
            {error && <p className="mt-4 text-sm text-red-500 text-center">{error}</p>}

            {report && (
                <div className="mt-6 space-y-4 animate-fade-in">
                    <ReportSection title="Executive Summary" content={report.summary} />
                    <ReportSection title="Historical Context" content={report.historical_context} />
                    <ReportSection title="Key Concepts" items={report.key_concepts} />
                    <ReportSection title="Mythological & Archetypal Parallels" content={report.mythological_parallels} />
                    <ReportSection title="Untapped Market Opportunities" items={report.market_opportunities} isOpportunity />
                    {report.cited_sources.length > 0 && <ReportSection title="Cited Sources" sources={report.cited_sources} />}
                </div>
            )}
             <style>{`.input-style { padding: 0.5rem 0.75rem; border-width: 1px; border-color: #D1D5DB; border-radius: 0.5rem; outline: none; transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1); background-color: white; width: 100%; } .dark .input-style { border-color: #4B5563; background-color: #374151; color: #F3F4F6; } .input-style:focus { --tw-ring-color: #FF7A00; border-color: #FF7A00; box-shadow: 0 0 0 2px var(--tw-ring-color); }`}</style>
        </div>
    );
};

const ReportSection: React.FC<{title: string, content?: string, items?: string[], sources?: {uri: string, title: string}[], isOpportunity?: boolean}> = ({ title, content, items, sources, isOpportunity }) => (
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
        {sources && (
            <div className="mt-2 space-y-1">
                {sources.map((source, index) => (
                    <a href={source.uri} key={index} target="_blank" rel="noopener noreferrer" className="block text-xs text-blue-600 dark:text-blue-400 hover:underline truncate">
                        🔗 {source.title || source.uri}
                    </a>
                ))}
            </div>
        )}
    </div>
);

export default AIKnowledgeVault;