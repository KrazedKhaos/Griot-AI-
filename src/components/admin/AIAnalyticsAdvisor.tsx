import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Product } from '../../types';

interface AIAnalyticsAdvisorProps {
    products: Product[];
}

const AIAnalyticsAdvisor: React.FC<AIAnalyticsAdvisorProps> = ({ products }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [report, setReport] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        setIsLoading(true);
        setError(null);
        setReport('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const performanceData = products.map(p => ({
                title: p.title,
                category: p.category,
                description: p.description,
                benefits: p.benefits,
                clicks: p.performance.clicks,
                sales: p.performance.sales,
                price: p.price
            }));
            
            const prompt = `
                I am the owner of an affiliate marketing website. Here is the performance data for my current products, including their marketing details:
                ${JSON.stringify(performanceData, null, 2)}

                Please act as an expert business analyst and provide a concise report. Your report should include:
                1.  A brief, overall summary of the business health.
                2.  **Top Performer Deep Dive:** Analyze the top 3 products by sales. For each one, provide a hypothesis on why it's successful, referencing its **category** (e.g., is it a hot niche?), **description** (persuasive language?), and **benefits** (strong pain points solved?).
                3.  Identify 1-2 underperforming products or categories and suggest potential reasons for their low performance.
                4.  Provide 3 concrete, actionable recommendations to increase overall sales and revenue, possibly by applying lessons from the top performers.

                Format the entire response in markdown. Use headings, bold text, and bullet points to make it easy to read on a mobile device.
            `;
            
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    thinkingConfig: { thinkingBudget: 0 }
                }
            });

            setReport(response.text);

        } catch (e) {
            console.error("AI Analytics Advisor Error:", e);
            setError("Failed to generate analytics report. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const renderMarkdown = (text: string) => {
        const html = text
            .replace(/### (.*)/g, '<h3 class="text-md font-bold text-uc-secondary dark:text-gray-200 mt-3 mb-1">$1</h3>')
            .replace(/## (.*)/g, '<h2 class="text-lg font-bold text-uc-secondary dark:text-gray-100 mt-4 mb-2">$1</h2>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/^- (.*)/gm, '<li class="ml-4 list-disc">$1</li>')
            .replace(/\* (.*)/gm, '<li class="ml-4 list-disc">$1</li>')
            .replace(/\n/g, '<br />')
            .replace(/<br \s*\/?><li/g, '<li') 
            .replace(/<\/li><br \s*\/?>/g, '</li>');

        return <div dangerouslySetInnerHTML={{ __html: `<ul>${html}</ul>`.replace(/<\/li><ul>/g, '</li>').replace(/<\/ul><li>/g, '</li>') }} />;
    };


    return (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800/80 rounded-xl shadow-md p-6">
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 text-3xl">💡</div>
                <div>
                    <h2 className="text-xl font-bold text-uc-secondary dark:text-white">AI Analytics Advisor</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Get instant, data-driven advice. The AI will analyze your performance and give you actionable steps to grow your business.</p>
                </div>
            </div>

             <div className="mt-4">
                 <button
                    onClick={handleAnalyze}
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 bg-uc-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-opacity-50 disabled:cursor-not-allowed shadow"
                >
                     {isLoading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : 'Analyze Performance'}
                </button>
            </div>
             {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            
            {report && (
                <div className="mt-6 p-4 bg-white dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 prose prose-sm max-w-none text-uc-text dark:text-gray-300">
                    {renderMarkdown(report)}
                </div>
            )}
        </div>
    );
};

export default AIAnalyticsAdvisor;