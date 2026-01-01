"use client"

import { Heart } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/common/spinner"
import { useWishlist } from "@/components/providers/wishlist-context"
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
  const MIN_SPINNER_MS = 650
  
  const inWishlist = isInWishlist(product.id)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const startedAt = Date.now()
    setIsPending(true)
    try {
      await toggleWishlist(product)
    } finally {
      const elapsed = Date.now() - startedAt
      const remaining = MIN_SPINNER_MS - elapsed
      if (remaining > 0) {
        await new Promise((r) => setTimeout(r, remaining))
      }
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
          "gap-2 min-h-11 font-bold uppercase tracking-tight rounded-sm",
          inWishlist && "text-verified border-verified hover:text-verified/80 hover:border-verified/80",
          className
        )}
      >
        {isPending ? (
          <Spinner className="size-4" />
        ) : (
          <Heart
            size={16}
            weight={inWishlist ? "fill" : "regular"}
          />
        )}
        {inWishlist ? "Saved" : "Save for Later"}
      </Button>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "p-2 rounded-sm bg-background hover:bg-muted border border-border",
        "focus:outline-none focus:ring-1 focus:ring-verified focus:ring-offset-0",
        "disabled:opacity-50",
        className
      )}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isPending ? (
        <Spinner className="size-5" />
      ) : (
        <Heart
          size={20}
          weight={inWishlist ? "fill" : "regular"}
          className={inWishlist ? "text-verified" : "text-muted-foreground"}
        />
      )}
    </button>
  )
}
