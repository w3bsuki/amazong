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
    }
}

export function AddToCart({ product }: AddToCartProps) {
    const { addToCart } = useCart()
    const t = useTranslations('Product')
    const [isPending, setIsPending] = useState(false)

    const handleAddToCart = () => {
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
                disabled={isPending}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-none rounded h-9 text-[13px] font-medium transition-colors"
            >
                {isPending ? "Adding..." : t('addToCart')}
            </Button>
            <Button
                onClick={handleBuyNow}
                className="w-full bg-brand hover:bg-brand-dark text-foreground border-none rounded h-9 text-[13px] font-medium transition-colors"
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
