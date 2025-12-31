"use client"

import { useState, forwardRef, useImperativeHandle } from "react"
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
  SquaresFour
} from "@phosphor-icons/react"
import { useLocale } from "next-intl"
import { useCategoriesCache, getCategoryName } from "@/hooks/use-categories-cache"
import { CategoryCircle } from "@/components/shared/category/category-circle"

export interface MobileMenuSheetHandle {
  open: () => void
  close: () => void
}

export const MobileMenuSheet = forwardRef<MobileMenuSheetHandle>(
  function MobileMenuSheet(_props, ref) {
    const [open, setOpen] = useState(false)
    const locale = useLocale()
    // Chosen design: blue circles with white icons.
    // Keep labels black underneath for maximum readability.

    const { categories } = useCategoriesCache({ minCategories: 0 })

    useImperativeHandle(ref, () => ({
      open: () => setOpen(true),
      close: () => setOpen(false),
    }))

    const getShortName = (cat: (typeof categories)[number]) => {
      const name = getCategoryName(cat, locale)
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
                  className="flex items-center justify-center h-touch w-touch -mr-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted touch-action-manipulation"
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

          {/* Scrollable Content with safe area */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-(--page-inset) max-h-[calc(90dvh-70px)] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            
            {/* Categories Section - circles grid */}
            <section className="pt-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">
                  {locale === 'bg' ? 'Пазарувай по категория' : 'Shop by Category'}
                </h3>
                <Link 
                  href="/categories" 
                  onClick={() => setOpen(false)}
                  className="text-xs text-cta-trust-blue font-medium hover:underline underline-offset-2 flex items-center gap-1 min-h-touch-xs"
                >
                  {locale === 'bg' ? 'Виж всички' : 'See all'}
                  <CaretRight size={10} weight="bold" />
                </Link>
              </div>

              {/* Intentionally no debug UI / query toggles here. */}
              
              {/* Category Circles Grid - 4 columns */}
              <div className="grid grid-cols-4 gap-y-5 gap-x-1.5">
                {categories.slice(0, 16).map((cat) => {
                  return (
                    <CategoryCircle
                      key={cat.slug}
                      category={cat}
                      href={`/categories/${cat.slug}`}
                      onClick={() => setOpen(false)}
                      circleClassName="size-12"
                      fallbackIconSize={24}
                      fallbackIconWeight="regular"
                      variant="menu"
                      label={getShortName(cat)}
                      labelClassName="text-2xs font-medium text-center text-muted-foreground leading-tight line-clamp-2 max-w-[72px]"
                    />
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
