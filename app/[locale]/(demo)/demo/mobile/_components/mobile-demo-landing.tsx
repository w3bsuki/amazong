"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import Image from "next/image"
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
  Fire,
  Clock,
  Tag,
  Package,
  Sparkle,
  CaretRight,
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
  SoccerBall,
  GameController,
  Car,
  Barbell,
  Baby,
  PawPrint,
  Armchair,
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
}

const MOCK_CATEGORIES = [
  { slug: "all", name: "All", nameBg: "Всички", icon: "sparkle", color: "bg-muted/80" },
  { slug: "electronics", name: "Electronics", nameBg: "Електроника", icon: "cpu", color: "bg-sky-500/15" },
  { slug: "fashion", name: "Fashion", nameBg: "Мода", icon: "tshirt", color: "bg-pink-500/15" },
  { slug: "home", name: "Home", nameBg: "Дом", icon: "house", color: "bg-emerald-500/15" },
  { slug: "beauty", name: "Beauty", nameBg: "Красота", icon: "flower", color: "bg-fuchsia-500/15" },
  { slug: "sports", name: "Sports", nameBg: "Спорт", icon: "barbell", color: "bg-orange-500/15" },
  { slug: "toys", name: "Kids", nameBg: "Деца", icon: "baby", color: "bg-violet-500/15" },
  { slug: "pets", name: "Pets", nameBg: "Домашни", icon: "paw", color: "bg-amber-500/15" },
  { slug: "furniture", name: "Furniture", nameBg: "Мебели", icon: "armchair", color: "bg-teal-500/15" },
  { slug: "automotive", name: "Auto", nameBg: "Авто", icon: "car", color: "bg-slate-500/15" },
]

const MOCK_FLASH_DEALS = [
  { id: "1", title: "Wireless Earbuds Pro", price: 29.99, originalPrice: 79.99, image: "/demo/earbuds.jpg", discount: 63, endTime: "02:45:30" },
  { id: "2", title: "Smart Watch Series 5", price: 89.99, originalPrice: 199.99, image: "/demo/watch.jpg", discount: 55, endTime: "04:12:15" },
  { id: "3", title: "Portable Charger 20K", price: 19.99, originalPrice: 49.99, image: "/demo/charger.jpg", discount: 60, endTime: "01:30:00" },
  { id: "4", title: "Gaming Mouse RGB", price: 24.99, originalPrice: 59.99, image: "/demo/mouse.jpg", discount: 58, endTime: "03:20:45" },
]

const MOCK_PRODUCTS: MockProduct[] = [
  { id: "p1", title: "Premium Wireless Headphones with Active Noise Cancellation", price: 149.99, originalPrice: 299.99, image: "/demo/headphones.jpg", rating: 4.8, reviews: 2341, freeShipping: true, condition: "new", sellerName: "TechStore", sellerVerified: true, isNew: true },
  { id: "p2", title: "Vintage Leather Messenger Bag", price: 45.00, image: "/demo/bag.jpg", rating: 4.5, reviews: 128, location: "Sofia", condition: "like_new", sellerName: "Maria" },
  { id: "p3", title: "Smart Home Hub with Voice Control", price: 79.99, originalPrice: 129.99, image: "/demo/hub.jpg", rating: 4.7, reviews: 892, freeShipping: true, condition: "new", sellerName: "SmartLife", sellerVerified: true },
  { id: "p4", title: "Organic Cotton T-Shirt Bundle", price: 24.99, image: "/demo/tshirt.jpg", rating: 4.3, reviews: 456, condition: "new", sellerName: "EcoFashion" },
  { id: "p5", title: "Professional Drone with 4K Camera", price: 299.99, originalPrice: 499.99, image: "/demo/drone.jpg", rating: 4.9, reviews: 1205, freeShipping: true, condition: "new", sellerName: "DroneWorld", sellerVerified: true, isNew: true },
  { id: "p6", title: "Handmade Ceramic Vase Set", price: 35.00, image: "/demo/vase.jpg", rating: 4.6, reviews: 89, location: "Plovdiv", condition: "new", sellerName: "CraftHouse" },
]

const TRENDING_SEARCHES = ["iPhone 15", "Nike Air Max", "PS5", "MacBook", "AirPods"]

// =============================================================================
// COMPONENTS
// =============================================================================

/**
 * MobileHeader - Premium search header with status bar safe area
 * Clean Apple/Vinted-style design
 */
function MobileHeader({ onSearchFocus }: { onSearchFocus?: () => void }) {
  const t = useTranslations("Navigation")
  const [notificationCount] = useState(3)
  const [cartCount] = useState(2)
  
  return (
    <header className="sticky top-0 z-50 bg-background pt-safe-top">
      {/* Main header row */}
      <div className="flex items-center gap-2 px-3 py-2">
        {/* Logo/Brand */}
        <Link href="/" className="shrink-0">
          <span className="text-lg font-bold text-foreground tracking-tight">treido</span>
        </Link>
        
        {/* Search Bar - Expandable */}
        <button
          type="button"
          onClick={onSearchFocus}
          className="flex-1 flex items-center gap-2 h-10 px-3 bg-muted/60 rounded-full text-left active:bg-muted transition-colors"
        >
          <MagnifyingGlass size={18} weight="bold" className="text-muted-foreground shrink-0" />
          <span className="text-sm text-muted-foreground truncate flex-1">
            {t("searchPlaceholder")}
          </span>
          <Camera size={18} className="text-muted-foreground shrink-0" />
        </button>
        
        {/* Actions */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            className="relative size-10 flex items-center justify-center rounded-full active:bg-muted/60 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={22} weight="regular" className="text-foreground" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 min-w-4 h-4 px-1 bg-destructive text-destructive-foreground text-2xs font-bold rounded-full flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
          
          <Link
            href="/cart"
            className="relative size-10 flex items-center justify-center rounded-full active:bg-muted/60 transition-colors"
            aria-label="Cart"
          >
            <ShoppingCartSimple size={22} weight="regular" className="text-foreground" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 min-w-4 h-4 px-1 bg-destructive text-destructive-foreground text-2xs font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
      
      {/* Trending searches - Horizontally scrollable */}
      <div className="px-3 pb-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2">
          <Fire size={14} weight="fill" className="text-destructive shrink-0" />
          {TRENDING_SEARCHES.map((term) => (
            <button
              key={term}
              type="button"
              className="shrink-0 h-7 px-2.5 bg-muted/40 text-xs text-muted-foreground font-medium rounded-full active:bg-muted transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
      
      {/* Bottom border */}
      <div className="h-px bg-border/50" />
    </header>
  )
}

/**
 * CategoryIcon - Maps slug to Phosphor icon
 */
function CategoryIcon({ slug, active, size = 22 }: { slug: string; active: boolean; size?: number }) {
  const weight = active ? "fill" : "duotone"
  const className = active ? "text-foreground" : "text-foreground/70"
  
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
 * CategoryPills - Horizontal scrollable category pills (modern tab-style)
 * Better than circles for thumb-zone navigation on mobile
 */
function CategoryPills({ 
  categories, 
  activeSlug, 
  onSelect,
  locale 
}: { 
  categories: typeof MOCK_CATEGORIES
  activeSlug: string
  onSelect: (slug: string) => void
  locale: string
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  
  // Scroll active pill into view
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    
    const activeEl = container.querySelector(`[data-slug="${activeSlug}"]`) as HTMLElement
    if (activeEl) {
      const containerRect = container.getBoundingClientRect()
      const activeRect = activeEl.getBoundingClientRect()
      
      if (activeRect.left < containerRect.left || activeRect.right > containerRect.right) {
        activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
      }
    }
  }, [activeSlug])
  
  return (
    <div 
      ref={scrollRef}
      className="overflow-x-auto no-scrollbar"
    >
      <div className="flex items-center gap-2 px-3 py-2.5">
        {categories.map((cat) => {
          const isActive = activeSlug === cat.slug
          const label = locale === "bg" ? cat.nameBg : cat.name
          
          return (
            <button
              key={cat.slug}
              type="button"
              data-slug={cat.slug}
              onClick={() => onSelect(cat.slug)}
              className={cn(
                "shrink-0 flex items-center gap-1.5 h-9 px-3.5 rounded-full font-medium text-sm transition-all active:scale-95",
                isActive 
                  ? "bg-foreground text-background shadow-sm" 
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <CategoryIcon slug={cat.slug} active={isActive} size={16} />
              <span>{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/**
 * FlashDealsCarousel - Urgency-driven horizontal scroll
 */
function FlashDealsCarousel({ deals, locale }: { deals: typeof MOCK_FLASH_DEALS; locale: string }) {
  const [timeLeft, setTimeLeft] = useState("02:45:30")
  
  // Countdown timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const parts = prev.split(":").map(Number)
        const h = parts[0] ?? 0
        const m = parts[1] ?? 0
        const s = parts[2] ?? 0
        let totalSecs = h * 3600 + m * 60 + s - 1
        if (totalSecs < 0) totalSecs = 0
        const nh = Math.floor(totalSecs / 3600)
        const nm = Math.floor((totalSecs % 3600) / 60)
        const ns = totalSecs % 60
        return `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}:${String(ns).padStart(2, "0")}`
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  
  return (
    <section className="py-2.5">
      {/* Header */}
      <div className="px-3 flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-destructive text-destructive-foreground rounded-md">
            <Lightning size={14} weight="fill" />
            <span className="text-xs font-bold tracking-tight">
              {locale === "bg" ? "ФЛАШ ОФЕРТИ" : "FLASH DEALS"}
            </span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-destructive/10 rounded-md">
            <Clock size={12} weight="bold" className="text-destructive" />
            <span className="text-xs font-bold text-destructive tabular-nums">{timeLeft}</span>
          </div>
        </div>
        <Link href="/deals" className="flex items-center gap-0.5 text-xs font-medium text-muted-foreground active:opacity-70">
          {locale === "bg" ? "Всички" : "See all"}
          <CaretRight size={14} weight="bold" />
        </Link>
      </div>
      
      {/* Carousel */}
      <div className="px-3 overflow-x-auto no-scrollbar">
        <div className="flex gap-2.5 pb-1">
          {deals.map((deal) => (
            <Link
              key={deal.id}
              href={`/product/${deal.id}`}
              className="shrink-0 w-28 active:opacity-80 transition-opacity"
            >
              {/* Image */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-muted mb-2">
                <div className="absolute top-2 left-2 z-10 px-1.5 py-0.5 bg-destructive text-destructive-foreground text-2xs font-bold rounded">
                  -{deal.discount}%
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package size={32} className="text-muted-foreground/20" />
                </div>
              </div>
              {/* Info */}
              <div className="space-y-0.5">
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-bold text-destructive">€{deal.price}</span>
                </div>
                <span className="text-2xs text-muted-foreground line-through">€{deal.originalPrice}</span>
                <p className="text-2xs text-muted-foreground line-clamp-1">{deal.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * TrustBadgesStrip - Compact horizontal trust indicators
 */
function TrustBadgesStrip({ locale }: { locale: string }) {
  const badges = [
    { icon: ShieldCheck, text: locale === "bg" ? "Защитени покупки" : "Buyer Protection" },
    { icon: Truck, text: locale === "bg" ? "Бърза доставка" : "Fast Shipping" },
    { icon: Tag, text: locale === "bg" ? "Най-добри цени" : "Best Prices" },
  ]
  
  return (
    <div className="mx-3 my-2 flex items-center justify-around py-2.5 bg-muted/40 rounded-xl border border-border/40">
      {badges.map(({ icon: Icon, text }) => (
        <div key={text} className="flex items-center gap-1.5">
          <Icon size={15} weight="fill" className="text-foreground/80" />
          <span className="text-2xs text-foreground/70 font-medium">{text}</span>
        </div>
      ))}
    </div>
  )
}

/**
 * PromoBanner - Compelling CTA banner
 */
function PromoBanner({ locale }: { locale: string }) {
  return (
    <Link
      href="/sell"
      className="mx-3 my-2 flex items-center justify-between gap-3 rounded-xl bg-foreground text-background p-4 active:opacity-90 transition-opacity"
    >
      <div className="space-y-0.5 min-w-0">
        <p className="text-base font-bold leading-tight">
          {locale === "bg" ? "Започни да продаваш днес" : "Start selling today"}
        </p>
        <p className="text-xs text-background/70 leading-tight">
          {locale === "bg" 
            ? "Безплатно публикуване • Достигни хиляди купувачи"
            : "Free to list • Reach thousands of buyers"}
        </p>
      </div>
      <div className="size-10 shrink-0 bg-background text-foreground rounded-full flex items-center justify-center">
        <ArrowRight size={20} weight="bold" />
      </div>
    </Link>
  )
}

/**
 * ProductCard - Compact mobile card with clean hierarchy
 */
function ProductCard({ product, locale }: { product: MockProduct; locale: string }) {
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
      <div className="relative aspect-square rounded-xl overflow-hidden bg-muted mb-2">
        {/* Wishlist */}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
          className="absolute top-2 right-2 z-10 size-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center active:scale-90 transition-transform"
          aria-label="Add to wishlist"
        >
          <Heart size={16} className="text-foreground" />
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
          <Package size={40} className="text-muted-foreground/15" />
        </div>
      </div>
      
      {/* Content */}
      <div className="space-y-1">
        {/* Price */}
        <div className="flex items-baseline gap-1.5">
          <span className={cn(
            "text-base font-bold",
            hasDiscount ? "text-price-sale" : "text-foreground"
          )}>
            €{product.price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">
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
            <Star size={12} weight="fill" className="text-rating" />
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
 * ProductGrid - Responsive 2-column grid
 */
function ProductGrid({ products, locale }: { products: MockProduct[]; locale: string }) {
  return (
    <section className="px-3 py-3">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-foreground">
          {locale === "bg" ? "Препоръчани за теб" : "Recommended for you"}
        </h2>
        <div className="flex items-center gap-2">
          <button type="button" className="flex items-center gap-1 h-8 px-2.5 border border-border rounded-lg text-xs font-medium active:bg-muted">
            <Funnel size={14} weight="bold" />
            {locale === "bg" ? "Филтри" : "Filters"}
          </button>
          <button type="button" className="flex items-center gap-1 h-8 px-2.5 border border-border rounded-lg text-xs font-medium active:bg-muted">
            <SortAscending size={14} weight="bold" />
            {locale === "bg" ? "Сортирай" : "Sort"}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} />
        ))}
      </div>
    </section>
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
      {/* Header */}
      <MobileHeader />
      
      {/* Category Pills (better than circles for thumb navigation) */}
      <CategoryPills 
        categories={MOCK_CATEGORIES}
        activeSlug={activeCategory}
        onSelect={setActiveCategory}
        locale={locale}
      />
      
      {/* Flash Deals */}
      <FlashDealsCarousel deals={MOCK_FLASH_DEALS} locale={locale} />
      
      {/* Trust Badges */}
      <TrustBadgesStrip locale={locale} />
      
      {/* Promo Banner */}
      <PromoBanner locale={locale} />
      
      {/* Product Grid */}
      <ProductGrid products={MOCK_PRODUCTS} locale={locale} />
      
      {/* Load More */}
      <div className="px-3 py-4">
        <Button variant="outline" className="w-full h-11 font-medium">
          {locale === "bg" ? "Зареди още продукти" : "Load more products"}
        </Button>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation locale={locale} />
    </div>
  )
}
