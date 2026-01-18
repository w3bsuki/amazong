"use client"

// =============================================================================
// PRODUCT DESKTOP V2 - Ultimate 2026 Desktop Product Experience
// =============================================================================
//
// Design Philosophy - "See Everything, Decide Fast":
//
// ┌─────────────────────────────────────────────────────────────────────────┐
// │  HEADER (minimal, from layout)                                          │
// ├─────────────────────────────────────────────────────────────────────────┤
// │                                                                         │
// │  ┌─────────────────────────────┐  ┌───────────────────────────────────┐ │
// │  │                             │  │ BRAND • CATEGORY                  │ │
// │  │                             │  │ TITLE (prominent)                 │ │
// │  │      MAIN IMAGE             │  │ ★★★★★ 4.8 (234) • 847 sold        │ │
// │  │      (Large, dominant)      │  │                                   │ │
// │  │                             │  │ ┌─────────────────────────────┐   │ │
// │  │                             │  │ │ PRICE                       │   │ │
// │  │                             │  │ │ €349.99  €399.99  -13%      │   │ │
// │  │                             │  │ └─────────────────────────────┘   │ │
// │  ├─────────────────────────────┤  │                                   │ │
// │  │ [1] [2] [3] [4] [5]         │  │ Color:  ⚫ ⚪ 🔵                   │ │
// │  │ Thumbnails (horizontal)     │  │                                   │ │
// │  └─────────────────────────────┘  │ ┌─────────────────────────────┐   │ │
// │                                   │ │ [━] 1 [+]  ADD TO CART      │   │ │
// │  ┌─────────────────────────────┐  │ │ ⚡ BUY NOW                   │   │ │
// │  │ SELLER CARD (compact)       │  │ └─────────────────────────────┘   │ │
// │  │ TechZone Pro ✓ • ★4.9      │  │                                   │ │
// │  │ [Message] [View Store]      │  │ 🚚 Free Shipping • 2-3 days      │ │
// │  └─────────────────────────────┘  │ 🛡️ 14-Day Buyer Protection       │ │
// │                                   └───────────────────────────────────┘ │
// │                                                                         │
// ├─────────────────────────────────────────────────────────────────────────┤
// │  HIGHLIGHTS │ SPECS │ REVIEWS                                          │
// └─────────────────────────────────────────────────────────────────────────┘
//
// Key Design Decisions:
// 1. Gallery takes 55% width - image is king in e-commerce
// 2. Horizontal thumbnails below main image - natural scan pattern  
// 3. Right column has EVERYTHING needed to buy - no scrolling required
// 4. Seller card BELOW gallery - builds trust without competing with CTA
// 5. Price block has visual weight - large, clear, with savings prominent
// 6. CTAs are full-width in right column - maximum tap target
// 7. Trust signals compact but visible - shipping + protection inline
// 8. Details below fold - for those who want to dive deeper
//
// =============================================================================

import * as React from "react"
import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Heart,
  Share,
  ShieldCheck,
  Truck,
  Package,
  Star,
  Check,
  Minus,
  Plus,
  MapPin,
  Clock,
  Eye,
  ShoppingCart,
  Lightning,
  ChatCircle,
  CaretRight,
  ArrowLeft,
  Buildings,
  SealCheck,
} from "@phosphor-icons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// =============================================================================
// MOCK DATA - Premium Product
// =============================================================================

const MOCK_PRODUCT = {
  id: "prod-001",
  title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
  subtitle: "Industry-leading noise cancellation with exceptional sound quality",
  price: 349.99,
  originalPrice: 399.99,
  currency: "BGN",
  discount: 13,
  condition: "new" as const,
  stock: 12,
  sold: 847,
  views: 2341,
  favorites: 156,
  rating: 4.8,
  reviews: 234,
  sku: "WH1000XM5B",
  brand: "Sony",
  model: "WH-1000XM5",
  color: "Black",
  warranty: "2 years",
  images: [
    "/demo/headphones-1.jpg",
    "/demo/headphones-2.jpg",
    "/demo/headphones-3.jpg",
    "/demo/headphones-4.jpg",
    "/demo/headphones-5.jpg",
  ],
  seller: {
    id: "seller-001",
    name: "TechZone Pro",
    avatar: "/demo/seller-avatar.jpg",
    verified: true,
    rating: 4.9,
    reviews: 1247,
    responseTime: "< 1 hour",
    memberSince: "2021",
    location: "Sofia, Bulgaria",
  },
  shipping: {
    free: true,
    estimatedDays: "2-3",
    provider: "Speedy",
  },
  protection: {
    enabled: true,
    days: 14,
  },
  specifications: [
    { label: "Driver Unit", value: "30mm" },
    { label: "Frequency Response", value: "4Hz-40,000Hz" },
    { label: "Battery Life", value: "30 hours" },
    { label: "Charging Time", value: "3.5 hours" },
    { label: "Weight", value: "250g" },
    { label: "Bluetooth", value: "5.2" },
    { label: "Codecs", value: "SBC, AAC, LDAC" },
    { label: "Noise Cancellation", value: "Active (ANC)" },
  ],
  highlights: [
    "Industry-leading noise cancellation",
    "Crystal clear hands-free calling",
    "30-hour battery life",
    "Multipoint connection",
    "Comfortable lightweight design",
  ],
}

// =============================================================================
// PRODUCT GALLERY - Main Image + Horizontal Thumbnails
// =============================================================================

function ProductGallery({ images }: { images: string[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  // Premium product images for demo
  const placeholderImages = [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80",
    "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&q=80",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80",
  ]

  const displayImages = placeholderImages

  return (
    <div className="space-y-3">
      {/* Main Image - Large and prominent */}
      <div className="relative group">
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted border border-border">
          <Image
            src={displayImages[selectedIndex] || displayImages[0] || "/placeholder.svg"}
            alt="Product main image"
            fill
            className={cn(
              "object-cover transition-transform duration-500 cursor-zoom-in",
              isZoomed && "scale-125"
            )}
            sizes="(max-width: 768px) 100vw, 55vw"
            priority
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
          />
        </div>

        {/* Floating actions on image */}
        <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            className="size-9 rounded-full bg-background/90 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-background transition-colors"
            aria-label="Share"
          >
            <Share size={18} className="text-foreground" />
          </button>
        </div>

        {/* Image counter */}
        <div className="absolute bottom-3 left-3 bg-foreground/80 backdrop-blur-sm text-background text-xs font-medium px-2.5 py-1 rounded-full">
          {selectedIndex + 1} / {displayImages.length}
        </div>
      </div>

      {/* Horizontal Thumbnail Strip */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {displayImages.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSelectedIndex(i)}
            className={cn(
              "relative w-16 h-16 rounded-md overflow-hidden shrink-0 transition-all duration-200",
              selectedIndex === i
                ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                : "border border-border hover:border-foreground/30 opacity-70 hover:opacity-100"
            )}
          >
            <Image
              src={img}
              alt={`Product thumbnail ${i + 1}`}
              fill
              className="object-cover"
              sizes="64px"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

// =============================================================================
// PRODUCT INFO - Title, Price, Meta
// =============================================================================

function ProductInfo({
  product,
}: {
  product: typeof MOCK_PRODUCT
}) {
  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className="hover:text-foreground cursor-pointer">Electronics</span>
        <CaretRight size={12} />
        <span className="hover:text-foreground cursor-pointer">Audio</span>
        <CaretRight size={12} />
        <span className="hover:text-foreground cursor-pointer">Headphones</span>
        <CaretRight size={12} />
        <span className="text-foreground font-medium">{product.brand}</span>
      </nav>

      {/* Title */}
      <div>
        <h1 className="text-xl font-semibold text-foreground leading-tight">
          {product.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {product.subtitle}
        </p>
      </div>

      {/* Rating + Stats Row */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <Star size={16} weight="fill" className="text-rating" />
          <span className="font-medium">{product.rating}</span>
          <span className="text-muted-foreground">({product.reviews} reviews)</span>
        </div>
        <Separator orientation="vertical" className="h-4" />
        <div className="flex items-center gap-1 text-muted-foreground">
          <Package size={14} />
          <span>{product.sold} sold</span>
        </div>
        <Separator orientation="vertical" className="h-4" />
        <div className="flex items-center gap-1 text-muted-foreground">
          <Eye size={14} />
          <span>{product.views} views</span>
        </div>
      </div>

      {/* Price Block */}
      <div className="py-3 border-y border-border">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-foreground">
            {product.price.toFixed(2)} {product.currency}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-lg text-muted-foreground line-through">
                {product.originalPrice.toFixed(2)} {product.currency}
              </span>
              <Badge variant="destructive" className="text-xs">
                -{product.discount}%
              </Badge>
            </>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Price includes VAT. Free shipping on this item.
        </p>
      </div>

      {/* Quick Specs */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Brand</span>
          <span className="font-medium">{product.brand}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Model</span>
          <span className="font-medium">{product.model}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Color</span>
          <span className="font-medium">{product.color}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Condition</span>
          <Badge variant="secondary" className="text-xs capitalize">
            {product.condition}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">SKU</span>
          <span className="font-medium text-xs">{product.sku}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Warranty</span>
          <span className="font-medium">{product.warranty}</span>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// BUY BOX - The Conversion Engine
// =============================================================================

function BuyBox({
  product,
}: {
  product: typeof MOCK_PRODUCT
}) {
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const totalPrice = product.price * quantity

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-4">
      {/* Stock Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-success animate-pulse" />
          <span className="text-sm font-medium text-success">In Stock</span>
          <span className="text-xs text-muted-foreground">
            ({product.stock} available)
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="p-2 rounded-md hover:bg-muted transition-colors"
          >
            <Heart
              size={20}
              weight={isWishlisted ? "fill" : "regular"}
              className={isWishlisted ? "text-wishlist-active" : "text-muted-foreground"}
            />
          </button>
          <button
            type="button"
            className="p-2 rounded-md hover:bg-muted transition-colors"
          >
            <Share size={20} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Quantity</span>
        <div className="flex items-center border border-border rounded-md">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-2 hover:bg-muted transition-colors"
            disabled={quantity <= 1}
          >
            <Minus size={16} className={quantity <= 1 ? "text-muted-foreground/50" : "text-foreground"} />
          </button>
          <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="p-2 hover:bg-muted transition-colors"
            disabled={quantity >= product.stock}
          >
            <Plus size={16} className={quantity >= product.stock ? "text-muted-foreground/50" : "text-foreground"} />
          </button>
        </div>
      </div>

      {/* Total Price */}
      <div className="flex items-center justify-between py-2 border-y border-border">
        <span className="text-sm text-muted-foreground">Total</span>
        <span className="text-xl font-bold text-foreground">
          {totalPrice.toFixed(2)} {product.currency}
        </span>
      </div>

      {/* CTA Buttons */}
      <div className="space-y-2">
        <Button className="w-full h-12 text-base font-semibold gap-2">
          <ShoppingCart size={20} weight="bold" />
          Add to Cart
        </Button>
        <Button variant="outline" className="w-full h-12 text-base font-semibold gap-2">
          <Lightning size={20} weight="fill" />
          Buy Now
        </Button>
      </div>

      {/* Trust Signals */}
      <div className="space-y-2 pt-2">
        {/* Shipping */}
        <div className="flex items-center gap-3 text-sm">
          <div className="size-8 rounded-md bg-muted flex items-center justify-center shrink-0">
            <Truck size={18} className="text-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground">
              {product.shipping.free ? "Free Shipping" : "Standard Shipping"}
            </p>
            <p className="text-xs text-muted-foreground">
              Delivery in {product.shipping.estimatedDays} business days
            </p>
          </div>
        </div>

        {/* Buyer Protection */}
        <div className="flex items-center gap-3 text-sm">
          <div className="size-8 rounded-md bg-muted flex items-center justify-center shrink-0">
            <ShieldCheck size={18} className="text-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground">Buyer Protection</p>
            <p className="text-xs text-muted-foreground">
              Full refund within {product.protection.days} days
            </p>
          </div>
        </div>

        {/* Secure Payment */}
        <div className="flex items-center gap-3 text-sm">
          <div className="size-8 rounded-md bg-muted flex items-center justify-center shrink-0">
            <SealCheck size={18} className="text-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground">Secure Payment</p>
            <p className="text-xs text-muted-foreground">
              Visa, Mastercard, PayPal accepted
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// SELLER CARD - Trust Builder
// =============================================================================

function SellerCard({
  seller,
}: {
  seller: typeof MOCK_PRODUCT.seller
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Avatar className="size-12 border border-border">
          <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80" />
          <AvatarFallback className="text-sm font-medium">
            {seller.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-foreground truncate">
              {seller.name}
            </span>
            {seller.verified && (
              <SealCheck size={16} weight="fill" className="text-verified shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-0.5">
              <Star size={12} weight="fill" className="text-rating" />
              {seller.rating}
            </span>
            <span>•</span>
            <span>{seller.reviews} reviews</span>
          </div>
        </div>
      </div>

      {/* Seller Stats */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock size={14} />
          <span>Responds {seller.responseTime}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MapPin size={14} />
          <span className="truncate">{seller.location}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Buildings size={14} />
          <span>Member since {seller.memberSince}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1 gap-1.5">
          <ChatCircle size={16} />
          Message
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          View Store
        </Button>
      </div>
    </div>
  )
}

// =============================================================================
// PRODUCT HIGHLIGHTS
// =============================================================================

function ProductHighlights({
  highlights,
}: {
  highlights: string[]
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="font-semibold text-foreground mb-3">Highlights</h3>
      <ul className="space-y-2">
        {highlights.map((highlight, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <Check size={16} weight="bold" className="text-success shrink-0 mt-0.5" />
            <span className="text-foreground">{highlight}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// =============================================================================
// SPECIFICATIONS TABLE
// =============================================================================

function SpecificationsTable({
  specs,
}: {
  specs: { label: string; value: string }[]
}) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <h3 className="font-semibold text-foreground">Specifications</h3>
      </div>
      <div className="divide-y divide-border">
        {specs.map((spec, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center px-4 py-2.5 text-sm",
              i % 2 === 0 ? "bg-background" : "bg-muted/20"
            )}
          >
            <span className="w-40 text-muted-foreground shrink-0">{spec.label}</span>
            <span className="font-medium text-foreground">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export default function ProductDesktop2Page() {
  const product = MOCK_PRODUCT

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Minimal Header for Demo */}
      <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
        <div className="container h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button type="button" className="p-2 rounded-md hover:bg-muted transition-colors">
              <ArrowLeft size={20} className="text-foreground" />
            </button>
            <span className="text-lg font-bold text-foreground">treido.</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="size-10">
              <Heart size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="size-10">
              <ShoppingCart size={20} />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content - Premium Layout */}
      <main className="container py-8">
        {/* ================================================================
            HERO SECTION - The Perfect Above-the-Fold Experience
            
            Layout: 55% Gallery | 45% Product Info + Buy Box
            
            Design rationale:
            - Gallery gets more space because images sell products
            - Right column is sticky so CTA is always visible
            - Seller card moved BELOW the fold to not compete
            - Everything needed to purchase is in the right column
            ================================================================ */}
        <div className="bg-background rounded-xl border border-border p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-8 lg:gap-12">
            {/* LEFT COLUMN - Gallery (larger, dominant) */}
            <div>
              <ProductGallery images={product.images} />
              
              {/* Seller Card - Below gallery on desktop */}
              <div className="hidden lg:block mt-6">
                <SellerCard seller={product.seller} />
              </div>
            </div>

            {/* RIGHT COLUMN - Info + Buy Box (sticky) */}
            <div className="lg:sticky lg:top-20 lg:self-start space-y-5">
              <ProductInfo product={product} />
              <BuyBox product={product} />
              
              {/* Seller Card - Below buy box on mobile */}
              <div className="lg:hidden">
                <SellerCard seller={product.seller} />
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================
            BELOW THE FOLD - Detailed Information
            
            Three-column grid on desktop for balanced presentation
            ================================================================ */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Highlights */}
          <div className="bg-background rounded-xl border border-border p-5">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Check size={18} weight="bold" className="text-success" />
              Key Features
            </h3>
            <ul className="space-y-3">
              {product.highlights.map((highlight, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <span className="size-1.5 rounded-full bg-foreground mt-1.5 shrink-0" />
                  <span className="text-foreground">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Quick Specs */}
          <div className="bg-background rounded-xl border border-border p-5">
            <h3 className="font-semibold text-foreground mb-4">Quick Specs</h3>
            <div className="space-y-2.5">
              {product.specifications.slice(0, 6).map((spec, i) => (
                <div key={i} className="flex items-center justify-between text-sm py-1.5 border-b border-border/50 last:border-0">
                  <span className="text-muted-foreground">{spec.label}</span>
                  <span className="font-medium text-foreground">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Trust & Shipping */}
          <div className="bg-background rounded-xl border border-border p-5">
            <h3 className="font-semibold text-foreground mb-4">Why Buy Here</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} className="text-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Buyer Protection</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Full refund if item doesn't arrive or isn't as described
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Truck size={20} className="text-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Fast & Free Shipping</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Delivered in {product.shipping.estimatedDays} business days
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <SealCheck size={20} className="text-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Verified Seller</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {product.seller.reviews}+ positive reviews
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-8 bg-background rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Product Description</h3>
          <div className="prose prose-sm prose-neutral max-w-none text-foreground leading-relaxed">
            <p>
              Experience exceptional sound quality with the Sony WH-1000XM5 wireless 
              headphones. Featuring industry-leading noise cancellation technology, 
              these headphones deliver an immersive audio experience whether you're 
              commuting, working, or relaxing at home.
            </p>
            <p className="mt-4">
              The newly designed 30mm driver unit delivers a wider frequency range, 
              while the improved noise cancellation processor analyzes ambient sound 
              more effectively to block out even more background noise. With up to 
              30 hours of battery life and quick charging capability, you can enjoy 
              your music all day long.
            </p>
            <p className="mt-4">
              Crafted with premium materials and a sleek design, the WH-1000XM5 
              offers exceptional comfort for extended listening sessions. The soft 
              fit leather and noise-reducing pressure have been optimized to provide 
              a more natural fit, making these headphones perfect for long flights, 
              work sessions, or daily commutes.
            </p>
          </div>
        </div>

        {/* Full Specifications */}
        <div className="mt-8 bg-background rounded-xl border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Full Specifications</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2">
            {product.specifications.map((spec, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center justify-between px-6 py-3 text-sm",
                  i % 2 === 0 ? "bg-background" : "bg-muted/30",
                  "border-b border-border/50 last:border-0 md:[&:nth-last-child(-n+2)]:border-0"
                )}
              >
                <span className="text-muted-foreground">{spec.label}</span>
                <span className="font-medium text-foreground">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Preview */}
        <div className="mt-8 bg-background rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-foreground">Customer Reviews</h3>
            <Button variant="outline" size="sm">
              See all {product.reviews} reviews
            </Button>
          </div>
          
          {/* Review Summary */}
          <div className="flex items-center gap-8 mb-6 py-4 border-y border-border">
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground">{product.rating}</div>
              <div className="flex items-center justify-center gap-0.5 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    weight="fill"
                    className={star <= Math.round(product.rating) ? "text-rating" : "text-rating-empty"}
                  />
                ))}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {product.reviews} reviews
              </div>
            </div>
            
            {/* Rating Bars */}
            <div className="flex-1 space-y-1.5">
              {[5, 4, 3, 2, 1].map((rating) => {
                const percentage = rating === 5 ? 78 : rating === 4 ? 15 : rating === 3 ? 5 : rating === 2 ? 1 : 1
                return (
                  <div key={rating} className="flex items-center gap-2 text-xs">
                    <span className="w-3 text-muted-foreground">{rating}</span>
                    <Star size={12} weight="fill" className="text-rating" />
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rating rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-muted-foreground">{percentage}%</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Sample Review */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Avatar className="size-10">
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground text-sm">John D.</span>
                  <Badge variant="outline" className="text-xs">Verified Purchase</Badge>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={12} weight="fill" className="text-rating" />
                  ))}
                  <span className="text-xs text-muted-foreground ml-2">2 weeks ago</span>
                </div>
                <p className="text-sm text-foreground mt-2">
                  Absolutely incredible headphones! The noise cancellation is next level - 
                  I can finally focus on work without any distractions. Battery life is 
                  amazing too, I only charge them once a week. Highly recommended!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Buy Bar (hidden on desktop) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 safe-area-inset-bottom">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="text-lg font-bold text-foreground">
              {product.price.toFixed(2)} {product.currency}
            </div>
            {product.originalPrice && (
              <div className="text-xs text-muted-foreground line-through">
                {product.originalPrice.toFixed(2)} {product.currency}
              </div>
            )}
          </div>
          <Button size="lg" className="gap-2">
            <ShoppingCart size={20} weight="bold" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}
