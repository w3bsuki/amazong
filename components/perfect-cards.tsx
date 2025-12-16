"use client"

import { useState } from "react"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { 
  Heart, 
  ShoppingCart, 
  ShieldCheck, 
  Star, 
  MapPin, 
  Lightning,
  CheckCircle,
  Storefront,
  ChatCircleText,
  Package,
  TrendUp,
  Clock,
  Tag,
  Quotes,
  Users,
  Fire,
  Play,
  ShareNetwork,
  ThumbsUp,
  Timer
} from "@phosphor-icons/react"

// Types for our perfect cards
export interface ProductAttribute {
  label: string
  value: string
  icon?: React.ReactNode
}

export interface PerfectCardProps {
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
  stockLevel?: "in_stock" | "low_stock" | "out_of_stock"
  className?: string
}

const formatPrice = (p: number) => 
  new Intl.NumberFormat('bg-BG', { style: 'currency', currency: 'BGN' }).format(p)

// ============================================================================
// CARD 1: THE "TRUST FLAGSHIP"
// Best for: High-value items, Vehicles, Real Estate, Pro Sellers
// Evolution of: Card 17 + Card 14
// Features: Prominent Seller Header, Clear Attributes, Trust Signals
// ============================================================================
export function TrustFlagshipCard({
  title,
  price,
  originalPrice,
  image,
  seller,
  attributes,
  badges,
  isBoosted,
  className
}: PerfectCardProps) {
  const [wishlisted, setWishlisted] = useState(false)
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  return (
    <div className={cn("group flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300", className)}>
      {/* 1. Seller Header - Builds Trust Immediately */}
      <div className="px-3 py-2.5 flex items-center justify-between bg-muted/30 border-b border-border/50">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <Avatar className="h-8 w-8 border border-border ring-2 ring-background">
            <AvatarImage src={seller.avatar} />
            <AvatarFallback>{seller.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-center min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-foreground truncate">{seller.name}</span>
              {seller.verified && (
                <div className="bg-blue-100 text-blue-600 rounded-full p-0.5" title="Verified Seller">
                  <ShieldCheck size={10} weight="fill" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <div className="flex items-center text-amber-400">
                <Star size={10} weight="fill" />
                <span className="text-foreground font-medium ml-0.5">{seller.rating}</span>
              </div>
              <span className="text-border">•</span>
              <span className="truncate">{seller.location}</span>
            </div>
          </div>
        </div>
        {isBoosted && (
          <Badge variant="secondary" className="text-[10px] h-5 px-1.5 gap-1 bg-primary/10 text-primary hover:bg-primary/20 border-0 font-semibold">
            <TrendUp size={10} weight="bold" /> Promoted
          </Badge>
        )}
      </div>

      {/* 2. Media Area */}
      <div className="relative aspect-[4/3] bg-muted/20 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        
        {/* Badges Overlay */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {badges?.map(badge => (
            <span key={badge} className="px-2 py-0.5 text-[10px] font-bold bg-background/95 backdrop-blur-md rounded-md shadow-sm border border-border/50 text-foreground/80">
              {badge}
            </span>
          ))}
          {discount > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-bold bg-red-600 text-white rounded-md shadow-sm">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist Action */}
        <button 
          onClick={(e) => { e.stopPropagation(); setWishlisted(!wishlisted) }}
          className={cn(
            "absolute top-2 right-2 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm z-10",
            wishlisted 
              ? "bg-red-50 text-red-500 scale-110" 
              : "bg-background/60 backdrop-blur-md text-muted-foreground hover:bg-background hover:text-foreground hover:scale-105"
          )}
        >
          <Heart size={16} weight={wishlisted ? "fill" : "bold"} />
        </button>
      </div>

      {/* 3. Content Body */}
      <div className="p-3 flex flex-col gap-3 flex-1">
        {/* Title & Price */}
        <div className="space-y-1.5">
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors min-h-[2.5em]">
            {title}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-foreground tracking-tight">{formatPrice(price)}</span>
            {originalPrice && (
              <span className="text-xs text-muted-foreground line-through decoration-muted-foreground/60">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Category Attributes - The "Clean" Look */}
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {attributes.slice(0, 3).map((attr, i) => (
            <div key={i} className="inline-flex items-center px-2 py-1 rounded-md bg-secondary/50 border border-border/50 text-[10px] font-medium text-secondary-foreground/80">
              {attr.value}
            </div>
          ))}
          {attributes.length > 3 && (
            <span className="text-[10px] text-muted-foreground self-center font-medium">+{attributes.length - 3} more</span>
          )}
        </div>
      </div>

      {/* 4. Footer Actions */}
      <div className="p-3 pt-0 mt-1 grid grid-cols-[1fr_auto] gap-2">
        <Button size="sm" className="w-full text-xs font-bold h-9 shadow-sm hover:shadow-md transition-all">
          <ShoppingCart size={14} weight="bold" className="mr-2" />
          Add to Cart
        </Button>
        <Button size="sm" variant="outline" className="w-9 px-0 h-9 border-border shadow-sm hover:bg-secondary">
          <ChatCircleText size={16} weight="bold" />
        </Button>
      </div>
    </div>
  )
}

// ============================================================================
// CARD 2: THE "TECH SPEC" PRO
// Best for: Electronics, Hardware, Parts, Tools
// Evolution of: Card 16 + Card 13
// Features: High Data Density, Quick Specs, Compact
// ============================================================================
export function TechSpecProCard({
  title,
  price,
  originalPrice,
  image,
  seller,
  attributes,
  badges,
  className
}: PerfectCardProps) {
  return (
    <div className={cn("group relative bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors", className)}>
      <div className="flex p-3 gap-3">
        {/* Left: Image */}
        <div className="relative w-24 h-24 shrink-0 rounded-md overflow-hidden bg-muted/20 border border-border/50">
          <img src={image} alt={title} className="w-full h-full object-contain p-1" />
          {badges?.[0] && (
            <div className="absolute bottom-0 left-0 right-0 bg-foreground/90 text-background text-[9px] font-bold text-center py-0.5">
              {badges[0]}
            </div>
          )}
        </div>

        {/* Right: Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start gap-2">
              <h3 className="text-sm font-medium leading-tight line-clamp-2 text-foreground">
                {title}
              </h3>
              <button className="text-muted-foreground hover:text-red-500 transition-colors">
                <Heart size={16} />
              </button>
            </div>
            
            {/* Specs Grid - The "Category Specific" Magic */}
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2">
              {attributes.slice(0, 4).map((attr, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[10px] text-muted-foreground truncate">
                  <span className="w-1 h-1 rounded-full bg-primary/40 shrink-0" />
                  <span className="truncate">{attr.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-end justify-between mt-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-bold">{formatPrice(price)}</span>
                {originalPrice && <span className="text-xs text-muted-foreground line-through">{formatPrice(originalPrice)}</span>}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Storefront size={10} />
                <span className="truncate max-w-[80px]">{seller.name}</span>
              </div>
            </div>
            
            <Button size="sm" variant="secondary" className="h-7 text-xs px-3 hover:bg-primary hover:text-primary-foreground transition-colors">
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// CARD 3: THE "VISUAL DISCOVERY"
// Best for: Fashion, Home Decor, Art, Lifestyle
// Evolution of: Card 14 + Etsy Style
// Features: Immersive Image, Minimal UI, Hover Actions
// ============================================================================
export function VisualDiscoveryCard({
  title,
  price,
  originalPrice,
  image,
  seller,
  attributes,
  isBoosted,
  className
}: PerfectCardProps) {
  return (
    <div className={cn("group relative bg-card rounded-xl overflow-hidden border border-transparent hover:border-border transition-all", className)}>
      {/* Full Image Area */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Top Tags */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {isBoosted && (
            <Badge className="bg-white/90 text-black hover:bg-white border-0 text-[10px] px-2 h-5">
              Featured
            </Badge>
          )}
        </div>

        {/* Hover Actions */}
        <div className="absolute right-3 top-3 flex flex-col gap-2 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out">
          <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-sm">
            <Heart size={16} className="text-foreground" />
          </Button>
          <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-sm">
            <ShoppingCart size={16} className="text-foreground" />
          </Button>
        </div>

        {/* Bottom Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center gap-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
            <Avatar className="h-5 w-5 border border-white/20">
              <AvatarImage src={seller.avatar} />
              <AvatarFallback className="bg-white/10 text-white text-[8px]">{seller.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium text-white/90 shadow-black/50 drop-shadow-sm">{seller.name}</span>
          </div>

          <h3 className="font-medium text-sm leading-snug line-clamp-2 mb-1 drop-shadow-md">
            {title}
          </h3>
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold drop-shadow-md">{formatPrice(price)}</span>
            
            {/* Attributes appear on hover */}
            <div className="hidden group-hover:flex gap-1">
              {attributes.slice(0, 2).map((attr, i) => (
                <span key={i} className="text-[10px] bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                  {attr.value}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// CARD 4: THE "MARKETPLACE MINIMALIST"
// Best for: C2C, Vinted-style, Thrift, Quick Browse
// ============================================================================
export function MarketplaceMinimalistCard({
  title,
  price,
  image,
  seller,
  attributes,
  className
}: PerfectCardProps) {
  const [liked, setLiked] = useState(false)
  
  return (
    <div className={cn("group cursor-pointer", className)}>
      <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-muted/20 mb-2">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <button 
          onClick={(e) => { e.stopPropagation(); setLiked(!liked) }}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/5 hover:bg-black/10 text-white transition-colors"
        >
          <Heart size={18} weight={liked ? "fill" : "regular"} className={liked ? "text-red-500" : "text-white drop-shadow-sm"} />
        </button>
        {seller.verified && (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur rounded text-[10px] font-medium flex items-center gap-1">
            <ShieldCheck size={12} className="text-primary" />
            <span>Protected</span>
          </div>
        )}
      </div>
      
      <div className="space-y-0.5">
        <div className="flex justify-between items-start">
          <span className="font-bold text-base">{formatPrice(price)}</span>
          <span className="text-xs text-muted-foreground">{attributes[0]?.value}</span>
        </div>
        <h3 className="text-sm text-muted-foreground line-clamp-1">{title}</h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground/80">
          <Avatar className="h-4 w-4">
            <AvatarImage src={seller.avatar} />
            <AvatarFallback>{seller.name[0]}</AvatarFallback>
          </Avatar>
          <span className="truncate max-w-[100px]">{seller.name}</span>
          <span>•</span>
          <span>{seller.location}</span>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// CARD 5: THE "B2B BULK"
// Best for: Wholesale, Industrial, Office Supplies
// ============================================================================
export function B2BBulkCard({
  title,
  price,
  image,
  attributes,
  stockLevel,
  className
}: PerfectCardProps) {
  return (
    <div className={cn("group flex border border-border rounded-lg bg-card hover:border-primary transition-colors p-3 gap-4", className)}>
      <div className="w-24 h-24 shrink-0 bg-muted/10 rounded border border-border/50 p-2">
        <img src={image} alt={title} className="w-full h-full object-contain mix-blend-multiply" />
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-sm text-foreground line-clamp-2">{title}</h3>
            <Badge variant="outline" className="text-[10px] h-5 font-normal text-muted-foreground">
              SKU: {Math.floor(Math.random() * 10000)}
            </Badge>
          </div>
          <div className="flex gap-2 mt-1 text-[10px] text-muted-foreground">
            {attributes.slice(0, 3).map((attr, i) => (
              <span key={i} className="bg-muted px-1.5 py-0.5 rounded">{attr.label}: {attr.value}</span>
            ))}
          </div>
        </div>
        
        <div className="flex items-end justify-between mt-2">
          <div>
            <div className="text-lg font-bold text-foreground">{formatPrice(price)} <span className="text-xs font-normal text-muted-foreground">/ unit</span></div>
            <div className="text-[10px] text-muted-foreground">Min. order: 50 units</div>
          </div>
          <Button size="sm" variant="outline" className="h-8 text-xs">
            Request Quote
          </Button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// CARD 6: THE "SOCIAL STORY"
// Best for: Influencer Commerce, "Shop the Look", Gen Z
// ============================================================================
export function SocialStoryCard({
  title,
  price,
  image,
  seller,
  className
}: PerfectCardProps) {
  return (
    <div className={cn("group relative aspect-[9/16] rounded-2xl overflow-hidden bg-black", className)}>
      <img src={image} alt={title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
      
      <div className="absolute top-3 left-3 flex items-center gap-2">
        <div className="p-0.5 rounded-full border-2 border-primary">
          <Avatar className="h-8 w-8 border-2 border-black">
            <AvatarImage src={seller.avatar} />
            <AvatarFallback>{seller.name[0]}</AvatarFallback>
          </Avatar>
        </div>
        <span className="text-white text-xs font-bold drop-shadow-md">@{seller.name.toLowerCase().replace(' ', '')}</span>
      </div>

      <div className="absolute top-3 right-3">
        <div className="bg-black/50 backdrop-blur-md rounded-full p-2 text-white">
          <Play size={16} weight="fill" />
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 p-4 space-y-3">
        <div className="space-y-1">
          <h3 className="text-white font-medium text-sm line-clamp-2 drop-shadow-md">{title}</h3>
          <p className="text-white text-lg font-bold drop-shadow-md">{formatPrice(price)}</p>
        </div>
        <Button className="w-full rounded-full bg-white text-black hover:bg-white/90 font-bold text-xs h-10">
          Shop Now <TrendUp weight="bold" className="ml-1" />
        </Button>
      </div>
    </div>
  )
}

// ============================================================================
// CARD 7: THE "URGENCY DEAL"
// Best for: Flash Sales, Daily Deals, Clearance
// ============================================================================
export function UrgencyDealCard({
  title,
  price,
  originalPrice,
  image,
  className
}: PerfectCardProps) {
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0
  
  return (
    <div className={cn("group bg-card border border-border rounded-xl overflow-hidden", className)}>
      <div className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 flex justify-between items-center">
        <span className="flex items-center gap-1"><Timer weight="fill" /> ENDS IN 04:22:19</span>
        <span>FLASH SALE</span>
      </div>
      
      <div className="relative aspect-square p-4 bg-white">
        <img src={image} alt={title} className="w-full h-full object-contain" />
        <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded shadow-sm">
          -{discount}%
        </div>
      </div>
      
      <div className="p-3 space-y-3">
        <div className="space-y-1">
          <h3 className="font-medium text-sm line-clamp-2">{title}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-red-600">{formatPrice(price)}</span>
            <span className="text-xs text-muted-foreground line-through">{formatPrice(originalPrice || price * 1.2)}</span>
          </div>
        </div>
        
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
            <span>Sold: 87%</span>
            <span className="text-red-600">Only 4 left!</span>
          </div>
          <Progress value={87} className="h-1.5 bg-muted [&>div]:bg-red-600" />
        </div>
        
        <Button className="w-full h-8 text-xs font-bold bg-red-600 hover:bg-red-700 text-white">
          Claim Deal
        </Button>
      </div>
    </div>
  )
}

// ============================================================================
// CARD 8: THE "LOCAL CLASSIFIED"
// Best for: Local Pickup, Furniture, Second Hand
// ============================================================================
export function LocalClassifiedCard({
  title,
  price,
  image,
  seller,
  className
}: PerfectCardProps) {
  return (
    <div className={cn("group flex flex-col bg-card border border-border rounded-lg overflow-hidden", className)}>
      <div className="relative aspect-[4/3]">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
          <MapPin weight="fill" />
          {seller.location} (2km)
        </div>
      </div>
      
      <div className="p-3 space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-base text-foreground line-clamp-1">{title}</h3>
          <span className="text-xs text-muted-foreground whitespace-nowrap">2h ago</span>
        </div>
        
        <div className="font-bold text-lg">{formatPrice(price)}</div>
        
        <div className="flex items-center gap-2 pt-2 border-t border-border/50">
          <Avatar className="h-6 w-6">
            <AvatarImage src={seller.avatar} />
            <AvatarFallback>{seller.name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground flex-1 truncate">{seller.name}</span>
          <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
            Message
          </Button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// CARD 9: THE "LUXURY BOUTIQUE"
// Best for: Watches, Jewelry, Designer Bags
// ============================================================================
export function LuxuryBoutiqueCard({
  title,
  price,
  image,
  attributes,
  className
}: PerfectCardProps) {
  return (
    <div className={cn("group cursor-pointer space-y-4 p-4 bg-card hover:bg-muted/20 transition-colors rounded-sm", className)}>
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F5F5F5]">
        <img src={image} alt={title} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out" />
      </div>
      
      <div className="text-center space-y-2">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
          {attributes.find(a => a.label === "Brand")?.value || "Designer"}
        </div>
        <h3 className="font-serif text-lg text-foreground leading-tight">
          {title}
        </h3>
        <div className="text-sm font-medium text-foreground/80">
          {formatPrice(price)}
        </div>
        <button className="text-[10px] uppercase tracking-widest border-b border-foreground/20 pb-0.5 hover:border-foreground transition-colors">
          Inquire
        </button>
      </div>
    </div>
  )
}

// ============================================================================
// CARD 10: THE "REVIEW HERO"
// Best for: Books, Gadgets, Beauty, High-Volume Items
// ============================================================================
export function ReviewHeroCard({
  title,
  price,
  image,
  rating,
  reviews,
  className
}: PerfectCardProps) {
  return (
    <div className={cn("group bg-card border border-border rounded-xl p-4 space-y-4 hover:border-primary/50 transition-colors", className)}>
      <div className="flex gap-4">
        <div className="w-24 h-24 shrink-0 bg-muted/20 rounded-lg p-2">
          <img src={image} alt={title} className="w-full h-full object-contain" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
            <Star weight="fill" />
            <Star weight="fill" />
            <Star weight="fill" />
            <Star weight="fill" />
            <Star weight="fill" />
            <span className="text-muted-foreground font-normal ml-1">({reviews})</span>
          </div>
          <h3 className="font-bold text-sm leading-tight">{title}</h3>
          <div className="text-lg font-bold">{formatPrice(price)}</div>
        </div>
      </div>
      
      <div className="bg-muted/30 rounded-lg p-3 relative">
        <Quotes weight="fill" className="absolute top-2 left-2 text-muted-foreground/20 text-2xl" />
        <p className="text-xs text-muted-foreground italic relative z-10 pl-4">
          "Absolutely love this product! The quality is outstanding and it arrived faster than expected."
        </p>
        <div className="flex items-center gap-2 mt-2 justify-end">
          <span className="text-[10px] font-bold text-foreground">- Sarah J.</span>
          <div className="flex items-center gap-0.5 text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
            <CheckCircle weight="fill" /> Verified
          </div>
        </div>
      </div>
      
      <Button className="w-full h-9 text-xs font-bold">
        Add to Cart
      </Button>
    </div>
  )
}

// ============================================================================
// CARD 11: THE "MARKETPLACE OMNI"
// Best for: General Marketplace, Multi-category, Attribute-heavy items
// Features: Balanced Seller/Product focus, Clear Attributes, Trust Signals
// ============================================================================
export function MarketplaceOmniCard({
  title,
  price,
  originalPrice,
  image,
  seller,
  attributes,
  badges,
  rating,
  reviews,
  className
}: PerfectCardProps) {
  return (
    <div className={cn("group flex flex-col bg-card border border-border rounded-lg overflow-hidden hover:shadow-md hover:border-primary/50 transition-all duration-300", className)}>
      {/* Image Section with Integrated Seller Info */}
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        
        {/* Top Overlays */}
        {badges?.[0] && (
          <span className="absolute top-2 left-2 px-2 py-1 text-[10px] font-bold bg-background/90 backdrop-blur-sm rounded shadow-sm">
            {badges[0]}
          </span>
        )}
        <button className="absolute top-2 right-2 p-1.5 rounded-full bg-black/20 backdrop-blur-sm hover:bg-white text-white hover:text-red-500 transition-all">
          <Heart size={16} weight="bold" />
        </button>

        {/* Bottom Gradient Overlay for Seller */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-8 flex items-end justify-between">
          <div className="flex items-center gap-2 text-white">
            <Avatar className="h-5 w-5 border border-white/20 ring-1 ring-black/20">
              <AvatarImage src={seller.avatar} />
              <AvatarFallback className="text-[9px] bg-muted text-muted-foreground">{seller.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold leading-none text-white/90 shadow-sm">{seller.name}</span>
              <div className="flex items-center gap-1 text-[9px] text-white/70">
                <Star weight="fill" className="text-amber-400" size={9} />
                <span>{rating}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-3 gap-2">
        {/* Title */}
        <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors min-h-[2.5em]">
          {title}
        </h3>

        {/* Attributes Grid - Refined */}
        <div className="grid grid-cols-2 gap-1.5 my-1">
          {attributes.slice(0, 4).map((attr, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[10px] text-muted-foreground overflow-hidden">
              <span className="w-1 h-1 rounded-full bg-primary/40 shrink-0" />
              <span className="truncate font-medium">{attr.value}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-2 flex items-end justify-between gap-2 border-t border-border/40">
          <div className="flex flex-col">
            {originalPrice && (
              <span className="text-[10px] text-muted-foreground line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
            <span className="text-base font-bold text-foreground">
              {formatPrice(price)}
            </span>
          </div>
          <Button size="sm" variant="secondary" className="h-7 px-3 text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-colors">
            View
          </Button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// CARD 12: THE "SERVICE PRO"
// Best for: Freelancers, Local Services, Gigs
// ============================================================================
export function ServiceProCard({
  title,
  price,
  image,
  seller,
  rating,
  reviews,
  className
}: PerfectCardProps) {
  return (
    <div className={cn("group flex gap-3 p-3 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors", className)}>
      <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute top-1 left-1 bg-white/90 backdrop-blur rounded px-1.5 py-0.5 text-[10px] font-bold flex items-center gap-0.5">
          <Star weight="fill" className="text-amber-400" /> {rating}
        </div>
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Avatar className="h-4 w-4">
              <AvatarImage src={seller.avatar} />
              <AvatarFallback>{seller.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate">{seller.name}</span>
          </div>
          <h3 className="font-bold text-sm leading-tight line-clamp-2">{title}</h3>
        </div>
        <div className="flex justify-between items-end mt-2">
          <div className="text-sm font-medium">Starting at <span className="font-bold text-base">{formatPrice(price)}</span></div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// CARD 13: THE "RENTAL BOOKING"
// Best for: Airbnb, Equipment Rental, Car Hire
// ============================================================================
export function RentalBookingCard({
  title,
  price,
  image,
  rating,
  className
}: PerfectCardProps) {
  return (
    <div className={cn("group space-y-2 cursor-pointer", className)}>
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted">
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors text-black/70 hover:text-red-500">
          <Heart weight="fill" size={16} />
        </button>
      </div>
      <div className="space-y-0.5 px-1">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-sm text-foreground line-clamp-1">{title}</h3>
          <div className="flex items-center gap-1 text-xs">
            <Star weight="fill" className="text-black" /> {rating}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">3-8 Oct · Individual Host</p>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="font-bold text-sm">{formatPrice(price)}</span>
          <span className="text-xs text-muted-foreground">/ night</span>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// CARD 14: THE "DIGITAL ASSET"
// Best for: Software, E-books, Templates, Courses
// ============================================================================
export function DigitalAssetCard({
  title,
  price,
  image,
  attributes,
  className
}: PerfectCardProps) {
  return (
    <div className={cn("group bg-card border border-border rounded-lg p-3 hover:shadow-md transition-all", className)}>
      <div className="flex gap-3 items-start">
        <div className="w-16 h-16 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-inner">
          <Package weight="duotone" size={32} />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex justify-between items-start">
            <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-normal bg-blue-50 text-blue-700 hover:bg-blue-100 border-0">
              {attributes[0]?.value || "Digital"}
            </Badge>
            <span className="font-bold text-sm">{formatPrice(price)}</span>
          </div>
          <h3 className="font-medium text-sm leading-tight line-clamp-2">{title}</h3>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground pt-1">
            <span className="flex items-center gap-0.5"><Star weight="fill" className="text-amber-400" /> 4.9</span>
            <span>•</span>
            <span>1.2k Sales</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// CARD 15: THE "SUBSCRIPTION BOX"
// Best for: Recurring deliveries, SaaS, Memberships
// ============================================================================
export function SubscriptionBoxCard({
  title,
  price,
  image,
  attributes,
  className
}: PerfectCardProps) {
  return (
    <div className={cn("group relative bg-card border border-border rounded-2xl p-5 text-center hover:border-primary transition-colors", className)}>
      {attributes.some(a => a.value === "Best Value") && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
          MOST POPULAR
        </div>
      )}
      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted/30 flex items-center justify-center">
        <img src={image} alt={title} className="w-12 h-12 object-contain" />
      </div>
      <h3 className="font-bold text-lg mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground mb-4 line-clamp-2">Curated selection of premium items delivered monthly.</p>
      <div className="text-2xl font-bold mb-4">{formatPrice(price)}<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
      <Button className="w-full rounded-full font-bold">Subscribe</Button>
      <div className="mt-4 space-y-2 text-left">
        {["Free Shipping", "Cancel Anytime", "24/7 Support"].map((feat, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle weight="fill" className="text-green-500 shrink-0" /> {feat}
          </div>
        ))}
      </div>
    </div>
  )
}
