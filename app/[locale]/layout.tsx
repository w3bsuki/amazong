import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Inter } from "next/font/google";
import "../globals.css";
import type { Metadata } from 'next';

// Optimized font loading with display: swap for better LCP
// Subset limited to Latin for smaller bundle size
const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true
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
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CookieConsent } from "@/components/cookie-consent";
import { Suspense } from "react";
import { AuthStateListener } from "@/components/auth-state-listener";

import { createClient } from "@/lib/supabase/server";

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    // Ensure that the incoming `locale` is valid
    const { locale } = await params;
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();

    const supabase = await createClient();
    let user = null;
    if (supabase) {
        const { data } = await supabase.auth.getUser();
        user = data.user;
    }

    return (
        <html lang={locale}>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body className={`${inter.className} ${inter.variable} bg-secondary min-h-screen flex flex-col overflow-x-hidden`}>
                <NextIntlClientProvider messages={messages}>
                    <AuthStateListener />
                    <CartProvider>
                        <WishlistProvider>
                            {/* Skip Links - Accessibility (Phase 4: Enhanced focus states) */}
                            <a 
                                href="#main-content" 
                                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:bg-white focus:text-foreground focus:px-4 focus:py-3 focus:rounded-lg focus:shadow-lg focus:ring-2 focus:ring-ring focus:font-semibold focus:outline-none transition-all"
                            >
                                {locale === 'bg' ? 'Преминете към основното съдържание' : 'Skip to main content'}
                            </a>
                            <a 
                                href="#footerHeader" 
                                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-60 focus:z-100 focus:bg-white focus:text-foreground focus:px-4 focus:py-3 focus:rounded-lg focus:shadow-lg focus:ring-2 focus:ring-ring focus:font-semibold focus:outline-none transition-all"
                            >
                                {locale === 'bg' ? 'Преминете към футъра' : 'Skip to footer'}
                            </a>
                            <Suspense fallback={<div className="h-[100px] w-full bg-header-bg" />}>
                                <SiteHeader user={user} />
                            </Suspense>
                            {/* pt-14 for mobile header, sm:pt-[108px] for tablet+ with subheader */}
                            <main id="main-content" role="main" className="flex-1 pt-14 sm:pt-[108px] animate-page-fade-in">{children}</main>
                            <SiteFooter />
                            <CookieConsent />
                            <Toaster />
                        </WishlistProvider>
                    </CartProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
