import { SiteHeader } from "@/components/layout/header/site-header";
import { SiteFooter } from "@/components/layout/footer/site-footer";
import { MobileTabBar } from "@/components/mobile/mobile-tab-bar";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { getCategoryHierarchy } from "@/lib/data/categories";
import { setRequestLocale } from "next-intl/server";

import { Toaster } from "@/components/providers/sonner";
import { CookieConsent } from "@/components/layout/cookie-consent";
import { GeoWelcomeModal } from "@/components/shared/geo-welcome-modal";

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

    const categories = await getCategoryHierarchy(null, 2);

    return (
        <div className="bg-secondary min-h-screen flex flex-col">
            {/* Skip Links - Accessibility */}
            <SkipLinks />

            <Suspense fallback={<div className="h-[52px] w-full bg-header-bg md:h-[100px]" />}>
                <SiteHeader user={user} hideSubheader hideOnMobile categories={categories} />
            </Suspense>

            <main id="main-content" role="main" className="flex-1 pb-20 md:pb-0">
                {children}
            </main>

            <SiteFooter />
            <MobileTabBar categories={categories} />
            <Toaster />
            <CookieConsent />
            <GeoWelcomeModal locale={locale} />
        </div>
    );
}
