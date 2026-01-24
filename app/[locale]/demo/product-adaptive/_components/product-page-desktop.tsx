"use client"

// =============================================================================
// PRODUCT PAGE - DESKTOP (Category-Adaptive)
// =============================================================================
// Based on V2 Desktop - the winner from our audit.
// Adapts hero specs display based on product category.
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
  SealCheck,
} from "@phosphor-icons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { DemoProduct } from "../_data/demo-products"

// =============================================================================
// PRODUCT GALLERY
// =============================================================================

function ProductGallery({ images }: { images: string[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative group">
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted border border-border">
          <Image
            src={images[selectedIndex] || "/placeholder.svg"}
            alt="Product image"
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

        {/* Floating share */}
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
          {selectedIndex + 1} / {images.length}
        </div>
      </div>

      {/* Horizontal Thumbnails */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {images.map((img, i) => (
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
            <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-cover" sizes="64px" />
          </button>
        ))}
      </div>
    </div>
  )
}

// =============================================================================
// HERO SPECS - Category-Adaptive Pills
// =============================================================================

function HeroSpecs({ specs }: { specs: { label: string; value: string }[] }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {specs.slice(0, 4).map((spec) => (
        <div
          key={spec.label}
          className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-center"
        >
          <span className="block text-2xs uppercase tracking-wide text-muted-foreground">
            {spec.label}
          </span>
          <span className="block text-sm font-semibold text-foreground mt-0.5 truncate">
            {spec.value}
          </span>
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// PRODUCT INFO
// =============================================================================

function ProductInfo({ product }: { product: DemoProduct }) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="space-y-3">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
        {product.categoryPath.map((cat, i) => (
          <React.Fragment key={cat}>
            {i > 0 && <CaretRight size={10} className="shrink-0" />}
            <span
              className={cn(
                "hover:text-foreground cursor-pointer",
                i === product.categoryPath.length - 1 && "text-foreground font-medium"
              )}
            >
              {cat}
            </span>
          </React.Fragment>
        ))}
      </nav>

      {/* Title */}
      <h1 className="text-xl font-semibold text-foreground leading-tight">{product.title}</h1>
      {product.subtitle && (
        <p className="text-sm text-muted-foreground -mt-1">{product.subtitle}</p>
      )}

      {/* Rating + Stats */}
      <div className="flex items-center gap-3 text-sm flex-wrap">
        <div className="flex items-center gap-1">
          <Star size={14} weight="fill" className="text-rating" />
          <span className="font-medium">{product.seller.rating}</span>
          <span className="text-muted-foreground text-xs">({product.seller.reviews})</span>
        </div>
        {product.stats.sold && (
          <>
            <span className="text-muted-foreground">•</span>
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <Package size={12} />
              <span>{product.stats.sold} sold</span>
            </div>
          </>
        )}
        <span className="text-muted-foreground">•</span>
        <div className="flex items-center gap-1 text-muted-foreground text-xs">
          <Eye size={12} />
          <span>{product.stats.views.toLocaleString()} views</span>
        </div>
      </div>

      {/* Price Block */}
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-2xl font-bold text-foreground">
          {product.price.toLocaleString()} {product.currency}
        </span>
        {product.originalPrice && (
          <>
            <span className="text-base text-muted-foreground line-through">
              {product.originalPrice.toLocaleString()} {product.currency}
            </span>
            <Badge variant="destructive" className="text-xs px-1.5 py-0">
              -{discount}%
            </Badge>
          </>
        )}
      </div>

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {product.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Hero Specs - Category Adaptive */}
      <div className="pt-2">
        <HeroSpecs specs={product.heroSpecs} />
      </div>
    </div>
  )
}

// =============================================================================
// BUY BOX
// =============================================================================

function BuyBox({ product }: { product: DemoProduct }) {
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const isRealEstate = product.category === "real-estate"
  const isAutomotive = product.category === "automotive"
  const showQuantity = !isRealEstate && !isAutomotive

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      {/* Stock + Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-success" />
          <span className="text-sm font-medium text-success">
            {isRealEstate ? "Available" : isAutomotive ? "In Stock" : "In Stock"}
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
          >
            <Heart
              size={18}
              weight={isWishlisted ? "fill" : "regular"}
              className={isWishlisted ? "text-wishlist-active" : "text-muted-foreground"}
            />
          </button>
          <button type="button" className="p-1.5 rounded-md hover:bg-muted transition-colors">
            <Share size={18} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Shipping/Location Info */}
      <div className="rounded-md border border-border bg-muted/30 p-2.5 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            {isRealEstate ? (
              <>
                <MapPin size={16} className="text-foreground" />
                <span className="font-medium text-foreground">{product.location}</span>
              </>
            ) : (
              <>
                <Truck size={16} className={product.shipping.free ? "text-success" : "text-foreground"} />
                <span className="font-medium text-foreground">
                  {product.shipping.free ? "Free Shipping" : "Shipping Available"}
                </span>
              </>
            )}
          </div>
          {product.shipping.provider && (
            <span className="text-xs text-muted-foreground">via {product.shipping.provider}</span>
          )}
        </div>
        {!isRealEstate && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {isAutomotive ? "Pickup available" : `Delivery: ${product.shipping.estimatedDays} days`}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {product.location}
            </span>
          </div>
        )}
      </div>

      {/* Quantity + Total (for applicable categories) */}
      {showQuantity && (
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
              <span className="px-3 py-1 text-sm font-medium min-w-[2.5rem] text-center">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="p-1.5 hover:bg-muted transition-colors"
              >
                <Plus size={14} className="text-foreground" />
              </button>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-muted-foreground">Total</span>
            <div className="text-lg font-bold text-foreground">
              {(product.price * quantity).toLocaleString()} {product.currency}
            </div>
          </div>
        </div>
      )}

      {/* CTA Buttons - Category Adaptive */}
      <div className="flex gap-2">
        {isRealEstate ? (
          <>
            <Button className="flex-1 h-11 text-sm font-semibold gap-2">
              <ChatCircle size={18} weight="bold" />
              Contact Agent
            </Button>
            <Button variant="outline" className="h-11 px-4">
              Schedule Visit
            </Button>
          </>
        ) : isAutomotive ? (
          <>
            <Button className="flex-1 h-11 text-sm font-semibold gap-2">
              <ChatCircle size={18} weight="bold" />
              Contact Seller
            </Button>
            <Button variant="outline" className="h-11 px-4">
              Test Drive
            </Button>
          </>
        ) : (
          <>
            <Button className="flex-1 h-11 text-sm font-semibold gap-2">
              <ShoppingCart size={18} weight="bold" />
              Add to Cart
            </Button>
            <Button variant="outline" className="h-11 px-4" title="Buy Now">
              <Lightning size={18} weight="fill" />
            </Button>
          </>
        )}
      </div>

      {/* Protection */}
      <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <ShieldCheck size={12} className="text-success" />
          Buyer Protection
        </span>
        <span className="text-border">|</span>
        <span className="flex items-center gap-1">
          <Package size={12} />
          {isRealEstate ? "Verified Listing" : "Easy Returns"}
        </span>
      </div>

      {/* Seller Card */}
      <div className="rounded-md border border-border bg-muted/30 p-3">
        <div className="flex items-center gap-2.5">
          <Avatar className="size-10 border border-border">
            <AvatarImage src={product.seller.avatar} />
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

        {/* Seller Stats */}
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
            <MapPin size={10} />
            {product.seller.location.split(",")[0]}
          </span>
        </div>

        {/* Seller Actions */}
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
// MAIN COMPONENT
// =============================================================================

export function ProductPageDesktop({ product }: { product: DemoProduct }) {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-12 z-40 w-full bg-background border-b border-border">
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
      <main className="container py-8">
        <div className="bg-background rounded-xl border border-border p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-8 lg:gap-12">
            {/* LEFT: Gallery + Features */}
            <div className="space-y-6">
              <ProductGallery images={product.images} />

              {/* Key Features + Quick Specs */}
              <div className="hidden lg:grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <h3 className="font-semibold text-foreground mb-3 text-sm">Key Features</h3>
                  <ul className="space-y-2">
                    {product.specifications.slice(0, 5).map((spec) => (
                      <li key={spec.label} className="flex items-start gap-2 text-sm">
                        <Check size={14} weight="bold" className="text-success shrink-0 mt-0.5" />
                        <span className="text-foreground text-xs">
                          {spec.label}: {spec.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <h3 className="font-semibold text-foreground mb-3 text-sm">Quick Specs</h3>
                  <div className="space-y-1.5">
                    {product.specifications.slice(5, 10).map((spec) => (
                      <div
                        key={spec.label}
                        className="flex items-center justify-between text-xs py-1 border-b border-border/40 last:border-0"
                      >
                        <span className="text-muted-foreground">{spec.label}</span>
                        <span className="font-medium text-foreground">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Info + Buy Box */}
            <div className="lg:sticky lg:top-32 lg:self-start space-y-4">
              <ProductInfo product={product} />
              <BuyBox product={product} />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-8 bg-background rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Description</h3>
          <div className="prose prose-sm prose-neutral max-w-none text-foreground leading-relaxed whitespace-pre-line">
            {product.description}
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
                key={spec.label}
                className={cn(
                  "flex items-center justify-between px-6 py-3 text-sm",
                  i % 2 === 0 ? "bg-background" : "bg-muted/30",
                  "border-b border-border/50 last:border-0"
                )}
              >
                <span className="text-muted-foreground">{spec.label}</span>
                <span className="font-medium text-foreground">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
