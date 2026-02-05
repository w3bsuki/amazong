import { OnboardingProvider } from "./_providers/onboarding-provider";
import { StorefrontLayout } from "../_components/storefront-layout";

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

    return (
        <StorefrontLayout
            locale={locale}
            wrapShell={(shell) => <OnboardingProvider locale={locale}>{shell}</OnboardingProvider>}
        >
            {children}
        </StorefrontLayout>
    );
}
