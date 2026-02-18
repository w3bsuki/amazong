import {
  RefreshCw as ArrowsClockwise,
  Heart,
  Link as LinkSimple,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface QuickViewActionButtonsProps {
  copyAriaLabel: string
  wishlistAriaLabel: string
  closeAriaLabel: string
  inWishlist: boolean
  wishlistPending: boolean
  shareEnabled: boolean
  onCopyLink: () => void
  onToggleWishlist: () => void
  onRequestClose?: (() => void) | undefined
  buttonSize: "icon-default" | "icon-compact"
  iconSize: number
  closeIconClassName: string
  className?: string | undefined
}

interface QuickViewSellerSkeletonCardProps {
  className?: string | undefined
  titleSkeletonClassName?: string | undefined
  subtitleSkeletonClassName?: string | undefined
}

interface QuickViewProtectionCardProps {
  title: string
  subtitle: string
  easyReturns: string
  className?: string | undefined
}

interface QuickViewFooterActionsProps {
  buyNowLabel: string
  addToCartLabel: string
  addToCartAriaLabel?: string | undefined
  onBuyNow: () => void
  onAddToCart: () => void
  inStock: boolean
  className?: string | undefined
}

export function QuickViewActionButtons({
  copyAriaLabel,
  wishlistAriaLabel,
  closeAriaLabel,
  inWishlist,
  wishlistPending,
  shareEnabled,
  onCopyLink,
  onToggleWishlist,
  onRequestClose,
  buttonSize,
  iconSize,
  closeIconClassName,
  className,
}: QuickViewActionButtonsProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <IconButton
        type="button"
        variant="ghost"
        size={buttonSize}
        onClick={onCopyLink}
        aria-label={copyAriaLabel}
        disabled={!shareEnabled}
        className="border border-border-subtle bg-background text-muted-foreground hover:bg-hover hover:text-foreground active:bg-active"
      >
        <LinkSimple size={iconSize} />
      </IconButton>
      <IconButton
        type="button"
        variant="ghost"
        size={buttonSize}
        onClick={onToggleWishlist}
        aria-label={wishlistAriaLabel}
        disabled={wishlistPending}
        className={cn(
          "border border-border-subtle bg-background",
          inWishlist
            ? "text-primary hover:bg-hover active:bg-active"
            : "text-muted-foreground hover:bg-hover hover:text-foreground active:bg-active"
        )}
      >
        <Heart size={iconSize} className={cn(inWishlist && "fill-primary text-primary")} />
      </IconButton>
      <IconButton
        type="button"
        variant="ghost"
        size={buttonSize}
        className="border border-border-subtle bg-background text-muted-foreground hover:bg-hover hover:text-foreground active:bg-active"
        onClick={() => onRequestClose?.()}
        aria-label={closeAriaLabel}
      >
        <X className={closeIconClassName} />
      </IconButton>
    </div>
  )
}

export function QuickViewSellerSkeletonCard({
  className,
  titleSkeletonClassName,
  subtitleSkeletonClassName,
}: QuickViewSellerSkeletonCardProps) {
  return (
    <div className={cn("rounded-xl border border-border-subtle p-3", className)}>
      <div className="flex items-center gap-3">
        <Skeleton className="size-(--control-default) rounded-full" />
        <div className="min-w-0 flex-1 space-y-1.5">
          <Skeleton className={cn("h-4", titleSkeletonClassName)} />
          <Skeleton className={cn("h-3", subtitleSkeletonClassName)} />
        </div>
      </div>
    </div>
  )
}

export function QuickViewProtectionCard({
  title,
  subtitle,
  easyReturns,
  className,
}: QuickViewProtectionCardProps) {
  return (
    <div className={cn("rounded-xl border border-border-subtle p-3 text-sm text-muted-foreground", className)}>
      <div className="flex items-start gap-2">
        <ShieldCheck size={17} className="mt-0.5 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold tracking-tight text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs">
        <ArrowsClockwise size={16} className="shrink-0" />
        <span>{easyReturns}</span>
      </div>
    </div>
  )
}

export function QuickViewFooterActions({
  buyNowLabel,
  addToCartLabel,
  addToCartAriaLabel,
  onBuyNow,
  onAddToCart,
  inStock,
  className,
}: QuickViewFooterActionsProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-2", className)}>
      <Button
        type="button"
        variant="default"
        size="primary"
        className="w-full"
        onClick={onBuyNow}
        disabled={!inStock}
      >
        {buyNowLabel}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="primary"
        className="w-full"
        onClick={onAddToCart}
        aria-label={addToCartAriaLabel}
        disabled={!inStock}
      >
        {addToCartLabel}
      </Button>
    </div>
  )
}

export function QuickViewShippingBadge({
  freeShipping,
  label,
}: {
  freeShipping?: boolean | undefined
  label: string
}) {
  const isFreeShipping = Boolean(freeShipping)

  return (
    <Badge variant={isFreeShipping ? "shipping-free" : "shipping"} size="compact">
      <Truck />
      {label}
    </Badge>
  )
}
