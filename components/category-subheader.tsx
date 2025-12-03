"use client"

import * as React from "react"
import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { 
  CaretDown,
  Monitor, 
  House, 
  GameController, 
  TShirt, 
  Baby, 
  Heart, 
  Car, 
  BookOpen, 
  Barbell, 
  Dog, 
  Lightbulb,
  ShoppingCart,
  Diamond,
  Palette,
  Gift,
  CaretRight,
  Camera,
  Ticket,
  Package,
  Buildings,
  Wrench,
  MusicNote,
  FilmStrip,
  PaintBrush,
  Flask,
  GraduationCap,
  Cpu,
  Leaf,
  Plant,
  Lightning,
  Storefront,
  Truck,
  Flag,
  Desktop,
  ArrowRight
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { Link } from "@/i18n/routing"
import { useLocale } from "next-intl"

interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
  icon?: string | null
  image_url?: string | null
  children?: Category[]
}

// Map category slugs to Phosphor icons
const categoryIconMap: Record<string, React.ReactNode> = {
  "electronics": <Monitor size={16} weight="regular" />,
  "computers": <Cpu size={16} weight="regular" />,
  "fashion": <TShirt size={16} weight="regular" />,
  "home": <House size={16} weight="regular" />,
  "gaming": <GameController size={16} weight="regular" />,
  "sports": <Barbell size={16} weight="regular" />,
  "beauty": <Palette size={16} weight="regular" />,
  "toys": <Gift size={16} weight="regular" />,
  "books": <BookOpen size={16} weight="regular" />,
  "automotive": <Car size={16} weight="regular" />,
  "health-wellness": <Heart size={16} weight="regular" />,
  "baby-kids": <Baby size={16} weight="regular" />,
  "pets": <Dog size={16} weight="regular" />,
  "smart-home": <Lightbulb size={16} weight="regular" />,
  "grocery": <ShoppingCart size={16} weight="regular" />,
  "jewelry-watches": <Diamond size={16} weight="regular" />,
  "real-estate": <Buildings size={16} weight="regular" />,
  "tickets": <Ticket size={16} weight="regular" />,
  "gift-cards": <Gift size={16} weight="regular" />,
  "tools-home": <Wrench size={16} weight="regular" />,
  "musical-instruments": <MusicNote size={16} weight="regular" />,
  "movies-music": <FilmStrip size={16} weight="regular" />,
  "handmade": <PaintBrush size={16} weight="regular" />,
  "industrial": <Flask size={16} weight="regular" />,
  "office-school": <GraduationCap size={16} weight="regular" />,
  "collectibles": <Diamond size={16} weight="regular" />,
  "garden-outdoor": <Plant size={16} weight="regular" />,
  "software": <Desktop size={16} weight="regular" />,
  "agriculture": <Leaf size={16} weight="regular" />,
  "e-mobility": <Lightning size={16} weight="regular" />,
  "services": <Storefront size={16} weight="regular" />,
  "wholesale": <Truck size={16} weight="regular" />,
  "bulgarian-traditional": <Flag size={16} weight="regular" />,
  "cameras": <Camera size={16} weight="regular" />,
}

function getCategoryIcon(slug: string): React.ReactNode {
  return categoryIconMap[slug] || <Package size={16} weight="regular" />
}

// Maximum categories to show in the subheader
const MAX_VISIBLE_CATEGORIES = 13

// eBay-style mega menu config
// Each L0 category has: featured (most popular L1s to show with their L2s) + banner config
interface MegaMenuConfig {
  // Featured L1 category slugs - the most important ones to highlight (show with L2 children)
  featured: string[]
  // Max items to show per column (default 5 for compact look)
  maxItems?: number
  // Show L1 categories directly instead of drilling into L2 children
  // If true, each column shows L1 categories with column header
  showL1sDirectly?: boolean
  // Column headers when using showL1sDirectly
  columnHeaders?: { title: string; titleBg: string }[]
  // Banner CTA config
  banner: {
    title: string
    titleBg: string
    subtitle: string
    subtitleBg: string
    cta: string
    ctaBg: string
    image: string
    href: string
  }
}

// Maximum items to show per column for compact menus
const MAX_MENU_ITEMS = 4

const MEGA_MENU_CONFIG: Record<string, MegaMenuConfig> = {
  "fashion": {
    // NEW STRUCTURE: L1 = Men's/Women's, L2 = Clothing/Shoes/Accessories, L3 = specific items
    // Show Men's and Women's with their L2 product types (Clothing, Shoes, Accessories)
    featured: ["fashion-mens", "fashion-womens"],
    banner: {
      title: "New Season Arrivals",
      titleBg: "Нови предложения",
      subtitle: "Discover the latest trends in fashion",
      subtitleBg: "Открийте най-новите модни тенденции",
      cta: "Shop Now",
      ctaBg: "Пазарувай",
      image: "/diverse-fashion-collection.png",
      href: "/categories/fashion"
    }
  },
  "electronics": {
    featured: ["phones-tablets", "tv-audio"],
    banner: {
      title: "Tech Deals",
      titleBg: "Техника на промо цени",
      subtitle: "Save big on the latest electronics",
      subtitleBg: "Спестете от най-новата електроника",
      cta: "View Deals",
      ctaBg: "Виж оферти",
      image: "/modern-smartphone.png",
      href: "/categories/electronics"
    }
  },
  "computers": {
    featured: ["laptops", "components"],
    banner: {
      title: "Power Up Your Setup",
      titleBg: "Ъпгрейднете сетъпа си",
      subtitle: "Laptops, desktops & components",
      subtitleBg: "Лаптопи, десктопи и компоненти",
      cta: "Shop Computers",
      ctaBg: "Виж компютри",
      image: "/modern-computer-setup.png",
      href: "/categories/computers"
    }
  },
  "automotive": {
    featured: ["vehicles", "auto-parts"],
    banner: {
      title: "Auto Essentials",
      titleBg: "Авто екипировка",
      subtitle: "Parts, accessories & vehicles",
      subtitleBg: "Части, аксесоари и превозни средства",
      cta: "Shop Auto",
      ctaBg: "Виж авто",
      image: "/retro-living-room-tv.png",
      href: "/categories/automotive"
    }
  },
  "home": {
    featured: ["furniture", "kitchen-dining"],
    banner: {
      title: "Home Essentials",
      titleBg: "За дома",
      subtitle: "Transform your living space",
      subtitleBg: "Трансформирайте дома си",
      cta: "Shop Home",
      ctaBg: "Виж за дома",
      image: "/cozy-cabin-interior.png",
      href: "/categories/home"
    }
  },
  "sports": {
    featured: ["fitness", "cycling"],
    banner: {
      title: "Get Active",
      titleBg: "Бъди активен",
      subtitle: "Gear up for your next adventure",
      subtitleBg: "Екипирай се за следващото приключение",
      cta: "Shop Sports",
      ctaBg: "Виж спорт",
      image: "/fitness-watch.jpg",
      href: "/categories/sports"
    }
  },
  "beauty": {
    featured: ["skincare", "makeup"],
    banner: {
      title: "Beauty Favorites",
      titleBg: "Красота",
      subtitle: "Skincare & makeup essentials",
      subtitleBg: "Грижа за кожата и грим",
      cta: "Shop Beauty",
      ctaBg: "Виж красота",
      image: "/abstract-beauty.png",
      href: "/categories/beauty"
    }
  },
  "gaming": {
    featured: ["consoles", "video-games"],
    banner: {
      title: "Game On",
      titleBg: "Време за игра",
      subtitle: "Consoles, games & accessories",
      subtitleBg: "Конзоли, игри и аксесоари",
      cta: "Shop Gaming",
      ctaBg: "Виж гейминг",
      image: "/gaming-setup.png",
      href: "/categories/gaming"
    }
  },
  "toys": {
    featured: ["building-toys", "educational-toys"],
    banner: {
      title: "Playtime Fun",
      titleBg: "Време за игра",
      subtitle: "Toys for all ages",
      subtitleBg: "Играчки за всички възрасти",
      cta: "Shop Toys",
      ctaBg: "Виж играчки",
      image: "/colorful-toy-collection.png",
      href: "/categories/toys"
    }
  },
  "baby-kids": {
    featured: ["baby-gear", "kids-toys"],
    banner: {
      title: "For Little Ones",
      titleBg: "За малчуганите",
      subtitle: "Everything for babies & kids",
      subtitleBg: "Всичко за бебета и деца",
      cta: "Shop Baby",
      ctaBg: "Виж бебе",
      image: "/colorful-toy-collection.png",
      href: "/categories/baby-kids"
    }
  },
  "pets": {
    featured: ["dogs", "cats"],
    banner: {
      title: "Pet Paradise",
      titleBg: "За домашните любимци",
      subtitle: "Food, toys & supplies",
      subtitleBg: "Храна, играчки и аксесоари",
      cta: "Shop Pets",
      ctaBg: "Виж зоо",
      image: "/placeholder.jpg",
      href: "/categories/pets"
    }
  },
  "books": {
    featured: ["fiction", "non-fiction"],
    banner: {
      title: "Reading Corner",
      titleBg: "Кът за четене",
      subtitle: "Books for every interest",
      subtitleBg: "Книги за всеки вкус",
      cta: "Shop Books",
      ctaBg: "Виж книги",
      image: "/placeholder.jpg",
      href: "/categories/books"
    }
  },
  "jewelry-watches": {
    featured: ["watches", "fine-jewelry"],
    banner: {
      title: "Timeless Elegance",
      titleBg: "Вечна елегантност",
      subtitle: "Watches & fine jewelry",
      subtitleBg: "Часовници и бижута",
      cta: "Shop Jewelry",
      ctaBg: "Виж бижута",
      image: "/placeholder.jpg",
      href: "/categories/jewelry-watches"
    }
  },
  "garden-outdoor": {
    featured: ["outdoor-furniture", "garden-tools"],
    banner: {
      title: "Outdoor Living",
      titleBg: "Градина и двор",
      subtitle: "Everything for your garden",
      subtitleBg: "Всичко за градината",
      cta: "Shop Garden",
      ctaBg: "Виж градина",
      image: "/placeholder.jpg",
      href: "/categories/garden-outdoor"
    }
  },
  "health-wellness": {
    featured: ["vitamins-supplements", "medical-supplies"],
    banner: {
      title: "Wellness Essentials",
      titleBg: "Здраве и wellness",
      subtitle: "Vitamins & health products",
      subtitleBg: "Витамини и здравни продукти",
      cta: "Shop Health",
      ctaBg: "Виж здраве",
      image: "/placeholder.jpg",
      href: "/categories/health-wellness"
    }
  },
  "smart-home": {
    featured: ["smart-security", "smart-speakers"],
    banner: {
      title: "Smart Living",
      titleBg: "Умен дом",
      subtitle: "Automate your home",
      subtitleBg: "Автоматизирайте дома си",
      cta: "Shop Smart",
      ctaBg: "Виж умен дом",
      image: "/smart-speaker.jpg",
      href: "/categories/smart-home"
    }
  },
  "tools-home": {
    featured: ["power-tools", "hand-tools"],
    banner: {
      title: "DIY Tools",
      titleBg: "Инструменти",
      subtitle: "Power & hand tools",
      subtitleBg: "Електро и ръчни инструменти",
      cta: "Shop Tools",
      ctaBg: "Виж инструменти",
      image: "/placeholder.jpg",
      href: "/categories/tools-home"
    }
  },
  "office-school": {
    featured: ["office-supplies", "school-supplies"],
    banner: {
      title: "Office & School",
      titleBg: "Офис и училище",
      subtitle: "Supplies for work & study",
      subtitleBg: "Консумативи за работа и учене",
      cta: "Shop Supplies",
      ctaBg: "Виж консумативи",
      image: "/office-chair.jpg",
      href: "/categories/office-school"
    }
  },
  "musical-instruments": {
    featured: ["guitars-basses", "keyboards-pianos"],
    banner: {
      title: "Make Music",
      titleBg: "Създавай музика",
      subtitle: "Instruments & gear",
      subtitleBg: "Инструменти и оборудване",
      cta: "Shop Instruments",
      ctaBg: "Виж инструменти",
      image: "/placeholder.jpg",
      href: "/categories/musical-instruments"
    }
  },
  "movies-music": {
    featured: ["vinyl-records", "dvds-bluray"],
    banner: {
      title: "Entertainment",
      titleBg: "Забавление",
      subtitle: "Movies, music & more",
      subtitleBg: "Филми, музика и още",
      cta: "Shop Media",
      ctaBg: "Виж медия",
      image: "/diverse-people-listening-headphones.png",
      href: "/categories/movies-music"
    }
  },
  "collectibles": {
    featured: ["art", "antiques"],
    banner: {
      title: "Collectibles",
      titleBg: "Колекционерски",
      subtitle: "Art, antiques & rare finds",
      subtitleBg: "Изкуство, антики и редки находки",
      cta: "Explore",
      ctaBg: "Разгледай",
      image: "/vintage-camera-still-life.png",
      href: "/categories/collectibles"
    }
  },
  "grocery": {
    featured: ["pantry-staples", "beverages"],
    banner: {
      title: "Grocery & Food",
      titleBg: "Храна и напитки",
      subtitle: "Quality food products",
      subtitleBg: "Качествени хранителни продукти",
      cta: "Shop Grocery",
      ctaBg: "Виж храна",
      image: "/placeholder.jpg",
      href: "/categories/grocery"
    }
  },
  "handmade": {
    featured: ["handmade-jewelry", "home-decor-crafts"],
    banner: {
      title: "Handmade & Unique",
      titleBg: "Ръчна изработка",
      subtitle: "One-of-a-kind creations",
      subtitleBg: "Уникални творения",
      cta: "Shop Handmade",
      ctaBg: "Виж ръчна изработка",
      image: "/placeholder.jpg",
      href: "/categories/handmade"
    }
  },
  "industrial": {
    featured: ["industrial-equipment", "lab-equipment"],
    banner: {
      title: "Industrial & Lab",
      titleBg: "Индустриално",
      subtitle: "Professional equipment",
      subtitleBg: "Професионално оборудване",
      cta: "Shop Industrial",
      ctaBg: "Виж индустриално",
      image: "/placeholder.jpg",
      href: "/categories/industrial"
    }
  },
  "software": {
    featured: ["office-software", "security-software"],
    banner: {
      title: "Software",
      titleBg: "Софтуер",
      subtitle: "Digital products & licenses",
      subtitleBg: "Дигитални продукти и лицензи",
      cta: "Shop Software",
      ctaBg: "Виж софтуер",
      image: "/placeholder.jpg",
      href: "/categories/software"
    }
  },
  "services": {
    featured: ["home-services", "professional-services"],
    banner: {
      title: "Services",
      titleBg: "Услуги",
      subtitle: "Find trusted professionals",
      subtitleBg: "Намерете доверени професионалисти",
      cta: "Browse Services",
      ctaBg: "Виж услуги",
      image: "/placeholder.jpg",
      href: "/categories/services"
    }
  },
  "real-estate": {
    featured: ["residential-sales", "residential-rentals"],
    banner: {
      title: "Real Estate",
      titleBg: "Имоти",
      subtitle: "Find your new home",
      subtitleBg: "Намерете новия си дом",
      cta: "Browse Properties",
      ctaBg: "Виж имоти",
      image: "/cozy-cabin-interior.png",
      href: "/categories/real-estate"
    }
  },
  "gift-cards": {
    featured: ["retail-gift-cards", "restaurant-gift-cards"],
    banner: {
      title: "Gift Cards",
      titleBg: "Ваучери",
      subtitle: "The perfect gift",
      subtitleBg: "Перфектният подарък",
      cta: "Shop Gift Cards",
      ctaBg: "Виж ваучери",
      image: "/placeholder.jpg",
      href: "/categories/gift-cards"
    }
  },
  "bulgarian-traditional": {
    featured: ["traditional-foods", "folk-costumes"],
    banner: {
      title: "Bulgarian Treasures",
      titleBg: "Българско",
      subtitle: "Traditional products from Bulgaria",
      subtitleBg: "Традиционни продукти от България",
      cta: "Discover",
      ctaBg: "Открий",
      image: "/placeholder.jpg",
      href: "/categories/bulgarian-traditional"
    }
  },
  "e-mobility": {
    featured: ["electric-vehicles", "e-scooters"],
    banner: {
      title: "E-Mobility",
      titleBg: "Електромобилност",
      subtitle: "Electric vehicles & more",
      subtitleBg: "Електромобили и още",
      cta: "Go Electric",
      ctaBg: "Виж електро",
      image: "/placeholder.jpg",
      href: "/categories/e-mobility"
    }
  },
  "hobbies": {
    featured: ["hobby-rc-drones", "hobby-tcg"],
    banner: {
      title: "Hobby Zone",
      titleBg: "Хоби зона",
      subtitle: "RC, models, trading cards & more",
      subtitleBg: "RC, модели, колекционерски карти и още",
      cta: "Explore Hobbies",
      ctaBg: "Виж хоби",
      image: "/placeholder.jpg",
      href: "/categories/hobbies"
    }
  }
}

// Cache categories globally
let categoriesCache: Category[] | null = null
let categoriesFetching = false
let categoriesCallbacks: Array<(cats: Category[]) => void> = []
let cacheTimestamp: number = 0
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes TTL

export function CategorySubheader() {
  const locale = useLocale()
  const [categories, setCategories] = useState<Category[]>(categoriesCache || [])
  const [isLoading, setIsLoading] = useState(!categoriesCache)
  const [activeCategory, setActiveCategory] = useState<Category | null>(null)
  const [headerHeight, setHeaderHeight] = useState(64)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Measure header height for dropdown positioning
  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector('header')
      if (header) {
        setHeaderHeight(header.offsetHeight)
      }
    }
    
    updateHeaderHeight()
    window.addEventListener('resize', updateHeaderHeight)
    return () => window.removeEventListener('resize', updateHeaderHeight)
  }, [])

  // Fetch categories with depth=3 to get full hierarchy: L0 -> L1 -> L2 -> L3
  useEffect(() => {
    const now = Date.now()
    const cacheExpired = now - cacheTimestamp > CACHE_TTL
    
    if (categoriesCache && !cacheExpired) {
      setCategories(categoriesCache)
      setIsLoading(false)
      return
    }
    
    if (cacheExpired) {
      categoriesCache = null
    }

    if (categoriesFetching) {
      categoriesCallbacks.push((cats) => {
        setCategories(cats)
        setIsLoading(false)
      })
      return
    }

    categoriesFetching = true
    // IMPORTANT: depth=3 fetches L0 -> L1 -> L2 -> L3 (full Fashion hierarchy)
    fetch("/api/categories?children=true&depth=3", { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        const cats = data.categories || []
        categoriesCache = cats
        cacheTimestamp = Date.now()
        setCategories(cats)
        categoriesCallbacks.forEach(cb => cb(cats))
        categoriesCallbacks = []
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err)
      })
      .finally(() => {
        categoriesFetching = false
        setIsLoading(false)
      })
  }, [])

  const getCategoryName = useCallback((cat: Category) => {
    if (locale === 'bg' && cat.name_bg) {
      return cat.name_bg
    }
    return cat.name
  }, [locale])

  const handleMouseEnter = useCallback((category: Category) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setActiveCategory(category)
  }, [])

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setActiveCategory(null)
    }, 150)
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Calculate column layout for mega menu - eBay-style: 2 columns (25%) + banner CTA (50%)
  const megaMenuContent = useMemo(() => {
    if (!activeCategory?.children?.length) return null
    if (activeCategory.id === "more-categories") return null // Handle separately

    const children = activeCategory.children
    const menuConfig = MEGA_MENU_CONFIG[activeCategory.slug]
    
    if (menuConfig) {
      // eBay-style: 2 featured L1 columns (25% each) + banner CTA (50%)
      const featuredL1s = menuConfig.featured
        .map(slug => children.find(c => c.slug === slug))
        .filter((c): c is Category => c !== undefined)
      
      // Other L1 categories not in featured
      const otherL1s = children.filter(c => !menuConfig.featured.includes(c.slug))

      return { 
        type: 'ebay' as const, 
        featuredL1s,
        otherL1s,
        banner: menuConfig.banner,
        maxItems: menuConfig.maxItems || MAX_MENU_ITEMS,
        showL1sDirectly: menuConfig.showL1sDirectly || false,
        columnHeaders: menuConfig.columnHeaders
      }
    } else {
      // Fallback: Simple 4-column layout with all L1 categories
      const itemsPerColumn = Math.ceil(children.length / 4)
      const columns: Category[][] = []
      
      for (let i = 0; i < children.length; i += itemsPerColumn) {
        columns.push(children.slice(i, i + itemsPerColumn))
      }

      return { type: 'simple' as const, columns }
    }
  }, [activeCategory])

  if (isLoading) {
    return (
      <div className="flex items-center gap-1 h-10 px-2">
        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
      </div>
    )
  }

  // English has longer words, show fewer categories
  const maxVisible = locale === "bg" ? MAX_VISIBLE_CATEGORIES : MAX_VISIBLE_CATEGORIES - 1
  const visibleCategories = categories.slice(0, maxVisible)
  const moreCategories = categories.slice(maxVisible)
  const showMoreButton = moreCategories.length > 0

  const moreCategoryVirtual: Category = {
    id: "more-categories",
    name: "More Categories",
    name_bg: "Още категории",
    slug: "more",
    children: moreCategories
  }

  return (
    <>
      <div className="flex items-center w-full">
        <div className="flex items-center gap-0.5 flex-1">
          {visibleCategories.map((category) => {
            const hasChildren = category.children && category.children.length > 0
            const isActive = activeCategory?.id === category.id

            return (
              <div
                key={category.id}
                className="relative"
                onMouseEnter={() => handleMouseEnter(category)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={`/categories/${category.slug}`}
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-2.5 text-sm font-medium transition-colors whitespace-nowrap",
                    "text-foreground hover:text-brand hover:underline",
                    isActive && "text-brand"
                  )}
                >
                  <span>{getCategoryName(category)}</span>
                  {hasChildren && (
                    <CaretDown 
                      size={10} 
                      weight="fill" 
                      className={cn(
                        "transition-transform duration-200 opacity-60",
                        isActive && "rotate-180"
                      )} 
                    />
                  )}
                </Link>
              </div>
            )
          })}
        </div>

        {showMoreButton && (
          <div
            className="relative shrink-0"
            onMouseEnter={() => handleMouseEnter(moreCategoryVirtual)}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={cn(
                "flex items-center gap-1 px-2.5 py-2.5 text-sm font-medium transition-colors whitespace-nowrap",
                "text-foreground hover:text-brand hover:underline",
                activeCategory?.id === "more-categories" && "text-brand"
              )}
            >
              <span>{locale === "bg" ? "Още" : "View All"}</span>
              <CaretDown 
                size={10} 
                weight="fill" 
                className={cn(
                  "transition-transform duration-200 opacity-60",
                  activeCategory?.id === "more-categories" && "rotate-180"
                )} 
              />
            </button>
          </div>
        )}
      </div>

      {/* Mega Menu Dropdown */}
      {activeCategory && activeCategory.children && activeCategory.children.length > 0 && (
        <>
          <div
            className={cn(
              "fixed left-0 right-0 z-50",
              "bg-background border-b border-border"
            )}
            style={{ top: `${headerHeight}px` }}
            onMouseEnter={() => {
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
              }
            }}
            onMouseLeave={handleMouseLeave}
          >
            <div className="container py-6 max-h-[70vh] overflow-y-auto">
              {/* Mega Menu Grid - eBay Style */}
              {megaMenuContent && (
                <>
                  {megaMenuContent.type === 'ebay' ? (
                    // eBay-style: 2 category columns (25% each) + banner CTA (50%)
                    <div className="flex gap-6 items-stretch">
                      {/* Left side - 2 category columns (50% total) */}
                      <div className="w-1/2 grid grid-cols-2 gap-6">
                        {megaMenuContent.showL1sDirectly ? (
                          // Show L1 categories directly - split into 2 columns with custom headers
                          <>
                            {[0, 1].map((colIndex) => {
                              const maxItems = megaMenuContent.maxItems || MAX_MENU_ITEMS
                              const columnL1s = megaMenuContent.featuredL1s.slice(
                                colIndex * maxItems, 
                                (colIndex + 1) * maxItems
                              )
                              const header = megaMenuContent.columnHeaders?.[colIndex]
                              
                              return (
                                <div key={colIndex} className="flex flex-col">
                                  {/* Column Header */}
                                  {header && (
                                    <span className="text-sm font-bold text-foreground mb-3">
                                      {locale === "bg" ? header.titleBg : header.title}
                                    </span>
                                  )}
                                  
                                  {/* L1 Categories as links */}
                                  <ul className="space-y-1.5 flex-1">
                                    {columnL1s.map((l1) => (
                                      <li key={l1.id}>
                                        <Link
                                          href={`/categories/${l1.slug}`}
                                          onClick={() => setActiveCategory(null)}
                                          className="text-sm text-muted-foreground hover:underline transition-colors block"
                                        >
                                          {getCategoryName(l1)}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                  
                                  {/* "See all Fashion" at bottom of first column only */}
                                  {colIndex === 0 && (
                                    <Link
                                      href={`/categories/${activeCategory?.slug}`}
                                      onClick={() => setActiveCategory(null)}
                                      className="text-sm text-brand hover:underline font-medium transition-colors inline-flex items-center gap-1 mt-3"
                                    >
                                      {locale === "bg" ? "Виж всички" : "See all"}
                                      <CaretRight size={12} weight="bold" />
                                    </Link>
                                  )}
                                </div>
                              )
                            })}
                          </>
                        ) : (
                          // Default: Featured L1 columns with their L2 children
                          megaMenuContent.featuredL1s.map((l1Category, index) => {
                            const maxItems = megaMenuContent.maxItems || MAX_MENU_ITEMS
                            return (
                            <div key={l1Category.id} className="flex flex-col">
                              {/* L1 Header */}
                              <Link
                                href={`/categories/${l1Category.slug}`}
                                onClick={() => setActiveCategory(null)}
                                className="flex items-center gap-1.5 text-sm font-bold text-foreground hover:underline transition-colors mb-3 group"
                              >
                                {getCategoryName(l1Category)}
                                <CaretRight size={12} weight="bold" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                              </Link>
                              
                              {/* L2 Children - limited to maxItems */}
                              {l1Category.children && l1Category.children.length > 0 ? (
                                <ul className="space-y-1.5 flex-1">
                                  {l1Category.children.slice(0, maxItems).map((l2) => (
                                    <li key={l2.id}>
                                      <Link
                                        href={`/categories/${l2.slug}`}
                                        onClick={() => setActiveCategory(null)}
                                        className="text-sm text-muted-foreground hover:underline transition-colors block"
                                      >
                                        {getCategoryName(l2)}
                                      </Link>
                                    </li>
                                  ))}
                                  {/* Top Deals row - fills 5th row space */}
                                  <li>
                                    <Link
                                      href={`/categories/${l1Category.slug}?sort=deals`}
                                      onClick={() => setActiveCategory(null)}
                                      className="text-sm text-red-600 hover:underline transition-colors block font-medium"
                                    >
                                      {locale === "bg" ? "Топ оферти" : "Top Deals"}
                                    </Link>
                                  </li>
                                </ul>
                              ) : (
                                // If no L2 children, show other L1s from this category
                                <ul className="space-y-1.5 flex-1">
                                  {megaMenuContent.otherL1s.slice(index * maxItems, (index + 1) * maxItems).map((otherL1) => (
                                    <li key={otherL1.id}>
                                      <Link
                                        href={`/categories/${otherL1.slug}`}
                                        onClick={() => setActiveCategory(null)}
                                        className="text-sm text-muted-foreground hover:underline transition-colors block"
                                      >
                                        {getCategoryName(otherL1)}
                                      </Link>
                                    </li>
                                  ))}
                                  {/* Top Deals row - fills 5th row space */}
                                  <li>
                                    <Link
                                      href={`/categories/${activeCategory?.slug}?sort=deals`}
                                      onClick={() => setActiveCategory(null)}
                                      className="text-sm text-red-600 hover:underline transition-colors block font-medium"
                                    >
                                      {locale === "bg" ? "Топ оферти" : "Top Deals"}
                                    </Link>
                                  </li>
                                </ul>
                              )}
                              {/* Always show "See all" at bottom */}
                              <Link
                                href={`/categories/${l1Category.slug}`}
                                onClick={() => setActiveCategory(null)}
                                className="text-sm text-brand hover:underline font-medium transition-colors inline-flex items-center gap-1 mt-3"
                              >
                                {locale === "bg" ? "Виж всички" : "See all"}
                                <CaretRight size={12} weight="bold" />
                              </Link>
                            </div>
                          )})
                        )}
                      </div>

                      {/* Right side - Banner CTA (50%) */}
                      <Link
                        href={megaMenuContent.banner.href}
                        onClick={() => setActiveCategory(null)}
                        className="w-1/2 relative rounded-xl overflow-hidden group"
                      >
                        {/* Background Image */}
                        <div 
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${megaMenuContent.banner.image})` }}
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                        
                        {/* Content */}
                        <div className="relative z-10 h-full flex flex-col justify-center p-8 text-white">
                          <h3 className="text-2xl font-bold mb-2">
                            {locale === "bg" ? megaMenuContent.banner.titleBg : megaMenuContent.banner.title}
                          </h3>
                          <p className="text-white/80 text-sm mb-4 max-w-xs">
                            {locale === "bg" ? megaMenuContent.banner.subtitleBg : megaMenuContent.banner.subtitle}
                          </p>
                          <div className="inline-flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium w-fit group-hover:bg-brand/90">
                            {locale === "bg" ? megaMenuContent.banner.ctaBg : megaMenuContent.banner.cta}
                            <ArrowRight size={16} weight="bold" />
                          </div>
                        </div>
                      </Link>
                    </div>
                  ) : (
                    // Simple fallback layout - grid of L1 categories
                    <div className={cn(
                      "grid gap-8",
                      megaMenuContent.columns.length === 1 && "grid-cols-1",
                      megaMenuContent.columns.length === 2 && "grid-cols-2",
                      megaMenuContent.columns.length === 3 && "grid-cols-3",
                      megaMenuContent.columns.length >= 4 && "grid-cols-4"
                    )}>
                      {megaMenuContent.columns.map((column, colIndex) => (
                        <div key={colIndex}>
                          <ul className="space-y-2">
                            {column.map((l1Category) => (
                              <li key={l1Category.id}>
                                <Link
                                  href={`/categories/${l1Category.slug}`}
                                  onClick={() => setActiveCategory(null)}
                                  className="flex items-center gap-2 text-sm text-foreground hover:text-brand transition-colors py-1 group"
                                >
                                  <span className="text-muted-foreground group-hover:text-brand transition-colors">
                                    {getCategoryIcon(l1Category.slug)}
                                  </span>
                                  {getCategoryName(l1Category)}
                                  {l1Category.children && l1Category.children.length > 0 && (
                                    <span className="text-xs text-muted-foreground">
                                      ({l1Category.children.length})
                                    </span>
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* "More Categories" Grid */}
              {activeCategory.id === "more-categories" && (
                <div className="grid grid-cols-4 gap-4">
                  {moreCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/categories/${cat.slug}`}
                      onClick={() => setActiveCategory(null)}
                      className="flex items-center gap-2 p-3 rounded-lg hover:bg-accent/50 transition-colors group border border-transparent hover:border-border"
                    >
                      <span className="text-muted-foreground group-hover:text-brand transition-colors">
                        {getCategoryIcon(cat.slug)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-foreground group-hover:text-brand transition-colors block truncate">
                          {getCategoryName(cat)}
                        </span>
                        {cat.children && cat.children.length > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {cat.children.length} {locale === "bg" ? "подкатегории" : "subcategories"}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-150"
            style={{ top: `${headerHeight}px` }}
            onClick={() => setActiveCategory(null)}
            aria-hidden="true"
          />
        </>
      )}
    </>
  )
}
