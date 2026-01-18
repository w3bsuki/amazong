"use client";

// =============================================================================
// PRODUCT MOBILE V2 — Compact C2C Mobile Commerce
// =============================================================================
// Horizontal-first. Price in bottom bar. Meta on top.
// =============================================================================

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

// =============================================================================
// DATA
// =============================================================================

const PRODUCT = {
  id: "v2-001",
  title: "iPhone 15 Pro Max",
  specs: ["256GB", "Natural Titanium", "Unlocked", "98% Battery"],
  price: 1089,
  originalPrice: 1199,
  condition: "Like New",
  conditionNote: "9/10 condition",
  negotiable: true,
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
    name: "Alex",
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
    { k: "Battery", v: "98%" },
    { k: "Warranty", v: "AppleCare+ Dec '25" },
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
];

// =============================================================================
// COMPONENT
// =============================================================================

export function ProductMobile2() {
  const [img, setImg] = useState(0);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<"details" | "desc">("details");
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
    const obs = new IntersectionObserver(([e]) => setShowSticky(!e.isIntersecting), { threshold: 0, rootMargin: "-1px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const scrollToImg = (i: number) => {
    galleryRef.current?.scrollTo({ left: i * (galleryRef.current?.offsetWidth || 0), behavior: "smooth" });
  };

  return (
    <div className="min-h-dvh bg-[#f5f5f5] lg:hidden">
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* STICKY HEADER — Title on scroll */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-transform duration-200 ${showSticky ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="h-12 bg-white/95 backdrop-blur-lg border-b border-neutral-200/50 px-3 flex items-center gap-3">
          <button className="size-8 flex items-center justify-center -ml-1">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="flex-1 font-semibold text-sm truncate">{PRODUCT.title}</span>
          <button onClick={() => setSaved(!saved)} className={`size-8 flex items-center justify-center ${saved ? "text-red-500" : ""}`}>
            <svg className="size-5" fill={saved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button className="size-8 flex items-center justify-center -mr-1">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* GALLERY — Square aspect, horizontal thumbnail strip */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="relative bg-white">
        {/* Floating nav */}
        <div className="absolute top-3 left-3 right-3 z-20 flex justify-between">
          <button className="size-9 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center active:scale-95">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex gap-2">
            <button className="size-9 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center active:scale-95">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
            <button onClick={() => setSaved(!saved)} className={`size-9 rounded-full backdrop-blur-sm shadow-lg flex items-center justify-center active:scale-95 ${saved ? "bg-red-500 text-white" : "bg-white/90"}`}>
              <svg className="size-5" fill={saved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
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

        {/* Horizontal thumbnail strip — replaces dots */}
        <div className="flex gap-1.5 p-2 bg-white">
          {PRODUCT.images.map((src, i) => (
            <button 
              key={i} 
              onClick={(e) => { e.stopPropagation(); scrollToImg(i); }}
              className={`flex-1 aspect-square rounded-lg overflow-hidden transition-all ${i === img ? "ring-2 ring-black ring-offset-1" : "opacity-60"}`}
            >
              <Image src={src} alt="" width={80} height={80} className="object-cover size-full" />
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* META ROW — Location, time, stats (TOP) */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="bg-white px-4 py-2 flex items-center justify-between text-xs text-neutral-500 border-b border-neutral-100">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {PRODUCT.location}
          </span>
          <span>{PRODUCT.posted} ago</span>
        </div>
        <div className="flex items-center gap-3">
          <span>{PRODUCT.views} views</span>
          <span className="flex items-center gap-1">
            <svg className="size-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {PRODUCT.saves}
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TITLE + BADGES — Compact, horizontal */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div ref={titleRef} className="bg-white px-4 py-3">
        <h1 className="text-lg font-bold leading-tight">{PRODUCT.title}</h1>
        
        {/* Badge row — condition + negotiable */}
        <div className="flex items-center gap-2 mt-1.5">
          <span className="px-2 py-0.5 rounded-full bg-neutral-900 text-white text-xs font-semibold">
            {PRODUCT.condition}
          </span>
          {PRODUCT.negotiable && (
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
              Negotiable
            </span>
          )}
          <span className="text-xs text-neutral-400">{PRODUCT.conditionNote}</span>
        </div>

        {/* Specs chips — horizontal, using full width */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {PRODUCT.specs.map((spec) => (
            <span key={spec} className="px-2 py-1 rounded-md bg-neutral-100 text-xs font-medium text-neutral-700">
              {spec}
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SELLER — Compact row */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <button className="w-full bg-white mt-1 px-4 py-3 flex items-center gap-3 text-left active:bg-neutral-50">
        <div className="relative flex-shrink-0">
          <div className="size-11 rounded-full overflow-hidden">
            <Image src={PRODUCT.seller.avatar} alt="" width={44} height={44} className="object-cover" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 size-3 bg-emerald-500 rounded-full ring-2 ring-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm">{PRODUCT.seller.name}</span>
            {PRODUCT.seller.verified && (
              <svg className="size-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className="text-xs text-neutral-400">· {PRODUCT.seller.responseTime} reply</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-neutral-500">
            <svg className="size-3 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="font-medium text-neutral-700">{PRODUCT.seller.rating}</span>
            <span>({PRODUCT.seller.reviews})</span>
            <span className="mx-1">·</span>
            <span>{PRODUCT.seller.sold} sold</span>
          </div>
        </div>
        <svg className="size-5 text-neutral-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* DELIVERY — Inline chips */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="bg-white mt-1 px-4 py-3">
        <div className="flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          <span className="flex-shrink-0 text-xs font-medium text-neutral-500">Get it:</span>
          <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-neutral-100 text-xs">
            <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            Meetup
          </span>
          <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-neutral-100 text-xs">
            <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10" />
            </svg>
            Ship
          </span>
          <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
            <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
            COD
          </span>
          <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs">
            <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Protected
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TABS — Details / Description */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="bg-white mt-1">
        <div className="flex border-b border-neutral-100">
          <button 
            onClick={() => setTab("details")}
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors relative ${tab === "details" ? "text-black" : "text-neutral-400"}`}
          >
            Details
            {tab === "details" && <span className="absolute bottom-0 inset-x-4 h-0.5 bg-black rounded-full" />}
          </button>
          <button 
            onClick={() => setTab("desc")}
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors relative ${tab === "desc" ? "text-black" : "text-neutral-400"}`}
          >
            Description
            {tab === "desc" && <span className="absolute bottom-0 inset-x-4 h-0.5 bg-black rounded-full" />}
          </button>
        </div>

        <div className="px-4 py-3">
          {tab === "details" ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {PRODUCT.details.map((d) => (
                <div key={d.k} className="flex justify-between text-sm py-1">
                  <span className="text-neutral-500">{d.k}</span>
                  <span className="font-medium">{d.v}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-600 whitespace-pre-line leading-relaxed">
              {PRODUCT.description}
            </p>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SIMILAR — Compact horizontal scroll */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="bg-white mt-1 py-3">
        <div className="flex items-center justify-between px-4 mb-2">
          <span className="text-sm font-semibold">Similar</span>
          <button className="text-xs font-medium text-blue-600">See all</button>
        </div>
        <div className="flex gap-2 px-4 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {SIMILAR.map((item) => (
            <button key={item.id} className="flex-none w-28 text-left active:opacity-80">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100">
                <Image src={item.img} alt="" fill className="object-cover" sizes="112px" />
              </div>
              <p className="text-xs font-medium mt-1.5 truncate">{item.title}</p>
              <p className="text-sm font-bold">€{item.price}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Spacer */}
      <div className="h-20" />

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* BOTTOM BAR — Make offer + Buy (price) */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-neutral-200 z-40">
        <div className="px-4 py-2.5 pb-[max(10px,env(safe-area-inset-bottom))] flex gap-2">
          <button className="flex-1 h-11 rounded-xl border-2 border-neutral-900 text-neutral-900 font-bold text-sm flex items-center justify-center gap-1.5 active:bg-neutral-100">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Make offer
          </button>
          <button className="flex-[1.3] h-11 rounded-xl bg-neutral-900 text-white font-bold text-sm flex items-center justify-center gap-1 active:bg-neutral-800">
            Buy · €{PRODUCT.price}
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* IMAGE VIEWER */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {imgViewerOpen && (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col">
          <div className="flex items-center justify-between p-3">
            <button onClick={() => setImgViewerOpen(false)} className="size-10 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="size-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <span className="text-white text-sm font-medium">{img + 1} / {PRODUCT.images.length}</span>
            <div className="size-10" />
          </div>
          <div className="flex-1 flex items-center">
            <Image src={PRODUCT.images[img]} alt="" fill className="object-contain" sizes="100vw" priority />
          </div>
          {/* Horizontal thumbnails at bottom */}
          <div className="flex gap-2 p-3 justify-center">
            {PRODUCT.images.map((src, i) => (
              <button 
                key={i} 
                onClick={() => setImg(i)}
                className={`size-12 rounded-lg overflow-hidden transition-all ${i === img ? "ring-2 ring-white" : "opacity-50"}`}
              >
                <Image src={src} alt="" width={48} height={48} className="object-cover size-full" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
