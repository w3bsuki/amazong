"use client";

// =============================================================================
// DEMO MOBILE PRODUCT PAGE - Pixel-Perfect C2C Marketplace
// =============================================================================
//
// Design principles:
// 1. Twitter/X-style clean theming - No shadows, borders for separation
// 2. Dense, readable UI - Tight gaps, clear hierarchy
// 3. Touch-first - All interactive elements ≥44px
// 4. High contrast - Clear text, strong visual hierarchy
// 5. Modern webapp feel - Clean, professional, trustworthy
//
// V1 Launch: OLX/Bazar model - peer-to-peer transactions
// =============================================================================

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  Heart,
  Share2,
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  MessageCircle,
  CheckCircle2,
  Package,
  Eye,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Phone,
  Folder,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

// =============================================================================
// MOCK DATA - Realistic C2C product listing
// =============================================================================

const DEMO_PRODUCT = {
  id: "demo-001",
  title: "Apple iPhone 15 Pro Max 256GB Natural Titanium - Unlocked, Excellent Condition",
  price: 1089.00,
  originalPrice: 1199.00,
  currency: "EUR",
  condition: "Like New",
  views: 847,
  favorites: 156,
  createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  location: "Sofia, Bulgaria",
  images: [
    { src: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=600&fit=crop", alt: "iPhone 15 Pro Max front view" },
    { src: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&h=600&fit=crop", alt: "iPhone 15 Pro Max back view" },
    { src: "https://images.unsplash.com/photo-1697733804589-ba649eb8c86b?w=800&h=600&fit=crop", alt: "iPhone 15 Pro Max camera detail" },
    { src: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=600&fit=crop", alt: "iPhone 15 Pro Max in hand" },
  ],
  seller: {
    name: "TechStore Pro",
    username: "techstore_pro",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    rating: 4.9,
    reviewCount: 342,
    salesCount: 1847,
    isVerified: true,
    responseTime: "Usually within 1 hour",
    memberSince: "2021",
    lastSeen: "Active now",
  },
  specs: [
    { label: "Brand", value: "Apple" },
    { label: "Model", value: "iPhone 15 Pro Max" },
    { label: "Storage", value: "256GB" },
    { label: "Color", value: "Natural Titanium" },
    { label: "Network", value: "Unlocked" },
    { label: "Battery Health", value: "98%" },
  ],
  description: `Selling my iPhone 15 Pro Max in excellent condition. Used for only 3 months, always with case and screen protector.

Includes:
• Original box and accessories
• Fast charger (20W)
• Premium leather case
• Tempered glass screen protector

The phone is unlocked and works with any carrier. Battery health is at 98%. No scratches, dents, or any cosmetic damage. AppleCare+ transferable until December 2025.

Reason for selling: Upgrading to the 16 Pro Max.

💬 Feel free to message me for questions or to arrange a viewing!`,
  delivery: {
    meetup: true,
    shipping: true,
    shippingNote: "Shipping available (buyer pays)",
  },
  category: {
    name: "Phones & Tablets",
    subcategory: "iPhones",
  },
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function DemoMobileProductPage() {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isSpecsExpanded, setIsSpecsExpanded] = useState(true);

  const product = DEMO_PRODUCT;

  // Carousel sync
  useEffect(() => {
    if (!carouselApi) return;
    
    const onSelect = () => setCurrentImage(carouselApi.selectedScrollSnap());
    onSelect();
    carouselApi.on("select", onSelect);
    
    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  const scrollTo = useCallback((index: number) => {
    carouselApi?.scrollTo(index);
  }, [carouselApi]);

  // Format price
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: product.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  // Calculate discount percentage
  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  // Format relative time
  const timeAgo = "2 hours ago";

  // Bottom bar height for proper content padding
  const BOTTOM_BAR_HEIGHT = 120; // px - accounts for price row + buttons + safe area

  return (
    <div className="min-h-screen bg-background lg:hidden" style={{ paddingBottom: BOTTOM_BAR_HEIGHT }}>
      {/* ================================================================= */}
      {/* STICKY HEADER - Twitter-clean with seller context */}
      {/* ================================================================= */}
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="flex items-center h-11 px-1">
          {/* Back Button */}
          <button
            type="button"
            className="size-11 flex items-center justify-center text-foreground active:bg-muted/60 rounded-full shrink-0 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="size-5" strokeWidth={1.5} />
          </button>

          {/* Center: Seller Avatar + Product Title */}
          <div className="flex-1 flex items-center gap-2 min-w-0 px-1">
            <div className="size-6 rounded-full overflow-hidden border border-border/80 shrink-0">
              <Image
                src={product.seller.avatar}
                alt={product.seller.name}
                width={24}
                height={24}
                className="size-full object-cover"
              />
            </div>
            <span className="text-sm font-medium text-foreground truncate leading-tight">
              {product.title}
            </span>
          </div>

          {/* Right Actions: Favorite + Share */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setIsFavorited(!isFavorited)}
              className={cn(
                "size-11 flex items-center justify-center rounded-full active:bg-muted/60 transition-colors",
                isFavorited ? "text-destructive" : "text-muted-foreground"
              )}
              aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                className={cn("size-5", isFavorited && "fill-current")}
                strokeWidth={1.5}
              />
            </button>
            <button
              type="button"
              className="size-11 flex items-center justify-center text-muted-foreground active:bg-muted/60 rounded-full transition-colors"
              aria-label="Share"
            >
              <Share2 className="size-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* ================================================================= */}
      {/* IMAGE GALLERY - Full bleed with badges */}
      {/* ================================================================= */}
      <section className="relative bg-muted/20">
        <Carousel
          setApi={setCarouselApi}
          opts={{ align: "start", loop: product.images.length > 1 }}
          className="w-full"
        >
          <CarouselContent className="-ml-0">
            {product.images.map((img, index) => (
              <CarouselItem key={index} className="pl-0">
                <div className="relative aspect-[4/3] bg-muted/30">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-contain"
                    priority={index === 0}
                    sizes="100vw"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Category Badge - Top Left */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-background/95 border border-border text-xs font-medium text-foreground">
            <Folder className="size-3.5 text-muted-foreground" />
            <span>
              {product.category.name}
              <span className="text-muted-foreground"> · {product.category.subcategory}</span>
            </span>
          </span>
        </div>

        {/* Condition Badge - Top Right */}
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center px-2 py-1 rounded-full bg-foreground text-background text-2xs font-semibold tracking-wide">
            {product.condition}
          </span>
        </div>

        {/* Image Counter - Bottom Right */}
        <div className="absolute bottom-3 right-3 z-10">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-foreground/85 text-background text-2xs font-semibold tabular-nums">
            {currentImage + 1}/{product.images.length}
          </span>
        </div>

        {/* Dot Indicators */}
        {product.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {product.images.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => scrollTo(index)}
                className={cn(
                  "size-1.5 rounded-full transition-all duration-200",
                  currentImage === index 
                    ? "bg-foreground w-3" 
                    : "bg-foreground/40 hover:bg-foreground/60"
                )}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* ================================================================= */}
      {/* META ROW - Location, Time, Stats */}
      {/* ================================================================= */}
      <section className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {/* Left: Location + Time */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5" strokeWidth={1.5} />
              <span>{product.location}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" strokeWidth={1.5} />
              <span>{timeAgo}</span>
            </span>
          </div>
          
          {/* Right: Views + Saved */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="size-3.5" strokeWidth={1.5} />
              <span className="tabular-nums">{product.views}</span>
            </span>
            <span className="flex items-center gap-1">
              <Bookmark className="size-3.5" strokeWidth={1.5} />
              <span className="tabular-nums">{product.favorites}</span>
            </span>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* TITLE + PRICE BLOCK */}
      {/* ================================================================= */}
      <section className="px-4 py-4 border-b border-border">
        {/* Title */}
        <h1 className="text-base font-semibold leading-snug text-foreground">
          {product.title}
        </h1>

        {/* Price */}
        <div className="flex items-baseline gap-2.5 mt-3">
          <span className="text-2xl font-bold text-foreground tracking-tight">
            {formatPrice(product.price)}
          </span>
          <span className="text-sm text-muted-foreground line-through">
            {formatPrice(product.originalPrice)}
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-destructive/10 text-destructive text-xs font-semibold">
            -{discountPercent}%
          </span>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SELLER CARD - Clean, professional */}
      {/* ================================================================= */}
      <section className="px-4 py-4 border-b border-border">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="size-12 rounded-full overflow-hidden border border-border shrink-0">
            <Image
              src={product.seller.avatar}
              alt={product.seller.name}
              width={48}
              height={48}
              className="size-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-foreground">
                {product.seller.name}
              </span>
              {product.seller.isVerified && (
                <CheckCircle2 className="size-4 text-primary shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
              <Star className="size-3 fill-foreground text-foreground" />
              <span className="font-semibold text-foreground">{product.seller.rating}</span>
              <span className="text-muted-foreground">·</span>
              <span>{product.seller.reviewCount} reviews</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {product.seller.lastSeen} · Member since {product.seller.memberSince}
            </div>
          </div>
        </div>

        {/* View Profile Button */}
        <button
          type="button"
          className="w-full mt-3 h-10 text-sm font-medium text-foreground border border-border rounded-lg bg-background active:bg-muted transition-colors"
        >
          View Profile
        </button>
      </section>

      {/* ================================================================= */}
      {/* SPECIFICATIONS - Expandable accordion */}
      {/* ================================================================= */}
      <section className="border-b border-border">
        <button
          type="button"
          onClick={() => setIsSpecsExpanded(!isSpecsExpanded)}
          className="w-full flex items-center justify-between px-4 h-12 text-left active:bg-muted/40 transition-colors"
        >
          <span className="text-sm font-semibold text-foreground">Specifications</span>
          {isSpecsExpanded ? (
            <ChevronUp className="size-5 text-muted-foreground" strokeWidth={1.5} />
          ) : (
            <ChevronDown className="size-5 text-muted-foreground" strokeWidth={1.5} />
          )}
        </button>

        {isSpecsExpanded && (
          <div className="px-4 pb-4">
            <div className="divide-y divide-border">
              {product.specs.map((spec) => (
                <div key={spec.label} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-muted-foreground">{spec.label}</span>
                  <span className="font-medium text-foreground text-right">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ================================================================= */}
      {/* DESCRIPTION - Expandable accordion */}
      {/* ================================================================= */}
      <section className="border-b border-border">
        <button
          type="button"
          onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
          className="w-full flex items-center justify-between px-4 h-12 text-left active:bg-muted/40 transition-colors"
        >
          <span className="text-sm font-semibold text-foreground">Description</span>
          {isDescriptionExpanded ? (
            <ChevronUp className="size-5 text-muted-foreground" strokeWidth={1.5} />
          ) : (
            <ChevronDown className="size-5 text-muted-foreground" strokeWidth={1.5} />
          )}
        </button>

        <div className="px-4 pb-4">
          <p
            className={cn(
              "text-sm text-muted-foreground whitespace-pre-line leading-relaxed",
              !isDescriptionExpanded && "line-clamp-4"
            )}
          >
            {product.description}
          </p>
          {!isDescriptionExpanded && (
            <button
              type="button"
              onClick={() => setIsDescriptionExpanded(true)}
              className="text-sm font-medium text-primary mt-2 active:opacity-70 transition-opacity"
            >
              Read more
            </button>
          )}
        </div>
      </section>

      {/* ================================================================= */}
      {/* DELIVERY OPTIONS - Clear, visible section */}
      {/* ================================================================= */}
      <section className="px-4 py-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Delivery Options</h3>
        <div className="space-y-3">
          {product.delivery.meetup && (
            <div className="flex items-center gap-3 text-sm">
              <div className="size-8 rounded-full bg-muted/60 flex items-center justify-center shrink-0">
                <MapPin className="size-4 text-foreground" strokeWidth={1.5} />
              </div>
              <span className="text-foreground">Meet up in person</span>
            </div>
          )}
          {product.delivery.shipping && (
            <div className="flex items-center gap-3 text-sm">
              <div className="size-8 rounded-full bg-muted/60 flex items-center justify-center shrink-0">
                <Package className="size-4 text-foreground" strokeWidth={1.5} />
              </div>
              <span className="text-foreground">{product.delivery.shippingNote}</span>
            </div>
          )}
        </div>
      </section>

      {/* ================================================================= */}
      {/* BOTTOM ACTION BAR - Fixed, clean design */}
      {/* ================================================================= */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-background border-t border-border">
        {/* Price Summary Row */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/50">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground tracking-tight">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {product.delivery.meetup && product.delivery.shipping
              ? "Meetup or shipping"
              : product.delivery.meetup
                ? "Meetup only"
                : "Shipping available"}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))]">
          {/* Chat Button */}
          <button
            type="button"
            className="flex-1 h-12 flex items-center justify-center gap-2 rounded-lg border border-border bg-background text-foreground font-semibold text-sm active:bg-muted transition-colors"
          >
            <MessageCircle className="size-4.5" strokeWidth={1.5} />
            Chat
          </button>

          {/* Call/Contact Button - Primary CTA */}
          <button
            type="button"
            className="flex-1 h-12 flex items-center justify-center gap-2 rounded-lg bg-foreground text-background font-semibold text-sm active:opacity-90 transition-opacity"
          >
            <Phone className="size-4.5" strokeWidth={1.5} />
            Show Number
          </button>
        </div>
      </div>
    </div>
  );
}
