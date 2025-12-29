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
    CaretRight, 
    X, 
    SignIn as SignInIcon, 
    ChatCircleText, 
    Heart,
    Receipt,
    Question,
    SignOut,
    SpinnerGap,
    SquaresFour,
    MagnifyingGlass,
    ChartLineUp,
    PlusCircle
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from "@/i18n/routing"
import Image from "next/image"
import { useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { User as SupabaseUser } from "@supabase/supabase-js"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useCategoriesCache, getCategoryName } from "@/hooks/use-categories-cache"
import { getCategoryIcon } from "@/lib/category-icons"

interface SidebarMenuProps {
    user?: SupabaseUser | null
    triggerClassName?: string
}

function HamburgerCategoryCircles({
    open,
    locale,
    onNavigate,
}: {
    open: boolean
    locale: string
    onNavigate: () => void
}) {
    // Mount only when drawer is open to avoid eager fetch on every page.
    if (!open) return null

    return <HamburgerCategoryCirclesInner locale={locale} onNavigate={onNavigate} />
}

function HamburgerCategoryCirclesInner({
    locale,
    onNavigate,
}: {
    locale: string
    onNavigate: () => void
}) {
    const { categories, isLoading } = useCategoriesCache({ minCategories: 0 })
    const displayCategories = categories.slice(0, 20)

    return (
        <section id="sidebar-categories" className="px-4 py-4">
            {isLoading && categories.length === 0 ? (
                <div className="grid grid-cols-4 gap-y-6 gap-x-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <div className="size-12 rounded-full bg-muted" />
                            <div className="h-2 w-10 rounded bg-muted" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-4 gap-y-6 gap-x-2">
                    {displayCategories.map((cat) => {
                        const name = getCategoryName(cat, locale)
                        return (
                            <Link
                                key={cat.slug}
                                href={`/categories/${cat.slug}`}
                                onClick={onNavigate}
                                aria-label={name}
                                className="flex flex-col items-center gap-2 group touch-action-manipulation"
                            >
                                <div
                                    className={cn(
                                        "rounded-full flex items-center justify-center",
                                        "size-12",
                                        "bg-brand",
                                        "transition-colors duration-200",
                                        "group-hover:bg-brand-dark"
                                    )}
                                >
                                    <span className="text-white">
                                        {getCategoryIcon(cat.slug, { size: 20, weight: "regular" })}
                                    </span>
                                </div>
                                <span className="text-tiny font-medium text-center text-foreground leading-tight line-clamp-2 max-w-[60px] group-hover:text-brand transition-colors duration-150">
                                    {name}
                                </span>
                            </Link>
                        )
                    })}
                </div>
            )}
        </section>
    )
}

export function SidebarMenu({ user, triggerClassName }: SidebarMenuProps) {
    const [open, setOpen] = useState(false)
    const [isSigningOut, setIsSigningOut] = useState(false)
    const t = useTranslations('Sidebar')
    const locale = useLocale()

    const scrollToCategories = (event?: React.MouseEvent) => {
        const categoriesSection = document.getElementById("sidebar-categories")
        if (!categoriesSection) return false

        event?.preventDefault()
        categoriesSection.scrollIntoView({ behavior: "smooth", block: "start" })
        return true
    }

    // Get display name from user metadata or email
    const getUserDisplayName = () => {
        if (!user) return null
        if (user.user_metadata?.full_name) return user.user_metadata.full_name
        if (user.user_metadata?.name) return user.user_metadata.name
        if (user.email) return user.email.split('@')[0]
        return null
    }

    const displayName = getUserDisplayName()
    const isLoggedIn = !!user

    const handleSignOut = async () => {
        setIsSigningOut(true)
        setOpen(false)
        try {
            const supabase = createClient()
            await supabase.auth.signOut()
            // Force hard navigation to clear all state
            window.location.href = '/'
        } catch {
            setIsSigningOut(false)
        }
    }

    const guestQuickLinks = [
        {
            icon: <SquaresFour size={20} weight="fill" />,
            label: locale === 'bg' ? 'Категории' : 'Categories',
            href: '/categories',
        },
        {
            icon: <MagnifyingGlass size={20} weight="regular" />,
            label: locale === 'bg' ? 'Разгледай' : 'Browse',
            href: '/search',
        },
        {
            icon: <PlusCircle size={20} weight="regular" />,
            label: locale === 'bg' ? 'Продай' : 'Sell',
            href: '/sell',
        },
    ]

    return (
        <Drawer open={open} onOpenChange={setOpen} direction="left">
            <DrawerTrigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-xl"
                    className={cn(
                        "rounded-xl text-header-text hover:bg-header-hover active:bg-header-active transition-colors touch-action-manipulation tap-transparent",
                        triggerClassName
                    )}
                    aria-label={locale === "bg" ? "Меню" : "Menu"}
                    data-testid="mobile-menu-trigger"
                >
                    <List size={28} weight="bold" />
                </Button>
            </DrawerTrigger>
            <DrawerContent
                className="p-0 bg-background text-foreground gap-0 flex flex-col h-full w-[85vw] max-w-[300px] border-r border-border/50 rounded-none shadow-none"
            >
                {/* Header - Account area */}
                <div className="relative bg-brand px-4 py-4 shrink-0 overflow-hidden">
                    <div className="relative flex items-center justify-between gap-2">
                        {/* Profile info */}
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="size-10 shrink-0 rounded-full bg-white/20 flex items-center justify-center">
                                <UserCircle size={28} weight="fill" className="text-white" />
                            </div>
                            <div className="min-w-0 flex-1 flex flex-col">
                                <div className="flex items-center gap-2">
                                    <DrawerTitle className="text-white text-base font-bold truncate leading-tight tracking-tight">
                                        {isLoggedIn 
                                            ? displayName
                                            : (locale === 'bg' ? 'Здравей!' : 'Hello!')
                                        }
                                    </DrawerTitle>
                                    
                                    {/* Locale Selector - Next to name */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button 
                                                type="button"
                                                className="flex items-center justify-center size-5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                            >
                                                <span className="text-[10px] font-bold uppercase text-white">{locale}</span>
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="min-w-[140px] rounded-xl p-1 border border-border/50">
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href="/"
                                                    locale="en"
                                                    onClick={() => setOpen(false)}
                                                    className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg"
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
                                                    {locale === 'en' && <span className="ml-auto text-brand font-bold">✓</span>}
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href="/"
                                                    locale="bg"
                                                    onClick={() => setOpen(false)}
                                                    className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg"
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
                                                    {locale === 'bg' && <span className="ml-auto text-brand font-bold">✓</span>}
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <DrawerDescription className="sr-only">
                                    {locale === 'bg' ? 'Навигационно меню' : 'Navigation menu'}
                                </DrawerDescription>
                                {isLoggedIn ? (
                                    <Link 
                                        href="/account"
                                        onClick={() => setOpen(false)}
                                        className="text-xs font-medium text-white/80 hover:text-white flex items-center gap-1 transition-colors mt-0.5"
                                    >
                                        {locale === 'bg' ? 'Моят акаунт' : 'My account'}
                                        <CaretRight size={12} weight="bold" />
                                    </Link>
                                ) : (
                                    <p className="text-[11px] font-medium text-white/70 mt-0.5">
                                        {locale === 'bg' ? 'Влез или се регистрирай' : 'Sign in or register'}
                                    </p>
                                )}
                            </div>
                        </div>
                        
                        {/* Close Button */}
                        <DrawerClose asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-8 text-white/80 hover:text-white hover:bg-white/10 rounded-full"
                            >
                                <X size={20} weight="bold" />
                                <span className="sr-only">{t('close')}</span>
                            </Button>
                        </DrawerClose>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="px-4 py-3 bg-background border-b border-border/40">
                    <div className="relative group">
                        <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-brand transition-colors" />
                        <Input
                            type="search"
                            placeholder={locale === 'bg' ? 'Търси в категории...' : 'Search categories...'}
                            aria-label={locale === 'bg' ? 'Търси в категории' : 'Search categories'}
                            className="h-10 pl-10 pr-4 rounded-xl border-border/60 bg-muted/30 focus:bg-background transition-colors placeholder:text-muted-foreground/70"
                        />
                    </div>
                </div>

                {/* Main content */}
                <div
                    data-vaul-no-drag
                    className="flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar touch-pan-y [-webkit-overflow-scrolling:touch]"
                >
                    <div className="flex flex-col pb-8">
                        {/* Auth Actions - Only when not logged in */}
                        {!isLoggedIn && (
                            <div className="px-4 py-4 border-b border-border/40">
                                <div className="grid grid-cols-2 gap-3">
                                    <Link
                                        href="/auth/login"
                                        className="flex items-center justify-center gap-2 py-2.5 bg-brand text-white rounded-lg text-sm font-bold hover:bg-brand-dark transition-colors"
                                        onClick={() => setOpen(false)}
                                    >
                                        <SignInIcon size={18} weight="bold" />
                                        {locale === 'bg' ? 'Влез' : 'Sign In'}
                                    </Link>
                                    <Link
                                        href="/auth/sign-up"
                                        className="flex items-center justify-center gap-2 py-2.5 bg-background border border-border rounded-lg text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                                        onClick={() => setOpen(false)}
                                    >
                                        {locale === 'bg' ? 'Регистрация' : 'Register'}
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Quick Actions */}
                        <div className="px-4 py-4 border-b border-border/40">
                            {isLoggedIn ? (
                                <div className="grid grid-cols-4 gap-3">
                                    <Link
                                        href="/account/orders"
                                        onClick={() => setOpen(false)}
                                        className="flex flex-col items-center gap-2 group"
                                    >
                                        <div className="size-12 rounded-2xl bg-secondary text-foreground flex items-center justify-center transition-colors group-hover:bg-secondary/80">
                                            <Receipt size={24} weight="regular" />
                                        </div>
                                        <span className="text-[11px] font-medium text-foreground/80 group-hover:text-foreground transition-colors">{locale === 'bg' ? 'Поръчки' : 'Orders'}</span>
                                    </Link>
                                    <Link
                                        href="/account/sales"
                                        onClick={() => setOpen(false)}
                                        className="flex flex-col items-center gap-2 group"
                                    >
                                        <div className="size-12 rounded-2xl bg-secondary text-foreground flex items-center justify-center transition-colors group-hover:bg-secondary/80">
                                            <ChartLineUp size={24} weight="regular" />
                                        </div>
                                        <span className="text-[11px] font-medium text-foreground/80 group-hover:text-foreground transition-colors">{locale === 'bg' ? 'Продажби' : 'Sales'}</span>
                                    </Link>
                                    <Link
                                        href="/wishlist"
                                        onClick={() => setOpen(false)}
                                        className="flex flex-col items-center gap-2 group"
                                    >
                                        <div className="size-12 rounded-2xl bg-secondary text-foreground flex items-center justify-center transition-colors group-hover:bg-secondary/80">
                                            <Heart size={24} weight="regular" />
                                        </div>
                                        <span className="text-[11px] font-medium text-foreground/80 group-hover:text-foreground transition-colors">{locale === 'bg' ? 'Любими' : 'Saved'}</span>
                                    </Link>
                                    <Link
                                        href="/chat"
                                        onClick={() => setOpen(false)}
                                        className="flex flex-col items-center gap-2 group"
                                    >
                                        <div className="size-12 rounded-2xl bg-secondary text-foreground flex items-center justify-center transition-colors group-hover:bg-secondary/80">
                                            <ChatCircleText size={24} weight="regular" />
                                        </div>
                                        <span className="text-[11px] font-medium text-foreground/80 group-hover:text-foreground transition-colors">{locale === 'bg' ? 'Чат' : 'Chat'}</span>
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-3">
                                    {guestQuickLinks.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.href}
                                            onClick={(event) => {
                                                if (link.href === "/categories") {
                                                    const scrolled = scrollToCategories(event)
                                                    if (scrolled) return
                                                }
                                                setOpen(false)
                                            }}
                                            className="flex flex-col items-center gap-2 group"
                                        >
                                            <div className="size-12 rounded-2xl bg-muted/50 flex items-center justify-center group-hover:bg-muted transition-colors">
                                                {link.icon}
                                            </div>
                                            <span className="text-[11px] font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                                                {link.label}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Browse */}
                        <div className="pt-2">
                            <HamburgerCategoryCircles
                                open={open}
                                locale={locale}
                                onNavigate={() => setOpen(false)}
                            />
                        </div>

                    </div>
                </div>

                {/* Footer actions */}
                <div className="shrink-0 border-t border-border/50 bg-muted/10 pb-safe">
                    <div className="px-4 py-3">
                        <div className="grid grid-cols-2 gap-3">
                            <Link
                                href="/customer-service"
                                onClick={() => setOpen(false)}
                                className="flex items-center justify-center gap-2 h-10 rounded-lg bg-background border border-border/50 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                            >
                                <Question size={18} weight="regular" className="text-muted-foreground" />
                                <span>{locale === 'bg' ? 'Помощ' : 'Help'}</span>
                            </Link>

                            {isLoggedIn ? (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <button
                                            type="button"
                                            disabled={isSigningOut}
                                            className="flex items-center justify-center gap-2 h-10 rounded-lg bg-background border border-border/50 text-sm font-medium text-destructive hover:bg-destructive/5 hover:border-destructive/20 transition-colors"
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
                                            <AlertDialogAction onClick={handleSignOut}>
                                                {locale === "bg" ? "Изход" : "Sign Out"}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            ) : (
                                <div /> /* Spacer if needed or just empty */
                            )}
                        </div>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
