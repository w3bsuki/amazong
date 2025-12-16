"use client"

import Image from "next/image"
import Link from "next/link"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useCart } from "@/lib/cart-context"
import { WishlistButton } from "@/components/wishlist-button"
import { ProductCardMenu } from "@/components/product-card-menu"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { productBlurDataURL } from "@/lib/image-utils"
import { CheckCircle, ShoppingCart, ShieldCheck, Sparkle, Star, Tag } from "@phosphor-icons/react"

export interface UltimateCardProps {
  id: string
  title: string
  price: number
  originalPrice?: number | null
  image: string
  rating?: number
  reviews?: number
  seller: {
    id?: string
    name: string
    avatar?: string
    verified?: boolean
    rating?: number
    location?: string
  }
  attributes?: Array<{ label: string; value: string }>
  badges?: string[]
  tags?: string[]
  isBoosted?: boolean
  shipping?: string
  condition?: string
  categorySlug?: string
  brand?: string
  inStock?: boolean
  slug?: string
  className?: string
}

export function UltimateMarketplaceCard({
  id,
  title,
  price,
  originalPrice,
  image,
  rating = 0,
  reviews = 0,
  seller,
  attributes = [],
  badges = [],
  tags = [],
  isBoosted = false,
  shipping,
  condition,
  categorySlug: _categorySlug,
  brand,
  inStock = true,
  slug,
  className
}: UltimateCardProps) {
  const { addToCart } = useCart()

  // Logic from ProductCard for smart pills
  const smartPills = (() => {
    const pills: Array<{ key: string; label: string; icon: 'tag' | 'check' }> = []
    const normalizedCondition = (condition || '').trim()
    const normalizedBrand = (brand || '').trim()
    
    // 1. Stock (if out)
    if (inStock === false) pills.push({ key: 'stock:out', label: 'Out of stock', icon: 'check' })
    
    // 2. Brand
    if (normalizedBrand) pills.push({ key: `brand:${normalizedBrand}`, label: normalizedBrand, icon: 'tag' })
    
    // 3. Condition
    if (normalizedCondition) pills.push({ key: `cond:${normalizedCondition}`, label: normalizedCondition, icon: 'tag' })
    
    // 4. Tags (up to 1)
    const usefulTag = tags.find(t => t.length <= 15 && t !== normalizedBrand && t !== normalizedCondition)
    if (usefulTag) pills.push({ key: `tag:${usefulTag}`, label: usefulTag, icon: 'tag' })

    return pills.slice(0, 2) // Limit to 2 like ProductCard ultimate variant
  })()

  const hasDiscount = originalPrice && originalPrice > price
  const discountPercent = hasDiscount 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0

  const formatPrice = (p: number) => 
    new Intl.NumberFormat('bg-BG', { style: 'currency', currency: 'BGN' }).format(p)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (inStock === false) {
      toast.error("Out of stock")
      return
    }

    addToCart({
      id,
      title,
      price,
      image,
      quantity: 1,
      slug,
      username: seller.name
    })
    toast.success("Added to cart")
  }

  const productUrl = slug ? `/product/${slug}` : `/product/${id}`
  const sellerDisplayName = seller.name

  const getInitials = (name: string) =>
    name
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)

  return (
    <Link href={productUrl} className={cn("block group", className)}>
      <div
        className={cn(
          "overflow-hidden flex flex-col group relative bg-card border border-border min-w-0 rounded-md",
          "transition-shadow",
          isBoosted && "ring-1 ring-primary/20"
        )}
      >
        {/* Seller header (seller-first trust) */}
        <div className={cn("flex items-center justify-between gap-2 border-b", "bg-muted/20 px-2.5 py-2")}>
          <div className="flex items-center gap-2 min-w-0">
            <Avatar className="h-8 w-8 border">
              <AvatarImage src={seller.avatar} alt={sellerDisplayName} />
              <AvatarFallback className="text-[10px] bg-muted">{getInitials(sellerDisplayName)}</AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-xs font-semibold text-foreground truncate">{sellerDisplayName}</span>
                {seller.verified && <ShieldCheck size={14} weight="fill" className="text-primary shrink-0" />}
              </div>

              <div className="flex items-center gap-1 text-[10px] text-muted-foreground min-w-0">
                {(seller.rating || 0) > 0 && (
                  <span className="inline-flex items-center gap-1 shrink-0">
                    <Star size={12} weight="fill" className="text-muted-foreground" />
                    <span>{(seller.rating || 0).toFixed(1)}</span>
                  </span>
                )}
                {seller.location && (
                  <span className="truncate">{seller.location}</span>
                )}
              </div>
            </div>
          </div>

          {/* Keep menu reachable without forcing navigation */}
          <div
            className="shrink-0"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <ProductCardMenu productUrl={productUrl} title={title} />
          </div>
        </div>

        {/* Image container */}
        <div className="relative w-full bg-muted overflow-hidden">
          <AspectRatio ratio={1}>
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              fill
              placeholder="blur"
              blurDataURL={productBlurDataURL()}
              className={cn(
                "object-cover"
              )}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
            />

            {/* Promoted + discount badges */}
            <div className="absolute top-1.5 left-1.5 z-10 flex flex-col gap-1">
              {isBoosted && (
                <Badge variant="secondary" className="gap-1 bg-background/90 backdrop-blur-sm">
                  <Sparkle size={12} weight="fill" className="text-primary" />
                  <span className="text-[10px] font-semibold">Promoted</span>
                </Badge>
              )}
              {hasDiscount && discountPercent >= 10 && (
                <Badge className="bg-deal text-white border-0">
                  <span className="text-[10px] font-semibold">-{discountPercent}%</span>
                </Badge>
              )}
            </div>

            {/* Wishlist */}
            <div
              className="absolute top-1.5 right-1.5 z-10"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
            >
              <WishlistButton product={{ id, title, price, image }} />
            </div>

            {/* Desktop hover quick action (keeps vertical density) */}
            <div
              className={cn(
                "absolute inset-x-2 bottom-2 z-10 hidden md:flex",
                "opacity-0 translate-y-1 transition-all",
                "group-hover:opacity-100 group-hover:translate-y-0"
              )}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
            >
              <button
                onClick={handleAddToCart}
                disabled={inStock === false}
                className={cn(
                  "h-9 w-full rounded-md border text-xs font-semibold transition-colors inline-flex items-center justify-center gap-2",
                  "bg-foreground text-background border-foreground hover:bg-foreground/90",
                  inStock === false && "opacity-60 cursor-not-allowed"
                )}
                aria-label={inStock === false ? "Out of stock" : "Add to cart"}
              >
                <ShoppingCart size={14} weight="bold" />
                {inStock === false ? "Out of stock" : "Add to cart"}
              </button>
            </div>
          </AspectRatio>
        </div>

        {/* Content */}
        <div className="min-w-0 p-2.5 space-y-1.5">
          <h3 className="text-foreground group-hover:underline decoration-muted-foreground/40 underline-offset-2 leading-snug text-sm line-clamp-2">
            {title}
          </h3>

          {/* Product rating + reviews (kept compact) */}
          {(rating || 0) > 0 && (
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Star size={12} weight="fill" className="text-muted-foreground" />
                <span className="font-medium text-foreground">{(rating || 0).toFixed(1)}</span>
              </span>
              {reviews > 0 && <span>({reviews})</span>}
              {shipping && <span className="truncate">· {shipping}</span>}
            </div>
          )}

          {/* Smart pills + key attributes */}
          {(smartPills.length > 0 || attributes.length > 0) && (
            <div className="flex flex-wrap gap-1.5">
              {smartPills.map((pill) => (
                <span
                  key={pill.key}
                  className="inline-flex items-center gap-1 rounded-full border bg-muted/20 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                >
                  {pill.icon === 'check' ? (
                    <CheckCircle size={12} weight="fill" className="text-muted-foreground" />
                  ) : (
                    <Tag size={12} className="text-muted-foreground" />
                  )}
                  {pill.label}
                </span>
              ))}

              {attributes
                .filter((a) => a?.value)
                .slice(0, 2)
                .map((attr) => (
                  <span
                    key={`${attr.label}:${attr.value}`}
                    className="inline-flex items-center rounded-full border bg-muted/10 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                  >
                    {attr.value}
                  </span>
                ))}

              {badges
                .filter(Boolean)
                .slice(0, 1)
                .map((b) => (
                  <Badge
                    key={`badge:${b}`}
                    variant="secondary"
                    className="h-5 px-2 text-[10px] font-medium"
                  >
                    {b}
                  </Badge>
                ))}
            </div>
          )}

          {/* Price row */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <span className={cn("text-sm font-semibold", hasDiscount ? "text-deal" : "text-foreground")}>
              {formatPrice(price)}
              {hasDiscount && originalPrice && (
                <span className="ml-1 text-xs font-normal text-muted-foreground line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </span>

            {/* Mobile action (desktop uses hover overlay) */}
            <div
              className="flex md:hidden"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
            >
              <button
                onClick={handleAddToCart}
                disabled={inStock === false}
                className={cn(
                  "h-8 px-3 rounded-md border text-xs font-semibold transition-colors inline-flex items-center gap-1.5",
                  "bg-foreground text-background border-foreground hover:bg-foreground/90",
                  inStock === false && "opacity-60 cursor-not-allowed"
                )}
                aria-label={inStock === false ? "Out of stock" : "Add to cart"}
              >
                <ShoppingCart size={14} weight="bold" />
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
