import { setRequestLocale } from "next-intl/server";
import { validateLocale } from "@/i18n/routing";
import { ChatProviders } from "../_providers/chat-providers";
import { FullRouteIntlProvider } from "../_providers/route-intl-provider";
import { PageShell } from "../_components/page-shell";
import { localeStaticParams } from "@/lib/next/static-params";

// Generate static params for all supported locales
export function generateStaticParams() {
    return localeStaticParams();
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
        <FullRouteIntlProvider locale={locale}>
            <ChatProviders>
                <PageShell variant="default" className="fixed inset-0 flex w-full overflow-hidden">
                    {children}
                </PageShell>
            </ChatProviders>
        </FullRouteIntlProvider>
    );
}
