"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { useLocale } from "next-intl"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { 
  MagnifyingGlass, 
  Bell, 
  ShoppingCartSimple,
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
  Cpu,
  TShirt,
  Flower,
  Car,
  Barbell,
  Baby,
  PawPrint,
  Armchair,
  Fire,
  List,
  X,
  Check,
  CaretRight,
  SignIn,
  Gear,
} from "@phosphor-icons/react"
import { SlidersHorizontal, ArrowUpDown } from "lucide-react"

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
  isPromoted?: boolean
  category: string
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

// Subcategories for circles - visual browse when category selected
const MOCK_SUBCATEGORIES: Record<string, Array<{ slug: string; name: string; nameBg: string; image?: string }>> = {
  electronics: [
    { slug: "phones", name: "Phones", nameBg: "Телефони", image: "/categories/phones.jpg" },
    { slug: "laptops", name: "Laptops", nameBg: "Лаптопи", image: "/categories/laptops.jpg" },
    { slug: "audio", name: "Audio", nameBg: "Аудио", image: "/categories/audio.jpg" },
    { slug: "gaming", name: "Gaming", nameBg: "Гейминг", image: "/categories/gaming.jpg" },
    { slug: "cameras", name: "Cameras", nameBg: "Камери", image: "/categories/cameras.jpg" },
    { slug: "tablets", name: "Tablets", nameBg: "Таблети", image: "/categories/tablets.jpg" },
    { slug: "smart-home", name: "Smart Home", nameBg: "Умен дом", image: "/categories/smart-home.jpg" },
    { slug: "accessories", name: "Accessories", nameBg: "Аксесоари", image: "/categories/accessories.jpg" },
  ],
  fashion: [
    { slug: "women", name: "Women", nameBg: "Жени", image: "/categories/women.jpg" },
    { slug: "men", name: "Men", nameBg: "Мъже", image: "/categories/men.jpg" },
    { slug: "kids", name: "Kids", nameBg: "Деца", image: "/categories/kids-fashion.jpg" },
    { slug: "shoes", name: "Shoes", nameBg: "Обувки", image: "/categories/shoes.jpg" },
    { slug: "bags", name: "Bags", nameBg: "Чанти", image: "/categories/bags.jpg" },
    { slug: "jewelry", name: "Jewelry", nameBg: "Бижута", image: "/categories/jewelry.jpg" },
    { slug: "watches", name: "Watches", nameBg: "Часовници", image: "/categories/watches.jpg" },
  ],
  home: [
    { slug: "decor", name: "Decor", nameBg: "Декор", image: "/categories/decor.jpg" },
    { slug: "kitchen", name: "Kitchen", nameBg: "Кухня", image: "/categories/kitchen.jpg" },
    { slug: "garden", name: "Garden", nameBg: "Градина", image: "/categories/garden.jpg" },
    { slug: "lighting", name: "Lighting", nameBg: "Осветление", image: "/categories/lighting.jpg" },
    { slug: "storage", name: "Storage", nameBg: "Съхранение", image: "/categories/storage.jpg" },
  ],
  beauty: [
    { slug: "skincare", name: "Skincare", nameBg: "За кожа", image: "/categories/skincare.jpg" },
    { slug: "makeup", name: "Makeup", nameBg: "Грим", image: "/categories/makeup.jpg" },
    { slug: "haircare", name: "Hair Care", nameBg: "За коса", image: "/categories/haircare.jpg" },
    { slug: "fragrance", name: "Fragrance", nameBg: "Парфюми", image: "/categories/fragrance.jpg" },
  ],
  sports: [
    { slug: "fitness", name: "Fitness", nameBg: "Фитнес", image: "/categories/fitness.jpg" },
    { slug: "outdoor", name: "Outdoor", nameBg: "На открито", image: "/categories/outdoor.jpg" },
    { slug: "team-sports", name: "Team Sports", nameBg: "Отборни", image: "/categories/team-sports.jpg" },
    { slug: "cycling", name: "Cycling", nameBg: "Колоездене", image: "/categories/cycling.jpg" },
  ],
  toys: [
    { slug: "baby-toys", name: "Baby", nameBg: "Бебешки", image: "/categories/baby-toys.jpg" },
    { slug: "educational", name: "Educational", nameBg: "Образователни", image: "/categories/educational.jpg" },
    { slug: "action-figures", name: "Action", nameBg: "Фигурки", image: "/categories/action-figures.jpg" },
    { slug: "puzzles", name: "Puzzles", nameBg: "Пъзели", image: "/categories/puzzles.jpg" },
  ],
  pets: [
    { slug: "dogs", name: "Dogs", nameBg: "Кучета", image: "/categories/dogs.jpg" },
    { slug: "cats", name: "Cats", nameBg: "Котки", image: "/categories/cats.jpg" },
    { slug: "birds", name: "Birds", nameBg: "Птици", image: "/categories/birds.jpg" },
    { slug: "fish", name: "Fish", nameBg: "Риби", image: "/categories/fish.jpg" },
  ],
  furniture: [
    { slug: "living-room", name: "Living", nameBg: "Хол", image: "/categories/living-room.jpg" },
    { slug: "bedroom", name: "Bedroom", nameBg: "Спалня", image: "/categories/bedroom.jpg" },
    { slug: "office", name: "Office", nameBg: "Офис", image: "/categories/office.jpg" },
    { slug: "outdoor-furn", name: "Outdoor", nameBg: "Градина", image: "/categories/outdoor-furn.jpg" },
  ],
  automotive: [
    { slug: "car-parts", name: "Parts", nameBg: "Части", image: "/categories/car-parts.jpg" },
    { slug: "car-accessories", name: "Accessories", nameBg: "Аксесоари", image: "/categories/car-accessories.jpg" },
    { slug: "tires", name: "Tires", nameBg: "Гуми", image: "/categories/tires.jpg" },
    { slug: "tools", name: "Tools", nameBg: "Инструменти", image: "/categories/tools.jpg" },
  ],
}

// Promoted products (bigger cards in horizontal scroll)
const PROMOTED_PRODUCTS: MockProduct[] = [
  { id: "promo1", title: "Premium Wireless Headphones with Active Noise Cancellation", price: 149.99, originalPrice: 299.99, image: "/demo/headphones.jpg", rating: 4.8, reviews: 2341, freeShipping: true, condition: "new", sellerName: "TechStore", sellerVerified: true, isPromoted: true, category: "electronics" },
  { id: "promo2", title: "Professional Drone with 4K Camera", price: 299.99, originalPrice: 499.99, image: "/demo/drone.jpg", rating: 4.9, reviews: 1205, freeShipping: true, condition: "new", sellerName: "DroneWorld", sellerVerified: true, isPromoted: true, category: "electronics" },
  { id: "promo3", title: "Smart Home Hub with Voice Control", price: 79.99, originalPrice: 129.99, image: "/demo/hub.jpg", rating: 4.7, reviews: 892, freeShipping: true, condition: "new", sellerName: "SmartLife", sellerVerified: true, isPromoted: true, category: "electronics" },
  { id: "promo4", title: "Running Shoes - Lightweight Pro", price: 89.99, originalPrice: 129.99, image: "/demo/shoes.jpg", rating: 4.7, reviews: 567, freeShipping: true, condition: "new", sellerName: "SportZone", sellerVerified: true, isPromoted: true, category: "sports" },
]

// Offers for you (personalized deals)
const OFFERS_FOR_YOU: MockProduct[] = [
  { id: "offer1", title: "Bluetooth Speaker Waterproof", price: 39.99, originalPrice: 59.99, image: "/demo/speaker.jpg", rating: 4.6, reviews: 1892, freeShipping: true, condition: "new", sellerName: "AudioMax", sellerVerified: true, category: "electronics" },
  { id: "offer2", title: "Skincare Set - Vitamin C", price: 42.00, originalPrice: 65.00, image: "/demo/skincare.jpg", rating: 4.5, reviews: 678, freeShipping: true, condition: "new", sellerName: "GlowUp", sellerVerified: true, category: "beauty" },
  { id: "offer3", title: "Yoga Mat Premium Non-Slip", price: 29.99, originalPrice: 44.99, image: "/demo/yoga.jpg", rating: 4.8, reviews: 445, condition: "new", sellerName: "FitLife", category: "sports" },
  { id: "offer4", title: "Organic Cotton T-Shirt Bundle", price: 24.99, originalPrice: 39.99, image: "/demo/tshirt.jpg", rating: 4.3, reviews: 456, condition: "new", sellerName: "EcoFashion", category: "fashion" },
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
// NATIVE DRAWER - No shadcn/radix dependency
// =============================================================================

interface NativeDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  side?: "left" | "right" | "bottom"
  className?: string
}

function NativeDrawer({ open, onOpenChange, children, side = "bottom", className }: NativeDrawerProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false)
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [open, onOpenChange])

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const sideClasses = {
    left: "inset-y-0 left-0 w-[85%] max-w-sm translate-x-[-100%] data-[state=open]:translate-x-0",
    right: "inset-y-0 right-0 w-[85%] max-w-sm translate-x-[100%] data-[state=open]:translate-x-0",
    bottom: "inset-x-0 bottom-0 translate-y-[100%] data-[state=open]:translate-y-0 rounded-t-2xl max-h-[92dvh]",
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        data-state={open ? "open" : "closed"}
        className={cn(
          "fixed z-50 bg-background flex flex-col transition-transform duration-300 ease-out",
          sideClasses[side],
          className
        )}
      >
        {children}
      </div>
    </>
  )
}

// =============================================================================
// COMPONENTS
// =============================================================================

/**
 * CategoryIcon - Maps slug to Phosphor icon
 */
function CategoryIcon({ slug, active, size = 14 }: { slug: string; active: boolean; size?: number }) {
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
 * HamburgerMenu - Native drawer menu (no shadcn)
 */
function HamburgerMenu({ 
  open, 
  onOpenChange, 
  locale 
}: { 
  open: boolean
  onOpenChange: (open: boolean) => void
  locale: string 
}) {
  return (
    <NativeDrawer open={open} onOpenChange={onOpenChange} side="left">
      {/* Header */}
      <header className="bg-background border-b border-border/50 shrink-0">
        <div className="h-14 px-4 flex items-center justify-between">
          <Link href="/" onClick={() => onOpenChange(false)} className="shrink-0">
            <span className="size-10 bg-foreground text-background rounded-md flex items-center justify-center text-xl font-black">T</span>
          </Link>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="size-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <X size={22} weight="bold" />
          </button>
        </div>
      </header>

      {/* User Section */}
      <div className="px-4 py-4 border-b border-border/30">
        <Link
          href="/auth/login"
          onClick={() => onOpenChange(false)}
          className="flex items-center gap-3 h-11 px-4 rounded-full bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors justify-center"
        >
          <SignIn size={18} weight="bold" />
          <span>{locale === "bg" ? "Влез в акаунта" : "Sign In"}</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-3">
        <div className="space-y-0.5">
          {[
            { href: "/", icon: House, label: locale === "bg" ? "Начало" : "Home" },
            { href: "/categories", icon: SquaresFour, label: locale === "bg" ? "Категории" : "Categories" },
            { href: "/sell", icon: Plus, label: locale === "bg" ? "Продай" : "Sell" },
            { href: "/wishlist", icon: Heart, label: locale === "bg" ? "Любими" : "Favorites" },
            { href: "/chat", icon: ChatCircle, label: locale === "bg" ? "Съобщения" : "Messages" },
            { href: "/account", icon: User, label: locale === "bg" ? "Профил" : "Profile" },
            { href: "/account/settings", icon: Gear, label: locale === "bg" ? "Настройки" : "Settings" },
          ].map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-4 px-3 h-12 rounded-lg hover:bg-muted/50 active:bg-muted/70 transition-colors"
            >
              <Icon size={22} weight="duotone" className="text-muted-foreground shrink-0" />
              <span className="text-sm font-medium text-foreground flex-1">{label}</span>
              <CaretRight size={16} weight="bold" className="text-muted-foreground/40 shrink-0" />
            </Link>
          ))}
        </div>
      </nav>
    </NativeDrawer>
  )
}

/**
 * MobileHeader - Unified header with hamburger, search, and category pills
 */
function MobileHeader({ 
  onSearchFocus,
  onMenuOpen,
  categories,
  activeCategory,
  onCategorySelect,
  locale
}: { 
  onSearchFocus?: () => void
  onMenuOpen: () => void
  categories: typeof MOCK_CATEGORIES
  activeCategory: string
  onCategorySelect: (slug: string) => void
  locale: string
}) {
  const [wishlistCount] = useState(7)
  const [cartCount] = useState(2)
  const pillsRef = useRef<HTMLDivElement>(null)
  
  const searchPlaceholder = locale === "bg" 
    ? "Търсене..." 
    : "Search..."
  
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
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/40 pt-safe">
      {/* Row 1: Hamburger + Logo + Search + Wishlist + Cart (Temu-style) */}
      <div className="h-12 px-(--page-inset) flex items-center gap-1.5">
        {/* Hamburger */}
        <button
          type="button"
          onClick={onMenuOpen}
          className="size-10 flex items-center justify-center -ml-2 shrink-0 rounded-md active:bg-muted/60 transition-colors"
          aria-label="Menu"
        >
          <List size={24} weight="bold" className="text-foreground" />
        </button>
        
        {/* Logo */}
        <Link href="/" className="shrink-0 -ml-1">
          <span className="text-lg font-extrabold tracking-tight text-foreground">treido.</span>
        </Link>
        
        {/* Search Bar - Takes remaining space */}
        <button
          type="button"
          onClick={onSearchFocus}
          className={cn(
            "flex-1 min-w-0 flex items-center gap-1.5 h-9 px-3 rounded-full",
            "bg-muted/50 border border-border/30",
            "text-muted-foreground text-sm text-left",
            "active:bg-muted/70 transition-colors"
          )}
          aria-label={searchPlaceholder}
        >
          <MagnifyingGlass size={16} weight="regular" className="text-muted-foreground shrink-0" />
          <span className="flex-1 truncate font-normal text-xs">{searchPlaceholder}</span>
        </button>
        
        {/* Action Icons: Wishlist + Cart */}
        <div className="flex items-center shrink-0">
          <Link
            href="/wishlist"
            className="relative size-9 flex items-center justify-center rounded-full active:bg-muted/60 transition-colors"
            aria-label="Wishlist"
          >
            <Heart size={22} weight="regular" className="text-foreground" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-destructive text-destructive-foreground text-2xs font-bold rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>
          
          <Link
            href="/cart"
            className="relative size-9 flex items-center justify-center rounded-full active:bg-muted/60 transition-colors"
            aria-label="Cart"
          >
            <ShoppingCartSimple size={22} weight="regular" className="text-foreground" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-destructive text-destructive-foreground text-2xs font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
      
      {/* Row 2: Category Pills */}
      <div 
        ref={pillsRef}
        className="overflow-x-auto no-scrollbar py-2"
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
                  "shrink-0 flex items-center gap-1.5 h-9 px-3.5 rounded-full text-sm font-medium transition-colors",
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
 * PromotedListings - Bigger horizontal scroll cards for promoted products
 * Main visual element on the landing page
 */
function PromotedListings({ locale }: { locale: string }) {
  return (
    <section className="pt-3 pb-1">
      {/* Header */}
      <div className="px-(--page-inset) mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Fire size={18} weight="fill" className="text-orange-500" />
          <span className="text-sm font-bold text-foreground">
            {locale === "bg" ? "Промотирани обяви" : "Promoted Listings"}
          </span>
        </div>
        <Link 
          href="/todays-deals" 
          className="flex items-center gap-0.5 text-xs font-medium text-muted-foreground active:text-foreground"
        >
          {locale === "bg" ? "Виж всички" : "See all"}
          <ArrowRight size={12} weight="bold" />
        </Link>
      </div>
      
      {/* Big horizontal scroll cards */}
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-3 px-(--page-inset)">
          {PROMOTED_PRODUCTS.map((product) => {
            const hasDiscount = product.originalPrice && product.originalPrice > product.price
            const discountPercent = hasDiscount 
              ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
              : 0

            return (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="shrink-0 w-40 active:opacity-80 transition-opacity"
              >
                {/* Bigger image */}
                <div className="relative aspect-square rounded-md overflow-hidden bg-muted mb-2">
                  {/* Promoted badge */}
                  <div className="absolute top-1.5 left-1.5 z-10 px-1.5 py-0.5 bg-orange-500 text-white text-2xs font-bold rounded flex items-center gap-0.5">
                    <Sparkle size={10} weight="fill" />
                    <span>AD</span>
                  </div>
                  {/* Discount badge */}
                  {hasDiscount && (
                    <div className="absolute top-1.5 right-1.5 z-10 px-1.5 py-0.5 bg-destructive text-destructive-foreground text-2xs font-bold rounded">
                      -{discountPercent}%
                    </div>
                  )}
                  {/* Free shipping */}
                  {product.freeShipping && (
                    <div className="absolute bottom-1.5 left-1.5 z-10 px-1.5 py-0.5 bg-shipping-free text-background text-2xs font-medium rounded flex items-center gap-0.5">
                      <Truck size={10} weight="fill" />
                      Free
                    </div>
                  )}
                  {/* Wishlist */}
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
                    className="absolute top-1.5 right-1.5 z-10 size-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center active:bg-background transition-colors"
                    aria-label="Add to wishlist"
                    style={{ display: hasDiscount ? 'none' : 'flex' }}
                  >
                    <Heart size={16} className="text-foreground" />
                  </button>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Package size={36} className="text-muted-foreground/15" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="space-y-0.5">
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
                  <p className="text-xs text-foreground line-clamp-2 leading-snug">
                    {product.title}
                  </p>
                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    <Star size={11} weight="fill" className="text-rating" />
                    <span className="text-2xs text-muted-foreground">
                      {product.rating} <span className="opacity-60">({product.reviews?.toLocaleString()})</span>
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/**
 * OffersForYou - Horizontal scroll row (same style as Promoted)
 */
function OffersForYou({ locale }: { locale: string }) {
  return (
    <section className="py-3">
      {/* Header */}
      <div className="px-(--page-inset) mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag size={18} weight="fill" className="text-primary" />
          <span className="text-sm font-bold text-foreground">
            {locale === "bg" ? "Оферти за теб" : "Offers for You"}
          </span>
        </div>
        <Link 
          href="/deals" 
          className="flex items-center gap-0.5 text-xs font-medium text-muted-foreground active:text-foreground"
        >
          {locale === "bg" ? "Виж всички" : "See all"}
          <ArrowRight size={12} weight="bold" />
        </Link>
      </div>
      
      {/* Horizontal scroll - same cards as Promoted */}
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-3 px-(--page-inset)">
          {OFFERS_FOR_YOU.map((product) => {
            const hasDiscount = product.originalPrice && product.originalPrice > product.price
            const discountPercent = hasDiscount 
              ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
              : 0

            return (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="shrink-0 w-40 active:opacity-80 transition-opacity"
              >
                {/* Same big card style as Promoted */}
                <div className="relative aspect-square rounded-md overflow-hidden bg-muted mb-2">
                  {/* Discount badge */}
                  {hasDiscount && (
                    <div className="absolute top-1.5 left-1.5 z-10 px-1.5 py-0.5 bg-destructive text-destructive-foreground text-2xs font-bold rounded">
                      -{discountPercent}%
                    </div>
                  )}
                  {/* Wishlist */}
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
                    className="absolute top-1.5 right-1.5 z-10 size-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center active:bg-background transition-colors"
                    aria-label="Add to wishlist"
                    style={{ display: hasDiscount ? 'none' : 'flex' }}
                  >
                    <Heart size={16} className="text-foreground" />
                  </button>
                  {/* Free shipping */}
                  {product.freeShipping && (
                    <div className="absolute bottom-1.5 left-1.5 z-10 px-1.5 py-0.5 bg-shipping-free text-background text-2xs font-medium rounded flex items-center gap-0.5">
                      <Truck size={10} weight="fill" />
                      Free
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Package size={36} className="text-muted-foreground/15" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="space-y-0.5">
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
                  <p className="text-xs text-foreground line-clamp-2 leading-snug">
                    {product.title}
                  </p>
                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    <Star size={11} weight="fill" className="text-rating" />
                    <span className="text-2xs text-muted-foreground">
                      {product.rating} <span className="opacity-60">({product.reviews?.toLocaleString()})</span>
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/**
 * TrustBadgesInline - Compact inline trust indicators
 */
function TrustBadgesInline({ locale }: { locale: string }) {
  const badges = [
    { icon: ShieldCheck, label: locale === "bg" ? "Защитени" : "Protected" },
    { icon: Truck, label: locale === "bg" ? "Бърза доставка" : "Fast Ship" },
    { icon: Tag, label: locale === "bg" ? "Топ цени" : "Best Prices" },
  ]
  
  return (
    <div className="mx-(--page-inset) my-3 flex items-center justify-between py-2.5 px-3 bg-muted/30 rounded-lg border border-border/30">
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
 * SearchOverlay - Full-screen search experience (worldclass mobile pattern)
 */
function SearchOverlay({
  open,
  onOpenChange,
  locale,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  locale: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState("")
  
  // Auto-focus input when overlay opens
  useEffect(() => {
    if (open && inputRef.current) {
      // Small delay to ensure animation has started
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [open])
  
  // Clear query when closing
  useEffect(() => {
    if (!open) {
      setQuery("")
    }
  }, [open])
  
  const recentSearches = [
    locale === "bg" ? "Безжични слушалки" : "Wireless headphones",
    locale === "bg" ? "iPhone кейс" : "iPhone case",
    locale === "bg" ? "Nike обувки" : "Nike shoes",
  ]
  
  const trendingSearches = [
    { term: locale === "bg" ? "AirPods Pro" : "AirPods Pro", hot: true },
    { term: locale === "bg" ? "Зимно яке" : "Winter jacket", hot: false },
    { term: locale === "bg" ? "PS5 контролер" : "PS5 controller", hot: true },
    { term: locale === "bg" ? "Ръчен часовник" : "Watch", hot: false },
  ]
  
  if (!open) return null
  
  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Search Header */}
      <header className="shrink-0 border-b border-border/40 pt-safe">
        <div className="h-14 px-(--page-inset) flex items-center gap-2">
          {/* Back button */}
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="size-10 -ml-2 flex items-center justify-center rounded-full active:bg-muted/60 transition-colors"
            aria-label="Close search"
          >
            <ArrowRight size={22} weight="bold" className="text-foreground rotate-180" />
          </button>
          
          {/* Search Input */}
          <div className="flex-1 relative">
            <MagnifyingGlass 
              size={18} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" 
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={locale === "bg" ? "Търси продукти..." : "Search products..."}
              className={cn(
                "w-full h-10 pl-10 pr-10 rounded-full",
                "bg-muted/50 border border-border/30",
                "text-sm text-foreground placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-transparent"
              )}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 size-7 flex items-center justify-center rounded-full hover:bg-muted active:bg-muted/80"
              >
                <X size={16} weight="bold" className="text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
      </header>
      
      {/* Search Content */}
      <div className="flex-1 overflow-y-auto">
        {query ? (
          /* Search Results Preview */
          <div className="px-(--page-inset) py-4">
            <p className="text-sm text-muted-foreground text-center py-8">
              {locale === "bg" 
                ? `Търсене за "${query}"...` 
                : `Searching for "${query}"...`}
            </p>
          </div>
        ) : (
          /* Default: Recent + Trending */
          <div className="py-4 space-y-6">
            {/* Recent Searches */}
            <section>
              <div className="px-(--page-inset) mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  {locale === "bg" ? "Скорошни търсения" : "Recent Searches"}
                </h3>
                <button 
                  type="button" 
                  className="text-xs text-muted-foreground active:text-foreground"
                >
                  {locale === "bg" ? "Изчисти" : "Clear"}
                </button>
              </div>
              <div className="px-(--page-inset) flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    className="h-9 px-3.5 rounded-full bg-muted/50 border border-border/30 text-sm text-foreground active:bg-muted transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </section>
            
            {/* Trending */}
            <section>
              <div className="px-(--page-inset) mb-2">
                <h3 className="text-sm font-semibold text-foreground">
                  {locale === "bg" ? "Популярни търсения" : "Trending"}
                </h3>
              </div>
              <div className="space-y-0.5">
                {trendingSearches.map(({ term, hot }, i) => (
                  <button
                    key={term}
                    type="button"
                    className="w-full flex items-center gap-3 px-(--page-inset) h-11 active:bg-muted/40 transition-colors text-left"
                  >
                    <span className="size-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                      {i + 1}
                    </span>
                    <span className="flex-1 text-sm text-foreground">{term}</span>
                    {hot && (
                      <Fire size={16} weight="fill" className="text-orange-500 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * FilterDrawer - Native filter drawer (no shadcn)
 */
function FilterDrawer({ 
  open, 
  onOpenChange, 
  locale,
  filters,
  onFiltersChange,
}: { 
  open: boolean
  onOpenChange: (open: boolean) => void
  locale: string
  filters: { minRating: number | null; freeShipping: boolean; condition: string | null }
  onFiltersChange: (filters: { minRating: number | null; freeShipping: boolean; condition: string | null }) => void
}) {
  const [pending, setPending] = useState(filters)

  // Reset pending when drawer opens
  useEffect(() => {
    if (open) {
      setPending(filters)
    }
  }, [open, filters])

  const handleApply = () => {
    onFiltersChange(pending)
    onOpenChange(false)
  }

  const handleClear = () => {
    setPending({ minRating: null, freeShipping: false, condition: null })
  }

  const conditions = [
    { value: "new", label: locale === "bg" ? "Нов" : "New" },
    { value: "like_new", label: locale === "bg" ? "Като нов" : "Like New" },
    { value: "used", label: locale === "bg" ? "Употребяван" : "Used" },
  ]

  return (
    <NativeDrawer open={open} onOpenChange={onOpenChange} side="bottom">
      {/* Header */}
      <div className="flex items-center justify-between px-(--page-inset) h-14 border-b border-border/50">
        <h2 className="text-base font-semibold">{locale === "bg" ? "Филтри" : "Filters"}</h2>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleClear}
            className="text-sm font-medium text-primary active:opacity-70"
          >
            {locale === "bg" ? "Изчисти" : "Clear"}
          </button>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="size-8 flex items-center justify-center rounded-full hover:bg-muted active:bg-muted/80"
          >
            <X size={18} weight="bold" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-(--page-inset) space-y-5">
        {/* Rating */}
        <div>
          <h3 className="text-sm font-semibold mb-2">{locale === "bg" ? "Рейтинг" : "Rating"}</h3>
          <div className="space-y-1">
            {[4, 3, 2].map((stars) => {
              const isActive = pending.minRating === stars
              return (
                <button
                  key={stars}
                  type="button"
                  onClick={() => setPending((p) => ({ ...p, minRating: isActive ? null : stars }))}
                  className={cn(
                    "w-full flex items-center gap-3 h-10 px-3 rounded-lg transition-colors text-left",
                    isActive ? "bg-muted/60" : "active:bg-muted/40"
                  )}
                >
                  <div className={cn(
                    "size-5 rounded border flex items-center justify-center transition-colors shrink-0",
                    isActive ? "bg-primary border-primary" : "border-input"
                  )}>
                    {isActive && <Check size={12} weight="bold" className="text-primary-foreground" />}
                  </div>
                  <div className="flex text-rating">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} weight={i < stars ? "fill" : "regular"} />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">{locale === "bg" ? "и нагоре" : "& up"}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Condition */}
        <div>
          <h3 className="text-sm font-semibold mb-2">{locale === "bg" ? "Състояние" : "Condition"}</h3>
          <div className="space-y-1">
            {conditions.map(({ value, label }) => {
              const isActive = pending.condition === value
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPending((p) => ({ ...p, condition: isActive ? null : value }))}
                  className={cn(
                    "w-full flex items-center gap-3 h-10 px-3 rounded-lg transition-colors text-left",
                    isActive ? "bg-muted/60" : "active:bg-muted/40"
                  )}
                >
                  <div className={cn(
                    "size-5 rounded border flex items-center justify-center transition-colors shrink-0",
                    isActive ? "bg-primary border-primary" : "border-input"
                  )}>
                    {isActive && <Check size={12} weight="bold" className="text-primary-foreground" />}
                  </div>
                  <span className="text-sm">{label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Free Shipping */}
        <div>
          <button
            type="button"
            onClick={() => setPending((p) => ({ ...p, freeShipping: !p.freeShipping }))}
            className={cn(
              "w-full flex items-center gap-3 h-10 px-3 rounded-lg transition-colors text-left",
              pending.freeShipping ? "bg-muted/60" : "active:bg-muted/40"
            )}
          >
            <div className={cn(
              "size-5 rounded border flex items-center justify-center transition-colors shrink-0",
              pending.freeShipping ? "bg-primary border-primary" : "border-input"
            )}>
              {pending.freeShipping && <Check size={12} weight="bold" className="text-primary-foreground" />}
            </div>
            <Truck size={16} className="text-shipping-free" />
            <span className="text-sm">{locale === "bg" ? "Безплатна доставка" : "Free Shipping"}</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-(--page-inset) border-t border-border/50 pb-safe">
        <button
          type="button"
          onClick={handleApply}
          className="w-full h-11 rounded-full bg-foreground text-background text-sm font-bold active:opacity-90 transition-opacity"
        >
          {locale === "bg" ? "Приложи филтри" : "Apply Filters"}
        </button>
      </div>
    </NativeDrawer>
  )
}

/**
 * SortDrawer - Native sort drawer (no shadcn)
 */
function SortDrawer({ 
  open, 
  onOpenChange, 
  locale,
  sortBy,
  onSortChange,
}: { 
  open: boolean
  onOpenChange: (open: boolean) => void
  locale: string
  sortBy: string
  onSortChange: (value: string) => void
}) {
  const options = [
    { value: "featured", label: locale === "bg" ? "Препоръчани" : "Featured" },
    { value: "newest", label: locale === "bg" ? "Най-нови" : "Newest" },
    { value: "price-asc", label: locale === "bg" ? "Цена: ниска → висока" : "Price: Low to High" },
    { value: "price-desc", label: locale === "bg" ? "Цена: висока → ниска" : "Price: High to Low" },
    { value: "rating", label: locale === "bg" ? "Най-висок рейтинг" : "Top Rated" },
  ]

  return (
    <NativeDrawer open={open} onOpenChange={onOpenChange} side="bottom" className="max-h-[50dvh]">
      {/* Header */}
      <div className="flex items-center justify-center pt-3 pb-2">
        <div className="h-1.5 w-12 rounded-full bg-muted-foreground/25" />
      </div>
      <div className="px-(--page-inset) pb-3 border-b border-border/50">
        <h2 className="text-base font-semibold text-center">{locale === "bg" ? "Сортирай по" : "Sort By"}</h2>
      </div>

      {/* Options */}
      <div className="py-2 pb-safe">
        {options.map(({ value, label }) => {
          const isActive = sortBy === value
          return (
            <button
              key={value}
              type="button"
              onClick={() => {
                onSortChange(value)
                onOpenChange(false)
              }}
              className={cn(
                "w-full flex items-center justify-between px-(--page-inset) h-11 transition-colors text-left",
                isActive ? "bg-muted/50 text-foreground" : "active:bg-muted/30"
              )}
            >
              <span className="text-sm font-medium">{label}</span>
              {isActive && <Check size={16} weight="bold" className="text-primary shrink-0" />}
            </button>
          )
        })}
      </div>
    </NativeDrawer>
  )
}

/**
 * InlineFilterSortBar - Filter and sort triggers with optional "View all" link
 */
/**
 * SubcategoryCircles - Visual browse circles (Temu pattern)
 * Only shown when a category is selected (not "All")
 */
function SubcategoryCircles({
  categorySlug,
  locale,
  onSubcategoryClick,
}: {
  categorySlug: string
  locale: string
  onSubcategoryClick?: (slug: string) => void
}) {
  const subcategories = MOCK_SUBCATEGORIES[categorySlug] || []
  
  if (subcategories.length === 0) return null
  
  const viewAllLabel = locale === "bg" ? "Виж всички" : "View all"
  
  return (
    <div className="py-3 overflow-x-auto no-scrollbar">
      <div className="flex items-start gap-3 px-(--page-inset)">
        {/* View All - First circle */}
        <Link
          href={`/categories/${categorySlug}`}
          className="flex flex-col items-center gap-1.5 shrink-0 w-16 active:opacity-80 transition-opacity"
        >
          <div className="size-14 rounded-full bg-foreground text-background flex items-center justify-center">
            <SquaresFour size={22} weight="fill" />
          </div>
          <span className="text-2xs text-center text-foreground font-semibold leading-tight line-clamp-2">
            {viewAllLabel}
          </span>
        </Link>
        
        {/* Subcategory circles */}
        {subcategories.map((sub) => (
          <button
            key={sub.slug}
            type="button"
            onClick={() => onSubcategoryClick?.(sub.slug)}
            className="flex flex-col items-center gap-1.5 shrink-0 w-16 active:opacity-80 transition-opacity"
          >
            {/* Circle with image/icon */}
            <div className="size-14 rounded-full bg-muted/50 border border-border/30 overflow-hidden flex items-center justify-center">
              {sub.image ? (
                <div className="size-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  <Package size={20} className="text-muted-foreground/40" />
                </div>
              ) : (
                <Package size={20} className="text-muted-foreground/40" />
              )}
            </div>
            {/* Label */}
            <span className="text-2xs text-center text-muted-foreground font-medium leading-tight line-clamp-2">
              {locale === "bg" ? sub.nameBg : sub.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

/**
 * InlineFilterSortBar - Single row: Title + count | Filters + Sort (clean, like main page)
 */
function InlineFilterSortBar({
  locale,
  onFiltersClick,
  onSortClick,
  productCount,
  sectionTitle,
}: {
  locale: string
  onFiltersClick: () => void
  onSortClick: () => void
  productCount: number
  sectionTitle: string
}) {
  return (
    <div className="px-(--page-inset) py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-bold text-foreground">{sectionTitle}</h2>
        <span className="text-xs text-muted-foreground">({productCount})</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onFiltersClick}
          className="flex items-center gap-1.5 h-9 px-3 border border-border/60 rounded-full text-xs font-medium active:bg-muted transition-colors"
        >
          <SlidersHorizontal className="size-3.5" />
          {locale === "bg" ? "Филтри" : "Filters"}
        </button>
        <button
          type="button"
          onClick={onSortClick}
          className="flex items-center gap-1.5 h-9 px-3 border border-border/60 rounded-full text-xs font-medium active:bg-muted transition-colors"
        >
          <ArrowUpDown className="size-3.5" />
          {locale === "bg" ? "Сортирай" : "Sort"}
        </button>
      </div>
    </div>
  )
}

/**
 * SellPromoBanner - CTA for sellers
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
          className="absolute top-1.5 right-1.5 z-10 size-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center active:bg-background transition-colors"
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
 * NewestListings - Main product grid with filtering
 */
function NewestListings({ 
  products, 
  activeCategory,
  locale,
  filters,
  sortBy,
}: { 
  products: MockProduct[]
  activeCategory: string
  locale: string
  filters: { minRating: number | null; freeShipping: boolean; condition: string | null }
  sortBy: string
}) {
  // Filter products
  const filteredProducts = useMemo(() => {
    let result = activeCategory === "all" 
      ? products 
      : products.filter(p => p.category === activeCategory)
    
    // Apply filters
    if (filters.minRating) {
      result = result.filter(p => p.rating >= filters.minRating!)
    }
    if (filters.freeShipping) {
      result = result.filter(p => p.freeShipping)
    }
    if (filters.condition) {
      result = result.filter(p => p.condition === filters.condition)
    }
    
    // Sort
    switch (sortBy) {
      case "newest":
        // Keep original order (assuming newest first)
        break
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price)
        break
      case "rating":
        result = [...result].sort((a, b) => b.rating - a.rating)
        break
    }
    
    return result
  }, [products, activeCategory, filters, sortBy])
  
  // Get section title
  const sectionTitle = useMemo(() => {
    if (activeCategory === "all") {
      return locale === "bg" ? "Най-нови обяви" : "Newest Listings"
    }
    const cat = MOCK_CATEGORIES.find(c => c.slug === activeCategory)
    return locale === "bg" ? cat?.nameBg : cat?.name
  }, [activeCategory, locale])
  
  return { filteredProducts, sectionTitle: sectionTitle || "" }
}

/**
 * BottomNavigation - Clean iOS-style tab bar
 * No floating elements, proper touch targets, pill-shaped active indicator
 */
function BottomNavigation({ locale }: { locale: string }) {
  const tabs = [
    { icon: House, label: locale === "bg" ? "Начало" : "Home", href: "/", active: true },
    { icon: SquaresFour, label: locale === "bg" ? "Разгледай" : "Browse", href: "/categories", active: false },
    { icon: Plus, label: locale === "bg" ? "Продай" : "Sell", href: "/sell", active: false, isPrimary: true },
    { icon: Heart, label: locale === "bg" ? "Любими" : "Wishlist", href: "/wishlist", active: false, badge: 7 },
    { icon: User, label: locale === "bg" ? "Профил" : "Profile", href: "/account", active: false },
  ]
  
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur-xl border-t border-border/50 pb-safe">
      <div className="flex items-stretch justify-around h-16">
        {tabs.map(({ icon: Icon, label, href, active, isPrimary, badge }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "relative flex-1 flex flex-col items-center justify-center gap-0.5 py-2",
              "active:bg-muted/40 transition-colors"
            )}
          >
            {/* Active indicator pill */}
            {active && (
              <span className="absolute top-1.5 inset-x-4 h-0.5 bg-foreground rounded-full" />
            )}
            
            {/* Icon container */}
            <span className={cn(
              "relative flex items-center justify-center",
              isPrimary && "size-10 -mt-0.5 bg-foreground text-background rounded-full"
            )}>
              <Icon 
                size={isPrimary ? 22 : 24} 
                weight={active || isPrimary ? "fill" : "regular"}
                className={cn(
                  isPrimary ? "text-background" : active ? "text-foreground" : "text-muted-foreground"
                )}
              />
              {/* Notification badge */}
              {badge && badge > 0 && (
                <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 bg-destructive text-destructive-foreground text-2xs font-bold rounded-full flex items-center justify-center">
                  {badge}
                </span>
              )}
            </span>
            
            {/* Label - always visible */}
            <span className={cn(
              "text-2xs leading-tight",
              active || isPrimary ? "font-semibold text-foreground" : "font-medium text-muted-foreground"
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
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [sortDrawerOpen, setSortDrawerOpen] = useState(false)
  const [filters, setFilters] = useState<{ minRating: number | null; freeShipping: boolean; condition: string | null }>({
    minRating: null,
    freeShipping: false,
    condition: null,
  })
  const [sortBy, setSortBy] = useState("featured")
  
  // Get filtered products and section title
  const { filteredProducts, sectionTitle } = NewestListings({
    products: MOCK_PRODUCTS,
    activeCategory,
    locale,
    filters,
    sortBy,
  })
  
  // Split products for interstitial pattern
  const firstProducts = filteredProducts.slice(0, 4)
  const restProducts = filteredProducts.slice(4)
  
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hamburger Menu Drawer */}
      <HamburgerMenu open={menuOpen} onOpenChange={setMenuOpen} locale={locale} />
      
      {/* Search Overlay */}
      <SearchOverlay 
        open={searchOpen} 
        onOpenChange={setSearchOpen} 
        locale={locale} 
      />
      
      {/* Unified Header: Hamburger + Logo + Search + Category Pills */}
      <MobileHeader 
        onSearchFocus={() => setSearchOpen(true)}
        onMenuOpen={() => setMenuOpen(true)}
        categories={MOCK_CATEGORIES}
        activeCategory={activeCategory}
        onCategorySelect={setActiveCategory}
        locale={locale}
      />
      
      {/* Main Content */}
      <div className="pb-4">
        {/* Promoted Listings - Only on "All" tab, bigger horizontal cards */}
        {activeCategory === "all" && (
          <PromotedListings locale={locale} />
        )}
        
        {/* Offers For You - horizontal scroll (only on "All" tab) */}
        {activeCategory === "all" && (
          <OffersForYou locale={locale} />
        )}
        
        {/* Subcategory Circles - Visual browse when category selected (Temu pattern) */}
        {activeCategory !== "all" && (
          <SubcategoryCircles
            categorySlug={activeCategory}
            locale={locale}
            onSubcategoryClick={(slug) => console.log("Subcategory clicked:", slug)}
          />
        )}
        
        {/* Filter/Sort Bar */}
        <InlineFilterSortBar
          locale={locale}
          onFiltersClick={() => setFilterDrawerOpen(true)}
          onSortClick={() => setSortDrawerOpen(true)}
          productCount={filteredProducts.length}
          sectionTitle={sectionTitle}
        />
        
        {/* First batch of products */}
        <div className="px-(--page-inset) grid grid-cols-2 gap-3">
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
          <div className="px-(--page-inset) grid grid-cols-2 gap-3">
            {restProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        
        {/* Empty state */}
        {filteredProducts.length === 0 && (
          <div className="px-(--page-inset) py-12 text-center">
            <Package size={48} className="mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">
              {locale === "bg" 
                ? "Няма продукти с тези филтри" 
                : "No products match your filters"}
            </p>
          </div>
        )}
      </div>
      
      {/* Sell CTA */}
      <SellPromoBanner locale={locale} />
      
      {/* Load More */}
      <div className="px-(--page-inset) pb-4">
        <button
          type="button"
          className="w-full h-11 rounded-md border border-border text-sm font-semibold text-foreground active:bg-muted transition-colors"
        >
          {locale === "bg" ? "Зареди още" : "Load more"}
        </button>
      </div>
      
      {/* Filter Drawer */}
      <FilterDrawer
        open={filterDrawerOpen}
        onOpenChange={setFilterDrawerOpen}
        locale={locale}
        filters={filters}
        onFiltersChange={setFilters}
      />
      
      {/* Sort Drawer */}
      <SortDrawer
        open={sortDrawerOpen}
        onOpenChange={setSortDrawerOpen}
        locale={locale}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      
      {/* Bottom Navigation */}
      <BottomNavigation locale={locale} />
    </div>
  )
}
