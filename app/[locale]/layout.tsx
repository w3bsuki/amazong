import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Inter } from "next/font/google";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/lib/cart-context";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Suspense } from "react";
import { AuthStateListener } from "@/components/auth-state-listener";

const inter = Inter({ subsets: ["latin"] });

import { createClient } from "@/lib/supabase/server";

// ... imports

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    // Ensure that the incoming `locale` is valid
    const { locale } = await params;
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();

    const supabase = await createClient();
    let user = null;
    if (supabase) {
        const { data } = await supabase.auth.getUser();
        user = data.user;
    }

    return (
        <html lang={locale}>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body className={`${inter.className} bg-slate-50 min-h-screen flex flex-col`}>
                <NextIntlClientProvider messages={messages}>
                    <AuthStateListener />
                    <CartProvider>
                        <Suspense fallback={<div className="h-[100px] w-full bg-slate-900" />}>
                            <SiteHeader user={user} />
                        </Suspense>
                        <div className="flex-1">{children}</div>
                        <SiteFooter />
                        <Toaster />
                    </CartProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
