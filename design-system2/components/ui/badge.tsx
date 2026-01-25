import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        
        // Functional Variants (using new tokens)
        success: 
          "border-transparent bg-[var(--color-success-100)] text-[var(--color-success-900)] hover:bg-[var(--color-success-200)]",
        warning: 
          "border-transparent bg-[var(--color-warning-100)] text-[var(--color-warning-900)] hover:bg-[var(--color-warning-200)]",
        info: 
          "border-transparent bg-[var(--color-info-100)] text-[var(--color-info-900)] hover:bg-[var(--color-info-200)]",

        // Category Variants
        fashion: 
          "border-transparent bg-[var(--color-cat-fashion-100)] text-[var(--color-cat-fashion-900)] hover:bg-[var(--color-cat-fashion-50)]",
        tech:
          "border-transparent bg-[var(--color-cat-tech-100)] text-[var(--color-cat-tech-900)] hover:bg-[var(--color-cat-tech-50)]",
        auto:
          "border-transparent bg-[var(--color-cat-auto-100)] text-[var(--color-cat-auto-900)] hover:bg-[var(--color-cat-auto-50)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
