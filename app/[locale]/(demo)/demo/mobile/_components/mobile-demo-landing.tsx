"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { useLocale } from "next-intl"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { 
  MagnifyingGlass, 
  Bell, 
  ShoppingCartSimple,
  Lightning,
  Heart,
  Star,
  Truck,
  ShieldCheck,
  ArrowRight,
  Tag,
  Package,
  Sparkle,
  House,
  SquaresFour,
  Plus,
  ChatCircle,
  User,
  Camera,
  Funnel,
  SortAscending,
  Cpu,
  TShirt,
  Flower,
  Car,
  Barbell,
  Baby,
  PawPrint,
  Armchair,
  Fire,
  Clock,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"

// =============================================================================
// MOCK DATA - Replace with real data in production
// =============================================================================

interface MockProduct {
  id: string
  title: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  freeShipping?: boolean
  condition: string
  location?: string
  sellerName?: string
  sellerVerified?: boolean
  isNew?: boolean
  category: string // Added for filtering
}

const MOCK_CATEGORIES = [
  { slug: "all", name: "All", nameBg: "Всички", icon: "sparkle" },
  { slug: "electronics", name: "Electronics", nameBg: "Електроника", icon: "cpu" },
  { slug: "fashion", name: "Fashion", nameBg: "Мода", icon: "tshirt" },
  { slug: "home", name: "Home & Garden", nameBg: "Дом", icon: "house" },
  { slug: "beauty", name: "Beauty", nameBg: "Красота", icon: "flower" },
  { slug: "sports", name: "Sports", nameBg: "Спорт", icon: "barbell" },
  { slug: "toys", name: "Kids & Baby", nameBg: "Деца", icon: "baby" },
  { slug: "pets", name: "Pets", nameBg: "Домашни", icon: "paw" },
  { slug: "furniture", name: "Furniture", nameBg: "Мебели", icon: "armchair" },
  { slug: "automotive", name: "Auto", nameBg: "Авто", icon: "car" },
]

// Extended product list with categories for filtering demo
const MOCK_PRODUCTS: MockProduct[] = [
  { id: "p1", title: "Premium Wireless Headphones with Active Noise Cancellation", price: 149.99, originalPrice: 299.99, image: "/demo/headphones.jpg", rating: 4.8, reviews: 2341, freeShipping: true, condition: "new", sellerName: "TechStore", sellerVerified: true, isNew: true, category: "electronics" },
  { id: "p2", title: "Vintage Leather Messenger Bag", price: 45.00, image: "/demo/bag.jpg", rating: 4.5, reviews: 128, location: "Sofia", condition: "like_new", sellerName: "Maria", category: "fashion" },
  { id: "p3", title: "Smart Home Hub with Voice Control", price: 79.99, originalPrice: 129.99, image: "/demo/hub.jpg", rating: 4.7, reviews: 892, freeShipping: true, condition: "new", sellerName: "SmartLife", sellerVerified: true, category: "electronics" },
  { id: "p4", title: "Organic Cotton T-Shirt Bundle", price: 24.99, image: "/demo/tshirt.jpg", rating: 4.3, reviews: 456, condition: "new", sellerName: "EcoFashion", category: "fashion" },
  { id: "p5", title: "Professional Drone with 4K Camera", price: 299.99, originalPrice: 499.99, image: "/demo/drone.jpg", rating: 4.9, reviews: 1205, freeShipping: true, condition: "new", sellerName: "DroneWorld", sellerVerified: true, isNew: true, category: "electronics" },
  { id: "p6", title: "Handmade Ceramic Vase Set", price: 35.00, image: "/demo/vase.jpg", rating: 4.6, reviews: 89, location: "Plovdiv", condition: "new", sellerName: "CraftHouse", category: "home" },
  { id: "p7", title: "Running Shoes - Lightweight Pro", price: 89.99, originalPrice: 129.99, image: "/demo/shoes.jpg", rating: 4.7, reviews: 567, freeShipping: true, condition: "new", sellerName: "SportZone", sellerVerified: true, category: "sports" },
  { id: "p8", title: "Minimalist Watch - Rose Gold", price: 65.00, image: "/demo/watch.jpg", rating: 4.4, reviews: 234, condition: "new", sellerName: "TimeStyle", category: "fashion" },
  { id: "p9", title: "Bluetooth Speaker Waterproof", price: 39.99, originalPrice: 59.99, image: "/demo/speaker.jpg", rating: 4.6, reviews: 1892, freeShipping: true, condition: "new", sellerName: "AudioMax", sellerVerified: true, category: "electronics" },
  { id: "p10", title: "Yoga Mat Premium Non-Slip", price: 29.99, image: "/demo/yoga.jpg", rating: 4.8, reviews: 445, condition: "new", sellerName: "FitLife", category: "sports" },
  { id: "p11", title: "Succulent Plant Set (3 pcs)", price: 18.00, image: "/demo/plants.jpg", rating: 4.9, reviews: 312, location: "Varna", condition: "new", sellerName: "GreenThumb", category: "home" },
  { id: "p12", title: "Skincare Set - Vitamin C", price: 42.00, originalPrice: 65.00, image: "/demo/skincare.jpg", rating: 4.5, reviews: 678, freeShipping: true, condition: "new", sellerName: "GlowUp", sellerVerified: true, category: "beauty" },
]

// =============================================================================
// COMPONENTS
// =============================================================================

/**
 * CategoryIcon - Maps slug to Phosphor icon
 */
function CategoryIcon({ slug, active, size = 16 }: { slug: string; active: boolean; size?: number }) {
  const weight = active ? "fill" : "regular"
  const className = active ? "text-background" : "text-muted-foreground"
  
  switch (slug) {
    case "all":
      return <Sparkle size={size} weight={weight} className={className} />
    case "electronics":
      return <Cpu size={size} weight={weight} className={className} />
    case "fashion":
      return <TShirt size={size} weight={weight} className={className} />
    case "home":
      return <House size={size} weight={weight} className={className} />
    case "beauty":
      return <Flower size={size} weight={weight} className={className} />
    case "sports":
      return <Barbell size={size} weight={weight} className={className} />
    case "toys":
      return <Baby size={size} weight={weight} className={className} />
    case "pets":
      return <PawPrint size={size} weight={weight} className={className} />
    case "furniture":
      return <Armchair size={size} weight={weight} className={className} />
    case "automotive":
      return <Car size={size} weight={weight} className={className} />
    default:
      return <SquaresFour size={size} weight={weight} className={className} />
  }
}

/**
 * MobileHeader - Unified header with search flowing into category pills
 * 
 * This is the SINGLE sticky header block containing:
 * Row 1: Logo + action icons (bell, cart)
 * Row 2: Search bar (tappable)
 * Row 3: Category pills (horizontal scroll)
 * 
 * NO separator between search and pills - they flow together as one unit
 */
function MobileHeader({ 
  onSearchFocus,
  categories,
  activeCategory,
  onCategorySelect,
  locale
}: { 
  onSearchFocus?: () => void
  categories: typeof MOCK_CATEGORIES
  activeCategory: string
  onCategorySelect: (slug: string) => void
  locale: string
}) {
  const [notificationCount] = useState(3)
  const [cartCount] = useState(2)
  const pillsRef = useRef<HTMLDivElement>(null)
  
  const searchPlaceholder = locale === "bg" 
    ? "Търсене в treido..." 
    : "Search treido..."
  
  // Scroll active pill into view
  useEffect(() => {
    const container = pillsRef.current
    if (!container) return
    
    const activeEl = container.querySelector(`[data-slug="${activeCategory}"]`) as HTMLElement
    if (activeEl) {
      const containerRect = container.getBoundingClientRect()
      const activeRect = activeEl.getBoundingClientRect()
      
      if (activeRect.left < containerRect.left || activeRect.right > containerRect.right) {
        activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
      }
    }
  }, [activeCategory])
  
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/40 pt-safe-top">
      {/* Row 1: Logo + Actions */}
      <div className="h-11 px-(--page-inset) flex items-center">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <span className="text-xl font-extrabold tracking-tighter leading-none text-foreground">treido.</span>
        </Link>
        
        {/* Spacer */}
        <div className="flex-1" />
        
        {/* Action Icons */}
        <div className="flex items-center">
          <button
            type="button"
            className="relative size-(--spacing-touch) flex items-center justify-center rounded-full active:bg-muted/60 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={22} weight="regular" className="text-foreground" />
            {notificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 bg-destructive text-destructive-foreground text-2xs font-bold rounded-full flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
          
          <Link
            href="/cart"
            className="relative size-(--spacing-touch) flex items-center justify-center rounded-full active:bg-muted/60 transition-colors"
            aria-label="Cart"
          >
            <ShoppingCartSimple size={22} weight="regular" className="text-foreground" />
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 bg-destructive text-destructive-foreground text-2xs font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
      
      {/* Row 2: Search Bar */}
      <div className="px-(--page-inset) pb-2">
        <button
          type="button"
          onClick={onSearchFocus}
          className={cn(
            "w-full flex items-center gap-2 h-10 px-3 rounded-full",
            "bg-muted/60 border border-border/30",
            "text-muted-foreground text-sm text-left",
            "active:bg-muted/80 transition-colors",
            "touch-action-manipulation"
          )}
          aria-label={searchPlaceholder}
        >
          <MagnifyingGlass size={18} weight="regular" className="text-muted-foreground shrink-0" />
          <span className="flex-1 truncate font-normal">{searchPlaceholder}</span>
          <Camera size={18} className="text-muted-foreground shrink-0 opacity-50" />
        </button>
      </div>
      
      {/* Row 3: Category Pills - flows directly from search, no separator */}
      <div 
        ref={pillsRef}
        className="overflow-x-auto no-scrollbar pb-2.5"
      >
        <div className="flex items-center gap-2 px-(--page-inset)">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.slug
            const label = locale === "bg" ? cat.nameBg : cat.name
            
            return (
              <button
                key={cat.slug}
                type="button"
                data-slug={cat.slug}
                onClick={() => onCategorySelect(cat.slug)}
                className={cn(
                  "shrink-0 flex items-center gap-1.5 h-8 px-3 rounded-full text-sm font-medium transition-all active:scale-95",
                  isActive 
                    ? "bg-foreground text-background" 
                    : "bg-muted/50 text-muted-foreground active:bg-muted"
                )}
              >
                <CategoryIcon slug={cat.slug} active={isActive} size={14} />
                <span>{label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </header>
  )
}

/**
 * FlashDealsStrip - Compact horizontal mini-deals strip
 * Shows only when viewing "All" category - doesn't interrupt category browsing
 */
function FlashDealsStrip({ locale }: { locale: string }) {
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 45, s: 30 })
  
  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        let totalSecs = prev.h * 3600 + prev.m * 60 + prev.s - 1
        if (totalSecs < 0) totalSecs = 0
        return {
          h: Math.floor(totalSecs / 3600),
          m: Math.floor((totalSecs % 3600) / 60),
          s: totalSecs % 60,
        }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  
  const deals = [
    { id: "d1", title: "Wireless Earbuds", price: 29.99, originalPrice: 79.99 },
    { id: "d2", title: "Smart Watch", price: 89.99, originalPrice: 199.99 },
    { id: "d3", title: "Power Bank 20K", price: 19.99, originalPrice: 49.99 },
    { id: "d4", title: "Gaming Mouse", price: 24.99, originalPrice: 59.99 },
  ]
  
  return (
    <section className="pt-3 pb-2">
      {/* Header row */}
      <div className="px-(--page-inset) mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-destructive">
            <Lightning size={16} weight="fill" />
            <span className="text-sm font-bold">
              {locale === "bg" ? "Флаш Оферти" : "Flash Deals"}
            </span>
          </div>
          {/* Compact countdown */}
          <div className="flex items-center gap-0.5 text-muted-foreground">
            <Clock size={12} />
            <span className="text-xs font-medium tabular-nums">
              {String(timeLeft.h).padStart(2, "0")}:{String(timeLeft.m).padStart(2, "0")}:{String(timeLeft.s).padStart(2, "0")}
            </span>
          </div>
        </div>
        <Link 
          href="/deals" 
          className="flex items-center gap-0.5 text-xs font-medium text-muted-foreground active:text-foreground"
        >
          {locale === "bg" ? "Виж всички" : "See all"}
          <ArrowRight size={12} weight="bold" />
        </Link>
      </div>
      
      {/* Mini deal cards */}
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-2 px-(--page-inset)">
          {deals.map((deal) => (
            <Link
              key={deal.id}
              href={`/product/${deal.id}`}
              className="shrink-0 w-24 active:opacity-80 transition-opacity"
            >
              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted mb-1.5">
                <div className="absolute top-1 left-1 z-10 px-1 py-0.5 bg-destructive text-destructive-foreground text-3xs font-bold rounded">
                  -{Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100)}%
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package size={24} className="text-muted-foreground/20" />
                </div>
              </div>
              <div className="text-xs font-semibold text-price-sale">€{deal.price.toFixed(2)}</div>
              <div className="text-3xs text-muted-foreground line-through">€{deal.originalPrice.toFixed(2)}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * TrustBadgesInline - Compact inline trust indicators
 * Inserted as interstitial content between product rows
 */
function TrustBadgesInline({ locale }: { locale: string }) {
  const badges = [
    { icon: ShieldCheck, label: locale === "bg" ? "Защитени покупки" : "Buyer Protection" },
    { icon: Truck, label: locale === "bg" ? "Бърза доставка" : "Fast Shipping" },
    { icon: Tag, label: locale === "bg" ? "Най-добри цени" : "Best Prices" },
  ]
  
  return (
    <div className="mx-(--page-inset) my-4 flex items-center justify-between py-3 px-3 bg-muted/30 rounded-lg border border-border/30">
      {badges.map(({ icon: Icon, label }, i) => (
        <div key={label} className={cn(
          "flex items-center gap-1.5",
          i > 0 && "border-l border-border/40 pl-3"
        )}>
          <Icon size={14} weight="fill" className="text-foreground/70" />
          <span className="text-2xs text-foreground/70 font-medium">{label}</span>
        </div>
      ))}
    </div>
  )
}

/**
 * SellPromoBanner - CTA for sellers at the END of the feed
 * Compact inline banner, not interrupting browse flow
 */
function SellPromoBanner({ locale }: { locale: string }) {
  return (
    <Link
      href="/sell"
      className="mx-(--page-inset) mb-4 flex items-center justify-between gap-3 rounded-lg bg-foreground text-background p-3.5 active:opacity-90 transition-opacity"
    >
      <div className="space-y-0.5 min-w-0">
        <p className="text-sm font-bold leading-tight">
          {locale === "bg" ? "Имаш нещо за продан?" : "Have something to sell?"}
        </p>
        <p className="text-xs text-background/70 leading-tight">
          {locale === "bg" 
            ? "Безплатно публикуване • Достигни хиляди"
            : "Free to list • Reach thousands"}
        </p>
      </div>
      <div className="size-9 shrink-0 bg-background text-foreground rounded-full flex items-center justify-center">
        <Plus size={18} weight="bold" />
      </div>
    </Link>
  )
}

/**
 * ProductCard - Compact mobile card with clean hierarchy
 */
function ProductCard({ product }: { product: MockProduct }) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0
  
  return (
    <Link
      href={`/product/${product.id}`}
      className="block active:opacity-80 transition-opacity"
    >
      {/* Image */}
      <div className="relative aspect-square rounded-lg overflow-hidden bg-muted mb-2">
        {/* Wishlist */}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
          className="absolute top-2 right-2 z-10 size-7 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center active:scale-90 transition-transform"
          aria-label="Add to wishlist"
        >
          <Heart size={14} className="text-foreground" />
        </button>
        
        {/* Badges */}
        {hasDiscount && (
          <div className="absolute top-2 left-2 z-10 px-1.5 py-0.5 bg-destructive text-destructive-foreground text-2xs font-bold rounded">
            -{discountPercent}%
          </div>
        )}
        
        {product.isNew && !hasDiscount && (
          <div className="absolute top-2 left-2 z-10 px-1.5 py-0.5 bg-success text-background text-2xs font-bold rounded">
            NEW
          </div>
        )}
        
        {product.freeShipping && (
          <div className="absolute bottom-2 left-2 z-10 px-1.5 py-0.5 bg-shipping-free text-background text-2xs font-medium rounded flex items-center gap-0.5">
            <Truck size={10} weight="fill" />
            Free
          </div>
        )}
        
        {/* Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Package size={36} className="text-muted-foreground/15" />
        </div>
      </div>
      
      {/* Content */}
      <div className="space-y-0.5">
        {/* Price */}
        <div className="flex items-baseline gap-1.5">
          <span className={cn(
            "text-sm font-bold",
            hasDiscount ? "text-price-sale" : "text-foreground"
          )}>
            €{product.price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-2xs text-muted-foreground line-through">
              €{product.originalPrice!.toFixed(2)}
            </span>
          )}
        </div>
        
        {/* Title */}
        <p className="text-xs text-foreground line-clamp-2 leading-snug">
          {product.title}
        </p>
        
        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1">
            <Star size={11} weight="fill" className="text-rating" />
            <span className="text-2xs text-muted-foreground">
              {product.rating} <span className="opacity-60">({product.reviews?.toLocaleString()})</span>
            </span>
          </div>
        )}
        
        {/* Seller/Location */}
        <div className="flex items-center gap-1 text-2xs text-muted-foreground">
          {product.sellerName && (
            <>
              <span>{product.sellerName}</span>
              {product.sellerVerified && <span className="text-verified">✓</span>}
            </>
          )}
          {product.location && !product.sellerName && (
            <span>{product.location}</span>
          )}
        </div>
      </div>
    </Link>
  )
}

/**
 * ProductFeed - Category-filtered product grid with interstitial content
 * 
 * This is the main content area that responds to category pill selection.
 * Shows products filtered by category with trust badges inserted as interstitial.
 */
function ProductFeed({ 
  products, 
  activeCategory,
  locale,
  showFlashDeals
}: { 
  products: MockProduct[]
  activeCategory: string
  locale: string
  showFlashDeals: boolean
}) {
  // Filter products by category
  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return products
    return products.filter(p => p.category === activeCategory)
  }, [products, activeCategory])
  
  // Get category label for header
  const categoryLabel = useMemo(() => {
    if (activeCategory === "all") {
      return locale === "bg" ? "Препоръчани за теб" : "Recommended for you"
    }
    const cat = MOCK_CATEGORIES.find(c => c.slug === activeCategory)
    return locale === "bg" ? cat?.nameBg : cat?.name
  }, [activeCategory, locale])
  
  // Split products: first 4 + rest (for interstitial pattern)
  const firstProducts = filteredProducts.slice(0, 4)
  const restProducts = filteredProducts.slice(4)
  
  return (
    <div className="pb-4">
      {/* Flash Deals - Only show on "All" */}
      {showFlashDeals && activeCategory === "all" && (
        <FlashDealsStrip locale={locale} />
      )}
      
      {/* Section Header with Filters */}
      <div className="px-(--page-inset) pt-3 pb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-foreground">{categoryLabel}</h2>
          <span className="text-xs text-muted-foreground">
            ({filteredProducts.length})
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button type="button" className="flex items-center gap-1 h-7 px-2 border border-border/60 rounded-full text-2xs font-medium active:bg-muted">
            <Funnel size={12} weight="bold" />
            {locale === "bg" ? "Филтри" : "Filters"}
          </button>
          <button type="button" className="flex items-center gap-1 h-7 px-2 border border-border/60 rounded-full text-2xs font-medium active:bg-muted">
            <SortAscending size={12} weight="bold" />
            {locale === "bg" ? "Сортирай" : "Sort"}
          </button>
        </div>
      </div>
      
      {/* First batch of products */}
      <div className="px-(--page-inset) grid grid-cols-2 gap-2.5">
        {firstProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {/* Trust badges interstitial (after first 4 products) */}
      {filteredProducts.length >= 4 && (
        <TrustBadgesInline locale={locale} />
      )}
      
      {/* Rest of products */}
      {restProducts.length > 0 && (
        <div className="px-(--page-inset) grid grid-cols-2 gap-2.5">
          {restProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      
      {/* Empty state when no products in category */}
      {filteredProducts.length === 0 && (
        <div className="px-(--page-inset) py-12 text-center">
          <Package size={48} className="mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">
            {locale === "bg" 
              ? "Няма продукти в тази категория" 
              : "No products in this category"}
          </p>
        </div>
      )}
    </div>
  )
}

/**
 * BottomNavigation - Fixed tab bar (iOS style)
 */
function BottomNavigation({ locale }: { locale: string }) {
  const tabs = [
    { icon: House, label: locale === "bg" ? "Начало" : "Home", href: "/", active: true },
    { icon: SquaresFour, label: locale === "bg" ? "Категории" : "Browse", href: "/categories", active: false },
    { icon: Plus, label: locale === "bg" ? "Продай" : "Sell", href: "/sell", active: false, isPrimary: true },
    { icon: ChatCircle, label: locale === "bg" ? "Чат" : "Inbox", href: "/chat", active: false, badge: 2 },
    { icon: User, label: locale === "bg" ? "Профил" : "Profile", href: "/account", active: false },
  ]
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border/50 pb-safe">
      <div className="grid grid-cols-5 h-14">
        {tabs.map(({ icon: Icon, label, href, active, isPrimary, badge }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5",
              "active:opacity-60 transition-opacity",
              isPrimary && "relative"
            )}
          >
            {isPrimary ? (
              <span className="size-11 -mt-4 bg-foreground text-background rounded-full flex items-center justify-center shadow-lg shadow-foreground/20">
                <Icon size={24} weight="bold" />
              </span>
            ) : (
              <span className="relative">
                <Icon 
                  size={24} 
                  weight={active ? "fill" : "regular"}
                  className={active ? "text-foreground" : "text-muted-foreground"}
                />
                {badge && badge > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 bg-destructive text-destructive-foreground text-2xs font-bold rounded-full flex items-center justify-center">
                    {badge}
                  </span>
                )}
              </span>
            )}
            <span className={cn(
              "text-2xs",
              active ? "font-semibold text-foreground" : "font-medium text-muted-foreground",
              isPrimary && "sr-only"
            )}>
              {label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function MobileDemoLanding() {
  const locale = useLocale()
  const [activeCategory, setActiveCategory] = useState("all")
  
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Unified Header: Logo + Search + Category Pills (all in one sticky block) */}
      <MobileHeader 
        categories={MOCK_CATEGORIES}
        activeCategory={activeCategory}
        onCategorySelect={setActiveCategory}
        locale={locale}
      />
      
      {/* Main Content: Category-aware product feed with interstitials */}
      <ProductFeed 
        products={MOCK_PRODUCTS} 
        activeCategory={activeCategory}
        locale={locale}
        showFlashDeals={true}
      />
      
      {/* Sell CTA - At the end of feed, natural upsell */}
      <SellPromoBanner locale={locale} />
      
      {/* Load More */}
      <div className="px-(--page-inset) pb-4">
        <Button variant="outline" className="w-full h-10 font-medium text-sm">
          {locale === "bg" ? "Зареди още" : "Load more"}
        </Button>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation locale={locale} />
    </div>
  )
}
