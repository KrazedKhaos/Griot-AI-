import React from 'react';
import { Product, Category, Business, Job, DatingProfile, Chama } from './types';

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
        price: 37,
        benefitStatement: 'Lose weight and feel great with delicious, easy-to-make smoothies.',
        description: "The Smoothie Diet is a revolutionary new life-transformation system that not only guarantees to help you lose weight and feel better than you have in years, it also promises to eliminate more body fat - faster than anything you’ve tried before.",
        benefits: ["Rapid weight loss", "Increased energy levels", "Improved skin and hair", "Better sleep quality", "Detoxifies your body"],
        affiliateLink: 'https://www.clickbank.com',
        featured: true,
        trending: true,
        performance: { clicks: 12500, sales: 875 },
        tags: ['weight loss', 'smoothies', 'diet plan', 'healthy eating', 'detox'],
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
        price: 9,
        benefitStatement: 'Start your online business journey with a proven, beginner-friendly system.',
        description: 'Discover how you can generate your first paycheck online without any prior experience. The Click Wealth System is a comprehensive, step-by-step guide that holds your hand through the entire process of creating a profitable online venture.',
        benefits: ["Beginner-friendly", "Low startup cost", "Step-by-step video training", "Passive income potential", "No technical skills required"],
        affiliateLink: 'https://www.clickbank.com',
        featured: false,
        trending: true,
        performance: { clicks: 25000, sales: 1500 },
        tags: ['online business', 'make money online', 'beginner friendly', 'affiliate marketing', 'passive income'],
    },
    {
        id: 'sh001',
        title: 'His Secret Obsession: The Key to a Man\'s Heart',
        category: 'Self-Help',
        media: [{ type: 'image', url: 'https://picsum.photos/seed/sh001/800/600' }],
        rating: 4.9,
        reviewCount: 2310,
        commissionRate: '75%',
        price: 47,
        benefitStatement: 'Unlock a man\'s deepest desires and create a passionate relationship.',
        description: 'His Secret Obsession is a relationship guide that teaches women what men secretly want. It offers powerful words, phrases, and signals that you can use to spark a man\'s deepest desire for you and only you.',
        benefits: ["Understand male psychology", "Build a deeper connection", "Increase passion and romance", "Improve communication skills", "Prevent breakups and divorce"],
        affiliateLink: 'https://www.clickbank.com',
        featured: false,
        trending: true,
        performance: { clicks: 18000, sales: 1100 },
        tags: ['relationship advice', 'dating tips', 'for women', 'love', 'psychology'],
    },
    {
        id: 'tech001',
        title: 'Ted\'s Woodworking: 16,000 Woodworking Plans',
        category: 'Technology',
        media: [{ type: 'image', url: 'https://picsum.photos/seed/tech001/800/600' }],
        rating: 4.6,
        reviewCount: 852,
        commissionRate: '75%',
        price: 67,
        benefitStatement: 'Access thousands of woodworking plans with step-by-step instructions.',
        description: 'With Ted\'s Woodworking, you get instant access to over 16,000 woodworking plans for every project imaginable. Each plan comes with detailed schematics, material lists, and clear instructions, making it perfect for both beginners and experts.',
        benefits: ["16,000+ detailed plans", "Suitable for all skill levels", "Includes video tutorials", "One-time purchase, lifetime access", "Bonuses included"],
        affiliateLink: 'https://www.clickbank.com',
        featured: false,
        trending: false,
        performance: { clicks: 8000, sales: 350 },
        specifications: {
            dimensions: 'Digital Download',
            weight: 'N/A',
            compatibility: 'PDF, Video Files',
        },
        tags: ['woodworking', 'DIY', 'crafts', 'home projects', 'furniture plans'],
    },
    {
        id: 'rel001',
        title: 'The Devotion System - Rekindle Your Relationship',
        category: 'Relationships',
        media: [{ type: 'image', url: 'https://picsum.photos/seed/rel001/800/600' }],
        rating: 4.7,
        reviewCount: 1543,
        commissionRate: '75%',
        price: 47,
        benefitStatement: 'Make any man see you as "the one" with this powerful relationship system.',
        description: 'The Devotion System is a unique relationship program designed to give women the advantage they need to secure a man\'s love and devotion for life. It uses psychological techniques to make him fall for you and stay committed.',
        benefits: ["Create lasting devotion", "Overcome relationship hurdles", "Boost your confidence", "Psychologically-backed methods", "For all relationship stages"],
        affiliateLink: 'https://www.clickbank.com',
        featured: false,
        trending: true,
        performance: { clicks: 14000, sales: 950 },
        tags: ['relationship advice', 'love advice', 'commitment', 'dating guide', 'psychology'],
    },
     {
        id: 'hf002',
        title: 'Okinawa Flat Belly Tonic',
        category: 'Health & Fitness',
        media: [{ type: 'image', url: 'https://picsum.photos/seed/hf002/800/600' }],
        rating: 4.7,
        reviewCount: 3450,
        commissionRate: '75%',
        price: 69,
        benefitStatement: 'A powerful tonic inspired by Okinawa for healthy weight management.',
        description: 'A science-based breakthrough, the Okinawa Flat Belly Tonic is a powerful new formula for supporting healthy weight loss and digestion. It\'s a delicious powder you can mix with water for a refreshing and effective daily boost.',
        benefits: ["Supports metabolism", "Aids digestion", "Increases antioxidants", "Boosts energy & vitality", "Natural ingredients"],
        affiliateLink: 'https://www.clickbank.com',
        featured: false,
        trending: false,
        performance: { clicks: 22000, sales: 1300 },
        tags: ['weight loss', 'metabolism', 'natural supplement', 'digestion', 'energy boost'],
    },
    {
        id: 'bm002',
        title: 'The 12 Minute Affiliate System',
        category: 'Business & Marketing',
        media: [{ type: 'image', url: 'https://picsum.photos/seed/bm002/800/600' }],
        rating: 4.4,
        reviewCount: 750,
        commissionRate: '50%',
        price: 47,
        benefitStatement: 'Set up profitable affiliate campaigns in as little as 12 minutes.',
        description: 'A plug-and-play system that finally makes it easy for even the newest affiliate marketer to get everything set-up before you go to bed tonight. Generate leads and sales on autopilot.',
        benefits: ["Quick setup", "Done-for-you sales funnels", "Perfect for beginners", "Step-by-step instructions", "Build an email list automatically"],
        affiliateLink: 'https://www.clickbank.com',
        featured: false,
        trending: false,
        performance: { clicks: 9500, sales: 450 },
        tags: ['affiliate marketing', 'automation', 'online business', 'sales funnels', 'beginner friendly'],
    },
    {
        id: 'sh002',
        title: 'Numerologist.com - Personalized Numerology Reports',
        category: 'Self-Help',
        media: [{ type: 'image', url: 'https://picsum.photos/seed/sh002/800/600' }],
        rating: 4.9,
        reviewCount: 4500,
        commissionRate: '75%',
        price: 29.99,
        benefitStatement: 'Discover your life path and unlock your potential with numerology.',
        description: 'Get a free, personalized numerology reading that reveals your unique strengths, challenges, and destiny. Numerologist.com offers in-depth reports that can guide you in your career, relationships, and personal growth.',
        benefits: ["Personalized insights", "Understand your life purpose", "Improve self-awareness", "Guidance for major life decisions", "Based on ancient science"],
        affiliateLink: 'https://www.clickbank.com',
        featured: false,
        trending: true,
        performance: { clicks: 31000, sales: 2100 },
        tags: ['numerology', 'spirituality', 'life path', 'self discovery', 'astrology'],
    },
    {
        id: 'hf003',
        title: 'Yoga Burn: For Women',
        category: 'Health & Fitness',
        media: [{ type: 'image', url: 'https://picsum.photos/seed/hf003/800/600' }],
        rating: 0,
        reviewCount: 0,
        commissionRate: '75%',
        price: 37,
        benefitStatement: 'A fun, dynamic yoga program designed for women to burn fat and get toned.',
        description: 'Yoga Burn is a 12-week, follow-along yoga program designed exclusively for women to promote natural and healthy weight loss without any pills, powders or potions.',
        benefits: ["Designed for women", "Progressive challenges", "Boosts metabolism", "Reduces stress", "Can be done at home"],
        affiliateLink: 'https://www.clickbank.com',
        featured: false,
        trending: false,
        performance: { clicks: 5000, sales: 200 },
        tags: ['yoga', 'fitness at home', 'for women', 'weight loss', 'stress relief'],
    },
];

export const MOCK_BUSINESSES: Business[] = [
    {
      id: 'biz01',
      name: 'QuantumLeap Marketing',
      category: 'Business & Marketing',
      logoUrl: 'https://picsum.photos/seed/biz01/200',
      tagline: 'Propel your brand into the future.',
      description: 'A full-service digital marketing agency specializing in AI-driven strategies, SEO, and content creation to maximize your online presence and drive conversions.',
      services: ['AI Marketing Strategy', 'SEO & SEM', 'Content Creation', 'Social Media Management'],
      website: 'https://www.example.com',
      location: {
        address: '123 Innovation Dr, Silicon Valley, CA',
        lat: 37.3861,
        lng: -122.0839,
      },
    },
    {
        id: 'biz02',
        name: 'Zenith Wellness Coaching',
        category: 'Health & Fitness',
        logoUrl: 'https://picsum.photos/seed/biz02/200',
        tagline: 'Achieve your peak, inside and out.',
        description: 'Personalized wellness and nutrition coaching to help you build sustainable habits, increase energy, and achieve your health goals. We focus on holistic well-being.',
        services: ['1-on-1 Health Coaching', 'Nutritional Planning', 'Mindfulness Training', 'Corporate Wellness Programs'],
        website: 'https://www.example.com',
        location: {
            address: '456 Serenity Ln, Boulder, CO',
            lat: 40.0150,
            lng: -105.2705,
        },
    },
    {
        id: 'biz03',
        name: 'Dragonfly Logistics',
        category: 'Technology',
        logoUrl: 'https://picsum.photos/seed/biz03/200',
        tagline: 'Connecting Continents, Seamlessly.',
        description: 'A technology-driven logistics firm specializing in bridging the gap between Chinese manufacturers and African markets. We offer end-to-end supply chain solutions.',
        services: ['Global Freight Forwarding', 'Customs Brokerage', 'Warehousing & Distribution', 'Supply Chain Tech'],
        website: 'https://www.example.com',
        location: {
            address: '88 Rising Port, Shanghai, China',
            lat: 31.2304,
            lng: 121.4737,
        },
    },
    {
        id: 'biz04',
        name: 'Kankan Express',
        category: 'Business & Marketing',
        logoUrl: 'https://picsum.photos/seed/biz04/200',
        tagline: 'Your Gateway to Guinean Commerce.',
        description: 'Kankan Express is a Conakry-based trade facilitator that helps small and medium-sized enterprises import goods and expand their reach through digital marketing.',
        services: ['Import/Export Consulting', 'Local Market Entry', 'Digital Advertising', 'Payment Solutions'],
        website: 'https://www.example.com',
        location: {
            address: '101 Marché Madina, Conakry, Guinea',
            lat: 9.5380,
            lng: -13.6775,
        },
    },
     {
        id: 'biz05',
        name: 'Freetown FinTech',
        category: 'Technology',
        logoUrl: 'https://picsum.photos/seed/biz05/200',
        tagline: 'Simple Payments for Sierra Leone.',
        description: 'Innovating financial technology to provide accessible and easy-to-use payment solutions for businesses of all sizes in Freetown and beyond.',
        services: ['Mobile Payments', 'E-commerce Integration', 'Micro-loans', 'Financial Literacy Training'],
        website: 'https://www.example.com',
        location: {
            address: '25 Cotton Tree, Freetown, Sierra Leone',
            lat: 8.4844,
            lng: -13.2344,
        },
    },
];

export const MOCK_JOBS: Job[] = [
    {
        id: 'job01',
        title: 'Senior Frontend Engineer',
        company: 'Innovatech Solutions',
        location: 'Remote, Global',
        salary: '$120,000 - $160,000',
        description: 'Join our team to build next-generation web applications using React, TypeScript, and GraphQL. You will be responsible for architecting and implementing user-facing features.',
        skills: ['React', 'TypeScript', 'GraphQL', 'Node.js', 'UI/UX'],
        applyLink: 'https://example.com/apply/job01',
    },
    {
        id: 'job02',
        title: 'Digital Marketing Manager',
        company: 'GrowthHackers Inc.',
        location: 'Remote, EMEA',
        salary: '€70,000 - €90,000',
        description: 'We are looking for a data-driven marketing manager to lead our user acquisition and retention strategies across all digital channels.',
        skills: ['SEO', 'SEM', 'Content Marketing', 'Analytics', 'Email Marketing'],
        applyLink: 'https://example.com/apply/job02',
    },
    {
        id: 'job03',
        title: 'UX/UI Designer',
        company: 'Creative Assembly',
        location: 'Remote, Americas',
        salary: '$90,000 - $110,000',
        description: 'Design beautiful and intuitive user experiences for our mobile and web products. You will work closely with product managers and engineers.',
        skills: ['Figma', 'Sketch', 'User Research', 'Prototyping', 'Design Systems'],
        applyLink: 'https://example.com/apply/job03',
    },
    {
        id: 'job04',
        title: 'Content Writer (Crypto & Web3)',
        company: 'CryptoConnect',
        location: 'Remote, Global',
        salary: '$65,000 - $85,000',
        description: 'Create engaging and educational content about the cryptocurrency and Web3 space. Topics include DeFi, NFTs, and blockchain technology.',
        skills: ['Writing', 'Editing', 'Web3', 'Cryptocurrency', 'SEO'],
        applyLink: 'https://example.com/apply/job04',
    },
    {
        id: 'job05',
        title: 'Senior Backend Engineer (Python)',
        company: 'DataStream Corp.',
        location: 'Remote, Global',
        salary: '£90,000 - £120,000',
        description: 'Develop and maintain scalable backend services and APIs using Python, Django, and PostgreSQL. Experience with cloud platforms like AWS is a must.',
        skills: ['Python', 'Django', 'PostgreSQL', 'AWS', 'REST APIs'],
        applyLink: 'https://example.com/apply/job05',
    },
    {
        id: 'job06',
        title: 'Customer Support Specialist',
        company: 'HelpDesk Heroes',
        location: 'Remote, US Timezones',
        salary: '$50,000 - $65,000',
        description: 'Provide exceptional support to our customers via email, chat, and phone. You will be the first point of contact for users needing assistance.',
        skills: ['Communication', 'Problem-Solving', 'Zendesk', 'Empathy'],
        applyLink: 'https://example.com/apply/job06',
    },
];

export const MOCK_DATING_PROFILES: DatingProfile[] = [
    {
        id: 'dp01',
        name: 'Zola',
        age: 28,
        photos: ['https://picsum.photos/seed/dp01-1/600/800', 'https://picsum.photos/seed/dp01-2/600/800'],
        bio: 'Entrepreneur from Accra with a passion for tech and travel. Looking for someone to explore new restaurants and ideas with. 🇬🇭✨',
        interests: ['Tech', 'Travel', 'Foodie', 'Art', 'Startups']
    },
    {
        id: 'dp02',
        name: 'Kenji',
        age: 31,
        photos: ['https://picsum.photos/seed/dp02-1/600/800', 'https://picsum.photos/seed/dp02-2/600/800'],
        bio: 'Graphic designer and musician based in Tokyo. I find inspiration in city nights and quiet mornings. Let\'s create something beautiful.',
        interests: ['Music', 'Design', 'Photography', 'Coffee', 'Anime']
    },
    {
        id: 'dp03',
        name: 'Sofia',
        age: 26,
        photos: ['https://picsum.photos/seed/dp03-1/600/800'],
        bio: 'Marine biologist living in Rio. My life is sun, sand, and science. Searching for a partner in adventure (and caipirinhas). 🇧🇷',
        interests: ['Ocean', 'Hiking', 'Samba', 'Science', 'Dogs']
    },
    {
        id: 'dp04',
        name: 'Amir',
        age: 34,
        photos: ['https://picsum.photos/seed/dp04-1/600/800', 'https://picsum.photos/seed/dp04-2/600/800', 'https://picsum.photos/seed/dp04-3/600/800'],
        bio: 'Architect from Cairo. I love history, chess, and finding the perfect cup of tea. Tell me about your favorite book.',
        interests: ['History', 'Chess', 'Architecture', 'Reading', 'Tea']
    },
    {
        id: 'dp05',
        name: 'Chloe',
        age: 29,
        photos: ['https://picsum.photos/seed/dp05-1/600/800', 'https://picsum.photos/seed/dp05-2/600/800'],
        bio: 'Chef and urban gardener in Paris. I believe the best conversations happen over a good meal. Fluent in French and sarcasm.',
        interests: ['Cooking', 'Gardening', 'Wine', 'Jazz', 'Museums']
    },
    {
        id: 'dp06',
        name: 'David',
        age: 30,
        photos: ['https://picsum.photos/seed/dp06-1/600/800'],
        bio: 'Software engineer in Nairobi. When I\'m not coding, I\'m probably hiking or trying to learn a new language. Always up for a challenge.',
        interests: ['Coding', 'Hiking', 'Languages', 'Gaming', 'Sci-Fi']
    }
];

export const MOCK_CHAMAS: Chama[] = [
    {
        id: 'chama01',
        name: 'Tech Innovators Fund',
        description: 'A weekly savings group for aspiring tech entrepreneurs to fund their startup ideas.',
        goalAmount: 250000,
        currentAmount: 187500,
        members: 8,
        maxMembers: 10,
        contributionFrequency: 'Weekly',
        imageUrl: 'https://picsum.photos/seed/chama01/800/600',
    },
    {
        id: 'chama02',
        name: 'Farming Futures Co-op',
        description: 'Supporting small-scale farmers with funds for seeds, equipment, and market access.',
        goalAmount: 100000,
        currentAmount: 45000,
        members: 12,
        maxMembers: 20,
        contributionFrequency: 'Monthly',
        imageUrl: 'https://picsum.photos/seed/chama02/800/600',
    },
    {
        id: 'chama03',
        name: 'Artisan Collective',
        description: 'A fund for local artists and craftspeople to buy materials and showcase their work globally.',
        goalAmount: 75000,
        currentAmount: 70000,
        members: 5,
        maxMembers: 5,
        contributionFrequency: 'Weekly',
        imageUrl: 'https://picsum.photos/seed/chama03/800/600',
    },
];
