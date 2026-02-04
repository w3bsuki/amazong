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
        <div className={cn("flex items-center gap-2", className)}>
            {showWishlist && (
                <button
                    type="button"
                    className={cn(
                        "inline-flex size-11 items-center justify-center rounded-xl border border-border outline-none transition-colors",
                        "bg-surface-glass backdrop-blur-md",
                        inWishlist
                            ? "text-primary"
                            : "text-muted-foreground hover:text-foreground active:text-primary",
                        "focus-visible:ring-2 focus-visible:ring-focus-ring",
                        isWishlistPending && "pointer-events-none opacity-50",
                        isOwnProduct && "cursor-not-allowed opacity-50"
                    )}
                    onClick={handleWishlist}
                    disabled={isWishlistPending || isOwnProduct}
                    aria-label={inWishlist ? t("removeFromWatchlist") : t("addToWatchlist")}
                    data-slot="wishlist"
                >
                    <Heart
                        className={cn("size-5", inWishlist && "fill-primary text-primary")}
                        weight={inWishlist ? "fill" : "regular"}
                    />
                </button>
            )}

            {showQuickAdd && (
                <button
                    type="button"
                    className={cn(
                        "inline-flex size-11 items-center justify-center rounded-xl border outline-none transition-colors",
                        inCart
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-muted-foreground hover:bg-muted active:bg-active",
                        "focus-visible:ring-2 focus-visible:ring-focus-ring",
                        (!inStock || isOwnProduct) && "cursor-not-allowed opacity-50"
                    )}
                    onClick={handleAddToCart}
                    disabled={isOwnProduct || !inStock}
                    aria-label={inCart ? t("inCart") : t("addToCart")}
                    data-slot="quick-add"
                >
                    {inCart ? (
                        <ShoppingCart className="size-5" weight="fill" />
                    ) : (
                        <Plus className="size-5" weight="bold" />
                    )}
                </button>
            )}
        </div>
    )
}
