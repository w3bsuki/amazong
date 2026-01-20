"use client"

// =============================================================================
// PRODUCT PAGE - MOBILE (Category-Adaptive)
// =============================================================================
// Based on V2 Mobile - the winner from our audit.
// Adapts hero specs and CTAs based on product category.
// =============================================================================

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import type { DemoProduct } from "../_data/demo-products"

// =============================================================================
// ICONS (inline SVG for clean mobile bundle)
// =============================================================================

const Icons = {
  back: (
    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  ),
  heart: (filled: boolean) => (
    <svg className="size-5" fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  more: (
    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="19" cy="12" r="1" fill="currentColor" />
      <circle cx="5" cy="12" r="1" fill="currentColor" />
    </svg>
  ),
  location: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  ),
  clock: (
    <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  eye: (
    <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  heartFilled: (
    <svg className="size-3.5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  star: (
    <svg className="size-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ),
  chevronRight: (
    <svg className="size-5 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  ),
  verified: (
    <span className="size-5 bg-blue-500 rounded-full ring-2 ring-white flex items-center justify-center">
      <svg className="size-3 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    </span>
  ),
  shield: (
    <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  chat: (
    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  ),
  cart: (
    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
  ),
  truck: (
    <svg className="size-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  ),
  calendar: (
    <svg className="size-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  ),
  close: (
    <svg className="size-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ProductPageMobile({ product }: { product: DemoProduct }) {
  const [img, setImg] = useState(0)
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState<"specs" | "desc">("specs")
  const [showSticky, setShowSticky] = useState(false)
  const [imgViewerOpen, setImgViewerOpen] = useState(false)
  const galleryRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const isRealEstate = product.category === "real-estate"
  const isAutomotive = product.category === "automotive"

  // Gallery scroll sync
  useEffect(() => {
    const el = galleryRef.current
    if (!el) return
    const fn = () => setImg(Math.round(el.scrollLeft / el.offsetWidth))
    el.addEventListener("scroll", fn, { passive: true })
    return () => el.removeEventListener("scroll", fn)
  }, [])

  // Sticky header observer
  useEffect(() => {
    const el = titleRef.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => e && setShowSticky(!e.isIntersecting), {
      threshold: 0,
      rootMargin: "-1px",
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const scrollToImg = (i: number) => {
    galleryRef.current?.scrollTo({ left: i * (galleryRef.current?.offsetWidth || 0), behavior: "smooth" })
  }

  // Get category-specific labels
  const getCategoryLabel = () => {
    const lastCat = product.categoryPath[product.categoryPath.length - 1]
    const parentCat = product.categoryPath[product.categoryPath.length - 2]
    return parentCat ? `${parentCat} · ${lastCat}` : lastCat
  }

  const getConditionLabel = () => {
    const labels: Record<string, string> = {
      new: "New",
      "like-new": "Like New",
      excellent: "Excellent",
      good: "Good",
      fair: "Fair",
    }
    return labels[product.condition] || product.condition
  }

  // Category-adaptive CTA labels
  const getPrimaryCTA = () => {
    if (isRealEstate) return { label: "Contact Agent", icon: Icons.chat }
    if (isAutomotive) return { label: "Contact Seller", icon: Icons.chat }
    return { label: "Buy now", icon: Icons.cart }
  }

  const getSecondaryCTA = () => {
    if (isRealEstate) return "Schedule Visit"
    if (isAutomotive) return "Test Drive"
    return "Chat"
  }

  const primaryCTA = getPrimaryCTA()

  return (
    <div className="min-h-dvh bg-neutral-100">
      {/* STICKY HEADER */}
      <header
        className={cn(
          "fixed top-12 inset-x-0 z-50 transition-transform duration-200",
          showSticky ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="h-12 bg-white border-b border-neutral-200 px-3 flex items-center gap-2">
          <button className="size-9 flex items-center justify-center -ml-1 active:bg-neutral-100 rounded-full">
            {Icons.back}
          </button>
          <span className="flex-1 font-semibold text-sm truncate">{product.title.split(" ").slice(0, 4).join(" ")}</span>
          <button
            onClick={() => setSaved(!saved)}
            className={cn("size-9 flex items-center justify-center rounded-full", saved && "text-red-500")}
          >
            {Icons.heart(saved)}
          </button>
          <button className="size-9 flex items-center justify-center -mr-1 rounded-full">{Icons.more}</button>
        </div>
      </header>

      {/* GALLERY */}
      <div className="relative bg-black">
        {/* Floating nav */}
        <div className="absolute top-3 left-3 right-3 z-20 flex justify-between">
          <button className="size-9 rounded-full bg-white/90 shadow-sm flex items-center justify-center">
            {Icons.back}
          </button>
          <div className="flex gap-2">
            <button className="size-9 rounded-full bg-white/90 shadow-sm flex items-center justify-center">
              {Icons.more}
            </button>
            <button
              onClick={() => setSaved(!saved)}
              className={cn(
                "size-9 rounded-full shadow-sm flex items-center justify-center",
                saved ? "bg-red-500 text-white" : "bg-white/90"
              )}
            >
              {Icons.heart(saved)}
            </button>
          </div>
        </div>

        {/* Bottom badges */}
        <div className="absolute bottom-3 left-3 z-20 flex flex-col gap-1.5 items-start">
          <span className="px-2 py-0.5 rounded bg-emerald-500 text-white text-xs font-bold">
            {getConditionLabel()}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/90 text-xs font-medium text-neutral-700">
            {getCategoryLabel()}
          </span>
        </div>

        {/* Image counter */}
        <div className="absolute bottom-3 right-3 z-20 px-2 py-1 rounded bg-black/60 text-white text-xs font-medium">
          {img + 1}/{product.images.length}
        </div>

        {/* Main image */}
        <div
          ref={galleryRef}
          className="flex overflow-x-auto snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
          onClick={() => setImgViewerOpen(true)}
        >
          {product.images.map((src, i) => (
            <div key={i} className="flex-none w-full snap-center">
              <div className="relative aspect-square">
                <Image src={src} alt="" fill className="object-cover" priority={i === 0} sizes="100vw" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-1.5 p-2 bg-white border-b border-neutral-100">
        {product.images.map((src, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation()
              scrollToImg(i)
            }}
            className={cn(
              "flex-1 aspect-square rounded-lg overflow-hidden transition-all",
              i === img ? "ring-2 ring-neutral-900 ring-offset-1" : "opacity-50"
            )}
          >
            <Image src={src} alt="" width={80} height={80} className="object-cover size-full" />
          </button>
        ))}
      </div>

      {/* META ROW */}
      <div className="bg-white px-4 py-2.5 flex items-center gap-4 text-xs text-neutral-500">
        <span className="flex items-center gap-1.5">
          {Icons.location}
          <span className="text-neutral-700 font-medium">{product.location}</span>
        </span>
        <span className="flex items-center gap-1">
          {Icons.clock}
          {product.postedAt}
        </span>
        <div className="flex-1" />
        <span className="flex items-center gap-1">
          {Icons.eye}
          {product.stats.views.toLocaleString()}
        </span>
        <span className="flex items-center gap-1">
          {Icons.heartFilled}
          {product.stats.saves}
        </span>
      </div>

      {/* TITLE + PRICE */}
      <div ref={titleRef} className="bg-white mt-1.5 px-4 py-3">
        <h1 className="text-base font-semibold text-neutral-900 leading-snug">{product.title}</h1>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {product.tags?.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium"
            >
              {Icons.shield}
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* HERO SPECS - Category Adaptive */}
      <div className="bg-white mt-1.5 px-4 py-3">
        <div className="grid grid-cols-2 gap-2">
          {product.heroSpecs.map((spec) => (
            <div key={spec.label} className="flex items-center justify-between py-2 px-3 rounded-lg bg-neutral-50">
              <span className="text-xs text-neutral-500">{spec.label}</span>
              <span className="text-sm font-semibold text-neutral-900">{spec.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SELLER */}
      <button className="w-full bg-white mt-1.5 px-4 py-3 text-left active:bg-neutral-50">
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="size-12 rounded-full overflow-hidden ring-2 ring-neutral-100">
              <Image src={product.seller.avatar} alt="" width={48} height={48} className="object-cover" />
            </div>
            {product.seller.verified && <span className="absolute -bottom-0.5 -right-0.5">{Icons.verified}</span>}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold">{product.seller.name}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="flex items-center gap-0.5">
                {Icons.star}
                <span className="text-sm font-semibold">{product.seller.rating}</span>
              </div>
              <span className="text-xs text-neutral-400">·</span>
              <span className="text-xs text-neutral-500">{product.seller.reviews} reviews</span>
            </div>
          </div>
          {Icons.chevronRight}
        </div>
      </button>

      {/* DELIVERY / LOCATION */}
      <div className="bg-white mt-1.5 px-4 py-3">
        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
          {isRealEstate ? "Location" : "Delivery"}
        </span>
        <div className="flex flex-wrap gap-2 mt-2">
          {isRealEstate ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-100 text-sm">
              {Icons.location}
              {product.location}
            </span>
          ) : isAutomotive ? (
            <>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-100 text-sm">
                {Icons.location}
                Pickup Only
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium">
                {Icons.calendar}
                Test Drive Available
              </span>
            </>
          ) : (
            <>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-100 text-sm">
                {Icons.location}
                Meetup
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-100 text-sm">
                {Icons.truck}
                Shipping
              </span>
              {product.shipping.free && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium">
                  Free Shipping
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* TABS */}
      <div className="bg-white mt-1.5">
        <div className="flex border-b border-neutral-100">
          <button
            onClick={() => setTab("specs")}
            className={cn(
              "flex-1 py-2.5 text-sm font-semibold transition-colors relative",
              tab === "specs" ? "text-neutral-900" : "text-neutral-400"
            )}
          >
            Specifications
            {tab === "specs" && <span className="absolute bottom-0 inset-x-4 h-0.5 bg-neutral-900 rounded-full" />}
          </button>
          <button
            onClick={() => setTab("desc")}
            className={cn(
              "flex-1 py-2.5 text-sm font-semibold transition-colors relative",
              tab === "desc" ? "text-neutral-900" : "text-neutral-400"
            )}
          >
            Description
            {tab === "desc" && <span className="absolute bottom-0 inset-x-4 h-0.5 bg-neutral-900 rounded-full" />}
          </button>
        </div>
        <div className="px-4 py-3">
          {tab === "specs" ? (
            <div className="space-y-2">
              {product.specifications.map((spec) => (
                <div key={spec.label} className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">{spec.label}</span>
                  <span className="font-medium text-neutral-900">{spec.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-700 whitespace-pre-line leading-relaxed">{product.description}</p>
          )}
        </div>
      </div>

      {/* Spacer */}
      <div className="h-28" />

      {/* BOTTOM BAR */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-neutral-200 z-40">
        <div className="px-4 py-2 pb-[max(8px,env(safe-area-inset-bottom))]">
          {/* Price row */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold">
                {product.currency === "EUR" ? "€" : ""}
                {product.price.toLocaleString()}
                {product.currency !== "EUR" ? ` ${product.currency}` : ""}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-neutral-400 line-through">
                  {product.currency === "EUR" ? "€" : ""}
                  {product.originalPrice.toLocaleString()}
                </span>
              )}
              {discount > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-600 text-xs font-semibold">-{discount}%</span>
              )}
            </div>
          </div>
          {/* Action buttons */}
          <div className="flex gap-2">
            <button className="flex-1 h-12 rounded-xl border-2 border-neutral-200 text-neutral-700 font-semibold text-sm flex items-center justify-center gap-2 active:bg-neutral-50">
              {Icons.chat}
              {getSecondaryCTA()}
            </button>
            <button className="flex-[1.5] h-12 rounded-xl bg-neutral-900 text-white font-bold text-sm flex items-center justify-center gap-2 active:bg-neutral-800">
              {primaryCTA.icon}
              {primaryCTA.label}
            </button>
          </div>
        </div>
      </div>

      {/* IMAGE VIEWER */}
      {imgViewerOpen && (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col">
          <div className="flex items-center justify-between p-3 relative z-10">
            <button
              onClick={() => setImgViewerOpen(false)}
              className="size-10 rounded-full bg-white/10 flex items-center justify-center"
            >
              {Icons.close}
            </button>
            <span className="absolute left-1/2 -translate-x-1/2 text-white text-sm font-medium">
              {img + 1} / {product.images.length}
            </span>
            <button className="size-10 rounded-full bg-white/10 flex items-center justify-center">{Icons.more}</button>
          </div>
          <div className="flex-1 flex items-center justify-center relative">
            {product.images[img] && (
              <Image src={product.images[img]} alt="" fill className="object-contain" sizes="100vw" priority />
            )}
          </div>
          <div className="flex gap-2 p-4 justify-center">
            {product.images.map((src, i) => (
              <button
                key={i}
                onClick={() => setImg(i)}
                className={cn(
                  "size-14 rounded-lg overflow-hidden transition-all",
                  i === img ? "ring-2 ring-white ring-offset-2 ring-offset-black" : "opacity-40"
                )}
              >
                <Image src={src} alt="" width={56} height={56} className="object-cover size-full" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
