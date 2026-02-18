import { Check, ChevronRight as CaretRight, Folder as FolderSimple, Search as MagnifyingGlass } from "lucide-react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import type { Category, CategoryPathItem } from "../../_lib/types"
import type { FlatCategory } from "./category-selector.types"

export function CategorySearchInput({
  value,
  onChange,
  compact = false,
}: {
  value: string
  onChange: (val: string) => void
  compact?: boolean
}) {
  const tSell = useTranslations("Sell")

  return (
    <div className="relative">
      <MagnifyingGlass
        className={cn(
          "absolute top-1/2 -translate-y-1/2 text-muted-foreground",
          compact ? "left-2.5 size-4" : "left-3.5 size-5 text-muted-foreground"
        )}
      />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={compact ? tSell("categoryModal.searchPlaceholderCompact") : tSell("categoryModal.searchPlaceholder")}
        className={cn(
          compact
            ? "pl-9 h-9 text-sm"
            : "pl-11 h-12 text-base font-medium rounded-md border-border bg-muted focus:bg-background transition-colors"
        )}
      />
    </div>
  )
}

export function CategoryEmptyState({ compact = false }: { compact?: boolean }) {
  const tSell = useTranslations("Sell")

  if (compact) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <p className="text-sm">
          {tSell("categoryModal.noResultsCompact")}
        </p>
      </div>
    )
  }

  return (
    <div className="py-12 text-center">
      <div className="size-16 rounded-full bg-surface-subtle flex items-center justify-center mx-auto mb-4">
        <MagnifyingGlass className="size-8 text-muted-foreground" />
      </div>
      <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
        {tSell("categoryModal.noResults")}
      </p>
    </div>
  )
}

export function CategorySearchResults({
  results,
  selectedValue,
  onSelect,
  locale,
  compact = false,
}: {
  results: FlatCategory[]
  selectedValue: string
  onSelect: (cat: FlatCategory) => void
  locale: string
  compact?: boolean
}) {
  const getName = (cat: FlatCategory) =>
    locale === "bg" && cat.name_bg ? cat.name_bg : cat.name

  if (compact) {
    return (
      <div className="space-y-1">
        {results.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat)}
            className={cn(
              "w-full flex flex-col items-start gap-0.5 px-3 py-2 rounded-md text-left transition-colors",
              "hover:bg-hover",
              selectedValue === cat.id && "bg-selected"
            )}
          >
            <span className="text-sm font-medium">{getName(cat)}</span>
            <span className="text-xs text-muted-foreground truncate w-full">
              {cat.fullPath}
            </span>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-2">
      {results.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onSelect(cat)}
          className={cn(
            "w-full flex flex-col items-start gap-0.5 px-4 py-2.5 rounded-md border text-left transition-colors",
            selectedValue === cat.id
              ? "border-selected-border bg-selected shadow-xs"
              : "border-border bg-background hover:border-hover-border"
          )}
        >
          <span className="text-sm font-bold text-foreground">{getName(cat)}</span>
          <span className="text-2xs font-bold text-muted-foreground uppercase tracking-wider truncate w-full">
            {cat.fullPath}
          </span>
        </button>
      ))}
    </div>
  )
}

export interface CategoryCardProps {
  category: Category
  isSelected: boolean
  hasChildren: boolean
  onClick: () => void
  locale: string
}

export function CategoryCard({
  category,
  isSelected,
  hasChildren,
  onClick,
  locale,
}: CategoryCardProps) {
  const name = locale === "bg" && category.name_bg ? category.name_bg : category.name

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex items-center justify-between gap-3 w-full px-4 py-2.5 rounded-md border text-left transition-colors min-h-12 touch-manipulation",
        "hover:border-hover-border active:bg-active",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
        isSelected
          ? "border-selected-border bg-selected shadow-xs"
          : "border-border bg-background shadow-xs"
      )}
    >
      <span className="text-sm font-bold text-foreground line-clamp-2 flex-1 leading-tight">
        {name}
      </span>
      <div className="shrink-0">
        {hasChildren ? (
          <div className="size-5 rounded-full bg-surface-subtle flex items-center justify-center">
            <CaretRight className="size-3 text-muted-foreground" />
          </div>
        ) : isSelected ? (
          <div className="size-5 rounded-full bg-primary flex items-center justify-center">
            <Check className="size-2.5 text-primary-foreground" />
          </div>
        ) : (
          <div className="size-5 rounded-full border border-border-subtle" />
        )}
      </div>
    </button>
  )
}

export function toPathItem(cat: Category): CategoryPathItem {
  return {
    id: cat.id,
    name: cat.name,
    name_bg: cat.name_bg ?? null,
    slug: cat.slug,
  }
}

export { CaretRight, FolderSimple }
