import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Inter } from "next/font/google";
import "../globals.css";
import type { Metadata } from 'next';
import { Suspense, type ReactNode } from 'react';
import { ThemeProvider } from '@/components/providers/theme-provider';

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

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    title: {
      template: '%s | AMZN',
      default: locale === 'bg' ? 'AMZN - Онлайн магазин' : 'AMZN - Online Shopping'
    },
    description: locale === 'bg' 
      ? 'Открийте най-добрите продукти на достъпни цени. Бърза доставка в България.'
      : 'Discover the best products at affordable prices. Fast delivery.',
    keywords: locale === 'bg' 
      ? ['онлайн магазин', 'пазаруване', 'електроника', 'мода', 'дом']
      : ['online shopping', 'e-commerce', 'electronics', 'fashion', 'home'],
    icons: {
      icon: [
        { url: '/icon.svg', type: 'image/svg+xml' },
        { url: '/icon-dark-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: '/apple-icon.png',
    },
    openGraph: {
      title: locale === 'bg' ? 'AMZN - Онлайн магазин' : 'AMZN - Online Shopping',
      description: locale === 'bg' 
        ? 'Открийте най-добрите продукти на достъпни цени.'
        : 'Discover the best products at affordable prices.',
      type: 'website',
      locale: locale === 'bg' ? 'bg_BG' : 'en_US',
    },
  };
}
import { Toaster } from "@/components/providers/sonner";
import { CartProvider } from "@/components/providers/cart-context";
import { WishlistProvider } from "@/components/providers/wishlist-context";
import { AuthStateListener } from "@/components/providers/auth-state-listener";
import { GeoWelcomeModal } from "@/components/common/geo-welcome-modal";
import { CookieConsent } from "@/components/layout/cookie-consent";

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
    
    // Enable static rendering - CRITICAL for Next.js 16+ with cacheComponents
    setRequestLocale(locale);

    // Providing all messages to the client side
    const messages = await getMessages();

    return (
      <html lang={locale} className={inter.variable} suppressHydrationWarning>
            <body className="bg-background min-h-screen">
                <NextIntlClientProvider messages={messages}>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem={false}
              storageKey="amzn-theme"
              disableTransitionOnChange
            >
              <Suspense fallback={null}>
                <AuthStateListener />
              </Suspense>
              <CartProvider>
                <WishlistProvider>
                  {children}
                  <Toaster />
                  <GeoWelcomeModal locale={locale} />
                <CookieConsent />
                </WishlistProvider>
              </CartProvider>
            </ThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
