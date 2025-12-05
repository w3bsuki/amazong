"use client"

import Link from "next/link";
import { 
    Package, 
    CreditCard, 
    Lock, 
    MapPin, 
    User, 
    ChatCircle as MessageSquare,
    House,
    Crown,
    Storefront
} from "@phosphor-icons/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SignOutButton } from "@/components/sign-out-button";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface AccountLayoutContentProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export function AccountLayoutContent({ children, modal }: AccountLayoutContentProps) {
    const locale = useLocale();
    const [email, setEmail] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function getUser() {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.email) {
                setEmail(user.email);
            }
            setIsLoading(false);
        }
        getUser();
    }, []);

    const initials = email ? email.substring(0, 2).toUpperCase() : "??";

    const menuItems = [
        {
            title: locale === 'bg' ? 'Поръчки' : 'Orders',
            icon: Package,
            href: "/account/orders",
        },
        {
            title: locale === 'bg' ? 'Планове' : 'Plans',
            icon: Crown,
            href: "/account/plans",
        },
        {
            title: locale === 'bg' ? 'Сигурност' : 'Security',
            icon: Lock,
            href: "/account/security",
        },
        {
            title: locale === 'bg' ? 'Адреси' : 'Addresses',
            icon: MapPin,
            href: "/account/addresses",
        },
        {
            title: locale === 'bg' ? 'Плащания' : 'Payments',
            icon: CreditCard,
            href: "/account/payments",
        },
        {
            title: locale === 'bg' ? 'Съобщения' : 'Messages',
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
                            <span className="text-sm font-medium">{isLoading ? '...' : email}</span>
                            <span className="text-xs text-muted-foreground">
                                {locale === 'bg' ? 'Личен акаунт' : 'Personal Account'}
                            </span>
                        </div>
                        <Avatar className="size-9">
                            <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <SignOutButton 
                            locale={locale}
                            className="text-muted-foreground hover:text-foreground"
                            labelClassName="hidden sm:inline ml-1.5"
                        />
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
                                    <p className="font-medium text-sm truncate max-w-[160px]">{isLoading ? '...' : email}</p>
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
                                    {locale === 'bg' ? 'Акаунт' : 'Account'}
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
