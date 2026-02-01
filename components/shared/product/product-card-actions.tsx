"use client"

import * as React from "react"
import { useCart } from "@/components/providers/cart-context"
import { useWishlist } from "@/components/providers/wishlist-context"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Heart, Plus, ShoppingCart } from "@phosphor-icons/react"

// =============================================================================
// PRODUCT CARD ACTIONS - Client-only interactive elements
// =============================================================================

export interface ProductCardActionsProps {
    // Required for cart/wishlist
    id: string
    title: string
    price: number
    image: string

    // Optional product info
    slug?: string | null
    username?: string | null

    // Feature toggles
    showQuickAdd?: boolean
    showWishlist?: boolean

    // Stock/ownership
    inStock?: boolean
    isOwnProduct?: boolean

    // Styling
    className?: string
}

/**
 * ProductCardActions - Client component for cart/wishlist buttons
 * 
 * Extracted from ProductCard to allow server-side rendering of display content
 * while keeping interactive elements client-side.
 */
export function ProductCardActions({
    id,
    title,
    price,
    image,
    slug,
    username,
    showQuickAdd = true,
    showWishlist = true,
    inStock = true,
    isOwnProduct = false,
    className,
}: ProductCardActionsProps) {
    const { addToCart, items: cartItems } = useCart()
    const { isInWishlist, toggleWishlist } = useWishlist()
    const t = useTranslations("Product")
    const tCart = useTranslations("Cart")

    const [isWishlistPending, setIsWishlistPending] = React.useState(false)

    const inWishlist = isInWishlist(id)
    const inCart = React.useMemo(() => cartItems.some((item) => item.id === id), [cartItems, id])

    const handleAddToCart = React.useCallback((e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (isOwnProduct) {
            toast.error(t("cannotBuyOwnProduct"))
            return
        }
        if (!inStock) {
            toast.error(t("outOfStock"))
            return
        }
        addToCart({
            id,
            title,
            price,
            image,
            quantity: 1,
            ...(slug ? { slug } : {}),
            ...(username ? { username } : {}),
        })
        toast.success(tCart("itemAdded"))
    }, [id, title, price, image, slug, username, isOwnProduct, inStock, addToCart, t, tCart])

    const handleWishlist = React.useCallback(async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (isWishlistPending) return
        setIsWishlistPending(true)
        try {
            await toggleWishlist({ id, title, price, image })
        } finally {
            setIsWishlistPending(false)
        }
    }, [id, title, price, image, isWishlistPending, toggleWishlist])

    return (
        <>
            {/* Wishlist button - Compact mobile (32px), slightly larger desktop (36px) */}
            {showWishlist && (
                <button
                    type="button"
                    className={cn(
                        "absolute right-1.5 top-1.5 lg:right-2 lg:top-2 z-10 size-touch-xs lg:size-touch-sm rounded-full flex items-center justify-center outline-none transition-colors scale-90 lg:scale-100",
                        !inWishlist && "lg:pointer-events-none lg:opacity-0 lg:group-hover:pointer-events-auto lg:group-hover:opacity-100 lg:transition-opacity lg:duration-100",
                        inWishlist
                            ? "bg-background/95 backdrop-blur text-wishlist-active"
                            : "bg-background/95 backdrop-blur text-muted-foreground hover:text-foreground active:text-wishlist-active",
                        isWishlistPending && "pointer-events-none opacity-50",
                        className
                    )}
                    onClick={handleWishlist}
                    disabled={isWishlistPending}
                    aria-label={inWishlist ? t("removeFromWatchlist") : t("addToWatchlist")}
                >
                    {/* Heart icon - size-icon-xs (20px) for ~62% fill ratio */}
                    <Heart 
                        className={cn(
                            "size-icon-xs",
                            inWishlist && "fill-wishlist-active text-wishlist-active"
                        )} 
                        weight={inWishlist ? "fill" : "regular"} 
                    />
                </button>
            )}

            {/* Quick-Add Button - Desktop only, compact (36px) */}
            {showQuickAdd && (
                <button
                    type="button"
                    className={cn(
                        "hidden lg:flex size-touch-sm shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground active:bg-muted outline-none transition-colors",
                        inCart && "border-foreground bg-foreground text-background",
                        (!inStock || isOwnProduct) && "cursor-not-allowed opacity-40"
                    )}
                    onClick={handleAddToCart}
                    disabled={isOwnProduct || !inStock}
                    aria-label={inCart ? t("inCart") : t("addToCart")}
                    data-slot="quick-add"
                >
                    {inCart ? (
                        <ShoppingCart className="size-icon-xs" weight="fill" />
                    ) : (
                        <Plus className="size-icon-xs" weight="bold" />
                    )}
                </button>
            )}
        </>
    )
}
