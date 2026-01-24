import { AppHeader } from "@/components/layout/header/app-header";
import type { UserListingStats } from "@/components/layout/sidebar/sidebar-menu-v2";
import { SiteFooter } from "@/components/layout/footer/site-footer";
import { MobileTabBar } from "@/components/mobile/mobile-tab-bar";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { getCategoryHierarchy } from "@/lib/data/categories";
import { setRequestLocale } from "next-intl/server";
import { HeaderProvider } from "@/components/providers/header-context";
import { PageShell } from "@/components/shared/page-shell";

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
    let userStats: UserListingStats | undefined;

    if (supabase) {
        const { data } = await supabase.auth.getUser();
        user = data.user;

        // Fetch listing stats if authenticated
        if (user) {
            const now = new Date().toISOString();
            const [activeResult, boostedResult] = await Promise.all([
                supabase
                    .from("products")
                    .select("id", { count: "exact", head: true })
                    .eq("seller_id", user.id)
                    .eq("status", "active"),
                supabase
                    .from("products")
                    .select("id", { count: "exact", head: true })
                    .eq("seller_id", user.id)
                    .eq("is_boosted", true)
                    .gt("boost_expires_at", now),
            ]);

            userStats = {
                activeListings: activeResult.count ?? 0,
                boostedListings: boostedResult.count ?? 0,
            };
        }
    }

    const categories = await getCategoryHierarchy(null, 2);

    return (
        <HeaderProvider>
            <PageShell className="flex flex-col">
                {/* Skip Links - Accessibility */}
                <SkipLinks />

                <Suspense fallback={<div className="h-(--header-skeleton-h) w-full bg-header-bg md:h-(--header-skeleton-h-md)" />}>
                    <AppHeader user={user} categories={categories} {...(userStats && { userStats })} />
                </Suspense>

                <main id="main-content" role="main" className="flex-1 pb-20 md:pb-0">
                    {children}
                </main>

                <SiteFooter />
                <MobileTabBar categories={categories} />
                <Toaster />
                <CookieConsent />
                <GeoWelcomeModal locale={locale} />
            </PageShell>
        </HeaderProvider>
    );
}
