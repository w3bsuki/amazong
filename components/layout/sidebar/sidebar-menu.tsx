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
    Globe,
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
                <div className="grid grid-cols-4 gap-y-3 gap-x-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-1.5">
                            <div className="size-[52px] rounded-full bg-muted animate-pulse" />
                            <div className="h-2 w-10 rounded bg-muted animate-pulse" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-4 gap-y-3 gap-x-2">
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
                                labelClassName="text-2xs font-medium text-center text-foreground leading-tight line-clamp-2 max-w-16"
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
                    "rounded-md text-header-text hover:bg-header-hover active:bg-header-active transition-colors touch-action-manipulation tap-transparent",
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
                        "rounded-md text-header-text hover:bg-header-hover active:bg-header-active transition-colors touch-action-manipulation tap-transparent",
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
                {/* Header - Matches main app header h-10 */}
                <div className="relative bg-brand shrink-0">
                    <DrawerTitle className="sr-only">
                        {locale === 'bg' ? 'Навигационно меню' : 'Navigation menu'}
                    </DrawerTitle>
                    <DrawerDescription className="sr-only">
                        {locale === 'bg' ? 'Навигационно меню' : 'Navigation menu'}
                    </DrawerDescription>
                    
                    {/* Profile row - exactly h-10 like main header */}
                    <div className="h-10 px-2 flex items-center gap-2">
                        <div className="size-7 shrink-0 rounded-full bg-white/20 flex items-center justify-center">
                            <UserCircle size={20} weight="fill" className="text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                            {isLoggedIn ? (
                                <p className="text-white text-sm font-semibold truncate leading-tight">
                                    {locale === 'bg' ? 'Здравей, ' : 'Hello, '}{firstName || displayName}
                                </p>
                            ) : (
                                <p className="text-white text-sm font-semibold leading-tight">
                                    {locale === 'bg' ? 'Здравей!' : 'Hello!'}
                                </p>
                            )}
                        </div>
                        <DrawerClose asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-8 shrink-0 text-white/80 hover:text-white hover:bg-white/10 rounded-full"
                            >
                                <X size={20} weight="bold" />
                                <span className="sr-only">{t('close')}</span>
                            </Button>
                        </DrawerClose>
                    </div>
                </div>
                
                {/* Account & Settings row - in white section like search bar */}
                {isLoggedIn && (
                    <div className="px-2 py-2 flex items-center gap-2 border-b border-border/40 shrink-0">
                        <Link 
                            href="/account"
                            onClick={() => setOpen(false)}
                            className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg bg-brand text-white text-xs font-semibold transition-colors hover:bg-brand-dark"
                        >
                            <UserCircle size={16} weight="bold" />
                            {locale === 'bg' ? 'Моят акаунт' : 'My account'}
                        </Link>
                        <Link 
                            href="/account/settings"
                            onClick={() => setOpen(false)}
                            className="flex items-center justify-center size-9 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
                            aria-label={locale === 'bg' ? 'Настройки' : 'Settings'}
                        >
                            <Gear size={18} weight="bold" />
                        </Link>
                    </div>
                )}

                {/* Quick Actions - Only when logged in, BEFORE categories */}
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

                {/* Footer actions */}
                <div className="shrink-0 border-t border-border/50 bg-muted/30 pb-safe">
                    <div className="px-3 py-2.5 space-y-2">
                        {/* Locale Selector - Prominent position */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button 
                                    type="button"
                                    className="w-full flex items-center justify-between gap-2 h-10 px-3 rounded-lg bg-background border border-border/50 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Globe size={18} weight="regular" className="text-muted-foreground" />
                                        <div className="flex items-center gap-2">
                                            <Image
                                                src={locale === 'bg' ? "https://flagcdn.com/w40/bg.png" : "https://flagcdn.com/w40/gb.png"}
                                                alt={locale === 'bg' ? 'BG' : 'EN'}
                                                width={20}
                                                height={14}
                                                sizes="20px"
                                                className="w-5 h-3.5 rounded-sm object-cover"
                                            />
                                            <span className="text-sm font-medium text-foreground">
                                                {locale === 'bg' ? 'Български' : 'English'}
                                            </span>
                                        </div>
                                    </div>
                                    <CaretDown size={14} weight="bold" className="text-muted-foreground" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-[calc(85vw-24px)] max-w-[276px] rounded-lg p-1 border border-border/50">
                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/"
                                        locale="en"
                                        onClick={() => setOpen(false)}
                                        className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-md"
                                    >
                                        <Image
                                            src="https://flagcdn.com/w40/gb.png"
                                            alt="EN"
                                            width={20}
                                            height={14}
                                            sizes="20px"
                                            className="w-5 h-3.5 rounded-sm object-cover"
                                        />
                                        <span className="text-sm font-medium">English</span>
                                        {locale === 'en' && <span className="ml-auto text-brand font-bold text-sm">✓</span>}
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/"
                                        locale="bg"
                                        onClick={() => setOpen(false)}
                                        className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-md"
                                    >
                                        <Image
                                            src="https://flagcdn.com/w40/bg.png"
                                            alt="BG"
                                            width={20}
                                            height={14}
                                            sizes="20px"
                                            className="w-5 h-3.5 rounded-sm object-cover"
                                        />
                                        <span className="text-sm font-medium">Български</span>
                                        {locale === 'bg' && <span className="ml-auto text-brand font-bold text-sm">✓</span>}
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {isLoggedIn ? (
                            <div className="grid grid-cols-2 gap-2">
                                <Link
                                    href="/customer-service"
                                    onClick={() => setOpen(false)}
                                    className="flex items-center justify-center gap-2 h-10 rounded-lg bg-background border border-border/50 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                                >
                                    <Question size={18} weight="regular" className="text-muted-foreground" />
                                    <span>{locale === 'bg' ? 'Помощ' : 'Help'}</span>
                                </Link>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <button
                                            type="button"
                                            disabled={isSigningOut}
                                            className="flex items-center justify-center gap-2 h-10 rounded-lg bg-destructive/5 border border-destructive/20 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                                        >
                                            {isSigningOut ? (
                                                <SpinnerGap size={18} className="animate-spin" />
                                            ) : (
                                                <SignOut size={18} weight="regular" />
                                            )}
                                            <span>{locale === 'bg' ? 'Изход' : 'Sign Out'}</span>
                                        </button>
                                    </AlertDialogTrigger>

                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                {locale === "bg" ? "Сигурни ли сте?" : "Are you sure?"}
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                {locale === "bg"
                                                    ? "Ще излезете от акаунта си на това устройство."
                                                    : "You will be signed out on this device."}
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                {locale === "bg" ? "Отказ" : "Cancel"}
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => {
                                                    setIsSigningOut(true)
                                                    // Create and submit hidden form
                                                    const form = document.createElement('form')
                                                    form.method = 'POST'
                                                    form.action = '/api/auth/signout'
                                                    document.body.appendChild(form)
                                                    form.submit()
                                                }}
                                            >
                                                {locale === "bg" ? "Изход" : "Sign Out"}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Link
                                    href="/auth/login"
                                    onClick={() => setOpen(false)}
                                    className="flex items-center justify-center gap-2 h-10 w-full rounded-lg bg-brand text-white text-sm font-bold hover:bg-brand-dark transition-colors"
                                >
                                    <SignInIcon size={18} weight="bold" />
                                    <span>{locale === 'bg' ? 'Влез' : 'Sign In'}</span>
                                </Link>
                                <div className="grid grid-cols-2 gap-2">
                                    <Link
                                        href="/auth/sign-up"
                                        onClick={() => setOpen(false)}
                                        className="flex items-center justify-center gap-2 h-10 rounded-lg bg-background border border-border/50 text-sm font-semibold text-foreground hover:bg-muted/50 transition-colors"
                                    >
                                        <span>{locale === 'bg' ? 'Регистрация' : 'Register'}</span>
                                    </Link>
                                    <Link
                                        href="/customer-service"
                                        onClick={() => setOpen(false)}
                                        className="flex items-center justify-center gap-2 h-10 rounded-lg bg-background border border-border/50 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                                    >
                                        <Question size={18} weight="regular" className="text-muted-foreground" />
                                        <span>{locale === 'bg' ? 'Помощ' : 'Help'}</span>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
