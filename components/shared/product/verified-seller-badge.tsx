import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface VerifiedSellerBadgeProps {
  label: string
  variant?: "badge" | "icon"
  size?: "sm" | "md"
  className?: string
}

export function VerifiedSellerBadge({
  label,
  variant = "badge",
  size = "sm",
  className,
}: VerifiedSellerBadgeProps) {
  if (variant === "icon") {
    return (
      <span
        role="img"
        aria-label={label}
        className={cn(
          "inline-flex items-center justify-center rounded-full border border-border-subtle bg-background text-primary shadow-sm",
          size === "md" ? "size-7" : "size-6",
          className
        )}
      >
        <Check className={cn(size === "md" ? "size-4" : "size-3.5")} aria-hidden="true" />
      </span>
    )
  }

  return (
    <Badge
      size="compact"
      variant="verified"
      className={cn("inline-flex items-center gap-1 text-2xs font-medium", className)}
    >
      <Check className="size-2.5" aria-hidden="true" />
      <span className="truncate">{label}</span>
    </Badge>
  )
}


