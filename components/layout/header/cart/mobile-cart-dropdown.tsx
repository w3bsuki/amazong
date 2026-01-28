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
    DrawerBody,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { useTranslations, useLocale } from "next-intl"
import { useCart, type CartItem } from "@/components/providers/cart-context"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { CountBadge } from "@/components/shared/count-badge"

export function MobileCartDropdown() {
    const [open, setOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const { items, totalItems, subtotal, removeFromCart, updateQuantity } = useCart()
    const t = useTranslations('CartDropdown')
    const tNav = useTranslations('Navigation')
    const locale = useLocale()

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat(locale === 'bg' ? 'bg-BG' : 'en-IE', {
            style: 'currency',
            currency: 'EUR',
        }).format(price)
    }

    const contentMaxHeight = useMemo(() => {
        if (items.length === 0) return 'max-h-(--wishlist-drawer-max-h-empty)'
        if (items.length <= 2) return 'max-h-(--wishlist-drawer-max-h-few)'
        return 'max-h-(--wishlist-drawer-max-h)'
    }, [items.length])

    const buildProductUrl = useCallback((item: CartItem) => {
        const sellerSlug = item.username ?? item.storeSlug
        if (!sellerSlug) return "#"
        return `/${sellerSlug}/${item.slug || item.id}`
    }, [])

    useEffect(() => {
        setMounted(true)
    }, [])

    // Avoid Radix/React hydration mismatch warnings in dev by not SSR-rendering
    // Drawer internals (ids/aria-* can differ if cart state is client-initialized).
    if (!mounted) {
        return (
            <Link
                href="/cart"
                className="flex items-center justify-center size-10 rounded-md relative hover:bg-header-hover active:bg-header-active touch-action-manipulation tap-transparent"
                aria-label={tNav('cart')}
            >
                <span className="relative" aria-hidden="true">
                    <ShoppingCart size={24} weight="regular" className="text-header-text" />
                </span>
            </Link>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <button
                    className="flex items-center justify-center size-10 rounded-md relative hover:bg-header-hover active:bg-header-active touch-action-manipulation tap-transparent"
                    aria-label={tNav('cart')}
                >
                    <span className="relative" aria-hidden="true">
                        <ShoppingCart size={24} weight="regular" className="text-header-text" />
                        {totalItems > 0 && (
                            <CountBadge
                                count={totalItems}
                                max={9}
                                className="absolute -top-0.5 -right-1 bg-cart-badge text-primary-foreground ring-2 ring-header-bg h-4 min-w-4 px-1 text-2xs"
                                aria-hidden="true"
                            />
                        )}
                    </span>
                </button>
            </DrawerTrigger>
            <DrawerContent className="rounded-t-xl">
                <DrawerHeader className="pb-1.5 pt-0 border-b border-border text-left">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <ShoppingCart size={16} weight="regular" className="text-muted-foreground" />
                            <DrawerTitle className="text-sm font-semibold">{t('title')}</DrawerTitle>
                            <span className="text-xs text-muted-foreground" suppressHydrationWarning>
                                ({totalItems})
                            </span>
                        </div>
                        <DrawerClose asChild>
                            <button
                                className="text-xs text-muted-foreground hover:text-foreground h-touch-xs px-2 rounded-md hover:bg-muted touch-action-manipulation tap-transparent"
                                aria-label={t('close')}
                            >
                                {t('close')}
                            </button>
                        </DrawerClose>
                    </div>
                    <DrawerDescription className="sr-only">
                        {t('description')}
                    </DrawerDescription>
                </DrawerHeader>

                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-inset py-5">
                        <div className="size-11 bg-muted rounded-lg flex items-center justify-center mb-2">
                            <ShoppingCart size={22} weight="regular" className="text-muted-foreground/50" />
                        </div>
                        <p className="text-sm text-foreground font-medium">{t('empty')}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {t('emptyDescription')}
                        </p>
                    </div>
                ) : (
                    <DrawerBody className={cn("px-inset", contentMaxHeight)}>
                        {items.map((item, index) => (
                            <div
                                key={`${item.id}:${item.variantId ?? ""}`}
                                className={cn(
                                    "flex gap-2 py-2",
                                    index !== items.length - 1 && "border-b border-border"
                                )}
                            >
                                <Link
                                    href={buildProductUrl(item)}
                                    onClick={() => setOpen(false)}
                                    className="shrink-0"
                                >
                                    <div className="size-14 bg-muted rounded-md overflow-hidden border border-border">
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                width={56}
                                                height={56}
                                                className="size-full object-cover"
                                                priority={index === 0}
                                                loading={index === 0 ? "eager" : "lazy"}
                                            />
                                        ) : (
                                            <div className="size-full flex items-center justify-center text-muted-foreground">
                                                <Package size={20} weight="regular" />
                                            </div>
                                        )}
                                    </div>
                                </Link>
                                <div className="flex-1 min-w-0 flex flex-col">
                                    <Link
                                        href={buildProductUrl(item)}
                                        onClick={() => setOpen(false)}
                                        className="text-sm text-foreground hover:text-brand line-clamp-2 leading-snug"
                                    >
                                        {item.title}
                                    </Link>
                                    {item.variantName && (
                                        <span className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                            {item.variantName}
                                        </span>
                                    )}
                                    <div className="flex items-center justify-between mt-auto pt-1">
                                        <span className="text-sm font-semibold text-foreground">{formatPrice(item.price)}</span>
                                        <div className="flex items-center gap-0.5">
                                            <div className="flex items-center bg-muted rounded-md">
                                                <button
                                                    onClick={() => {
                                                        if (item.quantity > 1) {
                                                            updateQuantity(item.id, item.quantity - 1, item.variantId)
                                                    } else {
                                                        removeFromCart(item.id, item.variantId)
                                                    }
                                                }}
                                                    className="flex items-center justify-center size-touch-xs rounded-md hover:bg-background text-muted-foreground hover:text-foreground touch-action-manipulation tap-transparent"
                                                    aria-label={t('decreaseQuantity')}
                                                >
                                                    <Minus size={14} weight="bold" />
                                                </button>
                                                <span className="text-xs font-medium text-foreground w-6 text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1, item.variantId)}
                                                    className="flex items-center justify-center size-touch-xs rounded-md hover:bg-background text-muted-foreground hover:text-foreground touch-action-manipulation tap-transparent"
                                                    aria-label={t('increaseQuantity')}
                                                >
                                                    <Plus size={14} weight="bold" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id, item.variantId)}
                                                className="flex items-center justify-center size-touch-xs rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive touch-action-manipulation tap-transparent"
                                                aria-label={t('removeItem')}
                                            >
                                                <Trash size={14} weight="regular" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </DrawerBody>
                )}

                <DrawerFooter className="border-t border-border gap-1.5">
                    {items.length === 0 ? (
                        <Button variant="cta" size="default" className="w-full" asChild>
                            <Link href="/search" onClick={() => setOpen(false)}>
                                {t('startShopping')}
                            </Link>
                        </Button>
                    ) : (
                        <>
                            <div className="flex items-center justify-between py-1">
                                <span className="text-xs text-muted-foreground">{t('subtotal')}</span>
                                <span className="text-base font-bold text-foreground">{formatPrice(subtotal)}</span>
                            </div>
                            <Button variant="cta" size="default" className="w-full" asChild>
                                <Link href="/checkout" onClick={() => setOpen(false)}>
                                    {t('checkout')}
                                </Link>
                            </Button>
                            <Button variant="outline" size="sm" className="w-full" asChild>
                                <Link href="/cart" onClick={() => setOpen(false)}>
                                    {t('viewCart')}
                                </Link>
                            </Button>
                        </>
                    )}
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
