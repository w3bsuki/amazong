import { hasLocale } from 'next-intl';
import { notFound, routing } from '@/i18n/routing';
import { Inter } from "next/font/google";
import "../globals.css";
import type { Metadata } from 'next';
import { Suspense, type ReactNode } from 'react';
import { setRequestLocale } from 'next-intl/server';
import LocaleProviders from './locale-providers';
import { localeStaticParams } from "@/lib/next/static-params"
import { DisableNextDevIndicator } from "./_components/disable-next-dev-indicator"

// Generate static params for all supported locales
// Required in Next.js 16+ for dynamic route segments
export function generateStaticParams() {
  return localeStaticParams()
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

const METADATA_COPY = {
  en: {
    description: "Discover the best products at affordable prices.",
    ogAlt: "Treido marketplace",
  },
  bg: {
    description: "Открий най-добрите продукти на достъпни цени.",
    ogAlt: "Treido маркетплейс",
  },
} as const

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const resolvedLocale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale
  const copy = METADATA_COPY[resolvedLocale]

  return {
    metadataBase: new URL('https://treido.eu'),
    title: {
      template: '%s | Treido',
      default: 'Treido',
    },
    description: copy.description,
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
      title: 'Treido',
      description: copy.description,
      type: 'website',
      siteName: 'Treido',
      images: [
        {
          url: '/og-image.svg',
          width: 1200,
          height: 630,
          alt: copy.ogAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Treido',
      description: copy.description,
      images: ['/og-image.svg'],
    },
  }
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

  setRequestLocale(locale);

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <body className="bg-background min-h-screen font-sans">
        <DisableNextDevIndicator />
        <Suspense fallback={null}>
          <LocaleProviders locale={locale}>
            {children}
          </LocaleProviders>
        </Suspense>
      </body>
    </html>
  );
}
