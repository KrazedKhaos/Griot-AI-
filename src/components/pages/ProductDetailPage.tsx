import React, { useMemo, useState } from 'react';
import { Product } from '../../types';
import ProductCard from '../ProductCard';
import SectionHeader from '../common/SectionHeader';
import { useTranslations } from '../../hooks/useTranslations';
import AIContentCopilotModal from '../common/AIContentCopilotModal';
import { useCurrency } from '../../hooks/useCurrency';
import { formatCurrency } from '../../utils/currency';
import ProductCarousel from '../common/ProductCarousel';
import AIDescriptionWriterModal from '../common/AIDescriptionWriterModal';
import { GoogleGenAI } from "@google/genai";

interface ProductDetailPageProps {
    product: Product;
    navigate: (path: string) => void;
    allProducts: Product[];
    wishlistedProductIds: string[];
    onWishlistToggle: (productId: string) => void;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                </svg>
            ))}
        </div>
    );
};

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2l4.45.647a1 1 0 01.554 1.705l-3.22 3.138 1.17 4.628a1 1 0 01-1.451 1.054L12 15.58l-3.996 2.099a1 1 0 01-1.451-1.054l1.17-4.628L4.49 9.553a1 1 0 01.554-1.705l4.45-.647L11.033 2.744A1 1 0 0112 2z" clipRule="evenodd" />
    </svg>
);

const PencilSquareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
);


const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, navigate, allProducts, wishlistedProductIds, onWishlistToggle }) => {
    const t = useTranslations();
    const { currency } = useCurrency();
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [isCopilotOpen, setIsCopilotOpen] = useState(false);
    const [isDescriptionWriterOpen, setIsDescriptionWriterOpen] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [reviewSummary, setReviewSummary] = useState('');

    const similarProducts = useMemo(() => {
        return allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
    }, [allProducts, product]);

    const handleDealClick = () => {
        console.log(`'Get This Deal' clicked for product: ${product.title} (ID: ${product.id})`);
    };

    const nextMedia = () => setCurrentMediaIndex(prev => (prev + 1) % product.media.length);
    const prevMedia = () => setCurrentMediaIndex(prev => (prev - 1 + product.media.length) % product.media.length);

    const isShareSupported = useMemo(() => typeof navigator !== 'undefined' && !!navigator.share, []);
    const isWishlisted = useMemo(() => wishlistedProductIds.includes(product.id), [wishlistedProductIds, product.id]);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.title,
                    text: `Check out this great deal: ${product.title}`,
                    url: window.location.href,
                });
            } catch (error) {
                console.error('Error sharing product:', error);
            }
        }
    };

    const ratingDistribution = useMemo(() => {
        if (product.reviewCount === 0) return [0, 0, 0, 0, 0];
        const distribution = [0, 0, 0, 0, 0];
        distribution[4] = Math.round((product.rating / 5) * 80);
        distribution[3] = Math.round(((5 - Math.abs(product.rating - 4)) / 5) * 15);
        distribution[2] = Math.round(((5 - Math.abs(product.rating - 3)) / 5) * 10);
        const sum = distribution.reduce((a, b) => a + b, 0);
        distribution[1] = Math.max(0, 100 - sum - 5);
        distribution[0] = 100 - distribution.reduce((a, b) => a + b, 0);
        return distribution.map(d => Math.max(0, d));
    }, [product.rating, product.reviewCount]);
    
    const handleGetReviewSummary = async () => {
        setIsAnalyzing(true);
        setReviewSummary('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Based on the product "${product.title}" and its description "${product.description}", assume you have access to thousands of user reviews. Synthesize these hypothetical reviews into a balanced summary. Include the most praised aspects, common criticisms, and an overall verdict. Keep it concise (2-3 short paragraphs).`;
            
            const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
            setReviewSummary(response.text);
        } catch (error) {
            console.error("AI Review Summary Error:", error);
            setReviewSummary(t.summaryGenerationFailed);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const currentMedia = product.media[currentMediaIndex];

    return (
        <div className="dark:bg-gray-800">
            <div className="relative bg-black">
                {currentMedia.type === 'image' ? (
                    <img src={currentMedia.url} alt={`${product.title} image ${currentMediaIndex + 1}`} className="w-full h-64 object-contain" />
                ) : (
                    <video src={currentMedia.url} className="w-full h-64" controls playsInline />
                )}

                <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                    <button onClick={() => window.history.back()} className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition" aria-label={t.goBack} title={t.goBack}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <div className="flex items-center space-x-2">
                        <button onClick={() => onWishlistToggle(product.id)} className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition" aria-label={isWishlisted ? t.removeFromWishlist : t.addToWishlist} title={isWishlisted ? t.removeFromWishlist : t.addToWishlist}>
                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} className="w-6 h-6 text-uc-primary" stroke="currentColor" strokeWidth={isWishlisted ? 0 : 2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                            </svg>
                        </button>
                        {isShareSupported && (
                            <button onClick={handleShare} className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition" aria-label={t.shareProduct} title={t.shareProduct}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" /></svg>
                            </button>
                        )}
                    </div>
                </div>
                {product.media.length > 1 && (
                    <>
                        <button onClick={prevMedia} className="absolute top-1/2 left-2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition z-10" aria-label={t.previousMedia} title={t.previousMedia}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg></button>
                        <button onClick={nextMedia} className="absolute top-1/2 right-2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition z-10" aria-label={t.nextMedia} title={t.nextMedia}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg></button>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                            {product.media.map((_, index) => (<button key={index} onClick={() => setCurrentMediaIndex(index)} className={`w-2.5 h-2.5 rounded-full ${currentMediaIndex === index ? 'bg-white' : 'bg-white/50'}`} aria-label={`${t.goToMedia} ${index + 1}`}></button>))}
                        </div>
                    </>
                )}
            </div>
            <div className="p-4 space-y-6">
                <div>
                    <span className="text-sm font-semibold text-uc-primary uppercase">{product.category}</span>
                    <h1 className="text-3xl font-bold text-uc-secondary dark:text-gray-100 mt-1">{product.title}</h1>
                    <div className="flex items-center space-x-2 mt-2">
                        <StarRating rating={product.rating} />
                        <span className="text-gray-600 dark:text-gray-400">{product.rating.toFixed(1)} ({product.reviewCount} {t.reviews})</span>
                    </div>
                </div>

                <div className="bg-uc-light-gray dark:bg-gray-900 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                        <SectionHeader title={t.whyWeRecommendIt} isSubheading/>
                         <button onClick={() => setIsDescriptionWriterOpen(true)} className="flex items-center text-xs font-semibold text-uc-primary hover:text-opacity-80 transition-colors" title={t.rewriteWithAI}>
                            <PencilSquareIcon className="w-4 h-4 mr-1" />
                            {t.rewriteWithAI}
                        </button>
                    </div>
                    <p className="text-uc-text dark:text-gray-300 leading-relaxed mt-2 whitespace-pre-wrap">{product.description}</p>
                </div>
                
                <div>
                    <SectionHeader title={t.keyFeatures} isSubheading/>
                    <div className="space-y-3 mt-4">
                        {product.benefits.map((benefit, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center space-x-3">
                                <div className="flex-shrink-0 bg-uc-success/10 p-2 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-uc-success" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                </div>
                                <p className="text-uc-text dark:text-gray-200 text-sm font-medium">{benefit}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {product.specifications && (
                    <div>
                        <SectionHeader title={t.detailedSpecifications} isSubheading />
                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                            {product.specifications.dimensions && <SpecItem label={t.dimensions} value={product.specifications.dimensions} />}
                            {product.specifications.weight && <SpecItem label={t.weight} value={product.specifications.weight} />}
                            {product.specifications.material && <SpecItem label={t.material} value={product.specifications.material} />}
                            {product.specifications.compatibility && <SpecItem label={t.compatibility} value={product.specifications.compatibility} />}
                        </div>
                    </div>
                )}

                <div>
                    <SectionHeader title={t.communityReviews} isSubheading/>
                    {product.reviewCount > 0 ? (
                        <div className="mt-4 bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                                <div className="text-center shrink-0 mb-4 sm:mb-0">
                                    <p className="text-4xl font-bold text-uc-secondary dark:text-gray-100">{product.rating.toFixed(1)}</p>
                                    <StarRating rating={product.rating} />
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{product.reviewCount} {t.reviews}</p>
                                </div>
                                <div className="flex-1 w-full">
                                    {[5, 4, 3, 2, 1].map((star, index) => {
                                        const percentage = ratingDistribution[4 - index];
                                        return (
                                            <div key={star} className="flex items-center space-x-2 text-sm my-1">
                                                <span className="text-gray-600 dark:text-gray-300 w-12">{star} {t.star}</span>
                                                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5"><div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div></div>
                                                <span className="text-gray-600 dark:text-gray-300 w-8 text-right">{percentage}%</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="mt-4 border-t dark:border-gray-700 pt-4">
                                {reviewSummary ? (
                                     <div className="p-3 bg-blue-50 dark:bg-gray-700/50 rounded-lg">
                                        <h4 className="font-bold text-sm text-uc-secondary dark:text-gray-200">{t.aiReviewInsights}</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 whitespace-pre-wrap">{reviewSummary}</p>
                                    </div>
                                ) : (
                                    <button onClick={handleGetReviewSummary} disabled={isAnalyzing} className="w-full flex items-center justify-center text-sm font-semibold text-uc-primary hover:text-opacity-80 transition-colors disabled:opacity-50">
                                        {isAnalyzing ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                {t.analyzingReviews}
                                            </>
                                        ) : (
                                            <>
                                                <SparklesIcon className="w-4 h-4 mr-1" />
                                                {t.getAIReviewSummary}
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="mt-4 bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700 text-center">
                            <h3 className="mt-4 text-lg font-semibold text-uc-secondary dark:text-gray-100">{t.noReviewsYet}</h3>
                            <p className="mt-1 text-base text-gray-500 dark:text-gray-400">{t.beTheFirstToReview}</p>
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                    <span className="text-3xl font-bold text-uc-secondary dark:text-gray-100">{formatCurrency(product.price, currency)}</span>
                    <span className="text-gray-500 dark:text-gray-400">{t.oneTimePurchase}</span>
                </div>
            </div>

            <div className="bg-uc-light-gray dark:bg-gray-900 py-6">
                <ProductCarousel 
                    title={t.similarProducts}
                    products={similarProducts}
                    onProductClick={(p) => navigate(`#/product/${p.id}`)}
                    wishlistedProductIds={wishlistedProductIds}
                    onWishlistToggle={onWishlistToggle}
                />
            </div>
            
            <div className="sticky bottom-0 bg-white dark:bg-gray-800 p-4 border-t dark:border-gray-700 shadow-inner flex items-center space-x-2">
                <button onClick={() => setIsCopilotOpen(true)} className="p-4 bg-uc-secondary text-white rounded-lg hover:bg-opacity-90" title={t.openAICopilot}>
                    <SparklesIcon className="w-6 h-6" />
                </button>
                <a href={product.affiliateLink} target="_blank" rel="noopener noreferrer" onClick={handleDealClick} className="block flex-grow text-center bg-uc-primary text-white text-lg font-bold uppercase py-4 px-4 rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-200">
                    {t.getThisDeal}
                </a>
            </div>

            <AIContentCopilotModal isOpen={isCopilotOpen} onClose={() => setIsCopilotOpen(false)} product={product} />
            <AIDescriptionWriterModal isOpen={isDescriptionWriterOpen} onClose={() => setIsDescriptionWriterOpen(false)} product={product} />
        </div>
    );
};

const SpecItem: React.FC<{label: string; value: string}> = ({label, value}) => (
    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
        <span className="font-semibold text-gray-700 dark:text-gray-200">{label}:</span>
        <span className="text-gray-600 dark:text-gray-300 ml-2">{value}</span>
    </div>
);

export default ProductDetailPage;