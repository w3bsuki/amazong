"use client"

import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { getCategoryIcon } from "@/config/category-icons"
import { ProductCard } from "@/components/shared/product/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, MagnifyingGlass, Package, ShieldCheck, Storefront } from "@phosphor-icons/react"

type DemoCategory = {
  slug: string
  name: string
}

const demoCategories: DemoCategory[] = [
  { slug: "electronics", name: "Electronics" },
  { slug: "fashion", name: "Fashion" },
  { slug: "home", name: "Home" },
  { slug: "beauty", name: "Beauty" },
  { slug: "gaming", name: "Gaming" },
  { slug: "sports", name: "Sports" },
  { slug: "baby", name: "Kids & Baby" },
  { slug: "automotive", name: "Automotive" },
  { slug: "books", name: "Books" },
  { slug: "accessories", name: "Accessories" },
]

const featuredProducts = [
  {
    id: "demo-featured-1",
    title: "MacBook Pro 14 M3 Pro  18GB RAM  512GB SSD",
    price: 3899,
    listPrice: 4299,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=1600&q=80",
    sellerName: "iStore Bulgaria",
    sellerVerified: true,
    sellerAvatarUrl: "https://github.com/vercel.png",
    location: "Plovdiv",
    categorySlug: "electronics",
    brand: "Apple",
    condition: "New",
    tags: ["In Stock", "Free Shipping"],
    isBoosted: false,
  },
  {
    id: "demo-featured-2",
    title: "Volkswagen Golf 7 2.0 TDI Highline  Full Service History",
    price: 18500,
    listPrice: 19900,
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=1600&q=80",
    sellerName: "AutoPremium Sofia",
    sellerVerified: true,
    sellerAvatarUrl: "https://github.com/shadcn.png",
    location: "Sofia",
    categorySlug: "cars",
    make: "Volkswagen",
    model: "Golf 7",
    year: "2016",
    tags: ["Warranty", "Leasing"],
    isBoosted: true,
    condition: "Used",
  },
  {
    id: "demo-featured-3",
    title: "Sony WH-1000XM5  Noise Cancelling  Black",
    price: 599,
    listPrice: 699,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=1600&q=80",
    sellerName: "AudioWorld",
    sellerVerified: true,
    sellerAvatarUrl: "https://github.com/shadcn.png",
    location: "Sofia",
    categorySlug: "electronics",
    brand: "Sony",
    condition: "New",
    tags: ["ANC", "Wireless"],
    isBoosted: false,
  },
  {
    id: "demo-featured-4",
    title: "Herman Miller Aeron  Size B  Fully Adjustable",
    price: 999,
    listPrice: 1299,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=80",
    sellerName: "OfficeWorks",
    sellerVerified: true,
    sellerAvatarUrl: "https://github.com/shadcn.png",
    location: "Burgas",
    categorySlug: "home",
    brand: "Herman Miller",
    condition: "Refurbished",
    tags: ["Ergonomic", "Refurb"],
    isBoosted: true,
  },
  {
    id: "demo-featured-5",
    title: "Nike Air Max 97  Size 42  Clean",
    price: 159,
    listPrice: 219,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&q=80",
    sellerName: "StreetCloset",
    sellerVerified: false,
    sellerAvatarUrl: "https://github.com/nextjs.png",
    location: "Varna",
    categorySlug: "fashion",
    brand: "Nike",
    condition: "Good",
    tags: ["Size 42", "Authentic"],
    isBoosted: false,
  },
 ]

const newArrivals = [
  {
    id: "demo-new-1",
    title: "iPhone 15 Pro Max  256GB  Like New",
    price: 2099,
    listPrice: 2399,
    image: "https://images.unsplash.com/photo-1695048132800-7a03d53f1b3e?w=1600&q=80",
    sellerName: "TechHub",
    sellerVerified: true,
    sellerAvatarUrl: "https://github.com/vercel.png",
    location: "Plovdiv",
    categorySlug: "electronics",
    brand: "Apple",
    condition: "Like new",
    tags: ["256GB", "Unlocked"],
    isBoosted: false,
  },
  {
    id: "demo-new-2",
    title: "PlayStation 5 Console  Digital Edition  Bundle",
    price: 899,
    listPrice: 999,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=1600&q=80",
    sellerName: "GameZone",
    sellerVerified: true,
    sellerAvatarUrl: "https://github.com/vercel.png",
    location: "Sofia",
    categorySlug: "gaming",
    brand: "Sony",
    condition: "New",
    tags: ["Bundle", "In Stock"],
    isBoosted: false,
  },
  {
    id: "demo-new-3",
    title: "Dyson V15 Detect  Absolute  Laser Dust Detection",
    price: 1199,
    listPrice: 1399,
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=1600&q=80",
    sellerName: "HomeElectro",
    sellerVerified: true,
    sellerAvatarUrl: "https://github.com/shadcn.png",
    location: "Plovdiv",
    categorySlug: "home",
    brand: "Dyson",
    condition: "New",
    tags: ["Cordless", "Laser"],
    isBoosted: false,
  },
  {
    id: "demo-new-4",
    title: "Vintage Leather Biker Jacket  Handcrafted  Size L",
    price: 249,
    image: "https://images.unsplash.com/photo-1551028919-33f547589c20?w=1600&q=80",
    sellerName: "Urban Vintage",
    sellerVerified: false,
    sellerAvatarUrl: "https://github.com/nextjs.png",
    location: "Varna",
    categorySlug: "fashion",
    brand: "Handmade",
    condition: "Used",
    tags: ["Leather", "Vintage"],
    isBoosted: true,
  },
  {
    id: "demo-new-5",
    title: "Canon EOS R6 Mark II  Body Only",
    price: 4299,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1600&q=80",
    sellerName: "PhotoPro",
    sellerVerified: true,
    sellerAvatarUrl: "https://github.com/shadcn.png",
    location: "Plovdiv",
    categorySlug: "electronics",
    brand: "Canon",
    condition: "New",
    tags: ["Body", "Warranty"],
    isBoosted: false,
  },
 ]

function CategoryTile({ category }: { category: DemoCategory }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className={cn(
        "rounded-xl border border-border bg-card p-4",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      )}
      aria-label={`Browse ${category.name}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-muted" aria-hidden="true">
          {getCategoryIcon(category.slug)}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-foreground truncate">{category.name}</div>
          <div className="text-xs text-muted-foreground">Browse</div>
        </div>
        <ArrowRight className="ml-auto size-4 text-muted-foreground" aria-hidden="true" />
      </div>
    </Link>
  )
}

function SectionHeader({ title, href, hrefLabel }: { title: string; href: string; hrefLabel: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
      <Link href={href} className="text-sm font-medium text-muted-foreground hover:text-foreground">
        {hrefLabel}
      </Link>
    </div>
  )
}

function ValueProps() {
  return (
    <section className="border-y border-border bg-muted/20">
      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-foreground" weight="regular" />
              <div className="text-sm font-semibold text-foreground">Verified sellers</div>
            </div>
            <div className="mt-1 text-sm text-muted-foreground">Clear trust signals and transparent listings.</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Package className="size-5 text-foreground" weight="regular" />
              <div className="text-sm font-semibold text-foreground">Fast discovery</div>
            </div>
            <div className="mt-1 text-sm text-muted-foreground">Scannable grids, consistent density, clean hierarchy.</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Storefront className="size-5 text-foreground" weight="regular" />
              <div className="text-sm font-semibold text-foreground">Marketplace-ready</div>
            </div>
            <div className="mt-1 text-sm text-muted-foreground">shadcn/ui components + Tailwind v4 tokens only.</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function LandingGptPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* HERO */}
      <section className="border-b border-border">
        <div className="container px-4 py-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <div className="text-sm font-medium text-muted-foreground">Demo landing (GPT)</div>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                A clean marketplace landing, desktop-first
              </h1>
              <p className="mt-3 max-w-[60ch] text-base text-muted-foreground">
                Categories you can scan in seconds, and product cards optimized for trust and conversion  no gimmicks.
              </p>

              <div className="mt-6 flex w-full max-w-xl items-center gap-2">
                <div className="relative w-full">
                  <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input className="pl-9" placeholder="Search products, brands, or sellers" aria-label="Search" />
                </div>
                <Button type="button">Search</Button>
              </div>

              <div className="mt-4 text-sm text-muted-foreground">
                Popular:{" "}
                <Link href="/categories/electronics" className="font-medium text-foreground hover:underline">
                  Electronics
                </Link>
                {"  "}
                <Link href="/categories/cars" className="font-medium text-foreground hover:underline">
                  Cars
                </Link>
                {"  "}
                <Link href="/categories/fashion" className="font-medium text-foreground hover:underline">
                  Fashion
                </Link>
                {"  "}
                <Link href="/categories/home" className="font-medium text-foreground hover:underline">
                  Home
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button asChild>
                  <Link href="/categories">Browse all categories</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/demo/cards/final">View best product cards</Link>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="text-sm font-semibold text-foreground">What this page uses</div>
                <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                  <div>Category tiles derived from the best /demo category variants.</div>
                  <div>
                    Product grids use the production <span className="font-medium text-foreground">ProductCard</span> in
                    <span className="font-medium text-foreground"> marketplace</span> variant.
                  </div>
                  <div>No gradients, no glow, no motion  just clean hierarchy.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ValueProps />

      {/* CATEGORIES */}
      <section className="py-10">
        <div className="container px-4 space-y-6">
          <SectionHeader title="Browse categories" href="/categories" hrefLabel="See all" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {demoCategories.map((category) => (
              <CategoryTile key={category.slug} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="border-t border-border py-10">
        <div className="container px-4 space-y-6">
          <SectionHeader title="Featured listings" href="/demo/cards/merged" hrefLabel="See variants" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {featuredProducts.map((p, index) => (
              <ProductCard
                key={p.id}
                {...p}
                index={index}
                variant="featured"
                showPills
              />
            ))}
          </div>
        </div>
      </section>

      {/* NEW */}
      <section className="border-t border-border py-10">
        <div className="container px-4 space-y-6">
          <SectionHeader title="New arrivals" href="/demo/cards/gpt" hrefLabel="See GPT cards" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {newArrivals.map((p, index) => (
              <ProductCard
                key={p.id}
                {...p}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="border-t border-border py-10">
        <div className="container px-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-lg font-semibold tracking-tight text-foreground">Ready to ship this to prod?</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  This demo composes the cleanest patterns from the /demo routes into a landing you can harden.
                </div>
              </div>
              <div className="flex gap-3">
                <Button asChild>
                  <Link href="/demo/cards/final">Open final cards</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/demo">Back to demos</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
