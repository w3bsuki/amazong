"use client"

import { Heart } from "@phosphor-icons/react"
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
          inWishlist && "text-deal border-deal hover:text-deal/80 hover:border-deal/80",
          className
        )}
      >
        <Heart
          size={16}
          weight={inWishlist ? "fill" : "regular"}
          className={cn(
            "transition-all",
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
        "p-2 rounded-full bg-white/90 hover:bg-white shadow-sm",
        "focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2",
        "disabled:opacity-50",
        className
      )}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        size={20}
        weight={inWishlist ? "fill" : "regular"}
        className={cn(
          inWishlist ? "text-deal" : "text-muted-foreground hover:text-deal",
          isPending && "animate-pulse"
        )}
      />
    </button>
  )
}
