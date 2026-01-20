import { setRequestLocale } from "next-intl/server";

/**
 * Cart Page Layout
 * 
 * Inherits from (main) layout.
 * Layout owns the header for all viewports.
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
    return <>{children}</>;
}
