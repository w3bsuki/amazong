import { setRequestLocale } from "next-intl/server";

/**
 * Product Detail Page Layout
 * 
 * Minimal layout - inherits header, footer, providers from parent [username]/layout.tsx
 * The parent layout already provides:
 * - CartProvider, WishlistProvider
 * - SiteHeader, SiteFooter
 * - MobileTabBar, Toaster, CookieConsent
 * - AuthStateListener, SkipLinks
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

    // Just pass through children - parent layout handles all wrapping
    return <>{children}</>;
}
