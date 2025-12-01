"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { WishlistButton } from "@/components/wishlist-button"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"

interface AddToCartProps {
    product: {
        id: string
        title: string
        price: number
        image: string
        seller_id?: string
    }
    currentUserId?: string | null
}

export function AddToCart({ product, currentUserId }: AddToCartProps) {
    const { addToCart } = useCart()
    const t = useTranslations('Product')
    const [isPending, setIsPending] = useState(false)

    // Check if user is trying to buy their own product
    const isOwnProduct = currentUserId && product.seller_id && currentUserId === product.seller_id

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
        })
        // Redirect to cart/checkout would happen here
        window.location.href = "/cart"
    }

    return (
        <div className="flex flex-col gap-3">
            <Button
                onClick={handleAddToCart}
                disabled={isPending || isOwnProduct}
                className="w-full bg-cta-add-cart hover:bg-cta-add-cart-hover text-foreground border-none rounded-sm h-9 text-[13px] font-normal disabled:opacity-50"
                title={isOwnProduct ? "You cannot purchase your own products" : undefined}
            >
                {isPending ? "Adding..." : isOwnProduct ? "Your Product" : t('addToCart')}
            </Button>
            <Button
                onClick={handleBuyNow}
                disabled={isOwnProduct}
                className="w-full bg-cta-buy-now hover:bg-cta-buy-now/90 text-white border-none rounded-sm h-9 text-[13px] font-normal disabled:opacity-50"
                title={isOwnProduct ? "You cannot purchase your own products" : undefined}
            >
                {t('buyNow')}
            </Button>
            <WishlistButton 
                product={product} 
                variant="button" 
                className="w-full"
            />
        </div>
    )
}
