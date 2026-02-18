import * as React from "react"
import { useCart } from "@/components/providers/cart-context"
import { useWishlist } from "@/components/providers/wishlist-context"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Heart, Plus, ShoppingCart } from "lucide-react";

import { IconButton } from "@/components/ui/icon-button"

// =============================================================================
// PRODUCT CARD ACTIONS - Client-only interactive elements
// =============================================================================

interface ProductCardActionsProps {
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
    size?: "icon-sm" | "icon" | "icon-lg" | "icon-compact" | "icon-default" | "icon-primary"
    overlayDensity?: "default" | "compact"
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
    size = "icon-default",
    overlayDensity = "default",
}: ProductCardActionsProps) {
    const { addToCart, items: cartItems } = useCart()
    const { isInWishlist, toggleWishlist } = useWishlist()
    const t = useTranslations("Product")
    const tCart = useTranslations("Cart")

    const [isWishlistPending, setIsWishlistPending] = React.useState(false)

    const inWishlist = isInWishlist(id)
    const inCart = React.useMemo(() => cartItems.some((item) => item.id === id), [cartItems, id])
    const overlaySizeClass = overlayDensity === "compact" ? "size-7 [&_svg]:size-3.5" : ""

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
                <IconButton
                    type="button"
                    variant="ghost"
                    size={size}
                    className={cn(
                        "rounded-full border border-border-subtle bg-surface-card",
                        "hover:bg-hover active:bg-active",
                        overlaySizeClass,
                        inWishlist
                            ? "border-selected-border text-primary"
                            : "text-muted-foreground hover:text-foreground",
                        isWishlistPending && "pointer-events-none opacity-50",
                        isOwnProduct && "cursor-not-allowed opacity-50"
                    )}
                    onClick={handleWishlist}
                    disabled={isWishlistPending || isOwnProduct}
                    aria-label={inWishlist ? t("removeFromWatchlist") : t("addToWatchlist")}
                >
                    <Heart
                        className={cn(overlayDensity === "compact" ? "size-3.5" : "size-4", inWishlist && "fill-primary text-primary")}
                    />
                </IconButton>
            )}

            {showQuickAdd && (
                <IconButton
                    type="button"
                    variant={inCart ? "default" : "outline"}
                    size={size}
                    className={cn(
                      inCart
                        ? "bg-primary text-primary-foreground hover:bg-interactive-hover"
                        : "border-border-subtle bg-background text-muted-foreground hover:bg-hover active:bg-active",
                      overlaySizeClass,
                      (!inStock || isOwnProduct) && "cursor-not-allowed opacity-50"
                    )}
                    onClick={handleAddToCart}
                    disabled={isOwnProduct || !inStock}
                    aria-label={inCart ? t("inCart") : t("addToCart")}
                >
                    {inCart ? (
                        <ShoppingCart className={overlayDensity === "compact" ? "size-4" : "size-5"} />
                    ) : (
                        <Plus className={overlayDensity === "compact" ? "size-4" : "size-5"} />
                    )}
                </IconButton>
            )}
        </div>
    )
}

