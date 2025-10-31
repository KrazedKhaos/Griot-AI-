import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Product, ChatMessage } from '../../types';
import { GoogleGenAI, FunctionDeclaration, Type, Chat } from '@google/genai';
import ChatBubble from './ChatBubble';
import RecommendedProductCard from './RecommendedProductCard';
import { useTranslations } from '../../hooks/useTranslations';

interface AIPersonalShopperProps {
    isOpen: boolean;
    onClose: () => void;
    products: Product[];
    onProductClick: (product: Product) => void;
}

const showProductsFunctionDeclaration: FunctionDeclaration = {
    name: 'showRecommendedProducts',
    parameters: {
        type: Type.OBJECT,
        description: 'Displays a list of recommended products to the user based on the conversation.',
        properties: {
            product_ids: {
                type: Type.ARRAY,
                description: 'A list of product IDs to recommend and display to the user.',
                items: {
                    type: Type.STRING,
                }
            },
        },
        required: ['product_ids'],
    },
};

const AIPersonalShopper: React.FC<AIPersonalShopperProps> = ({ isOpen, onClose, products, onProductClick }) => {
    const t = useTranslations();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const productCatalog = useMemo(() => {
        return JSON.stringify(products.map(p => ({
            id: p.id,
            title: p.title,
            description: p.description,
            category: p.category,
            benefitStatement: p.benefitStatement
        })));
    }, [products]);

    useEffect(() => {
        if (isOpen) {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const newChat = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: `You are a friendly and expert personal shopper for UbuntuConnect, an online marketplace for digital products and courses. Your goal is to help users find the perfect product to meet their needs.
- Start by greeting the user with: "${t.aiShopperGreeting}"
- Your responses must be in the same language the user is writing in.
- Be conversational and empathetic. Ask clarifying questions to understand their goals or problems.
- Based on the user's needs, recommend relevant products from the provided list.
- To show products, you MUST use the 'showRecommendedProducts' function. Do not list products in plain text.
- If you don't find a good match, apologize and explain that you couldn't find a perfect fit, but you can try again if they provide more details.
- Keep your text responses concise and helpful.

Here is the list of available products:
${productCatalog}`,
                    tools: [{ functionDeclarations: [showProductsFunctionDeclaration] }],
                },
            });
            setChat(newChat);
            setMessages([{
                role: 'model',
                text: t.aiShopperGreeting
            }]);
        } else {
            setMessages([]);
            setUserInput('');
            setIsLoading(false);
            setChat(null);
        }
    }, [isOpen, productCatalog, t]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSendMessage = async () => {
        if (!userInput.trim() || !chat || isLoading) return;

        const text = userInput.trim();
        setUserInput('');
        setMessages(prev => [...prev, { role: 'user', text }]);
        setIsLoading(true);

        try {
            const response = await chat.sendMessage({ message: text });
            const functionCalls = response.functionCalls;
            
            let modelResponseText = response.text.trim();
            let recommendedProducts: Product[] = [];

            if (functionCalls && functionCalls.length > 0) {
                const fc = functionCalls[0];
                if (fc.name === 'showRecommendedProducts') {
                    const ids = fc.args.product_ids;
                    if (Array.isArray(ids)) {
                        recommendedProducts = products.filter(p => ids.includes(p.id));
                    }
                }
                 if (!modelResponseText && recommendedProducts.length > 0) {
                    modelResponseText = t.aiShopperFinding;
                }
            }
            
            if (modelResponseText || recommendedProducts.length > 0) {
                 setMessages(prev => [...prev, {
                    role: 'model',
                    text: modelResponseText,
                    products: recommendedProducts,
                }]);
            }

        } catch (error) {
            console.error("AI Shopper Error:", error);
            setMessages(prev => [...prev, { role: 'model', text: t.aiShopperError }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-end md:items-center md:justify-center animate-fade-in">
            <div
                className="w-full h-[85vh] md:h-auto md:max-h-[80vh] md:max-w-md bg-white dark:bg-gray-800 rounded-t-2xl md:rounded-2xl shadow-xl flex flex-col animate-slide-in-up"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 flex-shrink-0">
                    <h2 className="text-xl font-bold text-uc-secondary dark:text-gray-100">{t.aiPersonalShopper}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" title={t.close}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Chat Area */}
                <div ref={chatContainerRef} className="flex-grow p-4 space-y-4 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index}>
                            <ChatBubble message={msg} />
                            {msg.role === 'model' && msg.products && msg.products.length > 0 && (
                                <div className="mt-2 space-y-2">
                                    {msg.products.map(p => (
                                        <RecommendedProductCard key={p.id} product={p} onClick={onProductClick} />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-uc-primary flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">AI</div>
                            <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-gray-100 dark:bg-gray-700">
                                <div className="flex items-center space-x-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-fast delay-0"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-fast delay-150"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-fast delay-300"></span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t dark:border-gray-700 flex-shrink-0">
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder={t.aiShopperPlaceholder}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-uc-primary focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-uc-text dark:text-gray-200"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={isLoading || !userInput.trim()}
                            className="p-3 bg-uc-primary text-white rounded-full hover:bg-opacity-90 transition-colors disabled:bg-opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                            title={t.sendMessage}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIPersonalShopper;