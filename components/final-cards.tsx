"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { 
  Heart, 
  ShoppingCart, 
  ShieldCheck, 
  Star, 
  MapPin, 
  TrendUp,
  CheckCircle,
  Package,
  Truck,
  Storefront
} from "@phosphor-icons/react"

// Shared Types
export interface ProductAttribute {
  label: string
  value: string
  icon?: React.ReactNode
}

export interface FinalCardProps {
  id: string
  title: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  seller: {
    name: string
    avatar?: string
    verified: boolean
    rating: number
    location: string
    type?: "pro" | "private"
  }
  attributes: ProductAttribute[]
  badges?: string[]
  isBoosted?: boolean
  shipping?: string // e.g. "Free Shipping", "+$5.00"
  condition?: "New" | "Used" | "Refurbished"
  className?: string
}

const formatPrice = (p: number) => 
  new Intl.NumberFormat('bg-BG', { style: 'currency', currency: 'BGN' }).format(p)

// ============================================================================
// 1. THE "MARKETPLACE STANDARD" (The eBay Killer) - IMPROVED
// Best for: General listings, mixed categories.
// Philosophy: Trust-first header + information density + hover quick-add.
// ============================================================================
export function MarketplaceStandardCard({
  title,
  price,
  originalPrice,
  image,
  seller,
  attributes,
  badges,
  isBoosted,
  shipping,
  condition,
  className
}: FinalCardProps) {
  const [wishlisted, setWishlisted] = useState(false)
  
  // Calculate discount
  const hasDiscount = originalPrice && originalPrice > price
  const discountPercent = hasDiscount 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0

  return (
    <div className={cn(
      "group flex flex-col bg-card border border-border rounded-lg overflow-hidden transition-all duration-200",
      "hover:border-primary/50 hover:shadow-md",
      className
    )}>
      {/* Trust Header - Seller First */}
      <div className="px-2.5 py-2 flex items-center justify-between bg-muted/30 border-b border-border/50">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar className="h-6 w-6 border border-border">
            <AvatarImage src={seller.avatar} />
            <AvatarFallback className="text-[9px] bg-muted">{seller.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-xs font-semibold text-foreground truncate max-w-[100px]">{seller.name}</span>
            {seller.verified && <ShieldCheck size={12} weight="fill" className="text-blue-500 shrink-0" />}
          </div>
        </div>
        <div className="flex items-center gap-0.5 text-xs text-muted-foreground shrink-0">
          <Star weight="fill" size={10} className="text-amber-500" />
          <span className="font-medium">{seller.rating}</span>
        </div>
      </div>

      {/* Image Area */}
      <div className="relative aspect-square bg-muted/20 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal transition-transform duration-500 group-hover:scale-[1.02]" 
        />
        
        {/* Top Left: Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isBoosted && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground rounded shadow-sm">
              Sponsored
            </span>
          )}
          {hasDiscount && discountPercent >= 10 && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {condition && !isBoosted && !hasDiscount && (
            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-background/90 backdrop-blur-sm border border-border/50 rounded shadow-sm">
              {condition}
            </span>
          )}
        </div>

        {/* Top Right: Wishlist */}
        <button 
          onClick={(e) => { e.stopPropagation(); setWishlisted(!wishlisted) }}
          className={cn(
            "absolute top-2 right-2 p-1.5 rounded-full shadow-sm transition-all duration-200",
            "bg-background/80 backdrop-blur-sm",
            wishlisted 
              ? "text-red-500 scale-110" 
              : "text-muted-foreground hover:text-red-500 hover:bg-background hover:scale-110"
          )}
        >
          <Heart size={16} weight={wishlisted ? "fill" : "regular"} />
        </button>

        {/* Hover Quick-Add Button - Desktop Only */}
        <div className={cn(
          "absolute inset-x-0 bottom-0 p-2 transition-all duration-300",
          "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0",
          "hidden md:block"
        )}>
          <button
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "w-full h-9 rounded-lg text-xs font-semibold transition-colors",
              "bg-foreground text-background hover:bg-foreground/90",
              "flex items-center justify-center gap-1.5 shadow-lg"
            )}
          >
            <ShoppingCart size={14} weight="bold" />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-3 flex flex-col flex-1 gap-2">
        {/* Title */}
        <h3 className="font-medium text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Meta Line: Location + Condition */}
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          {condition && <span>{condition}</span>}
          {condition && seller.location && <span>•</span>}
          {seller.location && (
            <span className="flex items-center gap-0.5">
              <MapPin size={10} />
              {seller.location}
            </span>
          )}
        </div>

        {/* Tag Chips (Attributes or Badges) */}
        {(badges?.length || attributes.length > 0) && (
          <div className="flex flex-wrap gap-1">
            {(badges || attributes.map(a => a.value)).slice(0, 3).map((tag, i) => (
              <span 
                key={i} 
                className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-muted/80 text-[10px] text-muted-foreground border border-border/50"
              >
                {typeof tag === 'string' ? tag : (tag as any).value || tag}
              </span>
            ))}
          </div>
        )}

        {/* Price Block - Strong hierarchy */}
        <div className="flex flex-col mt-auto pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">{formatPrice(price)}</span>
            {originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          {shipping && (
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
              <Truck size={12} />
              <span>{shipping}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. THE "TRUST FLAGSHIP" (Refined)
// Best for: Cars, Real Estate, High-Ticket.
// Philosophy: Maximum trust, larger imagery, professional layout.
// ============================================================================
export function TrustFlagshipRefined({
  title,
  price,
  originalPrice,
  image,
  seller,
  attributes,
  badges,
  isBoosted,
  className
}: FinalCardProps) {
  return (
    <div className={cn("group flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300", className)}>
      {/* Header: Seller Context */}
      <div className="px-3 py-2 flex items-center justify-between bg-muted/30 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-foreground">{seller.name}</span>
            {seller.verified && <ShieldCheck size={12} weight="fill" className="text-blue-500" />}
          </div>
          <span className="text-[10px] text-muted-foreground">• {seller.location}</span>
        </div>
        {isBoosted && (
          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            Promoted
          </span>
        )}
      </div>

      {/* Image */}
      <div className="relative aspect-[16/10] bg-muted overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        <div className="absolute bottom-2 left-2 flex gap-1">
          {badges?.map(b => (
            <Badge key={b} variant="secondary" className="h-5 text-[10px] px-1.5 bg-background/90 backdrop-blur shadow-sm border-0">
              {b}
            </Badge>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex justify-between items-start gap-4">
          <h3 className="font-bold text-base leading-tight group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="text-right shrink-0">
            <div className="text-lg font-bold">{formatPrice(price)}</div>
            {originalPrice && (
              <div className="text-xs text-muted-foreground line-through">{formatPrice(originalPrice)}</div>
            )}
          </div>
        </div>

        {/* Key Attributes Grid */}
        <div className="grid grid-cols-2 gap-y-1 gap-x-4">
          {attributes.slice(0, 4).map((attr, i) => (
            <div key={i} className="flex items-center justify-between text-xs border-b border-border/40 pb-1 last:border-0">
              <span className="text-muted-foreground">{attr.label}</span>
              <span className="font-medium">{attr.value}</span>
            </div>
          ))}
        </div>

        {/* Action */}
        <Button className="w-full mt-1 font-semibold" size="sm">
          View Details
        </Button>
      </div>
    </div>
  )
}

// ============================================================================
// 3. THE "VISUAL GRID" (Pinterest/Instagram Style)
// Best for: Fashion, Decor, Art.
// Philosophy: Image first, details on hover/minimal.
// ============================================================================
export function VisualGridCard({
  title,
  price,
  image,
  seller,
  className
}: FinalCardProps) {
  return (
    <div className={cn("group relative bg-card rounded-lg overflow-hidden cursor-pointer", className)}>
      <div className="aspect-[3/4] overflow-hidden bg-muted">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
          <div className="text-white">
            <div className="font-medium text-sm line-clamp-1">{title}</div>
            <div className="flex items-center justify-between mt-1">
              <span className="font-bold">{formatPrice(price)}</span>
              <div className="flex items-center gap-1.5 text-xs opacity-90">
                <Avatar className="h-4 w-4 border border-white/20">
                  <AvatarImage src={seller.avatar} />
                  <AvatarFallback className="bg-white/10 text-white">{seller.name[0]}</AvatarFallback>
                </Avatar>
                <span className="truncate max-w-[80px]">{seller.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
