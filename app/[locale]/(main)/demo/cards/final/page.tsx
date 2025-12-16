"use client"

import { 
  MarketplaceStandardCard, 
  TrustFlagshipRefined, 
  VisualGridCard,
  FinalCardProps 
} from "@/components/final-cards"

// Sample Data
const carProduct: FinalCardProps = {
  id: "car-1",
  title: "Volkswagen Golf 7 2.0 TDI Highline · Full Service History",
  price: 18500,
  originalPrice: 19900,
  image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80",
  rating: 4.8,
  reviews: 124,
  seller: {
    name: "AutoPremium Sofia",
    verified: true,
    rating: 4.9,
    location: "Sofia, BG",
    avatar: "https://github.com/shadcn.png"
  },
  attributes: [
    { label: "Fuel", value: "Diesel" },
    { label: "Trans", value: "Automatic" },
    { label: "Year", value: "2016" },
    { label: "Km", value: "142,000 km" }
  ],
  badges: ["Warranty", "Leasing"],
  isBoosted: true,
  condition: "Used"
}

const techProduct: FinalCardProps = {
  id: "tech-1",
  title: "MacBook Pro 14 M3 Pro · 18GB RAM · 512GB SSD",
  price: 3899,
  originalPrice: 4299,
  image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=800&q=80",
  rating: 5.0,
  reviews: 42,
  seller: {
    name: "iStore Bulgaria",
    verified: true,
    rating: 5.0,
    location: "Plovdiv, BG",
    avatar: "https://github.com/vercel.png"
  },
  attributes: [
    { label: "Chip", value: "M3 Pro" },
    { label: "RAM", value: "18GB" },
    { label: "SSD", value: "512GB" }
  ],
  badges: ["In Stock"],
  shipping: "Free Shipping",
  condition: "New"
}

const fashionProduct: FinalCardProps = {
  id: "fashion-1",
  title: "Vintage Leather Biker Jacket · Handcrafted",
  price: 249,
  image: "https://images.unsplash.com/photo-1551028919-33f547589c20?w=800&q=80",
  rating: 4.7,
  reviews: 89,
  seller: {
    name: "Urban Vintage",
    verified: false,
    rating: 4.7,
    location: "Varna, BG",
    avatar: "https://github.com/nextjs.png"
  },
  attributes: [
    { label: "Size", value: "L" },
    { label: "Material", value: "Leather" }
  ],
  isBoosted: true,
  shipping: "+ 5.00 BGN",
  condition: "Used"
}

const industrialProduct: FinalCardProps = {
  id: "ind-1",
  title: "Industrial Steel Bolts M8x40mm (Box of 1000)",
  price: 145.50,
  image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
  rating: 4.9,
  reviews: 12,
  seller: {
    name: "MetalPro Ltd",
    verified: true,
    rating: 4.9,
    location: "Ruse, BG",
    avatar: "https://github.com/shadcn.png"
  },
  attributes: [
    { label: "Material", value: "Steel 8.8" },
    { label: "Size", value: "M8x40" }
  ],
  shipping: "Free Shipping",
  condition: "New"
}

export default function FinalCardsPage() {
  return (
    <div className="container py-12 space-y-20 max-w-7xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">The Final 3</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          The definitive card collection. Optimized for density, trust, and conversion.
        </p>
      </div>

      {/* 1. MARKETPLACE STANDARD */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="text-2xl font-bold">1. The Marketplace Standard</h2>
            <p className="text-muted-foreground">The "eBay Killer". High density, clear hierarchy, universal application.</p>
          </div>
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">RECOMMENDED</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <MarketplaceStandardCard {...techProduct} />
          <MarketplaceStandardCard {...fashionProduct} />
          <MarketplaceStandardCard {...industrialProduct} />
          <MarketplaceStandardCard {...carProduct} title="VW Golf 7 2.0 TDI" />
          <MarketplaceStandardCard {...techProduct} title="Sony WH-1000XM5" price={599} image="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80" />
        </div>
      </section>

      {/* 2. TRUST FLAGSHIP REFINED */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="text-2xl font-bold">2. The Trust Flagship (Refined)</h2>
            <p className="text-muted-foreground">For high-ticket items where seller credibility is paramount. Reduced motion.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TrustFlagshipRefined {...carProduct} />
          <TrustFlagshipRefined {...carProduct} title="Audi A4 Avant S-Line Quattro" price={22500} image="https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80" />
          <TrustFlagshipRefined {...carProduct} title="Mercedes C220d 4Matic" price={24000} image="https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80" />
        </div>
      </section>

      {/* 3. VISUAL GRID */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="text-2xl font-bold">3. The Visual Grid</h2>
            <p className="text-muted-foreground">For discovery-driven categories like Fashion, Art, and Decor.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <VisualGridCard {...fashionProduct} />
          <VisualGridCard {...fashionProduct} title="Ceramic Vase Hand Made" price={89} image="https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=800&q=80" />
          <VisualGridCard {...fashionProduct} title="Abstract Wall Art Print" price={129} image="https://images.unsplash.com/photo-1582560475093-d09bc3020944?w=800&q=80" />
          <VisualGridCard {...fashionProduct} title="Minimalist Desk Lamp" price={159} image="https://images.unsplash.com/photo-1507473888900-52e1adad5420?w=800&q=80" />
          <VisualGridCard {...fashionProduct} title="Velvet Armchair Green" price={499} image="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80" />
        </div>
      </section>
    </div>
  )
}
