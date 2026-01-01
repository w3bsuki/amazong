import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Inter } from "next/font/google";
import "../globals.css";
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import LocaleProviders from './locale-providers';

// Generate static params for all supported locales
// Required in Next.js 16+ for dynamic route segments
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Optimized font loading with display: swap for better LCP
// Support both Latin and Cyrillic for Bulgarian locale
const inter = Inter({ 
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://treido.eu'),
  title: {
    template: '%s | Treido',
    default: 'Treido - Online Shopping',
  },
  description: 'Discover the best products at affordable prices.',
  authors: [{ name: 'Treido', url: 'https://treido.eu' }],
  creator: 'Treido',
  publisher: 'Treido',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-dark-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Treido - Online Shopping',
    description: 'Discover the best products at affordable prices.',
    type: 'website',
    siteName: 'Treido',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Treido - Online Shopping in Europe',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Treido - Online Shopping',
    description: 'Discover the best products at affordable prices.',
    images: ['/og-image.svg'],
  },
  alternates: {
    languages: {
      'en-IE': 'https://treido.eu/en',
      'bg-BG': 'https://treido.eu/bg',
    },
  },
}

/**
 * Root Locale Layout
 * 
 * This is the base layout for all locale routes. It provides:
 * - HTML document structure
 * - Font configuration
 * - Global providers (i18n, cart, wishlist)
 * 
 * Route groups handle specific layouts:
 * - (main)/ - Full e-commerce layout with header, footer, mega menus
 * - (account)/ - Minimal account layout with sidebar navigation
 */
export default async function LocaleLayout({
    children,
    params
}: {
  children: ReactNode;
    params: Promise<{ locale: string }>;
}) {
    // Ensure that the incoming `locale` is valid using proper type guard
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }
    
    return (
      <html lang={locale} className={inter.variable} suppressHydrationWarning>
            <body className="bg-background min-h-screen">
                <LocaleProviders locale={locale}>{children}</LocaleProviders>
            </body>
        </html>
    );
}
