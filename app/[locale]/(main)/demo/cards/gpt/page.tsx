"use client"

import { useMemo, useState } from "react"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProductCard } from "@/components/common/product-card"
import { cn } from "@/lib/utils"
import {
  Heart,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Star,
  Storefront,
} from "@phosphor-icons/react"

const demoProduct = {
  title: "Volkswagen Golf 4 TDI 1.9",
  price: 3000,
  originalPrice: 3500,
  image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80",
  location: "Sofia",
  timeAgo: "2 hours",
  brand: "Volkswagen",
  year: "2003",
  rating: 4.7,
  reviews: 2847,
  seller: "AutoMoto BG",
} as const

const finalCardProducts = [
  {
    id: "gpt-1",
    title: "Volkswagen Golf 4 1.9 TDI · Full Service History",
    price: 2890,
    listPrice: 3350,
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80",
    storeSlug: "automoto-bg",
    sellerName: "AutoMoto BG",
    sellerVerified: true,
    tags: ["Diesel", "Manual", "Warranty"],
    categorySlug: "cars",
    make: "Volkswagen",
    model: "Golf 4",
    year: "2003",
    location: "Sofia",
    isBoosted: true,
  },
  {
    id: "gpt-2",
    title: "iPhone 15 Pro Max · 256GB · Like New",
    price: 2099,
    listPrice: 2399,
    image: "https://images.unsplash.com/photo-1695048132800-7a03d53f1b3e?w=1200&q=80",
    storeSlug: "techhub",
    sellerName: "TechHub",
    sellerVerified: true,
    tags: ["256GB", "Unlocked", "1yr warranty"],
    categorySlug: "electronics",
    brand: "Apple",
    condition: "Like new",
    year: "2024",
    location: "Plovdiv",
    isBoosted: false,
  },
  {
    id: "gpt-3",
    title: "Nike Air Max 97 · Size 42 · Clean",
    price: 159,
    listPrice: 219,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80",
    storeSlug: "streetcloset",
    sellerName: "StreetCloset",
    sellerVerified: false,
    tags: ["Size 42", "Authentic", "Fast ship"],
    categorySlug: "fashion",
    brand: "Nike",
    condition: "Good",
    location: "Varna",
    isBoosted: false,
  },
] as const

const formatPrice = (p: number) => `${p.toLocaleString("bg-BG")} лв.`

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export default function GptCardsDemoPage() {
  const products = useMemo(() => finalCardProducts, [])

  return (
    <div className="container py-8 space-y-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">GPT Product Cards</h1>
        <p className="text-muted-foreground text-sm">
          Curated set: v13 vibe (deal stack), v14 vibe (seller-first trust), and the finalized production card (compact + ultimate).
        </p>
      </div>

      {/* 1. V13-STYLE (Deal Stack) */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-foreground text-background text-xs font-bold px-2 py-1 rounded">13</span>
          <h2 className="text-lg font-semibold">Deal Stack (GPT)</h2>
          <span className="text-xs text-muted-foreground">Badges + scarcity + fast add</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <DealStackGptCard key={i} />
          ))}
        </div>
      </section>

      {/* 2. V14-STYLE (Seller-first trust) */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-foreground text-background text-xs font-bold px-2 py-1 rounded">14</span>
          <h2 className="text-lg font-semibold">Seller-First Trust (GPT)</h2>
          <span className="text-xs text-muted-foreground">Marketplace credibility first</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SellerTrustGptCard key={i} />
          ))}
        </div>
      </section>

      {/* 3. PRODUCTION: COMPACT vs ULTIMATE */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-foreground text-background text-xs font-bold px-2 py-1 rounded">16/17</span>
          <h2 className="text-lg font-semibold">Production Card (Compact vs Ultimate)</h2>
          <span className="text-xs text-muted-foreground">Attributes/meta + seller trust + clean CTAs</span>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="text-sm font-semibold">16 · Default (Clean Target Style)</div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 xl:gap-4">
              {products.map((p, index) => (
                <ProductCard
                  key={`default-${p.id}`}
                  id={p.id}
                  title={p.title}
                  price={p.price}
                  originalPrice={p.listPrice}
                  image={p.image}
                  rating={4.7}
                  reviews={2847}
                  index={index}
                  slug={null}
                  username={(p as { storeSlug?: string }).storeSlug ?? null}
                  sellerName={(p as { sellerName?: string }).sellerName}
                  sellerVerified={(p as { sellerVerified?: boolean }).sellerVerified}
                  isBoosted={(p as { isBoosted?: boolean }).isBoosted}
                  tags={[...(p.tags || [])]}
                  categorySlug={(p as { categorySlug?: string }).categorySlug}
                  make={(p as { make?: string }).make}
                  model={(p as { model?: string }).model}
                  year={(p as { year?: string }).year}
                  brand={(p as { brand?: string }).brand}
                  condition={(p as { condition?: string }).condition}
                  location={(p as { location?: string }).location}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold">17 · Featured (Seller Header)</div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 xl:gap-4">
              {products.map((p, index) => (
                <ProductCard
                  key={`featured-${p.id}`}
                  id={p.id}
                  title={p.title}
                  price={p.price}
                  originalPrice={p.listPrice}
                  image={p.image}
                  rating={4.7}
                  reviews={2847}
                  variant="featured"
                  index={index}
                  slug={null}
                  username={(p as { storeSlug?: string }).storeSlug ?? null}
                  sellerName={(p as { sellerName?: string }).sellerName}
                  sellerVerified={(p as { sellerVerified?: boolean }).sellerVerified}
                  showPills={true}
                  isBoosted={(p as { isBoosted?: boolean }).isBoosted}
                  tags={[...(p.tags || [])]}
                  categorySlug={(p as { categorySlug?: string }).categorySlug}
                  make={(p as { make?: string }).make}
                  model={(p as { model?: string }).model}
                  year={(p as { year?: string }).year}
                  brand={(p as { brand?: string }).brand}
                  condition={(p as { condition?: string }).condition}
                  location={(p as { location?: string }).location}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function DealStackGptCard() {
  const [wishlisted, setWishlisted] = useState(false)

  const stockLeft = 7
  const stockTotal = 40
  const stockPct = Math.max(6, Math.round((stockLeft / stockTotal) * 100))

  const discount = Math.round(((demoProduct.originalPrice - demoProduct.price) / demoProduct.originalPrice) * 100)

  return (
    <div className="group cursor-pointer rounded-xl border bg-card overflow-hidden">
      <div className="relative">
        <AspectRatio ratio={1} className="bg-muted/20">
          <img src={demoProduct.image} alt={demoProduct.title} className="size-full object-cover" />
        </AspectRatio>

        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className="text-[10px] font-semibold border bg-background/90 backdrop-blur-sm rounded px-2 py-1">Limited</span>
          <span className="text-[10px] font-semibold border bg-background/90 backdrop-blur-sm rounded px-2 py-1">-{discount}%</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            setWishlisted((v) => !v)
          }}
          className={cn(
            "absolute top-2 right-2 size-9 rounded-full border bg-background/90 backdrop-blur-sm flex items-center justify-center",
            wishlisted ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={18} weight={wishlisted ? "fill" : "regular"} />
        </button>
      </div>

      <div className="p-3 space-y-2">
        <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug">{demoProduct.title}</h3>

        <div className="flex items-baseline justify-between gap-2">
          <p className="text-base font-bold text-foreground">{formatPrice(demoProduct.price)}</p>
          <p className="text-xs text-muted-foreground line-through">{formatPrice(demoProduct.originalPrice)}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <span>{stockLeft} left</span>
            <span>selling fast</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-foreground/70" style={{ width: `${stockPct}%` }} />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2 min-w-0">
            <div className="size-7 rounded-full border bg-muted/30 flex items-center justify-center shrink-0">
              <Storefront size={14} className="text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground truncate">{demoProduct.seller}</p>
          </div>
          <button className="h-9 px-3 rounded-lg border bg-foreground text-background text-xs font-semibold hover:bg-foreground/90 transition-colors flex items-center gap-2">
            <Plus weight="bold" className="size-3.5" /> Add
          </button>
        </div>
      </div>
    </div>
  )
}

function SellerTrustGptCard() {
  return (
    <div className="group cursor-pointer rounded-xl border bg-card overflow-hidden">
      <div className="p-3 border-b bg-muted/20 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar className="h-8 w-8 border bg-background">
            <AvatarImage src="https://github.com/shadcn.png" alt="Seller avatar" />
            <AvatarFallback className="text-[10px] bg-muted">{getInitials(demoProduct.seller)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-foreground truncate">{demoProduct.seller}</span>
              <ShieldCheck size={14} weight="fill" className="text-primary" />
            </div>
            <p className="text-[10px] text-muted-foreground truncate">Top-rated seller · 24h dispatch</p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
          <Star size={12} weight="fill" className="text-muted-foreground" />
          <span>{demoProduct.rating}</span>
        </div>
      </div>

      <div className="p-3 space-y-2">
        <div className="rounded-lg overflow-hidden border bg-muted/10">
          <AspectRatio ratio={1}>
            <img src={demoProduct.image} alt={demoProduct.title} className="size-full object-cover" />
          </AspectRatio>
        </div>

        <h3 className="text-sm font-medium text-foreground leading-snug line-clamp-2">{demoProduct.title}</h3>

        <div className="flex items-end justify-between gap-2">
          <div className="space-y-0.5">
            <p className="text-base font-bold text-foreground">{formatPrice(demoProduct.price)}</p>
            <p className="text-[10px] text-muted-foreground">Includes buyer protection</p>
          </div>
          <button className="h-9 px-3 rounded-lg border bg-background text-foreground text-xs font-semibold hover:bg-muted/40 transition-colors inline-flex items-center gap-2">
            <ShoppingCart size={14} className="text-muted-foreground" />
            Buy
          </button>
        </div>
      </div>
    </div>
  )
}
