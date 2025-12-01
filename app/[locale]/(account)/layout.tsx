import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { 
    Package, 
    CreditCard, 
    Lock, 
    MapPin, 
    User, 
    ChatCircle as MessageSquare,
    SignOut,
    House,
    Crown,
    Storefront
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * Account Layout
 * 
 * Minimal, focused layout for account management:
 * - Simple header with logo and user info
 * - Sidebar navigation for account sections
 * - No mega menus, no distractions
 * - Supports modal overlays via @modal parallel route
 * 
 * Used for: Account settings, orders, plans, messages, etc.
 */
export default async function AccountLayout({
    children,
    modal,
}: {
    children: React.ReactNode;
    modal: React.ReactNode;
}) {
    const locale = await getLocale();
    const supabase = await createClient();
    
    if (!supabase) {
        redirect("/auth/login");
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        redirect("/auth/login");
    }

    const t = await getTranslations({ locale, namespace: 'Account' });
    
    // Get user initials for avatar
    const email = user.email || '';
    const initials = email.substring(0, 2).toUpperCase();

    const menuItems = [
        {
            title: t('orders.title'),
            icon: Package,
            href: "/account/orders",
        },
        {
            title: t('prime.title'),
            icon: Crown,
            href: "/account/plans",
        },
        {
            title: t('security.title'),
            icon: Lock,
            href: "/account/security",
        },
        {
            title: t('addresses.title'),
            icon: MapPin,
            href: "/account/addresses",
        },
        {
            title: t('payments.title'),
            icon: CreditCard,
            href: "/account/payments",
        },
        {
            title: t('messages.title'),
            icon: MessageSquare,
            href: "/account/messages",
        },
        {
            title: locale === 'bg' ? 'Продавам' : 'Selling',
            icon: Storefront,
            href: "/account/selling",
        },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-muted/30">
            {/* Minimal Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                <div className="container flex h-14 items-center justify-between">
                    {/* Logo + Back to Store */}
                    <div className="flex items-center gap-4">
                        <Link 
                            href="/" 
                            className="flex items-center gap-2 font-semibold text-xl hover:opacity-80 transition-opacity"
                        >
                            <span className="text-primary">AMZN</span>
                        </Link>
                        <div className="hidden sm:block h-6 w-px bg-border" />
                        <Link 
                            href="/"
                            className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <House className="size-4" />
                            {locale === 'bg' ? 'Към магазина' : 'Back to Store'}
                        </Link>
                    </div>

                    {/* User Section */}
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-sm font-medium">{email}</span>
                            <span className="text-xs text-muted-foreground">
                                {locale === 'bg' ? 'Личен акаунт' : 'Personal Account'}
                            </span>
                        </div>
                        <Avatar className="size-9">
                            <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <form action="/auth/signout" method="post">
                            <Button 
                                variant="ghost" 
                                size="sm"
                                type="submit"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <SignOut className="size-4" />
                                <span className="hidden sm:inline ml-1.5">
                                    {locale === 'bg' ? 'Изход' : 'Sign Out'}
                                </span>
                            </Button>
                        </form>
                    </div>
                </div>
            </header>

            {/* Main Content with Sidebar */}
            <div className="flex-1 flex">
                {/* Sidebar - Desktop */}
                <aside className="hidden lg:block w-64 border-r bg-background shrink-0">
                    <ScrollArea className="h-[calc(100vh-3.5rem)]">
                        <div className="p-4">
                            <div className="flex items-center gap-3 mb-6 px-2">
                                <Avatar className="size-12">
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium text-sm truncate max-w-[160px]">{email}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {locale === 'bg' ? 'Личен акаунт' : 'Personal Account'}
                                    </p>
                                </div>
                            </div>
                            
                            <nav className="space-y-1">
                                <Link
                                    href="/account"
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium hover:bg-muted transition-colors"
                                >
                                    <User className="size-5 text-muted-foreground" />
                                    {t('title')}
                                </Link>
                                
                                <div className="pt-2">
                                    <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        {locale === 'bg' ? 'Управление' : 'Manage'}
                                    </p>
                                </div>
                                
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm hover:bg-muted transition-colors"
                                    >
                                        <item.icon className="size-5 text-muted-foreground" />
                                        {item.title}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </ScrollArea>
                </aside>

                {/* Mobile Bottom Nav */}
                <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
                    <div className="flex items-center justify-around py-2">
                        <Link href="/account" className="flex flex-col items-center gap-1 px-3 py-1.5">
                            <User className="size-5" />
                            <span className="text-xs">{locale === 'bg' ? 'Акаунт' : 'Account'}</span>
                        </Link>
                        <Link href="/account/orders" className="flex flex-col items-center gap-1 px-3 py-1.5">
                            <Package className="size-5" />
                            <span className="text-xs">{locale === 'bg' ? 'Поръчки' : 'Orders'}</span>
                        </Link>
                        <Link href="/account/plans" className="flex flex-col items-center gap-1 px-3 py-1.5">
                            <Crown className="size-5" />
                            <span className="text-xs">{locale === 'bg' ? 'Планове' : 'Plans'}</span>
                        </Link>
                        <Link href="/account/messages" className="flex flex-col items-center gap-1 px-3 py-1.5">
                            <MessageSquare className="size-5" />
                            <span className="text-xs">{locale === 'bg' ? 'Чат' : 'Chat'}</span>
                        </Link>
                        <Link href="/" className="flex flex-col items-center gap-1 px-3 py-1.5">
                            <House className="size-5" />
                            <span className="text-xs">{locale === 'bg' ? 'Магазин' : 'Store'}</span>
                        </Link>
                    </div>
                </nav>

                {/* Page Content */}
                <main className="flex-1 min-w-0 pb-20 lg:pb-0">
                    {children}
                </main>
            </div>
            
            {/* Modal Slot - for intercepted routes */}
            {modal}
        </div>
    );
}
