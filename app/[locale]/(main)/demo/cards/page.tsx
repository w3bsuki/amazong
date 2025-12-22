"use client"

import { useState } from "react"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { ProductCard } from "@/components/shared/product/product-card"
import { cn } from "@/lib/utils"
import { 
  Heart, 
  MapPin,
  Clock,
  Star,
  ShoppingCart,
  Plus,
  Lightning,
  Eye,
  CheckCircle,
  Tag,
  ShieldCheck,
  TrendUp,
  Package,
  Storefront,
  Play,
} from "@phosphor-icons/react"

// Demo product data
const product = {
  title: "Volkswagen Golf 4 TDI 1.9",
  price: 3000,
  originalPrice: 3500,
  image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=80",
  location: "София",
  timeAgo: "2 часа",
  brand: "Volkswagen",
  year: "2003",
  rating: 4.7,
  reviews: 2847,
  seller: "AutoMoto BG",
  freeShipping: true,
}

// Final production card examples (category-aware meta + seller trust)
const finalCardProducts = [
  {
    id: "demo-1",
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
    id: "demo-2",
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
    id: "demo-3",
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
  {
    id: "demo-4",
    title: "Herman Miller Aeron · Size B · Fully Adjustable",
    price: 999,
    listPrice: 1299,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80",
    storeSlug: "officeworks",
    sellerName: "OfficeWorks",
    sellerVerified: true,
    tags: ["Ergonomic", "Refurb", "Invoice"],
    categorySlug: "home",
    brand: "Herman Miller",
    condition: "Refurbished",
    location: "Burgas",
    isBoosted: true,
  },
  {
    id: "demo-5",
    title: "Sony WH-1000XM5 · Noise Cancelling",
    price: 499,
    listPrice: 629,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1200&q=80",
    storeSlug: "soundlab",
    sellerName: "SoundLab",
    sellerVerified: false,
    tags: ["ANC", "Bluetooth", "Case"],
    categorySlug: "electronics",
    brand: "Sony",
    condition: "New",
    location: "Sofia",
    isBoosted: false,
  },
  {
    id: "demo-6",
    title: "Premium Listing Example (No Seller Shown)",
    price: 79,
    listPrice: 99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80",
    tags: ["Top pick", "Best value"],
    categorySlug: "accessories",
    brand: "Generic",
    condition: "New",
    location: "Ruse",
    isBoosted: false,
    hideSeller: true,
  },
] as const

const formatPrice = (p: number) => `${p.toLocaleString('bg-BG')} лв.`

export default function CardsDemoPage() {
  return (
    <div className="container py-8 space-y-16">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">5 World-Class Product Cards</h1>
        <p className="text-muted-foreground">Amazon · Target · eBay · Etsy · Vinted</p>
      </div>

      {/* 1. AMAZON */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-[#FF9900] text-black text-xs font-bold px-2 py-1 rounded">1</span>
          <h2 className="text-lg font-semibold">Amazon Style</h2>
          <span className="text-xs text-muted-foreground">Dense info, ratings, Prime badge, Add to Cart</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[1,2,3,4,5,6].map(i => <AmazonCard key={i} />)}
        </div>
      </section>

      {/* 2. TARGET */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-[#CC0000] text-white text-xs font-bold px-2 py-1 rounded">2</span>
          <h2 className="text-lg font-semibold">Target Style</h2>
          <span className="text-xs text-muted-foreground">Modern, clean, circle add button, red accents</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[1,2,3,4,5,6].map(i => <TargetCard key={i} />)}
        </div>
      </section>

      {/* 3. EBAY */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-[#0064D2] text-white text-xs font-bold px-2 py-1 rounded">3</span>
          <h2 className="text-lg font-semibold">eBay Style</h2>
          <span className="text-xs text-muted-foreground">Minimal, price focus, seller info, Buy It Now</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[1,2,3,4,5,6].map(i => <EbayCard key={i} />)}
        </div>
      </section>

      {/* 4. ETSY */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-[#F56400] text-white text-xs font-bold px-2 py-1 rounded">4</span>
          <h2 className="text-lg font-semibold">Etsy Style</h2>
          <span className="text-xs text-muted-foreground">Artsy, hover actions, seller name, favorites</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[1,2,3,4,5,6].map(i => <EtsyCard key={i} />)}
        </div>
      </section>

      {/* 5. VINTED */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-[#09B1BA] text-white text-xs font-bold px-2 py-1 rounded">5</span>
          <h2 className="text-lg font-semibold">Vinted Style</h2>
          <span className="text-xs text-muted-foreground">Ultra minimal, no cart, location/time, C2C focused</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[1,2,3,4,5,6].map(i => <VintedCard key={i} />)}
        </div>
      </section>

      {/* 6. NEO-SWISS */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-black text-white text-xs font-bold px-2 py-1 rounded">6</span>
          <h2 className="text-lg font-semibold">Neo-Swiss</h2>
          <span className="text-xs text-muted-foreground">Grid-based, 1px borders, strict typography, no shadows</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[1,2,3,4,5,6].map(i => <ModernMinimalistCard key={i} />)}
        </div>
      </section>

      {/* 7. CREATOR COMMERCE */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded">7</span>
          <h2 className="text-lg font-semibold">Creator Commerce</h2>
          <span className="text-xs text-muted-foreground">Full bleed, immersive, clean overlays, video-first feel</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[1,2,3,4,5,6].map(i => <SocialCommerceCard key={i} />)}
        </div>
      </section>

      {/* 8. PRO SUPPLY */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-blue-800 text-white text-xs font-bold px-2 py-1 rounded">8</span>
          <h2 className="text-lg font-semibold">Pro Supply</h2>
          <span className="text-xs text-muted-foreground">Data dense, table-like structure, high information density</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[1,2,3,4,5,6].map(i => <B2BCard key={i} />)}
        </div>
      </section>

      {/* 9. ATELIER */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-stone-800 text-white text-xs font-bold px-2 py-1 rounded">9</span>
          <h2 className="text-lg font-semibold">Atelier</h2>
          <span className="text-xs text-muted-foreground">Editorial, serif fonts, minimal UI, image focus</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[1,2,3,4,5,6].map(i => <LuxuryCard key={i} />)}
        </div>
      </section>

      {/* 10. SPEC SHEET */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded">10</span>
          <h2 className="text-lg font-semibold">Spec Sheet</h2>
          <span className="text-xs text-muted-foreground">Technical, organized, functional, clear hierarchy</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[1,2,3,4,5,6].map(i => <TechCard key={i} />)}
        </div>
      </section>

      {/* 11. DESKTOP FLAGSHIP (BEST) */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-foreground text-background text-xs font-bold px-2 py-1 rounded">11</span>
          <h2 className="text-lg font-semibold">Desktop Flagship (Best)</h2>
          <span className="text-xs text-muted-foreground">Wide layout, seller trust, clear CTAs</span>
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          {[1,2].map(i => <DesktopFlagshipCard key={i} />)}
        </div>
      </section>

      {/* 12. MEDIA + VARIANTS */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-foreground text-background text-xs font-bold px-2 py-1 rounded">12</span>
          <h2 className="text-lg font-semibold">Media + Variants</h2>
          <span className="text-xs text-muted-foreground">Desktop hover actions, variant chips, seller header</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[1,2,3,4,5,6].map(i => <VariantGalleryCard key={i} />)}
        </div>
      </section>

      {/* 13. DEAL STACK */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-foreground text-background text-xs font-bold px-2 py-1 rounded">13</span>
          <h2 className="text-lg font-semibold">Deal Stack</h2>
          <span className="text-xs text-muted-foreground">Deal badges, scarcity meter, fast-add footer</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[1,2,3,4,5,6].map(i => <DealStackCard key={i} />)}
        </div>
      </section>

      {/* 14. SELLER-FIRST TRUST */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-foreground text-background text-xs font-bold px-2 py-1 rounded">14</span>
          <h2 className="text-lg font-semibold">Seller-First Trust</h2>
          <span className="text-xs text-muted-foreground">Marketplace credibility, verified seller, clean hierarchy</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {/* Base */}
          {[1,2].map((i) => <SellerTrustCard key={`trust-base-${i}`} />)}
          {/* Trust + quick-add (conversion) */}
          {[1,2].map((i) => <SellerTrustQuickAddCard key={`trust-quickadd-${i}`} />)}
          {/* Trust + deal emphasis */}
          {[1,2].map((i) => <SellerTrustDealCard key={`trust-deal-${i}`} />)}
        </div>
      </section>

      {/* 15. MINIMAL (NO SELLER) */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-foreground text-background text-xs font-bold px-2 py-1 rounded">15</span>
          <h2 className="text-lg font-semibold">Minimal (No Seller)</h2>
          <span className="text-xs text-muted-foreground">Pure product focus, price + rating + one CTA</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[1,2,3,4,5,6].map(i => <MinimalNoSellerCard key={i} />)}
        </div>
      </section>

      {/* 16. FINAL PRODUCTION CARD (REAL APP COMPONENT) */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-foreground text-background text-xs font-bold px-2 py-1 rounded">16</span>
          <h2 className="text-lg font-semibold">Final Production Card</h2>
          <span className="text-xs text-muted-foreground">Single universal card + small variants (promoted badge, seller row, meta line)</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 xl:gap-4">
          {finalCardProducts.map((p, index) => (
            <ProductCard
              key={p.id}
              id={p.id}
              title={p.title}
              price={p.price}
              listPrice={p.listPrice}
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
      </section>

      {/* 17. FEATURED PRODUCTION (RECOMMENDED) */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-foreground text-background text-xs font-bold px-2 py-1 rounded">17</span>
          <h2 className="text-lg font-semibold">Featured Production (Recommended)</h2>
          <span className="text-xs text-muted-foreground">Seller-first header + tighter body + cleaner CTA</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 xl:gap-4">
          {finalCardProducts.map((p, index) => (
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
      </section>

      {/* Comparison */}
      <section className="bg-muted/30 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold">Which one fits your marketplace?</h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-3 text-sm">
          <div className="bg-card rounded-lg p-3 border">
            <div className="font-semibold text-[#FF9900] mb-1">Amazon</div>
            <p className="text-xs text-muted-foreground">High-volume retail. Info-dense. Conversion-focused.</p>
          </div>
          <div className="bg-card rounded-lg p-3 border">
            <div className="font-semibold text-[#CC0000] mb-1">Target</div>
            <p className="text-xs text-muted-foreground">Modern retail. Clean UX. Premium feel.</p>
          </div>
          <div className="bg-card rounded-lg p-3 border">
            <div className="font-semibold text-[#0064D2] mb-1">eBay</div>
            <p className="text-xs text-muted-foreground">Auction/marketplace. Seller trust. Price focus.</p>
          </div>
          <div className="bg-card rounded-lg p-3 border">
            <div className="font-semibold text-[#F56400] mb-1">Etsy</div>
            <p className="text-xs text-muted-foreground">Artisan/unique. Discovery. Community feel.</p>
          </div>
          <div className="bg-card rounded-lg p-3 border">
            <div className="font-semibold text-[#09B1BA] mb-1">Vinted</div>
            <p className="text-xs text-muted-foreground">C2C marketplace. Ultra minimal. Fast browse.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

// =============================================================================
// 1. AMAZON - Dense, ratings, Prime badge, Add to Cart
// =============================================================================
function AmazonCard() {
  const [wishlisted, setWishlisted] = useState(false)
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
  
  return (
    <div className="group cursor-pointer bg-card rounded-lg border border-border hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative p-2 pb-0">
        <AspectRatio ratio={1} className="bg-white rounded">
          <img src={product.image} alt={product.title} className="object-contain size-full p-2" />
        </AspectRatio>
        
        {/* Wishlist */}
        <button 
          onClick={(e) => { e.stopPropagation(); setWishlisted(!wishlisted) }}
          className="absolute top-3 right-3 size-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50"
        >
          <Heart size={14} weight={wishlisted ? "fill" : "regular"} className={wishlisted ? "text-red-500" : "text-gray-500"} />
        </button>
        
        {/* Prime badge */}
        {product.freeShipping && (
          <div className="absolute bottom-1 left-3 bg-[#232F3E] text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
            <Lightning size={10} weight="fill" className="text-[#FF9900]" />
            Prime
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-2.5 pt-2 space-y-1">
        {/* Title */}
        <h3 className="text-sm text-foreground line-clamp-2 leading-snug group-hover:text-[#C45500] transition-colors">
          {product.title} {product.year} - Premium качество
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex">
            {[1,2,3,4,5].map(i => (
              <Star key={i} size={12} weight="fill" className={i <= Math.floor(product.rating) ? "text-[#FF9900]" : "text-gray-300"} />
            ))}
          </div>
          <span className="text-xs text-[#007185]">{product.reviews.toLocaleString()}</span>
        </div>
        
        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-foreground">{formatPrice(product.price)}</span>
          <span className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
          <span className="text-xs text-[#CC0C39] font-medium">-{discount}%</span>
        </div>
        
        {/* Add to Cart */}
        <button className="w-full mt-1 py-1.5 bg-[#FFD814] hover:bg-[#F7CA00] text-sm font-medium text-[#0F1111] rounded-full border border-[#FCD200] transition-colors">
          Add to Cart
        </button>
      </div>
    </div>
  )
}

// =============================================================================
// 2. TARGET - Modern, circle add button, red accents
// =============================================================================
function TargetCard() {
  const [wishlisted, setWishlisted] = useState(false)
  const [inCart, setInCart] = useState(false)
  
  return (
    <div className="group cursor-pointer">
      {/* Image */}
      <div className="relative rounded-lg overflow-hidden bg-gray-100">
        <AspectRatio ratio={1}>
          <img src={product.image} alt={product.title} className="object-cover size-full group-hover:scale-105 transition-transform duration-300" />
        </AspectRatio>
        
        {/* Wishlist - top right */}
        <button 
          onClick={(e) => { e.stopPropagation(); setWishlisted(!wishlisted) }}
          className={cn(
            "absolute top-2 right-2 size-8 rounded-full flex items-center justify-center transition-all",
            "bg-white shadow-sm hover:shadow-md",
            wishlisted && "bg-red-50"
          )}
        >
          <Heart size={16} weight={wishlisted ? "fill" : "regular"} className={wishlisted ? "text-[#CC0000]" : "text-gray-600"} />
        </button>
        
        {/* Add to cart circle - bottom right */}
        <button 
          onClick={(e) => { e.stopPropagation(); setInCart(!inCart) }}
          className={cn(
            "absolute bottom-2 right-2 size-9 rounded-full flex items-center justify-center transition-all shadow-md",
            inCart 
              ? "bg-[#CC0000] text-white" 
              : "bg-white text-[#CC0000] hover:bg-[#CC0000] hover:text-white"
          )}
        >
          {inCart ? <ShoppingCart size={18} weight="fill" /> : <Plus size={18} weight="bold" />}
        </button>
        
        {/* Sale badge */}
        <div className="absolute top-2 left-2 bg-[#CC0000] text-white text-xs font-bold px-2 py-0.5 rounded">
          Sale
        </div>
      </div>
      
      {/* Content */}
      <div className="pt-2.5 space-y-0.5">
        {/* Brand */}
        <p className="text-xs text-muted-foreground">{product.brand}</p>
        
        {/* Title */}
        <h3 className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
          {product.title}
        </h3>
        
        {/* Price */}
        <div className="flex items-baseline gap-1.5 pt-0.5">
          <span className="text-base font-bold text-[#CC0000]">{formatPrice(product.price)}</span>
          <span className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
        </div>
        
        {/* Rating */}
        <div className="flex items-center gap-1 pt-0.5">
          <div className="flex">
            {[1,2,3,4,5].map(i => (
              <Star key={i} size={10} weight="fill" className={i <= Math.floor(product.rating) ? "text-[#CC0000]" : "text-gray-300"} />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">{product.reviews}</span>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// 3. EBAY - Minimal, price focus, seller info
// =============================================================================
function EbayCard() {
  const [watching, setWatching] = useState(false)
  
  return (
    <div className="group cursor-pointer">
      {/* Image */}
      <div className="relative rounded-md overflow-hidden border border-gray-200 hover:border-[#0064D2] transition-colors">
        <AspectRatio ratio={1}>
          <img src={product.image} alt={product.title} className="object-cover size-full" />
        </AspectRatio>
        
        {/* Watch button */}
        <button 
          onClick={(e) => { e.stopPropagation(); setWatching(!watching) }}
          className={cn(
            "absolute top-1.5 right-1.5 size-7 rounded-full flex items-center justify-center transition-all",
            watching ? "bg-[#0064D2] text-white" : "bg-white/90 text-gray-600 hover:text-[#0064D2]"
          )}
        >
          <Eye size={14} weight={watching ? "fill" : "regular"} />
        </button>
      </div>
      
      {/* Content */}
      <div className="pt-2 space-y-0.5">
        {/* Title */}
        <h3 className="text-sm text-foreground line-clamp-2 leading-snug group-hover:underline">
          {product.title} {product.year}
        </h3>
        
        {/* Price */}
        <p className="text-base font-bold text-foreground">
          {formatPrice(product.price)}
        </p>
        
        {/* Shipping */}
        <p className="text-xs text-emerald-600 font-medium">
          Free shipping
        </p>
        
        {/* Seller */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>{product.seller}</span>
          <span>·</span>
          <span className="text-[#0064D2]">98.5%</span>
        </div>
        
        {/* Buy Now link */}
        <button className="text-xs font-semibold text-[#0064D2] hover:underline pt-0.5">
          Buy It Now
        </button>
      </div>
    </div>
  )
}

// =============================================================================
// 4. ETSY - Artsy, hover actions, shop name
// =============================================================================
function EtsyCard() {
  const [favorited, setFavorited] = useState(false)
  
  return (
    <div className="group cursor-pointer">
      {/* Image with hover overlay */}
      <div className="relative rounded-xl overflow-hidden">
        <AspectRatio ratio={4/5}>
          <img src={product.image} alt={product.title} className="object-cover size-full" />
        </AspectRatio>
        
        {/* Hover gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Favorite button - appears on hover or when active */}
        <button 
          onClick={(e) => { e.stopPropagation(); setFavorited(!favorited) }}
          className={cn(
            "absolute top-2 right-2 size-9 rounded-full flex items-center justify-center transition-all",
            "shadow-md",
            favorited 
              ? "bg-[#F56400] text-white opacity-100" 
              : "bg-white text-gray-700 opacity-0 group-hover:opacity-100 hover:text-[#F56400]"
          )}
        >
          <Heart size={18} weight={favorited ? "fill" : "regular"} />
        </button>
        
        {/* Quick add - appears on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-all">
          <button className="w-full py-2 bg-white/95 hover:bg-white text-sm font-medium text-foreground rounded-lg shadow-lg transition-colors">
            Add to cart
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="pt-2 space-y-0.5">
        {/* Shop name */}
        <p className="text-xs text-muted-foreground">{product.seller}</p>
        
        {/* Title */}
        <h3 className="text-sm text-foreground line-clamp-2 leading-snug">
          {product.title}
        </h3>
        
        {/* Price */}
        <p className="text-sm font-semibold text-foreground">
          {formatPrice(product.price)}
        </p>
        
        {/* Rating + favorites */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-0.5 text-foreground">
            <Star size={12} weight="fill" className="text-[#F56400]" />
            <span>{product.rating}</span>
            <span className="text-muted-foreground">({product.reviews})</span>
          </div>
        </div>
        
        {/* Free shipping badge */}
        {product.freeShipping && (
          <p className="text-xs text-emerald-600 font-medium">FREE shipping</p>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// 5. VINTED - Ultra minimal, C2C, location/time
// =============================================================================
function VintedCard() {
  const [favorited, setFavorited] = useState(false)
  
  return (
    <div className="group cursor-pointer">
      {/* Image */}
      <div className="relative rounded-lg overflow-hidden">
        <AspectRatio ratio={3/4}>
          <img src={product.image} alt={product.title} className="object-cover size-full" />
        </AspectRatio>
        
        {/* Favorite */}
        <button 
          onClick={(e) => { e.stopPropagation(); setFavorited(!favorited) }}
          className="absolute top-2 right-2 size-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
        >
          <Heart size={16} weight={favorited ? "fill" : "regular"} className={favorited ? "text-[#09B1BA]" : "text-gray-600"} />
        </button>
      </div>
      
      {/* Content - ultra simple */}
      <div className="pt-2 space-y-0.5">
        {/* Price - prominent */}
        <p className="text-base font-bold text-foreground">
          {formatPrice(product.price)}
        </p>
        
        {/* Brand + Size */}
        <p className="text-xs text-muted-foreground">
          {product.brand} · {product.year}
        </p>
        
        {/* Location + Time */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-0.5">
            <MapPin size={10} />
            {product.location}
          </span>
          <span className="flex items-center gap-0.5">
            <Clock size={10} />
            {product.timeAgo}
          </span>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// 6. NEO-SWISS - Clean, grid-based, 1px borders
// =============================================================================
function ModernMinimalistCard() {
  return (
    <div className="group cursor-pointer border border-gray-200 bg-white hover:border-gray-400 transition-colors duration-200">
      {/* Image container - pure white, no rounded corners */}
      <div className="relative aspect-4/5 bg-white border-b border-gray-100">
        <img 
          src={product.image} 
          alt={product.title} 
          className="object-contain w-full h-full p-8 group-hover:scale-105 transition-transform duration-300 ease-out" 
        />
        
        {/* Badge - text only, no background */}
        <span className="absolute top-3 left-3 text-[10px] font-bold tracking-widest uppercase text-black">
          New
        </span>
      </div>

      {/* Content - strict grid alignment */}
      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{product.brand}</p>
          <h3 className="font-medium text-sm text-gray-900 leading-snug line-clamp-2">
            {product.title}
          </h3>
        </div>
        
        <div className="flex justify-between items-end pt-2 border-t border-gray-100">
          <span className="font-semibold text-sm text-gray-900">
            {formatPrice(product.price)}
          </span>
          <button className="text-xs font-medium text-gray-900 underline decoration-gray-300 hover:decoration-gray-900 underline-offset-4 transition-all">
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// 7. CREATOR COMMERCE - Refined Social Style
// =============================================================================
function SocialCommerceCard() {
  return (
    <div className="group cursor-pointer relative aspect-3/4 rounded-2xl overflow-hidden bg-gray-100 isolate">
      {/* Full bleed image */}
      <img 
        src={product.image} 
        alt={product.title} 
        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" 
      />
      
      {/* Subtle gradient - only at bottom for text readability */}
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0" />

      {/* Top: Creator pill */}
      <div className="absolute top-3 left-3 flex items-center gap-2 bg-white/90 backdrop-blur-sm pl-1 pr-3 py-1 rounded-full shadow-sm">
        <div className="size-5 rounded-full bg-gray-200 overflow-hidden">
          <img src="https://github.com/shadcn.png" alt="Creator avatar" className="w-full h-full" />
        </div>
        <span className="text-[10px] font-semibold text-gray-900">@automoto</span>
      </div>

      {/* Bottom: Clean actions */}
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-white line-clamp-1 text-shadow-sm">{product.title}</h3>
          <p className="text-lg font-bold text-white text-shadow-sm">{formatPrice(product.price)}</p>
        </div>
        
        <button className="w-full py-2.5 bg-white text-black text-xs font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-lg">
          Shop Now <TrendUp weight="bold" className="size-3.5" />
        </button>
      </div>
    </div>
  )
}

// =============================================================================
// 8. PRO SUPPLY - Data dense, table-like
// =============================================================================
function B2BCard() {
  return (
    <div className="group cursor-pointer border border-gray-200 bg-white hover:border-gray-300 transition-colors">
      <div className="flex p-3 gap-4">
        {/* Image - small, functional */}
        <div className="w-20 h-20 shrink-0 bg-gray-50 border border-gray-100">
          <img src={product.image} alt={product.title} className="w-full h-full object-contain p-2 mix-blend-multiply" />
        </div>

        {/* Content - structured */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                {product.title}
              </h3>
              <span className="shrink-0 text-[10px] font-medium bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                SKU: 8492
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Min. Order: 100 units</p>
          </div>

          <div className="flex items-end justify-between mt-2">
            <div>
              <p className="text-sm font-bold text-gray-900">{formatPrice(product.price * 0.8)}</p>
              <p className="text-[10px] text-gray-500">per unit (excl. VAT)</p>
            </div>
            <button className="text-xs font-medium text-blue-600 border border-blue-200 bg-blue-50 px-3 py-1.5 rounded hover:bg-blue-100 transition-colors">
              Request Quote
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer specs */}
      <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 flex items-center gap-4 text-[10px] text-gray-600">
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={12} className="text-gray-400" /> Verified
        </span>
        <span className="flex items-center gap-1.5">
          <Package size={12} className="text-gray-400" /> In Stock
        </span>
        <span className="flex items-center gap-1.5 ml-auto text-gray-400">
          CN Supplier
        </span>
      </div>
    </div>
  )
}

// =============================================================================
// 9. ATELIER - Luxury, serif, minimal
// =============================================================================
function LuxuryCard() {
  return (
    <div className="group cursor-pointer space-y-4">
      <div className="relative aspect-3/4 bg-[#F0F0F0] overflow-hidden">
        <img 
          src={product.image} 
          alt={product.title}
          className="w-full h-full object-cover mix-blend-multiply" 
        />
        
        {/* Hover Action - Instant, no slide */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <button className="bg-white text-black text-xs font-medium px-6 py-2.5 min-w-[120px] hover:bg-black hover:text-white transition-colors">
            QUICK VIEW
          </button>
        </div>
      </div>

      <div className="text-center space-y-1.5">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900">
          {product.brand}
        </h3>
        <p className="text-sm text-gray-600 font-serif italic">
          {product.title}
        </p>
        <p className="text-sm font-medium text-gray-900">
          {formatPrice(product.price)}
        </p>
      </div>
    </div>
  )
}

// =============================================================================
// 10. SPEC SHEET - Tech, organized, dense
// =============================================================================
function TechCard() {
  return (
    <div className="group cursor-pointer bg-white border border-gray-200 hover:border-blue-500 transition-colors duration-200">
      {/* Header */}
      <div className="p-3 border-b border-gray-100 flex justify-between items-start">
        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
          BEST SELLER
        </span>
        <button className="text-gray-400 hover:text-blue-600 transition-colors">
          <Heart size={16} />
        </button>
      </div>

      {/* Image */}
      <div className="aspect-square p-4">
        <img src={product.image} alt={product.title} className="w-full h-full object-contain" />
      </div>

      {/* Content */}
      <div className="p-3 pt-0 space-y-3">
        <h3 className="text-xs font-medium text-gray-900 leading-relaxed line-clamp-2 h-8">
          {product.title} - {product.year} Edition
        </h3>

        {/* Mini Specs Grid */}
        <div className="grid grid-cols-2 gap-1 text-[10px] text-gray-500">
          <div className="bg-gray-50 px-1.5 py-1 rounded">1.9L TDI</div>
          <div className="bg-gray-50 px-1.5 py-1 rounded">Manual</div>
          <div className="bg-gray-50 px-1.5 py-1 rounded">Diesel</div>
          <div className="bg-gray-50 px-1.5 py-1 rounded">2003</div>
        </div>

        {/* Price & Action */}
        <div className="pt-2 flex items-center justify-between gap-2">
          <div>
            <p className="text-sm font-bold text-gray-900">{formatPrice(product.price)}</p>
            <p className="text-[10px] text-gray-400 line-through">{formatPrice(product.originalPrice)}</p>
          </div>
          <button className="size-8 flex items-center justify-center bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            <Plus weight="bold" />
          </button>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// 11. DESKTOP FLAGSHIP (BEST) - Wide, trust + actions, optimized for desktop
// =============================================================================
function DesktopFlagshipCard() {
  const [wishlisted, setWishlisted] = useState(false)
  const [inCart, setInCart] = useState(false)
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

  return (
    <div className="group relative grid grid-cols-[220px_1fr] overflow-hidden rounded-xl border bg-card">
      {/* Media */}
      <div className="relative border-r bg-muted/20">
        <AspectRatio ratio={1} className="h-full">
          <img src={product.image} alt={product.title} className="size-full object-cover" />
        </AspectRatio>

        <button
          onClick={(e) => {
            e.stopPropagation()
            setWishlisted(!wishlisted)
          }}
          className={cn(
            "absolute top-3 right-3 size-9 rounded-full border bg-background/90 backdrop-blur-sm flex items-center justify-center transition-colors",
            wishlisted ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={18} weight={wishlisted ? "fill" : "regular"} />
        </button>

        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full border bg-background/90 px-2.5 py-1 text-[10px] font-semibold text-foreground">
          <Tag size={12} className="text-muted-foreground" />
          Save {discount}%
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        {/* Seller line */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="size-9 rounded-full border bg-muted/30 flex items-center justify-center overflow-hidden">
              <img src="https://github.com/shadcn.png" alt="Seller avatar" className="size-full object-cover" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-foreground truncate">{product.seller}</span>
                <CheckCircle size={14} weight="fill" className="text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground truncate">Official store · Ships from {product.location}</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground shrink-0">
            <span className="flex items-center gap-1">
              <ShieldCheck size={14} className="text-muted-foreground" /> Verified
            </span>
            <span className="flex items-center gap-1">
              <Star size={14} weight="fill" className="text-muted-foreground" /> {product.rating}
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-foreground leading-snug line-clamp-2">
            {product.title} {product.year}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {product.brand} · Warranty included · Desktop-optimized dense layout
          </p>
        </div>

        {/* Price row */}
        <div className="flex items-end justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">{formatPrice(product.price)}</span>
              <span className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Package size={12} className="text-muted-foreground" /> In stock
              </span>
              <span className="flex items-center gap-1">
                <Lightning size={12} className="text-muted-foreground" /> Fast delivery
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setInCart(!inCart)
              }}
              className={cn(
                "h-10 px-4 rounded-lg text-sm font-semibold border transition-colors flex items-center gap-2",
                inCart
                  ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                  : "bg-foreground text-background border-foreground hover:bg-foreground/90"
              )}
            >
              <ShoppingCart size={16} weight={inCart ? "fill" : "regular"} />
              {inCart ? "Added" : "Add to cart"}
            </button>
            <button className="h-10 px-4 rounded-lg border bg-background text-foreground text-sm font-medium hover:bg-muted/40 transition-colors flex items-center gap-2">
              <Play size={16} /> Quick view
            </button>
          </div>
        </div>

        {/* Mobile action fallback */}
        <div className="sm:hidden flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setInCart(!inCart)
            }}
            className={cn(
              "flex-1 h-10 rounded-lg text-sm font-semibold border transition-colors flex items-center justify-center gap-2",
              inCart
                ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                : "bg-foreground text-background border-foreground hover:bg-foreground/90"
            )}
          >
            <ShoppingCart size={16} weight={inCart ? "fill" : "regular"} />
            {inCart ? "Added" : "Add"}
          </button>
          <button className="h-10 px-3 rounded-lg border bg-background text-foreground text-sm font-medium hover:bg-muted/40 transition-colors">
            <Play size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// 12. MEDIA + VARIANTS - Desktop hover, variants, seller header
// =============================================================================
function VariantGalleryCard() {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="group cursor-pointer rounded-xl border bg-card overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative">
        <AspectRatio ratio={1} className="bg-muted/20">
          <img src={product.image} alt={product.title} className="size-full object-cover" />
        </AspectRatio>

        <div
          className={cn(
            "absolute inset-x-0 bottom-0 p-2 transition-all",
            hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          )}
        >
          <div className="grid grid-cols-2 gap-2">
            <button className="h-9 rounded-lg border bg-background text-foreground text-xs font-semibold hover:bg-muted/40 transition-colors">
              Quick view
            </button>
            <button className="h-9 rounded-lg border bg-foreground text-background text-xs font-semibold hover:bg-foreground/90 transition-colors">
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="size-7 rounded-full border bg-muted/30 flex items-center justify-center overflow-hidden">
              <Storefront size={14} className="text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground truncate">{product.seller} · Pro seller</p>
          </div>
          <span className="text-[10px] font-semibold text-muted-foreground border rounded-full px-2 py-0.5">Free returns</span>
        </div>

        <h3 className="text-sm font-medium text-foreground leading-snug line-clamp-2">{product.title}</h3>

        <div className="flex items-baseline justify-between gap-2">
          <p className="text-base font-bold text-foreground">{formatPrice(product.price)}</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star size={12} weight="fill" className="text-muted-foreground" />
            <span>{product.rating}</span>
            <span className="opacity-70">({product.reviews.toLocaleString()})</span>
          </div>
        </div>

        {/* Variants */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {[
            { label: "Diesel", active: true },
            { label: "Petrol", active: false },
            { label: "Hybrid", active: false },
          ].map((v) => (
            <span
              key={v.label}
              className={cn(
                "text-[10px] px-2 py-1 rounded-full border",
                v.active ? "bg-foreground text-background border-foreground" : "bg-background text-muted-foreground hover:text-foreground"
              )}
            >
              {v.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// 13. DEAL STACK - Deal badges + scarcity + fast add
// =============================================================================
function DealStackCard() {
  const [wishlisted, setWishlisted] = useState(false)
  const stockLeft = 7
  const stockTotal = 40
  const stockPct = Math.max(6, Math.round((stockLeft / stockTotal) * 100))

  return (
    <div className="group cursor-pointer rounded-xl border bg-card overflow-hidden">
      <div className="relative">
        <AspectRatio ratio={1} className="bg-muted/20">
          <img src={product.image} alt={product.title} className="size-full object-cover" />
        </AspectRatio>

        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className="text-[10px] font-bold border bg-background/90 backdrop-blur-sm rounded px-2 py-1">Limited</span>
          <span className="text-[10px] font-bold border bg-background/90 backdrop-blur-sm rounded px-2 py-1">-{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            setWishlisted(!wishlisted)
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
        <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug">{product.title}</h3>

        <div className="flex items-baseline justify-between gap-2">
          <p className="text-base font-bold text-foreground">{formatPrice(product.price)}</p>
          <p className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</p>
        </div>

        {/* Scarcity */}
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
            <p className="text-xs text-muted-foreground truncate">{product.seller}</p>
          </div>
          <button className="h-9 px-3 rounded-lg border bg-foreground text-background text-xs font-semibold hover:bg-foreground/90 transition-colors flex items-center gap-2">
            <Plus weight="bold" className="size-3.5" /> Add
          </button>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// 14. SELLER-FIRST TRUST - Seller credibility first, then product
// =============================================================================
function SellerTrustCard() {
  return (
    <div className="group cursor-pointer rounded-xl border bg-card overflow-hidden">
      {/* Seller header */}
      <div className="p-3 border-b bg-muted/20 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="size-8 rounded-full border bg-background flex items-center justify-center overflow-hidden">
            <img src="https://github.com/shadcn.png" alt="Seller avatar" className="size-full object-cover" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-foreground truncate">{product.seller}</span>
              <ShieldCheck size={14} weight="fill" className="text-primary" />
            </div>
            <p className="text-[10px] text-muted-foreground truncate">Top-rated seller · 24h dispatch</p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
          <Star size={12} weight="fill" className="text-muted-foreground" />
          <span>{product.rating}</span>
        </div>
      </div>

      {/* Product */}
      <div className="p-3 space-y-2">
        <div className="rounded-lg overflow-hidden border bg-muted/10">
          <AspectRatio ratio={1}>
            <img src={product.image} alt={product.title} className="size-full object-cover" />
          </AspectRatio>
        </div>

        <h3 className="text-sm font-medium text-foreground leading-snug line-clamp-2">{product.title}</h3>

        <div className="flex items-end justify-between gap-2">
          <div className="space-y-0.5">
            <p className="text-base font-bold text-foreground">{formatPrice(product.price)}</p>
            <p className="text-[10px] text-muted-foreground">Includes buyer protection</p>
          </div>
          <button className="h-9 px-3 rounded-lg border bg-background text-foreground text-xs font-semibold hover:bg-muted/40 transition-colors inline-flex items-center gap-2">
            <Eye size={14} className="text-muted-foreground" />
            Message seller
          </button>
        </div>
      </div>
    </div>
  )
}

function SellerTrustQuickAddCard() {
  const [inCart, setInCart] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)

  return (
    <div className="group cursor-pointer rounded-xl border bg-card overflow-hidden">
      {/* Seller header */}
      <div className="p-3 border-b bg-muted/20 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="size-8 rounded-full border bg-background flex items-center justify-center overflow-hidden">
            <img src="https://github.com/shadcn.png" alt="Seller avatar" className="size-full object-cover" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-foreground truncate">{product.seller}</span>
              <ShieldCheck size={14} weight="fill" className="text-primary" />
            </div>
            <p className="text-[10px] text-muted-foreground truncate">Top-rated seller · Buyer protection</p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            setWishlisted(!wishlisted)
          }}
          className={cn(
            "size-8 rounded-full border bg-background/90 backdrop-blur-sm flex items-center justify-center transition-colors",
            wishlisted ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={16} weight={wishlisted ? "fill" : "regular"} />
        </button>
      </div>

      {/* Product */}
      <div className="p-3 space-y-2">
        <div className="relative rounded-lg overflow-hidden border bg-muted/10">
          <AspectRatio ratio={1}>
            <img src={product.image} alt={product.title} className="size-full object-cover" />
          </AspectRatio>

          {/* Desktop hover quick-add */}
          <div className="absolute inset-x-0 bottom-0 p-2 hidden md:block opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setInCart(true)
              }}
              className="w-full h-9 rounded-lg border bg-foreground text-background text-xs font-semibold hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart size={14} weight={inCart ? "fill" : "regular"} />
              {inCart ? "Added" : "Add to cart"}
            </button>
          </div>
        </div>

        <h3 className="text-sm font-medium text-foreground leading-snug line-clamp-2">{product.title}</h3>

        <div className="flex items-end justify-between gap-2">
          <div className="space-y-0.5">
            <p className="text-base font-bold text-foreground">{formatPrice(product.price)}</p>
            <p className="text-[10px] text-muted-foreground">Ships from {product.location}</p>
          </div>

          {/* Mobile conversion CTA */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setInCart(!inCart)
            }}
            className={cn(
              "h-9 px-3 rounded-lg border text-xs font-semibold transition-colors flex items-center gap-2",
              inCart
                ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                : "bg-foreground text-background border-foreground hover:bg-foreground/90"
            )}
          >
            <ShoppingCart size={14} weight={inCart ? "fill" : "regular"} />
            {inCart ? "Added" : "Add"}
          </button>
        </div>
      </div>
    </div>
  )
}

function SellerTrustDealCard() {
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

  return (
    <div className="group cursor-pointer rounded-xl border bg-card overflow-hidden">
      {/* Seller header */}
      <div className="p-3 border-b bg-muted/20 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="size-8 rounded-full border bg-background flex items-center justify-center overflow-hidden">
            <img src="https://github.com/shadcn.png" alt="Seller avatar" className="size-full object-cover" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-foreground truncate">{product.seller}</span>
              <ShieldCheck size={14} weight="fill" className="text-primary" />
            </div>
            <p className="text-[10px] text-muted-foreground truncate">Verified seller · Limited-time deal</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-semibold border bg-background/90 backdrop-blur-sm rounded px-2 py-1">
            -{discount}%
          </span>
        </div>
      </div>

      {/* Product */}
      <div className="p-3 space-y-2">
        <div className="rounded-lg overflow-hidden border bg-muted/10">
          <AspectRatio ratio={1}>
            <img src={product.image} alt={product.title} className="size-full object-cover" />
          </AspectRatio>
        </div>

        <h3 className="text-sm font-medium text-foreground leading-snug line-clamp-2">{product.title}</h3>

        <div className="flex items-end justify-between gap-2">
          <div className="space-y-0.5">
            <div className="flex items-baseline gap-2">
              <p className="text-base font-bold text-foreground">{formatPrice(product.price)}</p>
              <p className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</p>
            </div>
            <p className="text-[10px] text-muted-foreground">Buyer protection included</p>
          </div>
          <button className="h-9 px-3 rounded-lg border bg-background text-foreground text-xs font-semibold hover:bg-muted/40 transition-colors">
            View deal
          </button>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// 15. MINIMAL (NO SELLER) - No seller info, product-first
// =============================================================================
function MinimalNoSellerCard() {
  const [inCart, setInCart] = useState(false)

  return (
    <div className="group cursor-pointer rounded-xl border bg-card overflow-hidden">
      <div className="relative">
        <AspectRatio ratio={1} className="bg-muted/20">
          <img src={product.image} alt={product.title} className="size-full object-cover" />
        </AspectRatio>
        <div className="absolute bottom-2 left-2 right-2">
          <div className="flex items-center justify-between gap-2 rounded-lg border bg-background/95 backdrop-blur-sm px-2.5 py-2">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Price</p>
              <p className="text-sm font-bold text-foreground">{formatPrice(product.price)}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setInCart(!inCart)
              }}
              className={cn(
                "h-8 px-3 rounded-md border text-xs font-semibold transition-colors flex items-center gap-2",
                inCart
                  ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                  : "bg-foreground text-background border-foreground hover:bg-foreground/90"
              )}
            >
              <ShoppingCart size={14} weight={inCart ? "fill" : "regular"} />
              {inCart ? "Added" : "Add"}
            </button>
          </div>
        </div>
      </div>

      <div className="p-3 space-y-1.5">
        <h3 className="text-sm font-medium text-foreground leading-snug line-clamp-2">{product.title}</h3>
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star size={12} weight="fill" className="text-muted-foreground" /> {product.rating}
          </span>
          <span>{product.reviews.toLocaleString()} reviews</span>
        </div>
      </div>
    </div>
  )
}
