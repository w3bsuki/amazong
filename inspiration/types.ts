import React from 'react';

export interface Product {
  id: string;
  title: string;
  price: number;
  currency: string;
  imageUrl: string;
  tag?: string;
  isFavorite: boolean;
  location: string;
  condition: 'New' | 'Like New' | 'Good' | 'Used';
  postedAt: string;
  // Extended fields for Product Page
  description?: string;
  seller?: {
    name: string;
    rating: number;
    reviews: number;
    isVerified: boolean;
    avatarUrl: string;
  };
  specs?: Record<string, string>;
}

export interface Category {
  id: string;
  name: string;
}

export interface CategoryNode {
  id: string;
  name: string;
  items?: CategoryNode[];
}

export interface Filter {
  id: string;
  label: string;
  icon?: React.ReactNode;
}