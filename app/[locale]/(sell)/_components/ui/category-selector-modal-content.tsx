import { useCallback, useMemo, useState } from "react"
import { ChevronLeft as CaretLeft } from "lucide-react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { useTranslations } from "next-intl"
import type { Category } from "../../_lib/types"
import {
  CategoryCard,
  CategoryEmptyState,
  CategorySearchInput,
  CategorySearchResults,
  FolderSimple,
  toPathItem,
} from "./category-selector-shared"
import type { CategoryModalContentProps, FlatCategory } from "./category-selector.types"

function CategoryResultsSection({
  searchQuery,
  searchResults,
  value,
  onSelect,
  locale,
  compact,
  currentCategories,
  getHasChildren,
  onNavigate,
  gridClassName,
}: {
  searchQuery: string
  searchResults: FlatCategory[]
  value: string
  onSelect: (cat: FlatCategory) => void
  locale: string
  compact: boolean
  currentCategories: Category[]
  getHasChildren: (cat: Category) => boolean
  onNavigate: (cat: Category) => Promise<void> | void
  gridClassName: string
}) {
  const compactProps = compact ? { compact: true as const } : {}

  if (searchQuery.trim()) {
    if (searchResults.length === 0) {
      return <CategoryEmptyState {...compactProps} />
    }

    return (
      <CategorySearchResults
        results={searchResults}
        selectedValue={value}
        onSelect={onSelect}
        locale={locale}
        {...compactProps}
      />
    )
  }

  return (
    <div className={gridClassName}>
      {currentCategories.map((cat) => (
        <CategoryCard
          key={cat.id}
          category={cat}
          isSelected={value === cat.id}
          hasChildren={getHasChildren(cat)}
          onClick={() => void onNavigate(cat)}
          locale={locale}
        />
      ))}
    </div>
  )
}

export function CategoryModalContent({
  categories,
  flatCategories,
  value,
  onSelect,
  locale,
  isMobile,
}: CategoryModalContentProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [navigationPath, setNavigationPath] = useState<Category[]>([])
  const [activeL1, setActiveL1] = useState<Category | null>(categories[0] || null)
  const [childrenById, setChildrenById] = useState<Record<string, Category[]>>({})
  const [loadingChildrenById, setLoadingChildrenById] = useState<Record<string, boolean>>({})
  const tSell = useTranslations("Sell")
  const tCommon = useTranslations("Common")

  const MAX_DEPTH = 4
  const levelLabels = useMemo(
    () => Array.from({ length: MAX_DEPTH + 1 }, (_, level) => tSell("categoryModal.levelLabel", { level })),
    [tSell]
  )
  const lastNavigationItem = navigationPath.at(-1)

  const getName = (cat: Category) =>
    locale === "bg" && cat.name_bg ? cat.name_bg : cat.name

  const getChildren = useCallback(
    (cat: Category | null): Category[] => {
      if (!cat) return []
      return childrenById[cat.id] ?? cat.children ?? []
    },
    [childrenById]
  )

  const ensureChildrenLoaded = useCallback(
    async (cat: Category): Promise<Category[]> => {
      const existing = getChildren(cat)
      if (existing.length > 0 || loadingChildrenById[cat.id]) return existing

      setLoadingChildrenById((prev) => ({ ...prev, [cat.id]: true }))
      try {
        const res = await fetch(`/api/categories/${encodeURIComponent(cat.id)}/children`)
        if (res.ok) {
          const data = await res.json()
          const children = (data.children || []) as Category[]
          if (children.length > 0) {
            setChildrenById((prev) => ({ ...prev, [cat.id]: children }))
            return children
          }
        }
      } catch {
        // Non-blocking fallback for leaf categories.
      } finally {
        setLoadingChildrenById((prev) => ({ ...prev, [cat.id]: false }))
      }
      return []
    },
    [getChildren, loadingChildrenById]
  )

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const query = searchQuery.toLowerCase()
    return flatCategories
      .filter((cat) => cat.searchText.includes(query))
      .slice(0, 12)
  }, [flatCategories, searchQuery])

  const currentCategories = useMemo(() => {
    if (isMobile) {
      if (navigationPath.length === 0) return categories
      const lastInPath = navigationPath.at(-1)
      if (!lastInPath) return categories
      return getChildren(lastInPath)
    }
    return getChildren(activeL1)
  }, [categories, navigationPath, activeL1, isMobile, getChildren])

  const constructFlatCategory = useCallback(
    (cat: Category, path: Category[]): FlatCategory => {
      const pathItems = [...path, cat].map(toPathItem)
      const fullPath = pathItems
        .map((item) => (locale === "bg" && item.name_bg ? item.name_bg : item.name))
        .join(" › ")
      return {
        ...cat,
        path: pathItems,
        fullPath,
        searchText: `${cat.name} ${cat.name_bg || ""} ${cat.slug}`.toLowerCase(),
      }
    },
    [locale]
  )

  const handleNavigate = useCallback(async (cat: Category) => {
    const depth = navigationPath.length
    const knownChildren = getChildren(cat)
    if (depth >= MAX_DEPTH) {
      const flatCat = flatCategories.find((entry) => entry.id === cat.id) || constructFlatCategory(cat, navigationPath)
      onSelect(flatCat)
      return
    }

    if (knownChildren.length > 0) {
      setNavigationPath((prev) => [...prev, cat])
      return
    }

    const loadedChildren = await ensureChildrenLoaded(cat)
    if (loadedChildren.length > 0) {
      setNavigationPath((prev) => [...prev, cat])
      return
    }

    const flatCat = flatCategories.find((entry) => entry.id === cat.id) || constructFlatCategory(cat, navigationPath)
    onSelect(flatCat)
  }, [MAX_DEPTH, constructFlatCategory, ensureChildrenLoaded, flatCategories, getChildren, navigationPath, onSelect])

  const handleDesktopNavigate = useCallback(async (cat: Category) => {
    const knownChildren = getChildren(cat)
    if (knownChildren.length > 0) {
      setActiveL1(cat)
      return
    }

    const loadedChildren = await ensureChildrenLoaded(cat)
    if (loadedChildren.length > 0) {
      setActiveL1(cat)
      return
    }

    const path = activeL1 ? [activeL1] : []
    const flatCat = flatCategories.find((entry) => entry.id === cat.id) || constructFlatCategory(cat, path)
    onSelect(flatCat)
  }, [activeL1, constructFlatCategory, ensureChildrenLoaded, flatCategories, getChildren, onSelect])

  if (isMobile) {
    const currentStep = Math.min(navigationPath.length, MAX_DEPTH) + 1

    return (
      <div className="flex flex-col min-h-0 flex-1 bg-background">
        <div className="flex flex-col border-b border-border-subtle bg-background shrink-0">
          <div className="px-4 py-3">
            <CategorySearchInput value={searchQuery} onChange={setSearchQuery} />
          </div>

          {!searchQuery.trim() && (
            <div className="px-4 py-2.5 bg-surface-subtle flex items-center justify-between gap-4 border-t border-border-subtle">
              <div className="flex items-center gap-3 min-w-0">
                {navigationPath.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => setNavigationPath((prev) => prev.slice(0, -1))}
                    className="size-8 flex items-center justify-center rounded-lg bg-background border border-border shadow-xs shrink-0 transition-colors hover:bg-hover active:bg-active"
                    aria-label={tCommon("back")}
                  >
                    <CaretLeft className="size-4" />
                  </button>
                ) : (
                  <div className="size-8 flex items-center justify-center rounded-lg bg-selected border border-selected-border shrink-0">
                    <FolderSimple className="size-4 text-primary" />
                  </div>
                )}

                <div className="flex flex-col min-w-0">
                  <span className="text-2xs font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">
                    {tSell("categoryModal.stepProgress", { current: currentStep, total: MAX_DEPTH + 1 })}
                  </span>
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider truncate">
                    {navigationPath.length > 0
                      ? (lastNavigationItem ? getName(lastNavigationItem) : levelLabels[0])
                      : levelLabels[0]}
                  </h3>
                </div>
              </div>

              <div className="shrink-0 px-2 py-1 rounded-md bg-background border border-border shadow-xs">
                <span className="text-2xs font-bold text-primary uppercase tracking-tighter">
                  {levelLabels[Math.min(currentStep - 1, levelLabels.length - 1)]}
                </span>
              </div>
            </div>
          )}
        </div>

        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4">
            <CategoryResultsSection
              searchQuery={searchQuery}
              searchResults={searchResults}
              value={value}
              onSelect={onSelect}
              locale={locale}
              compact={false}
              currentCategories={currentCategories}
              getHasChildren={(cat) => getChildren(cat).length > 0}
              onNavigate={handleNavigate}
              gridClassName="grid grid-cols-2 gap-3"
            />
          </div>
        </ScrollArea>
      </div>
    )
  }

  return (
    <div className="flex h-(--spacing-scroll-lg)">
      <div className="w-48 border-r bg-surface-subtle">
        <ScrollArea className="h-full">
          <div className="p-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveL1(cat)}
                className={cat.id === activeL1?.id
                  ? "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors bg-selected text-primary font-medium"
                  : "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors text-foreground hover:bg-hover"}
              >
                <span className="truncate">{getName(cat)}</span>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="px-3 py-2 border-b">
          <CategorySearchInput value={searchQuery} onChange={setSearchQuery} compact />
        </div>

        <ScrollArea className="flex-1">
          <div className="p-3">
            <CategoryResultsSection
              searchQuery={searchQuery}
              searchResults={searchResults}
              value={value}
              onSelect={onSelect}
              locale={locale}
              compact
              currentCategories={currentCategories}
              getHasChildren={(cat) => getChildren(cat).length > 0}
              onNavigate={handleDesktopNavigate}
              gridClassName="grid grid-cols-3 gap-2"
            />
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
