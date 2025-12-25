"use client"

import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerDescription,
} from "@/components/ui/drawer"
import { Link } from "@/i18n/routing"
import { 
  X, 
  CaretRight, 
  SquaresFour,
  DeviceMobile,
  Laptop,
  GameController,
  TShirt,
  Sparkle,
  Baby,
  Football,
  Book,
  Car,
  Flower,
  FirstAidKit,
  PawPrint,
  Briefcase,
  ShoppingBag,
  Headphones,
  Desktop,
  Armchair,
  CookingPot,
  Sneaker,
  Watch,
  Diamond,
  Gift,
  type Icon as PhosphorIcon
} from "@phosphor-icons/react"
import { useLocale } from "next-intl"
import { cn } from "@/lib/utils"
import { useSearchParams } from "next/navigation"

interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
}

type CategoryCircleStyle = "neutral" | "brand" | "brandText"

function parseCircleStyle(value: string | null): CategoryCircleStyle {
  if (value === "brand" || value === "brandText" || value === "neutral") return value
  return "neutral"
}

// Map category slugs to Phosphor icons - same as category-circles.tsx
const categoryIcons: Record<string, PhosphorIcon> = {
  "electronics": Headphones,
  "computers": Desktop,
  "laptops": Laptop,
  "phones": DeviceMobile,
  "gaming": GameController,
  "home": Armchair,
  "furniture": Armchair,
  "kitchen": CookingPot,
  "fashion": TShirt,
  "clothing": TShirt,
  "shoes": Sneaker,
  "accessories": Watch,
  "beauty": Flower,
  "cosmetics": Sparkle,
  "health": FirstAidKit,
  "baby": Baby,
  "toys": GameController,
  "sports": Football,
  "automotive": Car,
  "books": Book,
  "pets": PawPrint,
  "office": Briefcase,
  "garden": Flower,
  "jewelry": Diamond,
  "gifts": Gift,
  "default": ShoppingBag
}

const getCategoryIcon = (slug: string): PhosphorIcon => {
  if (categoryIcons[slug]) return categoryIcons[slug]
  const slugLower = slug.toLowerCase()
  for (const [key, icon] of Object.entries(categoryIcons)) {
    if (slugLower.includes(key) || key.includes(slugLower)) {
      return icon
    }
  }
  return categoryIcons["default"]
}

export interface MobileMenuSheetHandle {
  open: () => void
  close: () => void
}

interface MobileMenuSheetProps {
  locale?: string
}

export const MobileMenuSheet = forwardRef<MobileMenuSheetHandle, MobileMenuSheetProps>(
  function MobileMenuSheet(_props, ref) {
    const [open, setOpen] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const locale = useLocale()
    const searchParams = useSearchParams()
    const uiDebug = searchParams.get("uiDebug") === "1"
    const [circleStyle, setCircleStyle] = useState<CategoryCircleStyle>(() =>
      parseCircleStyle(searchParams.get("catCircles"))
    )

    // Keep local state in sync with URL param (lets you A/B quickly)
    useEffect(() => {
      setCircleStyle(parseCircleStyle(searchParams.get("catCircles")))
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams])

    useImperativeHandle(ref, () => ({
      open: () => setOpen(true),
      close: () => setOpen(false),
    }))

    // Fetch categories from Supabase
    useEffect(() => {
      fetch('/api/categories')
        .then(res => res.json())
        .then(data => {
          if (data.categories) {
            setCategories(data.categories)
          }
        })
        .catch(() => {
          // Avoid console.error noise; menu can render without categories.
        })
    }, [])

    const getShortName = (cat: Category) => {
      const name = locale === 'bg' && cat.name_bg ? cat.name_bg : cat.name
      // Shorten common long names for mobile
      if (name === "Electronics & Technology") return locale === 'bg' ? "Електроника" : "Electronics"
      if (name === "Home, Kitchen & Garden") return locale === 'bg' ? "Дом и градина" : "Home"
      if (name === "Clothing, Shoes & Accessories") return locale === 'bg' ? "Мода" : "Fashion"
      return name
    }

    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[90dvh] rounded-t-2xl">
          {/* Header */}
          <DrawerHeader className="pb-2 pt-0 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SquaresFour size={18} weight="regular" className="text-muted-foreground" />
                <DrawerTitle className="text-base font-semibold">
                  {locale === 'bg' ? 'Категории' : 'Categories'}
                </DrawerTitle>
              </div>
              <DrawerClose asChild>
                <button 
                  className="flex items-center justify-center size-10 -mr-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors touch-action-manipulation"
                  aria-label="Close menu"
                >
                  <X size={18} weight="regular" />
                </button>
              </DrawerClose>
            </div>
            <DrawerDescription className="sr-only">
              Browse products by category
            </DrawerDescription>
          </DrawerHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-6 max-h-[calc(90dvh-70px)]">
            
            {/* Categories Section - Hero-style circles grid */}
            <section className="pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[13px] font-semibold text-foreground">
                  {locale === 'bg' ? 'Пазарувай по категория' : 'Shop by Category'}
                </h3>
                <Link 
                  href="/categories" 
                  onClick={() => setOpen(false)}
                  className="text-[11px] text-cta-trust-blue font-medium hover:underline underline-offset-2 flex items-center gap-1"
                >
                  {locale === 'bg' ? 'Виж всички' : 'See all'}
                  <CaretRight size={10} weight="bold" />
                </Link>
              </div>

              {uiDebug && (
                <div className="mb-4 inline-flex rounded-full bg-muted p-1">
                  {([
                    ["neutral", locale === "bg" ? "Неутрално" : "Neutral"],
                    ["brand", locale === "bg" ? "Синьо" : "Blue"],
                    ["brandText", locale === "bg" ? "Синьо + текст" : "Blue + text"],
                  ] as const).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setCircleStyle(value)}
                      className={cn(
                        "h-7 px-3 rounded-full text-[11px] font-semibold transition-colors",
                        value === circleStyle
                          ? "bg-background text-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Category Circles Grid - 4 columns */}
              <div className="grid grid-cols-4 gap-y-5 gap-x-1.5">
                {categories.slice(0, 16).map((cat) => {
                  const Icon = getCategoryIcon(cat.slug)
                  return (
                    <Link
                      key={cat.slug}
                      href={`/categories/${cat.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex flex-col items-center gap-1.5 group"
                    >
                      {/* Circle with icon - Hero style: White + Blue with ring */}
                      <div
                        className={cn(
                          "rounded-full flex items-center justify-center",
                          "size-[54px]",
                          circleStyle === "neutral"
                            ? "bg-background ring-1 ring-border/60"
                            : "bg-cta-trust-blue ring-1 ring-cta-trust-blue/40",
                          "transition-all duration-150",
                          circleStyle === "neutral"
                            ? "group-hover:bg-accent/40 group-hover:ring-ring/30"
                            : "group-hover:bg-cta-trust-blue-hover group-hover:ring-cta-trust-blue/60",
                          "group-hover:scale-105 group-active:scale-95"
                        )}
                      >
                        <Icon
                          className={cn(
                            "size-6 transition-colors duration-150",
                            circleStyle === "neutral" ? "text-cta-trust-blue" : "text-cta-trust-blue-text"
                          )}
                          weight="regular"
                        />
                      </div>
                      {/* Category name */}
                      {circleStyle === "brandText" ? (
                        <span className="max-w-[76px] rounded-md bg-cta-trust-blue px-1.5 py-1 text-[10px] font-semibold text-center text-cta-trust-blue-text leading-[1.1] line-clamp-2">
                          {getShortName(cat)}
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-center text-foreground leading-[1.1] line-clamp-2 max-w-[72px] group-hover:text-cta-trust-blue transition-colors duration-150">
                          {getShortName(cat)}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </section>
          </div>
        </DrawerContent>
      </Drawer>
    )
  }
)
