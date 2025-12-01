import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CookieConsent } from "@/components/cookie-consent";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { getLocale } from "next-intl/server";

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
}: {
    children: React.ReactNode;
}) {
    const locale = await getLocale();
    
    const supabase = await createClient();
    let user = null;
    if (supabase) {
        const { data } = await supabase.auth.getUser();
        user = data.user;
    }

    return (
        <div className="bg-secondary min-h-screen flex flex-col">
            {/* Skip Links - Accessibility */}
            <a 
                href="#main-content" 
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:bg-white focus:text-foreground focus:px-4 focus:py-3 focus:rounded-lg focus:shadow-lg focus:ring-2 focus:ring-ring focus:font-semibold focus:outline-none transition-all"
            >
                {locale === 'bg' ? 'Преминете към основното съдържание' : 'Skip to main content'}
            </a>
            <a 
                href="#footerHeader" 
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-60 focus:z-100 focus:bg-white focus:text-foreground focus:px-4 focus:py-3 focus:rounded-lg focus:shadow-lg focus:ring-2 focus:ring-ring focus:font-semibold focus:outline-none transition-all"
            >
                {locale === 'bg' ? 'Преминете към футъра' : 'Skip to footer'}
            </a>
            
            <Suspense fallback={<div className="h-[100px] w-full bg-header-bg" />}>
                <SiteHeader user={user} />
            </Suspense>
            
            <main id="main-content" role="main" className="flex-1">
                {children}
            </main>
            
            <SiteFooter />
            <CookieConsent />
        </div>
    );
}
