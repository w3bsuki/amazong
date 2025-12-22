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
    <Card className={cn("overflow-hidden border border-border/50 bg-background/50 shadow-sm rounded-2xl backdrop-blur-sm ring-1 ring-border/5", className)}>
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-border/50 bg-muted/20 px-4 py-3">
        <div className="flex size-8 items-center justify-center rounded-xl bg-background border border-border/50 shadow-inner">
          <Package className="size-4 text-primary" />
        </div>
        <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          {isBg ? "Преглед на обявата" : "Listing Preview"}
        </span>
        <Badge variant="outline" className="ml-auto h-5 rounded-full border-primary/20 bg-primary/10 px-2.5 text-[9px] font-bold text-primary uppercase tracking-widest ring-1 ring-primary/10">
          {isBg ? "Чернова" : "Draft"}
        </Badge>
      </div>

      <CardContent className="p-5">
        {/* Images */}
        {listing.images.length > 0 && (
          <div className="mb-5 flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {listing.images.slice(0, 4).map((img, idx) => (
              <div
                key={idx}
                className="relative size-24 shrink-0 overflow-hidden rounded-xl border border-border/50 bg-muted/30 shadow-sm ring-1 ring-border/5 transition-transform hover:scale-105"
              >
                <Image
                  src={img.url}
                  alt={`Product image ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
                {idx === 0 && (
                  <div className="absolute bottom-1.5 left-1.5 rounded-lg bg-black/60 px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-white backdrop-blur-md ring-1 ring-white/20">
                    {isBg ? "Основна" : "Main"}
                  </div>
                )}
              </div>
            ))}
            {listing.images.length > 4 && (
              <div className="flex size-24 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-muted/30 text-xs font-bold text-muted-foreground shadow-sm ring-1 ring-border/5">
                +{listing.images.length - 4}
              </div>
            )}
          </div>
        )}

        {/* Title & Price */}
        <div className="mb-5">
          <h3 className="text-lg font-bold tracking-tight leading-tight text-foreground">{listing.title}</h3>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-2xl font-bold tracking-tighter text-primary">
              {listing.price.toFixed(2)} лв.
            </span>
            {listing.brand && (
              <Badge variant="secondary" className="rounded-lg text-[10px] font-bold uppercase tracking-widest bg-muted/50 border border-border/50">
                {listing.brand}
              </Badge>
            )}
          </div>
        </div>

        {/* Condition & Category */}
        <div className="mb-5 flex flex-wrap gap-2">
          <Badge variant="secondary" className="rounded-xl bg-muted/50 text-foreground border border-border/50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest shadow-xs">
            <Tag className="mr-2 size-3.5 text-primary" />
            {conditionLabel}
          </Badge>
          {listing.categorySlug && (
            <Badge variant="outline" className="rounded-xl border-border/50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground capitalize shadow-xs">
              {listing.categorySlug.replace(/-/g, " ")}
            </Badge>
          )}
        </div>

        {/* Description preview */}
        <p className="mb-6 line-clamp-3 text-sm font-medium leading-relaxed text-muted-foreground/90">
          {listing.description}
        </p>

        {/* Attributes */}
        {listing.attributes && listing.attributes.length > 0 && (
          <div className="mb-6 grid grid-cols-2 gap-x-6 gap-y-4 rounded-2xl border border-border/50 bg-muted/10 p-5 shadow-inner ring-1 ring-border/5">
            {listing.attributes.slice(0, 4).map((attr, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/70">
                  {attr.name}
                </span>
                <span className="text-sm font-bold tracking-tight text-foreground">{attr.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={onEdit}
            className="flex-1 h-11 rounded-xl border-border/60 text-[11px] font-bold uppercase tracking-widest gap-2 shadow-sm hover:bg-muted/50 transition-all active:scale-95"
            disabled={isPublishing}
          >
            <Pencil className="size-4" />
            {isBg ? "Редактирай" : "Edit"}
          </Button>
          <Button
            size="lg"
            onClick={onPublish}
            className="flex-1 h-11 rounded-xl text-[11px] font-bold uppercase tracking-widest gap-2 shadow-md transition-all active:scale-95"
            disabled={isPublishing}
          >
            {isPublishing ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {isBg ? "Публикуване..." : "Publishing..."}
              </>
            ) : (
              <>
                <Check className="size-4" />
                {isBg ? "Публикувай" : "Publish"}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
