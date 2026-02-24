"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/providers/cart-context"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { ShoppingCart, LoaderCircle as SpinnerGap } from "lucide-react";


type SharedWishlistCartItem = {
  product_id: string
  product_title: string | null
  product_price: number | null
  product_image: string | null
}

export function AddAllToCartButton({ items }: { items: SharedWishlistCartItem[] }) {
  const t = useTranslations("Wishlist")
  const { addToCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  async function handleAddAll() {
    setIsLoading(true)
    try {
      for (const item of items) {
        addToCart({
          id: item.product_id,
          title: item.product_title || t("unknownProduct"),
          price: item.product_price ?? 0,
          image: item.product_image || "/placeholder.svg",
          quantity: 1,
        })
      }
      toast.success(t("addAllToCart"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleAddAll} disabled={isLoading || items.length === 0} className="gap-2">
      {isLoading ? <SpinnerGap className="size-4 animate-spin" /> : <ShoppingCart className="size-4" />}
      {t("addAllToCart")}
    </Button>
  )
}
