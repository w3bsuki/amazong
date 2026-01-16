import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Toaster } from "@/components/providers/sonner";

// Generate static params for all supported locales
export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

/**
 * Demo Layout - Isolated layout for demo pages
 * 
 * No site header/footer - allows demos to have full control
 * of their own UI without interference from main layout.
 */
export default async function DemoLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    return (
        <div className="bg-background min-h-screen">
            {children}
            <Toaster />
        </div>
    );
}
