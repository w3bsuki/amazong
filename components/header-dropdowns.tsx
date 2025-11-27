"use client"

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { Link, useRouter } from "@/i18n/routing"
import { useTranslations, useLocale } from "next-intl"
import { User } from "@supabase/supabase-js"
import { useCart } from "@/lib/cart-context"
import { ShoppingCart, Package, RotateCcw, Truck, MapPin, ChevronRight, Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"

interface AccountDropdownProps {
    user: User | null
}

export function AccountDropdown({ user }: AccountDropdownProps) {
    const t = useTranslations('Header')
    const router = useRouter()

    const handleSignOut = async () => {
        router.push('/api/auth/sign-out')
    }

    return (
        <HoverCard openDelay={50} closeDelay={100}>
            <HoverCardTrigger asChild>
                <Link href={user ? "/account" : "/auth/login"}>
                    <Button variant="ghost" className="flex flex-col items-start leading-none gap-0 text-header-text border border-transparent hover:border-header-text/20 rounded-md p-2 px-3 hover:bg-header-text/10 hover:text-header-text">
                        <span className="text-[10px] text-header-text-muted">
                            {user ? `${t('hello')}, ${user.email?.split('@')[0]}` : t('helloSignIn')}
                        </span>
                        <span className="font-bold text-sm flex items-center gap-1 mt-0.5">
                            {t('accountAndLists')}
                            <span className="text-[10px] text-header-text-muted">▼</span>
                        </span>
                    </Button>
                </Link>
            </HoverCardTrigger>
            <HoverCardContent className="w-[500px] p-0 bg-popover text-popover-foreground border-none shadow-xl z-50 rounded-md overflow-hidden" align="end" sideOffset={8}>
                <div className="flex flex-col items-center p-4 bg-muted border-b border-border">
                    {!user ? (
                        <>
                            <Link href="/auth/login" className="w-56">
                                <Button className="w-full bg-brand-warning hover:bg-brand-warning/90 text-foreground border border-brand-warning/50 rounded-md h-[30px] font-normal text-[13px]">
                                    {t('signIn')}
                                </Button>
                            </Link>
                            <div className="text-[11px] mt-2 text-foreground">
                                {t('newCustomer')} <Link href="/auth/sign-up" className="text-link hover:underline hover:text-link-hover">{t('startHere')}</Link>
                            </div>
                        </>
                    ) : (
                        <div className="w-full flex flex-col items-center gap-2">
                            <p className="text-sm font-medium">{t('hello')}, {user.email}</p>
                            <Button
                                onClick={handleSignOut}
                                variant="outline"
                                className="w-56 h-[30px] text-xs"
                            >
                                {t('signOut')}
                            </Button>
                        </div>
                    )}
                </div>
                <div className="flex p-5">
                    <div className="flex-1 border-r border-border pr-5">
                        <h3 className="font-bold text-[16px] mb-2 text-foreground">{t('yourLists')}</h3>
                        <ul className="space-y-1.5 text-[13px] text-muted-foreground">
                            <li><Link href="#" className="hover:text-link-hover hover:underline">{t('createList')}</Link></li>
                            <li><Link href="#" className="hover:text-link-hover hover:underline">{t('findList')}</Link></li>
                        </ul>
                    </div>
                    <div className="flex-1 pl-5">
                        <h3 className="font-bold text-[16px] mb-2 text-foreground">{t('yourAccount')}</h3>
                        <ul className="space-y-1.5 text-[13px] text-muted-foreground">
                            <li><Link href="/account" className="hover:text-link-hover hover:underline">{t('account')}</Link></li>
                            <li><Link href="/account/orders" className="hover:text-link-hover hover:underline">{t('orders')}</Link></li>
                            <li><Link href="/account/messages" className="hover:text-link-hover hover:underline">{t('messages')}</Link></li>
                            <li><Link href="/account/wishlist" className="hover:text-link-hover hover:underline">{t('wishlist')}</Link></li>
                            <li><Link href="#" className="hover:text-link-hover hover:underline">{t('recommendations')}</Link></li>
                            <li><Link href="#" className="hover:text-link-hover hover:underline">{t('browsingHistory')}</Link></li>
                            <li><Link href="#" className="hover:text-link-hover hover:underline">{t('watchlist')}</Link></li>
                            <li><Link href="#" className="hover:text-link-hover hover:underline">{t('videoPurchases')}</Link></li>
                            <li><Link href="#" className="hover:text-link-hover hover:underline">{t('kindleUnlimited')}</Link></li>
                            <li><Link href="#" className="hover:text-link-hover hover:underline">{t('contentDevices')}</Link></li>
                            <li><Link href="#" className="hover:text-link-hover hover:underline">{t('subscribeSave')}</Link></li>
                            <li><Link href="#" className="hover:text-link-hover hover:underline">{t('memberships')}</Link></li>
                            <li><Link href="#" className="hover:text-link-hover hover:underline">{t('musicLibrary')}</Link></li>
                        </ul>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}

// Cart Dropdown with mini cart preview
export function CartDropdown() {
    const { items, totalItems, totalPrice, removeFromCart, updateQuantity } = useCart()
    const t = useTranslations('CartDropdown')
    const tNav = useTranslations('Navigation')
    const locale = useLocale()

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat(locale === 'bg' ? 'bg-BG' : 'en-US', {
            style: 'currency',
            currency: locale === 'bg' ? 'BGN' : 'EUR',
        }).format(price)
    }

    return (
        <HoverCard openDelay={50} closeDelay={100}>
            <HoverCardTrigger asChild>
                <Link href="/cart" aria-label={`${tNav('cart')} - ${totalItems} ${totalItems === 1 ? 'item' : 'items'}`}>
                    <Button variant="ghost" className="flex items-end gap-1 p-2 px-3 border border-transparent hover:border-header-text/20 rounded-md hover:bg-header-text/10 text-header-text">
                        <div className="relative">
                            <ShoppingCart className="size-6 text-header-text" aria-hidden="true" />
                            <span className="absolute -top-1 -right-1.5 bg-brand-deal text-white text-[10px] font-bold min-w-5 h-5 flex items-center justify-center rounded-full px-1" aria-hidden="true">
                                {totalItems}
                            </span>
                        </div>
                        <span className="text-sm font-bold">{tNav('cart')}</span>
                    </Button>
                </Link>
            </HoverCardTrigger>
            <HoverCardContent className="w-[380px] p-0 bg-popover text-popover-foreground border-none shadow-xl z-50 rounded-md overflow-hidden" align="end" sideOffset={8}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-muted border-b border-border">
                    <div className="flex items-center gap-2">
                        <ShoppingCart className="size-5 text-muted-foreground" />
                        <h3 className="font-bold text-base text-foreground">{t('title')}</h3>
                        <span className="text-sm text-muted-foreground">({totalItems} {totalItems === 1 ? t('item') : t('items')})</span>
                    </div>
                </div>

                {items.length === 0 ? (
                    <div className="p-8 text-center">
                        <ShoppingCart className="size-12 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-muted-foreground text-sm">{t('empty')}</p>
                        <Link href="/search" className="text-link hover:underline text-sm mt-2 block">
                            {t('startShopping')}
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Cart Items */}
                        <div className="max-h-[300px] overflow-y-auto">
                            {items.slice(0, 4).map((item) => (
                                <div key={item.id} className="flex gap-3 p-3 border-b border-border hover:bg-muted">
                                    <Link href={`/product/${item.id}`} className="shrink-0">
                                        <div className="w-16 h-16 bg-muted rounded overflow-hidden">
                                            {item.image ? (
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    width={64}
                                                    height={64}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                    <Package className="size-6" />
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                        <Link href={`/product/${item.id}`} className="text-sm font-medium text-foreground hover:text-brand line-clamp-2">
                                            {item.name}
                                        </Link>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-sm font-bold text-foreground">{formatPrice(item.price)}</span>
                                            <span className="text-xs text-muted-foreground">× {item.quantity}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    if (item.quantity > 1) {
                                                        updateQuantity(item.id, item.quantity - 1)
                                                    } else {
                                                        removeFromCart(item.id)
                                                    }
                                                }}
                                                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                                            >
                                                <Minus className="size-3" />
                                            </button>
                                            <span className="text-xs font-medium text-foreground min-w-5 text-center">{item.quantity}</span>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    updateQuantity(item.id, item.quantity + 1)
                                                }}
                                                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                                            >
                                                <Plus className="size-3" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    removeFromCart(item.id)
                                                }}
                                                className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive ml-auto"
                                            >
                                                <Trash2 className="size-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {items.length > 4 && (
                                <div className="p-3 text-center text-sm text-muted-foreground bg-muted">
                                    +{items.length - 4} {t('moreItems')}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-muted border-t border-border">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm text-muted-foreground">{t('subtotal')}</span>
                                <span className="text-lg font-bold text-foreground">{formatPrice(totalPrice)}</span>
                            </div>
                            <div className="flex gap-2">
                                <Link href="/cart" className="flex-1">
                                    <Button variant="outline" className="w-full h-10 text-sm">
                                        {t('viewCart')}
                                    </Button>
                                </Link>
                                <Link href="/checkout" className="flex-1">
                                    <Button className="w-full h-10 text-sm bg-brand-deal hover:bg-brand-deal/90 text-white">
                                        {t('checkout')}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </HoverCardContent>
        </HoverCard>
    )
}

// Returns & Orders Dropdown
interface ReturnsOrdersDropdownProps {
    user: User | null
}

export function ReturnsOrdersDropdown({ user }: ReturnsOrdersDropdownProps) {
    const t = useTranslations('ReturnsDropdown')
    const tNav = useTranslations('Navigation')

    return (
        <HoverCard openDelay={50} closeDelay={100}>
            <HoverCardTrigger asChild>
                <Link href="/account/orders">
                    <Button variant="ghost" className="hidden lg:flex flex-col items-start leading-none gap-0 p-2 px-3 border border-transparent hover:border-header-text/20 rounded-md hover:bg-header-text/10 text-header-text">
                        <span className="text-[10px] text-header-text/70">{tNav('returns')}</span>
                        <span className="text-sm font-medium mt-0.5">{tNav('orders')}</span>
                    </Button>
                </Link>
            </HoverCardTrigger>
            <HoverCardContent className="w-[320px] p-0 bg-popover text-popover-foreground border-none shadow-xl z-50 rounded-md overflow-hidden" align="end" sideOffset={8}>
                <div className="p-4 bg-muted border-b border-border">
                    <h3 className="font-bold text-base text-foreground">{t('title')}</h3>
                </div>
                
                <div className="p-3">
                    {/* Quick Actions */}
                    <div className="space-y-1">
                        <Link href="/account/orders" className="flex items-center gap-3 p-3 rounded-md hover:bg-muted group">
                            <div className="w-10 h-10 bg-brand/10 rounded-full flex items-center justify-center">
                                <Package className="size-5 text-brand" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-foreground group-hover:text-brand">{t('trackOrders')}</p>
                                <p className="text-xs text-muted-foreground">{t('trackOrdersDesc')}</p>
                            </div>
                            <ChevronRight className="size-4 text-muted-foreground" />
                        </Link>

                        <Link href="/returns" className="flex items-center gap-3 p-3 rounded-md hover:bg-muted group">
                            <div className="w-10 h-10 bg-brand/20 rounded-full flex items-center justify-center">
                                <RotateCcw className="size-5 text-brand" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-foreground group-hover:text-brand">{t('startReturn')}</p>
                                <p className="text-xs text-muted-foreground">{t('startReturnDesc')}</p>
                            </div>
                            <ChevronRight className="size-4 text-muted-foreground" />
                        </Link>

                        <Link href="/customer-service" className="flex items-center gap-3 p-3 rounded-md hover:bg-muted group">
                            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                                <Truck className="size-5 text-accent-foreground" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-foreground group-hover:text-brand">{t('deliveryHelp')}</p>
                                <p className="text-xs text-muted-foreground">{t('deliveryHelpDesc')}</p>
                            </div>
                            <ChevronRight className="size-4 text-muted-foreground" />
                        </Link>
                    </div>
                </div>

                {!user && (
                    <div className="p-4 bg-muted border-t border-border">
                        <Link href="/auth/login">
                            <Button className="w-full h-10 text-sm bg-brand-deal hover:bg-brand-deal/90 text-white">
                                {t('signInToSee')}
                            </Button>
                        </Link>
                    </div>
                )}
            </HoverCardContent>
        </HoverCard>
    )
}

// Deliver to Location Dropdown
interface LocationDropdownProps {
    country: string
}

export function LocationDropdown({ country }: LocationDropdownProps) {
    const t = useTranslations('LocationDropdown')
    const tNav = useTranslations('Navigation')

    const popularLocations = [
        { code: 'BG', name: 'Bulgaria', nameLocal: 'България' },
        { code: 'US', name: 'United States', nameLocal: 'САЩ' },
        { code: 'DE', name: 'Germany', nameLocal: 'Германия' },
        { code: 'UK', name: 'United Kingdom', nameLocal: 'Великобритания' },
        { code: 'FR', name: 'France', nameLocal: 'Франция' },
    ]

    return (
        <HoverCard openDelay={50} closeDelay={100}>
            <HoverCardTrigger asChild>
                <Button variant="ghost" className="hidden lg:flex flex-col items-start leading-none gap-0 text-header-text/70 hover:text-header-text text-xs ml-2 p-2 px-3 border border-transparent hover:border-header-text/20 rounded-md hover:bg-header-text/10 shrink-0">
                    <span className="text-header-text/50 font-normal text-[10px]">{tNav('deliverTo')}</span>
                    <div className="flex items-center gap-1 font-medium text-sm text-header-text mt-0.5">
                        <MapPin className="size-3.5" />
                        <span>{country}</span>
                    </div>
                </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-[300px] p-0 bg-popover text-popover-foreground border-none shadow-xl z-50 rounded-md overflow-hidden" align="start" sideOffset={8}>
                <div className="p-4 bg-muted border-b border-border">
                    <h3 className="font-bold text-base text-foreground">{t('chooseLocation')}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{t('deliveryOptions')}</p>
                </div>
                
                <div className="p-2">
                    <p className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase">{t('popularLocations')}</p>
                    {popularLocations.map((loc) => (
                        <button
                            key={loc.code}
                            className={`w-full flex items-center gap-3 p-3 rounded-md hover:bg-muted text-left ${country === loc.name ? 'bg-brand/10' : ''}`}
                        >
                            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-xs font-bold text-secondary-foreground">
                                {loc.code}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-foreground">{loc.name}</p>
                                <p className="text-xs text-muted-foreground">{loc.nameLocal}</p>
                            </div>
                            {country === loc.name && (
                                <div className="w-2 h-2 bg-brand rounded-full" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="p-3 bg-muted border-t border-border">
                    <Button variant="outline" className="w-full h-9 text-sm">
                        {t('manageAddresses')}
                    </Button>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}

// Search Category Dropdown (hover-based)
interface Category {
    id: string
    name: string
    name_bg: string | null
    slug: string
}

interface SearchCategoryDropdownProps {
    categories: Category[]
    selectedCategory: string
    onCategoryChange: (value: string) => void
}

export function SearchCategoryDropdown({ categories, selectedCategory, onCategoryChange }: SearchCategoryDropdownProps) {
    const tCat = useTranslations('SearchCategories')
    const locale = useLocale()

    const getCategoryName = (cat: Category) => {
        if (locale === 'bg' && cat.name_bg) {
            return cat.name_bg
        }
        return cat.name
    }

    const getSelectedLabel = () => {
        if (selectedCategory === 'all') return tCat('all')
        const cat = categories.find(c => c.slug === selectedCategory)
        return cat ? getCategoryName(cat) : tCat('all')
    }

    return (
        <HoverCard openDelay={50} closeDelay={150}>
            <HoverCardTrigger asChild>
                <button
                    type="button"
                    className="h-full px-3 bg-secondary hover:bg-muted flex items-center gap-1 text-xs text-muted-foreground cursor-pointer border-r border-border whitespace-nowrap"
                >
                    <span>{getSelectedLabel()}</span>
                    <ChevronRight className="size-3 opacity-50 rotate-90 shrink-0" />
                </button>
            </HoverCardTrigger>
            <HoverCardContent className="w-[200px] p-0 bg-popover text-popover-foreground border border-border shadow-lg z-50 rounded-md overflow-hidden" align="start" sideOffset={4}>
                <div className="max-h-[350px] overflow-y-auto">
                    <button
                        type="button"
                        onClick={() => onCategoryChange('all')}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-muted ${selectedCategory === 'all' ? 'bg-brand/10 text-brand font-medium' : 'text-foreground'}`}
                    >
                        {tCat('all')}
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => onCategoryChange(cat.slug)}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-muted ${selectedCategory === cat.slug ? 'bg-brand/10 text-brand font-medium' : 'text-foreground'}`}
                        >
                            {getCategoryName(cat)}
                        </button>
                    ))}
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}
