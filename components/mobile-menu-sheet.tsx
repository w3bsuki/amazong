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
  Heart, 
  User,
  Question,
  Gear,
  Globe,
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
  List,
  Lightning,
  Medal,
  Storefront,
  ClockCounterClockwise,
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

interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
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
        .catch(err => console.error('Failed to fetch categories:', err))
    }, [])

    const getCategoryName = (cat: Category) => {
      if (locale === 'bg' && cat.name_bg) {
        return cat.name_bg
      }
      return cat.name
    }

    // Quick discovery links
    const discoverLinks = [
      {
        icon: Lightning,
        label: locale === 'bg' ? 'Оферти' : 'Deals',
        href: '/todays-deals',
        color: 'text-deal bg-deal/10 border-deal/20',
      },
      {
        icon: Medal,
        label: locale === 'bg' ? 'Топ' : 'Top',
        href: '/top-sellers',
        color: 'text-amber-600 bg-amber-50 border-amber-200',
      },
      {
        icon: Gift,
        label: locale === 'bg' ? 'Подаръци' : 'Gifts',
        href: '/search?occasion=gift',
        color: 'text-pink-600 bg-pink-50 border-pink-200',
      },
    ]

    // User activity links
    const userLinks = [
      {
        icon: ClockCounterClockwise,
        label: locale === 'bg' ? 'Поръчки' : 'Orders',
        href: '/account/orders',
      },
      {
        icon: Storefront,
        label: locale === 'bg' ? 'Продавай' : 'Sell',
        href: '/sell',
      },
      {
        icon: Heart,
        label: locale === 'bg' ? 'Любими' : 'Saved',
        href: '/wishlist',
      },
    ]

    // Account links
    const accountLinks = [
      {
        icon: User,
        label: locale === 'bg' ? 'Акаунт' : 'Account',
        href: '/account',
      },
      {
        icon: Question,
        label: locale === 'bg' ? 'Помощ' : 'Help',
        href: '/customer-service',
      },
      {
        icon: Gear,
        label: locale === 'bg' ? 'Настройки' : 'Settings',
        href: '/account/settings',
      },
    ]

    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[90dvh] rounded-t-2xl">
          {/* Header */}
          <DrawerHeader className="pb-3 pt-0 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <List size={20} weight="regular" className="text-muted-foreground" />
                <DrawerTitle className="text-lg font-semibold">
                  {locale === 'bg' ? 'Меню' : 'Menu'}
                </DrawerTitle>
              </div>
              <DrawerClose asChild>
                <button 
                  className="flex items-center justify-center size-11 -mr-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors touch-action-manipulation"
                  aria-label="Close menu"
                >
                  <X size={20} weight="regular" />
                </button>
              </DrawerClose>
            </div>
            <DrawerDescription className="sr-only">
              Navigation menu with categories and account settings
            </DrawerDescription>
          </DrawerHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-8 max-h-[calc(90dvh-80px)]">
            
            {/* Discover Row - Compact pills */}
            <section className="pt-4 pb-4">
              <div className="flex gap-2">
                {discoverLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-2 rounded-full border text-sm font-medium transition-colors",
                        link.color
                      )}
                    >
                      <Icon size={16} weight="fill" />
                      {link.label}
                    </Link>
                  )
                })}
              </div>
            </section>

            {/* Categories Section - Target-style circles grid */}
            <section className="pb-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">
                  {locale === 'bg' ? 'Категории' : 'Categories'}
                </h3>
                <Link 
                  href="/categories" 
                  onClick={() => setOpen(false)}
                  className="text-xs text-brand font-medium hover:text-brand-dark flex items-center gap-1"
                >
                  {locale === 'bg' ? 'Всички' : 'See all'}
                  <CaretRight size={12} weight="bold" />
                </Link>
              </div>
              
              {/* Category Circles Grid - 4 columns like Target */}
              <div className="grid grid-cols-4 gap-y-4 gap-x-2">
                {categories.slice(0, 12).map((cat) => {
                  const Icon = getCategoryIcon(cat.slug)
                  return (
                    <Link
                      key={cat.slug}
                      href={`/categories/${cat.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex flex-col items-center gap-1.5 group"
                    >
                      {/* Circle with icon */}
                      <div className="size-14 rounded-full bg-muted border border-border flex items-center justify-center group-hover:border-brand group-hover:bg-brand/5 transition-colors">
                        <Icon size={24} weight="duotone" className="text-foreground/80 group-hover:text-brand transition-colors" />
                      </div>
                      {/* Category name */}
                      <span className="text-[10px] font-medium text-center text-foreground leading-tight line-clamp-2 max-w-[60px] group-hover:text-brand transition-colors">
                        {getCategoryName(cat)}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </section>

            {/* User Activity Row */}
            <section className="pb-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                {locale === 'bg' ? 'Моят профил' : 'My Activity'}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {userLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex flex-col items-center justify-center gap-1.5 min-h-[68px] p-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="size-9 rounded-full bg-background flex items-center justify-center text-muted-foreground">
                        <Icon size={18} weight="regular" />
                      </div>
                      <span className="text-xs font-medium text-foreground">
                        {link.label}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </section>

            {/* Account & Settings - Compact list */}
            <section className="pb-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                {locale === 'bg' ? 'Акаунт и помощ' : 'Account & Help'}
              </h3>
              <div className="space-y-0.5">
                {accountLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 min-h-[44px] px-3 py-2 -mx-1 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="size-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                        <Icon size={18} weight="regular" />
                      </div>
                      <span className="flex-1 text-sm font-medium text-foreground">
                        {link.label}
                      </span>
                      <CaretRight size={14} weight="regular" className="text-muted-foreground/60 shrink-0" />
                    </Link>
                  )
                })}
              </div>
            </section>

            {/* Language Selector */}
            <section className="pb-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-background flex items-center justify-center text-muted-foreground">
                    <Globe size={18} weight="regular" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {locale === 'bg' ? 'Език' : 'Language'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 p-1 bg-background rounded-lg border border-border">
                  <Link
                    href="/"
                    locale="en"
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center justify-center min-w-[36px] h-8 rounded-md text-xs font-semibold transition-colors",
                      locale === 'en' 
                        ? 'bg-brand text-white' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    EN
                  </Link>
                  <Link
                    href="/"
                    locale="bg"
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center justify-center min-w-[36px] h-8 rounded-md text-xs font-semibold transition-colors",
                      locale === 'bg' 
                        ? 'bg-brand text-white' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    БГ
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </DrawerContent>
      </Drawer>
    )
  }
)
