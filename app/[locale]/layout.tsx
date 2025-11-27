import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Inter } from "next/font/google";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MobileTabBar } from "@/components/mobile-tab-bar";
import { CookieConsent } from "@/components/cookie-consent";
import { Suspense } from "react";
import { AuthStateListener } from "@/components/auth-state-listener";

const inter = Inter({ subsets: ["latin"] });

import { createClient } from "@/lib/supabase/server";

// ... imports

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
            <body className={`${inter.className} bg-secondary min-h-screen flex flex-col overflow-x-hidden`}>
                <NextIntlClientProvider messages={messages}>
                    <AuthStateListener />
                    <CartProvider>
                        <WishlistProvider>
                            {/* Skip Links - Accessibility */}
                            <a 
                                href="#main-content" 
                                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:bg-white focus:text-foreground focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:ring-2 focus:ring-blue-500 focus:font-medium"
                            >
                                Skip to main content
                            </a>
                            <a 
                                href="#footerHeader" 
                                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-52 focus:z-100 focus:bg-white focus:text-foreground focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:ring-2 focus:ring-blue-500 focus:font-medium"
                            >
                                Skip to footer
                            </a>
                            <Suspense fallback={<div className="h-[100px] w-full bg-header-bg" />}>
                                <SiteHeader user={user} />
                            </Suspense>
                            {/* pt-[120px] for fixed header on mobile (56px header + ~48px nav), md:pt-[108px] for tablet+ */}
                            <div id="main-content" className="flex-1 pt-14 sm:pt-[108px] pb-16 md:pb-0">{children}</div>
                            <SiteFooter />
                            <MobileTabBar locale={locale} />
                            <CookieConsent />
                            <Toaster />
                        </WishlistProvider>
                    </CartProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
