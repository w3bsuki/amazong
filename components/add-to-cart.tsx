"use client"

import { Button } from "@/components/ui/button"
import { useCart, type CartItem } from "@/lib/cart-context"
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white border-none rounded h-9 text-[13px] font-medium transition-colors"
            >
                {isPending ? "Adding..." : t('addToCart')}
            </Button>
            <Button
                onClick={handleBuyNow}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded h-9 text-[13px] font-medium transition-colors"
            >
                {t('buyNow')}
            </Button>
        </div>
    )
}
