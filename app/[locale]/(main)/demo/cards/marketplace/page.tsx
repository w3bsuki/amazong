"use client"

import { useState } from "react"
import { MarketplaceCard, MarketplaceCardSkeleton } from "@/components/demo/marketplace-card"
import { ProductCard } from "@/components/ui/product-card"
import { cn } from "@/lib/utils"

// Demo products with realistic marketplace data
const demoProducts = [
  {
    id: "1",
    title: "Volkswagen Golf 4 1.9 TDI · Full Service History · New Tires",
    price: 2890,
    originalPrice: 3350,
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
    brand: "Volkswagen",
    condition: "Used",
    sellerName: "AutoMoto BG",
    sellerVerified: true,
    sellerRating: 4.8,
    location: "Sofia",
    timeAgo: "2h ago",
    freeShipping: false,
    isPromoted: true,
  },
  {
    id: "2",
    title: "iPhone 15 Pro Max 256GB Natural Titanium · Like New",
    price: 2099,
    originalPrice: 2499,
    image: "https://images.unsplash.com/photo-1695048132800-7a03d53f1b3e?w=800&q=80",
    brand: "Apple",
    condition: "Like New",
    sellerName: "TechHub",
    sellerVerified: true,
    sellerRating: 4.9,
    location: "Plovdiv",
    timeAgo: "5h ago",
    freeShipping: true,
    isPromoted: false,
  },
  {
    id: "3",
    title: "Nike Air Max 97 Silver Bullet · Size 42 · Authentic",
    price: 159,
    originalPrice: 219,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    brand: "Nike",
    condition: "Good",
    sellerName: "StreetCloset",
    sellerVerified: false,
    sellerRating: 4.5,
    location: "Varna",
    timeAgo: "1d ago",
    freeShipping: true,
    isPromoted: false,
  },
  {
    id: "4",
    title: "Herman Miller Aeron Size B · Fully Loaded · With Lumbar",
    price: 999,
    originalPrice: 1299,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    brand: "Herman Miller",
    condition: "Refurbished",
    sellerName: "OfficeWorks",
    sellerVerified: true,
    sellerRating: 4.7,
    location: "Burgas",
    timeAgo: "3d ago",
    freeShipping: false,
    isPromoted: true,
  },
  {
    id: "5",
    title: "Sony WH-1000XM5 Wireless Headphones · Black · ANC",
    price: 499,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80",
    brand: "Sony",
    condition: "New",
    sellerName: "SoundLab",
    sellerVerified: false,
    sellerRating: 4.3,
    location: "Sofia",
    timeAgo: "6h ago",
    freeShipping: true,
    isPromoted: false,
  },
  {
    id: "6",
    title: "MacBook Pro 14\" M3 Pro 18GB RAM 512GB · Space Black",
    price: 3299,
    originalPrice: 3599,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
    brand: "Apple",
    condition: "New",
    sellerName: "iStore BG",
    sellerVerified: true,
    sellerRating: 5.0,
    location: "Sofia",
    timeAgo: "12h ago",
    freeShipping: true,
    isPromoted: false,
  },
  {
    id: "7",
    title: "Canon EOS R6 Mark II Body · Excellent Condition",
    price: 2199,
    originalPrice: 2899,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    brand: "Canon",
    condition: "Excellent",
    sellerName: "PhotoPro",
    sellerVerified: true,
    sellerRating: 4.6,
    location: "Plovdiv",
    timeAgo: "2d ago",
    freeShipping: false,
    isPromoted: false,
  },
  {
    id: "8",
    title: "Dyson V15 Detect Absolute · Full Set · 1yr Warranty",
    price: 899,
    originalPrice: 1199,
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80",
    brand: "Dyson",
    condition: "Like New",
    sellerName: "HomeAppliances",
    sellerVerified: true,
    sellerRating: 4.8,
    location: "Stara Zagora",
    timeAgo: "4h ago",
    freeShipping: true,
    isPromoted: false,
  },
]

export default function MarketplaceCardDemoPage() {
  const [columns, setColumns] = useState(5)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold">Marketplace Card</h1>
              <p className="text-sm text-muted-foreground">Vinted minimal + eBay seller trust hybrid</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Columns:</span>
              {[3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  onClick={() => setColumns(n)}
                  className={cn(
                    "size-8 rounded-md text-xs font-semibold transition-colors",
                    columns === n 
                      ? "bg-foreground text-background" 
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-12">
        {/* NEW MARKETPLACE CARD */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded">NEW</span>
            <div>
              <h2 className="text-lg font-semibold">Marketplace Card (Hybrid)</h2>
              <p className="text-sm text-muted-foreground">3:4 ratio · No border · Seller trust · Location/time · Clean price</p>
            </div>
          </div>
          
          <div 
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {demoProducts.map((product) => (
              <MarketplaceCard
                key={product.id}
                id={product.id}
                title={product.title}
                price={product.price}
                originalPrice={product.originalPrice}
                image={product.image}
                brand={product.brand}
                condition={product.condition}
                sellerName={product.sellerName}
                sellerVerified={product.sellerVerified}
                sellerRating={product.sellerRating}
                location={product.location}
                timeAgo={product.timeAgo}
                freeShipping={product.freeShipping}
                isPromoted={product.isPromoted}
              />
            ))}
          </div>
        </section>

        {/* LOADING STATE */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Loading State</h2>
            <p className="text-sm text-muted-foreground">Skeleton matches card layout exactly</p>
          </div>
          
          <div 
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {[1, 2, 3, 4].map((i) => (
              <MarketplaceCardSkeleton key={i} />
            ))}
          </div>
        </section>

        {/* COMPARISON: CURRENT CARD */}
        <section className="space-y-4 border-t pt-8">
          <div className="flex items-center gap-3">
            <span className="bg-muted text-muted-foreground text-xs font-bold px-2.5 py-1 rounded">CURRENT</span>
            <div>
              <h2 className="text-lg font-semibold">Current ProductCard</h2>
              <p className="text-sm text-muted-foreground">1:1 ratio · Border · Shadow hover · More chrome</p>
            </div>
          </div>
          
          <div 
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {demoProducts.map((product) => (
              <ProductCard
                key={`current-${product.id}`}
                id={product.id}
                title={product.title}
                price={product.price}
                originalPrice={product.originalPrice}
                image={product.image}
                brand={product.brand}
                condition={product.condition}
                sellerName={product.sellerName}
                sellerVerified={product.sellerVerified}
                sellerRating={product.sellerRating}
                location={product.location}
                freeShipping={product.freeShipping}
                isBoosted={product.isPromoted}
              />
            ))}
          </div>
        </section>

        {/* DESIGN RATIONALE */}
        <section className="bg-muted/30 rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Why This Design?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="bg-card rounded-lg p-4 border">
              <div className="font-semibold text-foreground mb-2">📐 3:4 Aspect Ratio</div>
              <p className="text-muted-foreground text-xs">
                Shows 33% more product than 1:1. Vinted/fashion apps use this because products look better in portrait.
              </p>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <div className="font-semibold text-foreground mb-2">🚫 No Borders on Image</div>
              <p className="text-muted-foreground text-xs">
                Borders add visual noise. Image edge IS the card edge. More products per viewport = more conversions.
              </p>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <div className="font-semibold text-foreground mb-2">💰 Price First</div>
              <p className="text-muted-foreground text-xs">
                eBay pattern: price is the #1 decision factor. Show it immediately, bold, before title.
              </p>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <div className="font-semibold text-foreground mb-2">🛡️ Seller Trust Row</div>
              <p className="text-muted-foreground text-xs">
                Name + verified badge + rating in ONE compact line. Location + time adds C2C marketplace feel.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-2">Comparison</h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="pb-2">Feature</th>
                  <th className="pb-2">Current Card</th>
                  <th className="pb-2">New Marketplace Card</th>
                </tr>
              </thead>
              <tbody className="text-foreground">
                <tr className="border-t">
                  <td className="py-2">Aspect ratio</td>
                  <td>1:1</td>
                  <td className="text-primary font-medium">3:4 (33% more product)</td>
                </tr>
                <tr className="border-t">
                  <td className="py-2">Image border</td>
                  <td>Yes (border-border)</td>
                  <td className="text-primary font-medium">None</td>
                </tr>
                <tr className="border-t">
                  <td className="py-2">Hover shadow</td>
                  <td>Yes (shadow-sm)</td>
                  <td className="text-primary font-medium">None (flat like eBay)</td>
                </tr>
                <tr className="border-t">
                  <td className="py-2">Content order</td>
                  <td>Title → Price → Pills</td>
                  <td className="text-primary font-medium">Price → Title → Seller</td>
                </tr>
                <tr className="border-t">
                  <td className="py-2">Location/Time</td>
                  <td>Optional</td>
                  <td className="text-primary font-medium">Built-in (marketplace trust)</td>
                </tr>
                <tr className="border-t">
                  <td className="py-2">CVA variants</td>
                  <td>3 states</td>
                  <td className="text-primary font-medium">isPromoted only (simpler)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
