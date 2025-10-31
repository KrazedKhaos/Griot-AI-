import React from 'react';

export interface Media {
  type: 'image' | 'video';
  url: string;
}

export interface Product {
  id: string;
  title: string;
  category: string;
  media: Media[];
  rating: number;
  reviewCount: number;
  commissionRate: string;
  price: string;
  description: string;
  benefits: string[];
  affiliateLink: string;
  featured: boolean;
  trending: boolean;
  benefitStatement: string;
}

export enum Page {
    Home = 'Home',
    Categories = 'Categories',
    Wishlist = 'Wishlist',
    Search = 'Search'
}

export interface Category {
    name: string;
    icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
}

export interface ToastMessage {
    message: string;
    type: 'success' | 'info';
}