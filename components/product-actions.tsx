"use client"

import { useState } from "react"
import { Play } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/components/providers/cart-context"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

interface ProductActionsProps {
  product: {
    id: string
    title: string
    price: number
    image_url: string
    stock: number
  }
}

export function ProductActions({ product }: ProductActionsProps) {
  const [quantity, setQuantity] = useState("1")
  const { addToCart } = useCart()
  const router = useRouter()
  const t = useTranslations('Product')

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image_url,
      quantity: Number.parseInt(quantity),
    })
    toast.success(t('addedToCart'))
  }

  const handleBuyNow = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image_url,
      quantity: Number.parseInt(quantity),
    })
    router.push("/cart")
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm">{t('quantity')}:</span>
        <Select value={quantity} onValueChange={setQuantity}>
          <SelectTrigger className="w-20 h-9 rounded-sm bg-background border-border focus:ring-brand focus:ring-offset-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[...Array(Math.min(10, product.stock || 5))].map((_, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()}>
                {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        className="w-full bg-cta-add-cart hover:bg-cta-add-cart-hover text-foreground rounded-sm h-9"
        onClick={handleAddToCart}
      >
        {t('addToCart')}
      </Button>

      <Button
        className="w-full bg-cta-buy-now hover:bg-cta-buy-now/90 text-white rounded-sm h-9"
        onClick={handleBuyNow}
      >
        <Play size={12} weight="fill" className="mr-2" />
        {t('buyNow')}
      </Button>

      <div className="text-xs text-muted-foreground mt-2 space-y-1">
        <div className="flex gap-2">
          <span className="w-20 text-muted-foreground">{t('shipsFrom')}</span>
          <span className="text-foreground">{t('amazonStore')}</span>
        </div>
        <div className="flex gap-2">
          <span className="w-20 text-muted-foreground">{t('soldBy')}</span>
          <span className="text-link hover:underline cursor-pointer">{t('amazonStore')}</span>
        </div>
        <div className="flex gap-2">
          <span className="w-20 text-muted-foreground">{t('returns')}</span>
          <span className="text-link hover:underline cursor-pointer">{t('returnsPolicy')}</span>
        </div>
      </div>
    </div>
  )
}
