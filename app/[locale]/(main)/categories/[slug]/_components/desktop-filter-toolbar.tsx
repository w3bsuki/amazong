"use client"

import { useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { usePathname, useRouter } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import type { CategoryAttribute } from "@/lib/data/categories"
import { LayoutGrid as SquaresFour, Rows3 as Rows } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { SortSelect } from "../../../_components/search-controls/sort-select"
import { DesktopFilterToolbarFilterPills } from "./desktop-filter-toolbar-filter-pills"

export interface DesktopFilterToolbarProps {
  locale: string
  productCount?: number
  categoryName?: string
  categorySlug?: string
  categoryId?: string
  attributes?: CategoryAttribute[]
  className?: string
}

export function DesktopFilterToolbar({
  locale,
  productCount,
  categoryName,
  categorySlug,
  categoryId,
  attributes = [],
  className,
}: DesktopFilterToolbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const t = useTranslations("TabbedProductFeed")
  const tFilters = useTranslations("SearchFilters")
  const tViewMode = useTranslations("ViewMode")

  const viewMode = (searchParams.get("view") as "grid" | "list") || "grid"

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(updates)) {
        if (value === null) params.delete(key)
        else params.set(key, value)
      }
      const queryString = params.toString()
      router.push(`${pathname}${queryString ? `?${queryString}` : ""}`)
    },
    [router, pathname, searchParams]
  )

  return (
    <div
      className={cn(
        "flex items-center gap-3 mb-4 pb-3 border-b border-border",
        className
      )}
    >
      <div className="shrink-0">
        <SortSelect />
      </div>

      {typeof productCount === "number" && (
        <>
          <div className="h-5 w-px bg-border shrink-0" />
          <p className="text-sm text-muted-foreground whitespace-nowrap shrink-0">
            <span className="font-semibold text-foreground">{productCount.toLocaleString(locale)}</span>
            {" "}{tFilters("results")}
            {categoryName && (
              <>
                {" "}{tFilters("in")}{" "}
                <span className="font-medium text-foreground">{categoryName}</span>
              </>
            )}
          </p>
        </>
      )}

      <DesktopFilterToolbarFilterPills
        locale={locale}
        categorySlug={categorySlug}
        categoryId={categoryId}
        attributes={attributes}
        searchParams={searchParams}
        updateParams={updateParams}
        t={t}
        tFilters={tFilters}
      />

      <div className="h-5 w-px bg-border shrink-0" />
      <ToggleGroup
        type="single"
        value={viewMode}
        onValueChange={(value) => value && updateParams({ view: value })}
        className="h-11 bg-muted p-0 rounded-full shrink-0 border border-border"
      >
        <ToggleGroupItem
          value="grid"
          aria-label={tViewMode("gridView")}
          className="size-11 p-0 rounded-full data-[state=on]:bg-background"
        >
          <SquaresFour size={16} />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="list"
          aria-label={tViewMode("listView")}
          className="size-11 p-0 rounded-full data-[state=on]:bg-background"
        >
          <Rows size={16} />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
