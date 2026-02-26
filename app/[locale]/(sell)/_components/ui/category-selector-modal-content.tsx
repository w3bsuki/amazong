import { useCallback, useEffect, useMemo, useState } from "react"
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

type MobileStep = "root" | "leaf"

function getLocalizedName(locale: string, category: { name: string; name_bg?: string | null }) {
  return locale === "bg" && category.name_bg ? category.name_bg : category.name
}

function buildLeafFlatCategory(params: {
  root: Category
  leaf: Category
  locale: string
}): FlatCategory {
  const { root, leaf, locale } = params
  const path = [toPathItem(root), toPathItem(leaf)]

  return {
    ...leaf,
    path,
    fullPath: path.map((item) => getLocalizedName(locale, item)).join(" › "),
    searchText: `${root.name} ${root.name_bg || ""} ${root.slug} ${leaf.name} ${leaf.name_bg || ""} ${leaf.slug}`.toLowerCase(),
  }
}

function buildRootFlatCategory(params: {
  root: Category
  locale: string
}): FlatCategory {
  const { root, locale } = params
  const path = [toPathItem(root)]

  return {
    ...root,
    path,
    fullPath: getLocalizedName(locale, root),
    searchText: `${root.name} ${root.name_bg || ""} ${root.slug}`.toLowerCase(),
  }
}

function resolveInitialRootId(params: {
  categories: Category[]
  flatCategories: FlatCategory[]
  value: string
}): string | null {
  const { categories, flatCategories, value } = params
  const selectedFlat = flatCategories.find((entry) => entry.id === value)
  if (selectedFlat?.path[0]?.id) {
    return selectedFlat.path[0].id
  }
  return categories[0]?.id ?? null
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
  const [mobileStep, setMobileStep] = useState<MobileStep>("root")
  const [activeRootId, setActiveRootId] = useState<string | null>(() =>
    resolveInitialRootId({ categories, flatCategories, value })
  )

  const tSell = useTranslations("Sell")
  const tCommon = useTranslations("Common")

  const selectedFlat = useMemo(
    () => flatCategories.find((entry) => entry.id === value) ?? null,
    [flatCategories, value]
  )

  useEffect(() => {
    const nextRootId = resolveInitialRootId({ categories, flatCategories, value })
    if (nextRootId && nextRootId !== activeRootId) {
      setActiveRootId(nextRootId)
    }
    if (selectedFlat && selectedFlat.path.length >= 2) {
      setMobileStep("leaf")
    } else if (!selectedFlat) {
      setMobileStep("root")
    }
  }, [categories, flatCategories, value, selectedFlat, activeRootId])

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const query = searchQuery.toLowerCase()
    return flatCategories
      .filter((cat) => cat.searchText.includes(query))
      .slice(0, 12)
  }, [flatCategories, searchQuery])

  const activeRoot = useMemo(() => {
    if (categories.length === 0) return null
    if (!activeRootId) return categories[0] ?? null
    return categories.find((category) => category.id === activeRootId) ?? categories[0] ?? null
  }, [categories, activeRootId])

  const rootCategories = categories
  const leafCategories = activeRoot?.children ?? []

  const levelLabels = useMemo(
    () => [
      tSell("categoryModal.levelLabel", { level: 1 }),
      tSell("categoryModal.levelLabel", { level: 2 }),
    ],
    [tSell]
  )

  const handleSearchSelect = useCallback(
    (cat: FlatCategory) => {
      onSelect(cat)
    },
    [onSelect]
  )

  const handleRootSelect = useCallback(
    (root: Category) => {
      setActiveRootId(root.id)

      const hasLeaves = (root.children?.length ?? 0) > 0
      if (hasLeaves) {
        if (isMobile) {
          setMobileStep("leaf")
        }
        return
      }

      const flatRoot =
        flatCategories.find((entry) => entry.id === root.id) ??
        buildRootFlatCategory({ root, locale })

      onSelect(flatRoot)
    },
    [flatCategories, isMobile, locale, onSelect]
  )

  const handleLeafSelect = useCallback(
    (leaf: Category) => {
      if (!activeRoot) return

      const flatLeaf =
        flatCategories.find(
          (entry) =>
            entry.id === leaf.id &&
            entry.path.length >= 2 &&
            entry.path[0]?.id === activeRoot.id
        ) ?? buildLeafFlatCategory({ root: activeRoot, leaf, locale })

      onSelect(flatLeaf)
    },
    [activeRoot, flatCategories, locale, onSelect]
  )

  if (isMobile) {
    const showingSearch = Boolean(searchQuery.trim())
    const currentStep = mobileStep === "root" ? 1 : 2
    const activeRootName = activeRoot ? getLocalizedName(locale, activeRoot) : levelLabels[0]

    const renderMobileContent = () => {
      if (showingSearch) {
        if (searchResults.length === 0) {
          return <CategoryEmptyState />
        }

        return (
          <CategorySearchResults
            results={searchResults}
            selectedValue={value}
            onSelect={handleSearchSelect}
            locale={locale}
          />
        )
      }

      if (mobileStep === "root") {
        return (
          <div className="grid grid-cols-2 gap-3">
            {rootCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                isSelected={activeRoot?.id === category.id}
                hasChildren={(category.children?.length ?? 0) > 0}
                onClick={() => handleRootSelect(category)}
                locale={locale}
              />
            ))}
          </div>
        )
      }

      if (leafCategories.length > 0) {
        return (
          <div className="grid grid-cols-2 gap-3">
            {leafCategories.map((leaf) => (
              <CategoryCard
                key={leaf.id}
                category={leaf}
                isSelected={value === leaf.id}
                hasChildren={false}
                onClick={() => handleLeafSelect(leaf)}
                locale={locale}
              />
            ))}
          </div>
        )
      }

      return <CategoryEmptyState />
    }

    return (
      <div className="flex flex-col min-h-0 flex-1 bg-background">
        <div className="flex flex-col border-b border-border-subtle bg-background shrink-0">
          <div className="px-4 py-3">
            <CategorySearchInput value={searchQuery} onChange={setSearchQuery} />
          </div>

          {!showingSearch && (
            <div className="px-4 py-2.5 bg-surface-subtle flex items-center justify-between gap-4 border-t border-border-subtle">
              <div className="flex items-center gap-3 min-w-0">
                {mobileStep === "leaf" ? (
                  <button
                    type="button"
                    onClick={() => setMobileStep("root")}
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
                    {tSell("categoryModal.stepProgress", { current: currentStep, total: 2 })}
                  </span>
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider truncate">
                    {mobileStep === "leaf" ? activeRootName : levelLabels[0]}
                  </h3>
                </div>
              </div>

              <div className="shrink-0 px-2 py-1 rounded-md bg-background border border-border shadow-xs">
                <span className="text-2xs font-bold text-primary uppercase tracking-tighter">
                  {levelLabels[currentStep - 1]}
                </span>
              </div>
            </div>
          )}
        </div>

        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4">
            {renderMobileContent()}
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
            {rootCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveRootId(category.id)}
                className={category.id === activeRoot?.id
                  ? "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors bg-selected text-primary font-medium"
                  : "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors text-foreground hover:bg-hover"}
              >
                <span className="truncate">{getLocalizedName(locale, category)}</span>
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
            {searchQuery.trim() ? (
              searchResults.length === 0 ? (
                <CategoryEmptyState compact />
              ) : (
                <CategorySearchResults
                  results={searchResults}
                  selectedValue={value}
                  onSelect={handleSearchSelect}
                  locale={locale}
                  compact
                />
              )
            ) : leafCategories.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {leafCategories.map((leaf) => (
                  <CategoryCard
                    key={leaf.id}
                    category={leaf}
                    isSelected={value === leaf.id}
                    hasChildren={false}
                    onClick={() => handleLeafSelect(leaf)}
                    locale={locale}
                  />
                ))}
              </div>
            ) : (
              <CategoryEmptyState compact />
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
