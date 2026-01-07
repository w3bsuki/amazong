import { setRequestLocale } from "next-intl/server";

/**
 * Cart Page Layout
 * 
 * Inherits from (main) layout but allows the client component
 * to control mobile-specific header behavior.
 * 
 * On mobile: Page shows its own MobileCartHeader (like product pages)
 * On desktop: Uses standard SiteHeader from parent layout
 */
export default async function CartLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    // Just pass through - parent (main) layout handles the shell
    // The cart-page-client will render MobileCartHeader on mobile
    return <>{children}</>;
}
