import { AppHeader } from "@/components/layout/header/app-header";
import { SiteFooter } from "@/components/layout/footer/site-footer";
import { MobileTabBar } from "@/components/mobile/mobile-tab-bar";
import { getCategoryHierarchy } from "@/lib/data/categories";
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

    const categories = await getCategoryHierarchy(null, 2);

    return (
        <HeaderProvider>
            <PageShell className="flex flex-col">
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
            </PageShell>
        </HeaderProvider>
    );
}
