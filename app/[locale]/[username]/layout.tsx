import { StorefrontLayout } from "../_components/storefront-layout";
import { RouteIntlProvider } from "../_providers/route-intl-provider";
import { ROOT_INTL_NAMESPACES, USERNAME_ROUTE_INTL_NAMESPACES } from "@/lib/i18n/scoped-messages";
import { setRequestLocale } from "next-intl/server";

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
    setRequestLocale(locale);

    const localizedRouteChildren = (
        <RouteIntlProvider
            locale={locale}
            namespaces={[...ROOT_INTL_NAMESPACES, ...USERNAME_ROUTE_INTL_NAMESPACES]}
        >
            {children}
        </RouteIntlProvider>
    );

    return (
        <StorefrontLayout locale={locale}>{localizedRouteChildren}</StorefrontLayout>
    );
}
