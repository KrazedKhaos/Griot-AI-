import React from 'react';

export interface Media {
  type: 'image' | 'video';
  url: string;
}

export interface ProductPerformance {
  clicks: number;
  sales: number;
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY';

export interface Product {
  id: string;
  title: string;
  category: string;
  media: Media[];
  rating: number;
  reviewCount: number;
  commissionRate: string;
  price: number;
  description: string;
  benefits: string[];
  affiliateLink: string;
  featured: boolean;
  trending: boolean;
  benefitStatement: string;
  performance: ProductPerformance;
  specifications?: {
    dimensions?: string;
    weight?: string;
    material?: string;
    compatibility?: string;
  };
  tags?: string[];
}

export interface Business {
  id: string;
  name: string;
  category: string;
  logoUrl: string;
  tagline: string;
  description: string;
  services: string[];
  website: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  skills: string[];
  applyLink: string;
}

export interface DatingProfile {
  id: string;
  name: string;
  age: number;
  photos: string[];
  bio: string;
  interests: string[];
}

export interface Category {
    name: string;
    icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
}

export interface ToastMessage {
    message: string;
    type: 'success' | 'info';
}

export interface AITrendingProductIdea {
  title: string;
  description: string;
  marketingAngle: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  products?: Product[];
}

// Types for new AI Tools
export interface AICampaign {
  emailSequence: { subject: string; body: string }[];
  socialMediaPosts: { platform: string; content: string }[];
  blogPostIdeas: string[];
}

export interface AISeoPackage {
  keywords: string[];
  metaTitle: string;
  metaDescription: string;
}

export interface AIBusinessPlan {
  targetAudience: string;
  uniqueSellingProposition: string;
  competitorAnalysis: string;
  pricingStrategy: string;
}

export interface AIBrandKit {
    colorPalette: { hex: string, name: string }[];
    fontPairings: { headline: string, body: string };
    logoConcept: string;
}

export interface AIGlobalListing {
  platform: string;
  title: string;
  description: string;
  keywords: string[];
  cultural_notes: string;
}

export interface AIKnowledgeReport {
  summary: string;
  historical_context: string;
  key_concepts: string[];
  mythological_parallels: string;
  market_opportunities: string[];
  cited_sources: { uri: string; title: string; }[];
}

export interface AIBrandIdentity {
    archetype: string;
    manifesto: string;
    voiceAndTone: string;
    masterPrompt: string;
}

export interface AIOpportunityReport {
    identified_programs: string[];
    potential_bounties: string;
    required_skills: string[];
    first_steps: string[];
}

export interface AIDigitalBridgeStrategy {
    lowBandwidthMarketing: { title: string; strategies: string[] };
    offlineFirstStrategies: { title: string; strategies: string[] };
    communityGrowthPlan: { title: string; strategies: string[] };
    microFranchiseModel: { title: string; plan: string };
}

export interface SocialCampaignIdea {
    platform: string;
    post_idea: string;
    hashtag_suggestions: string[];
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  type: 'Spam Review' | 'Malicious Link' | 'Fraudulent Product' | 'Bot Activity';
  severity: 'Low' | 'Medium' | 'High';
  details: string;
  status: 'Flagged' | 'Resolved' | 'Pending';
}

export interface PerformancePrediction {
  sessionId: string;
  currentPath: string;
  predictedPath: string;
  confidence: number;
  cacheStatus: 'HIT' | 'MISS' | 'PRE-FETCHING';
}

export interface AIEgisCommanderReport {
    threatLevel: 'Low' | 'Guarded' | 'Elevated' | 'High' | 'Severe';
    activePatrols: { name: string, status: 'Operational' | 'On Standby' }[];
    recentIncidents: number;
    avgResponseTime: number; // in minutes
}

export interface AIKrazedKhaosStatus {
    platformStatus: 'Optimal' | 'Degraded' | 'Critical';
    securityPosture: 'Secure' | 'Vulnerable' | 'Compromised';
    performanceIndex: number; // 0-100
    marketSentiment: string;
    contentVelocity: number; // Items per week
}

export interface RewardTransaction {
  id: string;
  timestamp: number;
  description: string;
  amount: number;
}

export interface Chama {
  id: string;
  name: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  members: number;
  maxMembers: number;
  contributionFrequency: 'Weekly' | 'Monthly';
  imageUrl: string;
}
