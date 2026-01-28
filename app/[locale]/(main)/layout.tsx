import { AppHeader } from "@/components/layout/header/app-header";
import { SiteFooter } from "@/components/layout/footer/site-footer";
import { MobileTabBar } from "@/components/mobile/mobile-tab-bar";
// MobileSearchBar is now integrated into AppHeader
import { getCategoryHierarchy } from "@/lib/data/categories";
import { completePostSignupOnboarding } from "@/app/actions/onboarding";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import type { CategoryTreeNode } from "@/lib/category-tree";

import { OnboardingProvider } from "./_providers/onboarding-provider";
import { HeaderProvider } from "@/components/providers/header-context";
import { Toaster } from "@/components/providers/sonner";
import { GeoWelcomeModal } from "@/components/shared/geo-welcome-modal";
import { CookieConsent } from "@/components/layout/cookie-consent";

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
 * Note: Product modal slot is at [locale] level to intercept [username]/[productSlug]
 * routes which are siblings of (main), not children.
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

    const categories = await getCategoryHierarchy(null, 2);

    return (
        <OnboardingProvider locale={locale} completePostSignupOnboarding={completePostSignupOnboarding}>
            <HeaderProvider>
                <div className="bg-background min-h-screen flex flex-col">      
                    {/* Skip Links - Accessibility */}
                    <SkipLinks />

                    <AppHeader user={null} categories={categories} />

                    <main id="main-content" role="main" className="flex-1 pb-20 md:pb-0">
                        {children}
                    </main>

                    <SiteFooter />
                    <MobileTabBar categories={categories} />
                    <Toaster />
                    <CookieConsent />
                    <GeoWelcomeModal locale={locale} />
                </div>
            </HeaderProvider>
        </OnboardingProvider>
    );
}
