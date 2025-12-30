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
import { SiteHeader } from "@/components/layout/header/site-header";
import { SkipLinks } from "@/components/shared/skip-links";

/**
 * Product Detail Page Layout
 * 
 * On mobile: Hides main SiteHeader (product page has its own MobileProductHeader)
 * On desktop: Shows SiteHeader normally
 */
export default async function ProductDetailLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
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
                    <SkipLinks />
                    
                    <Suspense fallback={null}>
                        <AuthStateListener />
                    </Suspense>
                    
                    {/* Hide SiteHeader on mobile - MobileProductHeader used instead */}
                    <Suspense fallback={<div className="hidden lg:block h-[100px] w-full bg-header-bg" />}>
                        <SiteHeader user={user} hideSubheader hideOnMobile />
                    </Suspense>
                    
                    <main id="main-content" role="main" className="flex-1 pb-20 md:pb-0">
                        {children}
                    </main>
                    
                    <SiteFooter />
                    <MobileTabBar />
                    <Toaster />
                    <CookieConsent />
                </div>
            </WishlistProvider>
        </CartProvider>
    );
}
