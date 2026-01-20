"use client";

// =============================================================================
// PRODUCT MOBILE V3 — Ultimate C2C Mobile Commerce
// =============================================================================
//
// Design philosophy:
// - App-like native feel (no web borders, fills over strokes)
// - Twitter/X clean aesthetic with semantic tokens
// - Grouped sections with subtle muted backgrounds
// - Perfect touch targets (≥32px)
// - No shadows, no glows, no AI slop
// - Pixel-perfect spacing on 4px grid
//
// =============================================================================

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  MapPin,
  Clock,
  Eye,
  Bookmark,
  ChevronRight,
  MessageCircle,
  ShoppingBag,
  BadgeCheck,
  Package,
  Users,
  Shield,
  Truck,
  Tag,
  Info,
  Flag,
} from "lucide-react";
import { cn } from "@/lib/utils";

// =============================================================================
// DATA
// =============================================================================

const PRODUCT = {
  id: "v3-001",
  title: "Apple iPhone 15 Pro Max 256GB Natural Titanium - Unlocked, Excellent",
  shortTitle: "iPhone 15 Pro Max",
  category: "Phones & Tablets",
  subcategory: "iPhones",
  price: 1089,
  originalPrice: 1199,
  currency: "€",
  condition: "Like New",
  negotiable: true,
  location: "Sofia, Bulgaria",
  posted: "2h ago",
  views: 847,
  saves: 156,
  images: [
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=90",
    "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&q=90",
    "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=90",
    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=90",
  ],
  seller: {
    name: "TechStore Pro",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=90",
    rating: 4.9,
    reviews: 342,
    sold: 89,
    verified: true,
    responseTime: "Usually responds in 1h",
    joined: "Mar 2021",
    lastActive: "Active now",
  },
  specs: [
    { key: "Brand", value: "Apple" },
    { key: "Model", value: "iPhone 15 Pro Max" },
    { key: "Storage", value: "256GB" },
    { key: "Color", value: "Natural Titanium" },
    { key: "Battery Health", value: "98%" },
    { key: "Warranty", value: "AppleCare+ until Dec '25" },
    { key: "Network", value: "Factory Unlocked" },
    { key: "Included", value: "Box, Cable, Case" },
  ],
  description: `My daily driver for 3 months. Always in case + screen protector from day 1.

What you get:
• Phone in perfect condition
• Original box + all accessories
• 20W fast charger
• Leather case (worth €59)
• Extra screen protector

Factory unlocked, works worldwide. Zero scratches, zero issues.

Upgrading to 16 Pro Max, my loss is your gain 🤝`,
  delivery: {
    meetup: true,
    shipping: true,
    cod: true,
  },
};

const SIMILAR = [
  { id: "s1", title: "iPhone 15 Pro", price: 899, img: "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400&q=80", condition: "Excellent" },
  { id: "s2", title: "iPhone 14 Pro Max", price: 749, img: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400&q=80", condition: "Like New" },
  { id: "s3", title: "iPhone 15 Plus", price: 699, img: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&q=80", condition: "Good" },
  { id: "s4", title: "iPhone 15", price: 599, img: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&q=80", condition: "Good" },
];

// =============================================================================
// COMPONENT
// =============================================================================

export function ProductMobile3() {
  const [currentImage, setCurrentImage] = useState(0);
  const [saved, setSaved] = useState(false);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [activeTab, setActiveTab] = useState<"specs" | "about">("specs");
  const [fullscreenGallery, setFullscreenGallery] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const headerTriggerRef = useRef<HTMLDivElement>(null);

  // Gallery scroll sync
  useEffect(() => {
    const el = galleryRef.current;
    if (!el) return;
    const handleScroll = () => {
      const idx = Math.round(el.scrollLeft / el.offsetWidth);
      setCurrentImage(idx);
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  // Sticky header observer
  useEffect(() => {
    const el = headerTriggerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => entry && setShowStickyHeader(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-56px 0px 0px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const scrollToImage = useCallback((idx: number) => {
    galleryRef.current?.scrollTo({
      left: idx * (galleryRef.current?.offsetWidth || 0),
      behavior: "smooth",
    });
  }, []);

  const discount = Math.round(
    ((PRODUCT.originalPrice - PRODUCT.price) / PRODUCT.originalPrice) * 100
  );

  return (
    <div className="min-h-dvh bg-muted/30 lg:hidden">
      {/* ================================================================= */}
      {/* STICKY HEADER — Appears on scroll                                 */}
      {/* ================================================================= */}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-transform duration-200",
          showStickyHeader ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="h-14 bg-background/95 backdrop-blur-md flex items-center gap-2 px-2">
          <button
            type="button"
            className="size-10 flex items-center justify-center text-foreground active:bg-muted rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="size-5" strokeWidth={1.5} />
          </button>
          <span className="flex-1 font-semibold text-sm text-foreground truncate">
            {PRODUCT.shortTitle}
          </span>
          <button
            type="button"
            onClick={() => setSaved(!saved)}
            className={cn(
              "size-10 flex items-center justify-center rounded-full transition-colors",
              saved ? "text-wishlist" : "text-muted-foreground"
            )}
            aria-label={saved ? "Remove from saved" : "Save"}
          >
            <Heart className={cn("size-5", saved && "fill-current")} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            className="size-10 flex items-center justify-center text-muted-foreground active:bg-muted rounded-full transition-colors"
            aria-label="Share"
          >
            <Share2 className="size-5" strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* ================================================================= */}
      {/* IMAGE GALLERY — Full-bleed with floating controls                 */}
      {/* ================================================================= */}
      <section className="relative bg-card">
        {/* Floating navigation */}
        <div className="absolute top-3 inset-x-3 z-20 flex justify-between pointer-events-none">
          <button
            type="button"
            className="size-10 rounded-full bg-background/90 flex items-center justify-center text-foreground active:bg-background pointer-events-auto transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="size-5" strokeWidth={1.5} />
          </button>
          <div className="flex gap-2 pointer-events-auto">
            <button
              type="button"
              onClick={() => setSaved(!saved)}
              className={cn(
                "size-10 rounded-full flex items-center justify-center transition-colors",
                saved
                  ? "bg-wishlist text-white"
                  : "bg-background/90 text-foreground"
              )}
              aria-label={saved ? "Remove from saved" : "Save"}
            >
              <Heart className={cn("size-5", saved && "fill-current")} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              className="size-10 rounded-full bg-background/90 flex items-center justify-center text-foreground active:bg-background transition-colors"
              aria-label="Share"
            >
              <Share2 className="size-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Image badges - bottom left */}
        <div className="absolute bottom-3 left-3 z-20 flex flex-col gap-1.5 items-start">
          <span className="px-2 py-1 rounded-md bg-foreground text-background text-2xs font-semibold">
            {PRODUCT.condition}
          </span>
          <span className="px-2 py-1 rounded-md bg-background/90 text-foreground text-2xs font-medium">
            {PRODUCT.subcategory}
          </span>
        </div>

        {/* Image counter - bottom right */}
        <div className="absolute bottom-3 right-3 z-20">
          <span className="px-2.5 py-1 rounded-full bg-foreground/80 text-background text-2xs font-semibold tabular-nums">
            {currentImage + 1}/{PRODUCT.images.length}
          </span>
        </div>

        {/* Main gallery */}
        <div
          ref={galleryRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none"
          onClick={() => setFullscreenGallery(true)}
        >
          {PRODUCT.images.map((src, idx) => (
            <div key={idx} className="flex-none w-full snap-center">
              <div className="relative aspect-square bg-muted/50">
                <Image
                  src={src}
                  alt={`${PRODUCT.title} - Image ${idx + 1}`}
                  fill
                  className="object-cover"
                  priority={idx === 0}
                  sizes="100vw"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Thumbnail strip */}
      <div className="flex gap-1.5 p-2 bg-background">
        {PRODUCT.images.map((src, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => scrollToImage(idx)}
            className={cn(
              "flex-1 aspect-square rounded-md overflow-hidden transition-all",
              idx === currentImage
                ? "ring-2 ring-foreground ring-offset-1 ring-offset-background"
                : "opacity-50"
            )}
          >
            <Image
              src={src}
              alt=""
              width={80}
              height={80}
              className="object-cover size-full"
            />
          </button>
        ))}
      </div>

      {/* ================================================================= */}
      {/* META ROW — Stats line                                             */}
      {/* ================================================================= */}
      <div className="bg-background px-4 py-2.5 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <MapPin className="size-3.5" strokeWidth={1.5} />
            {PRODUCT.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" strokeWidth={1.5} />
            {PRODUCT.posted}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 tabular-nums">
            <Eye className="size-3.5" strokeWidth={1.5} />
            {PRODUCT.views}
          </span>
          <span className="flex items-center gap-1 tabular-nums">
            <Bookmark className="size-3.5" strokeWidth={1.5} />
            {PRODUCT.saves}
          </span>
        </div>
      </div>

      {/* ================================================================= */}
      {/* TITLE + PRICE — The hero block                                    */}
      {/* ================================================================= */}
      <div ref={headerTriggerRef} className="bg-background px-4 py-3 mt-1.5">
        {/* Title */}
        <h1 className="text-base font-semibold text-foreground leading-snug">
          {PRODUCT.title}
        </h1>

        {/* Price row */}
        <div className="flex items-baseline gap-2.5 mt-2.5">
          <span className="text-2xl font-bold text-foreground tracking-tight">
            {PRODUCT.currency}{PRODUCT.price.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground line-through">
            {PRODUCT.currency}{PRODUCT.originalPrice.toLocaleString()}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-price-sale/10 text-price-sale text-xs font-semibold">
            -{discount}%
          </span>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-3">
          {PRODUCT.negotiable && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              <Tag className="size-3" />
              Negotiable
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
            <Shield className="size-3" />
            Buyer Protection
          </span>
        </div>
      </div>

      {/* ================================================================= */}
      {/* SELLER CARD — Trust-focused                                       */}
      {/* ================================================================= */}
      <button
        type="button"
        className="w-full bg-background mt-1.5 px-4 py-3 flex items-center gap-3 text-left active:bg-muted/50 transition-colors"
      >
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="size-12 rounded-full overflow-hidden bg-muted">
            <Image
              src={PRODUCT.seller.avatar}
              alt={PRODUCT.seller.name}
              width={48}
              height={48}
              className="object-cover size-full"
            />
          </div>
          {PRODUCT.seller.verified && (
            <span className="absolute -bottom-0.5 -right-0.5 size-5 bg-verified rounded-full flex items-center justify-center ring-2 ring-background">
              <BadgeCheck className="size-3 text-white" />
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm text-foreground">
              {PRODUCT.seller.name}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Star className="size-3.5 fill-rating text-rating" />
            <span className="text-sm font-semibold text-foreground">
              {PRODUCT.seller.rating}
            </span>
            <span className="text-xs text-muted-foreground">
              · {PRODUCT.seller.reviews} reviews
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {PRODUCT.seller.lastActive} · {PRODUCT.seller.sold} sold
          </p>
        </div>

        <ChevronRight className="size-5 text-muted-foreground shrink-0" />
      </button>

      {/* ================================================================= */}
      {/* DELIVERY OPTIONS                                                  */}
      {/* ================================================================= */}
      <div className="bg-background mt-1.5 px-4 py-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2.5">
          Delivery
        </h3>
        <div className="flex flex-wrap gap-2">
          {PRODUCT.delivery.meetup && (
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted text-sm text-foreground">
              <MapPin className="size-4 text-muted-foreground" strokeWidth={1.5} />
              Meetup
            </span>
          )}
          {PRODUCT.delivery.shipping && (
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted text-sm text-foreground">
              <Truck className="size-4 text-muted-foreground" strokeWidth={1.5} />
              Shipping
            </span>
          )}
          {PRODUCT.delivery.cod && (
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-shipping-free/10 text-sm text-shipping-free font-medium">
              <Package className="size-4" strokeWidth={1.5} />
              Cash on Delivery
            </span>
          )}
        </div>
      </div>

      {/* ================================================================= */}
      {/* TABS — Specs / About                                              */}
      {/* ================================================================= */}
      <div className="bg-background mt-1.5">
        {/* Tab headers */}
        <div className="flex">
          <button
            type="button"
            onClick={() => setActiveTab("specs")}
            className={cn(
              "flex-1 py-3 text-sm font-semibold transition-colors relative",
              activeTab === "specs" ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Specifications
            {activeTab === "specs" && (
              <span className="absolute bottom-0 inset-x-4 h-0.5 bg-foreground rounded-full" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("about")}
            className={cn(
              "flex-1 py-3 text-sm font-semibold transition-colors relative",
              activeTab === "about" ? "text-foreground" : "text-muted-foreground"
            )}
          >
            About
            {activeTab === "about" && (
              <span className="absolute bottom-0 inset-x-4 h-0.5 bg-foreground rounded-full" />
            )}
          </button>
        </div>

        {/* Tab content */}
        <div className="px-4 py-3">
          {activeTab === "specs" ? (
            <div className="space-y-2.5">
              {PRODUCT.specs.map((spec) => (
                <div
                  key={spec.key}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">{spec.key}</span>
                  <span className="font-medium text-foreground">{spec.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-foreground/80 whitespace-pre-line leading-relaxed">
              {PRODUCT.description}
            </p>
          )}
        </div>
      </div>

      {/* ================================================================= */}
      {/* SIMILAR LISTINGS                                                  */}
      {/* ================================================================= */}
      <div className="bg-background mt-1.5 py-3">
        <div className="flex items-center justify-between px-4 mb-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Similar listings
          </h3>
          <button
            type="button"
            className="text-xs font-semibold text-primary"
          >
            See all
          </button>
        </div>
        <div className="flex gap-3 px-4 overflow-x-auto scrollbar-none pb-1">
          {SIMILAR.map((item) => (
            <button
              key={item.id}
              type="button"
              className="flex-none w-32 text-left active:opacity-80 transition-opacity"
            >
              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
                <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-background/90 text-2xs font-medium">
                  {item.condition}
                </span>
              </div>
              <p className="text-sm font-medium mt-2 truncate text-foreground">
                {item.title}
              </p>
              <p className="text-base font-bold text-foreground">
                €{item.price}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* ================================================================= */}
      {/* SAFETY TIPS                                                       */}
      {/* ================================================================= */}
      <button
        type="button"
        className="w-full bg-background mt-1.5 px-4 py-3 flex items-start gap-3 text-left active:bg-muted/50 transition-colors"
      >
        <div className="size-9 rounded-full bg-warning/10 flex items-center justify-center shrink-0">
          <Info className="size-4 text-warning" strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">Safety tips</p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            Meet in public places. Inspect item before paying. Use secure payment methods.
          </p>
        </div>
        <ChevronRight className="size-5 text-muted-foreground shrink-0 mt-1" />
      </button>

      {/* ================================================================= */}
      {/* REPORT                                                            */}
      {/* ================================================================= */}
      <div className="mt-1.5 px-4 py-4 flex justify-center">
        <button
          type="button"
          className="flex items-center gap-1.5 text-xs text-muted-foreground active:text-foreground transition-colors"
        >
          <Flag className="size-3.5" strokeWidth={1.5} />
          Report this listing
        </button>
      </div>

      {/* Bottom spacer */}
      <div className="h-28" />

      {/* ================================================================= */}
      {/* BOTTOM ACTION BAR                                                 */}
      {/* ================================================================= */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-background/95 backdrop-blur-md">
        {/* Price summary */}
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">
              {PRODUCT.currency}{PRODUCT.price.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground line-through">
              {PRODUCT.currency}{PRODUCT.originalPrice.toLocaleString()}
            </span>
          </div>
          {PRODUCT.negotiable && (
            <span className="text-xs text-primary font-medium">Negotiable</span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))]">
          <button
            type="button"
            className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl bg-muted text-foreground font-semibold text-sm active:bg-muted/70 transition-colors"
          >
            <MessageCircle className="size-5" strokeWidth={1.5} />
            Chat
          </button>
          <button
            type="button"
            className="flex-[1.5] h-12 flex items-center justify-center gap-2 rounded-xl bg-foreground text-background font-semibold text-sm active:opacity-90 transition-opacity"
          >
            <ShoppingBag className="size-5" strokeWidth={1.5} />
            Buy now
          </button>
        </div>
      </div>

      {/* ================================================================= */}
      {/* FULLSCREEN GALLERY                                                */}
      {/* ================================================================= */}
      {fullscreenGallery && (
        <div className="fixed inset-0 z-[60] bg-background flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-3 relative z-10">
            <button
              type="button"
              onClick={() => setFullscreenGallery(false)}
              className="size-10 rounded-full bg-muted flex items-center justify-center active:bg-muted/70 transition-colors"
            >
              <ArrowLeft className="size-5 text-foreground" strokeWidth={1.5} />
            </button>
            <span className="absolute left-1/2 -translate-x-1/2 text-sm font-medium text-foreground">
              {currentImage + 1} / {PRODUCT.images.length}
            </span>
            <button
              type="button"
              onClick={() => setSaved(!saved)}
              className={cn(
                "size-10 rounded-full flex items-center justify-center transition-colors",
                saved ? "bg-wishlist text-white" : "bg-muted text-foreground"
              )}
            >
              <Heart className={cn("size-5", saved && "fill-current")} strokeWidth={1.5} />
            </button>
          </div>

          {/* Image */}
          <div className="flex-1 flex items-center justify-center relative bg-muted/20">
            {PRODUCT.images[currentImage] && (
              <Image
                src={PRODUCT.images[currentImage]}
                alt=""
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 p-4 justify-center bg-background">
            {PRODUCT.images.map((src, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentImage(idx)}
                className={cn(
                  "size-14 rounded-lg overflow-hidden transition-all",
                  idx === currentImage
                    ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                    : "opacity-40"
                )}
              >
                <Image
                  src={src}
                  alt=""
                  width={56}
                  height={56}
                  className="object-cover size-full"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
