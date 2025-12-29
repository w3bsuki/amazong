import { SiteHeader } from "@/components/layout/header/site-header";
import { SiteFooter } from "@/components/layout/footer/site-footer";
import { MobileTabBar } from "@/components/mobile/mobile-tab-bar";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { setRequestLocale } from "next-intl/server";

import { AuthStateListener } from "@/components/providers/auth-state-listener";
import { CartProvider } from "@/components/providers/cart-context";
import { Toaster } from "@/components/providers/sonner";
import { WishlistProvider } from "@/components/providers/wishlist-context";
import { CookieConsent } from "@/components/layout/cookie-consent";
import { GeoWelcomeModal } from "@/components/common/geo-welcome-modal";

import { SkipLinks } from "@/components/shared/skip-links";

/**
 * Username/Store Route Layout
 *
 * Full e-commerce layout for seller storefront routes:
 * - /{username} (store)
 * - /{username}/{productSlug} (product detail)
 *
 * Includes header, footer, and all standard e-commerce elements.
 */
export default async function UsernameLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string; username: string }>;
}) {
    const { locale } = await params;
    
    // Enable static rendering - required for Next.js 16+ with cacheComponents
    setRequestLocale(locale);
    
    const supabase = await createClient();
    let user = null;
    if (supabase) {
        const { data } = await supabase.auth.getUser();
        user = data.user;
    }

    return (
        <CartProvider>
            <WishlistProvider>
                <div className="bg-secondary min-h-screen flex flex-col">
                    {/* Skip Links - Accessibility */}
                    <SkipLinks />

                    <Suspense fallback={null}>
                        <AuthStateListener />
                    </Suspense>
                    
                    <Suspense fallback={<div className="h-[52px] w-full bg-header-bg md:h-[100px]" />}>
                        <SiteHeader user={user} hideSubheader />
                    </Suspense>
                    
                    <main id="main-content" role="main" className="flex-1 pb-20 md:pb-0">
                        {children}
                    </main>
                    
                    <SiteFooter />
                    <MobileTabBar />
                    <Toaster />
                    <CookieConsent />
                    <GeoWelcomeModal locale={locale} />
                </div>
            </WishlistProvider>
        </CartProvider>
    );
}
