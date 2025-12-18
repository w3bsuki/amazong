"use client"

import { Link } from "@/i18n/routing"
import { ProductCard } from "@/components/ui/product-card"
import { PromoCard } from "@/components/promo-card"
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
  Storefront,
  ArrowRight,
  Users,
  ShieldCheck,
  Truck,
  CreditCard,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react"
import { useRef, useState, useEffect, useCallback } from "react"

// =============================================================================
// DATA
// =============================================================================

const categories = [
  { id: "1", name: "Electronics", name_bg: "Електроника", slug: "electronics", icon: Laptop },
  { id: "2", name: "Fashion", name_bg: "Мода", slug: "fashion", icon: Dress },
  { id: "3", name: "Home", name_bg: "Дом", slug: "home", icon: Armchair },
  { id: "4", name: "Beauty", name_bg: "Красота", slug: "beauty", icon: Sparkle },
  { id: "5", name: "Gaming", name_bg: "Гейминг", slug: "gaming", icon: GameController },
  { id: "6", name: "Sports", name_bg: "Спорт", slug: "sports", icon: Barbell },
  { id: "7", name: "Kids", name_bg: "Деца", slug: "baby", icon: Baby },
  { id: "8", name: "Auto", name_bg: "Авто", slug: "automotive", icon: Car },
  { id: "9", name: "Books", name_bg: "Книги", slug: "books", icon: BookOpen },
  { id: "10", name: "More", name_bg: "Още", slug: "more", icon: ShoppingBag },
]

const tones = [
  { surface: "bg-blue-50 dark:bg-blue-950/30", icon: "text-blue-600 dark:text-blue-400", border: "border-blue-100 dark:border-blue-900/50" },
  { surface: "bg-pink-50 dark:bg-pink-950/30", icon: "text-pink-600 dark:text-pink-400", border: "border-pink-100 dark:border-pink-900/50" },
  { surface: "bg-amber-50 dark:bg-amber-950/30", icon: "text-amber-600 dark:text-amber-400", border: "border-amber-100 dark:border-amber-900/50" },
  { surface: "bg-violet-50 dark:bg-violet-950/30", icon: "text-violet-600 dark:text-violet-400", border: "border-violet-100 dark:border-violet-900/50" },
  { surface: "bg-emerald-50 dark:bg-emerald-950/30", icon: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-100 dark:border-emerald-900/50" },
  { surface: "bg-red-50 dark:bg-red-950/30", icon: "text-red-600 dark:text-red-400", border: "border-red-100 dark:border-red-900/50" },
  { surface: "bg-cyan-50 dark:bg-cyan-950/30", icon: "text-cyan-600 dark:text-cyan-400", border: "border-cyan-100 dark:border-cyan-900/50" },
  { surface: "bg-slate-100 dark:bg-slate-900/30", icon: "text-slate-600 dark:text-slate-400", border: "border-slate-200 dark:border-slate-800/50" },
  { surface: "bg-orange-50 dark:bg-orange-950/30", icon: "text-orange-600 dark:text-orange-400", border: "border-orange-100 dark:border-orange-900/50" },
  { surface: "bg-indigo-50 dark:bg-indigo-950/30", icon: "text-indigo-600 dark:text-indigo-400", border: "border-indigo-100 dark:border-indigo-900/50" },
]

const featuredProducts = [
  {
    id: "featured-1",
    slug: "macbook-pro-14-m3",
    title: "MacBook Pro 14 M3 Pro · 18GB RAM · 512GB SSD",
    price: 3899,
    originalPrice: 4299,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=800&q=80",
    rating: 5.0,
    reviews: 42,
    sellerName: "iStore Bulgaria",
    sellerVerified: true,
    sellerAvatarUrl: "https://github.com/vercel.png",
    categorySlug: "electronics",
    brand: "Apple",
    condition: "New",
    location: "Plovdiv",
    tags: ["In Stock", "Free Shipping"],
    isBoosted: false,
  },
  {
    id: "featured-2",
    slug: "vw-golf-7-tdi-highline",
    title: "Volkswagen Golf 7 2.0 TDI Highline · Full Service",
    price: 18500,
    originalPrice: 19900,
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80",
    rating: 4.8,
    reviews: 124,
    sellerName: "AutoPremium Sofia",
    sellerVerified: true,
    sellerAvatarUrl: "https://github.com/shadcn.png",
    categorySlug: "cars",
    make: "Volkswagen",
    model: "Golf 7",
    year: "2016",
    location: "Sofia",
    tags: ["Warranty", "Leasing"],
    isBoosted: true,
  },
  {
    id: "featured-3",
    slug: "sony-wh-1000xm5",
    title: "Sony WH-1000XM5 · Noise Cancelling · Black",
    price: 599,
    originalPrice: 699,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80",
    rating: 4.8,
    reviews: 230,
    sellerName: "AudioWorld",
    sellerVerified: true,
    sellerAvatarUrl: "https://github.com/shadcn.png",
    categorySlug: "electronics",
    brand: "Sony",
    condition: "New",
    location: "Sofia",
    tags: ["ANC", "Wireless"],
    isBoosted: false,
  },
  {
    id: "featured-4",
    slug: "iphone-15-pro-max",
    title: "iPhone 15 Pro Max · 256GB · Natural Titanium",
    price: 2099,
    originalPrice: 2399,
    image: "https://images.unsplash.com/photo-1695048132800-7a03d53f1b3e?w=800&q=80",
    rating: 5.0,
    reviews: 89,
    sellerName: "TechHub",
    sellerVerified: true,
    sellerAvatarUrl: "https://github.com/vercel.png",
    categorySlug: "electronics",
    brand: "Apple",
    condition: "Like new",
    location: "Plovdiv",
    tags: ["Unlocked", "256GB"],
    isBoosted: false,
  },
  {
    id: "featured-5",
    slug: "vintage-leather-jacket",
    title: "Vintage Leather Biker Jacket · Handcrafted · Size L",
    price: 249,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
    rating: 4.7,
    reviews: 89,
    sellerName: "Urban Vintage",
    sellerVerified: false,
    sellerAvatarUrl: "https://github.com/nextjs.png",
    categorySlug: "fashion",
    brand: "Handmade",
    condition: "Used",
    location: "Varna",
    tags: ["Leather", "Vintage"],
    isBoosted: true,
  },
]

const newestProducts = [
  {
    id: "new-1",
    slug: "herman-miller-aeron",
    title: "Herman Miller Aeron · Size B · Fully Loaded",
    price: 1200,
    originalPrice: 2400,
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&q=80",
    rating: 4.9,
    reviews: 56,
    sellerName: "Office Comfort",
    sellerVerified: true,
    sellerAvatarUrl: "https://github.com/shadcn.png",
    categorySlug: "furniture",
    brand: "Herman Miller",
    condition: "Refurbished",
    location: "Sofia",
    tags: ["Ergonomic", "Size B"],
    isBoosted: false,
  },
  {
    id: "new-2",
    slug: "ps5-console-bundle",
    title: "PlayStation 5 Console · Digital Edition · 2 Controllers",
    price: 899,
    originalPrice: 999,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80",
    rating: 4.9,
    reviews: 312,
    sellerName: "GameZone",
    sellerVerified: true,
    sellerAvatarUrl: "https://github.com/vercel.png",
    categorySlug: "gaming",
    brand: "Sony",
    condition: "New",
    location: "Sofia",
    tags: ["Digital", "Bundle"],
    isBoosted: false,
  },
  {
    id: "new-3",
    slug: "nike-air-max-97",
    title: "Nike Air Max 97 · Silver Bullet · Size 42",
    price: 159,
    originalPrice: 219,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    rating: 4.6,
    reviews: 67,
    sellerName: "StreetCloset",
    sellerVerified: false,
    sellerAvatarUrl: "https://github.com/nextjs.png",
    categorySlug: "fashion",
    brand: "Nike",
    condition: "Good",
    location: "Varna",
    tags: ["Size 42", "Authentic"],
    isBoosted: false,
  },
  {
    id: "new-4",
    slug: "dyson-v15-detect",
    title: "Dyson V15 Detect · Absolute · Laser Dust Detection",
    price: 1199,
    originalPrice: 1399,
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80",
    rating: 4.8,
    reviews: 145,
    sellerName: "HomeElectro",
    sellerVerified: true,
    sellerAvatarUrl: "https://github.com/shadcn.png",
    categorySlug: "home",
    brand: "Dyson",
    condition: "New",
    location: "Plovdiv",
    tags: ["Cordless", "Laser"],
    isBoosted: false,
  },
  {
    id: "new-5",
    slug: "airpods-pro-2",
    title: "Apple AirPods Pro 2 · USB-C · MagSafe Case",
    price: 449,
    originalPrice: 499,
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80",
    rating: 4.9,
    reviews: 892,
    sellerName: "iStore Bulgaria",
    sellerVerified: true,
    sellerAvatarUrl: "https://github.com/vercel.png",
    categorySlug: "electronics",
    brand: "Apple",
    condition: "New",
    location: "Plovdiv",
    tags: ["USB-C", "ANC"],
    isBoosted: true,
  },
]

// =============================================================================
// COMPONENTS
// =============================================================================

// Hero Section - Clean, minimal, conversion-focused
function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" aria-hidden="true">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1v38h38V1H1z' fill='%23ffffff' fill-opacity='1'/%3E%3C/svg%3E")`,
          }} 
        />
      </div>

      <div className="relative px-6 py-12 lg:px-12 lg:py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Social proof badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/90 text-sm font-medium mb-6 border border-white/10">
            <Users weight="fill" className="size-4" aria-hidden="true" />
            <span>Join 10,000+ active users</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl lg:text-5xl font-bold text-white tracking-tight mb-4">
            The Modern Marketplace
            <span className="block text-white/70 text-2xl lg:text-3xl font-medium mt-2">
              Buy and sell with confidence
            </span>
          </h1>

          {/* Value props */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-white/60 text-sm mb-8">
            <div className="flex items-center gap-2">
              <ShieldCheck weight="fill" className="size-4 text-emerald-400" />
              <span>Verified sellers</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck weight="fill" className="size-4 text-blue-400" />
              <span>Fast shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard weight="fill" className="size-4 text-violet-400" />
              <span>Secure payments</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/sell"
              className={cn(
                "inline-flex items-center gap-2 px-6 py-3 rounded-lg",
                "bg-white text-slate-900 font-semibold text-sm",
                "hover:bg-white/90 transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              )}
            >
              <Storefront weight="fill" className="size-4" aria-hidden="true" />
              Start Selling
              <ArrowRight weight="bold" className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/search"
              className={cn(
                "inline-flex items-center gap-2 px-6 py-3 rounded-lg",
                "bg-white/10 text-white font-semibold text-sm border border-white/20",
                "hover:bg-white/20 transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              )}
            >
              <ShoppingBag weight="fill" className="size-4" aria-hidden="true" />
              Browse Listings
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// Category Rail - Clean circles with subtle hover
function CategoryRail() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScroll()
    el.addEventListener("scroll", checkScroll)
    window.addEventListener("resize", checkScroll)
    return () => {
      el.removeEventListener("scroll", checkScroll)
      window.removeEventListener("resize", checkScroll)
    }
  }, [checkScroll])

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    const scrollAmount = 300
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  return (
    <section className="relative">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Shop by Category</h2>
        <Link 
          href="/categories" 
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          View all
          <ArrowRight weight="bold" className="size-3.5" />
        </Link>
      </div>

      {/* Scroll container with nav */}
      <div className="relative group/rail">
        {/* Left nav */}
        <button
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          className={cn(
            "absolute -left-4 top-1/2 -translate-y-1/2 z-10",
            "size-9 rounded-full bg-background border border-border shadow-sm",
            "flex items-center justify-center",
            "transition-all hover:bg-accent",
            canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          aria-label="Scroll left"
        >
          <CaretLeft weight="bold" className="size-4" />
        </button>

        {/* Right nav */}
        <button
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          className={cn(
            "absolute -right-4 top-1/2 -translate-y-1/2 z-10",
            "size-9 rounded-full bg-background border border-border shadow-sm",
            "flex items-center justify-center",
            "transition-all hover:bg-accent",
            canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          aria-label="Scroll right"
        >
          <CaretRight weight="bold" className="size-4" />
        </button>

        {/* Categories */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto no-scrollbar gap-4 scroll-smooth"
        >
          {categories.map((cat, index) => {
            const Icon = cat.icon
            const tone = tones[index % tones.length]
            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="group flex flex-col items-center gap-2.5 shrink-0 w-20"
              >
                {/* Icon circle - clean, minimal */}
                <div className={cn(
                  "size-16 rounded-full flex items-center justify-center",
                  "bg-background border transition-all duration-200",
                  tone.border,
                  "group-hover:border-border group-hover:shadow-sm"
                )}>
                  <div className={cn(
                    "size-12 rounded-full flex items-center justify-center transition-colors",
                    tone.surface
                  )}>
                    <Icon 
                      className={cn("size-6 transition-transform group-hover:scale-110", tone.icon)} 
                      weight="duotone" 
                    />
                  </div>
                </div>
                {/* Label */}
                <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors text-center leading-tight">
                  {cat.name}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Product Grid Section
function ProductGridSection({ 
  title, 
  subtitle, 
  products, 
  viewAllHref,
  showSellerRow = true,
}: { 
  title: string
  subtitle?: string
  products: typeof featuredProducts
  viewAllHref: string
  showSellerRow?: boolean
}) {
  return (
    <section>
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
        <Link 
          href={viewAllHref} 
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          View all
          <ArrowRight weight="bold" className="size-3.5" />
        </Link>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            id={product.id}
            slug={product.slug}
            title={product.title}
            price={product.price}
            originalPrice={product.originalPrice}
            image={product.image}
            rating={product.rating}
            reviews={product.reviews}
            variant={showSellerRow ? "featured" : "default"}
            index={index}
            sellerName={product.sellerName}
            sellerVerified={product.sellerVerified}
            sellerAvatarUrl={product.sellerAvatarUrl}
            showPills={true}
            isBoosted={product.isBoosted}
            tags={product.tags}
            categorySlug={product.categorySlug}
            make={(product as any).make}
            model={(product as any).model}
            year={(product as any).year}
            brand={product.brand}
            condition={product.condition}
            location={product.location}
          />
        ))}
      </div>
    </section>
  )
}

// Promo Cards Grid
function PromoCardsSection() {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Today&apos;s Deals</h2>
        <Link 
          href="/todays-deals" 
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          View all deals
          <ArrowRight weight="bold" className="size-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <PromoCard
          bgImage="https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=800&q=80"
          dealText="Save up to"
          highlight="$200"
          subtitle="Apple devices"
          href="/search?category=electronics&brand=apple"
        />
        <PromoCard
          bgImage="https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&q=80"
          dealText="Up to"
          highlight="50%"
          subtitle="Select toys"
          href="/todays-deals?category=toys"
          badge="🔥 Hot"
        />
        <PromoCard
          bgImage="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"
          dealText="Up to"
          highlight="40%"
          subtitle="Electronics"
          href="/search?category=electronics"
        />
        <PromoCard
          bgImage="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
          dealText="Up to"
          highlight="30%"
          subtitle="Fashion"
          href="/search?category=fashion"
        />
      </div>
    </section>
  )
}

// Trust Banner - Simple value props
function TrustBanner() {
  return (
    <section className="border border-border rounded-xl bg-card p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
            <ShieldCheck weight="fill" className="size-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Verified Sellers</p>
            <p className="text-xs text-muted-foreground">Trusted community</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
            <Truck weight="fill" className="size-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Fast Delivery</p>
            <p className="text-xs text-muted-foreground">Same-day shipping</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center shrink-0">
            <CreditCard weight="fill" className="size-5 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Secure Payments</p>
            <p className="text-xs text-muted-foreground">Protected transactions</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
            <Users weight="fill" className="size-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">10K+ Users</p>
            <p className="text-xs text-muted-foreground">Active community</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function Landing1Page() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 lg:px-6 py-6 space-y-8">
        {/* Hero */}
        <HeroSection />

        {/* Categories */}
        <CategoryRail />

        {/* Featured Products - Ultimate cards with seller trust */}
        <ProductGridSection
          title="Featured Listings"
          subtitle="Hand-picked quality items from verified sellers"
          products={featuredProducts}
          viewAllHref="/search?sort=featured"
          showSellerRow={true}
        />

        {/* Promo Cards */}
        <PromoCardsSection />

        {/* Newest Products */}
        <ProductGridSection
          title="Just Listed"
          subtitle="Fresh arrivals from the community"
          products={newestProducts}
          viewAllHref="/search?sort=newest"
          showSellerRow={true}
        />

        {/* Trust Banner */}
        <TrustBanner />

        {/* CTA Section */}
        <section className="text-center py-8 border-t border-border">
          <h2 className="text-xl font-bold text-foreground mb-2">Ready to start selling?</h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Join thousands of sellers already making money on our platform. Free listings, no seller fees.
          </p>
          <Link
            href="/sell"
            className={cn(
              "inline-flex items-center gap-2 px-6 py-3 rounded-lg",
              "bg-foreground text-background font-semibold text-sm",
              "hover:bg-foreground/90 transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
          >
            <Storefront weight="fill" className="size-4" />
            Create Your First Listing
            <ArrowRight weight="bold" className="size-4" />
          </Link>
        </section>
      </div>
    </main>
  )
}
