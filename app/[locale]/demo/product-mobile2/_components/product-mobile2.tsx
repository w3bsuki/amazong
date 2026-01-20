"use client";

// =============================================================================
// PRODUCT MOBILE V2 — Compact C2C Mobile Commerce
// =============================================================================
// Horizontal-first. Price in bottom bar. Clean app-like UI.
// Inspired by Carousell/Vinted/Depop — minimal, content-focused.
// =============================================================================

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

// =============================================================================
// DATA
// =============================================================================

const PRODUCT = {
  id: "v2-001",
  title: "Apple iPhone 15 Pro Max 256GB Natural Titanium - Unlocked, Excellent Condition",
  shortTitle: "iPhone 15 Pro Max",
  category: { parent: "Phones & Tablets", child: "iPhones" },
  specs: ["256GB", "Natural Titanium", "Unlocked", "98% Battery"],
  price: 1089,
  originalPrice: 1199,
  condition: "Like New",
  negotiable: true,
  location: "Sofia, Bulgaria",
  posted: "2 hours ago",
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
    responseRate: 98,
    responseTime: "< 1hr",
    joined: "Mar 2021",
    listings: 47,
    lastActive: "2m",
    badges: ["Fast Shipper", "Trusted"],
  },
  details: [
    { k: "Brand", v: "Apple" },
    { k: "Model", v: "iPhone 15 Pro Max" },
    { k: "Storage", v: "256GB" },
    { k: "Color", v: "Natural Titanium" },
    { k: "Battery Health", v: "98%" },
    { k: "Warranty", v: "AppleCare+ until Dec '25" },
    { k: "Network", v: "Factory Unlocked" },
    { k: "Included", v: "Box, Cable, Case" },
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

export function ProductMobile2() {
  const [img, setImg] = useState(0);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<"specs" | "desc">("specs");
  const [showSticky, setShowSticky] = useState(false);
  const [imgViewerOpen, setImgViewerOpen] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  // Gallery scroll sync
  useEffect(() => {
    const el = galleryRef.current;
    if (!el) return;
    const fn = () => setImg(Math.round(el.scrollLeft / el.offsetWidth));
    el.addEventListener("scroll", fn, { passive: true });
    return () => el.removeEventListener("scroll", fn);
  }, []);

  // Sticky header observer
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => e && setShowSticky(!e.isIntersecting), { threshold: 0, rootMargin: "-1px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const scrollToImg = (i: number) => {
    galleryRef.current?.scrollTo({ left: i * (galleryRef.current?.offsetWidth || 0), behavior: "smooth" });
  };

  return (
    <div className="min-h-dvh bg-neutral-100 lg:hidden">
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* STICKY HEADER — Minimal, shows on scroll */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-transform duration-200 ${showSticky ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="h-12 bg-white border-b border-neutral-200 px-3 flex items-center gap-2">
          <button className="size-9 flex items-center justify-center -ml-1 active:bg-neutral-100 rounded-full">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="flex-1 font-semibold text-sm truncate">{PRODUCT.shortTitle}</span>
          <button onClick={() => setSaved(!saved)} className={`size-9 flex items-center justify-center active:scale-95 rounded-full ${saved ? "text-red-500" : ""}`}>
            <svg className="size-5" fill={saved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button className="size-9 flex items-center justify-center -mr-1 active:bg-neutral-100 rounded-full">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="1" fill="currentColor" />
              <circle cx="19" cy="12" r="1" fill="currentColor" />
              <circle cx="5" cy="12" r="1" fill="currentColor" />
            </svg>
          </button>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* GALLERY — Square aspect, horizontal thumbnail strip */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="relative bg-black">
        {/* Floating nav */}
        <div className="absolute top-3 left-3 right-3 z-20 flex justify-between">
          <button className="size-9 rounded-full bg-white/90 shadow-sm flex items-center justify-center active:scale-95">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex gap-2">
            <button className="size-9 rounded-full bg-white/90 shadow-sm flex items-center justify-center active:scale-95">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="1" fill="currentColor" />
                <circle cx="19" cy="12" r="1" fill="currentColor" />
                <circle cx="5" cy="12" r="1" fill="currentColor" />
              </svg>
            </button>
            <button onClick={() => setSaved(!saved)} className={`size-9 rounded-full shadow-sm flex items-center justify-center active:scale-95 ${saved ? "bg-red-500 text-white" : "bg-white/90"}`}>
              <svg className="size-5" fill={saved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Bottom left badges */}
        <div className="absolute bottom-3 left-3 z-20 flex flex-col gap-1.5 items-start">
          <span className="px-2 py-0.5 rounded bg-emerald-500 text-white text-xs font-bold">
            {PRODUCT.condition}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/90 text-xs font-medium text-neutral-700">
            <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            {PRODUCT.category.parent} · {PRODUCT.category.child}
          </span>
        </div>

        {/* Image counter */}
        <div className="absolute bottom-3 right-3 z-20 px-2 py-1 rounded bg-black/60 text-white text-xs font-medium">
          {img + 1}/{PRODUCT.images.length}
        </div>

        {/* Main image */}
        <div 
          ref={galleryRef}
          className="flex overflow-x-auto snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
          onClick={() => setImgViewerOpen(true)}
        >
          {PRODUCT.images.map((src, i) => (
            <div key={i} className="flex-none w-full snap-center">
              <div className="relative aspect-square">
                <Image src={src} alt="" fill className="object-cover" priority={i === 0} sizes="100vw" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Horizontal thumbnail strip */}
      <div className="flex gap-1.5 p-2 bg-white border-b border-neutral-100">
        {PRODUCT.images.map((src, i) => (
          <button 
            key={i} 
            onClick={(e) => { e.stopPropagation(); scrollToImg(i); }}
            className={`flex-1 aspect-square rounded-lg overflow-hidden transition-all ${i === img ? "ring-2 ring-neutral-900 ring-offset-1" : "opacity-50"}`}
          >
            <Image src={src} alt="" width={80} height={80} className="object-cover size-full" />
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* META ROW — Clean, under thumbnails */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="bg-white px-4 py-2.5 flex items-center gap-4 text-xs text-neutral-500">
        <span className="flex items-center gap-1.5">
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          <span className="text-neutral-700 font-medium">{PRODUCT.location}</span>
        </span>
        <span className="flex items-center gap-1">
          <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {PRODUCT.posted}
        </span>
        <div className="flex-1" />
        <span className="flex items-center gap-1">
          <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {PRODUCT.views.toLocaleString()}
        </span>
        <span className="flex items-center gap-1">
          <svg className="size-3.5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {PRODUCT.saves}
        </span>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TITLE + BADGES */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div ref={titleRef} className="bg-white mt-1.5 px-4 py-3">
        <h1 className="text-base font-semibold text-neutral-900 leading-snug">{PRODUCT.title}</h1>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {PRODUCT.negotiable && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">
              Negotiable
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
            <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Buyer Protection
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SELLER — Cleaner card with trust signals */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <button className="w-full bg-white mt-1.5 px-4 py-3 text-left active:bg-neutral-50">
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="size-12 rounded-full overflow-hidden ring-2 ring-neutral-100">
              <Image src={PRODUCT.seller.avatar} alt="" width={48} height={48} className="object-cover" />
            </div>
            {PRODUCT.seller.verified && (
              <span className="absolute -bottom-0.5 -right-0.5 size-5 bg-blue-500 rounded-full ring-2 ring-white flex items-center justify-center">
                <svg className="size-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold">{PRODUCT.seller.name}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="flex items-center gap-0.5">
                <svg className="size-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-semibold">{PRODUCT.seller.rating}</span>
              </div>
              <span className="text-xs text-neutral-400">·</span>
              <span className="text-xs text-neutral-500">{PRODUCT.seller.reviews} reviews</span>
            </div>
          </div>
          <svg className="size-5 text-neutral-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </button>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* DELIVERY — Clean pills */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="bg-white mt-1.5 px-4 py-3">
        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Delivery</span>
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-100 text-sm">
            <svg className="size-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            Meetup
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-100 text-sm">
            <svg className="size-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
            Shipping
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </svg>
            Cash on Delivery
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TABS — Specs / Description */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="bg-white mt-1.5">
        <div className="flex border-b border-neutral-100">
          <button 
            onClick={() => setTab("specs")}
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors relative ${tab === "specs" ? "text-neutral-900" : "text-neutral-400"}`}
          >
            Specifications
            {tab === "specs" && <span className="absolute bottom-0 inset-x-4 h-0.5 bg-neutral-900 rounded-full" />}
          </button>
          <button 
            onClick={() => setTab("desc")}
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors relative ${tab === "desc" ? "text-neutral-900" : "text-neutral-400"}`}
          >
            Description
            {tab === "desc" && <span className="absolute bottom-0 inset-x-4 h-0.5 bg-neutral-900 rounded-full" />}
          </button>
        </div>
        <div className="px-4 py-3">
          {tab === "specs" ? (
            <div className="space-y-2">
              {PRODUCT.details.map((d) => (
                <div key={d.k} className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">{d.k}</span>
                  <span className="font-medium text-neutral-900">{d.v}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-700 whitespace-pre-line leading-relaxed">
              {PRODUCT.description}
            </p>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SIMILAR — Horizontal scroll with better cards */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="bg-white mt-1.5 py-3">
        <div className="flex items-center justify-between px-4 mb-3">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Similar listings</span>
          <button className="text-xs font-semibold text-blue-600">See all</button>
        </div>
        <div className="flex gap-3 px-4 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {SIMILAR.map((item) => (
            <button key={item.id} className="flex-none w-32 text-left active:opacity-80">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100">
                <Image src={item.img} alt="" fill className="object-cover" sizes="128px" />
                <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-white/90 text-xs font-medium">
                  {item.condition}
                </span>
              </div>
              <p className="text-sm font-medium mt-2 truncate">{item.title}</p>
              <p className="text-base font-bold">€{item.price}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SAFETY TIPS */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="bg-white mt-1.5 px-4 py-3">
        <div className="flex items-start gap-3">
          <div className="size-8 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
            <svg className="size-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-neutral-900">Safety tips</p>
            <p className="text-xs text-neutral-500 mt-0.5">Meet in public places. Inspect item before paying. Use COD for secure transactions.</p>
          </div>
          <svg className="size-5 text-neutral-300 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* REPORT */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="mt-1.5 px-4 py-3 flex justify-center">
        <button className="flex items-center gap-1.5 text-xs text-neutral-400 active:text-neutral-600">
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
          </svg>
          Report this listing
        </button>
      </div>

      {/* Spacer */}
      <div className="h-24" />

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* BOTTOM BAR — Chat + Buy with price */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-neutral-200 z-40">
        <div className="px-4 py-2 pb-[max(8px,env(safe-area-inset-bottom))]">
          {/* Price recap row */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold">€{PRODUCT.price.toLocaleString()}</span>
              <span className="text-sm text-neutral-400 line-through">€{PRODUCT.originalPrice.toLocaleString()}</span>
            </div>
            {PRODUCT.negotiable && (
              <span className="text-xs text-blue-600 font-medium">Negotiable</span>
            )}
          </div>
          {/* Action buttons */}
          <div className="flex gap-2">
            <button className="flex-1 h-12 rounded-xl border-2 border-neutral-200 text-neutral-700 font-semibold text-sm flex items-center justify-center gap-2 active:bg-neutral-50">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
              Chat
            </button>
            <button className="flex-[1.5] h-12 rounded-xl bg-neutral-900 text-white font-bold text-sm flex items-center justify-center gap-2 active:bg-neutral-800">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              Buy now
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* IMAGE VIEWER — Fullscreen with gestures */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {imgViewerOpen && (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-3 relative z-10">
            <button onClick={() => setImgViewerOpen(false)} className="size-10 rounded-full bg-white/10 flex items-center justify-center active:bg-white/20">
              <svg className="size-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <span className="absolute left-1/2 -translate-x-1/2 text-white text-sm font-medium">{img + 1} / {PRODUCT.images.length}</span>
            <button className="size-10 rounded-full bg-white/10 flex items-center justify-center active:bg-white/20">
              <svg className="size-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="1" fill="currentColor" />
                <circle cx="19" cy="12" r="1" fill="currentColor" />
                <circle cx="5" cy="12" r="1" fill="currentColor" />
              </svg>
            </button>
          </div>
          {/* Image */}
          <div className="flex-1 flex items-center justify-center relative">
            {PRODUCT.images[img] && (
              <Image src={PRODUCT.images[img]} alt="" fill className="object-contain" sizes="100vw" priority />
            )}
          </div>
          {/* Thumbnails */}
          <div className="flex gap-2 p-4 justify-center">
            {PRODUCT.images.map((src, i) => (
              <button 
                key={i} 
                onClick={() => setImg(i)}
                className={`size-14 rounded-lg overflow-hidden transition-all ${i === img ? "ring-2 ring-white ring-offset-2 ring-offset-black" : "opacity-40"}`}
              >
                <Image src={src} alt="" width={56} height={56} className="object-cover size-full" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
