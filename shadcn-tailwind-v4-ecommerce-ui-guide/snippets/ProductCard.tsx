import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Heart } from "lucide-react"

// Adapt this to your real product model.
export type Product = {
  id: string
  title: string
  imageUrl: string
  price: string
  oldPrice?: string
  rating?: number
  ratingCount?: number
  href: string
  isPromoted?: boolean
}

const productCardVariants = cva(
  [
    "group relative overflow-hidden",
    "rounded-lg bg-card text-card-foreground",
    "shadow-card",
    "transition-transform duration-150",
    "active:scale-[0.985]",
    "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
  ],
  {
    variants: {
      variant: {
        default: "p-2",
        promoted: "p-3",
        compact: "p-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export type ProductCardProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof productCardVariants> & {
    product: Product
    onToggleWishlist?: (id: string) => void
    wished?: boolean
  }

export function ProductCard({
  product,
  variant,
  className,
  onToggleWishlist,
  wished,
  ...props
}: ProductCardProps) {
  return (
    <div className={cn(productCardVariants({ variant }), className)} {...props}>
      {/* Whole card link area */}
      <a href={product.href} className="absolute inset-0 z-0" aria-label={product.title} />

      {/* Image */}
      <div className="relative z-10">
        <AspectRatio ratio={1} className="overflow-hidden rounded-md bg-muted">
          <img
            src={product.imageUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </AspectRatio>

        {/* Promo badge */}
        {product.isPromoted ? (
          <div className="absolute left-2 top-2">
            <Badge className="rounded-full bg-warning px-2 py-0.5 text-[11px] font-semibold text-warning-foreground">
              Promoted
            </Badge>
          </div>
        ) : null}

        {/* Wishlist button */}
        <div className="absolute right-2 top-2">
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="size-9 rounded-full shadow-sm"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onToggleWishlist?.(product.id)
            }}
            aria-pressed={!!wished}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={cn("size-4", wished ? "fill-current" : "")} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 mt-2 space-y-1">
        <div className="line-clamp-2 text-sm font-medium text-foreground/90">
          {product.title}
        </div>

        <div className="flex items-baseline gap-2">
          <div className="text-base font-semibold tracking-tight">{product.price}</div>
          {product.oldPrice ? (
            <div className="text-xs text-muted-foreground line-through">{product.oldPrice}</div>
          ) : null}
        </div>

        {typeof product.rating === "number" ? (
          <div className="text-xs text-muted-foreground">
            ★ {product.rating.toFixed(1)}
            {product.ratingCount ? ` (${product.ratingCount})` : ""}
          </div>
        ) : null}
      </div>
    </div>
  )
}
