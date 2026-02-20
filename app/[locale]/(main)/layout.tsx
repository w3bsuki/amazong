import { OnboardingProvider } from "./_providers/onboarding-provider";
import { StorefrontLayout } from "../_components/storefront-layout";
import { RouteIntlProvider } from "../_providers/route-intl-provider";
import { MAIN_ROUTE_INTL_NAMESPACES, ROOT_INTL_NAMESPACES } from "@/lib/i18n/scoped-messages";
import { setRequestLocale } from "next-intl/server";

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
    setRequestLocale(locale);
    const localizedRouteChildren = (
        <RouteIntlProvider
            locale={locale}
            namespaces={[...ROOT_INTL_NAMESPACES, ...MAIN_ROUTE_INTL_NAMESPACES]}
        >
            {children}
        </RouteIntlProvider>
    );

    return (
        <StorefrontLayout
            locale={locale}
            wrapShell={(shell) => <OnboardingProvider locale={locale}>{shell}</OnboardingProvider>}
        >
            {localizedRouteChildren}
        </StorefrontLayout>
    );
}
