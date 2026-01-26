"use client"

import * as React from "react"
import { Car, CheckCircle2, Heart, Laptop, MessageCircle, Repeat2, ShieldCheck, Shirt, Sparkles, Star, Store, Tag, Truck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProductCard as RealProductCard } from "@/components/shared/product/product-card"
import { cn } from "@/lib/utils"

// =============================================================================
// MARKETPLACE BADGES
// =============================================================================

function CategoryBadge({
  type,
  label,
  className,
}: {
  type: "fashion" | "tech" | "auto" | (string & {})
  label: string
  className?: string
}) {
  // NOTE: Keep this as a very small wrapper for the design-system2 sandbox page.
  // The production category badge lives at `components/shared/product/category-badge.tsx`.
  return (
    <Badge variant="category" className={cn("gap-1.5 rounded-md px-2.5 py-1", className)}>
      <span aria-hidden className="inline-flex items-center justify-center rounded-sm bg-background p-0.5">
        {type === "fashion" ? (
          <Shirt className="size-3 text-muted-foreground" />
        ) : type === "tech" ? (
          <Laptop className="size-3 text-muted-foreground" />
        ) : type === "auto" ? (
          <Car className="size-3 text-muted-foreground" />
        ) : (
          <TagFallbackIcon />
        )}
      </span>
      <span className="font-medium">{label}</span>
    </Badge>
  )
}

function TagFallbackIcon() {
  return <Tag className="size-3 text-muted-foreground" />
}

function SellerBadge({
  type,
  className,
}: {
  type: "business" | "verified" | "new"
  className?: string
}) {
  if (type === "business") {
    return (
      <Badge variant="info" className={cn("gap-1.5 rounded-md", className)}>
        <Store className="size-3.5" />
        Business
      </Badge>
    )
  }

  if (type === "verified") {
    return (
      <Badge variant="verified" className={cn("gap-1.5 rounded-md", className)}>
        <ShieldCheck className="size-3.5" />
        Verified
      </Badge>
    )
  }

  return (
    <Badge variant="success-subtle" className={cn("gap-1.5 rounded-md", className)}>
      <Sparkles className="size-3.5" />
      New
    </Badge>
  )
}

// =============================================================================
// AVATARS / SOCIAL PROOF
// =============================================================================

function AvatarGroup({
  users,
  limit,
  size = "md",
  className,
}: {
  users: Array<{ name?: string; initials: string; image?: string | null }>
  limit?: number
  size?: "sm" | "md"
  className?: string
}) {
  const max = Math.max(0, limit ?? users.length)
  const shown = users.slice(0, max)
  const remaining = Math.max(0, users.length - shown.length)

  const sizeClass = size === "sm" ? "size-7 text-2xs" : "size-9 text-xs"

  return (
    <div className={cn("flex items-center -space-x-3", className)}>
      {shown.map((u, idx) => (
        <Avatar key={`${u.initials}-${idx}`} className={cn("border-2 border-background", sizeClass)}>
          {u.image ? <AvatarImage src={u.image} alt={u.name ?? u.initials} /> : null}
          <AvatarFallback className={cn("font-medium", sizeClass)}>{u.initials}</AvatarFallback>
        </Avatar>
      ))}
      {remaining > 0 ? (
        <div
          className={cn(
            "grid place-content-center rounded-full border-2 border-background bg-muted font-medium text-muted-foreground",
            sizeClass
          )}
        >
          +{remaining}
        </div>
      ) : null}
    </div>
  )
}

function SocialProof({
  rating,
  reviewCount,
  verified,
  label,
  className,
}: {
  rating: number
  reviewCount: number
  verified?: boolean
  label?: string
  className?: string
}) {
  const stars = Math.max(0, Math.min(5, Math.round(rating)))

  return (
    <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-1 text-sm", className)}>
      <div className="inline-flex items-center gap-1">
        <div className="inline-flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn("size-4", i < stars ? "fill-current text-rating" : "text-muted-foreground/40")}
            />
          ))}
        </div>
        <span className="font-semibold">{rating.toFixed(1)}</span>
        <span className="text-muted-foreground">({formatCount(reviewCount)})</span>
      </div>

      {label ? (
        <Badge variant="neutral-subtle" className="rounded-md">
          {label}
        </Badge>
      ) : null}

      {verified ? (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
          <CheckCircle2 className="size-4" />
          Verified
        </span>
      ) : null}
    </div>
  )
}

function formatCount(count: number) {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
  return `${count}`
}

// =============================================================================
// PRODUCT CARD (WRAPPER)
// =============================================================================

type DesignSystemProduct = {
  title: string
  price: number
  originalPrice?: number
  rating?: number
  reviews?: number
  image: string
  badges?: {
    bestSeller?: boolean
    prime?: boolean
    discount?: string
  }
}

function ProductCard({ product }: { product: DesignSystemProduct }) {
  const id = slugify(product.title)
  const salePercent = parseSalePercent(product.badges?.discount)

  return (
    <RealProductCard
      id={id}
      title={product.title}
      price={product.price}
      image={product.image}
      {...(typeof product.originalPrice === "number" ? { originalPrice: product.originalPrice } : {})}
      {...(typeof product.rating === "number" ? { rating: product.rating } : {})}
      {...(typeof product.reviews === "number" ? { reviews: product.reviews } : {})}
      {...(salePercent != null ? { isOnSale: true, salePercent } : {})}
      {...(product.badges?.prime ? { freeShipping: true } : {})}
      showQuickAdd={false}
      showWishlist={false}
      showSeller={false}
    />
  )
}

function parseSalePercent(input: string | undefined) {
  if (!input) return null
  const m = input.match(/-?\s*(\d{1,3})\s*%/)
  if (!m) return null
  const n = Number(m[1])
  if (!Number.isFinite(n)) return null
  return Math.max(0, Math.min(99, n))
}

function slugify(input: string) {
  const s = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
  return s || "product"
}

// =============================================================================
// SOCIAL CARD (TWEET-LIKE)
// =============================================================================

function TweetCard({
  author,
  content,
  metrics,
  timestamp,
  className,
}: {
  author: { name: string; handle: string; avatar: string; verified?: boolean }
  content: string
  metrics: { likes: number; retweets: number; replies: number }
  timestamp: string
  className?: string
}) {
  return (
    <div className={cn("rounded-2xl border bg-background p-4", className)}>
      <div className="flex items-start gap-3">
        <Avatar className="size-10">
          <AvatarImage src={author.avatar} alt={author.name} />
          <AvatarFallback>{author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            <span className="font-semibold">{author.name}</span>
            {author.verified ? <CheckCircle2 className="size-4 text-primary" /> : null}
            <span className="text-muted-foreground">{author.handle}</span>
            <span className="text-muted-foreground">· {timestamp}</span>
          </div>

          <p className="mt-2 text-sm leading-6">{content}</p>

          <div className="mt-3 flex items-center gap-5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="size-4" />
              {formatCount(metrics.replies)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Repeat2 className="size-4" />
              {formatCount(metrics.retweets)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Heart className="size-4" />
              {formatCount(metrics.likes)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// FILTER SIDEBAR (STATIC DEMO)
// =============================================================================

function FilterSidebar({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4 text-sm", className)}>
      <div className="flex items-center justify-between">
        <div className="font-semibold">Filters</div>
        <Button type="button" variant="ghost" size="xs" className="h-7 px-2">
          Clear
        </Button>
      </div>
      <Separator />

      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Shipping</div>
        <label className="flex items-center gap-2">
          <Checkbox defaultChecked />
          <span className="inline-flex items-center gap-1.5">
            <Truck className="size-4" />
            Free shipping
          </span>
        </label>
      </div>

      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Seller</div>
        <label className="flex items-center gap-2">
          <Checkbox />
          Verified sellers
        </label>
        <label className="flex items-center gap-2">
          <Checkbox />
          Business sellers
        </label>
      </div>
    </div>
  )
}

export {
  // Re-export real primitives
  Button,
  Badge,
  Avatar,
  AvatarImage,
  AvatarFallback,
  // Design-system2 helpers
  SellerBadge,
  CategoryBadge,
  AvatarGroup,
  SocialProof,
  ProductCard,
  TweetCard,
  FilterSidebar,
}
