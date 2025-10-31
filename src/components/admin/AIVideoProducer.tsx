import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Product } from '../../types';

interface AIVideoProducerProps {
    products: Product[];
}

// Reassuring messages for the user during video generation
const loadingMessages = [
    "Warming up the AI director...",
    "Scripting the first scene...",
    "This can take a few minutes, please wait.",
    "Rendering the visuals...",
    "Adding special effects...",
    "Polishing the final cut...",
];

const AIVideoProducer: React.FC<AIVideoProducerProps> = ({ products }) => {
    const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
    const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');
    const [startImage, setStartImage] = useState<{ base64: string, mimeType: string } | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [isKeySelected, setIsKeySelected] = useState(false);

    useEffect(() => {
        const checkApiKey = async () => {
            if ((window as any).aistudio && await (window as any).aistudio.hasSelectedApiKey()) {
                setIsKeySelected(true);
            }
        };
        checkApiKey();
    }, []);

    const selectedProduct = useMemo(() => products.find(p => p.id === selectedProductId), [products, selectedProductId]);

    useEffect(() => {
        if (selectedProduct) {
            setPrompt(
                `Create a fast-paced, exciting promotional video for the product "${selectedProduct.title}". The video should highlight key benefits like: ${selectedProduct.benefits.join(', ')}. The video should evoke a feeling of success and opportunity.`
            );
        } else {
            setPrompt('');
        }
    }, [selectedProduct]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = (reader.result as string).split(',')[1];
                setStartImage({ base64: base64String, mimeType: file.type });
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSelectKey = async () => {
        if ((window as any).aistudio) {
            await (window as any).aistudio.openSelectKey();
            setIsKeySelected(true);
        }
    };

    const handleGenerateVideo = async () => {
        if (!prompt) {
            setError("Please enter a video prompt.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedVideoUrl(null);
        let messageIndex = 0;
        setLoadingMessage(loadingMessages[messageIndex]);
        const messageInterval = setInterval(() => {
            messageIndex = (messageIndex + 1) % loadingMessages.length;
            setLoadingMessage(loadingMessages[messageIndex]);
        }, 7000);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            
            const payload: any = {
                model: 'veo-3.1-fast-generate-preview',
                prompt,
                config: {
                    numberOfVideos: 1,
                    resolution,
                    aspectRatio,
                }
            };

            if (startImage) {
                payload.image = {
                    imageBytes: startImage.base64,
                    mimeType: startImage.mimeType,
                };
            }

            let operation = await ai.models.generateVideos(payload);

            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 10000));
                operation = await ai.operations.getVideosOperation({ operation });
            }

            clearInterval(messageInterval);

            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (downloadLink) {
                setLoadingMessage("Downloading video...");
                const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
                const blob = await response.blob();
                const videoUrl = URL.createObjectURL(blob);
                setGeneratedVideoUrl(videoUrl);
            } else {
                throw new Error("Video generation completed, but no download link was provided.");
            }

        } catch (e: any) {
            console.error("AI Video Producer Error:", e);
            if (e.message && e.message.includes("Requested entity was not found.")) {
                setError("Your API Key is invalid. Please select a valid key.");
                setIsKeySelected(false);
            } else {
                 setError("Failed to generate video. Please check the console for details.");
            }
        } finally {
            clearInterval(messageInterval);
            setIsLoading(false);
        }
    };

    if (!isKeySelected) {
        return (
             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
                 <div className="flex-shrink-0 text-3xl mb-3">🎬</div>
                 <h2 className="text-xl font-bold text-uc-secondary dark:text-white">AI Video Producer</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-4">
                    Video generation with Veo requires a project with billing enabled.
                    <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-uc-primary hover:underline ml-1">Learn more</a>.
                </p>
                <button
                    onClick={handleSelectKey}
                    className="px-6 py-2 bg-uc-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors shadow"
                >
                    Select API Key
                </button>
                 {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 text-3xl">🎬</div>
                <div>
                    <h2 className="text-xl font-bold text-uc-secondary dark:text-white">AI Video Producer</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create stunning promotional videos for your products. Describe what you want to see.</p>
                </div>
            </div>

            <div className="mt-4 space-y-4">
                <div>
                    <label htmlFor="video-product-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product (to pre-fill prompt)</label>
                    <select
                        id="video-product-select"
                        value={selectedProductId}
                        onChange={(e) => setSelectedProductId(e.target.value)}
                        className="mt-1 block w-full input-style"
                    >
                         {products.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="video-prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Video Prompt</label>
                    <textarea
                        id="video-prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={4}
                        className="mt-1 block w-full input-style"
                        placeholder='e.g., A cinematic video for "The Smoothie Diet" showing vibrant fruit and happy people.'
                    />
                </div>
                <div>
                    <label htmlFor="start-image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Starting Image (Optional)</label>
                    <input type="file" id="start-image" onChange={handleImageUpload} accept="image/png, image/jpeg" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-uc-primary/10 file:text-uc-primary hover:file:bg-uc-primary/20"/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Aspect Ratio</label>
                        <div className="mt-2 flex space-x-4">
                            <label className="flex items-center">
                                <input type="radio" name="aspectRatio" value="16:9" checked={aspectRatio === '16:9'} onChange={(e) => setAspectRatio(e.target.value as '16:9' | '9:16')} className="h-4 w-4 text-uc-primary focus:ring-uc-primary border-gray-300"/>
                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">16:9 Landscape</span>
                            </label>
                            <label className="flex items-center">
                                <input type="radio" name="aspectRatio" value="9:16" checked={aspectRatio === '9:16'} onChange={(e) => setAspectRatio(e.target.value as '16:9' | '9:16')} className="h-4 w-4 text-uc-primary focus:ring-uc-primary border-gray-300"/>
                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">9:16 Portrait</span>
                            </label>
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Resolution</label>
                        <div className="mt-2 flex space-x-4">
                            <label className="flex items-center">
                                <input type="radio" name="resolution" value="720p" checked={resolution === '720p'} onChange={(e) => setResolution(e.target.value as '720p' | '1080p')} className="h-4 w-4 text-uc-primary focus:ring-uc-primary border-gray-300"/>
                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">720p</span>
                            </label>
                            <label className="flex items-center">
                                <input type="radio" name="resolution" value="1080p" checked={resolution === '1080p'} onChange={(e) => setResolution(e.target.value as '720p' | '1080p')} className="h-4 w-4 text-uc-primary focus:ring-uc-primary border-gray-300"/>
                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">1080p</span>
                            </label>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleGenerateVideo}
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 bg-uc-secondary text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-opacity-50 disabled:cursor-not-allowed"
                >
                   {isLoading ? 'Generating...' : 'Generate Video'}
                </button>
            </div>
            
            {isLoading && (
                <div className="mt-6 text-center">
                    <div className="flex justify-center items-center">
                         <svg className="animate-spin h-8 w-8 text-uc-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                    <p className="mt-2 text-sm text-uc-secondary dark:text-gray-300 font-semibold">{loadingMessage}</p>
                </div>
            )}
            {error && <p className="mt-4 text-sm text-red-500 text-center">{error}</p>}
            {generatedVideoUrl && !isLoading && (
                <div className="mt-6">
                    <h3 className="font-semibold text-uc-text dark:text-gray-200 mb-2">Your video is ready:</h3>
                    <video src={generatedVideoUrl} controls className="w-full rounded-lg shadow-md bg-black"></video>
                    <a 
                        href={generatedVideoUrl} 
                        download={`${selectedProduct?.title.replace(/\s+/g, '_') || 'generated'}_video.mp4`}
                        className="mt-4 block w-full text-center bg-uc-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                        Download Video
                    </a>
                </div>
            )}

            <style>{`
                .input-style {
                    padding: 0.5rem 0.75rem; border-width: 1px; border-color: #D1D5DB; border-radius: 0.5rem; outline: none; transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1); background-color: white; width: 100%;
                }
                .dark .input-style { border-color: #4B5563; background-color: #374151; color: #F3F4F6; }
                .input-style:focus { --tw-ring-color: #FF7A00; border-color: #FF7A00; box-shadow: 0 0 0 2px var(--tw-ring-color); }
            `}</style>
        </div>
    );
};

export default AIVideoProducer;