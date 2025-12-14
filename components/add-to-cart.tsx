"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { WishlistButton } from "@/components/wishlist-button"
import { useTranslations, useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface AddToCartProps {
    product: {
        id: string
        title: string
        price: number
        image: string
        seller_id?: string
        slug?: string
        storeSlug?: string | null
    }
    currentUserId?: string | null
    /** Style variant - default is amazon style, ebay is for eBay-style layout */
    variant?: "default" | "ebay" | "outline"
    /** Whether to show Buy Now button */
    showBuyNow?: boolean
    /** Custom class name */
    className?: string
}

export function AddToCart({ 
    product, 
    currentUserId,
    variant = "default",
    showBuyNow = true,
    className
}: AddToCartProps) {
    const { addToCart } = useCart()
    const t = useTranslations('Product')
    const locale = useLocale()
    const router = useRouter()
    const [isPending, setIsPending] = useState(false)

    // Check if user is trying to buy their own product
    const isOwnProduct = !!(currentUserId && product.seller_id && currentUserId === product.seller_id)

    const handleAddToCart = () => {
        if (isOwnProduct) {
            toast.error("You cannot purchase your own products")
            return
        }
        setIsPending(true)
        // Simulate a small delay for better UX
        setTimeout(() => {
            addToCart({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: 1,
                slug: product.slug,
                storeSlug: product.storeSlug,
            })
            toast.success(t('addedToCart'))
            setIsPending(false)
        }, 500)
    }

    const handleBuyNow = () => {
        if (isOwnProduct) {
            toast.error("You cannot purchase your own products")
            return
        }
        addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1,
            slug: product.slug,
            storeSlug: product.storeSlug,
        })
        // Navigate to cart with locale prefix
        router.push(`/${locale}/cart`)
    }

    // eBay-style variant with larger buttons
    if (variant === "ebay") {
        return (
            <div className={cn("flex flex-col gap-2", className)}>
                {showBuyNow && (
                    <Button
                        onClick={handleBuyNow}
                        disabled={isOwnProduct}
                        className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 disabled:opacity-50"
                        title={isOwnProduct ? "You cannot purchase your own products" : undefined}
                    >
                        {t('buyNow')}
                    </Button>
                )}
                <Button
                    onClick={handleAddToCart}
                    disabled={isPending || isOwnProduct}
                    variant="outline"
                    className="w-full h-12 text-base font-semibold disabled:opacity-50"
                    title={isOwnProduct ? "You cannot purchase your own products" : undefined}
                >
                    {isPending ? "Adding..." : isOwnProduct ? "Your Product" : t('addToCart')}
                </Button>
            </div>
        )
    }

    // Outline variant - just the add to cart button
    if (variant === "outline") {
        return (
            <Button
                onClick={handleAddToCart}
                disabled={isPending || isOwnProduct}
                variant="outline"
                className={cn("w-full h-12 text-base font-semibold disabled:opacity-50", className)}
                title={isOwnProduct ? "You cannot purchase your own products" : undefined}
            >
                {isPending ? "Adding..." : isOwnProduct ? "Your Product" : t('addToCart')}
            </Button>
        )
    }

    // Default Amazon-style
    return (
        <div className={cn("flex flex-col gap-3", className)}>
            <Button
                onClick={handleAddToCart}
                disabled={isPending || isOwnProduct}
                className="w-full bg-cta-add-cart hover:bg-cta-add-cart-hover text-foreground border-none rounded-sm h-9 text-sm font-normal disabled:opacity-50"
                title={isOwnProduct ? "You cannot purchase your own products" : undefined}
            >
                {isPending ? "Adding..." : isOwnProduct ? "Your Product" : t('addToCart')}
            </Button>
            {showBuyNow && (
                <Button
                    onClick={handleBuyNow}
                    disabled={isOwnProduct}
                    className="w-full bg-cta-buy-now hover:bg-cta-buy-now/90 text-white border-none rounded-sm h-9 text-sm font-normal disabled:opacity-50"
                    title={isOwnProduct ? "You cannot purchase your own products" : undefined}
                >
                    {t('buyNow')}
                </Button>
            )}
            <WishlistButton 
                product={product} 
                variant="button" 
                className="w-full"
            />
        </div>
    )
}
