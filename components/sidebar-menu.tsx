"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet"
import { 
    List, 
    UserCircle, 
    CaretRight, 
    CaretDown,
    X, 
    SignIn as SignInIcon, 
    Chat, 
    Heart,
    Clock,
    Percent,
    ShoppingBag,
    Question,
    FireSimple,
    Trophy,
    Tag,
    Lightning,
    // Category icons
    Monitor, 
    Laptop, 
    House, 
    GameController, 
    TShirt, 
    Baby, 
    Wrench, 
    Car, 
    Gift, 
    BookOpen, 
    Barbell, 
    Dog, 
    Lightbulb,
    DeviceMobile,
    Watch,
    Headphones,
    Camera,
    Television,
    MusicNotes,
    Briefcase,
    ForkKnife,
    Leaf,
    Code,
    ShoppingCart,
    Diamond,
    Palette,
    Pill,
    GraduationCap,
    Guitar,
    FilmStrip,
    Flask,
    Hammer,
    Flower,
    PaintBrush,
    SignOut,
    Storefront,
    SpinnerGap
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from "@/i18n/routing"
import { useState, useEffect } from "react"
import { useTranslations, useLocale } from "next-intl"
import { User as SupabaseUser } from "@supabase/supabase-js"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

interface Category {
    id: string
    name: string
    name_bg: string | null
    slug: string
    children?: Category[]
}

// Category icon mapping (same as mega-menu)
const categoryIconMap: Record<string, React.ReactNode> = {
    "electronics": <Monitor size={20} weight="regular" />,
    "computers": <Laptop size={20} weight="regular" />,
    "smart-home": <Lightbulb size={20} weight="regular" />,
    "gaming": <GameController size={20} weight="regular" />,
    "fashion": <TShirt size={20} weight="regular" />,
    "home": <House size={20} weight="regular" />,
    "home-kitchen": <ForkKnife size={20} weight="regular" />,
    "sports": <Barbell size={20} weight="regular" />,
    "sports-outdoors": <Barbell size={20} weight="regular" />,
    "beauty": <PaintBrush size={20} weight="regular" />,
    "toys": <Gift size={20} weight="regular" />,
    "books": <BookOpen size={20} weight="regular" />,
    "automotive": <Car size={20} weight="regular" />,
    "health": <Heart size={20} weight="regular" />,
    "baby": <Baby size={20} weight="regular" />,
    "pets": <Dog size={20} weight="regular" />,
    "pet-supplies": <Dog size={20} weight="regular" />,
    "tools": <Wrench size={20} weight="regular" />,
    "lighting": <Lightbulb size={20} weight="regular" />,
    "phones": <DeviceMobile size={20} weight="regular" />,
    "watches": <Watch size={20} weight="regular" />,
    "audio": <Headphones size={20} weight="regular" />,
    "cameras": <Camera size={20} weight="regular" />,
    "tv": <Television size={20} weight="regular" />,
    "music": <MusicNotes size={20} weight="regular" />,
    "office": <Briefcase size={20} weight="regular" />,
    "garden": <Leaf size={20} weight="regular" />,
    "software-services": <Code size={20} weight="regular" />,
    "grocery": <ShoppingCart size={20} weight="regular" />,
    "jewelry-watches": <Diamond size={20} weight="regular" />,
    "handmade": <Palette size={20} weight="regular" />,
    "health-wellness": <Pill size={20} weight="regular" />,
    "office-school": <GraduationCap size={20} weight="regular" />,
    "musical-instruments": <Guitar size={20} weight="regular" />,
    "movies-music": <FilmStrip size={20} weight="regular" />,
    "industrial-scientific": <Flask size={20} weight="regular" />,
    "collectibles": <Trophy size={20} weight="regular" />,
    "baby-kids": <Baby size={20} weight="regular" />,
    "tools-home": <Hammer size={20} weight="regular" />,
    "garden-outdoor": <Flower size={20} weight="regular" />,
}

function getCategoryIcon(slug: string): React.ReactNode {
    return categoryIconMap[slug] || <ShoppingBag size={20} weight="regular" />
}

interface SidebarMenuProps {
    user?: SupabaseUser | null
}

export function SidebarMenu({ user }: SidebarMenuProps) {
    const [open, setOpen] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
    const [isLoading, setIsLoading] = useState(true)
    const [isSigningOut, setIsSigningOut] = useState(false)
    const t = useTranslations('Sidebar')
    const locale = useLocale()

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

    // Fetch categories with children (like mega-menu)
    useEffect(() => {
        if (open && categories.length === 0) {
            fetch('/api/categories?children=true')
                .then(res => res.json())
                .then(data => {
                    if (data.categories) {
                        setCategories(data.categories)
                    }
                })
                .catch(() => {
                    // Avoid console.error noise; menu can render without categories.
                })
                .finally(() => setIsLoading(false))
        }
    }, [open, categories.length])

    const getCategoryName = (cat: Category) => {
        if (locale === 'bg' && cat.name_bg) {
            return cat.name_bg
        }
        return cat.name
    }

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }))
    }

    const handleSignOut = async () => {
        setIsSigningOut(true)
        setOpen(false)
        try {
            const supabase = createClient()
            await supabase.auth.signOut()
            // Force hard navigation to clear all state
            window.location.href = '/'
        } catch (error) {
            setIsSigningOut(false)
        }
    }

    const quickLinks = [
        {
            icon: <Percent size={20} weight="fill" />,
            label: locale === 'bg' ? 'Оферти' : 'Deals',
            href: '/todays-deals',
            highlight: true,
        },
        {
            icon: <FireSimple size={20} weight="fill" />,
            label: locale === 'bg' ? 'Нови' : 'New',
            href: '/search?sort=newest',
            highlight: false,
        },
        {
            icon: <Gift size={20} weight="regular" />,
            label: locale === 'bg' ? 'Подаръци' : 'Gifts',
            href: '/gift-cards',
            highlight: false,
        },
        {
            icon: <Question size={20} weight="regular" />,
            label: locale === 'bg' ? 'Помощ' : 'Help',
            href: '/customer-service',
            highlight: false,
        },
    ]

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button 
                    className="flex items-center justify-center size-11 rounded-lg text-header-text hover:bg-header-hover active:bg-header-active transition-colors touch-action-manipulation tap-transparent"
                    aria-label={t('all')}
                >
                    <List size={24} weight="regular" />
                </button>
            </SheetTrigger>
            <SheetContent 
                side="left" 
                hideCloseButton
                className="w-full max-w-full sm:max-w-[380px] p-0 border-r-0 bg-background text-foreground gap-0"
            >
                {/* Header - Account area with brand background */}
                <SheetHeader className="bg-brand text-white px-4 py-3 space-y-0">
                    <div className="flex items-center justify-between">
                        {/* Profile info */}
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="size-10 shrink-0 rounded-full bg-white/20 flex items-center justify-center">
                                <UserCircle size={28} weight="fill" className="text-white" />
                            </div>
                            <div className="min-w-0">
                                <SheetTitle className="text-white text-base font-semibold truncate text-left">
                                    {isLoggedIn 
                                        ? displayName
                                        : (locale === 'bg' ? 'Здравей!' : 'Hello!')
                                    }
                                </SheetTitle>
                                <SheetDescription className="sr-only">
                                    {locale === 'bg' ? 'Навигационно меню с категории и настройки на акаунта' : 'Navigation menu with categories and account settings'}
                                </SheetDescription>
                                {isLoggedIn ? (
                                    <Link 
                                        href="/account"
                                        onClick={() => setOpen(false)}
                                        className="text-xs text-white/80 hover:text-white flex items-center gap-0.5 transition-colors"
                                    >
                                        {locale === 'bg' ? 'Моят акаунт' : 'My account'}
                                        <CaretRight size={12} weight="bold" />
                                    </Link>
                                ) : (
                                    <p className="text-xs text-white/80">
                                        {locale === 'bg' ? 'Влез или се регистрирай' : 'Sign in or register'}
                                    </p>
                                )}
                            </div>
                        </div>
                        {/* Language + Close */}
                        <div className="flex items-center gap-1">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        className="flex items-center gap-1 min-h-9 px-2 rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors touch-action-manipulation tap-transparent"
                                    >
                                        <img 
                                            src={locale === 'bg' ? 'https://flagcdn.com/w40/bg.png' : 'https://flagcdn.com/w40/gb.png'}
                                            alt={locale === 'bg' ? 'BG' : 'EN'}
                                            className="w-6 h-4 rounded-sm object-cover"
                                        />
                                        <CaretDown size={10} weight="bold" className="text-white/70" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="min-w-[140px]">
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href="/"
                                            locale="en"
                                            onClick={() => setOpen(false)}
                                            className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <img 
                                                src="https://flagcdn.com/w40/gb.png" 
                                                alt="EN" 
                                                className="size-5 rounded-sm object-cover"
                                            />
                                            <span>English</span>
                                            {locale === 'en' && <span className="ml-auto text-brand">✓</span>}
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href="/"
                                            locale="bg"
                                            onClick={() => setOpen(false)}
                                            className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <img 
                                                src="https://flagcdn.com/w40/bg.png" 
                                                alt="BG" 
                                                className="size-5 rounded-sm object-cover"
                                            />
                                            <span>Български</span>
                                            {locale === 'bg' && <span className="ml-auto text-brand">✓</span>}
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-9 text-white hover:bg-white/10 active:bg-white/20 rounded-full touch-action-manipulation tap-transparent"
                                onClick={() => setOpen(false)}
                            >
                                <X size={20} weight="regular" />
                                <span className="sr-only">{t('close')}</span>
                            </Button>
                        </div>
                    </div>
                </SheetHeader>

                <ScrollArea className="h-[calc(100vh-76px)]">
                    <div className="flex flex-col pb-6">
                        {/* Auth Actions - Only when not logged in */}
                        {!isLoggedIn && (
                            <div className="px-4 py-3 bg-muted/30 border-b border-border">
                                <div className="flex gap-2">
                                    <Link
                                        href="/auth/login"
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-brand text-white rounded-lg text-sm font-semibold hover:bg-brand-dark active:scale-[0.98] transition-all"
                                        onClick={() => setOpen(false)}
                                    >
                                        <SignInIcon size={18} weight="bold" />
                                        {locale === 'bg' ? 'Влез' : 'Sign In'}
                                    </Link>
                                    <Link
                                        href="/auth/sign-up"
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-background border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted active:scale-[0.98] transition-all"
                                        onClick={() => setOpen(false)}
                                    >
                                        {locale === 'bg' ? 'Регистрация' : 'Register'}
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Quick Actions - Action buttons for users */}
                        <div className="px-3 py-3 border-b border-border">
                            {isLoggedIn ? (
                                <div className="grid grid-cols-4 gap-2">
                                    <Link
                                        href="/account/orders"
                                        onClick={() => setOpen(false)}
                                        className="flex flex-col items-center justify-center gap-1.5 min-h-[68px] p-2 rounded-xl border border-border bg-background hover:bg-muted active:scale-[0.98] transition-all touch-action-manipulation"
                                    >
                                        <div className="size-9 rounded-full bg-muted flex items-center justify-center">
                                            <Clock size={20} weight="regular" className="text-foreground" />
                                        </div>
                                        <span className="text-xs font-medium text-foreground">{locale === 'bg' ? 'Поръчки' : 'Orders'}</span>
                                    </Link>
                                    <Link
                                        href="/sell"
                                        onClick={() => setOpen(false)}
                                        className="flex flex-col items-center justify-center gap-1.5 min-h-[68px] p-2 rounded-xl border border-border bg-background hover:bg-muted active:scale-[0.98] transition-all touch-action-manipulation"
                                    >
                                        <div className="size-9 rounded-full bg-muted flex items-center justify-center">
                                            <Storefront size={20} weight="regular" className="text-foreground" />
                                        </div>
                                        <span className="text-xs font-medium text-foreground">{locale === 'bg' ? 'Продажби' : 'Selling'}</span>
                                    </Link>
                                    <Link
                                        href="/wishlist"
                                        onClick={() => setOpen(false)}
                                        className="flex flex-col items-center justify-center gap-1.5 min-h-[68px] p-2 rounded-xl border border-border bg-background hover:bg-muted active:scale-[0.98] transition-all touch-action-manipulation"
                                    >
                                        <div className="size-9 rounded-full bg-muted flex items-center justify-center">
                                            <Heart size={20} weight="regular" className="text-foreground" />
                                        </div>
                                        <span className="text-xs font-medium text-foreground">{locale === 'bg' ? 'Любими' : 'Saved'}</span>
                                    </Link>
                                    <Link
                                        href="/chat"
                                        onClick={() => setOpen(false)}
                                        className="flex flex-col items-center justify-center gap-1.5 min-h-[68px] p-2 rounded-xl border border-border bg-background hover:bg-muted active:scale-[0.98] transition-all touch-action-manipulation"
                                    >
                                        <div className="size-9 rounded-full bg-muted flex items-center justify-center">
                                            <Chat size={20} weight="regular" className="text-foreground" />
                                        </div>
                                        <span className="text-xs font-medium text-foreground">{locale === 'bg' ? 'Чат' : 'Chat'}</span>
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-4 gap-2">
                                    {quickLinks.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.href}
                                            onClick={() => setOpen(false)}
                                            className={cn(
                                                "flex flex-col items-center justify-center gap-1.5 min-h-[68px] p-2 rounded-xl transition-colors touch-action-manipulation",
                                                link.highlight 
                                                    ? "bg-deal/10 text-deal" 
                                                    : "bg-muted hover:bg-muted/80 text-foreground"
                                            )}
                                        >
                                            <div className={cn(
                                                "size-9 rounded-full flex items-center justify-center",
                                                link.highlight ? "bg-deal/15" : "bg-background"
                                            )}>
                                                {link.icon}
                                            </div>
                                            <span className="text-xs font-medium text-center leading-tight">
                                                {link.label}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Categories Section */}
                        <div className="pt-3 pb-2">
                            <div className="flex items-center justify-between px-4 py-2">
                                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    {locale === 'bg' ? 'Категории' : 'Categories'}
                                </h3>
                                <Link 
                                    href="/categories" 
                                    onClick={() => setOpen(false)}
                                    className="text-xs text-brand font-medium hover:text-brand/80 transition-colors"
                                >
                                    {locale === 'bg' ? 'Виж всички' : 'View All'}
                                </Link>
                            </div>

                            {isLoading ? (
                                <div className="px-4 py-8 text-center">
                                    <div className="size-5 border-2 border-muted-foreground/30 border-t-foreground rounded-full animate-spin mx-auto" />
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {locale === 'bg' ? 'Зареждане...' : 'Loading...'}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-0.5">
                                    {/* Featured Links - Same styling as categories */}
                                    <div className="flex items-center">
                                        <Link
                                            href="/todays-deals"
                                            onClick={() => setOpen(false)}
                                            className="flex-1 flex items-center gap-3 px-4 min-h-11 text-md text-foreground hover:bg-muted active:bg-muted/80 transition-colors touch-action-manipulation tap-transparent"
                                        >
                                            <span className="text-deal">
                                                <Lightning size={20} weight="fill" />
                                            </span>
                                            <span className="flex-1 font-medium">{locale === 'bg' ? 'Оферти на деня' : "Today's Deals"}</span>
                                        </Link>
                                        <div className="flex items-center justify-center size-11">
                                            <CaretRight size={16} weight="regular" className="text-muted-foreground/50" />
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <Link
                                            href="/search?sort=newest"
                                            onClick={() => setOpen(false)}
                                            className="flex-1 flex items-center gap-3 px-4 min-h-11 text-md text-foreground hover:bg-muted active:bg-muted/80 transition-colors touch-action-manipulation tap-transparent"
                                        >
                                            <span className="text-brand">
                                                <Tag size={20} weight="fill" />
                                            </span>
                                            <span className="flex-1 font-medium">{locale === 'bg' ? 'Нови обяви' : 'New Listings'}</span>
                                        </Link>
                                        <div className="flex items-center justify-center size-11">
                                            <CaretRight size={16} weight="regular" className="text-muted-foreground/50" />
                                        </div>
                                    </div>

                                    <Separator className="my-1" />

                                    {categories.map((category) => {
                                        const hasChildren = category.children && category.children.length > 0
                                        const isExpanded = expandedCategories[category.id]
                                        
                                        return (
                                            <div key={category.id}>
                                                {/* Category Row */}
                                                <div className="flex items-center">
                                                    <Link
                                                        href={`/categories/${category.slug}`}
                                                        onClick={() => setOpen(false)}
                                                        className="flex-1 flex items-center gap-3 px-4 min-h-11 text-md text-foreground hover:bg-muted active:bg-muted/80 transition-colors touch-action-manipulation tap-transparent"
                                                    >
                                                        <span className="text-muted-foreground">
                                                            {getCategoryIcon(category.slug)}
                                                        </span>
                                                        <span className="flex-1 font-medium">{getCategoryName(category)}</span>
                                                    </Link>
                                                    {hasChildren && (
                                                        <button
                                                            onClick={() => toggleCategory(category.id)}
                                                            className="flex items-center justify-center size-11 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors touch-action-manipulation tap-transparent"
                                                            aria-label={isExpanded ? 'Collapse' : 'Expand'}
                                                        >
                                                            <CaretDown 
                                                                size={18} 
                                                                weight="regular" 
                                                                className={cn(
                                                                    "transition-transform duration-200",
                                                                    isExpanded && "rotate-180"
                                                                )}
                                                            />
                                                        </button>
                                                    )}
                                                    {!hasChildren && (
                                                        <div className="flex items-center justify-center size-11">
                                                            <CaretRight size={16} weight="regular" className="text-muted-foreground/50" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Subcategories */}
                                                {hasChildren && isExpanded && (
                                                    <div className="bg-muted/30">
                                                        {category.children!.slice(0, 8).map((sub) => (
                                                            <Link
                                                                key={sub.id}
                                                                href={`/search?category=${sub.slug}`}
                                                                onClick={() => setOpen(false)}
                                                                className="flex items-center gap-3 px-4 pl-12 min-h-11 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 active:bg-muted transition-colors touch-action-manipulation tap-transparent"
                                                            >
                                                                <span>{getCategoryName(sub)}</span>
                                                            </Link>
                                                        ))}
                                                        {category.children!.length > 8 && (
                                                            <Link
                                                                href={`/categories/${category.slug}`}
                                                                onClick={() => setOpen(false)}
                                                                className="flex items-center gap-2 px-4 pl-12 min-h-11 text-sm text-brand font-medium hover:text-brand/80 active:text-brand-dark transition-colors touch-action-manipulation tap-transparent"
                                                            >
                                                                {locale === 'bg' 
                                                                    ? `Виж всички ${category.children!.length}` 
                                                                    : `View all ${category.children!.length}`
                                                                }
                                                                <CaretRight size={14} weight="regular" />
                                                            </Link>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Help & Sign Out */}
                        <Separator className="my-1" />
                        <div className="px-4 py-2 space-y-1">
                            <Link
                                href="/customer-service"
                                onClick={() => setOpen(false)}
                                className="w-full flex items-center justify-center gap-2 min-h-11 text-sm font-medium text-muted-foreground hover:bg-muted active:bg-muted/80 rounded-lg transition-colors touch-action-manipulation tap-transparent"
                            >
                                <Question size={18} weight="regular" />
                                {locale === 'bg' ? 'Помощ' : 'Help'}
                            </Link>
                            {isLoggedIn && (
                                <button
                                    onClick={handleSignOut}
                                    disabled={isSigningOut}
                                    className="w-full flex items-center justify-center gap-2 min-h-11 text-sm font-medium text-destructive hover:bg-destructive/10 active:bg-destructive/15 rounded-lg transition-colors touch-action-manipulation tap-transparent disabled:opacity-70"
                                >
                                    {isSigningOut ? (
                                        <SpinnerGap size={18} className="animate-spin" />
                                    ) : (
                                        <SignOut size={18} weight="regular" />
                                    )}
                                    {isSigningOut ? (locale === 'bg' ? 'Излизане...' : 'Signing out...') : (locale === 'bg' ? 'Излез' : 'Sign Out')}
                                </button>
                            )}
                        </div>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}
