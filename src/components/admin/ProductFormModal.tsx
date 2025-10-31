import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { CATEGORIES } from '../../constants';
import { GoogleGenAI, Type } from "@google/genai";
import { useTranslations } from '../../hooks/useTranslations';

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: Product | Omit<Product, 'id'>) => void;
    product: Partial<Product> | null;
}

export const emptyProduct: Omit<Product, 'id'> = {
    title: '',
    category: CATEGORIES[0].name,
    media: [{ type: 'image', url: '' }],
    rating: 0,
    reviewCount: 0,
    commissionRate: '75%',
    price: 0,
    description: '',
    benefits: [''],
    affiliateLink: 'https://www.clickbank.com',
    featured: false,
    trending: false,
    benefitStatement: '',
    performance: { clicks: 0, sales: 0 },
    tags: [],
};

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const SaveIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);


const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, onClose, onSave, product }) => {
    const t = useTranslations();
    const [productData, setProductData] = useState<Product | Omit<Product, 'id'>>(
        product ? { ...emptyProduct, ...product } : emptyProduct
    );
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        setProductData(product ? { ...emptyProduct, ...product } : emptyProduct);
    }, [product, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (name === 'price') {
            const numValue = parseFloat(value);
            setProductData(prev => ({ ...prev, price: isNaN(numValue) ? 0 : numValue }));
        } else if (name === 'clicks' || name === 'sales') {
            const numValue = parseInt(value, 10);
            setProductData(prev => ({
                ...prev,
                performance: {
                    ...(prev.performance || { clicks: 0, sales: 0 }),
                    [name]: isNaN(numValue) ? 0 : numValue,
                }
            }));
        } else {
            const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
            setProductData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        }
    };

    const handleBenefitChange = (index: number, value: string) => {
        const newBenefits = [...(productData.benefits || [])];
        newBenefits[index] = value;
        setProductData(prev => ({ ...prev, benefits: newBenefits }));
    };

    const addBenefit = () => {
        setProductData(prev => ({ ...prev, benefits: [...(prev.benefits || []), ''] }));
    };

    const removeBenefit = (index: number) => {
        setProductData(prev => ({ ...prev, benefits: (prev.benefits || []).filter((_, i) => i !== index) }));
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setProductData(prev => ({ ...prev, tags: value.split(',').map(tag => tag.trim()) }));
    };
    
    const handleGenerateWithAI = async () => {
        const prompt = aiPrompt || productData.title;
        if (!prompt) {
            alert("Please enter a product idea or title.");
            return;
        }
        setIsGenerating(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            
            const responseSchema = {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: 'A catchy product title, under 80 characters.' },
                    description: { type: Type.STRING, description: 'A detailed, persuasive product description, around 2-3 sentences long.' },
                    benefitStatement: { type: Type.STRING, description: 'A short, one-sentence summary of the main benefit.' },
                    benefits: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: 'A list of exactly 5 key benefits or features as short, punchy strings.'
                    },
                    category: {
                        type: Type.STRING,
                        enum: CATEGORIES.map(c => c.name),
                        description: 'The single best-fitting category for this product.'
                    },
                    price: {
                        type: Type.NUMBER,
                        description: 'A realistic price for this type of digital product, as a number (e.g., 47).'
                    }
                }
            };
            
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Generate product details for this idea: "${prompt}"`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                    systemInstruction: `You are an expert affiliate marketing copywriter specializing in high-converting copy for affiliate marketplaces like ClickBank. Your task is to generate compelling product details for a fictional digital product based on the user's idea.
- **Tone**: The copy must be persuasive, slightly urgent, and benefit-driven. It should create a sense of 'fear of missing out' (FOMO) and highlight a clear solution to a problem.
- **Audience**: Assume the target audience is looking for a direct solution and is ready to buy. The language should be clear, direct, and impactful.
- **Content**: The product details should sound plausible, valuable, and appealing. Ensure the generated category is one of the provided options.`,
                    thinkingConfig: { thinkingBudget: 0 }
                }
            });

            const generatedData = JSON.parse(response.text);
            
            setProductData(prev => ({
                ...prev,
                title: generatedData.title || prev.title,
                description: generatedData.description || prev.description,
                benefitStatement: generatedData.benefitStatement || prev.benefitStatement,
                benefits: generatedData.benefits && generatedData.benefits.length > 0 ? generatedData.benefits : prev.benefits,
                category: generatedData.category || prev.category,
                price: generatedData.price || prev.price
            }));

        } catch (error) {
            console.error("AI Generation Error:", error);
            alert("Failed to generate content. Please check the console for details.");
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalProductData = {
            ...productData,
            tags: productData.tags?.filter(tag => tag.length > 0) || []
        };
        onSave(finalProductData);
    };

    const isEditing = 'id' in productData && productData.id;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center" onClick={onClose}>
            <div
                className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl transform transition-all"
                onClick={e => e.stopPropagation()}
            >
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                        <h2 className="text-xl font-bold text-uc-secondary dark:text-gray-100">{isEditing ? t.editProduct : t.addProduct}</h2>
                        <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" title={t.close}>
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="p-6 space-y-4 overflow-y-auto" style={{ maxHeight: '75vh' }}>
                        
                        {/* AI Generation Section */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700/50 dark:to-gray-800/50 p-4 rounded-lg border border-blue-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-uc-secondary dark:text-gray-200 mb-2">🚀 AI Product Wizard <span className="text-sm font-bold text-uc-primary uppercase ml-2">Pro</span></h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Describe your product idea, and let the AI agent write the copy for you.</p>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    placeholder="e.g., A course on homemade sourdough bread"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-uc-primary focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-uc-text dark:text-gray-200"
                                />
                                <button
                                    type="button"
                                    onClick={handleGenerateWithAI}
                                    disabled={isGenerating}
                                    className="px-4 py-2 bg-uc-primary text-white font-bold rounded-md hover:bg-opacity-90 transition-colors disabled:bg-opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                    title={t.generateWithAI}
                                >
                                    {isGenerating ? 'Generating...' : '✨ Generate'}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                                <input type="text" name="title" value={productData.title} onChange={handleChange} className="mt-1 block w-full input-style" required />
                            </div>
                             <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                                <select name="category" value={productData.category} onChange={handleChange} className="mt-1 block w-full input-style">
                                    {CATEGORIES.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                                </select>
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.tags} (comma-separated)</label>
                            <input
                                type="text"
                                name="tags"
                                id="tags"
                                value={productData.tags?.join(', ') || ''}
                                onChange={handleTagsChange}
                                className="mt-1 block w-full input-style"
                                placeholder={t.tagsPlaceholder}
                            />
                        </div>

                        <div>
                            <label htmlFor="benefitStatement" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Benefit Statement</label>
                            <input type="text" name="benefitStatement" value={productData.benefitStatement} onChange={handleChange} className="mt-1 block w-full input-style" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                            <textarea name="description" value={productData.description} onChange={handleChange} rows={3} className="mt-1 block w-full input-style" />
                        </div>
                        
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price (USD)</label>
                                <input type="number" name="price" value={productData.price} onChange={handleChange} className="mt-1 block w-full input-style" step="0.01" />
                            </div>
                            <div>
                                <label htmlFor="commissionRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Commission Rate</label>
                                <input type="text" name="commissionRate" value={productData.commissionRate} onChange={handleChange} className="mt-1 block w-full input-style" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="clicks" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Performance Clicks</label>
                                <input type="number" name="clicks" value={productData.performance?.clicks ?? ''} onChange={handleChange} className="mt-1 block w-full input-style" placeholder="0" />
                            </div>
                            <div>
                                <label htmlFor="sales" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Performance Sales</label>
                                <input type="number" name="sales" value={productData.performance?.sales ?? ''} onChange={handleChange} className="mt-1 block w-full input-style" placeholder="0" />
                            </div>
                        </div>

                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Benefits</label>
                            <div className="space-y-2 mt-1">
                            {productData.benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <input type="text" value={benefit} onChange={(e) => handleBenefitChange(index, e.target.value)} className="w-full input-style" />
                                    <button type="button" onClick={() => removeBenefit(index)} className="text-red-500 hover:text-red-700 p-1" title={t.removeBenefit}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
                                    </button>
                                </div>
                            ))}
                            </div>
                            <button type="button" onClick={addBenefit} className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-semibold flex items-center" title={t.addBenefit}>
                                <PlusIcon className="w-4 h-4 mr-1" />
                                {t.addBenefit}
                            </button>
                        </div>

                        <div className="flex items-center space-x-6">
                            <div className="flex items-center">
                                <input type="checkbox" name="featured" checked={productData.featured} onChange={handleChange} className="h-4 w-4 text-uc-primary rounded border-gray-300 focus:ring-uc-primary" />
                                <label htmlFor="featured" className="ml-2 block text-sm text-gray-900 dark:text-gray-200">Featured</label>
                            </div>
                             <div className="flex items-center">
                                <input type="checkbox" name="trending" checked={productData.trending} onChange={handleChange} className="h-4 w-4 text-uc-primary rounded border-gray-300 focus:ring-uc-primary" />
                                <label htmlFor="trending" className="ml-2 block text-sm text-gray-900 dark:text-gray-200">Trending</label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end items-center p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
                        <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-bold text-uc-text dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mr-2">
                            Cancel
                        </button>
                        <button type="submit" className="px-8 py-2 bg-uc-secondary text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors flex items-center" title={t.saveProduct}>
                            <SaveIcon className="w-5 h-5 mr-2" />
                            {t.saveProduct}
                        </button>
                    </div>
                </form>
            </div>
            <style>{`
                .input-style {
                    padding: 0.5rem 0.75rem;
                    border-width: 1px;
                    border-color: #D1D5DB; /* gray-300 */
                    border-radius: 0.375rem; /* rounded-md */
                    outline: none;
                    transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
                    background-color: white;
                }
                .dark .input-style {
                    border-color: #4B5563; /* gray-600 */
                    background-color: #374151; /* gray-700 */
                    color: #F3F4F6; /* gray-200 */
                }
                .input-style:focus {
                    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
                    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
                    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
                    --tw-ring-color: #FF7A00; /* uc-primary */
                    border-color: transparent;
                }
            `}</style>
        </div>
    );
};

export default ProductFormModal;