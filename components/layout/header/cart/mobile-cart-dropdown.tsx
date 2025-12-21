"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { ShoppingCart, Package, Minus, Plus, Trash } from "@phosphor-icons/react"
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerClose,
    DrawerFooter,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { useTranslations, useLocale } from "next-intl"
import { useCart, type CartItem } from "@/components/providers/cart-context"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function MobileCartDropdown() {
    const [open, setOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const { items, totalItems, subtotal, removeFromCart, updateQuantity } = useCart()
    const t = useTranslations('CartDropdown')
    const tNav = useTranslations('Navigation')
    const locale = useLocale()

    // Build SEO-friendly product URL
    const buildProductUrl = useCallback((item: CartItem) => {
        if (item.storeSlug && item.slug) {
            return `/product/${item.storeSlug}/${item.slug}`
        }
        return `/product/${item.slug || item.id}`
    }, [])

    // Prevent hydration mismatch by only rendering cart count after mount
    useEffect(() => {
        setMounted(true)
    }, [])

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat(locale === 'bg' ? 'bg-BG' : 'en-IE', {
            style: 'currency',
            currency: 'EUR',
        }).format(price)
    }

    // Calculate content area max height based on item count
    const contentMaxHeight = useMemo(() => {
        if (items.length === 0) return 'max-h-[30dvh]'
        if (items.length <= 2) return 'max-h-[35dvh]'
        if (items.length <= 4) return 'max-h-[45dvh]'
        return 'max-h-[55dvh]'
    }, [items.length])

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <button 
                    className="flex items-center justify-center size-11 p-0 rounded-lg relative hover:bg-header-hover active:bg-header-active transition-colors touch-action-manipulation tap-transparent"
                    aria-label={tNav('cart')}
                >
                    <ShoppingCart size={24} weight="regular" className="text-header-text" aria-hidden="true" />
                    {mounted && totalItems > 0 && (
                        <span 
                            className="absolute top-0.5 right-0 bg-badge-deal text-white text-xs font-bold min-w-4 h-4 flex items-center justify-center rounded-full px-0.5" 
                            aria-hidden="true"
                        >
                            {totalItems}
                        </span>
                    )}
                </button>
            </DrawerTrigger>
            <DrawerContent className="rounded-t-3xl">
                <DrawerHeader className="pb-2 pt-0 border-b border-border text-left">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ShoppingCart size={20} weight="regular" className="text-muted-foreground" />
                            <DrawerTitle className="text-lg">{t('title')}</DrawerTitle>
                            <span className="text-sm text-muted-foreground font-normal" suppressHydrationWarning>
                                ({mounted ? totalItems : 0} {(mounted ? totalItems : 0) === 1 ? t('item') : t('items')})
                            </span>
                        </div>
                        <DrawerClose asChild>
                            <button 
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors min-h-11 px-3 rounded-lg hover:bg-muted touch-action-manipulation tap-transparent"
                                aria-label="Close"
                            >
                                {locale === 'bg' ? 'Затвори' : 'Close'}
                            </button>
                        </DrawerClose>
                    </div>
                    <DrawerDescription className="sr-only">
                        Your shopping cart contents
                    </DrawerDescription>
                </DrawerHeader>

                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-4 py-8">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-3">
                            <ShoppingCart size={32} weight="regular" className="text-muted-foreground/50" />
                        </div>
                        <p className="text-muted-foreground text-base mb-1">{t('empty')}</p>
                        <p className="text-muted-foreground/70 text-sm">
                            {locale === 'bg' ? 'Добавете продукти, за да започнете' : 'Add items to get started'}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Cart Items - Scrollable area */}
                        <div className={cn("flex-1 overflow-y-auto px-4 overscroll-contain", contentMaxHeight)}>
                            {items.map((item, index) => (
                                <div 
                                    key={item.id} 
                                    className={cn(
                                        "flex gap-3 py-3",
                                        index !== items.length - 1 && "border-b border-border"
                                    )}
                                >
                                    <Link 
                                        href={buildProductUrl(item)} 
                                        onClick={() => setOpen(false)}
                                        className="shrink-0"
                                    >
                                        <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                                            {item.image ? (
                                                <Image
                                                    src={item.image}
                                                    alt={item.title}
                                                    width={64}
                                                    height={64}
                                                    className="w-full h-full object-cover"
                                                    priority={index === 0}
                                                    loading={index === 0 ? "eager" : "lazy"}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                    <Package size={24} weight="regular" />
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                        <Link 
                                            href={buildProductUrl(item)}
                                            onClick={() => setOpen(false)}
                                            className="text-sm font-medium text-foreground hover:text-brand line-clamp-2 leading-tight"
                                        >
                                            {item.title}
                                        </Link>
                                        <div className="flex items-center justify-between mt-1.5">
                                            <span className="text-base font-bold text-foreground">{formatPrice(item.price)}</span>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="flex items-center justify-center size-9 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors touch-action-manipulation tap-transparent"
                                                aria-label="Remove item"
                                            >
                                                <Trash size={18} weight="regular" />
                                            </button>
                                        </div>
                                        <div className="flex items-center mt-2">
                                            <div className="flex items-center gap-0 bg-muted rounded-full">
                                                <button
                                                    onClick={() => {
                                                        if (item.quantity > 1) {
                                                            updateQuantity(item.id, item.quantity - 1)
                                                        } else {
                                                            removeFromCart(item.id)
                                                        }
                                                    }}
                                                    className="flex items-center justify-center size-9 rounded-full hover:bg-background text-muted-foreground hover:text-foreground transition-colors touch-action-manipulation tap-transparent"
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus size={16} weight="regular" />
                                                </button>
                                                <span className="text-sm font-medium text-foreground min-w-8 text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="flex items-center justify-center size-9 rounded-full hover:bg-background text-muted-foreground hover:text-foreground transition-colors touch-action-manipulation tap-transparent"
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus size={16} weight="regular" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {/* Scroll indicator for many items */}
                            {items.length > 3 && (
                                <div className="py-2 text-center">
                                    <span className="text-xs text-muted-foreground">
                                        {locale === 'bg' ? 'Плъзнете за още' : 'Scroll for more'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Footer - Always visible at bottom */}
                <DrawerFooter className="border-t border-border">
                    {items.length === 0 ? (
                        <Link href="/search" onClick={() => setOpen(false)} className="w-full">
                            <Button className="w-full h-12 text-base font-semibold bg-cta-trust-blue hover:bg-cta-trust-blue-hover text-cta-trust-blue-text">
                                {t('startShopping')}
                            </Button>
                        </Link>
                    ) : (
                        <div className="w-full space-y-2">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-muted-foreground">{t('subtotal')}</span>
                                <span className="text-lg font-bold text-foreground">{formatPrice(subtotal)}</span>
                            </div>
                            <Link href="/checkout" onClick={() => setOpen(false)} className="block">
                                <Button className="w-full h-12 text-base font-semibold bg-cta-buy-now hover:bg-cta-buy-now/90 text-foreground">
                                    {t('checkout')}
                                </Button>
                            </Link>
                            <Link href="/cart" onClick={() => setOpen(false)} className="block">
                                <Button variant="outline" className="w-full h-11 text-sm font-medium">
                                    {t('viewCart')} →
                                </Button>
                            </Link>
                        </div>
                    )}
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
