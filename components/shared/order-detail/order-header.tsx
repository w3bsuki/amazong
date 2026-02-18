import { Copy as IconCopy } from "lucide-react"
import type { ReactNode } from "react"

import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface OrderHeaderProps {
  backHref?: string | undefined
  onBack?: (() => void) | undefined
  backButton: ReactNode
  backAriaLabel: string
  backButtonSize?: "icon" | "icon-sm" | "icon-compact" | undefined
  backButtonClassName?: string | undefined
  title: string
  orderId: string
  orderIdLength?: number | undefined
  uppercaseOrderId?: boolean | undefined
  titleClassName?: string | undefined
  subtitle: string
  subtitleClassName?: string | undefined
  copyAriaLabel: string
  onCopy: () => void
  inlineMeta?: ReactNode | undefined
  rightContent?: ReactNode | undefined
  className?: string | undefined
  leftClassName?: string | undefined
  headingClassName?: string | undefined
}

export function OrderHeader({
  backHref,
  onBack,
  backButton,
  backAriaLabel,
  backButtonSize = "icon",
  backButtonClassName,
  title,
  orderId,
  orderIdLength = 8,
  uppercaseOrderId = false,
  titleClassName,
  subtitle,
  subtitleClassName,
  copyAriaLabel,
  onCopy,
  inlineMeta,
  rightContent,
  className,
  leftClassName,
  headingClassName,
}: OrderHeaderProps) {
  const backTrigger = (
    <Button
      variant="ghost"
      size={backButtonSize}
      aria-label={backAriaLabel}
      className={backButtonClassName}
      onClick={onBack}
      type={onBack ? "button" : undefined}
    >
      {backButton}
    </Button>
  )

  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", className)}>
      <div className={cn("flex items-start gap-3", leftClassName)}>
        {backHref ? <Link href={backHref}>{backTrigger}</Link> : backTrigger}
        <div>
          <div className={cn("flex items-center gap-2 flex-wrap", headingClassName)}>
            <h1 className={cn("text-xl font-bold tracking-tight", titleClassName)}>
              {title} #{uppercaseOrderId ? orderId.slice(0, orderIdLength).toUpperCase() : orderId.slice(0, orderIdLength)}
            </h1>
            <Button variant="ghost" size="icon" className="size-6" onClick={onCopy} aria-label={copyAriaLabel}>
              <IconCopy className="size-3.5" />
            </Button>
            {inlineMeta}
          </div>
          <p className={cn("mt-1 text-sm text-muted-foreground", subtitleClassName)}>{subtitle}</p>
        </div>
      </div>
      {rightContent}
    </div>
  )
}
