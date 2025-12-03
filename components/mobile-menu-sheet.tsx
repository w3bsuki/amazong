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
  Tag, 
  Heart, 
  Package,
  User,
  Question,
  Gear,
  Globe,
  DeviceMobile,
  Laptop,
  GameController,
  House,
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
  ChatCircle,
  Storefront,
  ClockCounterClockwise,
} from "@phosphor-icons/react"
import { useLocale } from "next-intl"
import { cn } from "@/lib/utils"

interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
}

// Professional Phosphor icons for categories
const categoryIconMap: Record<string, React.ReactNode> = {
  electronics: <DeviceMobile size={20} weight="regular" />,
  computers: <Laptop size={20} weight="regular" />,
  gaming: <GameController size={20} weight="regular" />,
  "smart-home": <House size={20} weight="regular" />,
  home: <House size={20} weight="regular" />,
  fashion: <TShirt size={20} weight="regular" />,
  beauty: <Sparkle size={20} weight="regular" />,
  toys: <GameController size={20} weight="regular" />,
  sports: <Football size={20} weight="regular" />,
  books: <Book size={20} weight="regular" />,
  automotive: <Car size={20} weight="regular" />,
  garden: <Flower size={20} weight="regular" />,
  health: <FirstAidKit size={20} weight="regular" />,
  baby: <Baby size={20} weight="regular" />,
  pets: <PawPrint size={20} weight="regular" />,
  office: <Briefcase size={20} weight="regular" />,
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

    const quickLinks = [
      // Deals row - highlighted
      {
        icon: <Lightning size={20} weight="fill" />,
        label: locale === 'bg' ? 'Оферти на деня' : 'Daily Deals',
        href: '/todays-deals',
        highlight: true,
      },
      {
        icon: <Tag size={20} weight="fill" />,
        label: locale === 'bg' ? 'Нови обяви' : 'New Listings',
        href: '/search?sort=newest',
        highlight: true,
      },
      {
        icon: <Medal size={20} weight="fill" />,
        label: locale === 'bg' ? 'Топ продавачи' : 'Top Sellers',
        href: '/top-sellers',
        highlight: true,
      },
    ]

    const userLinks = [
      {
        icon: <ClockCounterClockwise size={20} weight="regular" />,
        label: locale === 'bg' ? 'Поръчки' : 'Orders',
        href: '/account/orders',
      },
      {
        icon: <Storefront size={20} weight="regular" />,
        label: locale === 'bg' ? 'Продажби' : 'Selling',
        href: '/account/selling',
      },
      {
        icon: <Heart size={20} weight="regular" />,
        label: locale === 'bg' ? 'Любими' : 'Wishlist',
        href: '/wishlist',
      },
      {
        icon: <ChatCircle size={20} weight="regular" />,
        label: locale === 'bg' ? 'Съобщения' : 'Messages',
        href: '/account/messages',
      },
    ]

    const accountLinks = [
      {
        icon: <User size={20} weight="regular" />,
        label: locale === 'bg' ? 'Акаунт' : 'Account',
        href: '/account',
      },
      {
        icon: <Question size={20} weight="regular" />,
        label: locale === 'bg' ? 'Помощ' : 'Help Center',
        href: '/customer-service',
      },
      {
        icon: <Gear size={20} weight="regular" />,
        label: locale === 'bg' ? 'Настройки' : 'Settings',
        href: '/account/settings',
      },
    ]

    const getCategoryIcon = (slug: string) => {
      return categoryIconMap[slug] || <Package size={20} weight="regular" />
    }

    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[85dvh] rounded-t-2xl">
          {/* Header - Compact like cart drawer */}
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
                  className="flex items-center justify-center size-11 -mr-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors touch-action-manipulation tap-transparent"
                  aria-label="Close menu"
                >
                  <X size={20} weight="regular" />
                </button>
              </DrawerClose>
            </div>
            <DrawerDescription className="sr-only">
              Navigation menu with categories, quick links, and account settings
            </DrawerDescription>
          </DrawerHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-8 max-h-[calc(85dvh-80px)]">
            {/* Deals Row - Highlighted */}
            <section className="pt-4 pb-4">
              <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                {locale === 'bg' ? 'Открий' : 'Discover'}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {quickLinks.map((link, i) => (
                  <Link
                    key={i}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex flex-col items-center justify-center gap-1.5 min-h-[72px] p-3 rounded-xl bg-deal/10 border border-deal/20 text-deal touch-action-manipulation tap-transparent"
                  >
                    <div className="size-9 rounded-lg flex items-center justify-center bg-deal/15 text-deal">
                      {link.icon}
                    </div>
                    <span className="text-xs font-medium text-center leading-tight">
                      {link.label}
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {/* User Links - Orders, Selling, Wishlist, Messages */}
            <section className="pb-4">
              <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                {locale === 'bg' ? 'Моят профил' : 'My Activity'}
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {userLinks.map((link, i) => (
                  <Link
                    key={i}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex flex-col items-center justify-center gap-1.5 min-h-[68px] p-2 rounded-xl bg-muted/50 hover:bg-muted touch-action-manipulation tap-transparent"
                  >
                    <div className="size-8 rounded-lg flex items-center justify-center bg-background text-muted-foreground">
                      {link.icon}
                    </div>
                    <span className="text-xs font-medium text-center leading-tight text-foreground">
                      {link.label}
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {/* Categories Section */}
            <section className="pb-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {locale === 'bg' ? 'Категории' : 'Shop by Category'}
                </h3>
                <Link 
                  href="/categories" 
                  onClick={() => setOpen(false)}
                  className="text-xs text-brand font-medium hover:text-brand-dark transition-colors"
                >
                  {locale === 'bg' ? 'Виж всички' : 'View All'}
                </Link>
              </div>
              <div className="space-y-0.5">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/search?category=${cat.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 min-h-[48px] px-3 py-2.5 -mx-1 rounded-lg hover:bg-muted active:bg-muted/80 transition-colors touch-action-manipulation tap-transparent"
                  >
                    <div className="size-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                      {getCategoryIcon(cat.slug)}
                    </div>
                    <span className="flex-1 text-sm font-medium text-foreground">
                      {getCategoryName(cat)}
                    </span>
                    <CaretRight size={16} weight="regular" className="text-muted-foreground/60 shrink-0" />
                  </Link>
                ))}
              </div>
            </section>

            {/* Account & Settings Section */}
            <section className="pb-5">
              <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                {locale === 'bg' ? 'Акаунт' : 'Account & Help'}
              </h3>
              <div className="space-y-0.5">
                {accountLinks.map((link, i) => (
                  <Link
                    key={i}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 min-h-[48px] px-3 py-2.5 -mx-1 rounded-lg hover:bg-muted active:bg-muted/80 transition-colors touch-action-manipulation tap-transparent"
                  >
                    <div className="size-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                      {link.icon}
                    </div>
                    <span className="flex-1 text-sm font-medium text-foreground">
                      {link.label}
                    </span>
                    <CaretRight size={16} weight="regular" className="text-muted-foreground/60 shrink-0" />
                  </Link>
                ))}
              </div>
            </section>

            {/* Language Selector - Compact card */}
            <section className="pb-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-background flex items-center justify-center text-muted-foreground">
                    <Globe size={20} weight="regular" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {locale === 'bg' ? 'Език' : 'Language'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {locale === 'bg' ? 'BG' : 'EN'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 p-1 bg-background rounded-lg border border-border">
                  <Link
                    href="/"
                    locale="en"
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center justify-center min-w-[40px] h-9 rounded-md text-xs font-semibold transition-colors touch-action-manipulation tap-transparent",
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
                      "flex items-center justify-center min-w-[40px] h-9 rounded-md text-xs font-semibold transition-colors touch-action-manipulation tap-transparent",
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
