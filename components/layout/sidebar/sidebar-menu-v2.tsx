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
    Question,
    Gear,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { User as SupabaseUser } from "@supabase/supabase-js"
import { cn } from "@/lib/utils"
import { getCategoryName } from "@/lib/category-display"
import { CategoryCircle } from "@/components/shared/category/category-circle"
import type { CategoryTreeNode } from "@/lib/category-tree"

interface SidebarMenuV2Props {
    user?: SupabaseUser | null
    categories: CategoryTreeNode[]
    triggerClassName?: string
}

// ============================================================================
// Category Grid - Lazy mount when drawer opens
// ============================================================================

function CategoryGrid({
    open,
    locale,
    categories,
    onNavigate,
}: {
    open: boolean
    locale: string
    categories: CategoryTreeNode[]
    onNavigate: () => void
}) {
    if (!open) return null
    return <CategoryGridInner locale={locale} categories={categories} onNavigate={onNavigate} />
}

function CategoryGridInner({
    locale,
    categories,
    onNavigate,
}: {
    locale: string
    categories: CategoryTreeNode[]
    onNavigate: () => void
}) {
    if (categories.length === 0) {
        return (
            <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5">
                        <div className="size-14 rounded-full bg-muted animate-pulse" />
                        <div className="h-2.5 w-10 rounded bg-muted animate-pulse" />
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-4 gap-y-4 gap-x-2">
            {categories.map((cat) => {
                const name = getCategoryName(cat, locale)
                return (
                    <CategoryCircle
                        key={cat.slug}
                        category={cat}
                        href={`/categories/${cat.slug}`}
                        onClick={onNavigate}
                        circleClassName="size-16"
                        fallbackIconSize={28}
                        fallbackIconWeight="regular"
                        variant="menu"
                        label={name}
                        labelClassName="text-2xs font-medium text-center text-foreground leading-tight line-clamp-2 w-full"
                    />
                )
            })}
        </div>
    )
}

// ============================================================================
// Main Component
// ============================================================================

export function SidebarMenuV2({ user, categories, triggerClassName }: SidebarMenuV2Props) {
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

    // SSR placeholder
    if (!mounted) {
        return (
            <Button
                type="button"
                variant="ghost"
                size="icon-lg"
                className={cn(
                    "rounded-md text-header-text hover:bg-header-hover active:bg-header-active transition-colors touch-action-manipulation tap-transparent focus-visible:ring-0 focus-visible:ring-offset-0",
                    triggerClassName
                )}
                aria-label={locale === "bg" ? "Меню" : "Menu"}
                data-testid="mobile-menu-trigger"
                disabled
                aria-disabled="true"
            >
                <List size={28} weight="bold" />
            </Button>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen} direction="left">
            <DrawerTrigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-lg"
                    className={cn(
                        "rounded-md text-header-text hover:bg-header-hover active:bg-header-active transition-colors touch-action-manipulation tap-transparent focus-visible:ring-0 focus-visible:ring-offset-0",
                        triggerClassName
                    )}
                    aria-label={locale === "bg" ? "Меню" : "Menu"}
                    data-testid="mobile-menu-trigger"
                >
                    <List size={28} weight="bold" />
                </Button>
            </DrawerTrigger>

            <DrawerContent className="p-0 bg-background text-foreground gap-0 flex flex-col h-full data-[vaul-drawer-direction=left]:w-full data-[vaul-drawer-direction=left]:max-w-full data-[vaul-drawer-direction=left]:sm:max-w-sm border-none rounded-none shadow-none">
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
                                <div className="size-9 shrink-0 rounded-full bg-white/20 flex items-center justify-center">
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

                        {/* RIGHT: Help, Settings (if logged in), Language, Close */}
                        <div className="flex items-center">
                            {/* Help */}
                            <Link
                                href="/customer-service"
                                onClick={() => setOpen(false)}
                                className="size-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                                aria-label={locale === 'bg' ? 'Помощ' : 'Help'}
                            >
                                <Question size={24} weight="regular" />
                            </Link>

                            {/* Settings - only logged in */}
                            {isLoggedIn && (
                                <Link
                                    href="/account/settings"
                                    onClick={() => setOpen(false)}
                                    className="size-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
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
                                        className="size-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
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
                                    className="size-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                    <X size={24} weight="bold" />
                                    <span className="sr-only">{t('close')}</span>
                                </button>
                            </DrawerClose>
                        </div>
                    </div>

                    {/* Quick Actions row - in blue header */}
                    {isLoggedIn && (
                        <div className="mx-3 mb-3 p-3 rounded-xl bg-white/10 border border-white/20">
                            <div className="grid grid-cols-4 gap-1">
                                {[
                                    { href: "/account/orders", icon: Receipt, label: locale === 'bg' ? 'Поръчки' : 'Orders' },
                                    { href: "/account/sales", icon: ChartLineUp, label: locale === 'bg' ? 'Продажби' : 'Sales' },
                                    { href: "/wishlist", icon: Heart, label: locale === 'bg' ? 'Любими' : 'Saved' },
                                    { href: "/chat", icon: ChatCircleText, label: locale === 'bg' ? 'Чат' : 'Chat' },
                                ].map(({ href, icon: Icon, label }) => (
                                    <Link
                                        key={href}
                                        href={href}
                                        onClick={() => setOpen(false)}
                                        className="flex flex-col items-center gap-1 py-2 rounded-lg hover:bg-white/10 group active:scale-95 transition-all"
                                    >
                                        <Icon size={28} weight="regular" className="text-white" />
                                        <span className="text-xs font-medium text-white/90">
                                            {label}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </header>

                {/* ================================================================
                    CATEGORIES - Main scrollable area
                ================================================================ */}
                <div
                    data-vaul-no-drag
                    className="flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar touch-pan-y"
                >
                    <section className="px-3 py-3">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                {locale === 'bg' ? 'Категории' : 'Categories'}
                            </h2>
                            <Link
                                href="/categories"
                                onClick={() => setOpen(false)}
                                className="text-xs text-primary font-medium flex items-center gap-0.5 hover:underline"
                            >
                                {locale === 'bg' ? 'Виж всички' : 'See all'}
                                <CaretRight size={12} weight="bold" />
                            </Link>
                        </div>
                        <CategoryGrid
                            open={open}
                            locale={locale}
                            categories={categories}
                            onNavigate={() => setOpen(false)}
                        />
                    </section>
                </div>

                {/* ================================================================
                    FOOTER - Just Sign Out (minimal)
                ================================================================ */}
                {isLoggedIn && (
                    <footer className="shrink-0 border-t border-border/50 pb-safe">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <button
                                    type="button"
                                    disabled={isSigningOut}
                                    className="flex items-center justify-center gap-2 w-full h-12 text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-muted/50 transition-colors"
                                >
                                    {isSigningOut ? (
                                        <SpinnerGap size={16} className="animate-spin" />
                                    ) : (
                                        <SignOut size={16} weight="regular" />
                                    )}
                                    <span>{locale === 'bg' ? 'Изход от акаунта' : 'Sign Out'}</span>
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
                    </footer>
                )}
            </DrawerContent>
        </Drawer>
    )
}
