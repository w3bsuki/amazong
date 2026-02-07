"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { ShoppingCart, Package, Minus, Plus, Trash, X } from "@phosphor-icons/react"
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
import { IconButton } from "@/components/ui/icon-button"
import { Link } from "@/i18n/routing"
import { useTranslations, useLocale } from "next-intl"
import { useCart, type CartItem } from "@/components/providers/cart-context"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { CountBadge } from "@/components/shared/count-badge"

export function MobileCartDropdown() {
    const [open, setOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const { items, totalItems, isReady, subtotal, removeFromCart, updateQuantity } = useCart()
    const t = useTranslations('CartDropdown')
    const tNav = useTranslations('Navigation')
    const locale = useLocale()
    const displayItems = isReady ? totalItems : 0

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
                className="relative flex size-touch-md items-center justify-center rounded-md tap-transparent hover:bg-header-hover active:bg-header-active touch-manipulation"
                aria-label={tNav('cart')}
            >
                <span className="relative" aria-hidden="true">
                    <ShoppingCart className="size-icon-header text-header-text" weight="regular" />
                </span>
            </Link>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <button
                    className="relative flex size-touch-md appearance-none items-center justify-center rounded-md border-0 bg-transparent tap-transparent hover:bg-header-hover active:bg-header-active touch-manipulation"
                    aria-label={tNav('cart')}
                >
                    <span className="relative" aria-hidden="true">
                        <ShoppingCart className="size-icon-header text-header-text" weight="regular" />
                        {displayItems > 0 && (
                            <CountBadge
                                count={displayItems}
                                className="absolute -top-1 -right-1 h-4 min-w-4 bg-cart-badge px-1 text-2xs leading-none text-primary-foreground ring-1 ring-header-bg"
                                aria-hidden="true"
                            />
                        )}
                    </span>
                </button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="pb-1.5 pt-0 border-b border-border text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <ShoppingCart size={16} weight="regular" className="text-muted-foreground" />
                            <DrawerTitle className="text-sm font-semibold">{t('title')}</DrawerTitle>
                            <span className="text-xs text-muted-foreground" suppressHydrationWarning>
                                ({displayItems})
                            </span>
                        </div>
                        <DrawerClose asChild>
                            <IconButton
                                aria-label={t('close')}
                                variant="ghost"
                                size="icon-compact"
                                className="text-muted-foreground hover:text-foreground hover:bg-muted active:bg-muted"
                            >
                                <X size={20} weight="light" />
                            </IconButton>
                        </DrawerClose>
                    </div>
                    <DrawerDescription className="sr-only">
                        {t('description')}
                    </DrawerDescription>
                </DrawerHeader>

                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-inset py-5">
                        <div className="mb-2 flex size-(--control-default) items-center justify-center rounded-xl bg-muted">
                            <ShoppingCart size={22} weight="regular" className="text-muted-foreground" />
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
                                    "flex gap-1.5 py-2",
                                    index !== items.length - 1 && "border-b border-border"
                                )}
                            >
                                <Link
                                    href={buildProductUrl(item)}
                                    onClick={() => setOpen(false)}
                                    className="shrink-0"
                                >
                                    <div className="size-14 bg-muted rounded-xl overflow-hidden border border-border">
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
                                        className="text-sm text-foreground hover:text-primary line-clamp-2 leading-snug"
                                    >
                                        {item.title}
                                    </Link>
                                    {item.variantName && (
                                        <span className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                            {item.variantName}
                                        </span>
                                    )}
                                    <div className="mt-auto flex flex-col gap-1.5 pt-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold tabular-nums text-foreground">{formatPrice(item.price)}</span>
                                            <IconButton
                                                data-vaul-no-drag
                                                aria-label={t('removeItem')}
                                                variant="ghost"
                                                size="icon-compact"
                                                className="hover:bg-destructive-subtle text-muted-foreground hover:text-destructive"
                                                onClick={() => removeFromCart(item.id, item.variantId)}
                                            >
                                                <Trash weight="regular" />
                                            </IconButton>
                                        </div>
                                        <div className="flex items-center justify-end gap-1">
                                            <IconButton
                                                data-vaul-no-drag
                                                aria-label={t('decreaseQuantity')}
                                                variant="ghost"
                                                size="icon-compact"
                                                className="hover:bg-muted text-muted-foreground hover:text-foreground"
                                                onClick={() => {
                                                    if (item.quantity > 1) {
                                                        updateQuantity(item.id, item.quantity - 1, item.variantId)
                                                    } else {
                                                        removeFromCart(item.id, item.variantId)
                                                    }
                                                }}
                                            >
                                                <Minus weight="bold" />
                                            </IconButton>
                                            <span className="min-w-touch text-sm font-medium tabular-nums text-foreground text-center">
                                                {item.quantity}
                                            </span>
                                            <IconButton
                                                data-vaul-no-drag
                                                aria-label={t('increaseQuantity')}
                                                variant="ghost"
                                                size="icon-compact"
                                                className="hover:bg-muted text-muted-foreground hover:text-foreground"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1, item.variantId)}
                                            >
                                                <Plus weight="bold" />
                                            </IconButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </DrawerBody>
                )}

                <DrawerFooter className="border-t border-border gap-1">
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
                            <Button variant="outline" size="default" className="w-full" asChild>
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
