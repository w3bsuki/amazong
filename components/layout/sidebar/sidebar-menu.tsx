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
    List, 
    UserCircle, 
    X, 
    SignIn as SignInIcon, 
    ChatCircleText, 
    Heart,
    Receipt,
    Question,
    SignOut,
    SpinnerGap,
    ChartLineUp,
    Gear,
    CaretDown
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from "@/i18n/routing"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { User as SupabaseUser } from "@supabase/supabase-js"
import { cn } from "@/lib/utils"
import { getCategoryName } from "@/lib/category-display"
import { CategoryCircle } from "@/components/shared/category/category-circle"
import type { CategoryTreeNode } from "@/lib/category-tree"

interface SidebarMenuProps {
    user?: SupabaseUser | null
    categories: CategoryTreeNode[]
    triggerClassName?: string
}

function HamburgerCategoryCircles({
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
    // Mount only when drawer is open to avoid eager fetch on every page.
    if (!open) return null

    return <HamburgerCategoryCirclesInner locale={locale} categories={categories} onNavigate={onNavigate} />
}

function HamburgerCategoryCirclesInner({
    locale,
    categories,
    onNavigate,
}: {
    locale: string
    categories: CategoryTreeNode[]
    onNavigate: () => void
}) {
    const displayCategories = categories.slice(0, 20)

    return (
        <section id="sidebar-categories" className="px-3 py-2.5">
            {categories.length === 0 ? (
                <div className="grid grid-cols-3 gap-y-3 gap-x-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-1.5">
                            <div className="size-[52px] rounded-full bg-muted animate-pulse" />
                            <div className="h-2 w-10 rounded bg-muted animate-pulse" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-y-3 gap-x-2">
                    {displayCategories.map((cat) => {
                        const name = getCategoryName(cat, locale)
                        return (
                            <CategoryCircle
                                key={cat.slug}
                                category={cat}
                                href={`/categories/${cat.slug}`}
                                onClick={onNavigate}
                                circleClassName="size-[52px]"
                                fallbackIconSize={20}
                                fallbackIconWeight="regular"
                                variant="menu"
                                label={name}
                                labelClassName="text-2xs font-medium text-center text-foreground leading-tight line-clamp-2 w-full max-w-none break-words hyphens-auto"
                            />
                        )
                    })}
                </div>
            )}
        </section>
    )
}

export function SidebarMenu({ user, categories, triggerClassName }: SidebarMenuProps) {
    const [open, setOpen] = useState(false)
    const [isSigningOut, setIsSigningOut] = useState(false)
    const [mounted, setMounted] = useState(false)
    const t = useTranslations('Sidebar')
    const locale = useLocale()

    useEffect(() => {
        setMounted(true)
    }, [])

    // Get display name from user metadata or email
    const getUserDisplayName = () => {
        if (!user) return null
        if (user.user_metadata?.full_name) return user.user_metadata.full_name
        if (user.user_metadata?.name) return user.user_metadata.name
        if (user.email) return user.email.split('@')[0]
        return null
    }

    // Get first name for greeting
    const getFirstName = () => {
        const name = getUserDisplayName()
        if (!name) return null
        return name.split(' ')[0]
    }

    const displayName = getUserDisplayName()
    const firstName = getFirstName()
    const isLoggedIn = !!user

    // Vaul (drawer) uses portals + ids that can differ between SSR and the first client render,
    // which causes hydration mismatch console errors in Next.js dev and breaks strict E2E.
    // Render a stable trigger button until mounted, then enable the full drawer UI.
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
            <DrawerContent
                className="p-0 bg-background text-foreground gap-0 flex flex-col h-full data-[vaul-drawer-direction=left]:w-full data-[vaul-drawer-direction=left]:max-w-full data-[vaul-drawer-direction=left]:sm:max-w-full border-none rounded-none shadow-none"
            >
                {/* Header - Compact with auth controls */}
                <div className="relative bg-brand shrink-0">
                    <DrawerTitle className="sr-only">
                        {locale === 'bg' ? 'Навигационно меню' : 'Navigation menu'}
                    </DrawerTitle>
                    <DrawerDescription className="sr-only">
                        {locale === 'bg' ? 'Навигационно меню' : 'Navigation menu'}
                    </DrawerDescription>
                    
                    <div className="h-12 px-2 flex items-center gap-2">
                        {isLoggedIn ? (
                            <>
                                {/* Logged in: Avatar + Name + Account link */}
                                <Link 
                                    href="/account"
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-2 min-w-0 flex-1 h-9 px-1 -ml-1 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    <div className="size-7 shrink-0 rounded-full bg-white/20 flex items-center justify-center">
                                        <UserCircle size={18} weight="fill" className="text-white" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-white text-sm font-semibold truncate leading-tight">
                                            {firstName || displayName}
                                        </p>
                                        <p className="text-white/70 text-2xs leading-tight">
                                            {locale === 'bg' ? 'Виж акаунта' : 'View account'}
                                        </p>
                                    </div>
                                </Link>
                                {/* Settings icon */}
                                <Link 
                                    href="/account/settings"
                                    onClick={() => setOpen(false)}
                                    className="size-9 shrink-0 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                                    aria-label={locale === 'bg' ? 'Настройки' : 'Settings'}
                                >
                                    <Gear size={20} weight="bold" />
                                </Link>
                            </>
                        ) : (
                            <>
                                {/* Logged out: Sign In button prominent */}
                                <Link
                                    href="/auth/login"
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-2 h-8 px-3 rounded-full bg-white text-brand text-sm font-semibold hover:bg-white/90 transition-colors"
                                >
                                    <SignInIcon size={16} weight="bold" />
                                    <span>{locale === 'bg' ? 'Влез' : 'Sign In'}</span>
                                </Link>
                                <Link
                                    href="/auth/sign-up"
                                    onClick={() => setOpen(false)}
                                    className="flex items-center h-8 px-3 rounded-full text-white/90 text-sm font-medium hover:bg-white/10 transition-colors"
                                >
                                    <span>{locale === 'bg' ? 'Регистрация' : 'Register'}</span>
                                </Link>
                                <div className="flex-1" />
                            </>
                        )}
                        <DrawerClose asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-9 shrink-0 text-white/80 hover:text-white hover:bg-white/10 rounded-full"
                            >
                                <X size={20} weight="bold" />
                                <span className="sr-only">{t('close')}</span>
                            </Button>
                        </DrawerClose>
                    </div>
                </div>

                {/* Quick Actions - Only when logged in */}
                {isLoggedIn && (
                    <div className="px-3 py-2.5 border-b border-border/40 shrink-0">
                        <div className="grid grid-cols-4 gap-2">
                            <Link
                                href="/account/orders"
                                onClick={() => setOpen(false)}
                                className="flex flex-col items-center gap-1.5 group"
                            >
                                <div className="size-10 rounded-lg bg-secondary text-foreground flex items-center justify-center transition-colors group-hover:bg-secondary/80">
                                    <Receipt size={20} weight="regular" />
                                </div>
                                <span className="text-2xs font-medium text-foreground/80 group-hover:text-foreground transition-colors">{locale === 'bg' ? 'Поръчки' : 'Orders'}</span>
                            </Link>
                            <Link
                                href="/account/sales"
                                onClick={() => setOpen(false)}
                                className="flex flex-col items-center gap-1.5 group"
                            >
                                <div className="size-10 rounded-lg bg-secondary text-foreground flex items-center justify-center transition-colors group-hover:bg-secondary/80">
                                    <ChartLineUp size={20} weight="regular" />
                                </div>
                                <span className="text-2xs font-medium text-foreground/80 group-hover:text-foreground transition-colors">{locale === 'bg' ? 'Продажби' : 'Sales'}</span>
                            </Link>
                            <Link
                                href="/wishlist"
                                onClick={() => setOpen(false)}
                                className="flex flex-col items-center gap-1.5 group"
                            >
                                <div className="size-10 rounded-lg bg-secondary text-foreground flex items-center justify-center transition-colors group-hover:bg-secondary/80">
                                    <Heart size={20} weight="regular" />
                                </div>
                                <span className="text-2xs font-medium text-foreground/80 group-hover:text-foreground transition-colors">{locale === 'bg' ? 'Любими' : 'Saved'}</span>
                            </Link>
                            <Link
                                href="/chat"
                                onClick={() => setOpen(false)}
                                className="flex flex-col items-center gap-1.5 group"
                            >
                                <div className="size-10 rounded-lg bg-secondary text-foreground flex items-center justify-center transition-colors group-hover:bg-secondary/80">
                                    <ChatCircleText size={20} weight="regular" />
                                </div>
                                <span className="text-2xs font-medium text-foreground/80 group-hover:text-foreground transition-colors">{locale === 'bg' ? 'Чат' : 'Chat'}</span>
                            </Link>
                        </div>
                    </div>
                )}

                {/* Main content - Categories scroll area */}
                <div
                    data-vaul-no-drag
                    className="flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar touch-pan-y [-webkit-overflow-scrolling:touch]"
                >
                    <HamburgerCategoryCircles
                        open={open}
                        locale={locale}
                        categories={categories}
                        onNavigate={() => setOpen(false)}
                    />
                </div>

                {/* Compact Footer - Help | Language | Sign Out */}
                <div className="shrink-0 border-t border-border/50 bg-muted/30 pb-safe">
                    <div className="h-12 px-3 flex items-center gap-1">
                        {/* Help */}
                        <Link
                            href="/customer-service"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                        >
                            <Question size={18} weight="regular" />
                            <span>{locale === 'bg' ? 'Помощ' : 'Help'}</span>
                        </Link>

                        {/* Language Dropdown - Compact */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button 
                                    type="button"
                                    className="flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                                >
                                    <Image
                                        src={locale === 'bg' ? "https://flagcdn.com/w40/bg.png" : "https://flagcdn.com/w40/gb.png"}
                                        alt={locale === 'bg' ? 'BG' : 'EN'}
                                        width={18}
                                        height={12}
                                        sizes="18px"
                                        className="w-[18px] h-3 rounded-sm object-cover"
                                    />
                                    <span>{locale === 'bg' ? 'BG' : 'EN'}</span>
                                    <CaretDown size={12} weight="bold" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="center" className="min-w-[140px] rounded-lg p-1 border border-border/50">
                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/"
                                        locale="en"
                                        onClick={() => setOpen(false)}
                                        className="flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-md"
                                    >
                                        <Image
                                            src="https://flagcdn.com/w40/gb.png"
                                            alt="EN"
                                            width={18}
                                            height={12}
                                            sizes="18px"
                                            className="w-[18px] h-3 rounded-sm object-cover"
                                        />
                                        <span className="text-sm font-medium">English</span>
                                        {locale === 'en' && <span className="ml-auto text-brand font-bold text-xs">✓</span>}
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/"
                                        locale="bg"
                                        onClick={() => setOpen(false)}
                                        className="flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-md"
                                    >
                                        <Image
                                            src="https://flagcdn.com/w40/bg.png"
                                            alt="BG"
                                            width={18}
                                            height={12}
                                            sizes="18px"
                                            className="w-[18px] h-3 rounded-sm object-cover"
                                        />
                                        <span className="text-sm font-medium">Български</span>
                                        {locale === 'bg' && <span className="ml-auto text-brand font-bold text-xs">✓</span>}
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="flex-1" />

                        {/* Sign Out - Only when logged in */}
                        {isLoggedIn && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <button
                                        type="button"
                                        disabled={isSigningOut}
                                        className="flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
                                    >
                                        {isSigningOut ? (
                                            <SpinnerGap size={16} className="animate-spin" />
                                        ) : (
                                            <SignOut size={16} weight="regular" />
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
                                                ? "Ще излезете от акаунта си на това устройство."
                                                : "You will be signed out on this device."}
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
                        )}
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
