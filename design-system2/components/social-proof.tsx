import * as React from "react"
import { Star, StarHalf } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "./ui/badge"

interface SocialProofProps extends React.HTMLAttributes<HTMLDivElement> {
  rating?: number
  reviewCount?: number
  label?: string
  verified?: boolean
}

export function SocialProof({ 
  rating = 0, 
  reviewCount = 0, 
  label,
  verified = false,
  className,
  ...props 
}: SocialProofProps) {
  
  // Render generic stars
  const renderStars = () => {
    return Array.from({ length: 5 }).map((_, i) => {
      const filled = i < Math.floor(rating)
      const half = i === Math.floor(rating) && rating % 1 !== 0
      
      // Using generic warning color for stars
      const starColor = "fill-[var(--color-warning-500)] text-[var(--color-warning-500)]"
      const emptyColor = "text-muted-foreground/30"

      if (filled) {
        return <Star key={i} className={cn("w-4 h-4", starColor)} />
      }
      if (half) {
        return <StarHalf key={i} className={cn("w-4 h-4", starColor)} />
      }
      return <Star key={i} className={cn("w-4 h-4", emptyColor)} />
    })
  }

  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <div className="flex items-center gap-0.5">
        {renderStars()}
      </div>
      
      <div className="flex items-center gap-2 text-sm">
        <span className="font-bold text-foreground">{rating}</span>
        {reviewCount > 0 && (
          <span className="text-muted-foreground underline decoration-muted-foreground/50 hover:decoration-muted-foreground transition-all cursor-pointer">
            ({reviewCount.toLocaleString()} reviews)
          </span>
        )}
      </div>

      {verified && (
        <Badge variant="success" className="ml-2 h-5 px-1.5 text-[10px] uppercase tracking-wider">
          Verified Purchase
        </Badge>
      )}

      {label && (
        <span className="text-xs text-muted-foreground border-l pl-2 ml-1">
          {label}
        </span>
      )}
    </div>
  )
}
