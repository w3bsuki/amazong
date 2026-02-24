"use client"

import { useEffect, useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import type { CategoryTreeNode } from "@/lib/data/categories/types"
import { getCategoryName } from "@/lib/data/categories/display"
import { getCategoryIcon } from "../category/category-icons"
import {
  ChevronDown as CaretDown,
  ChevronRight as CaretRight,
  ChevronUp as CaretUp,
  LayoutGrid as SquaresFour,
} from "lucide-react"
import { useTranslations } from "next-intl"

export interface CategoryPath {
  slug: string
  name: string
}

export interface CompactCategorySidebarProps {
  categories: CategoryTreeNode[]
  locale: string
  selectedPath: CategoryPath[]
  onCategorySelect: (path: CategoryPath[], category: CategoryTreeNode | null) => void
  categoryCounts: Record<string, number>
}

const INITIAL_VISIBLE_ROOT_COUNT = 15

function sortByDisplayOrder(nodes: CategoryTreeNode[]) {
  return [...nodes].sort((a, b) => {
    const orderA = a.display_order ?? 999
    const orderB = b.display_order ?? 999
    if (orderA !== orderB) return orderA - orderB
    return a.name.localeCompare(b.name)
  })
}

export function CompactCategorySidebar({
  categories,
  locale,
  selectedPath,
  onCategorySelect,
  categoryCounts,
}: CompactCategorySidebarProps) {
  const tCommon = useTranslations("Common")
  const tCategories = useTranslations("Categories")

  const [isMounted, setIsMounted] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [expandedRootSlug, setExpandedRootSlug] = useState<string | null>(
    selectedPath[0]?.slug ?? null
  )

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const selectedRoot = selectedPath[0]?.slug ?? null
    setExpandedRootSlug(selectedRoot)
  }, [selectedPath])

  const sortedRootCategories = useMemo(() => sortByDisplayOrder(categories), [categories])
  const totalCount = useMemo(
    () => Object.values(categoryCounts).reduce((sum, count) => sum + count, 0),
    [categoryCounts]
  )

  const selectedRootSlug = selectedPath[0]?.slug ?? null
  const selectedLeafSlug = selectedPath[1]?.slug ?? null

  const visibleRootCategories = useMemo(() => {
    if (isExpanded || sortedRootCategories.length <= INITIAL_VISIBLE_ROOT_COUNT) {
      return sortedRootCategories
    }
    return sortedRootCategories.slice(0, INITIAL_VISIBLE_ROOT_COUNT)
  }, [isExpanded, sortedRootCategories])

  const hiddenRootCount = sortedRootCategories.length - visibleRootCategories.length

  const itemBase =
    "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors text-left min-h-(--sidebar-item-h) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
  const itemActive = cn(itemBase, "bg-foreground text-background font-medium")
  const itemInactive = cn(itemBase, "text-muted-foreground hover:bg-muted hover:text-foreground")

  const handleSelectAll = () => {
    setExpandedRootSlug(null)
    onCategorySelect([], null)
  }

  const handleRootToggle = (root: CategoryTreeNode) => {
    const rootPath: CategoryPath[] = [{ slug: root.slug, name: getCategoryName(root, locale) }]
    setExpandedRootSlug((previous) => (previous === root.slug ? null : root.slug))
    onCategorySelect(rootPath, root)
  }

  const handleLeafSelect = (root: CategoryTreeNode, leaf: CategoryTreeNode) => {
    const nextPath: CategoryPath[] = [
      { slug: root.slug, name: getCategoryName(root, locale) },
      { slug: leaf.slug, name: getCategoryName(leaf, locale) },
    ]
    onCategorySelect(nextPath, leaf)
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <nav className="p-1.5 space-y-0.5">
        <button
          type="button"
          onClick={handleSelectAll}
          className={selectedPath.length === 0 ? itemActive : itemInactive}
        >
          <SquaresFour size={20} className="shrink-0" />
          <span className="flex-1 font-medium">{tCommon("allCategories")}</span>
          <span className="text-xs tabular-nums opacity-70">
            {isMounted && totalCount > 0 ? totalCount : "—"}
          </span>
        </button>

        {visibleRootCategories.map((root) => {
          const rootName = getCategoryName(root, locale)
          const rootCount = categoryCounts[root.slug]
          const leaves = sortByDisplayOrder(root.children ?? [])
          const hasLeaves = leaves.length > 0
          const isExpandedRoot = expandedRootSlug === root.slug
          const isRootSelected = selectedRootSlug === root.slug && selectedPath.length <= 1

          return (
            <div key={root.slug}>
              <button
                type="button"
                onClick={() => handleRootToggle(root)}
                className={isRootSelected ? itemActive : itemInactive}
                aria-expanded={hasLeaves ? isExpandedRoot : undefined}
              >
                <span className={isRootSelected ? "text-background" : "text-muted-foreground"}>
                  {getCategoryIcon(root.slug, { size: 20, weight: isRootSelected ? "fill" : "regular" })}
                </span>
                <span className="flex-1 truncate">{rootName}</span>
                {isMounted && typeof rootCount === "number" && (
                  <span className="text-xs tabular-nums opacity-70">{rootCount}</span>
                )}
                {hasLeaves && (
                  <span className={cn("shrink-0", isRootSelected ? "text-background/70" : "text-muted-foreground")}>
                    {isExpandedRoot ? <CaretDown size={14} /> : <CaretRight size={14} />}
                  </span>
                )}
              </button>

              {isExpandedRoot && hasLeaves && (
                <div className="ml-4 mt-1 space-y-0.5 border-l border-border-subtle pl-2">
                  {leaves.map((leaf) => {
                    const isLeafSelected = selectedLeafSlug === leaf.slug
                    const leafCount = categoryCounts[leaf.slug]

                    return (
                      <button
                        key={leaf.slug}
                        type="button"
                        onClick={() => handleLeafSelect(root, leaf)}
                        className={isLeafSelected ? itemActive : itemInactive}
                      >
                        <span className="flex-1 truncate">{getCategoryName(leaf, locale)}</span>
                        {isMounted && typeof leafCount === "number" && (
                          <span className="text-xs tabular-nums opacity-70">{leafCount}</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        {hiddenRootCount > 0 && (
          <button
            type="button"
            onClick={() => setIsExpanded((previous) => !previous)}
            className="w-full flex items-center justify-center gap-1.5 py-2 mt-1 text-xs font-medium rounded-md bg-foreground text-background hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {isExpanded ? (
              <>
                <CaretUp size={14} />
                {tCategories("showLessShort")}
              </>
            ) : (
              <>
                <CaretDown size={14} />
                {tCategories("moreCount", { count: hiddenRootCount })}
              </>
            )}
          </button>
        )}
      </nav>
    </div>
  )
}
