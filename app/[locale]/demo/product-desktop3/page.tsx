"use client"

// =============================================================================
// PRODUCT DESKTOP V3 - C2C/B2B Marketplace Focus
// =============================================================================
//
// Design Philosophy - "Buy from People, Not Warehouses":
//
// Key differences from retail (Amazon-style) product pages:
// - Seller is a PERSON, not a faceless warehouse
// - Most items are unique/one-off, not mass inventory
// - Trust signals are critical (you're buying from strangers)
// - Quick decision flow: See → Trust → Buy
// - Less spec-heavy, more visual/personal
//
// Layout:
// ┌──────────────────────────────────────────────────────────────────────────┐
// │  ┌────────────────────┐  ┌────────────────────────────────────────────┐  │
// │  │                    │  │ Category • Condition                       │  │
// │  │    MAIN IMAGE      │  │ TITLE                                      │  │
// │  │    (dominant)      │  │ ★4.8 (234) • 847 sold • 2,341 views       │  │
// │  │                    │  │                                            │  │
// │  │                    │  │ ╔════════════════════════════════════════╗ │  │
// │  │                    │  │ ║  €349.99   €399.99  -13%               ║ │  │
// │  │                    │  │ ╚════════════════════════════════════════╝ │  │
// │  ├────────────────────┤  │                                            │  │
// │  │ [1] [2] [3] [4]    │  │ Brand: Sony  •  Model: WH-1000XM5         │  │
// │  │ thumbnails         │  │ Condition: New  •  Warranty: 2 years      │  │
// │  └────────────────────┘  │                                            │  │
// │                          │ ┌──────────────────────────────────────┐   │  │
// │                          │ │  👤 TechZone Pro ✓                   │   │  │
// │                          │ │     ★4.9 • 1,247 reviews             │   │  │
// │                          │ │     Sofia • Responds in < 1 hour     │   │  │
// │                          │ │  [Message Seller]  [Visit Store]     │   │  │
// │                          │ └──────────────────────────────────────┘   │  │
// │                          │                                            │  │
// │                          │  Qty: [−] 1 [+]      Total: €349.99       │  │
// │                          │  [═══ ADD TO CART ═══]  [♡]  [⚡]         │  │
// │                          │                                            │  │
// │                          │  🚚 Free Shipping  •  🛡️ 14-Day Returns   │  │
// │                          └────────────────────────────────────────────┘  │
// └──────────────────────────────────────────────────────────────────────────┘
//
// =============================================================================

import * as React from "react"
import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Share,
  ShieldCheck,
  Truck,
  Package,
  Star,
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
  SealCheck,
  Storefront,
} from "@phosphor-icons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// =============================================================================
// MOCK DATA - C2C Listing (Individual Seller)
// =============================================================================

const MOCK_PRODUCT = {
  id: "prod-001",
  title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
  price: 349.99,
  originalPrice: 399.99,
  currency: "BGN",
  discount: 13,
  condition: "new" as const,
  stock: 1, // C2C often single item
  sold: 847,
  views: 2341,
  rating: 4.8,
  reviews: 234,
  brand: "Sony",
  model: "WH-1000XM5",
  warranty: "2 years",
  images: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80",
    "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&q=80",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80",
  ],
  seller: {
    id: "seller-001",
    name: "TechZone Pro",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
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
    estimatedDate: "Jan 21 - 23",
    provider: "Speedy",
  },
  protection: {
    days: 14,
  },
  description: `Experience exceptional sound quality with the Sony WH-1000XM5 wireless headphones. Featuring industry-leading noise cancellation technology, these headphones deliver an immersive audio experience whether you're commuting, working, or relaxing at home.

The newly designed 30mm driver unit delivers a wider frequency range, while the improved noise cancellation processor analyzes ambient sound more effectively. With up to 30 hours of battery life and quick charging capability, you can enjoy your music all day long.

Crafted with premium materials and a sleek design, the WH-1000XM5 offers exceptional comfort for extended listening sessions.`,
  specifications: [
    { label: "Driver Unit", value: "30mm" },
    { label: "Frequency Response", value: "4Hz-40kHz" },
    { label: "Battery Life", value: "30 hours" },
    { label: "Weight", value: "250g" },
    { label: "Bluetooth", value: "5.2" },
    { label: "Noise Cancellation", value: "Active (ANC)" },
  ],
}

// =============================================================================
// PRODUCT GALLERY - Clean, Focused
// =============================================================================

function ProductGallery({ images }: { images: string[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative group">
        <div className="relative aspect-square rounded-lg overflow-hidden bg-muted border border-border">
          <Image
            src={images[selectedIndex] || "/placeholder.svg"}
            alt="Product image"
            fill
            className={cn(
              "object-cover transition-transform duration-500 cursor-zoom-in",
              isZoomed && "scale-150"
            )}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
          />
        </div>

        {/* Image counter */}
        <div className="absolute bottom-3 left-3 bg-foreground/80 text-background text-xs font-medium px-2 py-1 rounded-full">
          {selectedIndex + 1} / {images.length}
        </div>

        {/* Share button */}
        <button
          type="button"
          className="absolute top-3 right-3 size-9 rounded-full bg-background/90 border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
          aria-label="Share"
        >
          <Share size={16} className="text-foreground" />
        </button>
      </div>

      {/* Thumbnail Strip */}
      <div className="flex gap-2">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSelectedIndex(i)}
            className={cn(
              "relative size-16 rounded-md overflow-hidden shrink-0 transition-all",
              selectedIndex === i
                ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                : "border border-border opacity-60 hover:opacity-100"
            )}
          >
            <Image
              src={img}
              alt={`Thumbnail ${i + 1}`}
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
// SELLER CARD - The Heart of C2C (Vertical Layout)
// =============================================================================

function SellerCard({ seller }: { seller: typeof MOCK_PRODUCT.seller }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4">
      {/* Seller Identity */}
      <div className="flex items-center gap-3">
        <Avatar className="size-12 border border-border">
          <AvatarImage src={seller.avatar} />
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
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Star size={12} weight="fill" className="text-rating" />
            <span className="font-medium text-foreground">{seller.rating}</span>
            <span>•</span>
            <span>{seller.reviews.toLocaleString()} reviews</span>
          </div>
        </div>
      </div>

      {/* Seller Stats */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock size={12} />
          {seller.responseTime}
        </span>
        <span className="flex items-center gap-1">
          <Package size={12} />
          {seller.ordersCompleted.toLocaleString()} sales
        </span>
        <span className="flex items-center gap-1">
          <MapPin size={12} />
          {seller.location.split(",")[0]}
        </span>
      </div>

      {/* Seller Actions */}
      <div className="flex gap-2 mt-3">
        <Button variant="outline" size="sm" className="flex-1 h-9 gap-1.5 text-sm">
          <ChatCircle size={14} />
          Message
        </Button>
        <Button variant="outline" size="sm" className="flex-1 h-9 gap-1.5 text-sm">
          <Storefront size={14} />
          Visit Store
        </Button>
      </div>
    </div>
  )
}

// =============================================================================
// BUY BOX - Compact Purchase Flow
// =============================================================================

function BuyBox({ product }: { product: typeof MOCK_PRODUCT }) {
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  
  const maxQty = product.stock
  const totalPrice = product.price * quantity

  return (
    <div className="space-y-3">
      {/* Quantity + Total */}
      <div className="flex items-center justify-between py-3 border-y border-border">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Quantity</span>
          <div className="flex items-center border border-border rounded-md">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="size-8 flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40"
              disabled={quantity <= 1}
            >
              <Minus size={14} />
            </button>
            <span className="w-10 text-center text-sm font-medium">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
              className="size-8 flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40"
              disabled={quantity >= maxQty}
            >
              <Plus size={14} />
            </button>
          </div>
          {maxQty <= 3 && (
            <span className="text-xs text-muted-foreground">
              {maxQty === 1 ? "Last one!" : `Only ${maxQty} left`}
            </span>
          )}
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Total</div>
          <div className="text-xl font-bold text-foreground">
            {totalPrice.toFixed(2)} {product.currency}
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex gap-2">
        <Button className="flex-1 h-12 text-sm font-semibold gap-2">
          <ShoppingCart size={18} weight="bold" />
          Add to Cart
        </Button>
        <button
          type="button"
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={cn(
            "size-12 rounded-md border flex items-center justify-center transition-colors",
            isWishlisted
              ? "border-wishlist-active bg-wishlist-active/10"
              : "border-border hover:bg-muted"
          )}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={20}
            weight={isWishlisted ? "fill" : "regular"}
            className={isWishlisted ? "text-wishlist-active" : "text-foreground"}
          />
        </button>
        <Button variant="outline" className="size-12" title="Buy Now">
          <Lightning size={20} weight="fill" />
        </Button>
      </div>

      {/* Trust Signals */}
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-1">
        <span className="flex items-center gap-1.5">
          <Truck size={14} className="text-success" />
          {product.shipping.free ? "Free Shipping" : "Paid Shipping"}
        </span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-success" />
          {product.protection.days}-Day Protection
        </span>
      </div>
    </div>
  )
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function ProductDesktop3Page() {
  const product = MOCK_PRODUCT

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
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

      {/* Main Content */}
      <main className="container py-6">
        {/* Hero Section - Everything Above Fold */}
        <div className="bg-background rounded-xl border border-border p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* LEFT: Gallery Only */}
            <div>
              <ProductGallery images={product.images} />
            </div>

            {/* RIGHT: Everything Else */}
            <div className="space-y-4">
              {/* Breadcrumb + Condition */}
              <div className="flex items-center justify-between">
                <nav className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span className="hover:text-foreground cursor-pointer">Electronics</span>
                  <CaretRight size={10} />
                  <span className="hover:text-foreground cursor-pointer">Audio</span>
                  <CaretRight size={10} />
                  <span className="text-foreground">{product.brand}</span>
                </nav>
                <Badge variant="outline" className="text-xs capitalize">
                  {product.condition}
                </Badge>
              </div>

              {/* Title */}
              <h1 className="text-xl font-semibold text-foreground leading-tight">
                {product.title}
              </h1>

              {/* Stats Row */}
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <Star size={14} weight="fill" className="text-rating" />
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-muted-foreground text-xs">({product.reviews})</span>
                </div>
                <span className="text-muted-foreground text-xs">•</span>
                <span className="text-muted-foreground text-xs">{product.sold} sold</span>
                <span className="text-muted-foreground text-xs">•</span>
                <span className="flex items-center gap-1 text-muted-foreground text-xs">
                  <Eye size={12} />
                  {product.views.toLocaleString()}
                </span>
              </div>

              {/* Price Block */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-foreground">
                  {product.price.toFixed(2)} {product.currency}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      {product.originalPrice.toFixed(2)}
                    </span>
                    <Badge variant="destructive" className="text-xs">
                      -{product.discount}%
                    </Badge>
                  </>
                )}
              </div>

              {/* Quick Specs - Inline */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm py-2 border-y border-border">
                <span>
                  <span className="text-muted-foreground">Brand:</span>{" "}
                  <span className="font-medium">{product.brand}</span>
                </span>
                <span>
                  <span className="text-muted-foreground">Model:</span>{" "}
                  <span className="font-medium">{product.model}</span>
                </span>
                <span>
                  <span className="text-muted-foreground">Warranty:</span>{" "}
                  <span className="font-medium">{product.warranty}</span>
                </span>
              </div>

              {/* Seller Card */}
              <SellerCard seller={product.seller} />

              {/* Buy Box */}
              <BuyBox product={product} />
            </div>
          </div>
        </div>

        {/* Below Fold - Description & Specs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Description */}
          <div className="lg:col-span-2 bg-background rounded-xl border border-border p-6">
            <h2 className="font-semibold text-foreground mb-4">Description</h2>
            <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
              {product.description}
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-background rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h2 className="font-semibold text-foreground">Specifications</h2>
            </div>
            <div className="divide-y divide-border">
              {product.specifications.map((spec, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-4 py-2.5 text-sm"
                >
                  <span className="text-muted-foreground">{spec.label}</span>
                  <span className="font-medium text-foreground">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-6 bg-background rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Reviews</h2>
            <Button variant="outline" size="sm">
              See all {product.reviews}
            </Button>
          </div>
          
          {/* Review Summary */}
          <div className="flex items-center gap-6 py-4 border-y border-border">
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground">{product.rating}</div>
              <div className="flex items-center justify-center gap-0.5 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    weight="fill"
                    className={star <= Math.round(product.rating) ? "text-rating" : "text-rating-empty"}
                  />
                ))}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{product.reviews} reviews</div>
            </div>
            
            {/* Rating Distribution */}
            <div className="flex-1 space-y-1">
              {[5, 4, 3, 2, 1].map((rating) => {
                const pct = rating === 5 ? 78 : rating === 4 ? 15 : rating === 3 ? 5 : 1
                return (
                  <div key={rating} className="flex items-center gap-2 text-xs">
                    <span className="w-3 text-muted-foreground">{rating}</span>
                    <Star size={10} weight="fill" className="text-rating" />
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-rating rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-8 text-right text-muted-foreground">{pct}%</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Sample Review */}
          <div className="mt-4">
            <div className="flex items-start gap-3">
              <Avatar className="size-9">
                <AvatarFallback className="text-xs">JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground text-sm">John D.</span>
                  <Badge variant="outline" className="text-2xs">Verified</Badge>
                </div>
                <div className="flex items-center gap-0.5 mt-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={10} weight="fill" className="text-rating" />
                  ))}
                  <span className="text-xs text-muted-foreground ml-2">2 weeks ago</span>
                </div>
                <p className="text-sm text-foreground/90 mt-2">
                  Absolutely incredible headphones! The noise cancellation is next level.
                  Battery life is amazing, I only charge once a week. Highly recommended!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-3 safe-area-inset-bottom">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="size-11 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-colors"
          >
            <Heart size={20} className="text-muted-foreground" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="text-lg font-bold text-foreground">
              {product.price.toFixed(2)} {product.currency}
            </div>
            <span className="text-xs text-success flex items-center gap-1">
              <Truck size={12} />
              Free shipping
            </span>
          </div>
          <Button size="lg" className="gap-2">
            <ShoppingCart size={18} weight="bold" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}
