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
  colors: [
    { name: "Black", value: "black", hex: "#1a1a1a", available: true },
    { name: "Silver", value: "silver", hex: "#c0c0c0", available: true },
    { name: "Midnight Blue", value: "blue", hex: "#1e3a5f", available: false },
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
    ordersCompleted: 3420,
  },
  shipping: {
    free: true,
    estimatedDays: "2-3",
    estimatedDate: "Jan 21 - 23",
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
// PRODUCT INFO - Title, Price, Meta (Compact)
// =============================================================================

function ProductInfo({
  product,
  selectedColor,
  onColorChange,
}: {
  product: typeof MOCK_PRODUCT
  selectedColor: string
  onColorChange: (color: string) => void
}) {
  return (
    <div className="space-y-3">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className="hover:text-foreground cursor-pointer">Electronics</span>
        <CaretRight size={10} />
        <span className="hover:text-foreground cursor-pointer">Audio</span>
        <CaretRight size={10} />
        <span className="hover:text-foreground cursor-pointer">Headphones</span>
        <CaretRight size={10} />
        <span className="text-foreground font-medium">{product.brand}</span>
      </nav>

      {/* Title */}
      <h1 className="text-xl font-semibold text-foreground leading-tight">
        {product.title}
      </h1>

      {/* Rating + Stats Row */}
      <div className="flex items-center gap-3 text-sm">
        <div className="flex items-center gap-1">
          <Star size={14} weight="fill" className="text-rating" />
          <span className="font-medium">{product.rating}</span>
          <span className="text-muted-foreground text-xs">({product.reviews})</span>
        </div>
        <span className="text-muted-foreground">•</span>
        <div className="flex items-center gap-1 text-muted-foreground text-xs">
          <Package size={12} />
          <span>{product.sold} sold</span>
        </div>
        <span className="text-muted-foreground">•</span>
        <div className="flex items-center gap-1 text-muted-foreground text-xs">
          <Eye size={12} />
          <span>{product.views} views</span>
        </div>
      </div>

      {/* Price Block - More compact */}
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-2xl font-bold text-foreground">
          {product.price.toFixed(2)} {product.currency}
        </span>
        {product.originalPrice && (
          <>
            <span className="text-base text-muted-foreground line-through">
              {product.originalPrice.toFixed(2)} {product.currency}
            </span>
            <Badge variant="destructive" className="text-xs px-1.5 py-0">
              -{product.discount}%
            </Badge>
          </>
        )}
      </div>
      <p className="text-xs text-muted-foreground -mt-1">
        Price includes VAT. Free shipping on this item.
      </p>

      {/* Color Selector */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Color:</span>
          <span className="text-sm font-medium text-foreground">
            {product.colors.find(c => c.value === selectedColor)?.name || "Black"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {product.colors.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => color.available && onColorChange(color.value)}
              disabled={!color.available}
              className={cn(
                "relative size-8 rounded-full border-2 transition-all",
                selectedColor === color.value
                  ? "border-foreground ring-2 ring-foreground ring-offset-2 ring-offset-background"
                  : "border-border hover:border-foreground/50",
                !color.available && "opacity-40 cursor-not-allowed"
              )}
              style={{ backgroundColor: color.hex }}
              title={color.available ? color.name : `${color.name} - Out of stock`}
            >
              {!color.available && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-full h-0.5 bg-muted-foreground rotate-45 absolute" />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Specs Pills - Modern 2026 card pattern */}
      <div className="grid grid-cols-4 gap-2 pt-2">
        <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-center">
          <span className="block text-2xs uppercase tracking-wide text-muted-foreground">Brand</span>
          <span className="block text-sm font-semibold text-foreground mt-0.5">{product.brand}</span>
        </div>
        <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-center">
          <span className="block text-2xs uppercase tracking-wide text-muted-foreground">Model</span>
          <span className="block text-sm font-semibold text-foreground mt-0.5">{product.model}</span>
        </div>
        <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-center">
          <span className="block text-2xs uppercase tracking-wide text-muted-foreground">Condition</span>
          <span className="block text-sm font-semibold text-foreground mt-0.5 capitalize">{product.condition}</span>
        </div>
        <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-center">
          <span className="block text-2xs uppercase tracking-wide text-muted-foreground">Warranty</span>
          <span className="block text-sm font-semibold text-foreground mt-0.5">{product.warranty}</span>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// BUY BOX - Compact Conversion Engine
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
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      {/* Stock + Actions Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-success" />
          <span className="text-sm font-medium text-success">In Stock</span>
          <span className="text-xs text-muted-foreground">({product.stock} available)</span>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              size={18}
              weight={isWishlisted ? "fill" : "regular"}
              className={isWishlisted ? "text-wishlist-active" : "text-muted-foreground"}
            />
          </button>
          <button
            type="button"
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
            title="Share"
          >
            <Share size={18} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Shipping Info - Enhanced */}
      <div className="rounded-md border border-border bg-muted/30 p-2.5 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Truck size={16} className="text-success" />
            <span className="font-medium text-foreground">Free Shipping</span>
          </div>
          <span className="text-xs text-muted-foreground">via {product.shipping.provider}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            Delivery: <span className="font-medium text-foreground">{product.shipping.estimatedDate}</span>
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={12} />
            Sofia, Bulgaria
          </span>
        </div>
      </div>

      {/* Quantity + Total Row - Combined */}
      <div className="flex items-center justify-between gap-3 py-2 border-y border-border">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Qty</span>
          <div className="flex items-center border border-border rounded-md">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1.5 hover:bg-muted transition-colors"
              disabled={quantity <= 1}
            >
              <Minus size={14} className={quantity <= 1 ? "text-muted-foreground/40" : "text-foreground"} />
            </button>
            <span className="px-3 py-1 text-sm font-medium min-w-[2.5rem] text-center">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="p-1.5 hover:bg-muted transition-colors"
              disabled={quantity >= product.stock}
            >
              <Plus size={14} className={quantity >= product.stock ? "text-muted-foreground/40" : "text-foreground"} />
            </button>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-muted-foreground">Total</span>
          <div className="text-lg font-bold text-foreground">
            {totalPrice.toFixed(2)} {product.currency}
          </div>
        </div>
      </div>

      {/* CTA Buttons - Tighter */}
      <div className="flex gap-2">
        <Button className="flex-1 h-11 text-sm font-semibold gap-2">
          <ShoppingCart size={18} weight="bold" />
          Add to Cart
        </Button>
        <Button variant="outline" className="h-11 px-4" title="Buy Now">
          <Lightning size={18} weight="fill" />
        </Button>
      </div>

      {/* Protection Row - Compact */}
      <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <ShieldCheck size={12} className="text-success" />
          {product.protection.days}-Day Buyer Protection
        </span>
        <span className="text-border">|</span>
        <span className="flex items-center gap-1">
          <Package size={12} />
          Easy Returns
        </span>
      </div>

      {/* Seller Card - Distinct section */}
      <div className="rounded-md border border-border bg-muted/30 p-3">
        <div className="flex items-center gap-2.5">
          <Avatar className="size-10 border border-border">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80" />
            <AvatarFallback className="text-xs font-medium">
              {product.seller.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-foreground text-sm truncate">
                {product.seller.name}
              </span>
              {product.seller.verified && (
                <SealCheck size={14} weight="fill" className="text-verified shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Star size={10} weight="fill" className="text-rating" />
              <span>{product.seller.rating}</span>
              <span>•</span>
              <span>{product.seller.reviews.toLocaleString()} reviews</span>
            </div>
          </div>
        </div>
        
        {/* Seller Stats Row */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock size={10} />
            {product.seller.responseTime}
          </span>
          <span className="flex items-center gap-1">
            <Package size={10} />
            {product.seller.ordersCompleted.toLocaleString()} orders
          </span>
          <span className="flex items-center gap-1">
            <Buildings size={10} />
            Since {product.seller.memberSince}
          </span>
        </div>
        
        {/* Seller Actions - Compact */}
        <div className="flex gap-2 mt-2.5">
          <Button variant="outline" size="sm" className="flex-1 h-8 gap-1 text-xs bg-background">
            <ChatCircle size={12} />
            Message
          </Button>
          <Button variant="outline" size="sm" className="flex-1 h-8 text-xs bg-background">
            Visit Store
          </Button>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export default function ProductDesktop2Page() {
  const product = MOCK_PRODUCT
  const [selectedColor, setSelectedColor] = useState("black")

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
            {/* LEFT COLUMN - Gallery + Features/Specs */}
            <div className="space-y-6">
              <ProductGallery images={product.images} />
              
              {/* Key Features + Quick Specs - 2 column grid under gallery */}
              <div className="hidden lg:grid grid-cols-2 gap-4">
                {/* Key Features */}
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <h3 className="font-semibold text-foreground mb-3 text-sm">Key Features</h3>
                  <ul className="space-y-2">
                    {product.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check size={14} weight="bold" className="text-success shrink-0 mt-0.5" />
                        <span className="text-foreground text-xs">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Quick Specs */}
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <h3 className="font-semibold text-foreground mb-3 text-sm">Quick Specs</h3>
                  <div className="space-y-1.5">
                    {product.specifications.slice(0, 5).map((spec, i) => (
                      <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-border/40 last:border-0">
                        <span className="text-muted-foreground">{spec.label}</span>
                        <span className="font-medium text-foreground">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - Info + Buy Box (sticky) */}
            <div className="lg:sticky lg:top-20 lg:self-start space-y-4">
              <ProductInfo 
                product={product} 
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
              />
              <BuyBox product={product} />
            </div>
          </div>
        </div>

        {/* ================================================================
            BELOW THE FOLD - Full Specs + Reviews
            ================================================================ */}
        
        {/* Full Description */}
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
        <div className="mt-6 bg-background rounded-xl border border-border overflow-hidden">
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

        {/* Similar Products Section */}
        <div className="mt-8 bg-background rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-foreground">Similar Products</h3>
            <Button variant="ghost" size="sm" className="text-xs gap-1">
              View All
              <CaretRight size={14} />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Bose QuietComfort Ultra", price: 329.99, rating: 4.7, image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&q=80" },
              { name: "Apple AirPods Max", price: 549.99, rating: 4.6, image: "https://images.unsplash.com/photo-1625245488600-f03fef636a3c?w=400&q=80" },
              { name: "Sennheiser Momentum 4", price: 299.99, rating: 4.8, image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&q=80" },
              { name: "JBL Tour One M2", price: 249.99, rating: 4.5, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80" },
            ].map((item, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-square rounded-lg border border-border bg-muted/30 overflow-hidden mb-2">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-foreground/80">
                  {item.name}
                </h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm font-semibold text-foreground">{item.price.toFixed(2)} BGN</span>
                  <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
                    <Star size={10} weight="fill" className="text-rating" />
                    <span>{item.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Mobile Sticky Buy Bar (hidden on desktop) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-3 safe-area-inset-bottom">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="size-11 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors shrink-0"
          >
            <Heart size={20} className="text-muted-foreground" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-foreground">
                {product.price.toFixed(2)} {product.currency}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  {product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-xs text-success flex items-center gap-1">
              <Truck size={12} />
              Free shipping
            </span>
          </div>
          <Button size="lg" className="gap-2 shrink-0">
            <ShoppingCart size={18} weight="bold" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}
