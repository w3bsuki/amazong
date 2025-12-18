"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { 
  Heart,
  MapPin,
  ArrowRight,
  MagnifyingGlass,
  Storefront,
  ShieldCheck,
  Package,
  Tag,
  Star,
} from "@phosphor-icons/react"
import { getCategoryIcon } from "@/config/category-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// =============================================================================
// Types
// =============================================================================
type ApiCategory = {
  id: string
  name: string
  name_bg: string | null
  slug: string
  image_url?: string | null
}

type Product = {
  id: string
  title: string
  price: number
  originalPrice?: number
  image: string
  location?: string
  seller?: {
    name: string
    verified?: boolean
  }
  condition?: string
  brand?: string
}

// =============================================================================
// Demo Data
// =============================================================================
const demoProducts: Product[] = [
  {
    id: "1",
    title: "iPhone 15 Pro Max 256GB Natural Titanium",
    price: 2199,
    originalPrice: 2399,
    image: "https://images.unsplash.com/photo-1695048132800-7a03d53f1b3e?w=800&q=80",
    location: "Sofia",
    seller: { name: "TechHub", verified: true },
    condition: "Like New",
    brand: "Apple",
  },
  {
    id: "2",
    title: "MacBook Pro 14 M3 Pro 18GB 512GB Space Black",
    price: 3899,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=800&q=80",
    location: "Plovdiv",
    seller: { name: "iStore BG", verified: true },
    condition: "New",
    brand: "Apple",
  },
  {
    id: "3",
    title: "Vintage Leather Biker Jacket Size L",
    price: 249,
    image: "https://images.unsplash.com/photo-1551028919-33f547589c20?w=800&q=80",
    location: "Varna",
    seller: { name: "Urban Vintage", verified: false },
    condition: "Good",
    brand: "Levi's",
  },
  {
    id: "4",
    title: "Sony WH-1000XM5 Noise Cancelling Black",
    price: 599,
    originalPrice: 699,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80",
    location: "Sofia",
    seller: { name: "AudioWorld", verified: true },
    condition: "New",
    brand: "Sony",
  },
  {
    id: "5",
    title: "Herman Miller Aeron Size B Fully Loaded",
    price: 1200,
    originalPrice: 2400,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    location: "Burgas",
    seller: { name: "Office Comfort", verified: true },
    condition: "Refurbished",
    brand: "Herman Miller",
  },
  {
    id: "6",
    title: "Nike Air Max 97 Silver Bullet Size 42",
    price: 159,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    location: "Sofia",
    seller: { name: "StreetCloset", verified: false },
    condition: "Good",
    brand: "Nike",
  },
  {
    id: "7",
    title: "Volkswagen Golf 7 2.0 TDI Highline",
    price: 18500,
    originalPrice: 19900,
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80",
    location: "Sofia",
    seller: { name: "AutoPremium", verified: true },
    condition: "Used",
    brand: "Volkswagen",
  },
  {
    id: "8",
    title: "Canon EOS R6 Mark II Body Only",
    price: 4299,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    location: "Plovdiv",
    seller: { name: "PhotoPro", verified: true },
    condition: "New",
    brand: "Canon",
  },
]

// =============================================================================
// Clean Category Circles (GPT-style, minimal)
// =============================================================================
function CategoryCircle({ 
  slug, 
  name 
}: { 
  slug: string
  name: string 
}) {
  const icon = getCategoryIcon(slug)
  
  return (
    <Link
      href={`/categories/${slug}`}
      className={cn(
        "group flex flex-col items-center gap-1.5",
        "w-[72px] shrink-0",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      )}
    >
      <div className={cn(
        "size-14 rounded-full",
        "bg-muted/40",
        "flex items-center justify-center",
        "group-hover:bg-muted"
      )}>
        {icon}
      </div>
      <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground text-center leading-tight line-clamp-1">
        {name}
      </span>
    </Link>
  )
}

function CategorySection() {
  const [categories, setCategories] = React.useState<ApiCategory[]>([])

  React.useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => {
        const cats = Array.isArray(data.categories) ? data.categories : []
        setCategories(cats.filter((c: ApiCategory) => !c.name.toLowerCase().includes("[deprecated]")).slice(0, 10))
      })
      .catch(() => setCategories([]))
  }, [])

  const fallback = [
    { slug: "electronics", name: "Electronics" },
    { slug: "fashion", name: "Fashion" },
    { slug: "home", name: "Home" },
    { slug: "beauty", name: "Beauty" },
    { slug: "sports", name: "Sports" },
    { slug: "automotive", name: "Auto" },
    { slug: "books", name: "Books" },
    { slug: "toys", name: "Toys" },
    { slug: "gaming", name: "Gaming" },
    { slug: "garden", name: "Garden" },
  ]

  const displayCategories: Array<{ slug: string; name: string }> = categories.length > 0 
    ? categories.map(c => ({ slug: c.slug, name: c.name })) 
    : fallback

  return (
    <section className="py-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-foreground">Categories</h2>
        <Link href="/categories" className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-0.5">
          All <ArrowRight size={10} />
        </Link>
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {displayCategories.map(cat => (
          <CategoryCircle 
            key={cat.slug} 
            slug={cat.slug} 
            name={cat.name} 
          />
        ))}
      </div>
    </section>
  )
}

// =============================================================================
// Clean Product Card (Vinted-style, no borders, minimal)
// =============================================================================
function CleanProductCard({ product }: { product: Product }) {
  const [wishlisted, setWishlisted] = React.useState(false)
  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  
  return (
    <Link href={`/product/${product.id}`} className="group block">
      {/* Image */}
      <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <img 
          src={product.image} 
          alt={product.title}
          className="size-full object-cover"
        />
        
        {/* Wishlist Button */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWishlisted(!wishlisted) }}
          className={cn(
            "absolute top-2.5 right-2.5",
            "size-8 rounded-full",
            "bg-white/90",
            "flex items-center justify-center",
            wishlisted ? "text-rose-500" : "text-neutral-400 hover:text-neutral-600"
          )}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={16} weight={wishlisted ? "fill" : "regular"} />
        </button>

        {/* Discount Badge */}
        {hasDiscount && (
          <span className="absolute top-2.5 left-2.5 px-1.5 py-0.5 text-[10px] font-bold bg-foreground text-background rounded">
            -{Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}%
          </span>
        )}
      </div>
      
      {/* Content */}
      <div className="pt-2.5 space-y-0.5">
        {/* Price */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-[15px] font-bold text-foreground">
            {product.price.toLocaleString()} лв
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">
              {product.originalPrice?.toLocaleString()}
            </span>
          )}
        </div>
        
        {/* Brand · Condition */}
        <p className="text-xs text-muted-foreground">
          {product.brand} · {product.condition}
        </p>
        
        {/* Location */}
        {product.location && (
          <p className="text-[11px] text-muted-foreground/80 flex items-center gap-0.5">
            <MapPin size={10} weight="fill" />
            {product.location}
          </p>
        )}
      </div>
    </Link>
  )
}

// =============================================================================
// Hero Section (Clean, minimal)
// =============================================================================
function HeroSection() {
  return (
    <section className="pt-10 pb-8 lg:pt-14 lg:pb-10">
      <div className="max-w-2xl">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight mb-3">
          Buy and sell anything, anywhere.
        </h1>
        <p className="text-base text-muted-foreground mb-6 max-w-lg">
          The marketplace for everything. Find deals on electronics, fashion, home goods, and more.
        </p>
        
        {/* Search Bar */}
        <div className="flex gap-2 max-w-lg">
          <div className="relative flex-1">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder="Search for anything..." 
              className="pl-9 h-10 text-sm bg-muted/40 border-border focus-visible:bg-background"
            />
          </div>
          <Button className="h-10 px-5">
            Search
          </Button>
        </div>
        
        {/* Quick Stats */}
        <div className="flex items-center gap-6 mt-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Package size={14} />
            <span>1M+ listings</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Storefront size={14} />
            <span>50K+ sellers</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={14} />
            <span>Buyer protection</span>
          </div>
        </div>
      </div>
    </section>
  )
}

// =============================================================================
// Product Grid Section
// =============================================================================
function ProductGridSection({ 
  title, 
  products, 
  viewAllHref 
}: { 
  title: string
  products: Product[]
  viewAllHref?: string 
}) {
  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {viewAllHref && (
          <Link href={viewAllHref} className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-0.5">
            View all <ArrowRight size={12} />
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
        {products.map(product => (
          <CleanProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

// =============================================================================
// Trust Banner (compact)
// =============================================================================
function TrustBanner() {
  return (
    <section className="py-6 border-y border-border/50">
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-foreground" weight="fill" />
          <span>Buyer Protection</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Storefront size={14} className="text-foreground" weight="fill" />
          <span>Verified Sellers</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Package size={14} className="text-foreground" weight="fill" />
          <span>Fast Shipping</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Tag size={14} className="text-foreground" weight="fill" />
          <span>Best Prices</span>
        </div>
      </div>
    </section>
  )
}

// =============================================================================
// Promo Cards (Clean, image-based)
// =============================================================================
function PromoCardsSection() {
  const promos = [
    {
      title: "Electronics",
      subtitle: "Up to 40% off",
      image: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=800&q=80",
      href: "/search?category=electronics",
    },
    {
      title: "Fashion",
      subtitle: "New arrivals",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
      href: "/search?category=fashion",
    },
    {
      title: "Home & Living",
      subtitle: "Refresh your space",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
      href: "/search?category=home",
    },
    {
      title: "Sports",
      subtitle: "Gear up",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
      href: "/search?category=sports",
    },
  ]

  return (
    <section className="py-6">
      <h2 className="text-base font-semibold text-foreground mb-4">Shop by Interest</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
        {promos.map((promo) => (
          <Link
            key={promo.href}
            href={promo.href}
            className="group relative aspect-[4/3] rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800"
          >
            <img
              src={promo.image}
              alt={promo.title}
              className="size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-2.5 left-2.5 right-2.5">
              <h3 className="text-sm font-semibold text-white">{promo.title}</h3>
              <p className="text-[11px] text-white/70">{promo.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

// =============================================================================
// Seller CTA Section
// =============================================================================
function SellerCTA() {
  return (
    <section className="py-8 px-5 lg:px-8 bg-muted/40 rounded-lg border border-border/50">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-foreground mb-1">Start selling today</h2>
          <p className="text-sm text-muted-foreground max-w-md">
            Join thousands of sellers. List your first item in minutes.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Learn more
          </Button>
          <Button size="sm">
            Start selling
          </Button>
        </div>
      </div>
    </section>
  )
}

// =============================================================================
// Main Page
// =============================================================================
export default function DemoLandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container px-4 lg:px-6 max-w-6xl mx-auto">
        {/* Hero */}
        <HeroSection />

        {/* Categories */}
        <CategorySection />

        {/* Trust Banner */}
        <TrustBanner />

        {/* Featured Products */}
        <ProductGridSection 
          title="Featured Listings" 
          products={demoProducts.slice(0, 5)} 
          viewAllHref="/search?sort=featured"
        />

        {/* Promo Cards */}
        <PromoCardsSection />

        {/* New Arrivals */}
        <ProductGridSection 
          title="New Arrivals" 
          products={[...demoProducts].reverse().slice(0, 5)} 
          viewAllHref="/search?sort=newest"
        />

        {/* Seller CTA */}
        <SellerCTA />

        {/* More products */}
        <ProductGridSection 
          title="Recommended for You" 
          products={demoProducts} 
          viewAllHref="/search"
        />

        {/* Spacer */}
        <div className="h-16" />
      </div>
    </main>
  )
}
