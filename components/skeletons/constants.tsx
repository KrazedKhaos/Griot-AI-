import React from 'react';
import { Product, Category } from './types';

// Icon Components
const HealthIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </svg>
);

const BusinessIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.07a2.25 2.25 0 0 1-2.25 2.25h-13.5a2.25 2.25 0 0 1-2.25-2.25v-4.07m18 0-8.25-4.5L1.5 14.15M3 6.75l8.25-4.5L19.5 6.75m0 0v1.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 8.25v-1.5" />
    </svg>
);

const SelfHelpIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.311a7.5 7.5 0 0 1-7.5 0c-1.28-.28-2.427-.86-3.234-1.636a8.969 8.969 0 0 1-2.25-4.234 1.5 1.5 0 0 1 .521-1.659l4.592-3.518a1.5 1.5 0 0 1 2.164 0l4.592 3.518a1.5 1.5 0 0 1 .521 1.659 8.969 8.969 0 0 1-2.25 4.234 12.06 12.06 0 0 1-3.234 1.636Zm-3.75-2.311a7.5 7.5 0 0 0 7.5 0" />
    </svg>
);

const TechnologyIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
    </svg>
);

const RelationshipsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
);

export const CATEGORIES: Category[] = [
    { name: 'Health & Fitness', icon: HealthIcon },
    { name: 'Business & Marketing', icon: BusinessIcon },
    { name: 'Self-Help', icon: SelfHelpIcon },
    { name: 'Technology', icon: TechnologyIcon },
    { name: 'Relationships', icon: RelationshipsIcon },
];

export const MOCK_PRODUCTS: Product[] = [
    {
        id: 'hf001',
        title: 'The Smoothie Diet: 21-Day Rapid Weight Loss Program',
        category: 'Health & Fitness',
        media: [
            { type: 'image', url: 'https://picsum.photos/seed/hf001-1/800/600' },
            { type: 'image', url: 'https://picsum.photos/seed/hf001-2/800/600' },
            { type: 'image', url: 'https://picsum.photos/seed/hf001-3/800/600' }
        ],
        rating: 4.8,
        reviewCount: 1254,
        commissionRate: '75%',
        price: '$37',
        benefitStatement: 'Lose weight and feel great with delicious, easy-to-make smoothies.',
        description: "The Smoothie Diet is a revolutionary new life-transformation system that not only guarantees to help you lose weight and feel better than you have in years, it also promises to eliminate more body fat - faster than anything you’ve tried before.",
        benefits: ["Rapid weight loss", "Increased energy levels", "Improved skin and hair", "Better sleep quality", "Detoxifies your body"],
        affiliateLink: 'https://www.clickbank.com',
        featured: true,
        trending: true,
    },
    {
        id: 'bm001',
        title: 'Click Wealth System: #1 Beginner Friendly Make-Money-Online Offer',
        category: 'Business & Marketing',
        media: [
            { type: 'video', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
            { type: 'image', url: 'https://picsum.photos/seed/bm001/800/600' }
        ],
        rating: 4.5,
        reviewCount: 987,
        commissionRate: '90%',
        price: '$9',
        benefitStatement: 'Start your online business journey with a proven, beginner-friendly system.',
        description: 'Discover how you can generate your first paycheck online without any prior experience. The Click Wealth System is a comprehensive, step-by-step guide that holds your hand through the entire process of creating a profitable online venture.',
        benefits: ["Beginner-friendly", "Low startup cost", "Step-by-step video training", "Passive income potential", "No technical skills required"],
        affiliateLink: 'https://www.clickbank.com',
        featured: false,
        trending: true,
    },
    {
        id: 'sh001',
        title: 'His Secret Obsession: The Key to a Man\'s Heart',
        category: 'Self-Help',
        media: [{ type: 'image', url: 'https://picsum.photos/seed/sh001/800/600' }],
        rating: 4.9,
        reviewCount: 2310,
        commissionRate: '75%',
        price: '$47',
        benefitStatement: 'Unlock a man\'s deepest desires and create a passionate relationship.',
        description: 'His Secret Obsession is a relationship guide that teaches women what men secretly want. It offers powerful words, phrases, and signals that you can use to spark a man\'s deepest desire for you and only you.',
        benefits: ["Understand male psychology", "Build a deeper connection", "Increase passion and romance", "Improve communication skills", "Prevent breakups and divorce"],
        affiliateLink: 'https://www.clickbank.com',
        featured: false,
        trending: true,
    },
    {
        id: 'tech001',
        title: 'Ted\'s Woodworking: 16,000 Woodworking Plans',
        category: 'Technology',
        media: [{ type: 'image', url: 'https://picsum.photos/seed/tech001/800/600' }],
        rating: 4.6,
        reviewCount: 852,
        commissionRate: '75%',
        price: '$67',
        benefitStatement: 'Access thousands of woodworking plans with step-by-step instructions.',
        description: 'With Ted\'s Woodworking, you get instant access to over 16,000 woodworking plans for every project imaginable. Each plan comes with detailed schematics, material lists, and clear instructions, making it perfect for both beginners and experts.',
        benefits: ["16,000+ detailed plans", "Suitable for all skill levels", "Includes video tutorials", "One-time purchase, lifetime access", "Bonuses included"],
        affiliateLink: 'https://www.clickbank.com',
        featured: false,
        trending: false,
    },
    {
        id: 'rel001',
        title: 'The Devotion System - Rekindle Your Relationship',
        category: 'Relationships',
        media: [{ type: 'image', url: 'https://picsum.photos/seed/rel001/800/600' }],
        rating: 4.7,
        reviewCount: 1543,
        commissionRate: '75%',
        price: '$47',
        benefitStatement: 'Make any man see you as "the one" with this powerful relationship system.',
        description: 'The Devotion System is a unique relationship program designed to give women the advantage they need to secure a man\'s love and devotion for life. It uses psychological techniques to make him fall for you and stay committed.',
        benefits: ["Create lasting devotion", "Overcome relationship hurdles", "Boost your confidence", "Psychologically-backed methods", "For all relationship stages"],
        affiliateLink: 'https://www.clickbank.com',
        featured: false,
        trending: true,
    },
     {
        id: 'hf002',
        title: 'Okinawa Flat Belly Tonic',
        category: 'Health & Fitness',
        media: [{ type: 'image', url: 'https://picsum.photos/seed/hf002/800/600' }],
        rating: 4.7,
        reviewCount: 3450,
        commissionRate: '75%',
        price: '$69',
        benefitStatement: 'A powerful tonic inspired by Okinawa for healthy weight management.',
        description: 'A science-based breakthrough, the Okinawa Flat Belly Tonic is a powerful new formula for supporting healthy weight loss and digestion. It\'s a delicious powder you can mix with water for a refreshing and effective daily boost.',
        benefits: ["Supports metabolism", "Aids digestion", "Increases antioxidants", "Boosts energy & vitality", "Natural ingredients"],
        affiliateLink: 'https://www.clickbank.com',
        featured: false,
        trending: false,
    },
    {
        id: 'bm002',
        title: 'The 12 Minute Affiliate System',
        category: 'Business & Marketing',
        media: [{ type: 'image', url: 'https://picsum.photos/seed/bm002/800/600' }],
        rating: 4.4,
        reviewCount: 750,
        commissionRate: '50%',
        price: '$47',
        benefitStatement: 'Set up profitable affiliate campaigns in as little as 12 minutes.',
        description: 'A plug-and-play system that finally makes it easy for even the newest affiliate marketer to get everything set-up before you go to bed tonight. Generate leads and sales on autopilot.',
        benefits: ["Quick setup", "Done-for-you sales funnels", "Perfect for beginners", "Step-by-step instructions", "Build an email list automatically"],
        affiliateLink: 'https://www.clickbank.com',
        featured: false,
        trending: false,
    },
    {
        id: 'sh002',
        title: 'Numerologist.com - Personalized Numerology Reports',
        category: 'Self-Help',
        media: [{ type: 'image', url: 'https://picsum.photos/seed/sh002/800/600' }],
        rating: 4.9,
        reviewCount: 4500,
        commissionRate: '75%',
        price: '$29.99',
        benefitStatement: 'Discover your life path and unlock your potential with numerology.',
        description: 'Get a free, personalized numerology reading that reveals your unique strengths, challenges, and destiny. Numerologist.com offers in-depth reports that can guide you in your career, relationships, and personal growth.',
        benefits: ["Personalized insights", "Understand your life purpose", "Improve self-awareness", "Guidance for major life decisions", "Based on ancient science"],
        affiliateLink: 'https://www.clickbank.com',
        featured: false,
        trending: true,
    },
    {
        id: 'hf003',
        title: 'Yoga Burn: For Women',
        category: 'Health & Fitness',
        media: [{ type: 'image', url: 'https://picsum.photos/seed/hf003/800/600' }],
        rating: 0,
        reviewCount: 0,
        commissionRate: '75%',
        price: '$37',
        benefitStatement: 'A fun, dynamic yoga program designed for women to burn fat and get toned.',
        description: 'Yoga Burn is a 12-week, follow-along yoga program designed exclusively for women to promote natural and healthy weight loss without any pills, powders or potions.',
        benefits: ["Designed for women", "Progressive challenges", "Boosts metabolism", "Reduces stress", "Can be done at home"],
        affiliateLink: 'https://www.clickbank.com',
        featured: false,
        trending: false,
    },
];