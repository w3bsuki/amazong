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
import { cn } from "@/lib/utils"
import { useCategoriesCache, getCategoryName } from "@/hooks/use-categories-cache"
import { getCategoryIcon } from "@/lib/category-icons"

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

              {/* Intentionally no debug UI / query toggles here. */}
              
              {/* Category Circles Grid - 4 columns */}
              <div className="grid grid-cols-4 gap-y-5 gap-x-1.5">
                {categories.slice(0, 16).map((cat) => {
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
                          "bg-cta-trust-blue ring-1 ring-cta-trust-blue/40",
                          "group-hover:bg-cta-trust-blue-hover group-hover:ring-cta-trust-blue/60"
                        )}
                      >
                        {getCategoryIcon(cat.slug, {
                          size: 24,
                          weight: "regular",
                          className: cn(
                            "text-cta-trust-blue-text"
                          ),
                        })}
                      </div>
                      {/* Category name */}
                      <span className="text-2xs font-medium text-center text-foreground leading-[1.1] line-clamp-2 max-w-[72px]">
                        {getShortName(cat)}
                      </span>
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
