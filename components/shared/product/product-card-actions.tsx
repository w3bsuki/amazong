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
            {/* Wishlist button - Top Right */}
            {showWishlist && (
                <button
                    type="button"
                    className={cn(
                        "absolute right-1.5 top-1.5 z-10 flex size-touch-sm items-center justify-center rounded-full outline-none transition-colors duration-100 focus-visible:ring-2 focus-visible:ring-ring",
                        !inWishlist && "lg:pointer-events-none lg:opacity-0 lg:group-hover:pointer-events-auto lg:group-hover:opacity-100 lg:transition-opacity lg:duration-100",
                        inWishlist
                            ? "bg-product-wishlist-active text-white"
                            : "bg-background/80 text-foreground/70 shadow-sm backdrop-blur-sm hover:bg-background hover:text-foreground active:bg-product-wishlist active:text-white",
                        isWishlistPending && "pointer-events-none opacity-50",
                        className
                    )}
                    onClick={handleWishlist}
                    disabled={isWishlistPending}
                    aria-label={inWishlist ? t("removeFromWatchlist") : t("addToWatchlist")}
                >
                    <Heart size={14} weight={inWishlist ? "fill" : "bold"} />
                </button>
            )}

            {/* Quick-Add Button - Desktop only, in content area */}
            {showQuickAdd && (
                <button
                    type="button"
                    className={cn(
                        "hidden lg:flex size-touch-sm shrink-0 items-center justify-center rounded-md outline-none transition-colors duration-100 focus-visible:ring-2 focus-visible:ring-ring",
                        inCart
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary active:bg-primary active:text-primary-foreground",
                        (!inStock || isOwnProduct) && "cursor-not-allowed opacity-40"
                    )}
                    onClick={handleAddToCart}
                    disabled={isOwnProduct || !inStock}
                    aria-label={inCart ? t("inCart") : t("addToCart")}
                    data-slot="quick-add"
                >
                    {inCart ? (
                        <ShoppingCart size={14} weight="fill" />
                    ) : (
                        <Plus size={14} weight="bold" />
                    )}
                </button>
            )}
        </>
    )
}
