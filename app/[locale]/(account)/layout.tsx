import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AccountLayoutContent } from "./account-layout-content";
import { headers } from "next/headers";
import { createSubscriptionCheckoutSession } from "@/app/actions/subscriptions";

// Generate static params for all supported locales
export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

function AccountLayoutSkeleton({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-svh w-full">
            {/* Sidebar skeleton */}
            <div className="hidden lg:flex w-72 flex-col border-r bg-sidebar">
                <div className="p-4 space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
            </div>
            {/* Main content skeleton */}
            <div className="flex-1 flex flex-col">
                <div className="h-12 border-b flex items-center px-4 gap-2">
                    <Skeleton className="h-6 w-6" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <main className="flex-1 p-4">
                    {children}
                </main>
            </div>
        </div>
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
        redirect(`/${locale}/auth/login?next=${encodeURIComponent(pathname)}`);
    }

    const userEmail = (user as { email?: string } | null)?.email ?? "";
    const userFullName = (user as { user_metadata?: { full_name?: string } } | null)?.user_metadata?.full_name ?? "";

    return (
        <Suspense fallback={<AccountLayoutSkeleton>{children}</AccountLayoutSkeleton>}>
            <AccountLayoutContent
                modal={modal}
                initialUser={{ email: userEmail, fullName: userFullName }}
                plansModalActions={{ createSubscriptionCheckoutSession }}
            >
                {children}
            </AccountLayoutContent>
        </Suspense>
    );
}

