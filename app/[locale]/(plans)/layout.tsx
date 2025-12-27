import { setRequestLocale } from "next-intl/server";
import { routing, validateLocale } from "@/i18n/routing";

// Generate static params for all supported locales
export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

/**
 * Plans Layout
 * 
 * Clean standalone layout for the pricing/plans page.
 * No header, footer, or navigation - just the content.
 * The page handles its own minimal navigation.
 */
export default async function PlansLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale: localeParam } = await params;
    const locale = validateLocale(localeParam)
    
    // Enable static rendering
    setRequestLocale(locale);

    return (
        <>
            {children}
        </>
    );
}
