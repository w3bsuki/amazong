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
                className="w-full bg-[#f7ca00] hover:bg-[#f2bd00] text-black border-none rounded-[20px] shadow-sm h-[36px] text-[13px]"
            >
                {isPending ? "Adding..." : t('addToCart')}
            </Button>
            <Button
                onClick={handleBuyNow}
                className="w-full bg-[#fa8900] hover:bg-[#e37b00] text-black border-none rounded-[20px] shadow-sm h-[36px] text-[13px]"
            >
                {t('buyNow')}
            </Button>
        </div>
    )
}
