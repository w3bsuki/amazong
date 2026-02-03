import { setRequestLocale } from "next-intl/server";
import { routing, validateLocale } from "@/i18n/routing";
import { CommerceProviders } from "../_providers/commerce-providers";

// Generate static params for all supported locales
export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

/**
 * Chat Layout
 * 
 * Minimal full-screen layout for messaging:
 * - No header, footer, or navigation
 * - Full viewport height for immersive chat experience
 * - Clean, distraction-free interface
 * 
 * Used for: Messages/Chat pages
 */
export default async function ChatLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale: localeParam } = await params;
    const locale = validateLocale(localeParam)
    
    // Enable static rendering - required for Next.js 16+ with cacheComponents
    setRequestLocale(locale);

    return (
        <CommerceProviders>
            <div className="fixed inset-0 flex w-full bg-background overflow-hidden">
                {children}
            </div>
        </CommerceProviders>
    );
}
