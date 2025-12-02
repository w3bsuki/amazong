import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Inter } from "next/font/google";
import "../globals.css";
import type { Metadata } from 'next';

// Optimized font loading with display: swap for better LCP
// Subset limited to Latin for smaller bundle size
const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    title: {
      template: '%s | AMZN',
      default: locale === 'bg' ? 'AMZN - Онлайн магазин' : 'AMZN - Online Shopping'
    },
    description: locale === 'bg' 
      ? 'Открийте най-добрите продукти на достъпни цени. Бърза доставка в България.'
      : 'Discover the best products at affordable prices. Fast delivery.',
    keywords: locale === 'bg' 
      ? ['онлайн магазин', 'пазаруване', 'електроника', 'мода', 'дом']
      : ['online shopping', 'e-commerce', 'electronics', 'fashion', 'home'],
    icons: {
      icon: [
        { url: '/icon.svg', type: 'image/svg+xml' },
        { url: '/icon-dark-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: '/apple-icon.png',
    },
    openGraph: {
      title: locale === 'bg' ? 'AMZN - Онлайн магазин' : 'AMZN - Online Shopping',
      description: locale === 'bg' 
        ? 'Открийте най-добрите продукти на достъпни цени.'
        : 'Discover the best products at affordable prices.',
      type: 'website',
      locale: locale === 'bg' ? 'bg_BG' : 'en_US',
    },
  };
}
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { AuthStateListener } from "@/components/auth-state-listener";

/**
 * Root Locale Layout
 * 
 * This is the base layout for all locale routes. It provides:
 * - HTML document structure
 * - Font configuration
 * - Global providers (i18n, cart, wishlist)
 * 
 * Route groups handle specific layouts:
 * - (main)/ - Full e-commerce layout with header, footer, mega menus
 * - (account)/ - Minimal account layout with sidebar navigation
 */
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

    // Providing all messages to the client side
    const messages = await getMessages();

    return (
        <html lang={locale}>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body className={`${inter.className} ${inter.variable} bg-background min-h-screen`}>
                <NextIntlClientProvider messages={messages}>
                    <AuthStateListener />
                    <CartProvider>
                        <WishlistProvider>
                            {children}
                            <Toaster />
                        </WishlistProvider>
                    </CartProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
