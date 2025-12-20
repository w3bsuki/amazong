"use client"

import * as React from "react"
import Image from "next/image"
import { Check, Pencil, Tag, Package } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export interface ListingPreviewData {
  title: string
  description: string
  price: number
  categorySlug?: string
  condition: string
  images: { url: string }[]
  brand?: string
  attributes?: { name: string; value: string }[]
}

interface ListingPreviewCardProps {
  listing: ListingPreviewData
  locale?: string
  onEdit?: () => void
  onPublish?: () => void
  isPublishing?: boolean
  className?: string
}

const conditionLabels: Record<string, { en: string; bg: string }> = {
  new: { en: "New", bg: "Ново" },
  used: { en: "Used", bg: "Използвано" },
  like_new: { en: "Like New", bg: "Като ново" },
  good: { en: "Good", bg: "Добро" },
  fair: { en: "Fair", bg: "Задоволително" },
  refurbished: { en: "Refurbished", bg: "Обновено" },
}

export function ListingPreviewCard({
  listing,
  locale = "en",
  onEdit,
  onPublish,
  isPublishing = false,
  className,
}: ListingPreviewCardProps) {
  const isBg = locale === "bg"
  const conditionLabel = conditionLabels[listing.condition]?.[isBg ? "bg" : "en"] || listing.condition

  return (
    <Card className={cn("overflow-hidden border border-border bg-background shadow-xs rounded-xl", className)}>
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-border/50 bg-muted/10 px-4 py-3">
        <div className="flex size-7 items-center justify-center rounded-md bg-background border border-border shadow-xs">
          <Package className="size-3.5 text-muted-foreground" />
        </div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
          {isBg ? "Преглед на обявата" : "Listing Preview"}
        </span>
        <Badge variant="outline" className="ml-auto h-5 rounded-md border-primary/20 bg-primary/5 px-2 text-[10px] font-bold text-primary uppercase tracking-wider">
          {isBg ? "Чернова" : "Draft"}
        </Badge>
      </div>

      <CardContent className="p-4">
        {/* Images */}
        {listing.images.length > 0 && (
          <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {listing.images.slice(0, 4).map((img, idx) => (
              <div
                key={idx}
                className="relative size-20 shrink-0 overflow-hidden rounded-md border border-border/50 bg-muted/30 shadow-xs"
              >
                <Image
                  src={img.url}
                  alt={`Product image ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
                {idx === 0 && (
                  <div className="absolute bottom-1 left-1 rounded-sm bg-black/70 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                    {isBg ? "Основна" : "Main"}
                  </div>
                )}
              </div>
            ))}
            {listing.images.length > 4 && (
              <div className="flex size-20 shrink-0 items-center justify-center rounded-md border border-border/50 bg-muted/30 text-xs font-bold text-muted-foreground shadow-xs">
                +{listing.images.length - 4}
              </div>
            )}
          </div>
        )}

        {/* Title & Price */}
        <div className="mb-4">
          <h3 className="text-base font-bold tracking-tight leading-snug text-foreground">{listing.title}</h3>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-primary">
              {listing.price.toFixed(2)} лв.
            </span>
            {listing.brand && (
              <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider border-border/50 bg-muted/5">
                {listing.brand}
              </Badge>
            )}
          </div>
        </div>

        {/* Condition & Category */}
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge variant="secondary" className="rounded-md bg-muted/50 text-foreground border-border/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            <Tag className="mr-1.5 size-3 text-muted-foreground" />
            {conditionLabel}
          </Badge>
          {listing.categorySlug && (
            <Badge variant="outline" className="rounded-md border-border/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground capitalize">
              {listing.categorySlug.replace(/-/g, " ")}
            </Badge>
          )}
        </div>

        {/* Description preview */}
        <p className="mb-5 line-clamp-3 text-xs font-medium leading-relaxed text-muted-foreground/80">
          {listing.description}
        </p>

        {/* Attributes */}
        {listing.attributes && listing.attributes.length > 0 && (
          <div className="mb-5 grid grid-cols-2 gap-x-6 gap-y-3 rounded-xl border border-border/50 bg-muted/5 p-4 shadow-xs">
            {listing.attributes.slice(0, 4).map((attr, idx) => (
              <div key={idx} className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                  {attr.name}
                </span>
                <span className="text-xs font-bold tracking-tight text-foreground">{attr.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex-1 h-9 rounded-md border-border/60 text-[11px] font-bold uppercase tracking-wider gap-2 shadow-xs hover:bg-muted/50"
            disabled={isPublishing}
          >
            <Pencil className="size-3.5" />
            {isBg ? "Редактирай" : "Edit"}
          </Button>
          <Button
            size="sm"
            onClick={onPublish}
            className="flex-1 h-9 rounded-md text-[11px] font-bold uppercase tracking-wider gap-2 shadow-xs"
            disabled={isPublishing}
          >
            {isPublishing ? (
              <>
                <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {isBg ? "Публикуване..." : "Publishing..."}
              </>
            ) : (
              <>
                <Check className="size-3.5" />
                {isBg ? "Публикувай" : "Publish"}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
