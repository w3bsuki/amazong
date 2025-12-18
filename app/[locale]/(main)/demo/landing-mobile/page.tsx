"use client"

import { Link } from "@/i18n/routing"
import Image from "next/image"
import { cn } from "@/lib/utils"
import {
  Laptop,
  Dress,
  Armchair,
  Sparkle,
  GameController,
  Barbell,
  Baby,
  Car,
  BookOpen,
  ShoppingBag,
  MagnifyingGlass,
  Heart,
  ShoppingCart,
  Star,
  ShieldCheck,
  ArrowRight,
  Tag,
  Storefront,
  Truck,
  CaretRight,
  Fire,
  Lightning,
  Clock,
  Check,
} from "@phosphor-icons/react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AspectRatio } from "@/components/ui/aspect-ratio"

// =============================================================================
// DATA - Realistic marketplace data
// =============================================================================

const categories = [
  { id: "1", name: "Electronics", slug: "electronics", icon: Laptop },
  { id: "2", name: "Fashion", slug: "fashion", icon: Dress },
  { id: "3", name: "Home", slug: "home", icon: Armchair },
  { id: "4", name: "Beauty", slug: "beauty", icon: Sparkle },
  { id: "5", name: "Gaming", slug: "gaming", icon: GameController },
  { id: "6", name: "Sports", slug: "sports", icon: Barbell },
  { id: "7", name: "Kids", slug: "baby", icon: Baby },
  { id: "8", name: "Auto", slug: "automotive", icon: Car },
  { id: "9", name: "Books", slug: "books", icon: BookOpen },
  { id: "10", name: "All", slug: "all", icon: ShoppingBag },
]

// Clean semantic color tones using Tailwind v4 best practices
const tones = [
  { bg: "bg-blue-50 dark:bg-blue-950/30", icon: "text-blue-600 dark:text-blue-400" },
  { bg: "bg-pink-50 dark:bg-pink-950/30", icon: "text-pink-600 dark:text-pink-400" },
  { bg: "bg-amber-50 dark:bg-amber-950/30", icon: "text-amber-600 dark:text-amber-400" },
  { bg: "bg-violet-50 dark:bg-violet-950/30", icon: "text-violet-600 dark:text-violet-400" },
  { bg: "bg-emerald-50 dark:bg-emerald-950/30", icon: "text-emerald-600 dark:text-emerald-400" },
  { bg: "bg-red-50 dark:bg-red-950/30", icon: "text-red-600 dark:text-red-400" },
  { bg: "bg-cyan-50 dark:bg-cyan-950/30", icon: "text-cyan-600 dark:text-cyan-400" },
  { bg: "bg-slate-100 dark:bg-slate-900/30", icon: "text-slate-600 dark:text-slate-400" },
  { bg: "bg-orange-50 dark:bg-orange-950/30", icon: "text-orange-600 dark:text-orange-400" },
  { bg: "bg-indigo-50 dark:bg-indigo-950/30", icon: "text-indigo-600 dark:text-indigo-400" },
]

const products = [
  {
    id: "1",
    title: "iPhone 15 Pro Max · 256GB · Natural Titanium",
    price: 2199,
    originalPrice: 2499,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",
    seller: { name: "TechStore", verified: true, rating: 4.9, location: "Sofia" },
    condition: "New",
    brand: "Apple",
    shipping: "Free",
    tags: ["256GB", "Unlocked"],
  },
  {
    id: "2",
    title: "Vintage Leather Jacket · Size M · Excellent",
    price: 189,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
    seller: { name: "VintageFinds", verified: false, rating: 4.7, location: "Plovdiv" },
    condition: "Used",
    brand: null,
    shipping: "+$4.99",
    tags: ["Size M", "Leather"],
  },
  {
    id: "3",
    title: "Sony WH-1000XM5 · Noise Cancelling",
    price: 299,
    originalPrice: 399,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80",
    seller: { name: "AudioWorld", verified: true, rating: 4.8, location: "Sofia" },
    condition: "New",
    brand: "Sony",
    shipping: "Free",
    tags: ["ANC", "Wireless"],
  },
  {
    id: "4",
    title: "Herman Miller Aeron · Size B · Fully Loaded",
    price: 899,
    originalPrice: 1599,
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&q=80",
    seller: { name: "OfficeComfort", verified: true, rating: 5.0, location: "Varna" },
    condition: "Refurbished",
    brand: "Herman Miller",
    shipping: "Free",
    tags: ["Ergonomic", "Size B"],
  },
  {
    id: "5",
    title: "MacBook Pro 14 M3 · 18GB · 512GB",
    price: 2899,
    originalPrice: 3199,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=800&q=80",
    seller: { name: "iStore BG", verified: true, rating: 4.9, location: "Sofia" },
    condition: "New",
    brand: "Apple",
    shipping: "Free",
    tags: ["M3 Pro", "512GB"],
  },
  {
    id: "6",
    title: "Nike Air Max 97 · Size 42 · Classic",
    price: 129,
    originalPrice: 179,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    seller: { name: "StreetCloset", verified: false, rating: 4.6, location: "Burgas" },
    condition: "Used",
    brand: "Nike",
    shipping: "+$3.99",
    tags: ["Size 42", "Authentic"],
  },
]

const featuredDeals = [
  {
    id: "deal-1",
    title: "Flash Sale: Electronics",
    subtitle: "Up to 40% off",
    image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&q=80",
    href: "/search?category=electronics&sale=true",
  },
  {
    id: "deal-2",
    title: "Fashion Week",
    subtitle: "New arrivals",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
    href: "/search?category=fashion",
  },
  {
    id: "deal-3",
    title: "Home & Garden",
    subtitle: "Spring collection",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    href: "/search?category=home",
  },
]

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const formatPrice = (p: number) => `$${p.toLocaleString("en-US")}`

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

// =============================================================================
// COMPONENTS
// =============================================================================

/**
 * SEARCH BAR
 * Clean, prominent search - the gateway to discovery
 * 48px height for perfect touch target (Apple HIG)
 */
function SearchBar() {
  return (
    <div className="px-4 py-2">
      <Link
        href="/search"
        className={cn(
          "flex items-center gap-3 w-full",
          "h-12 px-4 rounded-full",
          "bg-muted border border-border",
          "text-muted-foreground"
        )}
      >
        <MagnifyingGlass size={20} weight="bold" className="text-muted-foreground shrink-0" />
        <span className="text-sm font-medium">Search for anything...</span>
      </Link>
    </div>
  )
}

/**
 * CATEGORY CIRCLES - Mobile First
 * Clean, minimal circles - the eBay/Etsy pattern perfected
 * No glows, no animations, just perfect touch targets (56px = 44px min + padding)
 */
function CategoryCircles() {
  return (
    <section className="py-3">
      <div className="flex overflow-x-auto no-scrollbar gap-4 pb-1 px-4 snap-x snap-mandatory scroll-pl-4">
        {categories.map((cat, index) => {
          const Icon = cat.icon
          const tone = tones[index % tones.length]
          return (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="snap-start shrink-0 flex flex-col items-center gap-2 w-[64px] active:opacity-70"
            >
              <div
                className={cn(
                  "size-14 rounded-full flex items-center justify-center",
                  "border border-border",
                  tone.bg
                )}
              >
                <Icon className={cn("size-6", tone.icon)} weight="duotone" />
              </div>
              <span className="text-[11px] font-medium text-foreground text-center leading-tight">
                {cat.name}
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

/**
 * FEATURED DEALS BANNER
 * Horizontal scroll cards for promotions - Vinted/Depop style
 */
function FeaturedDeals() {
  return (
    <section className="py-3">
      <div className="flex items-center justify-between px-4 mb-3">
        <h2 className="text-base font-semibold text-foreground">Featured Deals</h2>
        <Link href="/deals" className="text-xs font-medium text-primary flex items-center gap-0.5">
          See all <CaretRight size={14} weight="bold" />
        </Link>
      </div>
      <div className="flex overflow-x-auto no-scrollbar gap-3 pb-1 px-4 snap-x snap-mandatory scroll-pl-4">
        {featuredDeals.map((deal) => (
          <Link
            key={deal.id}
            href={deal.href}
            className="snap-start shrink-0 w-[260px] active:opacity-80"
          >
            <div className="relative aspect-[2/1] rounded-xl overflow-hidden bg-muted border border-border">
              <Image
                src={deal.image}
                alt={deal.title}
                fill
                className="object-cover"
                sizes="260px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-[10px] font-semibold text-white/70 uppercase tracking-wide mb-0.5">{deal.subtitle}</p>
                <h3 className="text-sm font-bold text-white">{deal.title}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

/**
 * PRODUCT CARD - The Ultimate Marketplace Card
 * Combining best patterns: eBay trust + Vinted simplicity + Etsy charm
 * Mobile-first, no animations, perfect density
 */
function ProductCard({
  id,
  title,
  price,
  originalPrice,
  image,
  seller,
  condition,
  brand,
  shipping,
  tags,
  isBoosted = false,
}: {
  id: string
  title: string
  price: number
  originalPrice: number | null
  image: string
  seller: { name: string; verified: boolean; rating: number; location: string }
  condition: string
  brand: string | null
  shipping: string
  tags: string[]
  isBoosted?: boolean
}) {
  const hasDiscount = originalPrice && originalPrice > price
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0

  // Smart pill - show most important info (condition or brand)
  const smartPill = condition || brand || tags[0]

  return (
    <Link href={`/product/${id}`} className="block active:opacity-80">
      <article
        className={cn(
          "flex flex-col bg-card border border-border rounded-xl overflow-hidden",
          isBoosted && "ring-1 ring-primary/30"
        )}
      >
        {/* SELLER HEADER - Trust-first pattern */}
        <header className="flex items-center gap-2 px-2.5 py-2 bg-muted/40 border-b border-border/50">
          <Avatar className="size-6 border border-border shrink-0">
            <AvatarFallback className="text-[9px] bg-muted font-semibold">
              {getInitials(seller.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-semibold text-foreground truncate">{seller.name}</span>
              {seller.verified && (
                <ShieldCheck size={11} weight="fill" className="text-primary shrink-0" />
              )}
            </div>
          </div>
          <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground shrink-0">
            <Star size={10} weight="fill" />
            <span className="font-medium">{seller.rating}</span>
          </div>
        </header>

        {/* IMAGE - 1:1 aspect ratio for grid consistency */}
        <div className="relative bg-muted">
          <AspectRatio ratio={1}>
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, 200px"
            />

            {/* Top-left badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {isBoosted && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-background/95 text-[10px] font-semibold">
                  <Sparkle size={10} weight="fill" className="text-primary" />
                  Promoted
                </span>
              )}
              {hasDiscount && discountPercent >= 10 && (
                <span className="px-1.5 py-0.5 rounded-md bg-red-500 text-white text-[10px] font-bold">
                  -{discountPercent}%
                </span>
              )}
            </div>

            {/* Wishlist button - 44px touch target */}
            <button
              className={cn(
                "absolute top-2 right-2",
                "size-8 rounded-full flex items-center justify-center",
                "bg-background/90 border border-border",
                "text-muted-foreground"
              )}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              aria-label="Add to wishlist"
            >
              <Heart size={16} weight="regular" />
            </button>
          </AspectRatio>
        </div>

        {/* CONTENT */}
        <div className="p-2.5 space-y-2">
          {/* Title - 2 lines max */}
          <h3 className="text-[13px] font-medium text-foreground leading-tight line-clamp-2">
            {title}
          </h3>

          {/* Meta row: Smart pill + Shipping */}
          <div className="flex items-center gap-2 flex-wrap">
            {smartPill && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-muted text-[10px] font-medium text-muted-foreground">
                {smartPill}
              </span>
            )}
            {shipping === "Free" && (
              <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                <Truck size={11} weight="bold" />
                Free
              </span>
            )}
          </div>

          {/* Price row + CTA */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className={cn(
                "text-[15px] font-bold",
                hasDiscount ? "text-red-600 dark:text-red-500" : "text-foreground"
              )}>
                {formatPrice(price)}
              </span>
              {hasDiscount && originalPrice && (
                <span className="text-[11px] text-muted-foreground line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>

            {/* Compact cart button */}
            <button
              className={cn(
                "size-8 rounded-lg flex items-center justify-center",
                "bg-foreground text-background"
              )}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              aria-label="Add to cart"
            >
              <ShoppingCart size={16} weight="bold" />
            </button>
          </div>
        </div>
      </article>
    </Link>
  )
}

/**
 * PRODUCT GRID
 * 2-column mobile grid with 12px gap (optimal for mobile cards)
 */
function ProductGrid({ 
  title, 
  showSeeAll = true,
  productList = products,
  boostFirst = false,
}: { 
  title: string
  showSeeAll?: boolean
  productList?: typeof products
  boostFirst?: boolean
}) {
  return (
    <section className="py-3">
      <div className="flex items-center justify-between px-4 mb-3">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {showSeeAll && (
          <Link href="/search" className="text-xs font-medium text-primary flex items-center gap-0.5">
            See all <CaretRight size={14} weight="bold" />
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 px-4">
        {productList.slice(0, 6).map((product, index) => (
          <ProductCard
            key={product.id}
            {...product}
            isBoosted={boostFirst && index === 0}
          />
        ))}
      </div>
    </section>
  )
}

/**
 * START SELLING CTA
 * Clean banner to promote seller signup - Vinted/Depop pattern
 */
function StartSellingCTA() {
  return (
    <section className="px-4 py-3">
      <Link
        href="/sell"
        className={cn(
          "flex items-center justify-between gap-3",
          "w-full p-4 rounded-2xl",
          "bg-primary text-primary-foreground"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-xl bg-primary-foreground/15 flex items-center justify-center shrink-0">
            <Storefront size={24} weight="duotone" className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-bold">Start Selling Today</h3>
            <p className="text-xs text-primary-foreground/80">List your first item free</p>
          </div>
        </div>
        <ArrowRight size={20} weight="bold" className="text-primary-foreground/80 shrink-0" />
      </Link>
    </section>
  )
}

/**
 * QUICK ACTION BUTTONS
 * Essential navigation - compact, clear iconography
 */
function QuickActions() {
  const actions = [
    { icon: Fire, label: "Deals", href: "/deals", color: "text-red-500" },
    { icon: Lightning, label: "Flash", href: "/flash-sale", color: "text-amber-500" },
    { icon: Clock, label: "Recent", href: "/recent", color: "text-blue-500" },
    { icon: Heart, label: "Saved", href: "/wishlist", color: "text-pink-500" },
  ]

  return (
    <section className="px-4 py-2">
      <div className="flex gap-2">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.href}
              href={action.href}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl",
                "bg-muted/60 border border-border",
                "active:bg-accent"
              )}
            >
              <Icon size={20} weight="duotone" className={action.color} />
              <span className="text-[10px] font-medium text-foreground">{action.label}</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

/**
 * SIGN IN CTA
 * Encourage user registration - trust signals
 */
function SignInCTA() {
  return (
    <section className="px-4 py-3">
      <div className="p-4 rounded-2xl bg-muted/60 border border-border">
        <h3 className="text-sm font-bold text-foreground mb-1">
          Sign in for the best experience
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          Personalized picks, saved items, and exclusive deals.
        </p>
        <div className="flex gap-2">
          <Link
            href="/auth/signin"
            className={cn(
              "flex-1 h-10 rounded-xl",
              "bg-foreground text-background",
              "text-sm font-semibold",
              "flex items-center justify-center"
            )}
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className={cn(
              "flex-1 h-10 rounded-xl",
              "bg-background text-foreground border border-border",
              "text-sm font-semibold",
              "flex items-center justify-center"
            )}
          >
            Register
          </Link>
        </div>
      </div>
    </section>
  )
}

/**
 * TRUST BADGES
 * Build confidence - eBay/Amazon pattern
 */
function TrustBadges() {
  const badges = [
    { icon: ShieldCheck, label: "Buyer Protection" },
    { icon: Truck, label: "Fast Shipping" },
    { icon: Check, label: "Verified Sellers" },
  ]

  return (
    <section className="px-4 py-3">
      <div className="flex justify-around gap-2 py-3 rounded-xl bg-muted/40 border border-border">
        {badges.map((badge) => {
          const Icon = badge.icon
          return (
            <div key={badge.label} className="flex flex-col items-center gap-1">
              <Icon size={20} weight="duotone" className="text-primary" />
              <span className="text-[10px] font-medium text-muted-foreground text-center">
                {badge.label}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// =============================================================================
// MAIN PAGE
// Mobile-first landing that beats Etsy, Vinted, eBay, Amazon
// 
// STRUCTURE (optimized for conversion):
// 1. Search (gateway to discovery)
// 2. Categories (quick navigation)
// 3. Quick Actions (deals, flash, recent, saved)
// 4. Featured Deals (promotions)
// 5. Trust Badges (build confidence)
// 6. Newest Listings (fresh content)
// 7. Start Selling CTA (grow marketplace)
// 8. Trending Products (social proof)
// 9. Sign In CTA (account creation)
// 10. Recommended (engagement loop)
// =============================================================================

export default function DemoLandingMobilePage() {
  // Shuffle products for variety
  const trendingProducts = [...products].reverse()

  return (
    <main className="min-h-screen bg-background pb-24">
      {/* Demo info banner */}
      <div className="px-4 pt-3 pb-1">
        <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
          <p className="text-[11px] text-primary font-medium leading-relaxed">
            <strong>Demo:</strong> Mobile-first landing combining best patterns from /demo routes. 
            Clean UI/UX • No glows • No animations • Perfect shadcn + Tailwind v4.
          </p>
        </div>
      </div>

      {/* 1. SEARCH - Gateway to discovery */}
      <SearchBar />

      {/* 2. CATEGORIES - Quick navigation */}
      <CategoryCircles />

      {/* 3. QUICK ACTIONS - Essential shortcuts */}
      <QuickActions />

      {/* 4. FEATURED DEALS - Promotions */}
      <FeaturedDeals />

      {/* 5. TRUST BADGES - Build confidence */}
      <TrustBadges />

      {/* 6. NEWEST LISTINGS - Fresh content */}
      <ProductGrid title="Just Listed" boostFirst />

      {/* 7. START SELLING CTA - Grow marketplace */}
      <StartSellingCTA />

      {/* 8. TRENDING - Social proof */}
      <ProductGrid title="Trending Now" productList={trendingProducts} />

      {/* 9. SIGN IN CTA - Account creation */}
      <SignInCTA />

      {/* 10. RECOMMENDED - Engagement loop */}
      <ProductGrid title="Recommended" showSeeAll={false} />
    </main>
  )
}
