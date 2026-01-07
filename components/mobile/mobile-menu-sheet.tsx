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
import { getCategoryName } from "@/lib/category-display"
import { CategoryCircle } from "@/components/shared/category/category-circle"
import type { CategoryTreeNode } from "@/lib/category-tree"

export interface MobileMenuSheetHandle {
  open: () => void
  close: () => void
}

interface MobileMenuSheetProps {
  categories: CategoryTreeNode[]
}

export const MobileMenuSheet = forwardRef<MobileMenuSheetHandle, MobileMenuSheetProps>(
  function MobileMenuSheet({ categories }, ref) {
    const [open, setOpen] = useState(false)
    const locale = useLocale()
    // Chosen design: blue circles with white icons.
    // Keep labels black underneath for maximum readability.
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
        <DrawerContent className="max-h-[90dvh]">
          {/* Header - Compact with proper touch target for close */}
          <DrawerHeader className="py-2 px-(--page-inset) border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SquaresFour size={18} weight="regular" className="text-muted-foreground" />
                <DrawerTitle>
                  {locale === 'bg' ? 'Категории' : 'Categories'}
                </DrawerTitle>
              </div>
              <DrawerClose asChild>
                <button
                  className="flex items-center justify-center size-touch -mr-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted active:bg-muted/70 transition-colors touch-action-manipulation tap-transparent"
                  aria-label="Close menu"
                >
                  <X size={20} weight="regular" />
                </button>
              </DrawerClose>
            </div>
            <DrawerDescription className="sr-only">
              Browse products by category
            </DrawerDescription>
          </DrawerHeader>

          {/* Scrollable Content with safe area */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-(--page-inset) pb-[max(1rem,env(safe-area-inset-bottom))]">

            {/* Categories Section - circles grid */}
            <section className="py-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">
                  {locale === 'bg' ? 'Пазарувай по категория' : 'Shop by Category'}
                </h3>
                <Link
                  href="/categories"
                  onClick={() => setOpen(false)}
                  className="text-xs text-cta-trust-blue font-medium hover:underline underline-offset-2 flex items-center gap-0.5 min-h-touch-xs px-1 -mr-1 rounded transition-colors active:bg-muted/50"
                >
                  {locale === 'bg' ? 'Виж всички' : 'See all'}
                  <CaretRight size={12} weight="bold" />
                </Link>
              </div>

              {/* Intentionally no debug UI / query toggles here. */}

              {/* Category Circles Grid - 4 columns (Compact & Perfect) */}
              <div className="grid grid-cols-4 gap-y-3 gap-x-2">
                {categories.slice(0, 20).map((cat) => {
                  return (
                    <CategoryCircle
                      key={cat.slug}
                      category={cat}
                      href={`/categories/${cat.slug}`}
                      onClick={() => setOpen(false)}
                      circleClassName="size-14"
                      fallbackIconSize={24}
                      fallbackIconWeight="regular"
                      variant="menu"
                      label={getShortName(cat)}
                      labelClassName="text-2xs font-medium text-center text-foreground leading-tight line-clamp-2 w-full max-w-none break-words hyphens-auto"
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
