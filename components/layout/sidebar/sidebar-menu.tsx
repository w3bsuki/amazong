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
import { IconButton } from "@/components/ui/icon-button"
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

export interface SidebarMenuProps {
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
    icon: React.ComponentType<{ size?: number; weight?: "regular" | "duotone" | "fill"; className?: string }>
    label: string
    onClick: () => void
}) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="flex min-h-(--control-primary) items-center gap-4 px-4 rounded-lg transition-colors hover:bg-hover active:bg-active"
        >
            <Icon size={22} weight="regular" className="text-muted-foreground shrink-0" />
            <span className="text-sm font-medium text-foreground flex-1">{label}</span>
            <CaretRight size={16} weight="bold" className="text-muted-foreground shrink-0" />
        </Link>
    )
}

// ============================================================================
// Main Component
// ============================================================================

export function SidebarMenu({ user, triggerClassName, userStats }: SidebarMenuProps) {
    const [open, setOpen] = useState(false)
    const [isSigningOut, setIsSigningOut] = useState(false)
    const [mounted, setMounted] = useState(false)
    const t = useTranslations('Sidebar')
    const tCommon = useTranslations('Common')
    const tNav = useTranslations('Navigation')
    const tAccountDrawer = useTranslations('AccountDrawer')
    const tNavUser = useTranslations('NavUser')
    const tLocaleSwitcher = useTranslations('LocaleSwitcher')
    const tMenu = useTranslations('SidebarMenu')
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
                    "inline-flex size-(--control-default) items-center justify-center rounded-lg text-foreground transition-colors touch-manipulation tap-transparent cursor-pointer hover:bg-hover active:bg-active [&_svg]:size-6",
                    triggerClassName
                )}
                aria-label={t("title")}
                data-testid="mobile-menu-trigger"
            >
                <List weight="bold" />
            </span>
        )
    }

    return (
        <Drawer
            open={open}
            onOpenChange={setOpen}
            direction="left"
            shouldScaleBackground={false}
        >
            <DrawerTrigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "size-(--control-default) rounded-lg text-foreground transition-colors touch-manipulation tap-transparent hover:bg-hover active:bg-active focus-visible:ring-0 focus-visible:ring-offset-0 [&_svg]:size-6",
                        triggerClassName
                    )}
                    aria-label={t("title")}
                    data-testid="mobile-menu-trigger"
                >
                    <List weight="bold" />
                </Button>
            </DrawerTrigger>

            <DrawerContent
                className="p-0 bg-background text-foreground gap-0 flex flex-col h-full shadow-none"
            >
                <DrawerTitle className="sr-only">
                    {t("title")}
                </DrawerTitle>
                <DrawerDescription className="sr-only">
                    {t("mobileDescription")}
                </DrawerDescription>

                {/* ================================================================
                    HEADER - Clean app-style header
                ================================================================ */}
                <header className="shrink-0 border-b border-border-subtle bg-background">
                    {/* Top row: Account left, utility icons right */}
                    <div className="h-14 px-3 flex items-center">
                        {/* LEFT: Account or Sign In */}
                        {isLoggedIn ? (
                            <Link
                                href="/account"
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-2.5 min-w-0 hover:opacity-90 transition-opacity"
                            >
                                <div className="size-touch shrink-0 rounded-full bg-selected flex items-center justify-center">
                                    <UserCircle size={26} weight="fill" className="text-primary" />
                                </div>
                                <span className="text-foreground text-base font-semibold truncate max-w-32">
                                    {firstName || displayName}
                                </span>
                            </Link>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button asChild size="sm" variant="cta">
                                    <Link href="/auth/login" onClick={() => setOpen(false)} className="gap-1.5">
                                        <SignInIcon size={20} weight="bold" />
                                        <span>{t("signIn")}</span>
                                    </Link>
                                </Button>
                                <Button asChild size="sm" variant="outline">
                                    <Link href="/auth/sign-up" onClick={() => setOpen(false)}>
                                        {tNav("register")}
                                    </Link>
                                </Button>
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
                                    className="size-touch rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                    aria-label={tAccountDrawer("settings")}
                                >
                                    <Gear size={22} weight="regular" />
                                </Link>
                            )}

                            {/* Language */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        type="button"
                                        className="size-touch rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-hover transition-colors"
                                        aria-label={tLocaleSwitcher('label')}
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
                                <DropdownMenuContent align="end" className="min-w-36 rounded-2xl p-1">
                                    <DropdownMenuItem asChild>
                                        <Link href="/" locale="en" onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-xl">
                                            <Image src="https://flagcdn.com/w40/gb.png" alt="" width={18} height={12} className="h-3 w-auto rounded-sm object-cover" />
                                            <span className="text-sm font-medium">{tLocaleSwitcher('english')}</span>
                                            {locale === 'en' && <span className="ml-auto text-primary font-bold text-xs">✓</span>}
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/" locale="bg" onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-xl">
                                            <Image src="https://flagcdn.com/w40/bg.png" alt="" width={18} height={12} className="h-3 w-auto rounded-sm object-cover" />
                                            <span className="text-sm font-medium">{tLocaleSwitcher('bulgarian')}</span>
                                            {locale === 'bg' && <span className="ml-auto text-primary font-bold text-xs">✓</span>}
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Close */}
                            <DrawerClose asChild>
                                <IconButton
                                    aria-label={t('close')}
                                    variant="ghost"
                                    className="text-foreground hover:bg-muted active:bg-active"
                                >
                                    <X size={22} weight="bold" />
                                </IconButton>
                            </DrawerClose>
                        </div>
                    </div>
                </header>

                {/* ================================================================
                    MAIN CONTENT - App-focused account hub
                ================================================================ */}
                <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar touch-pan-y">
                    {isLoggedIn ? (
                        <>
                            {/* My Listings Section - OLX style */}
                            <section className="border-b border-border-subtle px-4 py-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                        {tAccountDrawer("myListings")}
                                    </span>
                                </div>
                                {/* New Listing CTA - full width */}
                                <Link
                                    href="/sell"
                                    onClick={() => setOpen(false)}
                                    className="flex items-center justify-center gap-1.5 w-full h-touch rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-interactive-hover transition-colors mb-2"
                                >
                                    <Plus size={18} weight="bold" />
                                    <span className="text-sm">{tMenu("newListing")}</span>
                                </Link>
                                {/* Stats row - 2 column grid */}
                                <div className="grid grid-cols-2 gap-2">
                                    <Link
                                        href="/account/selling"
                                        onClick={() => setOpen(false)}
                                        className="flex items-center justify-center gap-1.5 h-touch rounded-lg bg-surface-subtle border border-border hover:bg-hover hover:border-hover-border transition-colors"
                                    >
                                        <Package size={18} weight="duotone" className="text-primary" />
                                        <span className="text-sm font-semibold tabular-nums">{userStats?.activeListings ?? 0}</span>
                                        <span className="text-xs text-muted-foreground">{tMenu("active")}</span>
                                    </Link>
                                    <Link
                                        href="/account/selling"
                                        onClick={() => setOpen(false)}
                                        className="flex items-center justify-center gap-1.5 h-touch rounded-lg bg-surface-subtle border border-border hover:bg-hover hover:border-hover-border transition-colors"
                                    >
                                        <RocketLaunch size={18} weight="duotone" className="text-primary" />
                                        <span className="text-sm font-semibold tabular-nums">{userStats?.boostedListings ?? 0}</span>
                                        <span className="text-xs text-muted-foreground">{tMenu("boosted")}</span>
                                    </Link>
                                </div>
                            </section>

                            {/* Activity Section */}
                            <section className="px-4 py-3">
                                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                                    {tMenu("activity")}
                                </h3>
                                <nav className="-mx-4">
                                    <NavLink
                                        href="/account/orders"
                                        icon={Receipt}
                                        label={tAccountDrawer("orders")}
                                        onClick={() => setOpen(false)}
                                    />
                                    <NavLink
                                        href="/account/sales"
                                        icon={ChartLineUp}
                                        label={tMenu("sales")}
                                        onClick={() => setOpen(false)}
                                    />
                                    <NavLink
                                        href="/wishlist"
                                        icon={Heart}
                                        label={tNav("wishlist")}
                                        onClick={() => setOpen(false)}
                                    />
                                    <NavLink
                                        href="/chat"
                                        icon={ChatCircleText}
                                        label={t("messages")}
                                        onClick={() => setOpen(false)}
                                    />
                                    <NavLink
                                        href="/account/notifications"
                                        icon={Bell}
                                        label={tNavUser("notifications")}
                                        onClick={() => setOpen(false)}
                                    />
                                </nav>
                            </section>

                            {/* Account Section */}
                            <section className="border-t border-border-subtle px-4 py-3">
                                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                                    {tAccountDrawer("title")}
                                </h3>
                                <nav className="-mx-4">
                                    <NavLink
                                        href="/account/profile"
                                        icon={User}
                                        label={tMenu("profile")}
                                        onClick={() => setOpen(false)}
                                    />
                                    <NavLink
                                        href="/account/selling"
                                        icon={Storefront}
                                        label={tMenu("myStore")}
                                        onClick={() => setOpen(false)}
                                    />
                                    <NavLink
                                        href="/account/addresses"
                                        icon={MapPin}
                                        label={tMenu("addresses")}
                                        onClick={() => setOpen(false)}
                                    />
                                    <NavLink
                                        href="/account/payments"
                                        icon={CreditCard}
                                        label={tMenu("payments")}
                                        onClick={() => setOpen(false)}
                                    />
                                    <NavLink
                                        href="/account/settings"
                                        icon={Gear}
                                        label={tAccountDrawer("settings")}
                                        onClick={() => setOpen(false)}
                                    />
                                </nav>
                            </section>

                            {/* Browse & Help Section */}
                            <section className="border-t border-border-subtle px-4 py-3">
                                <nav className="-mx-4">
                                    <NavLink
                                        href="/categories"
                                        icon={SquaresFour}
                                        label={tMenu("browseCategories")}
                                        onClick={() => setOpen(false)}
                                    />
                                    <NavLink
                                        href="/customer-service"
                                        icon={Lifebuoy}
                                        label={t("customerService")}
                                        onClick={() => setOpen(false)}
                                    />
                                </nav>
                            </section>
                        </>
                    ) : (
                        /* Unauthenticated - Show categories link and info */
                        <section className="px-3 py-4">
                            <div className="text-center py-8">
                                <UserCircle size={48} weight="duotone" className="mx-auto text-muted-foreground mb-3" />
                                <h3 className="text-base font-semibold text-foreground mb-1">
                                    {tAccountDrawer("signInPrompt")}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {tMenu("signInBenefits")}
                                </p>
                                <div className="flex items-center gap-2 justify-center">
                                    <Link
                                        href="/auth/login"
                                        onClick={() => setOpen(false)}
                                        className="flex min-h-(--control-default) items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-interactive-hover"
                                    >
                                        <SignInIcon size={18} weight="bold" />
                                        <span>{t("signIn")}</span>
                                    </Link>
                                    <Link
                                        href="/auth/sign-up"
                                        onClick={() => setOpen(false)}
                                        className="flex min-h-(--control-default) items-center justify-center rounded-full border border-selected-border px-6 text-sm font-medium text-primary transition-colors hover:border-hover-border hover:bg-hover"
                                    >
                                        {tNav("register")}
                                    </Link>
                                </div>
                            </div>

                            {/* Browse Categories - always visible */}
                            <div className="mt-3 border-t border-border-subtle pt-3">
                                <NavLink
                                    href="/categories"
                                    icon={SquaresFour}
                                    label={tMenu("browseCategories")}
                                    onClick={() => setOpen(false)}
                                />
                            </div>
                        </section>
                    )}
                </div>

                {/* ================================================================
                    FOOTER - Sign Out only (Help moved to Account section)
                ================================================================ */}
                <footer className="shrink-0 border-t border-border-subtle pb-safe">
                    {isLoggedIn ? (
                        <div className="flex items-center justify-center">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <button
                                        type="button"
                                        disabled={isSigningOut}
                                        className="flex flex-1 min-h-(--control-primary) items-center justify-center gap-2 text-sm text-muted-foreground transition-colors hover:bg-hover hover:text-destructive active:bg-active"
                                    >
                                        {isSigningOut ? (
                                            <SpinnerGap size={18} className="animate-spin" />
                                        ) : (
                                            <SignOut size={18} weight="regular" />
                                        )}
                                        <span>{tNavUser("logOut")}</span>
                                    </button>
                                </AlertDialogTrigger>

                                <AlertDialogContent className="max-w-sm rounded-lg border-border">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-base font-semibold text-foreground">
                                            {tMenu("signOutTitle")}
                                        </AlertDialogTitle>
                                        <AlertDialogDescription className="text-sm text-muted-foreground">
                                            {tMenu("signOutDescription")}
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="flex-row gap-2 sm:flex-row">
                                        <AlertDialogCancel className="h-(--control-default) flex-1 text-sm font-medium">
                                            {tCommon("cancel")}
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            className="h-(--control-default) flex-1 text-sm font-medium"
                                            onClick={() => {
                                                setIsSigningOut(true)
                                                const form = document.createElement('form')
                                                form.method = 'POST'
                                                form.action = '/api/auth/sign-out'
                                                document.body.appendChild(form)
                                                form.submit()
                                            }}
                                        >
                                            {tMenu("confirmSignOut")}
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
