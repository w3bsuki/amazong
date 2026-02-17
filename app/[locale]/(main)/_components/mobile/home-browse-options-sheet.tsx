"use client"

import { useCallback } from "react"
import { ChevronRight as CaretRight } from "lucide-react";

import { useTranslations } from "next-intl"

import { Link } from "@/i18n/routing"
import type { CategoryTreeNode } from "@/lib/category-tree"
import { getCategoryName } from "@/lib/category-display"
import { cn } from "@/lib/utils"
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

interface HomeBrowseOptionsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  locale: string
  subcategoryLabel: string
  categories: CategoryTreeNode[]
  activeSlug: string | null
  onSelect: (slug: string | null) => void
  fullBrowseHref: string
}

const OPTION_BASE_CLASS =
  "flex w-full min-h-(--spacing-touch-md) items-center justify-between gap-2 rounded-xl border px-3 text-left text-sm font-medium tap-transparent transition-colors duration-fast ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
const OPTION_ACTIVE_CLASS = "border-foreground bg-foreground text-background"
const OPTION_INACTIVE_CLASS =
  "border-border-subtle bg-background text-foreground hover:bg-hover active:bg-active"

const LINK_CHIP_CLASS =
  "inline-flex min-h-(--control-default) items-center justify-between gap-1.5 rounded-xl border border-border-subtle bg-background px-2.5 text-xs font-semibold text-foreground tap-transparent transition-colors duration-fast ease-smooth hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1"

export function HomeBrowseOptionsSheet({
  open,
  onOpenChange,
  locale,
  subcategoryLabel,
  categories,
  activeSlug,
  onSelect,
  fullBrowseHref,
}: HomeBrowseOptionsSheetProps) {
  const tV4 = useTranslations("Home.mobile.v4")

  const getLabel = useCallback(
    (category: CategoryTreeNode) => getCategoryName(category, locale),
    [locale]
  )

  const handleSelect = useCallback((slug: string | null) => {
    onSelect(slug)
    onOpenChange(false)
  }, [onOpenChange, onSelect])

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        data-testid="home-v4-browse-options-sheet"
        className="max-h-dialog-md rounded-t-2xl lg:hidden"
      >
        <DrawerHeader className="border-b border-border-subtle px-inset pt-4 pb-3">
          <DrawerTitle className="text-center text-base font-semibold tracking-tight">
            {tV4("browseSheet.title")}
          </DrawerTitle>
          <DrawerDescription className="pt-0.5 text-center text-xs text-muted-foreground">
            {tV4("browseSheet.description")}
          </DrawerDescription>
        </DrawerHeader>

        <DrawerBody className="px-inset py-3 pb-3">
          <div className="space-y-1.5">
            <button
              type="button"
              data-testid="home-v4-browse-options-all"
              aria-pressed={activeSlug === null}
              onClick={() => handleSelect(null)}
              className={cn(
                OPTION_BASE_CLASS,
                activeSlug === null ? OPTION_ACTIVE_CLASS : OPTION_INACTIVE_CLASS
              )}
            >
              <span className="truncate">
                {tV4("browseSheet.allInSubcategory", {
                  subcategory: subcategoryLabel,
                })}
              </span>
            </button>

            {categories.map((category) => {
              const active = activeSlug === category.slug
              return (
                <button
                  key={category.id}
                  type="button"
                  data-testid={`home-v4-browse-option-${category.slug}`}
                  aria-pressed={active}
                  onClick={() => handleSelect(active ? null : category.slug)}
                  className={cn(
                    OPTION_BASE_CLASS,
                    active ? OPTION_ACTIVE_CLASS : OPTION_INACTIVE_CLASS
                  )}
                >
                  <span className="truncate">{getLabel(category)}</span>
                </button>
              )
            })}
          </div>

          <div className="mt-3 border-t border-border-subtle pt-3">
            <div className="grid grid-cols-2 gap-2">
              <Link href={fullBrowseHref} onClick={() => onOpenChange(false)} className={LINK_CHIP_CLASS}>
                <span className="truncate">{tV4("actions.viewCategory")}</span>
                <CaretRight size={14} aria-hidden="true" />
              </Link>
              <Link href="/categories" onClick={() => onOpenChange(false)} className={LINK_CHIP_CLASS}>
                <span className="truncate">{tV4("actions.openCategories")}</span>
                <CaretRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
