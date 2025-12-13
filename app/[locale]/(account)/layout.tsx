import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AccountLayoutContent } from "./account-layout-content";

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
    await connection();
    const { locale } = await params;
    
    // Enable static rendering
    setRequestLocale(locale);
    
    // Check auth on server side
    const supabase = await createClient();
    
    if (!supabase) {
        redirect("/auth/login");
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        redirect("/auth/login");
    }

    return (
        <Suspense fallback={<AccountLayoutSkeleton>{children}</AccountLayoutSkeleton>}>
            <AccountLayoutContent modal={modal}>
                {children}
            </AccountLayoutContent>
        </Suspense>
    );
}

