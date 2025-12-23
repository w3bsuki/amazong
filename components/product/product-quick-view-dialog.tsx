"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ShoppingCart } from "@phosphor-icons/react"

export type QuickViewAttributePill = {
  key: string
  label: string
  icon?: "tag" | "check"
}

type ProductQuickViewDialogProps = {
  productUrl: string
  title: string
  image: string

  priceLabel: string
  originalPriceLabel?: string | null
  discountPercent?: number

  metaLine?: string | null
  attributePills?: QuickViewAttributePill[]

  ctaLabel: string
  isUnavailable?: boolean
  onAddToCart: () => void

  children: React.ReactNode
}

export function ProductQuickViewDialog({
  productUrl,
  title,
  image,
  priceLabel,
  originalPriceLabel,
  discountPercent,
  metaLine,
  attributePills,
  ctaLabel,
  isUnavailable,
  onAddToCart,
  children,
}: ProductQuickViewDialogProps) {
  const [open, setOpen] = React.useState(false)

  const pills = (attributePills ?? []).filter((p) => p?.label).slice(0, 3)
  const hasDiscount = !!(originalPriceLabel && discountPercent && discountPercent >= 1)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="truncate">{title}</DialogTitle>
          <DialogDescription className="sr-only">Quick view product details</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="rounded-md border overflow-hidden bg-muted">
              <AspectRatio ratio={1}>
                <Image
                  src={image || "/placeholder.svg"}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </AspectRatio>
            </div>

            {pills.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {pills.map((pill) => (
                  <span
                    key={pill.key}
                    className="inline-flex items-center rounded-full border bg-muted/20 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                  >
                    {pill.label}
                  </span>
                ))}
              </div>
            )}

            {metaLine && <p className="text-sm text-muted-foreground">{metaLine}</p>}
          </div>

          <div className="space-y-3">
            <div className="rounded-md border bg-card p-4 space-y-2">
              <div className="flex items-baseline justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-lg font-semibold text-foreground">{priceLabel}</div>
                  {originalPriceLabel && (
                    <div className="text-sm text-muted-foreground">
                      <span className="line-through">{originalPriceLabel}</span>
                      {hasDiscount && (
                        <span className="ml-2 text-xs font-semibold text-deal">-{discountPercent}%</span>
                      )}
                    </div>
                  )}
                </div>
                <Link
                  href={productUrl}
                  className={cn(
                    "text-xs font-medium text-primary underline underline-offset-2",
                    "shrink-0"
                  )}
                  onClick={() => setOpen(false)}
                >
                  View details
                </Link>
              </div>

              <Button
                type="button"
                className={cn(
                  "w-full",
                  "bg-primary text-primary-foreground border border-primary hover:bg-primary/90"
                )}
                disabled={!!isUnavailable}
                onClick={() => {
                  onAddToCart()
                  setOpen(false)
                }}
              >
                <ShoppingCart size={16} weight="bold" />
                {ctaLabel}
              </Button>
            </div>

            <div className="text-xs text-muted-foreground">
              Tip: Press Esc to close.
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
