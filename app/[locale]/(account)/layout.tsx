import { createClient } from "@/lib/supabase/server";
import { redirect } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AccountLayoutContent } from "./_components/account-layout-content";
import { headers } from "next/headers";
import { createSubscriptionCheckoutSession } from "../../actions/subscriptions-reads";
import { connection } from "next/server";
import { CommerceProviders } from "../_providers/commerce-providers";
import { FullRouteIntlProvider } from "../_providers/route-intl-provider";
import type { Metadata } from "next";
import { localeStaticParams } from "@/lib/next/static-params";

// Generate static params for all supported locales
export function generateStaticParams() {
    return localeStaticParams();
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: "Account" });

    return {
        title: t("title"),
    };
}

async function AccountLayoutGate({
    children,
    modal,
    locale,
}: {
    children: React.ReactNode;
    modal: React.ReactNode;
    locale: string;
}) {
    // Mark route as dynamic without using route segment config (incompatible with cacheComponents).
    await connection();

    const pathname = (await headers()).get("x-pathname") || `/${locale}/account`;

    // Check auth on server side
    let user: unknown = null;
    try {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.getUser();
        user = error ? null : data.user;
    } catch {
        user = null;
    }

    if (!user) {
        redirect({ href: { pathname: "/auth/login", query: { next: pathname } }, locale });
    }

    const userEmail = (user as { email?: string } | null)?.email ?? "";
    const userFullName = (user as { user_metadata?: { full_name?: string } } | null)?.user_metadata?.full_name ?? "";

    return (
        <AccountLayoutContent
            modal={modal}
            initialUser={{ email: userEmail, fullName: userFullName }}
            plansModalActions={{ createSubscriptionCheckoutSession }}
        >
            {children}
        </AccountLayoutContent>
    );
}

/**
 * Account Layout
 * 
 * Modern dashboard-style layout for account management using shadcn sidebar:
 * - Collapsible sidebar navigation with icons
 * - Clean header with breadcrumbs
 * - Mobile-optimized with bottom tab bar
 * - Supports modal overlays via @modal parallel route
 * 
 * Used for: Account settings, orders, plans, messages, etc.
 */
export default async function AccountLayout({
    children,
    modal,
    params,
}: {
    children: React.ReactNode;
    modal: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    
    // Enable static rendering
    setRequestLocale(locale);

    return (
        <FullRouteIntlProvider locale={locale}>
            <CommerceProviders>
                <AccountLayoutGate modal={modal} locale={locale}>
                    {children}
                </AccountLayoutGate>
            </CommerceProviders>
        </FullRouteIntlProvider>
    );
}

