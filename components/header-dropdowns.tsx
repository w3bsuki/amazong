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
import { ShoppingCart, Package, ArrowCounterClockwise, Truck, MapPin, Minus, Plus, Trash, ChatCircle, PaperPlaneTilt, Bell, Clock, TrendUp, X, CaretRight, Storefront } from "@phosphor-icons/react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"

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
                    <Button variant="ghost" className="h-12 flex flex-col items-start leading-none gap-0 text-header-text border border-transparent hover:border-header-text/20 rounded-sm p-2 px-3 hover:text-brand group">
                        <span className="text-[10px] text-header-text-muted group-hover:text-brand">
                            {user ? `${t('hello')}, ${user.email?.split('@')[0]}` : t('helloSignIn')}
                        </span>
                        <span className="font-medium text-sm flex items-center gap-1 mt-0.5">
                            {t('accountAndLists')}
                            <span className="text-[10px] text-header-text-muted group-hover:text-brand">▼</span>
                        </span>
                    </Button>
                </Link>
            </HoverCardTrigger>
            <HoverCardContent className="w-[500px] p-0 bg-popover text-popover-foreground border border-border z-50 rounded-md overflow-hidden" align="end" sideOffset={8}>
                <div className="flex flex-col items-center p-4 bg-muted border-b border-border">
                    {!user ? (
                        <>
                            <Link href="/auth/login" className="w-56">
                                <Button className="w-full bg-cta-trust-blue hover:bg-cta-trust-blue-hover text-cta-trust-blue-text rounded-md h-[30px] font-normal text-[13px]">
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
                                className="w-56 h-[30px] text-xs bg-cta-trust-blue hover:bg-cta-trust-blue-hover text-cta-trust-blue-text"
                            >
                                {t('signOut')}
                            </Button>
                        </div>
                    )}
                </div>
                <div className="flex p-5">
                    <div className="flex-1 border-r border-border pr-5">
                        <h3 className="font-semibold text-[16px] mb-2 text-foreground">{t('yourLists')}</h3>
                        <ul className="space-y-1.5 text-[13px] text-muted-foreground">
                            <li><Link href="/account/wishlist" className="hover:text-link-hover hover:underline">{t('wishlist')}</Link></li>
                            <li><Link href="#" className="hover:text-link-hover hover:underline">{t('browsingHistory')}</Link></li>
                            <li><Link href="#" className="hover:text-link-hover hover:underline">{t('createList')}</Link></li>
                            <li><Link href="#" className="hover:text-link-hover hover:underline">{t('findList')}</Link></li>
                        </ul>
                    </div>
                    <div className="flex-1 pl-5">
                        <h3 className="font-semibold text-[16px] mb-2 text-foreground">{t('yourAccount')}</h3>
                        <ul className="space-y-1.5 text-[13px] text-muted-foreground">
                            <li><Link href="/account" className="hover:text-link-hover hover:underline">{t('account')}</Link></li>
                            <li><Link href="/account/orders" className="hover:text-link-hover hover:underline">{t('orders')}</Link></li>
                            <li><Link href="/account/messages" className="hover:text-link-hover hover:underline">{t('messages')}</Link></li>
                            <li><Link href="/account/selling" className="hover:text-link-hover hover:underline">{t('recommendations')}</Link></li>
                            <li><Link href="#" className="hover:text-link-hover hover:underline">{t('memberships')}</Link></li>
                        </ul>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}

// Cart Dropdown with mini cart preview
export function CartDropdown() {
    const { items, totalItems, subtotal, removeFromCart, updateQuantity } = useCart()
    const t = useTranslations('CartDropdown')
    const tNav = useTranslations('Navigation')
    const locale = useLocale()
    
    // Prevent hydration mismatch - totalItems comes from localStorage
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])
    
    // Use 0 for SSR, actual value after mount
    const displayItems = mounted ? totalItems : 0

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat(locale === 'bg' ? 'bg-BG' : 'en-US', {
            style: 'currency',
            currency: locale === 'bg' ? 'BGN' : 'EUR',
        }).format(price)
    }

    return (
        <HoverCard openDelay={50} closeDelay={100}>
            <HoverCardTrigger asChild>
                <Link href="/cart" aria-label={tNav('cart')}>
                    <Button variant="ghost" className="h-12 flex items-center gap-1.5 p-2 px-3 border border-transparent hover:border-header-text/20 rounded-sm text-header-text hover:text-brand group">
                        <div className="relative">
                            <ShoppingCart size={24} weight="regular" className="group-hover:text-brand" aria-hidden="true" />
                            {mounted && displayItems > 0 && (
                                <span className="absolute -top-0.5 -right-1 bg-badge-deal text-white text-[9px] font-medium min-w-4 h-4 flex items-center justify-center rounded-full px-0.5" aria-hidden="true">
                                    {displayItems}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col items-start leading-none gap-0">
                            <span className="text-[10px] text-header-text-muted group-hover:text-brand">
                                {mounted ? `${displayItems} ${displayItems === 1 ? (locale === 'bg' ? 'артикул' : 'item') : (locale === 'bg' ? 'артикула' : 'items')}` : (locale === 'bg' ? 'Количка' : 'Cart')}
                            </span>
                            <span className="text-sm font-medium mt-0.5 group-hover:text-brand">{tNav('cart')}</span>
                        </div>
                    </Button>
                </Link>
            </HoverCardTrigger>
            <HoverCardContent className="w-[380px] p-0 bg-popover text-popover-foreground border border-border z-50 rounded-md overflow-hidden" align="end" sideOffset={8}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-muted border-b border-border">
                    <div className="flex items-center gap-2">
                        <ShoppingCart size={20} weight="regular" className="text-muted-foreground" />
                        <h3 className="font-semibold text-base text-foreground">{t('title')}</h3>
                        <span className="text-sm text-muted-foreground">({totalItems} {totalItems === 1 ? t('item') : t('items')})</span>
                    </div>
                </div>

                {items.length === 0 ? (
                    <div className="p-8 text-center">
                        <ShoppingCart size={48} weight="light" className="text-muted-foreground/30 mx-auto mb-3" />
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
                                                    alt={item.title}
                                                    width={64}
                                                    height={64}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                    <Package size={24} weight="regular" />
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                        <Link href={`/product/${item.id}`} className="text-sm font-normal text-foreground hover:text-brand line-clamp-2">
                                            {item.title}
                                        </Link>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-sm font-medium text-foreground">{formatPrice(item.price)}</span>
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
                                                <Minus size={12} weight="bold" />
                                            </button>
                                            <span className="text-xs font-medium text-foreground min-w-5 text-center">{item.quantity}</span>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    updateQuantity(item.id, item.quantity + 1)
                                                }}
                                                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                                            >
                                                <Plus size={12} weight="bold" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    removeFromCart(item.id)
                                                }}
                                                className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive ml-auto"
                                            >
                                                <Trash size={14} weight="regular" />
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
                                <span className="text-lg font-medium text-foreground">{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex gap-2">
                                <Link href="/cart" className="flex-1">
                                    <Button variant="outline" className="w-full h-10 text-sm">
                                        {t('viewCart')}
                                    </Button>
                                </Link>
                                <Link href="/checkout" className="flex-1">
                                    <Button className="w-full h-10 text-sm bg-cta-buy-now hover:bg-cta-buy-now/90 text-foreground">
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

// Orders Dropdown (for buyers - track orders, returns)
interface OrdersDropdownProps {
    user: User | null
}

export function OrdersDropdown({ user }: OrdersDropdownProps) {
    const t = useTranslations('ReturnsDropdown')
    const tNav = useTranslations('Navigation')

    return (
        <HoverCard openDelay={50} closeDelay={100}>
            <HoverCardTrigger asChild>
                <Link href="/account/orders">
                    <Button variant="ghost" className="h-12 hidden lg:flex items-center gap-2 p-2 px-3 border border-transparent hover:border-header-text/20 rounded-sm text-header-text hover:text-brand group">
                        <Package size={20} weight="regular" className="text-header-text group-hover:text-brand" />
                        <div className="flex flex-col items-start leading-none gap-0">
                            <span className="text-[10px] text-header-text-muted group-hover:text-brand">{tNav('yourOrders')}</span>
                            <span className="text-sm font-medium mt-0.5 group-hover:text-brand">{tNav('ordersLabel')}</span>
                        </div>
                    </Button>
                </Link>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 p-0 bg-popover text-popover-foreground border border-border z-50 rounded-md overflow-hidden" align="end" sideOffset={8}>
                <div className="p-4 bg-muted border-b border-border">
                    <h3 className="font-bold text-base text-foreground">{t('title')}</h3>
                </div>
                
                <div className="p-3">
                    {/* Quick Actions */}
                    <div className="space-y-1">
                        <Link href="/account/orders" className="flex items-center gap-3 p-3 rounded-md hover:bg-muted group">
                            <div className="w-10 h-10 bg-brand/10 rounded-full flex items-center justify-center">
                                <Package size={20} weight="duotone" className="text-brand" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-foreground group-hover:text-brand">{t('trackOrders')}</p>
                                <p className="text-xs text-muted-foreground">{t('trackOrdersDesc')}</p>
                            </div>
                            <CaretRight size={16} weight="regular" className="text-muted-foreground" />
                        </Link>

                        <Link href="/returns" className="flex items-center gap-3 p-3 rounded-md hover:bg-muted group">
                            <div className="w-10 h-10 bg-brand/20 rounded-full flex items-center justify-center">
                                <ArrowCounterClockwise size={20} weight="duotone" className="text-brand" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-foreground group-hover:text-brand">{t('startReturn')}</p>
                                <p className="text-xs text-muted-foreground">{t('startReturnDesc')}</p>
                            </div>
                            <CaretRight size={16} weight="regular" className="text-muted-foreground" />
                        </Link>

                        <Link href="/customer-service" className="flex items-center gap-3 p-3 rounded-md hover:bg-muted group">
                            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                                <Truck size={20} weight="duotone" className="text-accent-foreground" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-foreground group-hover:text-brand">{t('deliveryHelp')}</p>
                                <p className="text-xs text-muted-foreground">{t('deliveryHelpDesc')}</p>
                            </div>
                            <CaretRight size={16} weight="regular" className="text-muted-foreground" />
                        </Link>
                    </div>
                </div>

                {/* Footer with View All CTA */}
                {user && (
                    <div className="p-3 bg-muted border-t border-border">
                        <Link href="/account/orders">
                            <Button className="w-full h-9 text-sm bg-cta-trust-blue hover:bg-cta-trust-blue-hover text-cta-trust-blue-text">
                                {t('viewAllOrders')}
                            </Button>
                        </Link>
                    </div>
                )}

                {!user && (
                    <div className="p-4 bg-muted border-t border-border">
                        <Link href="/auth/login">
                            <Button className="w-full h-10 text-sm bg-cta-trust-blue hover:bg-cta-trust-blue-hover text-cta-trust-blue-text">
                                {t('signInToSee')}
                            </Button>
                        </Link>
                    </div>
                )}
            </HoverCardContent>
        </HoverCard>
    )
}

// Selling Dropdown (for sellers)
interface SellingDropdownProps {
    user: User | null
}

export function SellingDropdown({ user }: SellingDropdownProps) {
    const t = useTranslations('SellingDropdown')
    const tNav = useTranslations('Navigation')

    return (
        <HoverCard openDelay={50} closeDelay={100}>
            <HoverCardTrigger asChild>
                <Link href="/sell">
                    <Button variant="ghost" className="h-12 hidden lg:flex items-center gap-2 p-2 px-3 border border-transparent hover:border-header-text/20 rounded-sm text-header-text hover:text-brand group">
                        <Storefront size={20} weight="regular" className="text-header-text group-hover:text-brand" />
                        <div className="flex flex-col items-start leading-none gap-0">
                            <span className="text-[10px] text-header-text-muted group-hover:text-brand">{tNav('startSelling')}</span>
                            <span className="text-sm font-medium mt-0.5 group-hover:text-brand">{tNav('sell')}</span>
                        </div>
                    </Button>
                </Link>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 p-0 bg-popover text-popover-foreground border border-border z-50 rounded-md overflow-hidden" align="end" sideOffset={8}>
                <div className="p-4 bg-muted border-b border-border">
                    <h3 className="font-semibold text-base text-foreground">{t('title')}</h3>
                </div>
                
                <div className="p-3">
                    {/* Seller Actions */}
                    <div className="space-y-1">
                        <Link href="/sell" className="flex items-center gap-3 p-3 rounded-md hover:bg-muted group">
                            <div className="w-10 h-10 bg-brand/10 rounded-full flex items-center justify-center">
                                <Plus size={20} weight="duotone" className="text-brand" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-foreground group-hover:text-brand">{t('createListing')}</p>
                                <p className="text-xs text-muted-foreground">{t('createListingDesc')}</p>
                            </div>
                            <CaretRight size={16} weight="regular" className="text-muted-foreground" />
                        </Link>

                        <Link href="/sell/listings" className="flex items-center gap-3 p-3 rounded-md hover:bg-muted group">
                            <div className="w-10 h-10 bg-brand/20 rounded-full flex items-center justify-center">
                                <Package size={20} weight="duotone" className="text-brand" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-foreground group-hover:text-brand">{t('myListings')}</p>
                                <p className="text-xs text-muted-foreground">{t('myListingsDesc')}</p>
                            </div>
                            <CaretRight size={16} weight="regular" className="text-muted-foreground" />
                        </Link>

                        <Link href="/sell/orders" className="flex items-center gap-3 p-3 rounded-md hover:bg-muted group">
                            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                                <Truck size={20} weight="duotone" className="text-accent-foreground" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-foreground group-hover:text-brand">{t('sellerOrders')}</p>
                                <p className="text-xs text-muted-foreground">{t('sellerOrdersDesc')}</p>
                            </div>
                            <CaretRight size={16} weight="regular" className="text-muted-foreground" />
                        </Link>

                        <Link href="/sell/dashboard" className="flex items-center gap-3 p-3 rounded-md hover:bg-muted group">
                            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                                <TrendUp size={20} weight="duotone" className="text-secondary-foreground" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-foreground group-hover:text-brand">{t('dashboard')}</p>
                                <p className="text-xs text-muted-foreground">{t('dashboardDesc')}</p>
                            </div>
                            <CaretRight size={16} weight="regular" className="text-muted-foreground" />
                        </Link>
                    </div>
                </div>

                {/* Footer with View All CTA */}
                {user && (
                    <div className="p-3 bg-muted border-t border-border">
                        <Link href="/sell/listings">
                            <Button className="w-full h-9 text-sm bg-cta-trust-blue hover:bg-cta-trust-blue-hover text-cta-trust-blue-text">
                                {t('viewAllListings')}
                            </Button>
                        </Link>
                    </div>
                )}

                {!user && (
                    <div className="p-4 bg-muted border-t border-border">
                        <Link href="/auth/login">
                            <Button className="w-full h-10 text-sm bg-cta-trust-blue hover:bg-cta-trust-blue-hover text-cta-trust-blue-text">
                                {t('signInToSell')}
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
    onCountryChange?: (code: string, name: string) => void
}

export function LocationDropdown({ country, onCountryChange }: LocationDropdownProps) {
    const t = useTranslations('LocationDropdown')
    const tNav = useTranslations('Navigation')
    const locale = useLocale()
    const [isOpen, setIsOpen] = useState(false)

    // Shipping zones instead of individual countries
    const shippingZones = [
        { code: 'BG', zone: 'BG', name: 'Bulgaria', nameLocal: 'България', flag: 'https://flagcdn.com/w40/bg.png', icon: '🇧🇬' },
        { code: 'EU', zone: 'EU', name: 'Europe', nameLocal: 'Европа', flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/40px-Flag_of_Europe.svg.png', icon: '🇪🇺' },
        { code: 'US', zone: 'US', name: 'USA', nameLocal: 'САЩ', flag: 'https://flagcdn.com/w40/us.png', icon: '🇺🇸' },
        { code: 'WW', zone: 'WW', name: 'Worldwide', nameLocal: 'По целия свят', flag: null, icon: '🌍' },
    ]

    const handleLocationSelect = (loc: typeof shippingZones[0]) => {
        // Set cookies for 1 year
        document.cookie = `user-country=${loc.code}; max-age=${60 * 60 * 24 * 365}; path=/; samesite=lax`
        document.cookie = `user-zone=${loc.zone}; max-age=${60 * 60 * 24 * 365}; path=/; samesite=lax`
        
        // Notify parent
        const displayName = locale === 'bg' ? loc.nameLocal : loc.name
        onCountryChange?.(loc.code, displayName)
        setIsOpen(false)
        
        // Refresh page to apply new shipping zone filter
        window.location.reload()
    }

    return (
        <HoverCard open={isOpen} onOpenChange={setIsOpen} openDelay={50} closeDelay={100}>
            <HoverCardTrigger asChild>
                <Button variant="ghost" className="h-12 hidden lg:flex flex-col items-start leading-none gap-0 text-header-text hover:text-brand text-xs p-2 px-3 border border-transparent hover:border-header-text/20 rounded-sm shrink-0 group">
                    <span className="text-[10px] text-header-text-muted group-hover:text-brand">{tNav('deliverTo')}</span>
                    <div className="flex items-center gap-1 font-medium text-sm text-header-text mt-0.5 group-hover:text-brand">
                        <MapPin size={14} weight="fill" />
                        <span>{country}</span>
                    </div>
                </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-[300px] p-0 bg-popover text-popover-foreground border border-border z-50 rounded-md overflow-hidden" align="start" sideOffset={8}>
                <div className="p-4 bg-muted border-b border-border">
                    <h3 className="font-semibold text-base text-foreground">{t('chooseLocation')}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{t('deliveryOptions')}</p>
                </div>
                
                <div className="p-2">
                    <p className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase">{t('shippingZones')}</p>
                    {shippingZones.map((loc) => {
                        const displayName = locale === 'bg' ? loc.nameLocal : loc.name
                        const isSelected = country === displayName || country === loc.name || country === loc.nameLocal
                        return (
                            <button
                                key={loc.code}
                                onClick={() => handleLocationSelect(loc)}
                                className={`w-full flex items-center gap-3 p-3 rounded-md hover:bg-muted text-left transition-colors ${isSelected ? 'bg-brand/10' : ''}`}
                            >
                                {loc.flag ? (
                                    <img 
                                        src={loc.flag} 
                                        alt={loc.name} 
                                        width={32} 
                                        height={22} 
                                        className="rounded-sm border border-border"
                                    />
                                ) : (
                                    <span className="text-2xl w-8 text-center">{loc.icon}</span>
                                )}
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-foreground">{loc.name}</p>
                                    <p className="text-xs text-muted-foreground">{loc.nameLocal}</p>
                                </div>
                                {isSelected && (
                                    <div className="w-2 h-2 bg-brand rounded-full" />
                                )}
                            </button>
                        )
                    })}
                </div>

                <div className="p-3 bg-muted border-t border-border">
                    <Link href="/account/addresses">
                        <Button className="w-full h-9 text-sm bg-cta-trust-blue hover:bg-cta-trust-blue-hover text-cta-trust-blue-text">
                            {t('manageAddresses')}
                        </Button>
                    </Link>
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
                    className="h-full px-4 bg-interactive hover:bg-interactive-hover flex items-center gap-1.5 text-sm font-medium text-white cursor-pointer border-r border-interactive-hover whitespace-nowrap rounded-l-sm"
                >
                    <span>{getSelectedLabel()}</span>
                    <CaretRight size={14} weight="regular" className="opacity-80 rotate-90 shrink-0" />
                </button>
            </HoverCardTrigger>
            <HoverCardContent className="w-[220px] p-0 bg-popover text-popover-foreground border border-border z-50 rounded-md overflow-hidden" align="start" sideOffset={4}>
                <div className="max-h-[350px] overflow-y-auto">
                    <button
                        type="button"
                        onClick={() => onCategoryChange('all')}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-muted ${selectedCategory === 'all' ? 'bg-brand/10 text-brand font-medium' : 'text-foreground'}`}
                    >
                        {tCat('all')}
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => onCategoryChange(cat.slug)}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-muted ${selectedCategory === cat.slug ? 'bg-brand/10 text-brand font-medium' : 'text-foreground'}`}
                        >
                            {getCategoryName(cat)}
                        </button>
                    ))}
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}

// Messages Dropdown
interface MessagesDropdownProps {
    user: User | null
}

export function MessagesDropdown({ user }: MessagesDropdownProps) {
    const t = useTranslations('MessagesDropdown')
    const tNav = useTranslations('Navigation')

    return (
        <HoverCard openDelay={50} closeDelay={100}>
            <HoverCardTrigger asChild>
                <Link href="/account/messages">
                    <Button variant="ghost" className="h-12 flex flex-col items-start leading-none gap-0 p-2 px-3 border border-transparent hover:border-header-text/20 rounded-sm text-header-text hover:text-brand group">
                        <span className="text-[10px] text-header-text-muted group-hover:text-brand">{tNav('messages')}</span>
                        <span className="text-sm font-medium mt-0.5">{tNav('messagesLabel')}</span>
                    </Button>
                </Link>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 p-0 bg-popover text-popover-foreground border border-border z-50 rounded-md overflow-hidden" align="end" sideOffset={8}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-muted border-b border-border">
                    <div className="flex items-center gap-2">
                        <ChatCircle size={20} weight="regular" className="text-muted-foreground" />
                        <h3 className="font-semibold text-base text-foreground">{t('title')}</h3>
                    </div>
                </div>

                {!user ? (
                    <div className="p-6 text-center">
                        <ChatCircle size={48} weight="light" className="text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-muted-foreground text-sm mb-4">{t('signInToView')}</p>
                        <Link href="/auth/login">
                            <Button className="w-full h-10 text-sm bg-cta-trust-blue hover:bg-cta-trust-blue-hover text-cta-trust-blue-text">
                                {t('signIn')}
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Quick Actions */}
                        <div className="p-3">
                            <div className="space-y-1">
                                <Link href="/account/messages" className="flex items-center gap-3 p-3 rounded-md hover:bg-muted group">
                                    <div className="w-10 h-10 bg-brand/10 rounded-full flex items-center justify-center">
                                        <ChatCircle size={20} weight="duotone" className="text-brand" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-foreground group-hover:text-brand">{t('inbox')}</p>
                                        <p className="text-xs text-muted-foreground">{t('inboxDesc')}</p>
                                    </div>
                                    <CaretRight size={16} weight="regular" className="text-muted-foreground" />
                                </Link>

                                <Link href="/account/messages?filter=sellers" className="flex items-center gap-3 p-3 rounded-md hover:bg-muted group">
                                    <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                                        <PaperPlaneTilt size={20} weight="duotone" className="text-accent-foreground" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-foreground group-hover:text-brand">{t('sellerMessages')}</p>
                                        <p className="text-xs text-muted-foreground">{t('sellerMessagesDesc')}</p>
                                    </div>
                                    <CaretRight size={16} weight="regular" className="text-muted-foreground" />
                                </Link>

                                <Link href="/account/messages?filter=notifications" className="flex items-center gap-3 p-3 rounded-md hover:bg-muted group">
                                    <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                                        <Bell size={20} weight="duotone" className="text-secondary-foreground" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-foreground group-hover:text-brand">{t('notifications')}</p>
                                        <p className="text-xs text-muted-foreground">{t('notificationsDesc')}</p>
                                    </div>
                                    <CaretRight size={16} weight="regular" className="text-muted-foreground" />
                                </Link>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-3 bg-muted border-t border-border">
                            <Link href="/account/messages">
                                <Button className="w-full h-9 text-sm bg-cta-trust-blue hover:bg-cta-trust-blue-hover text-cta-trust-blue-text">
                                    {t('viewAllMessages')}
                                </Button>
                            </Link>
                        </div>
                    </>
                )}
            </HoverCardContent>
        </HoverCard>
    )
}

// Desktop Search Dropdown with recent/trending searches
interface SearchDropdownProps {
    query: string
    setQuery: (value: string) => void
    onSearch: (e: React.FormEvent) => void
    recentSearches: string[]
    onClearRecent: () => void
    onSelectSearch: (search: string) => void
    products: SearchProduct[]
    isSearching: boolean
}

interface SearchProduct {
    id: string
    title: string
    price: number
    images: string[]
    slug: string
}

export function SearchDropdown({ 
    query, 
    setQuery, 
    onSearch, 
    recentSearches, 
    onClearRecent, 
    onSelectSearch,
    products,
    isSearching
}: SearchDropdownProps) {
    const locale = useLocale()
    const [isFocused, setIsFocused] = useState(false)
    
    const trendingSearches = [
        locale === 'bg' ? 'Черен петък оферти' : 'Black Friday deals',
        'iPhone 15',
        locale === 'bg' ? 'Коледни подаръци' : 'Christmas gifts',
        'PlayStation 5',
    ]

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat(locale === 'bg' ? 'bg-BG' : 'en-US', {
            style: 'currency',
            currency: locale === 'bg' ? 'BGN' : 'USD',
        }).format(price)
    }

    const showDropdown = isFocused && (recentSearches.length > 0 || products.length > 0 || query.length === 0)

    return (
        <div className="relative flex-1">
            <form onSubmit={onSearch} className="relative">
                <Input
                    type="text"
                    placeholder={locale === 'bg' ? 'Търси продукти, марки и още...' : 'Search products, brands, and more...'}
                    className="h-full border-0 rounded-none focus-visible:ring-0 text-foreground px-4 text-sm placeholder:text-muted-foreground pr-10"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                />
                {query && (
                    <button
                        type="button"
                        onClick={() => setQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        <X className="size-4" />
                    </button>
                )}
            </form>

            {/* Dropdown */}
            {showDropdown && (
                <div className="absolute top-full left-0 right-0 bg-popover border border-border rounded-b-md overflow-hidden z-50 max-h-[400px] overflow-y-auto">
                    {/* Live Product Results */}
                    {products.length > 0 && (
                        <div className="p-2 border-b border-border">
                            <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase">
                                <Package className="size-3.5" />
                                {locale === 'bg' ? 'Продукти' : 'Products'}
                            </div>
                            {products.slice(0, 5).map((product) => (
                                <button
                                    key={product.id}
                                    onClick={() => {
                                        window.location.href = `/${locale}/product/${product.slug}`
                                    }}
                                    className="w-full flex items-center gap-3 p-2 hover:bg-muted rounded-md text-left"
                                >
                                    {product.images?.[0] ? (
                                        <Image 
                                            src={product.images[0]} 
                                            alt={product.title}
                                            width={40}
                                            height={40}
                                            className="object-cover rounded-md bg-muted"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                                            <Package className="size-5 text-muted-foreground" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate text-foreground">{product.title}</p>
                                        <p className="text-sm text-price-sale font-semibold">{formatPrice(product.price)}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Recent Searches */}
                    {recentSearches.length > 0 && !query && (
                        <div className="p-2 border-b border-border">
                            <div className="flex items-center justify-between px-2 py-1.5">
                                <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase">
                                    <Clock className="size-3.5" />
                                    {locale === 'bg' ? 'Скорошни' : 'Recent'}
                                </span>
                                <button
                                    onClick={onClearRecent}
                                    className="text-xs text-link hover:text-link-hover"
                                >
                                    {locale === 'bg' ? 'Изчисти' : 'Clear'}
                                </button>
                            </div>
                            {recentSearches.map((search, i) => (
                                <button
                                    key={`recent-${i}`}
                                    onClick={() => onSelectSearch(search)}
                                    className="w-full flex items-center gap-3 p-2 hover:bg-muted rounded-md text-left"
                                >
                                    <Clock className="size-4 text-muted-foreground" />
                                    <span className="text-sm text-foreground">{search}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Trending Searches */}
                    {!query && (
                        <div className="p-2">
                            <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase">
                                <TrendUp size={14} weight="regular" />
                                {locale === 'bg' ? 'Популярни' : 'Trending'}
                            </div>
                            {trendingSearches.map((search, i) => (
                                <button
                                    key={`trending-${i}`}
                                    onClick={() => onSelectSearch(search)}
                                    className="w-full flex items-center gap-3 p-2 hover:bg-muted rounded-md text-left"
                                >
                                    <TrendUp size={16} weight="fill" className="text-deal" />
                                    <span className="text-sm text-foreground">{search}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Loading state */}
                    {isSearching && query && (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            {locale === 'bg' ? 'Търсене...' : 'Searching...'}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
