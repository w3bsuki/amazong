"use client"

import { useState } from "react"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

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

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image_url,
      quantity: Number.parseInt(quantity),
    })
    toast.success("Added to Cart")
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
        <span className="text-sm">Quantity:</span>
        <Select value={quantity} onValueChange={setQuantity}>
          <SelectTrigger className="w-20 h-8 rounded-md bg-background border-border focus:ring-brand focus:ring-offset-0">
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
        className="w-full bg-brand hover:bg-brand/90 text-foreground rounded-full h-9"
        onClick={handleAddToCart}
      >
        Add to Cart
      </Button>

      <Button
        className="w-full bg-brand-deal hover:bg-brand-deal/90 text-white rounded-full h-9"
        onClick={handleBuyNow}
      >
        <Play className="h-3 w-3 fill-current mr-2" />
        Buy Now
      </Button>

      <div className="text-xs text-muted-foreground mt-2 space-y-1">
        <div className="flex gap-2">
          <span className="w-20 text-muted-foreground">Ships from</span>
          <span className="text-foreground">Amazon</span>
        </div>
        <div className="flex gap-2">
          <span className="w-20 text-muted-foreground">Sold by</span>
          <span className="text-link hover:underline cursor-pointer">Amazon</span>
        </div>
        <div className="flex gap-2">
          <span className="w-20 text-muted-foreground">Returns</span>
          <span className="text-link hover:underline cursor-pointer">30-day refund/replacement</span>
        </div>
      </div>
    </div>
  )
}
