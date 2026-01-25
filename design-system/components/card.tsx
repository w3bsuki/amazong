/**
 * Card Component - Reference Implementation
 * 
 * Twitter-style card with subtle borders and proper surfaces.
 * Optimized for product cards in a marketplace context.
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  "bg-card text-card-foreground",
  {
    variants: {
      variant: {
        // Default shadcn style
        default: "rounded-xl border border-border shadow-card",
        
        // Twitter style - subtle border, no shadow
        twitter: "rounded-xl border border-border",
        
        // Elevated - More shadow, floating effect
        elevated: "rounded-xl border border-border shadow-lg",
        
        // Flat - No border, just background
        flat: "rounded-xl",
        
        // Interactive - Hover effects
        interactive: "rounded-xl border border-border shadow-card transition-all duration-200 hover:shadow-card-hover hover:border-hover-border cursor-pointer",
        
        // Product card - Optimized for product grids
        product: "rounded-lg border border-border overflow-hidden transition-shadow duration-200 hover:shadow-card-hover",
        
        // Outline only
        outline: "rounded-xl border border-border bg-transparent",
      },
      padding: {
        none: "",
        sm: "p-3",
        default: "p-4",
        lg: "p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, className }))}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-4 pb-0", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-tight tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-4 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// === PRODUCT CARD CONVENIENCE COMPONENT ===

interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  image?: string
  title: string
  price: string
  originalPrice?: string
  condition?: string
  badge?: React.ReactNode
}

const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  ({ className, image, title, price, originalPrice, condition, badge, ...props }, ref) => (
    <Card
      ref={ref}
      variant="product"
      padding="none"
      className={cn(className)}
      {...props}
    >
      <div className="relative aspect-square w-full bg-muted">
        {image && (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover"
          />
        )}
        {badge && (
          <div className="absolute top-2 left-2">
            {badge}
          </div>
        )}
      </div>
      <div className="p-3 space-y-1">
        <h3 className="font-medium text-sm line-clamp-2 text-foreground">
          {title}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-foreground">{price}</span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {originalPrice}
            </span>
          )}
        </div>
        {condition && (
          <span className="text-xs text-muted-foreground">{condition}</span>
        )}
      </div>
    </Card>
  )
)
ProductCard.displayName = "ProductCard"

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  ProductCard,
  cardVariants,
}
