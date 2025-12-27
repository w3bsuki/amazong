import { SiteHeader } from "@/components/layout/header/site-header";
import { SiteFooter } from "@/components/layout/footer/site-footer";
import { MobileTabBar } from "@/components/mobile/mobile-tab-bar";
// MobileSearchBar is now integrated into SiteHeader
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

import { SkipLinks } from "@/components/shared/skip-links";

// Generate static params for all supported locales
export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

/**
 * Main Layout
 * 
 * Full e-commerce layout with:
 * - Complete site header with navigation, search, mega menus
 * - Site footer with links and info
 * - Cookie consent banner
 * 
 * Used for: Homepage, products, categories, cart, checkout, etc.
 */
export default async function MainLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
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
        <div className="bg-secondary min-h-screen flex flex-col">
            {/* Skip Links - Accessibility */}
            <SkipLinks />
            
            <Suspense fallback={<div className="h-[52px] w-full bg-header-bg md:h-[100px]" />}>
                <SiteHeader user={user} />
            </Suspense>
            
            <main id="main-content" role="main" className="flex-1 pb-20 md:pb-0">
                {children}
            </main>
            
            <SiteFooter />
            <MobileTabBar />
        </div>
    );
}
