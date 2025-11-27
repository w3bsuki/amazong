"use client"

import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWishlist } from "@/lib/wishlist-context"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface WishlistButtonProps {
  product: {
    id: string
    title: string
    price: number
    image: string
  }
  variant?: "icon" | "button"
  className?: string
}

export function WishlistButton({ product, variant = "icon", className }: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist } = useWishlist()
  const [isPending, setIsPending] = useState(false)
  
  const inWishlist = isInWishlist(product.id)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsPending(true)
    try {
      await toggleWishlist(product)
    } finally {
      setIsPending(false)
    }
  }

  if (variant === "button") {
    return (
      <Button
        variant="outline"
        onClick={handleClick}
        disabled={isPending}
        className={cn(
          "gap-2 min-h-11",
          inWishlist && "text-brand-deal border-brand-deal hover:text-brand-deal/80 hover:border-brand-deal/80",
          className
        )}
      >
        <Heart
          className={cn(
            "h-4 w-4 transition-all",
            inWishlist && "fill-current",
            isPending && "animate-pulse"
          )}
        />
        {inWishlist ? "Saved" : "Save for Later"}
      </Button>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "p-2 rounded-full bg-white/90 hover:bg-white shadow-sm transition-all",
        "focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2",
        "disabled:opacity-50",
        className
      )}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-all",
          inWishlist ? "fill-brand-deal text-brand-deal" : "text-muted-foreground hover:text-brand-deal",
          isPending && "animate-pulse"
        )}
      />
    </button>
  )
}
