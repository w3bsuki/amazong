"use client";

// =============================================================================
// PRODUCT MOBILE V2 — Premium C2C Mobile Commerce
// =============================================================================
//
// Inspiration: Vinted, Depop, OfferUp, Instagram Shopping
// Philosophy: Immersive, content-first, native app feel
//
// Key patterns:
// - Hero gallery with floating overlays (no chrome stealing focus)
// - Sticky price bar that appears on scroll
// - Bottom sheet CTA always in thumb zone
// - Card-based sections with generous whitespace
// - Subtle depth with shadows, not borders
// =============================================================================

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Heart,
  Share2,
  MoreHorizontal,
  MapPin,
  Star,
  BadgeCheck,
  ChevronRight,
  MessageCircle,
  Phone,
  Truck,
  Banknote,
  Clock,
  Eye,
  Sparkles,
} from "lucide-react";

// =============================================================================
// DATA
// =============================================================================

const PRODUCT = {
  id: "v2-001",
  title: "iPhone 15 Pro Max 256GB",
  subtitle: "Natural Titanium · Unlocked",
  price: 1089,
  originalPrice: 1199,
  condition: "Like New",
  location: "Sofia",
  posted: "2h",
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
    verified: true,
    responseTime: "Usually replies within 1 hour",
    active: true,
  },
  specs: [
    ["Brand", "Apple"],
    ["Model", "iPhone 15 Pro Max"],
    ["Storage", "256GB"],
    ["Color", "Natural Titanium"],
    ["Network", "Unlocked"],
    ["Battery", "98%"],
  ],
  description: `Selling my iPhone 15 Pro Max in excellent condition. Used for only 3 months, always with case and screen protector.

What's included:
• Original box and accessories
• 20W fast charger
• Premium leather case
• Screen protector installed

Phone is factory unlocked — works with any carrier worldwide. No scratches, dents, or any cosmetic damage.

AppleCare+ is active and transferable until December 2025.

Selling because I'm upgrading to the 16 Pro Max. Happy to answer any questions!`,
};

// =============================================================================
// COMPONENT
// =============================================================================

export function ProductMobile2() {
  const [imgIndex, setImgIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const [showStickyPrice, setShowStickyPrice] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const priceRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const discount = Math.round(((PRODUCT.originalPrice - PRODUCT.price) / PRODUCT.originalPrice) * 100);

  // Observe price section for sticky header
  useEffect(() => {
    const el = priceRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => e && setShowStickyPrice(!e.isIntersecting),
      { threshold: 0, rootMargin: "-56px 0px 0px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Gallery scroll handler
  useEffect(() => {
    const el = galleryRef.current;
    if (!el) return;
    const handler = () => {
      const idx = Math.round(el.scrollLeft / el.offsetWidth);
      setImgIndex(idx);
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, []);

  const scrollToImg = (i: number) => {
    galleryRef.current?.scrollTo({ left: i * (galleryRef.current?.offsetWidth || 0), behavior: "smooth" });
  };

  return (
    <div className="min-h-dvh bg-white pb-24 lg:hidden">
      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* FLOATING HEADER — Glass overlay on gallery */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <header className="fixed top-0 inset-x-0 z-50">
        <div className={`
          flex items-center justify-between h-14 px-2
          transition-all duration-200
          ${showStickyPrice 
            ? "bg-white/95 backdrop-blur-xl border-b border-neutral-100 shadow-sm" 
            : "bg-gradient-to-b from-black/40 to-transparent"
          }
        `}>
          {/* Left: Back */}
          <button className={`
            size-10 flex items-center justify-center rounded-full
            ${showStickyPrice 
              ? "text-neutral-900 active:bg-neutral-100" 
              : "text-white bg-black/20 backdrop-blur-sm active:bg-black/30"
            }
          `}>
            <ArrowLeft className="size-5" strokeWidth={2} />
          </button>

          {/* Center: Price (appears on scroll) */}
          <div className={`
            flex items-center gap-2 transition-opacity duration-200
            ${showStickyPrice ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}>
            <span className="text-lg font-bold text-neutral-900">€{PRODUCT.price}</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              -{discount}%
            </span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setSaved(!saved)}
              className={`
                size-10 flex items-center justify-center rounded-full
                ${showStickyPrice 
                  ? `${saved ? "text-rose-500" : "text-neutral-900"} active:bg-neutral-100` 
                  : `${saved ? "text-rose-500 bg-rose-500/20" : "text-white bg-black/20"} backdrop-blur-sm active:bg-black/30`
                }
              `}
            >
              <Heart className={`size-5 ${saved ? "fill-current" : ""}`} strokeWidth={2} />
            </button>
            <button className={`
              size-10 flex items-center justify-center rounded-full
              ${showStickyPrice 
                ? "text-neutral-900 active:bg-neutral-100" 
                : "text-white bg-black/20 backdrop-blur-sm active:bg-black/30"
              }
            `}>
              <Share2 className="size-5" strokeWidth={2} />
            </button>
            <button className={`
              size-10 flex items-center justify-center rounded-full
              ${showStickyPrice 
                ? "text-neutral-900 active:bg-neutral-100" 
                : "text-white bg-black/20 backdrop-blur-sm active:bg-black/30"
              }
            `}>
              <MoreHorizontal className="size-5" strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* HERO GALLERY — Full bleed, immersive */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section className="relative bg-neutral-100">
        <div 
          ref={galleryRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {PRODUCT.images.map((src, i) => (
            <div key={i} className="flex-none w-full snap-center">
              <div className="relative aspect-square">
                <Image
                  src={src}
                  alt={`${PRODUCT.title} photo ${i + 1}`}
                  fill
                  className="object-cover"
                  priority={i === 0}
                  sizes="100vw"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Condition badge — top left */}
        <div className="absolute top-16 left-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-xs font-semibold text-neutral-900 shadow-sm">
            <Sparkles className="size-3" />
            {PRODUCT.condition}
          </span>
        </div>

        {/* Image indicators — bottom */}
        <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1.5">
          {PRODUCT.images.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToImg(i)}
              className={`
                h-1 rounded-full transition-all duration-200
                ${i === imgIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"}
              `}
            />
          ))}
        </div>

        {/* Image counter — bottom right */}
        <div className="absolute bottom-4 right-3">
          <span className="px-2 py-1 rounded-md bg-black/60 text-white text-xs font-medium tabular-nums">
            {imgIndex + 1}/{PRODUCT.images.length}
          </span>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* CONTENT */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <main className="px-4">
        {/* Quick stats */}
        <div className="flex items-center gap-4 py-3 text-xs text-neutral-500">
          <span className="flex items-center gap-1">
            <MapPin className="size-3.5" />
            {PRODUCT.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {PRODUCT.posted} ago
          </span>
          <span className="flex items-center gap-1">
            <Eye className="size-3.5" />
            {PRODUCT.views}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="size-3.5" />
            {PRODUCT.saves}
          </span>
        </div>

        {/* Title + Price */}
        <div ref={priceRef} className="pb-4 border-b border-neutral-100">
          <h1 className="text-xl font-bold text-neutral-900 leading-tight">
            {PRODUCT.title}
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">{PRODUCT.subtitle}</p>
          
          <div className="flex items-baseline gap-3 mt-3">
            <span className="text-3xl font-extrabold text-neutral-900 tracking-tight">
              €{PRODUCT.price}
            </span>
            <span className="text-base text-neutral-400 line-through">
              €{PRODUCT.originalPrice}
            </span>
            <span className="text-sm font-bold text-emerald-600">
              Save €{PRODUCT.originalPrice - PRODUCT.price}
            </span>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* SELLER CARD */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <button className="w-full flex items-center gap-3 py-4 border-b border-neutral-100 text-left active:bg-neutral-50 -mx-4 px-4">
          {/* Avatar */}
          <div className="relative">
            <div className="size-12 rounded-full overflow-hidden ring-2 ring-white">
              <Image
                src={PRODUCT.seller.avatar}
                alt={PRODUCT.seller.name}
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
            {PRODUCT.seller.active && (
              <span className="absolute bottom-0 right-0 size-3 bg-emerald-500 rounded-full ring-2 ring-white" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-neutral-900 truncate">
                {PRODUCT.seller.name}
              </span>
              {PRODUCT.seller.verified && (
                <BadgeCheck className="size-4 text-sky-500 flex-shrink-0" fill="currentColor" stroke="white" strokeWidth={2} />
              )}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-neutral-500 mt-0.5">
              <Star className="size-3.5 text-amber-400 fill-current" />
              <span className="font-medium text-neutral-900">{PRODUCT.seller.rating}</span>
              <span>·</span>
              <span>{PRODUCT.seller.reviews} reviews</span>
            </div>
          </div>

          <ChevronRight className="size-5 text-neutral-400 flex-shrink-0" />
        </button>

        {/* Response time */}
        <div className="py-3 border-b border-neutral-100">
          <p className="text-sm text-neutral-500">{PRODUCT.seller.responseTime}</p>
        </div>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* DETAILS */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <div className="py-4 border-b border-neutral-100">
          <h2 className="text-sm font-semibold text-neutral-900 mb-3">Details</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {PRODUCT.specs.map(([label, value]) => (
              <div key={label} className="flex justify-between py-1.5">
                <span className="text-sm text-neutral-500">{label}</span>
                <span className="text-sm font-medium text-neutral-900">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* DESCRIPTION */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <div className="py-4 border-b border-neutral-100">
          <h2 className="text-sm font-semibold text-neutral-900 mb-3">Description</h2>
          <p className={`text-sm text-neutral-600 whitespace-pre-line leading-relaxed ${!descExpanded ? "line-clamp-4" : ""}`}>
            {PRODUCT.description}
          </p>
          {!descExpanded && (
            <button 
              onClick={() => setDescExpanded(true)}
              className="text-sm font-semibold text-sky-600 mt-2 active:text-sky-700"
            >
              Read more
            </button>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* DELIVERY */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <div className="py-4">
          <h2 className="text-sm font-semibold text-neutral-900 mb-3">How to get it</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50">
              <div className="size-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                <MapPin className="size-5 text-neutral-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Meet up</p>
                <p className="text-xs text-neutral-500">Arrange a safe location in {PRODUCT.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50">
              <div className="size-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                <Truck className="size-5 text-neutral-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Shipping</p>
                <p className="text-xs text-neutral-500">Nationwide · Buyer pays shipping</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50">
              <div className="size-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                <Banknote className="size-5 text-neutral-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Cash on delivery</p>
                <p className="text-xs text-neutral-500">Pay when you receive the item</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* BOTTOM CTA */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-neutral-100">
        <div className="flex items-center gap-3 px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))]">
          <button className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white text-neutral-900 font-semibold text-sm active:bg-neutral-50">
            <MessageCircle className="size-5" strokeWidth={2} />
            Message
          </button>
          <button className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl bg-neutral-900 text-white font-semibold text-sm active:bg-neutral-800">
            <Phone className="size-5" strokeWidth={2} />
            Call
          </button>
        </div>
      </div>

      {/* Hide scrollbar */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
