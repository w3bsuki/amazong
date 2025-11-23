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
          <SelectTrigger className="w-20 h-8 rounded-md bg-white shadow-sm border-zinc-300 focus:ring-[#e77600] focus:ring-offset-0">
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
        className="w-full bg-[#f7ca00] hover:bg-[#f2bd00] text-black rounded-full h-9 shadow-sm"
        onClick={handleAddToCart}
      >
        Add to Cart
      </Button>

      <Button
        className="w-full bg-[#fa8900] hover:bg-[#ef8000] text-black rounded-full h-9 shadow-sm"
        onClick={handleBuyNow}
      >
        <Play className="h-3 w-3 fill-current mr-2" />
        Buy Now
      </Button>

      <div className="text-xs text-zinc-500 mt-2 space-y-1">
        <div className="flex gap-2">
          <span className="w-20 text-zinc-500">Ships from</span>
          <span className="text-zinc-900">Amazon</span>
        </div>
        <div className="flex gap-2">
          <span className="w-20 text-zinc-500">Sold by</span>
          <span className="text-zinc-900 text-[#007185] hover:underline cursor-pointer">Amazon</span>
        </div>
        <div className="flex gap-2">
          <span className="w-20 text-zinc-500">Returns</span>
          <span className="text-zinc-900 text-[#007185] hover:underline cursor-pointer">30-day refund/replacement</span>
        </div>
      </div>
    </div>
  )
}
