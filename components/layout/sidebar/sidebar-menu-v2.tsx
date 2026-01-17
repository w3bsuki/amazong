"use client"

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerClose,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    List,
    X,
    SignIn as SignInIcon,
    ChatCircleText,
    Heart,
    Receipt,
    SignOut,
    SpinnerGap,
    ChartLineUp,
    CaretRight,
    UserCircle,
    Gear,
    Package,
    RocketLaunch,
    Plus,
    Lifebuoy,
    MapPin,
    CreditCard,
    SquaresFour,
    User,
    Bell,
    Storefront,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { User as SupabaseUser } from "@supabase/supabase-js"
import { cn } from "@/lib/utils"

/** User listing statistics for the hamburger menu footer */
export interface UserListingStats {
    activeListings: number
    boostedListings: number
}

interface SidebarMenuV2Props {
    user?: SupabaseUser | null
    // Categories no longer needed - we link to /categories instead
    categories?: unknown[]
    triggerClassName?: string
    /** User's listing stats (active + boosted count) - fetched server-side */
    userStats?: UserListingStats
}

// ============================================================================
// Navigation Link Component
// ============================================================================

function NavLink({
    href,
    icon: Icon,
    label,
    onClick,
}: {
    href: string
    icon: React.ComponentType<{ size?: number; weight?: "regular" | "duotone"; className?: string }>
    label: string
    onClick: () => void
}) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="flex items-center gap-4 px-4 h-12 rounded-lg hover:bg-muted/50 active:bg-muted/70 transition-colors"
        >
            <Icon size={24} weight="duotone" className="text-muted-foreground shrink-0" />
            <span className="text-sm font-medium text-foreground flex-1">{label}</span>
            <CaretRight size={18} weight="bold" className="text-muted-foreground/40 shrink-0" />
        </Link>
    )
}

// ============================================================================
// Main Component
// ============================================================================

export function SidebarMenuV2({ user, triggerClassName, userStats }: SidebarMenuV2Props) {
    const [open, setOpen] = useState(false)
    const [isSigningOut, setIsSigningOut] = useState(false)
    const [mounted, setMounted] = useState(false)
    const t = useTranslations('Sidebar')
    const locale = useLocale()

    useEffect(() => {
        setMounted(true)
    }, [])

    const getUserDisplayName = () => {
        if (!user) return null
        if (user.user_metadata?.full_name) return user.user_metadata.full_name
        if (user.user_metadata?.name) return user.user_metadata.name
        if (user.email) return user.email.split('@')[0]
        return null
    }

    const getFirstName = () => {
        const name = getUserDisplayName()
        if (!name) return null
        return name.split(' ')[0]
    }

    const displayName = getUserDisplayName()
    const firstName = getFirstName()
    const isLoggedIn = !!user

    // SSR placeholder - renders same visual appearance without disabled state
    // Button is non-functional until hydration completes, but looks ready
    if (!mounted) {
        return (
            <span
                role="button"
                className={cn(
                    "inline-flex items-center justify-center size-9 -ml-1.5 rounded-md text-header-text hover:bg-header-hover active:bg-header-active transition-colors touch-action-manipulation tap-transparent cursor-pointer",
                    triggerClassName
                )}
                aria-label={locale === "bg" ? "Меню" : "Menu"}
                data-testid="mobile-menu-trigger"
            >
                <List size={22} weight="bold" />
            </span>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen} direction="left" shouldScaleBackground={false}>
            <DrawerTrigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "size-9 -ml-1.5 rounded-md text-header-text hover:bg-header-hover active:bg-header-active transition-colors touch-action-manipulation tap-transparent focus-visible:ring-0 focus-visible:ring-offset-0 [&_svg]:size-[22px]",
                        triggerClassName
                    )}
                    aria-label={locale === "bg" ? "Меню" : "Menu"}
                    data-testid="mobile-menu-trigger"
                >
                    <List weight="bold" />
                </Button>
            </DrawerTrigger>

            <DrawerContent
                className="p-0 bg-background text-foreground gap-0 flex flex-col h-full border-none rounded-none shadow-none sm:max-w-sm"
                style={{ '--initial-transform': 'calc(-100% - 1px)' } as React.CSSProperties}
            >
                <DrawerTitle className="sr-only">
                    {locale === 'bg' ? 'Меню' : 'Menu'}
                </DrawerTitle>
                <DrawerDescription className="sr-only">
                    {locale === 'bg' ? 'Навигационно меню' : 'Navigation menu'}
                </DrawerDescription>

                {/* ================================================================
                    HEADER - Clean app-style header
                ================================================================ */}
                <header className="bg-brand shrink-0">
                    {/* Top row: Account left, utility icons right */}
                    <div className="h-14 px-3 flex items-center">
                        {/* LEFT: Account or Sign In */}
                        {isLoggedIn ? (
                            <Link
                                href="/account"
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-2.5 min-w-0 hover:opacity-90 transition-opacity"
                            >
                                <div className="size-touch shrink-0 rounded-full bg-white/20 flex items-center justify-center">
                                    <UserCircle size={26} weight="fill" className="text-white" />
                                </div>
                                <span className="text-white text-base font-semibold truncate max-w-32">
                                    {firstName || displayName}
                                </span>
                            </Link>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/auth/login"
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-1.5 h-9 px-4 rounded-full bg-white text-brand text-sm font-semibold hover:bg-white/90 transition-colors"
                                >
                                    <SignInIcon size={20} weight="bold" />
                                    <span>{locale === 'bg' ? 'Влез' : 'Sign In'}</span>
                                </Link>
                                <Link
                                    href="/auth/sign-up"
                                    onClick={() => setOpen(false)}
                                    className="h-9 px-4 rounded-full text-white text-sm font-medium hover:bg-white/10 transition-colors flex items-center"
                                >
                                    {locale === 'bg' ? 'Регистрация' : 'Register'}
                                </Link>
                            </div>
                        )}

                        <div className="flex-1" />

                        {/* RIGHT: Settings, Language, Close */}
                        <div className="flex items-center">
                            {/* Settings - only logged in */}
                            {isLoggedIn && (
                                <Link
                                    href="/account/settings"
                                    onClick={() => setOpen(false)}
                                    className="size-touch rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                                    aria-label={locale === 'bg' ? 'Настройки' : 'Settings'}
                                >
                                    <Gear size={24} weight="regular" />
                                </Link>
                            )}

                            {/* Language */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        type="button"
                                        className="size-touch rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                                        aria-label="Language"
                                    >
                                        <Image
                                            src={locale === 'bg' ? "https://flagcdn.com/w40/bg.png" : "https://flagcdn.com/w40/gb.png"}
                                            alt=""
                                            width={24}
                                            height={16}
                                            className="w-6 h-4 rounded-sm object-cover"
                                        />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="min-w-36 rounded-lg p-1">
                                    <DropdownMenuItem asChild>
                                        <Link href="/" locale="en" onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-md">
                                            <Image src="https://flagcdn.com/w40/gb.png" alt="" width={18} height={12} className="h-3 w-auto rounded-sm object-cover" />
                                            <span className="text-sm font-medium">English</span>
                                            {locale === 'en' && <span className="ml-auto text-brand font-bold text-xs">✓</span>}
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/" locale="bg" onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-md">
                                            <Image src="https://flagcdn.com/w40/bg.png" alt="" width={18} height={12} className="h-3 w-auto rounded-sm object-cover" />
                                            <span className="text-sm font-medium">Български</span>
                                            {locale === 'bg' && <span className="ml-auto text-brand font-bold text-xs">✓</span>}
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Close */}
                            <DrawerClose asChild>
                                <button
                                    type="button"
                                    className="size-touch rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                    <X size={24} weight="bold" />
                                    <span className="sr-only">{t('close')}</span>
                                </button>
                            </DrawerClose>
                        </div>
                    </div>
                </header>

                {/* ================================================================
                    MAIN CONTENT - App-focused account hub
                ================================================================ */}
                <div
                    data-vaul-no-drag
                    className="flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar touch-pan-y"
                >
                    {isLoggedIn ? (
                        <>
                            {/* My Listings Section - OLX style */}
                            <section className="px-4 py-4 border-b border-border/50">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                        {locale === 'bg' ? 'Моите обяви' : 'My Listings'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* New Listing CTA */}
                                    <Link
                                        href="/sell"
                                        onClick={() => setOpen(false)}
                                        className="flex items-center justify-center gap-1.5 px-4 h-10 rounded-lg bg-brand text-white font-semibold hover:bg-brand/90 transition-colors"
                                    >
                                        <Plus size={18} weight="bold" className="shrink-0" />
                                        <span className="text-sm">{locale === 'bg' ? 'Нова' : 'New'}</span>
                                    </Link>

                                    {/* Active Listings */}
                                    <Link
                                        href="/account/selling"
                                        onClick={() => setOpen(false)}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 h-10 rounded-lg bg-muted/50 border border-border/60 hover:bg-muted/80 transition-colors"
                                    >
                                        <Package size={18} weight="duotone" className="text-muted-foreground shrink-0" />
                                        <span className="text-sm font-semibold tabular-nums">{userStats?.activeListings ?? 0}</span>
                                        <span className="text-xs text-muted-foreground">{locale === 'bg' ? 'Активни' : 'Active'}</span>
                                    </Link>

                                    {/* Boosted Listings */}
                                    <Link
                                        href="/account/selling"
                                        onClick={() => setOpen(false)}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 h-10 rounded-lg bg-muted/50 border border-border/60 hover:bg-muted/80 transition-colors"
                                    >
                                        <RocketLaunch size={18} weight="duotone" className="text-primary shrink-0" />
                                        <span className="text-sm font-semibold tabular-nums">{userStats?.boostedListings ?? 0}</span>
                                        <span className="text-xs text-muted-foreground">{locale === 'bg' ? 'Буустнати' : 'Boosted'}</span>
                                    </Link>
                                </div>
                            </section>

                            {/* Activity Section */}
                            <section className="px-4 py-3">
                                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                                    {locale === 'bg' ? 'Активност' : 'Activity'}
                                </h3>
                                <nav className="-mx-4">
                                    <NavLink
                                        href="/account/orders"
                                        icon={Receipt}
                                        label={locale === 'bg' ? 'Поръчки' : 'Orders'}
                                        onClick={() => setOpen(false)}
                                    />
                                    <NavLink
                                        href="/account/sales"
                                        icon={ChartLineUp}
                                        label={locale === 'bg' ? 'Продажби' : 'Sales'}
                                        onClick={() => setOpen(false)}
                                    />
                                    <NavLink
                                        href="/wishlist"
                                        icon={Heart}
                                        label={locale === 'bg' ? 'Любими' : 'Favorites'}
                                        onClick={() => setOpen(false)}
                                    />
                                    <NavLink
                                        href="/chat"
                                        icon={ChatCircleText}
                                        label={locale === 'bg' ? 'Съобщения' : 'Messages'}
                                        onClick={() => setOpen(false)}
                                    />
                                    <NavLink
                                        href="/account/notifications"
                                        icon={Bell}
                                        label={locale === 'bg' ? 'Известия' : 'Notifications'}
                                        onClick={() => setOpen(false)}
                                    />
                                </nav>
                            </section>

                            {/* Account Section */}
                            <section className="px-4 py-3 border-t border-border/50">
                                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                                    {locale === 'bg' ? 'Акаунт' : 'Account'}
                                </h3>
                                <nav className="-mx-4">
                                    <NavLink
                                        href="/account/profile"
                                        icon={User}
                                        label={locale === 'bg' ? 'Профил' : 'Profile'}
                                        onClick={() => setOpen(false)}
                                    />
                                    <NavLink
                                        href="/account/selling"
                                        icon={Storefront}
                                        label={locale === 'bg' ? 'Моят магазин' : 'My Store'}
                                        onClick={() => setOpen(false)}
                                    />
                                    <NavLink
                                        href="/account/addresses"
                                        icon={MapPin}
                                        label={locale === 'bg' ? 'Адреси' : 'Addresses'}
                                        onClick={() => setOpen(false)}
                                    />
                                    <NavLink
                                        href="/account/payments"
                                        icon={CreditCard}
                                        label={locale === 'bg' ? 'Плащания' : 'Payments'}
                                        onClick={() => setOpen(false)}
                                    />
                                    <NavLink
                                        href="/account/settings"
                                        icon={Gear}
                                        label={locale === 'bg' ? 'Настройки' : 'Settings'}
                                        onClick={() => setOpen(false)}
                                    />
                                </nav>
                            </section>

                            {/* Browse & Help Section */}
                            <section className="px-4 py-3 border-t border-border/50">
                                <nav className="-mx-4">
                                    <NavLink
                                        href="/categories"
                                        icon={SquaresFour}
                                        label={locale === 'bg' ? 'Разгледай категории' : 'Browse Categories'}
                                        onClick={() => setOpen(false)}
                                    />
                                    <NavLink
                                        href="/customer-service"
                                        icon={Lifebuoy}
                                        label={locale === 'bg' ? 'Помощ' : 'Help'}
                                        onClick={() => setOpen(false)}
                                    />
                                </nav>
                            </section>
                        </>
                    ) : (
                        /* Unauthenticated - Show categories link and info */
                        <section className="px-3 py-4">
                            <div className="text-center py-8">
                                <UserCircle size={48} weight="duotone" className="mx-auto text-muted-foreground/50 mb-3" />
                                <h3 className="text-base font-semibold text-foreground mb-1">
                                    {locale === 'bg' ? 'Влез в акаунта си' : 'Sign in to your account'}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {locale === 'bg' 
                                        ? 'Запазвай любими, проследявай поръчки и продавай' 
                                        : 'Save favorites, track orders, and start selling'}
                                </p>
                                <div className="flex items-center gap-2 justify-center">
                                    <Link
                                        href="/auth/login"
                                        onClick={() => setOpen(false)}
                                        className="flex items-center justify-center gap-2 h-10 px-6 rounded-full bg-brand text-white text-sm font-semibold hover:bg-brand/90 transition-colors"
                                    >
                                        <SignInIcon size={18} weight="bold" />
                                        <span>{locale === 'bg' ? 'Влез' : 'Sign In'}</span>
                                    </Link>
                                    <Link
                                        href="/auth/sign-up"
                                        onClick={() => setOpen(false)}
                                        className="flex items-center justify-center h-10 px-6 rounded-full border border-border text-foreground text-sm font-medium hover:bg-muted/50 transition-colors"
                                    >
                                        {locale === 'bg' ? 'Регистрация' : 'Register'}
                                    </Link>
                                </div>
                            </div>

                            {/* Browse Categories - always visible */}
                            <div className="border-t border-border/50 pt-3 mt-3">
                                <NavLink
                                    href="/categories"
                                    icon={SquaresFour}
                                    label={locale === 'bg' ? 'Разгледай категории' : 'Browse Categories'}
                                    onClick={() => setOpen(false)}
                                />
                            </div>
                        </section>
                    )}
                </div>

                {/* ================================================================
                    FOOTER - Sign Out only (Help moved to Account section)
                ================================================================ */}
                <footer className="shrink-0 border-t border-border/50 pb-safe">
                    {isLoggedIn ? (
                        <div className="flex items-center justify-center">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <button
                                        type="button"
                                        disabled={isSigningOut}
                                        className="flex-1 flex items-center justify-center gap-2 h-12 text-sm text-muted-foreground hover:text-destructive hover:bg-muted/50 transition-colors"
                                    >
                                        {isSigningOut ? (
                                            <SpinnerGap size={18} className="animate-spin" />
                                        ) : (
                                            <SignOut size={18} weight="regular" />
                                        )}
                                        <span>{locale === 'bg' ? 'Изход' : 'Sign Out'}</span>
                                    </button>
                                </AlertDialogTrigger>

                                <AlertDialogContent className="max-w-sm rounded-lg border-border">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-base font-semibold text-foreground">
                                            {locale === "bg" ? "Изход от акаунта" : "Sign out"}
                                        </AlertDialogTitle>
                                        <AlertDialogDescription className="text-sm text-muted-foreground">
                                            {locale === "bg"
                                                ? "Ще излезете от акаунта си."
                                                : "You will be signed out."}
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="flex-row gap-2 sm:flex-row">
                                        <AlertDialogCancel className="flex-1 h-10 text-sm font-medium">
                                            {locale === "bg" ? "Отказ" : "Cancel"}
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            className="flex-1 h-10 text-sm font-medium bg-cta-trust-blue hover:bg-cta-trust-blue-hover text-cta-trust-blue-text"
                                            onClick={() => {
                                                setIsSigningOut(true)
                                                const form = document.createElement('form')
                                                form.method = 'POST'
                                                form.action = '/api/auth/signout'
                                                document.body.appendChild(form)
                                                form.submit()
                                            }}
                                        >
                                            {locale === "bg" ? "Да, излез" : "Yes, sign out"}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    ) : null}
                </footer>
            </DrawerContent>
        </Drawer>
    )
}
